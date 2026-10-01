using System.Reflection;
using System.Runtime.InteropServices.JavaScript;
using System.Text;
using System.Text.Json;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Text;

/// <summary>
/// Compila ed esegue il codice C# dello studente.
/// Esposto a JavaScript (vedi src/scripts/runners/csharp.worker.ts).
/// </summary>
public static partial class Runner
{
    // Assembly del framework usate come riferimenti per la compilazione:
    // devono corrispondere ai TrimmerRootAssembly del .csproj.
    private static readonly string[] ReferenceAssemblies =
    [
        "System.Private.CoreLib",
        "System.Runtime",
        "System.Console",
        "System.Collections",
        "System.Collections.Concurrent",
        "System.Collections.Immutable",
        "System.Linq",
        "System.Linq.Expressions",
        "System.Linq.Queryable",
        "System.Text.RegularExpressions",
        "System.Text.Json",
        "System.Memory",
        "System.Runtime.Numerics",
        "System.Threading",
        "System.Threading.Tasks",
        "System.ComponentModel.Primitives",
        "System.ObjectModel",
    ];

    // Gli stessi "using" impliciti di un progetto console moderno (ImplicitUsings)
    private const string GlobalUsings = """
        global using System;
        global using System.Collections.Generic;
        global using System.IO;
        global using System.Linq;
        global using System.Threading;
        global using System.Threading.Tasks;
        """;

    private static readonly List<MetadataReference> References = [];
    private static readonly CSharpParseOptions ParseOptions = new(LanguageVersion.Latest);

    public static void Main() { }

    [JSExport]
    public static string[] GetReferenceNames() => ReferenceAssemblies;

    [JSExport]
    public static void AddReference(string name, byte[] image) =>
        References.Add(MetadataReference.CreateFromImage(image, filePath: name + ".dll"));

    [JSImport("write", "runner")]
    private static partial void Write(string text, bool isError);

