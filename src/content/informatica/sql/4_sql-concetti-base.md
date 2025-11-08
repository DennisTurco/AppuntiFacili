---
title: "SQL: Concetti base"
order: 4
draft: false
lastUpdateDate: "2025-09-14"
subject: "SQL"
category: "Informatica"
tags: ["sql", "programmazione", "base di dati", "concetti base", "medio"]
author: "Dennis Turco"
videoLesson: false
---

## 1. SQL

**SQL** (Structured Query Language) è un linguaggio di programmazione utilizzato per la gestione dei dati in una base di dati relazionale. SQL permette di eseguire operazioni di inserimento, aggiornamento, eliminazione e selezione dei dati.

Esempi di query in SQL:

- Selezionare tutti i record dalla tabella "clienti":

```sql
SELECT *
FROM clienti;
```

- Selezionare i record dalla tabella "prodotti" dove il prezzo è inferiore a 10 euro:

```sql
SELECT *
FROM prodotti
WHERE prezzo < 10;
```

- Aggiornare il prezzo del prodotto con id 1234:

```sql
UPDATE prodotti
SET prezzo = 10
WHERE id = 1234;
```

- Eliminare i record dalla tabella "ordini" dove la data è precedente al 1 gennaio 2021:

```sql
DELETE FROM ordini
WHERE data < '2021-01-01';
```

## 2. Clausole

### 2.1 FROM

Clausola iniziale di una query. Inoltre, un'espressione di query può contenere sottoquery che iniziano anch’esse con una clausola FROM.

La clausola FROM specifica:

- L’origine dei dati su cui verrà eseguita la query o la sottoquery.
- La variabile di intervallo locale che rappresenta ogni elemento della sezione d’origine.

Esempio di utilizzo della clausola FROM con una sottoquery:

```sql
SELECT cliente_id, nome
FROM (
    SELECT cliente_id, nome, regione
    FROM clienti
    WHERE regione = 'Lazio'
) AS clienti_laziali;
```

### 2.2 JOIN

Clausola che serve per l’associazione di elementi di sequenze di origine diverse che non hanno una relazione diretta nel modello ad oggetti. L’unico requisito è che gli elementi in ogni origine condividano alcuni valori di cui può essere verificata l’uguaglianza.

Esistono diversi tipi di JOIN:

- **INNER JOIN:** Restituisce solo le righe che hanno corrispondenze in entrambe le tabelle.
- **LEFT JOIN (o LEFT OUTER JOIN):** Restituisce tutte le righe dalla tabella di sinistra e le righe corrispondenti dalla tabella di destra. Se non ci sono corrispondenze, i risultati della tabella di destra saranno NULL.
- **RIGHT JOIN (o RIGHT OUTER JOIN):** Restituisce tutte le righe dalla tabella di destra e le righe corrispondenti dalla tabella di sinistra. Se non ci sono corrispondenze, i risultati della tabella di sinistra saranno NULL.
- **FULL JOIN (o FULL OUTER JOIN):** Restituisce righe quando ci sono corrispondenze in una delle tabelle.

Esempio di INNER JOIN:

```sql
SELECT clienti.nome, ordini.data_ordine
FROM clienti
INNER JOIN ordini ON clienti.id = ordini.cliente_id;
```

### 2.3 WHERE

Clausola che viene usata in un'espressione di query per specificare quali elementi dell’origine dati verranno restituiti nell’espressione di query. Viene applicata una condizione booleana (predicato) ad un elemento di origine e viene restituita quella per cui la condizione specificata è vera.

Esempio di utilizzo della clausola WHERE:

```sql
SELECT nome, cognome
FROM clienti
WHERE regione = 'Lazio';
```

### 2.4 SELECT

Clausola che specifica i tipi di valori che verranno prodotti quando viene eseguita la query. Può essere utilizzata per selezionare colonne specifiche, eseguire calcoli, aggregare dati, ecc.

Esempio di utilizzo della clausola SELECT:

```sql
SELECT nome, cognome, CONCAT(nome, ' ', cognome) AS nome_completo
FROM clienti;
```

