---
title: "Base di dati"
draft: false
lastUpdateDate: "2025-09-14"
subject: "SQL"
category: "Informatica"
tags: ["sql", "programmazione", "base di dati", "medio"]
author: "Dennis Turco"
videoLesson: false
---

## 1. Base di Dati

Una **base di dati** è:

- Un insieme organizzato di dati utilizzati per supportare lo svolgimento delle attività di un ente.
- Un insieme di dati gestito da un **DBMS** (Database Management System).

### 1.1 Database Management System (DBMS)

Un **DBMS** è un sistema che gestisce collezioni di dati che possono essere grandi, persistenti e condivise. Garantisce vari aspetti cruciali:

- **Privatezza:** Protezione dei dati da accessi non autorizzati.
- **Affidabilità:** Capacità di resistere a malfunzionamenti hardware e software, mantenendo l'integrità dei dati.
- **Efficienza:** Ottimizzazione delle operazioni per garantire prestazioni rapide.
- **Efficacia:** Capacità di rispondere ai requisiti degli utenti e delle applicazioni in modo accurato e tempestivo.

Esempi di DBMS includono:

- **DB2**
- **Oracle**
- **SQLServer**
- **MySQL**
- **PostgreSQL**
- **Access** (non è considerato un vero DBMS)

### 1.2 Affidabilità dei Database

I database sono considerati affidabili grazie alla loro capacità di resistere a malfunzionamenti hardware e software. Poiché rappresentano una risorsa pregiata, devono essere conservati a lungo termine. Una tecnica fondamentale per garantire l'affidabilità è la gestione delle transazioni.

### 1.3 Gestione delle Transazioni

Una **transazione** è un insieme di operazioni da considerare indivisibile (atomica). Una transazione deve:

- **Fallire o avere successo nella sua interezza:** Non ci sono successi parziali.
- **Essere corretta:** Anche in presenza di concorrenza, le operazioni devono mantenere l'integrità dei dati.
- **Effetti definitivi:** Dopo il commit, tutti i cambiamenti sono registrati permanentemente nella base di dati.

Questi principi garantiscono che le operazioni sui database siano sicure, coerenti e resistenti agli errori.

### 1.4 Modelli di Dati

- **Gerarchico:** Organizza i dati in una struttura ad albero. Ogni nodo ha un singolo genitore e può avere più figli. Esempi: IMS di IBM.
- **Reticolare:** Simile al modello gerarchico, ma ogni nodo può avere più genitori, creando una struttura a rete. Esempi: IDMS.
- **Relazionale:** Utilizza tabelle (relazioni) per rappresentare i dati e le loro interconnessioni. SQL è il linguaggio standard per l'interazione. Esempi: MySQL, PostgreSQL.
- **Object-oriented:** Combina i concetti di programmazione orientata agli oggetti con quelli di basi di dati. Esempi: ObjectDB.
- **NoSQL:** Include vari sottotipi come documenti, grafi, colonne e chiavi-valore. Adatto a dati non strutturati o semi-strutturati. Esempi: MongoDB, Cassandra.

### 1.5 Normalizzazione

La **normalizzazione** è il processo di organizzazione dei dati in una base di dati per ridurre la ridondanza e migliorare l'integrità dei dati. Include vari livelli (forme normali):

1. **Prima Forma Normale (1NF):** Rimuove i valori duplicati nelle colonne.
2. **Seconda Forma Normale (2NF):** Rimuove le dipendenze parziali tra colonne.
3. **Terza Forma Normale (3NF):** Rimuove le dipendenze transitiva tra colonne.
4. **Boyce-Codd Normal Form (BCNF):** Una versione più rigorosa della 3NF.

## 2. Database Management System (DBMS)

### 2.1 Architettura del DBMS

- **Livello Fisico:** Come i dati sono effettivamente memorizzati.
- **Livello Logico:** Quali dati sono memorizzati e le relazioni tra di essi.
- **Livello di Vista:** Come i dati sono visualizzati dagli utenti finali.

### 2.2 ACID Properties

Le proprietà **ACID** sono un insieme di proprietà che garantiscono che le transazioni nei DBMS siano affidabili:

1. **Atomicità:** Le operazioni di una transazione sono indivisibili; o tutte si completano o nessuna si completa.
2. **Coerenza:** Le transazioni portano il database da uno stato coerente a un altro stato coerente.
3. **Isolamento:** Le operazioni di una transazione sono isolate dalle operazioni di altre transazioni.
4. **Durabilità:** Una volta che una transazione è confermata (commit), i suoi effetti sono permanenti anche in caso di guasto del sistema.

### 2.3 Concorrenza e Locking

- **Locking Pessimistico:** Previene l'accesso concorrente ai dati durante una transazione bloccando i record coinvolti.
- **Locking Ottimistico:** Consente l'accesso concorrente, ma verifica i conflitti prima di confermare una transazione.

### 2.4 Backup e Recupero

- **Full Backup:** Una copia completa di tutto il database.
- **Incremental Backup:** Copia solo i dati modificati dall'ultimo backup.
- **Differential Backup:** Copia solo i dati modificati dall'ultimo full backup.

### 2.5 Performance Tuning

- **Indici:** Migliorano la velocità delle query creando una struttura di ricerca sui campi.
- **Caching:** Memorizza i risultati delle query per ridurre il tempo di accesso ai dati frequentemente richiesti.
- **Partitioning:** Divide grandi tabelle in parti più piccole per migliorare la gestione e le prestazioni.

### 2.6 Tipi di Indici

- **Indice Clustered:** Ordina fisicamente i dati della tabella in base ai valori dell'indice.
- **Indice Non-Clustered:** Mantiene un ordine logico dei dati che differisce dall'ordine fisico.

## 3. Tecnologie Emergenti

### 3.1 Big Data

Gestione e analisi di enormi quantità di dati eterogenei raccolti da varie fonti. Esempi di tecnologie: Hadoop, Spark.

### 3.2 Data Warehousing

Archiviazione e gestione di grandi volumi di dati storici per analisi e reportistica. Esempi: Amazon Redshift, Google BigQuery.

### 3.3 Machine Learning e AI nei DBMS

Integrazione di algoritmi di machine learning e intelligenza artificiale per analisi avanzate, previsione e automazione delle operazioni database. Esempi: Google Cloud AI, Azure Machine Learning.

### 3.4 Cloud Databases

Database ospitati su piattaforme cloud che offrono scalabilità, affidabilità e flessibilità. Esempi: Amazon RDS, Microsoft Azure SQL Database, Google Cloud SQL.

### 3.5 Blockchain

Tecnologia emergente per basi di dati decentralizzate e immutabili, utilizzata principalmente in criptovalute e contratti intelligenti. Esempi: Ethereum, Hyperledger.

## 4. Sicurezza del Database

### 4.1 Controlli di Accesso

Implementazione di ruoli e permessi per controllare chi può accedere e modificare i dati. Tecniche includono:

- **Autenticazione:** Verifica dell'identità degli utenti.
- **Autorizzazione:** Determinazione dei permessi dell'utente.

### 4.2 Crittografia

Protezione dei dati sensibili mediante tecniche di crittografia sia a riposo (stored data) che in transito (data in transit).

### 4.3 Auditing

Monitoraggio e registrazione delle attività degli utenti per identificare e prevenire accessi non autorizzati o comportamenti sospetti.