    /// <summary>
    /// Compila ed esegue <paramref name="code"/>. L'output viene inviato a JS man mano
    /// (Write); il valore restituito è un JSON con esito ed eventuali errori di compilazione.
    /// </summary>
    [JSExport]
    public static async Task<string> Run(string code, string stdin)
    {
        var tree = NormalizeTopLevel(CSharpSyntaxTree.ParseText(SourceText.From(code, Encoding.UTF8), ParseOptions, path: "Program.cs"));
        var usings = CSharpSyntaxTree.ParseText(SourceText.From(GlobalUsings, Encoding.UTF8), ParseOptions, path: "GlobalUsings.cs");

        var compilation = CSharpCompilation.Create(
            "Program",
            [usings, tree],
            References,
            new CSharpCompilationOptions(
                OutputKind.ConsoleApplication,
                optimizationLevel: OptimizationLevel.Debug,
                nullableContextOptions: NullableContextOptions.Enable,
                allowUnsafe: true,
                // WebAssembly è single-thread: la compilazione parallela si bloccherebbe
                concurrentBuild: false));

        using var peStream = new MemoryStream();
        var emit = compilation.Emit(peStream);

        // Solo dichiarazioni (classi, interfacce...) senza istruzioni né Main: si compila come
        // libreria, così lo studente vede comunque se il codice è corretto
        if (!emit.Success && emit.Diagnostics.Any(d => d.Id == "CS5001"))
        {
            var library = compilation.WithOptions(compilation.Options.WithOutputKind(OutputKind.DynamicallyLinkedLibrary));
            using var libraryStream = new MemoryStream();
            var libraryEmit = library.Emit(libraryStream);
            if (libraryEmit.Success)
                return JsonSerializer.Serialize(new RunResult(true, [], 0, LibraryOnly: true), RunnerJson.Default.RunResult);
            emit = libraryEmit;
        }

        if (!emit.Success)
        {
            var errors = emit.Diagnostics
                .Where(d => d.Severity == DiagnosticSeverity.Error)
                .Select(d =>
                {
                    // "mapped": tiene conto delle direttive #line inserite da NormalizeTopLevel
                    var span = d.Location.GetMappedLineSpan();
                    return new CompileError(
                        span.StartLinePosition.Line + 1,
                        span.StartLinePosition.Character + 1,
                        d.Id,
                        d.GetMessage(System.Globalization.CultureInfo.InvariantCulture));
                })
                .ToArray();
            return JsonSerializer.Serialize(new RunResult(false, errors, null), RunnerJson.Default.RunResult);
        }

        var entrySymbol = compilation.GetEntryPoint(CancellationToken.None);
        if (entrySymbol is null)
        {
            return JsonSerializer.Serialize(
                new RunResult(false, [new CompileError(1, 1, "CS5001", "Il programma non contiene un metodo Main.")], null),
                RunnerJson.Default.RunResult);
        }

        var stdout = new StreamingWriter(false);
        var stderr = new StreamingWriter(true);
        var originalOut = Console.Out;
        var originalErr = Console.Error;
        Console.SetOut(stdout);
        Console.SetError(stderr);
        // Console.In non è leggibile nel browser (PlatformNotSupported), ma SetIn sì
        Console.SetIn(new EchoReader(new StringReader(stdin), stdout));

        int? exitCode = 0;
        try
        {
            var assembly = Assembly.Load(peStream.ToArray());
            var type = assembly.GetType(MetadataName(entrySymbol.ContainingType), throwOnError: true)!;
            var method = type.GetMethod(
                entrySymbol.MetadataName,
                BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic)!;

            object?[]? args = method.GetParameters().Length == 1 ? [Array.Empty<string>()] : null;
            var result = method.Invoke(null, args);

            // async Main: si attende il Task invece di bloccare il thread (WebAssembly è single-thread)
            if (result is Task task)
            {
                await task;
                result = task.GetType().IsGenericType ? task.GetType().GetProperty("Result")?.GetValue(task) : null;
            }
            if (result is int code0) exitCode = code0;
        }
        catch (Exception ex)
        {
            var inner = ex is TargetInvocationException { InnerException: { } ie } ? ie : ex;
            stderr.Write($"Unhandled exception. {inner.GetType().FullName}: {inner.Message}\n");
            var trace = CleanStackTrace(inner.StackTrace);
            if (trace.Length > 0) stderr.Write(trace + "\n");
            exitCode = null;
        }
        finally
        {
            stdout.Flush();
            stderr.Flush();
            Console.SetOut(originalOut);
            Console.SetError(originalErr);
        }

        return JsonSerializer.Serialize(new RunResult(true, [], exitCode), RunnerJson.Default.RunResult);
    }

    private static readonly SyntaxKind[] AccessModifiers =
        [SyntaxKind.PublicKeyword, SyntaxKind.PrivateKeyword, SyntaxKind.InternalKeyword, SyntaxKind.ProtectedKeyword];