### 2.5 INTO

Parola chiave che può essere usata per creare un identificatore temporaneo al fine di archiviare i risultati di una clausola `SELECT`, `JOIN` o `GROUP BY` in un nuovo identificatore.

Esempio di utilizzo della parola chiave INTO:

```sql
SELECT nome, cognome
INTO clienti_temporanei
FROM clienti
WHERE regione = 'Lazio';
```

## 3. Funzioni Aggregate

Le funzioni aggregate eseguono calcoli su un insieme di valori e restituiscono un singolo valore. Alcune delle funzioni aggregate più comuni includono:

- **COUNT():** Restituisce il numero di righe.
- **SUM():** Restituisce la somma dei valori.
- **AVG():** Restituisce la media dei valori.
- **MIN():** Restituisce il valore minimo.
- **MAX():** Restituisce il valore massimo.

Esempi di utilizzo delle funzioni aggregate:

```sql
SELECT COUNT(*) AS numero_clienti
FROM clienti;

SELECT AVG(prezzo) AS prezzo_medio
FROM prodotti;

SELECT MIN(data_ordine) AS primo_ordine, MAX(data_ordine) AS ultimo_ordine
FROM ordini;
```

## 4. Ordinamento dei Risultati

La clausola `ORDER BY` viene utilizzata per ordinare i risultati di una query in base a una o più colonne. Può ordinare i risultati in ordine ascendente (ASC) o discendente (DESC).

Esempio di utilizzo della clausola ORDER BY:

```sql
SELECT nome, cognome
FROM clienti
ORDER BY cognome ASC, nome DESC;
```

## 5. Raggruppamento dei Dati

La clausola `GROUP BY` viene utilizzata per raggruppare i dati in base a una o più colonne. È spesso utilizzata insieme alle funzioni aggregate.

Esempio di utilizzo della clausola GROUP BY:

```sql
SELECT regione, COUNT(*) AS numero_clienti
FROM clienti
GROUP BY regione;
```

## 6. Filtraggio dei Gruppi

La clausola `HAVING` viene utilizzata per filtrare i gruppi di risultati creati dalla clausola `GROUP BY` in base a una condizione.

Esempio di utilizzo della clausola HAVING:

```sql
SELECT regione, COUNT(*) AS numero_clienti
FROM clienti
GROUP BY regione
HAVING COUNT(*) > 10;
```

## 7. Creazione e Manipolazione di Tabelle

### 7.1 Creazione di una Tabella

La parola chiave `CREATE TABLE` viene utilizzata per creare una nuova tabella in un database.

Esempio di creazione di una tabella:

```sql
CREATE TABLE clienti (
    id INT PRIMARY KEY,
    nome VARCHAR(50),
    cognome VARCHAR(50),
    regione VARCHAR(50)
);
```

### 7.2 Inserimento di Dati

La parola chiave `INSERT INTO` viene utilizzata per inserire nuovi dati in una tabella.

Esempio di inserimento di dati:

```sql
INSERT INTO clienti (id, nome, cognome, regione)
VALUES (1, 'Mario', 'Rossi', 'Lazio');
```

### 7.3 Aggiornamento di Dati

La parola chiave `UPDATE` viene utilizzata per aggiornare i dati esistenti in una tabella.

Esempio di aggiornamento di dati:

```sql
UPDATE clienti
SET regione = 'Toscana'
WHERE id = 1;
```

### 7.4 Eliminazione di Dati

La parola chiave `DELETE FROM` viene utilizzata per eliminare i dati esistenti in una tabella.

Esempio di eliminazione di dati:

```sql
DELETE FROM clienti
WHERE id = 1;
```

### 7.5 Eliminazione di una Tabella

La parola chiave `DROP TABLE` viene utilizzata per eliminare una tabella esistente.

Esempio di eliminazione di una tabella:

```sql
DROP TABLE clienti;
```

## 8. Vincoli di Integrità

### 8.1 Vincoli di Chiave Primaria

Un vincolo di chiave primaria (`PRIMARY KEY`) garantisce che ogni valore nella colonna o combinazione di colonne sia unico e non nullo.

