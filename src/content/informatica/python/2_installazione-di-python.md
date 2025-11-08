---
title: "Installazione di Python"
order: 2
draft: false
lastUpdateDate: "2025-10-23"
subject: "Python"
category: "Informatica"
tags: ["python", "programmazione", "introduzione", "installazione", "base"]
author: "Dennis Turco"
videoLesson: false
---

## 1. Introduzione

Prima di iniziare a programmare in Python, è necessario **installare il linguaggio** e **configurare un ambiente di sviluppo**.
In questa lezione vedremo:

1. Come installare Python su Windows, macOS e Linux
2. Come configurare le variabili d’ambiente
3. Come installare e usare **Visual Studio Code (VS Code)** come IDE (ambiente di sviluppo integrato)

## 2. Installazione di Python

### 2.1 Scaricare Python

1. Vai sul sito ufficiale di Python: [https://www.python.org/downloads/](https://www.python.org/downloads/)
2. Il sito riconosce automaticamente il tuo sistema operativo e propone la versione più recente (es. **Python 3.13.x**).
3. Clicca su **Download Python 3.x.x**.

### 2.2 Installazione su Windows

1. Esegui il file `.exe` scaricato.
2. **Molto importante:** spunta l’opzione **"Add Python to PATH"**.
   > In questo modo potrai eseguire Python da qualsiasi finestra del terminale.
3. Clicca su **Install Now** e attendi la fine dell’installazione.

Verifica che tutto funzioni aprendo il **Prompt dei comandi (cmd)** e digitando:

```bash
python --version
```

Dovrebbe dare in output se tutto è andato bene:

```bash
Python 3.13.0
```

### 2.3 Installazione su macOS

Su macOS, Python 3 può essere installato in due modi:

- Metodo 1: dal sito ufficiale [python.org](https://www.python.org/)
- Metodo 2: tramite **Homebrew**, il gestore pacchetti:

    ```bash
    brew install python
    ```

    Verifica l’installazione:

    ```bash
    python3 --version
    ```

### 2.4 Installazione su Linux (Ubuntu/Debian)

Python è solitamente già preinstallato. Per assicurarti di avere la versione più recente:

```bash
sudo apt update
sudo apt install python3 python3-pip -y
```

Verifica:

```bash
python3 --version
```

## 3. Gestione dei pacchetti con pip

`pip` è il gestore di pacchetti di Python, usato per installare librerie aggiuntive.

Esempio:

```bash
pip install requests
```

## 4. Configurazione dell’ambiente di sviluppo

Un ambiente di sviluppo è il luogo in cui scrivi, esegui e testi il tuo codice.
Per i principianti, uno degli IDE più consigliati è **Visual Studio Code** (VS Code).

## 5. Installazione di Visual Studio Code

1. Vai sul [sito](https://code.visualstudio.com/) di visual studio code
2. Clicca su Download for Windows / macOS / Linux.
3. Installa VS Code seguendo le istruzioni del sistema operativo.

## 6. Configurazione di VS Code per Python

Apri VS Code → Vai su Extensions (icona quadrata a sinistra) → Cerca Python → Clicca su Install.
L'estensione è ufficiale di Microsoft e abilita:

- Evidenziazione della sintassi
- Debug del codice
- Auto-completamento
- Esecuzione diretta dei programmi Python

## 7. Terminale integrato

- Apri terminale integrato in VS Code senza uscire dal programma
- Digita:

    ```bash
    python -m pip list
    ```
