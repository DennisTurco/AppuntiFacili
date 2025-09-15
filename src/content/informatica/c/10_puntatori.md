---
title: "Puntatori"
draft: false
lastUpdateDate: "2025-08-28"
subject: "C"
category: "Informatica"
tags: ["c", "programmazione", "puntatori", "difficile"]
author: "Dennis Turco"
videoLesson: false
---

## 1. Puntatori

```c
int altezza = 30;

printf("%d", altezza);  // output -> 30
printf("%p", &altezza); // output -> indirizzo di memoria di altezza (0x7ffe5367e044)
```

Un Puntatore è una variabile che salva l'indirizzo di memoria di un'altra variabile come suo valore.

Una variabile puntatore punta ad un tipo di dato (come `int`) dello stesso tipo e viene creato con l'operatore `*`.

### 1.1 Esempio di puntatore

```c
int altezza = 30;

// variabile puntatore di nome ptrA che contene l'indirizzo di mememoria
// della variabile altezza
int* ptr = &altezza;

printf("%d\n", altezza);  // output -> 30
printf("%p\n", &altezza); // output -> indirizzo di memoria di altezza (0x7ffe5367e044)
printf("%p\n", ptr);      // output -> indirizzo di memoria di altezza (0x7ffe5367e044)
printf("%d\n", *ptr);     // output -> valore di altezza (30)
```

## 2. Puntatori e Array

In C, un **array** è una collezione di elementi dello stesso tipo memorizzati in locazioni di memoria contigue. Quando si utilizza il nome dell'array in un'espressione, esso viene automaticamente convertito in un **puntatore al primo elemento dell'array**.

### 2.1 Esempio

```c
int numeri[] = {10, 20, 30, 40, 50};

printf("%p\n", numeri);     // indirizzo del primo elemento dell'array
printf("%p\n", &numeri[0]); // stesso indirizzo del primo elemento
printf("%d\n", *numeri);    // valore del primo elemento (10)
```

In questo esempio:

- `numeri` è un puntatore implicito a `&numeri[0]`
- `numeri` accede al valore del primo elemento (cioè 10)

Puoi anche accedere agli altri elementi usando l'aritmetica dei puntatori:

```c
printf("%d\n", *(numeri + 1)); // output -> 20
printf("%d\n", *(numeri + 2)); // output -> 30
```

### 2.2 Accesso agli elementi con il puntatore

```c
int* ptr = numeri;

printf("%d\n", *(ptr + 3)); // output -> 40
```

## 3. Puntatori e Cicli

Spesso si usano i puntatori per scorrere un array:

```c
int numeri[] = {1, 2, 3, 4, 5};
int* ptr = numeri;

for (int i = 0; i < 5; i++) {
    printf("%d ", *(ptr + i));
}
// Output: 1 2 3 4 5
```

Oppure si può usare il puntatore direttamente nel ciclo:

```c
int* end = numeri + 5;

for (int* p = numeri; p < end; p++) {
    printf("%d ", *p);
}
```

## 4. Puntatori e Funzioni

Puoi passare un array a una funzione come puntatore:

```c
void stampaArray(int* arr, int lunghezza) {
    for (int i = 0; i < lunghezza; i++) {
        printf("%d ", arr[i]);
    }
}

int main() {
    int dati[] = {100, 200, 300};
    stampaArray(dati, 3);
    return 0;
}

```

## 5. Esercizi

[Codegrind - Formazione digitale a 360°](https://www.codegrind.it/esercizi/c/pointer)
