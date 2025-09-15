---
title: "Strings - Funzioni Numeriche"
draft: false
lastUpdateDate: "2025-08-28"
subject: "C"
category: "Informatica"
tags: ["c", "programmazione", "string", "difficile"]
author: "Dennis Turco"
videoLesson: true
---

## 1. Introduzione

Talvolta abbiamo la necessità di convertire una stringa numerica (es: "345") in una variabile numerica. Per fare questo possiamo utilizzare la libreria `string.h`.

Qui elencate le principali funzioni per questo scopo:

- `atoi`
- `atol`
- `atof`
- `strtol`
- `strtoul`
- `strtod`

## 2. atoi — ASCII to Integer

- Descrizione: converte una stringa in un numero intero (`int`).
- Limiti: non gestisce errori. Se la stringa non contiene un numero valido, il risultato è non definito.

Esempio:

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    char s[] = "123";
    int n = atoi(s);
    printf("Numero: %d\n", n); // → 123
    return 0;
}
```

## 2. atol — ASCII to Long

- Descrizione: come `atoi`, ma restituisce un `long int`.

Esempio:

```c
char s[] = "987654321";
long n = atol(s);
// n = 987654321
```

## 3. atof — ASCII to Float

- Descrizione: converte una stringa in un numero reale (`double`).
- Limiti: come `atoi`, non gestisce errori.

```c
char s[] = "3.14";
double x = atof(s);
// x = 3.14
```

## 4. strtol — String to Long

- Descrizione:
  - Converte una stringa in `long int`.
  - Supporta diverse basi numeriche (2–36), oppure 0 (riconosce automaticamente decimale, ottale, esadecimale).
  - `endptr` → se non è `NULL`, memorizza l'indirizzo del primo carattere non convertito.

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    char s[] = "123abc";
    char *rest;
    long n = strtol(s, &rest, 10);

    printf("Numero: %ld\n", n);   // → 123
    printf("Resto: %s\n", rest); // → "abc"
    return 0;
}

```

## 5. strtoul — String to Unsigned Long

- Descrizione: come strtol, ma per numeri senza segno (`unsigned long`).

Esempio:

```c
char s[] = "4294967295";
unsigned long n = strtoul(s, NULL, 10);
// n = 4294967295 (max per 32 bit)
```

## 6. strtod — String to Double

- Descrizione: converte una stringa in double.
- Gestisce numeri decimali e scientifici (1.23e-4).

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    char s[] = "3.14pi";
    char *rest;
    double x = strtod(s, &rest);

    printf("Numero: %f\n", x);   // → 3.140000
    printf("Resto: %s\n", rest); // → "pi"
    return 0;
}
```

## 7. Tabella riassuntiva

| Funzione  | Tipo restituito | Sicurezza | Note                                     |
| --------- | --------------- | --------- | ---------------------------------------- |
| `atoi`    | `int`           | ❌         | Non gestisce errori                      |
| `atol`    | `long int`      | ❌         | Non gestisce errori                      |
| `atof`    | `double`        | ❌         | Non gestisce errori                      |
| `strtol`  | `long int`      | ✅         | Gestisce basi diverse + errori           |
| `strtoul` | `unsigned long` | ✅         | Come `strtol`, ma senza segno            |
| `strtod`  | `double`        | ✅         | Gestisce virgola + notazione scientifica |
