---
title: "Programmazione Object-Oriented (0-0)"
draft: false
lastUpdateDate: "2025-08-28"
subject: "Java"
category: "Informatica"
tags: ["java", "programmazione", "oop", "difficile"]
author: "Dennis Turco"
videoLesson: false
---

## 1. Introduzione

Un problema può essere descritto come un insieme di **oggetti** che richiedono **servizi** ad altri oggetti.

Un **oggetto** è un'astrazione che può rappresentare:

- **Oggetti fisici** (ad esempio: un libro, un cellulare);
- **Concetti astratti** (ad esempio: un orario, un esame).

Gli oggetti sono caratterizzati da:

- **Stato**, che rappresenta le informazioni o attributi dell'oggetto;
- Un insieme di **servizi** offerti, che rappresentano le funzionalità o i comportamenti dell'oggetto.

In programmazione orientata agli oggetti (O-O), una classe descrive un insieme di oggetti con le stesse caratteristiche (ad esempio, la classe *TelefonoCellulare*). I linguaggi di programmazione offrono costrutti specifici per definire queste classi. Ecco un esempio in C++:

```cpp
class TelefonoCellulare {
    // Attributi che descrivono lo stato
    private:
        int segnale;
        int livello_batteria;
        // Altri attributi...

    // Metodi che descrivono i servizi
    public:
        void rispondi() {...};
        void chiama() {...};
        // Altri metodi...
};
```

**Oggetto**: Un singolo oggetto è un'istanza di una classe. Ad esempio:

- In C++:
  - `TelefonoCellulare mioTelefono;`
- In Java:
  - `TelefonoCellulare mioTelefono = new TelefonoCellulare();`

## 2. Relazioni

1. **Relazioni tra oggetti**
    - Ad esempio, ogni oggetto *TelefonoCellulare* contiene un oggetto *livello_batteria*, il che rappresenta una relazione di **contenimento**.
2. **Relazioni tra classi**
    - Ad esempio, la classe *TelefonoCellulare* è un sottoinsieme della classe degli **oggetti fisici**, definendo una relazione di **ereditarietà**.

## 3. Sistema ad Oggetti

Un sistema ad oggetti è costituito da un insieme di oggetti che richiedono l'esecuzione di servizi ad altri oggetti. Per realizzare un sistema ad oggetti, è necessario:

1. **Descrivere le classi**, specificando:
    - Lo stato (attributi);
    - I servizi (metodi);
    - Le relazioni tra le classi.
2. **Creare gli oggetti** a partire dalle classi definite.
3. **Iniziare la comunicazione tra oggetti**, inviando i messaggi necessari per richiedere servizi.

*Esempio in c++ per descrivere le classi:*

```cpp
class Rettangolo {
	// attributi -> stato
	private:
		int l; // larghezza
		int a; // altezza

	public:
		// costruttori -> inizializzazione oggetti della classe = stato iniziale
		Rettangolo() {
			l = 0;
			a = 0;
		}
		Rettangolo(int x, int y) {
			l = x;
			a = y;
		}

		// metodi -> servizi
		int perimetro() {
			return 2*l+2*a;
		}
		int area() {
			return l*a;
		}
		// eventuali set e get
}
```

*Esempio in c++ per creare gli oggetti:*

```cpp
int main () {
	// 3 oggetti di classe rettangolo
	Rettangolo r1(5, 7);
	Rettangolo r2(4, 8);
	Rettangolo r3(10, 10);

	// invio di un "messaggio" di servizio "calcola area" all'oggetto r1
	int area1 = r1.area();
	cout << "Area 1 = " << area1;
	
	// invio di un "messaggio" di servizio "calcola perimetro" all'oggetto r2
	int perimetro2 = r2.perimetro();
	cout << "Perimetro 2 = " << perimetro2;
	// ...
}
```

## 4. Sistema ad Oggetti vs Sistema Procedurale

Un sistema procedurale è un sistema privo di classi, costituito da un insieme di funzioni (o procedure) che si richiamano tra loro.

- **Nella programmazione procedurale:**
  - Si analizza il problema per individuare l'algoritmo risolutivo;
  - Si scompone l'algoritmo in un insieme di algoritmi più piccoli e gestibili.
- **Nella programmazione orientata agli oggetti (O-O):**
  - Si analizza il problema descrivendo le entità coinvolte (gli oggetti) e si definiscono le relative classi;
  - Si scompone il problema assegnando responsabilità ai singoli oggetti e individuando le interazioni tra loro;
  - Si definisce un insieme di algoritmi che implementano i servizi offerti dagli oggetti (metodi delle classi).

In generale, la programmazione O-O tende a massimizzare il riuso del codice, con conseguenti benefici in termini di:

- Riduzione dei tempi di sviluppo;
- Riduzione dei costi (soprattutto in termini di personale).