Esempio di vincolo di chiave primaria:

```sql
CREATE TABLE clienti (
    id INT PRIMARY KEY,
    nome VARCHAR(50),
    cognome VARCHAR(50)
);
```

### 8.2 Vincoli di Chiave Esterna

Un vincolo di chiave esterna (`FOREIGN KEY`) garantisce che il valore in una colonna corrisponda ai valori in una colonna di un'altra tabella.

Esempio di vincolo di chiave esterna:

```sql
CREATE TABLE ordini (
    id INT PRIMARY KEY,
    cliente_id INT,
    data_ordine DATE,
    FOREIGN KEY (cliente_id) REFERENCES clienti(id)
);
```

### 8.3 Vincoli di Unicità

Un vincolo di unicità (`UNIQUE`) garantisce che tutti i valori in una colonna o combinazione di colonne siano unici.

Esempio di vincolo di unicità:

```sql
CREATE TABLE utenti (
    id INT PRIMARY KEY,
    email VARCHAR(100) UNIQUE
);
```

### 8.4 Vincoli di Non Null

Un vincolo di non null (`NOT NULL`) garantisce che una colonna non possa avere valori nulli.

Esempio di vincolo di non null:

```sql
CREATE TABLE prodotti (
    id INT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    prezzo DECIMAL(10, 2) NOT NULL
);
```

## 9. Transazioni

Le transazioni sono un insieme di operazioni SQL che vengono eseguite come un'unità singola. Le proprietà ACID (Atomicità, Coerenza, Isolamento, Durabilità) garantiscono l'affidabilità delle transazioni.

### 9.1 Iniziare una Transazione

Le transazioni vengono iniziate con la parola chiave `BEGIN TRANSACTION`.

Esempio di inizio di una transazione:

```sql
BEGIN TRANSACTION;
```

### 9.2 Confermare una Transazione

La parola chiave `COMMIT` viene utilizzata per confermare una transazione, rendendo permanenti tutte le operazioni eseguite durante la transazione.

Esempio di conferma di una transazione:

```sql
COMMIT;
```

### 9.3 Annullare una Transazione

La parola chiave `ROLLBACK` viene utilizzata per annullare una transazione, revertendo tutte le operazioni eseguite durante la transazione.

Esempio di annullamento di una transazione:

```sql
ROLLBACK;
```

## 10. Indici

Gli indici migliorano la velocità delle operazioni di ricerca in una tabella creando una struttura dati che consente un accesso più rapido ai dati.

## 11. Cosa sono?

Un **indice** di una tabella svolge una funzione simile all'indice del libro, ordina i record del database in base al valore di un determinato campo.

Essi vengono usati per migliorare i tempi di ricerca dei dati.

Se una tabella non ha indici, ogni ricerca obbliga il sistema a leggere tutti i dati presenti in essa. L'indice consente invece di ridurre l'insieme dei dati da leggere per completare la ricerca.

## 12. Tipi di indici

i tipi principali di indici sono:

1. **Primary key**. E' l'indice associato alla chiave primaria della tabella. Non deve contenere dati duplicati, né valori Null. Spesso è usata su campi numerici con la direttiva auto_increment per identificare i record ( es. ID ).
2. **Unique key**. E' un indice aggiuntivo. Si applica ai campi strategici della tabella. Non può contenere dati duplicati ma è consentita la presenza dei valori Null.
3. **Index**. Questo tipo di indice consente sia i dati duplicati che i valori Null.
4. **Full Text**. E' un indice specifico usato nelle ricerche delle parole all'interno dei testi.

### 12.1 Creazione di un Indice

La parola chiave `CREATE INDEX` viene utilizzata per creare un nuovo indice su una tabella.

Esempio di creazione di un indice:

```sql
CREATE INDEX idx_nome_cliente
ON clienti (nome);
```

### 12.2 Eliminazione di un Indice

La parola chiave `DROP INDEX` viene utilizzata per eliminare un indice esistente.

Esempio di eliminazione di un indice:

```sql
DROP INDEX idx_nome_cliente;
```