    /// <summary>
    /// Negli esempi delle lezioni capita spesso di dichiarare prima le classi e poi le istruzioni,
    /// o di scrivere <c>public static void Metodo()</c> fuori da una classe: in un file con
    /// top-level statements sono errori (CS8803, CS0106). Qui si riordina il codice
    /// (istruzioni prima, tipi dopo) e si tolgono i modificatori di accesso dalle funzioni
    /// locali. Le direttive #line mantengono i numeri di riga originali negli errori.
    /// </summary>
    private static SyntaxTree NormalizeTopLevel(SyntaxTree tree)
    {
        var root = tree.GetCompilationUnitRoot();
        var members = root.Members;
        var statements = members.OfType<GlobalStatementSyntax>().ToList();
        if (statements.Count == 0) return tree;

        var firstType = members.IndexOf(m => m is not GlobalStatementSyntax);
        var outOfOrder = firstType >= 0 && members.Skip(firstType).Any(m => m is GlobalStatementSyntax);
        var withModifiers = statements.Any(g =>
            g.Statement is LocalFunctionStatementSyntax f && f.Modifiers.Any(m => AccessModifiers.Contains(m.Kind())));
        if (!outOfOrder && !withModifiers) return tree;

        var text = tree.GetText();
        var source = new StringBuilder();

        // Ogni nodo viene copiato dall'inizio della sua riga, così anche le colonne restano uguali
        void Append(SyntaxNode node, IEnumerable<SyntaxToken> blank)
        {
            var line = text.Lines.GetLineFromPosition(node.SpanStart);
            var chunk = text.ToString(TextSpan.FromBounds(line.Start, node.Span.End)).ToCharArray();
            foreach (var token in blank)
                for (var i = token.SpanStart - line.Start; i < token.Span.End - line.Start; i++) chunk[i] = ' ';
            source.Append("#line ").Append(line.LineNumber + 1).Append(" \"Program.cs\"\n");
            source.Append(chunk).Append('\n');
        }

        foreach (var directive in root.Externs) Append(directive, []);
        foreach (var directive in root.Usings) Append(directive, []);
        foreach (var attributes in root.AttributeLists) Append(attributes, []);
        foreach (var statement in statements)
        {
            var modifiers = statement.Statement is LocalFunctionStatementSyntax f
                ? f.Modifiers.Where(m => AccessModifiers.Contains(m.Kind()))
                : [];
            Append(statement, modifiers);
        }
        foreach (var member in members.Where(m => m is not GlobalStatementSyntax)) Append(member, []);

        return CSharpSyntaxTree.ParseText(SourceText.From(source.ToString(), Encoding.UTF8), ParseOptions, path: "Program.cs");
    }

    private static string MetadataName(INamedTypeSymbol type)
    {
        var name = type.MetadataName;
        for (var outer = type.ContainingType; outer is not null; outer = outer.ContainingType)
            name = outer.MetadataName + "+" + name;
        var ns = type.ContainingNamespace;
        return ns is null || ns.IsGlobalNamespace ? name : ns.ToDisplayString() + "." + name;
    }

    // Toglie dallo stack trace le righe interne del runner e della reflection
    private static string CleanStackTrace(string? trace) =>
        string.Join('\n', (trace ?? "")
            .Split('\n')
            .Select(l => l.TrimEnd())
            .TakeWhile(l => !l.Contains("System.Reflection.") && !l.Contains("Runner.Run")));

    /// <summary>Mostra nell'output le righe lette da Console.ReadLine, come in un terminale.</summary>
    private sealed class EchoReader(TextReader inner, TextWriter echo) : TextReader
    {
        public override int Peek() => inner.Peek();
        public override int Read() => inner.Read();

        public override string? ReadLine()
        {
            var line = inner.ReadLine();
            if (line is not null) echo.Write(line + "\n");
            return line;
        }
    }

    /// <summary>Inoltra l'output a JS riga per riga (così si vede anche se il programma non termina).</summary>
    private sealed class StreamingWriter(bool isError) : TextWriter
    {
        private readonly StringBuilder _buffer = new();
        public override Encoding Encoding => Encoding.UTF8;

        public override void Write(char value)
        {
            _buffer.Append(value);
            if (value == '\n' || _buffer.Length >= 4096) Flush();
        }

        public override void Write(string? value)
        {
            if (string.IsNullOrEmpty(value)) return;
            _buffer.Append(value);
            if (value.Contains('\n') || _buffer.Length >= 4096) Flush();
        }

        public override void Flush()
        {
            if (_buffer.Length == 0) return;
            Runner.Write(_buffer.ToString(), isError);
            _buffer.Clear();
        }
    }
}

public sealed record CompileError(int Line, int Column, string Id, string Message);

public sealed record RunResult(bool Compiled, CompileError[] Errors, int? ExitCode, bool LibraryOnly = false);

[System.Text.Json.Serialization.JsonSourceGenerationOptions(PropertyNamingPolicy = System.Text.Json.Serialization.JsonKnownNamingPolicy.CamelCase)]
[System.Text.Json.Serialization.JsonSerializable(typeof(RunResult))]
internal sealed partial class RunnerJson : System.Text.Json.Serialization.JsonSerializerContext;
