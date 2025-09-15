---
title: "Lista"
draft: false
lastUpdateDate: "2025-08-28"
subject: "Java"
category: "Informatica"
tags: ["java", "programmazione", "lista", "strutture dati", "complesso"]
author: "Dennis Turco"
videoLesson: false
---

## 1. Descrizione

![List](https://scaler-topics-articles-md.s3.us-west-2.amazonaws.com/traversal-operation-of-linked-list.gif)

Una **lista** è una struttura dati che organizza una collezione di elementi in una sequenza ordinata. Le liste sono ampiamente utilizzate in programmazione per memorizzare dati in modo dinamico e flessibile.

Esistono diversi tipi di liste, tra cui:

1. **Lista Collegata**: Una lista collegata è una sequenza di nodi, ognuno dei quali contiene un elemento di dati e un riferimento al successivo nodo nella sequenza. La lista inizia con un nodo chiamato "testa", e il suo ultimo nodo ha il suo riferimento impostato a **`null`**. Le operazioni di inserimento e rimozione in una lista collegata sono efficienti, specialmente all'inizio o alla fine della lista.
2. **Lista Concatenata**: Una lista concatenata è simile a una lista collegata, ma offre funzionalità aggiuntive come l'accesso casuale agli elementi tramite l'indicizzazione. Ogni elemento della lista contiene anche un riferimento al precedente nodo, consentendo un accesso efficiente a qualsiasi posizione della lista.
3. **Lista Doppiamente Collegata**: È una variante della lista collegata in cui ogni nodo ha un riferimento sia al nodo precedente che a quello successivo nella sequenza. Questo consente un accesso bidirezionale agli elementi della lista, rendendo più efficienti alcune operazioni come l'eliminazione di elementi.
4. **Lista Circolare**: In una lista circolare, l'ultimo nodo della lista punta al primo nodo anziché a **`null`**, creando un ciclo continuo. Questo permette di attraversare la lista senza fine.

Le liste forniscono una flessibilità notevole perché possono crescere e contrarsi dinamicamente durante l'esecuzione del programma. Possono anche contenere elementi di diversi tipi di dati e possono essere facilmente estese con nuove operazioni o funzionalità.

Le liste sono ampiamente utilizzate per implementare una varietà di strutture dati complesse, come pile, code, alberi e grafi, e sono fondamentali in molte aree della programmazione, inclusi algoritmi, strutture dati e applicazioni di database.

## 2. Implementazione

### 2.1 Classe Nodo

La classe **`Nodo`** rappresenta un elemento fondamentale di una lista collegata. Ogni nodo contiene due parti principali:

1. **Info(`info`)**: Questo è il contenuto effettivo del nodo. È il valore che il nodo memorizza o rappresenta.
2. **Link (`link`)**: Questo è un riferimento al prossimo nodo nella lista. Ogni nodo, tranne l'ultimo, punta al nodo successivo. L'ultimo nodo della lista ha il suo link impostato su **`null`**, indicando la fine della lista.

Inoltre, la classe **`Nodo`** fornisce metodi per accedere e modificare questi attributi:

- **`getInfo()`**: Restituisce il valore memorizzato nel nodo.
- **`getLink()`**: Restituisce il riferimento al nodo successivo.
- **`setLink(Nodo link)`**: Imposta il riferimento al nodo successivo.

```java
public class Nodo {
    private int info;   // valore del nodo corrente
    private Nodo link;  // puntatore al nodo successivo

    public Nodo(int info) {
        this.info = info;
        this.link = null;   // non ha ancora un nodo successivo
    }

    public int getInfo() {
        return info;
    }
    public Nodo getLink() {
        return link;
    }

    public void setLink(Nodo link) {
        this.link = link;   // setto il nodo successivo
    }
    public void setInfo(int info) {
        this.info = info;
    }
}
```

### 2.2 Classe Lista

La classe **`Lista`** rappresenta una sequenza di nodi collegati. Contiene due parti principali:

1. **Testa (`head`)**: Questo è un riferimento al primo nodo della lista. Se la lista è vuota, **`head`** sarà **`null`**. Ogni operazione sulla lista inizia dalla testa.
2. **Dimensione (`dimensione`)**: Questo tiene traccia del numero di elementi presenti nella lista. È utile per ottenere rapidamente la dimensione della lista senza dover attraversare tutti i nodi.

La classe **`Lista`** offre metodi per manipolare la lista collegata:

- **Costruttore**: Inizializza una lista vuota.
- **`getDimensione()`**: Restituisce il numero di elementi nella lista.
- **`VisitaLista()`**: Stampa tutti gli elementi presenti nella lista, scorrendo da **`head`** fino a **`null`**.
- **`InserisciInTesta(int dato)`**: Aggiunge un nuovo nodo all'inizio della lista. Questo metodo crea un nuovo nodo con il dato specificato e lo collega alla testa della lista, rendendolo il nuovo primo nodo.
- **`InserisciInCoda(int dato)`**: Aggiunge un nuovo nodo alla fine della lista. Questo metodo scorre la lista fino all'ultimo nodo e collega il nuovo nodo alla sua fine.
- **`EliminaInTesta()`**: Rimuove il primo nodo dalla lista. Questo metodo aggiorna la testa della lista per puntare al secondo nodo, eliminando così il primo nodo.
- **`EliminaInCoda()`**: Rimuove l'ultimo nodo dalla lista. Questo metodo scorre la lista fino al penultimo nodo e lo collega a **`null`**, eliminando così l'ultimo nodo.

Insieme, la classe **`Nodo`** e la classe **`Lista`** forniscono un'implementazione di una lista collegata, una struttura dati dinamica in cui gli elementi sono collegati da nodi e possono essere aggiunti o rimossi in modo efficiente.

```java
public class Lista {
    private Nodo head;      // punta al primo elemento della lista (null se vuota)
    private int dimensione; // numero di elementi nella lista

    public Lista() {
        this.head = null;
        this.dimensione = 0;
    }

    // restituisce la dimensione della lista
    public int getDimensione() {
        return dimensione;
    }

    // stampa
    public void VisitaLista() {
        Nodo p = head;

        // itero fino a trovare l'ultimo elemento della lista 
        while (p != null) {
            System.out.print(p.getInfo() + " ");
            p = p.getLink();
        }
    }

    public void InserisciInTesta(int dato) {
        Nodo n = new Nodo(dato);    // nuovo nodo
        n.setLink(head);            // Il link del nuovo nodo punta al nodo corrente (head)
        head = n;                   // Il nuovo nodo diventa la nuova testa della lista
        dimensione++;
    }

    public void InserisciInCoda(int dato) {
        Nodo n = new Nodo(dato);    // nuovo nodo

        if (head == null) {  // caso in cui la lista e' vuota
            head = n;
        } else {
            Nodo p = head;  // Nodo al primo elemento della lista

            while (p.getLink() != null) {
                p = p.getLink();
            }

            n.setLink(null);
            p.setLink(n);
        }

        dimensione++;
    }

    public void InserisciInMezzo(int dato, int posizione) {
        if (posizione < 0 || posizione > dimensione) 
            throw new IllegalArgumentException("Errore: Posizione non valida");
        
        Nodo n = new Nodo(dato); // nuovo nodo
        if (posizione == 0) {
            // inserimento in testa
            n.setLink(head);
            head = n;
        } else {
            Nodo p = head;
            for (int i = 0; i < posizione-1; i++) {
                p = p.getLink();
            }
            n.setLink(p.getLink());
            p.setLink(n);
        }

        dimensione++;
    }

    public void EliminaInTesta() {
        // se la lista e' vuota non posso eliminare nulla
        if (head == null)
            return;

        head = head.getLink();
        dimensione--;
    }

    public void EliminaInCoda() {
        if (head == null)
            return;

        if (head.getLink() == null) {  // caso in cui la lista contiene un solo elemento
            head = null;
        } else {
            Nodo p = head;  // nodo di testa

            // p.getList() -> nodo i; p.getLink().getLink() -> nodo i+1
            while (p.getLink().getLink() != null) {
                p = p.getLink();
            }

            p.setLink(null);
        }

        dimensione--;
    }

    public void EliminaInMezzo(int posizione) {
        if (posizione < 0 || posizione > dimensione)
            throw new IllegalArgumentException("Errore: Posizione non valida");
        if (head == null)
            throw new IllegalStateException("Errore: Lista gia' vuota");

        if (posizione == 0) {
            // elimina in testa
            head = head.getLink();
        } else {
            Nodo p = head;
            for (int i = 0; i < posizione - 1; i++) {
                p = p.getLink();
            }
            p.setLink(p.getLink().getLink());
        }

        dimensione--;
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        // Creazione di una nuova lista
        Lista lista = new Lista();

        // Inserimento di alcuni elementi
        lista.InserisciInCoda(10);
        lista.InserisciInCoda(20);
        lista.InserisciInCoda(30);

        // Stampa della lista
        System.out.println("Lista dopo l'inserimento:");
        lista.VisitaLista();

        // Eliminazione in testa
        lista.EliminaInTesta();
        System.out.println("\nLista dopo l'eliminazione in testa:");
        lista.VisitaLista();

        // Eliminazione in coda
        lista.EliminaInCoda();
        System.out.println("\nLista dopo l'eliminazione in coda:");
        lista.VisitaLista();

        // Inserimento in testa
        lista.InserisciInTesta(40);
        System.out.println("Lista dopo l'inserimento in testa:");
        lista.VisitaLista();

        // Inserimento in mezzo
        lista.InserisciInMezzo(25, 1);
        System.out.println("Lista dopo l'inserimento in mezzo:");
        lista.VisitaLista();

        // Eliminazione in mezzo
        lista.EliminaInMezzo(1);
        System.out.println("Lista dopo l'eliminazione in mezzo:");
        lista.VisitaLista();
    }
}
```

## 3. Esercizi

- **ESERCIZIO 1**:
    Un dispsitivo MP3 consente di gestire playlist di brani musicali descritti da *titolo* e *durata* espressa in secondi. Implementare in linguaggio Java le classi Brano e Playlist che consentano di eseguire le seguenti operazioni, gestendo in modo adeguato le relative eccezioni:

  - aggiunta di un brano alla Lista dall'ultima posizione;
  - eliminazione dalla lista di un brano identificato dal titolo;
  - determinazione della durata totale dei brani della lista;
  - esportazione dei primi *n* brani della lista in un vettore ( con *n* fornito come parametro);
  - esportazione dei brani della lista fino a un tempo complessivo *t* di riproduzione (con *t* fornito come parametro);
  - spostamento di un brano identificato dalla posizione (2, 3, …, n) nella posizione precedente (1, 2, …, n - 1);
  - spostamento di un brano identificato dalla posizione (1, 2, …, n - 1) nella posizione successiva (2, 3, …, n);
  - salvataggio e ripristino della lista dei brani in/da un file di tipo testuale;
  - riordino casuale dei brani della lista (funzione *shuffle:* il metodo *nextint* della classe *java.util.Random* restituisce un numero casuale intero).

    Realizzare un main che consenta di eseguire le operazioni in modo interattivo.
