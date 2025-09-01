---
title: "Struct"
draft: false
lastUpdateDate: "2025-08-27"
subject: "C"
category: "Informatica"
tags: ["c", "programmazione", "struct", "medio"]
author: "Dennis Turco"
videoLesson: false
---

## 0️⃣ Link utili

[C Structures (structs)](https://www.w3schools.com/c/c_structs.php#)

## 1️⃣ Struct

Le strutture (chiamate anche struct) sono un modo per raggruppare diverse variabili correlate in un unico posto. Ogni variabile nella struttura è nota come **membro** della struttura.

A differenza di un array , una struttura può contenere molti tipi di dati diversi (int, float, char, ecc.).

> Nota: possibile anche creare array (vettori) di strutture, come vedremo più avanti.

```c
struct libro { // dichiarazione della struct
  char titolo[100]; // membro (tipo stringa)
  char autore[50];  // membro (tipo stringa)
  int anno_pubblicazione;  // membro (tipo int)
  float prezzo;  // membro (tipo float)
};  // fine della struct
```

Per accedere alla struttura è necessario crearne una variabile.

Utilizzare la `struct`parola chiave all'interno del `main()`metodo, seguita dal nome della struttura e quindi dal nome della variabile di struttura:

`struct nome_struct nome_variabile;`

dove:

- `nome_struct` indica il nome della struct che abbiamo dichiarato, nell'esempio precedente si chiama “libro”.
- `nome_variabile` nome definito dall'utente.

```c
struct libro {
  char titolo[100];
  char autore[50];
  int anno_pubblicazione;
  float prezzo;
};

int main() {
    struct libro l;
}
```

## 2️⃣ Accedere ai campi

per accedere ai campi (variabili) interne si usa il simbolo `.`

```c
// dichiarazione della struct
struct libro {
  char titolo[100];
  char autore[50];
  int anno_pubblicazione;
  float prezzo;
};

int main() {
    // dichiarazione dell'oggetto della struct
    struct libro s;

    // accesso ad un campo della struct
    s.titolo = "Diario di Jorge";

    // stampa il titolo del libro
    printf ("%s \n", s.titolo); //output: Diario di Jorge

    return 0;
}
```

## 3️⃣ Passare una struct ad una funzione

In questo esempio la funzione “func” stampa gli elementi di una struct attraverso un puntatore alla struttura presa come paramentro.

```c
#include <stdio.h>
#include <string.h>

struct student {
    int id;
    char name[20];
    float percentage;
};

void func(struct student *record) {
    printf(" Id is: %d \n", record->id);
    printf(" Name is: %s \n", record->name);
    printf(" Percentage is: %f \n", record->percentage);
}

int main() {
    struct student record;

    record.id=1;
    strcpy(record.name, "Raju");
    record.percentage = 86.5;

    func(&record);
    return 0;
}
```

## 📑 Esercizi

### Esercizio 1

realizzare una struct “classe” con 2 metodi:

- char nome[2];
- int alunni;

che chiede all'utente l'inserimento dei campi della struct e ne stampi il contenuto.

<details>
<summary>💡 Mostra soluzione</summary>

```c
#include <stdio.h>

struct classe {
    char nome[2];
    int alunni;
};

int main() {

    struct classe s;

    // inserimento
    printf("Inserisci il nome della classe (1A, 2B..): ");
    scanf("%s", s[i].nome);
    printf("Inserisci il numero di alunni: ");
    scanf("%d", &s[i].alunni);
    printf("\n");

    // stampa
    printf("Nome della classe: %s\n", s[i].nome);
    printf("Numero alunni: %d\n", s[i].alunni);
    printf("\n");

    return 0;
}
```

</details>

## Esercizio 2

realizzare una struct “classe” con 2 metodi:

- char nome[2];
- int alunni;

che chiede all'utente l'inserimento dei campi della struct e ne stampi il contenuto.
*Nota*: utilizzare un array di struct (es. `struct classe s[size];` con size grandezza arbitraria).
<details>
<summary>💡 Mostra soluzione</summary>

```c
#include <stdio.h>

struct classe {
    char nome[2];
    int alunni;
};

int main() {
    int size = 3;

    struct classe s[size];

    // inserimento
    for (int i=0; i<size; i++) {
        printf("Inserisci il nome della classe (1A, 2B..): ");
        scanf("%s", s[i].nome);
        printf("Inserisci il numero di alunni: ");
        scanf("%d", &s[i].alunni);

        printf("\n");
    }

    // stampa
    for (int i=0; i<size; i++) {
        printf("Nome della classe: %s\n", s[i].nome);
        printf("Numero alunni: %d\n", s[i].alunni);

        printf("\n");
    }

    return 0;
}
```

</details>

## Esercizio 3

come l'esercizio presedente, ma in più aggiungere la funzione “ordinamento” che ordina gli elementi della struct in base al campo “alunni”, l'obbiettivo è quello di ottenere la stampa ordinata in ordine crescente

<details>
<summary>💡 Mostra soluzione</summary>

```c
#include <stdio.h>
#include <string.h>

struct classe {
    char nome[2];
    int alunni;
};

void inserimento(struct classe *s, int size) {
    for (int i=0; i<size; i++) {
        printf("Inserisci il nome della classe (1A, 2B..): ");
        scanf("%s", s[i].nome);
        printf("Inserisci il numero di alunni: ");
        scanf("%d", &s[i].alunni);

        printf("\n");
    }
}

void stampa(struct classe *s, int size) {
    for (int i=0; i<size; i++) {
        printf("Nome della classe: %s\n", s[i].nome);
        printf("Numero alunni: %d\n", s[i].alunni);

        printf("\n");
    }
}

void ordinamento(struct classe *s, int size) {
    int temp;
    char temp_nome[2];
    for (int i=0; i<size; i++) {
        for (int j=i+1; j<size; j++) {
            if (s[i].alunni > s[j].alunni) {
                temp = s[i].alunni;
                s[i].alunni = s[j].alunni;
                s[j].alunni = temp;

                strcpy(temp_nome, s[i].nome);
                strcpy(s[i].nome, s[j].nome);
                strcpy(s[j].nome, temp_nome);
            }
        }
    }
}

int main() {
    int size = 3;

    struct classe s[size];

    // inserimento
    inserimento(&s, size);

    // ordinamento
    ordinamento(&s, size);

    // stampa
    stampa(&s, size);

    return 0;
}
```

</details>
