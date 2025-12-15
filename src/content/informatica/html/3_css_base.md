---
title: "CSS Base"
order: 3
draft: false
lastUpdateDate: "2025-12-15"
subject: "HTML"
category: "Informatica"
difficulty: "facile"
tags: ["css", "programmazione"]
author: "Dennis Turco"
videoLesson: false
---

## 1. Introduzione

**CSS** (Cascading Style Sheets) serve a dare stile agli elementi HTML, controllando colori, dimensioni, font, posizionamenti, spaziature, ecc..

## 2. Applicare il CSS

### 2.1 Link Esterno

Modo ideale quando si ha a che fare con file grandi o stili usati su più file html (per evitare duplicazione).

```html
<head>
    <link rel="stylesheet" href="stile.css">
</head>
```

### 2.2 CSS Interno

Usato solitamente quando si vogliono applicare stili piccoli e si hanno poche pagine html

```html
<head>
    <style>
        body {
            background-color: #d7d7d7ff;
            font-family: Arial;  
        }
        p {
            color: black;
            text-align: center;
        }
    </style>
</head>  
```

### 2.3 Inline

Stile direttamente sull'elemento HTML (poco consigliato)

```html
<p style="color: red; font-size: 14px;"> Testo a caso nel par agrafo </p>
```

## 3. Selettori

I selettori permettono di scegliere gli elementi su cui applicare lo stile 

| Tipo            | Esempio                              | Descrizione                               |
| --------------- | ------------------------------------ | ----------------------------------------- |
| **Tag**         | `p { color: blue; }`                 | Tutti i paragrafi diventano blu           |
| **Classe**      | `.box { padding: 10px; }`            | Tutti gli elementi con class="box"        |
| **ID**          | `#header { background: gray; }`      | Solo l’elemento con id="header"           |
| **Discendente** | `div p { color: green; }`            | Tutti i `p` dentro `div`                  |
| **Gruppo**      | `h1, h2, h3 { font-family: Arial; }` | Applica a più elementi contemporaneamente |


## 4. Font e Testo
- font-size: dimensione del testo
    ```css
    p { font-size: 15px; }
    ```
- font-family: tipo di carattere
    ```css
    p { font-family: Arial; }
    ```
- font-align: allineamento del testo
    ```css
    h1 { font-align: right; }
    ```

## 5. Background

- Colore di sfondo

    ```css
    body { background-color: #d7d7d7ff; }
    ```

- Immagine di sfondo

    ```css
    body { background-image: url('sfondo.png'); }
    ```

## 6. Box Model

Tutti gli elementi HTML sono dei "box" rettangolari con 4 componenti:

```text
+---------------------------+
|         BORDER            |
|  +---------------------+  |
|  |      PADDING        |  |
|  |  +---------------+  |  |
|  |  |   CONTENT     |  |  |
|  |  +---------------+  |  |
|  +---------------------+  |
+---------------------------+
```

- **Content**: area interna (testo, immagine)
- **Padding** spazio interno tra il contenuto e il bordo
- **Border**: bordo attorno all'elemento
- **Margin**: spazio esterno tra gli elementi

Esempio:
```css
div {
    width: 200px;
    padding: 10px;
    border: 2px solid black;
    margin: 20px;
}
```
  
## 7. Posizionamento

Definisce come un elemento si posiziona nella pagina:

| Valore            | Descrizione                              |
| --------------- | ------------------------------------ |
| `static`         | Predefinito, segue il normale flusso della pagina   |
| `reletive`      | Si muove rispetto alla sua posizione originale  |
| `absolute`          | Posizionato rispetto al parente più vicino `relative`    |
| `fixed` | Rimane fisso nella finestra anche scrollando    |


## 8. Esempio Completo

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>Esempio CSS</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
      margin: 0;
    }
    header {
      background-color: #333;
      color: white;
      padding: 20px;
      text-align: center;
    }
    article {
      margin: 20px;
      padding: 20px;
      border: 2px solid #ccc;
      background-color: white;
    }
    .box {
      padding: 10px;
      border: 1px solid black;
      margin: 10px;
    }
    #fisso {
      position: fixed;
      bottom: 0;
      right: 0;
      background-color: red;
      color: white;
      padding: 5px;
    }
  </style>
</head>
<body>

<header>Header del sito</header>

<article>
  <p class="box">Paragrafo dentro un box</p>
  <p id="fisso">Box fisso in basso a destra</p>
</article>

</body>
</html>
```