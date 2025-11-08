---
title: "SQL: Trigger"
order: 5
draft: false
lastUpdateDate: "2025-09-14"
subject: "SQL"
category: "Informatica"
tags: ["sql", "programmazione", "base di dati", "trigger", "difficile"]
author: "Dennis Turco"
videoLesson: false
---

## 1. Link utili

- [Trigger (basi di dati)](https://it.wikipedia.org/wiki/Trigger_(basi_di_dati))
- [SQL Server Trigger Example](https://www.mssqltips.com/sqlservertip/5909/sql-server-trigger-example/)
- [CREATE TRIGGER (Transact-SQL) - SQL Server](https://learn.microsoft.com/it-it/sql/t-sql/statements/create-trigger-transact-sql?view=sql-server-ver16)

## 2. Cosa sono?

I **trigger** sono delle procedure che vengono eseguite quando si verifica un evento nel database, in maniera automatica.

I trigger permettono agli utenti di specificare vincoli di integrità più complessi.

I trigger, in particolare, vengono eseguiti quando un utente esegue un operazione di:

- `INSERT`
- `UPDATE`
- `DELETE`

I trigger vengono eseguiti quando si verifica un evento valido, altrimenti vengono “ignorati”.

## 3. A cosa servono?

I trigger possono servire per diversi scopi:

1. per mantenere **l'integrità referenziale** tra le varie tabelle
2. per mantenere **l'integrità dei dati** della singola tabella
3. per **monitorare** i campi di una tabella ed eventualmente generare eventi ad hoc
4. per creare **tabelle di auditing** per i record che che vengono modificati o eliminati

## 4. Sintassi

```sql
CREATE TRIGGER trigger_name
ON { Table name or view name }
[ WITH <Options> ]
{ FOR | AFTER | INSTEAD OF }
{ [INSERT], [UPDATE] , [DELETE] }
```

- nome trigger:

    `CREATE [OR REPLACE] TRIGGER <nome trigger>`

- collocazione temporale del trigger:

    `BEFORE | AFTER | INSTEAD OF`

- azione(i) del trigger:

    `INSERT OR UPDATE [OF <colonna(e)>] OR DELETE ON <tabella>`

- tipo di trigger (opzionale):

    `FOR EACH ROW`

- restrizioni trigger (solo per triggers for each row):

    `WHEN (<condizione>)`

- corpo del trigger:

    `<blocco PL/SQL>`

## 5. Esempi

per gli esempi sottostanti prendiamo in considerazione la seguente tabella:

```sql
CREATE TABLE Student(
    studentID INT NOT NULL AUTO_INCREMENT,
    FName VARCHAR(20),
    LName VARCHAR(20),
    Address VARCHAR(30),
    City VARCHAR(15),
    Marks INT,
    PRIMARY KEY(studentID)
);
```

### 5.1 Esempio

Nel trigger sottostante, stiamo cercando di calcolare la percentuale dello studente non appena i suoi dettagli vengono aggiornati al database.

```sql
CREATE TRIGGER sample_trigger
before INSERT
ON student
FOR EACH ROW
SET new.total = new.marks/6;
```

### 5.2 Esempio

Qui quando inseriamo i dati nella tabella studente automaticamente il trigger verrà invocato. Il trigger aggiungerà 100 alla colonna marks nella colonna student.

```sql
CREATE TRIGGER calculate
before INSERT
ON student
FOR EACH ROW
SET new.marks = new.marks+100;
```

### 5.3 Esempio

inanzitutto creiamo una seconda tabella per questo specifico esempio:

```sql
create table Final_mark(
per int );
```

Quando inseriamo i dati nella tabella, il trigger total mark memorizza il risultato nella tabella Final_mark.

```sql
CREATE TRIGGER total_mark
AFTER INSERT
ON student
FOR EACH ROW
INSERT INTO Final_mark VALUES (new.marks);
```
