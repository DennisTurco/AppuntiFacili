---
title: "Form"
order: 2
draft: false
lastUpdateDate: "2025-12-15"
subject: "HTML"
category: "Informatica"
difficulty: "facile"
tags: ["html", "programmazione", "form"]
author: "Dennis Turco"
videoLesson: false
---

## 1. Introduzione

Il tag `form` in html si usa oper raccogliere dei dati da parte dell'utente attraverso un modulo a lui presentato.

## 2. Esempio di form

Esempio di form di registrazione da parte di un ipotetico utente.

```html
<form action="/submit" method="post">
    <label> Nome: </label>
    <input type="text" name="nome" placeholder="Inserisci il tuo nome" autofocus required>

    <label> Cognome: </label>
    <input type="text" name="cognome" placeholder="Inserisci il tuo cognome" required>

    <label> Anno nascita: </label>
    <input type="number" name="anno" placeholder="Inserisci il tuo anno di nascita">

    <label> Email: </label>
    <input type="email" name="email" placeholder="Inserisci l'e-mail" required>

    <label> Password: </label>
    <input type="password" name="password" placeholder="Inserisci la password" required>

    <label> Ripeti: </label>
    <input type="password" name="password_ripeti" placeholder="Ripeti la password" required>

    <input type="submit" value="Invia">
    <input type="reset" value="Reset">
</form>
```

- `type`: definisce il tipo di input (`text`, `number`, `password`, `email`, ecc...)
- `autofocus`: campo selezionato automaticamente all'apertura della pagina web.
- `placeholder`: testo segnaposto (suggerimento)
- `value`: valore iniziale
- `required`: campo obbligatorio 
