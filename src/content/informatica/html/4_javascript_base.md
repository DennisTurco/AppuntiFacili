---
title: "Javascript Base"
order: 4
draft: false
lastUpdateDate: "2025-12-15"
subject: "HTML"
category: "Informatica"
difficulty: "medio"
tags: ["javascript", "css", "html", "programmazione"]
author: "Dennis Turco"
videoLesson: false
---

## 1. Introduzione

JavaScript serve rendere interattive le pagine web, manipolando il DOM, gestendo eventi.

## 2. Integrazione in HTML

In tutti i casi generalmente si inserisce in fondo al body del file HTML prima della chiusura.

### 2.1 Interno

```html
<script>
  console.log("Hello World");
</script>
```

### 2.2 Esterno

```html
<script src="script.js"></script>
```

## 3. Alert e Console

- `alert()`: mostra un popup all'utente.
  
  ```javascript
  alert("Hello World!!");
  ```

- `console.log()`: stapa informazioni nella console del browser (utile per il debug).
  
  ```javascript
  console.log("Messaggio nella console");
  ```

## 4. Prompt e Confirm

- `prompt()`: chiede all'utente di inserire un valore.
  
  ```javascript
  let nome = prompt("Come ti chiami?");
  console.log("Ciao " + nome);
  ```

- `confirm()`: chiede conferma (Ok / Annulla), ritorna `true` o `false`

  ```javascript
  if (confirm("Vuoi continuare?")) {
    console.log("Utente ha confermato");
  } else {
    console.log("Utente ha annullato");
  }
  ```

## 5. Gestione eventi con onclick

Funzioni che vengono invocate quando l'utente clicca un elemento

Esempio:

```html
<button id="bottone"> Cliccami </button>
```

```javascript
function saluta() {
  alert("Ciao!");
}

document.getElementById("bottone").onclick = saluta;
```

- `document.getElementById("bottone")`: seleziona l'elemento con id="bottone"
- `.onclick`: assegna una funzione all'evento click


## 6. typeof

`typeof` serve a sapere il tipo di una variabile.

Esempi:

```javascript
let numero = 10;
let testo = "Hello World";
let vero = true;

console.log(typeof numero); // "number"
console.log(typeof testo);  // "string"
console.log(typeof vero);   // "boolean"
```


## 7. Esempi

### 7.1 Esempio Base

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>Esempio Javascript</title>
</head>
<body>

<h1>Esempio con JS</header>

<button onclick="Saluto()"> Saluta </button>
<button onclick="Prompt()"> Prompt </button>
<button onclick="Conferma()"> Conferma </button>

<p id="output"></p>

<script>
  console.log("Pagina caricata");

  function Saluto() {
    alert("Ciao!");

    document.getElementById("output").innerHTML = "L'utente ha salutato."
  }

  function Prompt() {
    let nome = prompt("Come ti chiami?");
    console.log("Ciao " + nome);

    document.getElementById("output").innerHTML = "L'utente ha inserito qualcosa."
  }

  function Conferma() {
    if (confirm("Vuoi continuare?")) {
      console.log("Utente ha confermato");
    } else {
      console.log("Utente ha annullato");
    }

    document.getElementById("output").innerHTML = "L'utente ha confermato."
  }

</script>

</body>
</html>
```

### 7.1 Esempio Completo con Form e CSS

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>Esempio Javascript Completo</title>

  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f4f8;
      padding: 20px;
    }

    h1 {
      text-align: center;
    }

    button {
      padding: 10px 20px;
      margin: 5px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    form {
      background-color: white;
      padding: 20px;
      border-radius: 10px;
      max-width: 400px;
      margin: 20px auto;
    }

    input {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
    }

    #output {
      text-align: center;
      font-weight: bold;
    }
  </style>
</head>

<body>

<h1>Esempio con JS, CSS e Form</h1>

<div style="text-align: center;">
  <button onclick="Saluto()">Saluta</button>
  <button onclick="Prompt()">Prompt</button>
  <button onclick="Conferma()">Conferma</button>
</div>

<form id="form" onsubmit="GestioneForm(event)">
  <h2>Modulo di registrazione</h2>

  <label>Nome</label>
  <input type="text" id="nome" required>

  <label>Email</label>
  <input type="email" id="email" required>

  <label>Password</label>
  <input type="password" id="password" required>

  <input type="submit" value="Invia">
</form>

<p id="output"></p>

<script>
  console.log("Pagina caricata");

  function Saluto() {
    alert("Ciao!");
    document.getElementById("output").innerHTML = "L'utente ha salutato.";
  }

  function Prompt() {
    let nome = prompt("Come ti chiami?");
    document.getElementById("output").innerHTML = "Nome inserito: " + nome;
  }

  function Conferma() {
    if (confirm("Vuoi continuare?")) {
      document.getElementById("output").innerHTML = "Utente ha confermato.";
    } else {
      document.getElementById("output").innerHTML = "Utente ha annullato.";
    }
  }

  function GestioneForm(event) {
    event.preventDefault();

    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    console.log(nome, email, password);

    document.getElementById("output").innerHTML = "Form inviato da " + nome;

    event.target.reset();
  }
</script>

</body>
</html>
```