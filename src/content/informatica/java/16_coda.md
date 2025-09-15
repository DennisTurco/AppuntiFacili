---
title: "Coda"
draft: false
lastUpdateDate: "2025-08-27"
subject: "Java"
category: "Informatica"
tags: ["java", "programmazione", "lista", "coda", "strutture dati", "complesso"]
author: "Dennis Turco"
videoLesson: false
---

## 1. Descrizione

![Coda](https://scaler.com/topics/images/working-of-java-queue.gif)

Una **coda** (queue) in Java è una struttura dati che segue il principio FIFO (First-In-First-Out), il che significa che il primo elemento inserito è il primo ad essere rimosso. È simile a una fila di persone in un supermercato: la prima persona che entra è la prima ad essere servita.

In Java, una coda può essere implementata utilizzando diverse strutture dati, tra cui una lista collegata o un'implementazione basata su array.

Operazioni principali:

- **enqueue(elemento)**: Aggiunge un elemento alla fine della coda.
- **dequeue()**: Rimuove e restituisce l'elemento all'inizio della coda.
- **peek()**: Restituisce l'elemento all'inizio della coda senza rimuoverlo.
- **isEmpty()**: Verifica se la coda è vuota.
- **size()**: Restituisce il numero di elementi presenti nella coda.

## 2. Implementazione

In questo esempio implementiamo una la Coda utilizzando una lista.

### 2.1 Classe Nodo

La classe **`Nodo`** rappresenta un elemento fondamentale della lista. Ogni nodo contiene due parti principali:

1. **Info (`info`)**: Questo è il contenuto effettivo del nodo. È il valore che il nodo memorizza o rappresenta.
2. **Link (`link`)**: Questo è un riferimento al prossimo nodo nella lista. Ogni nodo, tranne l'ultimo, punta al nodo successivo. L'ultimo nodo della lista ha il suo link impostato su **`null`**, indicando la fine della lista.

Inoltre, la classe **`Nodo`** fornisce metodi per accedere e modificare questi attributi:

- **`getInfo()`**: Restituisce il valore memorizzato nel nodo.
- **`getLink()`**: Restituisce il riferimento al nodo successivo.
- **`setLink(Nodo link)`**: Imposta il riferimento al nodo successivo.

```java
public class Nodo {
    private int info;
    private Nodo link;

    public Nodo(int info) {
        this.info = info;
        this.link = null;
    }

    public int getInfo() {
        return info;
    }
    public Nodo getLink() {
        return link;
    }
    public void setInfo(int info) {
        this.info = info;
    }
    public void setLink(Nodo link) {
        this.link = link;
    }
}
```

### 2.2 Classe Coda

1. **Classe `Coda`**: Questa classe rappresenta la struttura dati della coda e contiene i metodi per gestire gli elementi all'interno della coda.
2. **Attributi**:
    - **`front`**: È un riferimento al nodo all'inizio della coda.
    - **`end`**: È un riferimento al nodo alla fine della coda.
    - **`dimensione`**: Rappresenta il numero di nodi presenti nella coda.
3. **Costruttore**:
    - Il costruttore inizializza la coda impostando i riferimenti **`front`** e **`end`** a **`null`** e la **`dimensione`** a 0.
4. **Metodo `isEmpty()`**:
    - Questo metodo restituisce **`true`** se la coda è vuota (cioè se **`front`** è **`null`**), altrimenti restituisce **`false`**.
5. **Metodo `enqueue(int info)`**:
    - Questo metodo aggiunge un nuovo nodo alla fine della coda.
    - Crea un nuovo nodo con l'informazione fornita.
    - Se la coda è vuota, imposta sia **`front`** che **`end`** al nuovo nodo.
    - Altrimenti, collega il nuovo nodo al nodo alla fine attuale della coda e aggiorna il riferimento **`end`** al nuovo nodo.
    - Incrementa la dimensione della coda.
6. **Metodo `dequeue()`**:
    - Questo metodo rimuove il nodo all'inizio della coda e restituisce l'informazione contenuta in quel nodo.
    - Se la coda è vuota, viene sollevata un'eccezione (**`IllegalStateException`**).
    - Restituisce l'informazione contenuta nel nodo all'inizio della coda.
    - Rimuove il nodo all'inizio della coda e aggiorna il riferimento **`front`**.
    - Se la coda diventa vuota dopo la rimozione, imposta anche **`end`** a **`null`**.
    - Decrementa la dimensione della coda.
7. **Metodo `peek()`**:
    - Questo metodo restituisce l'informazione contenuta nel nodo all'inizio della coda senza rimuoverlo.
    - Se la coda è vuota, viene sollevata un'eccezione (**`IllegalStateException`**).
8. **Metodo `getDimensione()`**:
    - Questo metodo restituisce la dimensione della coda, cioè il numero di nodi presenti al suo interno.

```java
// FIFO (First-In-First-Out)
public class Coda {
    private Nodo front;     // riferimento all'inizio della coda
    private Nodo end;       // riferimento alla fine della coda
    private int dimensione; // numero di Nodi interni

    public Coda() {
        this.front = null;
        this.end = null;
        this.dimensione = 0;
    }

    // restituisce true se la coda è vuota, false altrimenti
    public boolean isEmpty() {
        return front == null;
    } 

    // aggiunge un nuovo nodo in fondo alla coda
    public void enqueue(int info) {
        Nodo n = new Nodo(info);

        if (isEmpty()) {
            front = n;
        } else {
            end.setLink(n);
        }
        end = n;

        dimensione++;
    }

    // rimuove il Nodo all'inizio della coda e ne ritorna il contenuto
    public int dequeue() {
        if (isEmpty()) {
            throw new IllegalStateException("Errore: la coda e' vuota.");
        }

        int elemento = front.getInfo(); // Salva l'elemento all'inizio della coda
        front = front.getLink();        // Rimuove il nodo all'inizio della coda

        if (front == null) {
            end = null;     // Se la coda diventa vuota, anche il riferimento alla fine viene aggiornato
        }

        dimensione--;

        return elemento;
    }

    // ritorna il contenuto del Nodo all'inizio 
    public int peek() {
        if (isEmpty())
            throw new IllegalStateException("Errore: la coda e' vuota.");

        return front.getInfo();
    }

    public int getDimensione() {
        return dimensione;
    }
}

```

```java
public class Main {
    public static void main(String[] args) {
        Coda coda = new Coda();

        coda.enqueue(1);
        coda.enqueue(2);
        coda.enqueue(3);

        System.out.println("Ottengo valore con peek: ");
        System.out.println(coda.peek());

        coda.enqueue(5);

        // pop di elementi finche' la coda non e' vuota 
        System.out.println("Ottengo valore con pop: ");
        while (!coda.isEmpty()) {
            System.out.println(coda.dequeue());
        }
    }
}
```
