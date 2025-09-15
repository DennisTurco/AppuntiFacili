---
title: "Pila"
draft: false
lastUpdateDate: "2025-08-28"
subject: "Java"
category: "Informatica"
tags: ["java", "programmazione", "lista", "pila", "strutture dati", "complesso"]
author: "Dennis Turco"
videoLesson: false
---


## 1. Descrizione

![Pila](https://scaler.com/topics/images/working-of-stack-in-java.gif)

Una **pila**, in Java, è una struttura dati lineare che segue il principio "LIFO" (Last In, First Out), il che significa che l'ultimo elemento inserito è il primo ad essere rimosso. È simile a un mucchio di piatti: il primo piatto che viene messo sul mucchio è l'ultimo a essere preso.

In Java, una pila può essere implementata utilizzando la classe **`Stack`** o utilizzando le collezioni della libreria standard come **`LinkedList`** o **`ArrayDeque`** e implementando le operazioni di inserimento (push) e rimozione (pop) degli elementi.

Operazioni principali:

- **push(elemento)**: Aggiunge un elemento alla cima della pila.
- **pop()**: Rimuove e restituisce l'elemento in cima alla pila.
- **peek()**: Restituisce l'elemento in cima alla pila senza rimuoverlo.
- **isEmpty()**: Verifica se la pila è vuota.
- **size()**: Restituisce il numero di elementi nella pila.

## 2. Implementazione

In questo esempio implementiamo una la Pila utilizzando una lista.

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

### 2.2 Classe Pila

1. **Classe `Pila`**: Questa classe rappresenta la struttura dati della pila e contiene i metodi per gestire gli elementi all'interno della pila.
2. **Attributi**:
    - **`cima`**: È un riferimento al nodo in cima alla pila. Se la pila è vuota, **`cima`** è **`null`**.
    - **`dimensione`**: Rappresenta il numero di nodi presenti nella pila.
3. **Costruttore**:
    - Il costruttore inizializza la pila impostando il riferimento **`cima`** a **`null`** e la **`dimensione`** a 0.
4. **Metodo `isEmpty()`**:
    - Questo metodo restituisce **`true`** se la pila è vuota (cioè se **`cima`** è **`null`**), altrimenti restituisce **`false`**.
5. **Metodo `push(int info)`**:
    - Questo metodo aggiunge un nuovo nodo alla cima della pila.
    - Crea un nuovo nodo con l'informazione fornita.
    - Imposta il link del nuovo nodo al nodo precedente in cima alla pila.
    - Imposta il nuovo nodo come nodo in cima alla pila.
    - Incrementa la dimensione della pila.
6. **Metodo `pop()`**:
    - Questo metodo rimuove il nodo in cima alla pila e restituisce l'informazione contenuta in quel nodo.
    - Se la pila è vuota, viene sollevata un'eccezione (**`IllegalStateException`**).
    - Restituisce l'informazione contenuta nel nodo in cima.
    - Rimuove il nodo in cima dalla pila.
    - Decrementa la dimensione della pila.
7. **Metodo `peek()`**:
    - Questo metodo restituisce l'informazione contenuta nel nodo in cima alla pila senza rimuoverlo.
    - Se la pila è vuota, viene sollevata un'eccezione (**`IllegalStateException`**).
8. **Metodo `size()`**:
    - Questo metodo restituisce la dimensione della pila, cioè il numero di nodi presenti al suo interno.

```java
// LIFO (Last-In-First-Out)
public class Pila {
    private Nodo cima;      // riferimento al nodo in cima alla pila
    private int dimensione; // numero di Nodi interni

    public Pila() {
        this.cima = null;
        this.dimensione = 0;
    }

    // restituisce true se la pila è vuota, false altrimenti
    public boolean isEmpty() {
        return cima == null;
    } 

    // aggiunge un nuovo nodo
    public void push(int info) {
        Nodo n = new Nodo(info);
        n.setLink(cima);    // collegamento del nuovo nodo al nodo precedente in cima alla pila
        cima = n;           // il nuovo nodo diventa il nodo in cima alla pila

        dimensione++;
    }

    // rimuove il Nodo in cima e ne ritorna il contenuto
    public int pop() {
        if (isEmpty())
            throw new IllegalStateException("Errore: la pila e' vuota.");

        int elemento = cima.getInfo();  // estrazione del contenuto del Nodo in cima
        cima = cima.getLink();          // rimozione del Nodo in cima

        dimensione--;

        return elemento;
    }

    // ritorna il contenuto del Nodo in cima
    public int peek() {
        if (isEmpty())
            throw new IllegalStateException("Errore: la pila e' vuota.");

        return cima.getInfo();
    }

    public int size() {
        return dimensione;
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        Pila pila = new Pila();

        pila.push(1);
        pila.push(2);
        pila.push(3);

        System.out.println("Ottengo valore con peek: ");
        System.out.println(pila.peek());

        pila.push(5);

        // pop di elementi finche' la pila non e' vuota 
        System.out.println("Ottengo valore con pop: ");
        while (!pila.isEmpty()) {
            System.out.println(pila.pop());
        }
    }
}
```
