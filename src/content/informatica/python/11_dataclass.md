---
title: "Dataclass"
draft: false
lastUpdateDate: "2025-09-15"
subject: "Python"
category: "Informatica"
tags: ["python", "programmazione", "dataclass", "class", "medio"]
author: "Dennis Turco"
videoLesson: false
---

## 1. Introduzione

Le `@dataclass` in Python automatizzano la creazione di alcuni metodi speciali per le classi, che altrimenti dovremmo definire manualmente. Questo include metodi come `__init__`, `__repr__`, `__eq__`, semplificando notevolmente la gestione di classi che fungono principalmente da contenitori di dati.

Per utilizzarle, basta importare il decoratore `@dataclass` dal modulo dataclasses:

```py
from dataclasses import dataclass
```

e applicarlo alla classe `@dataclass`.

## 2. Esempio pratico

Vediamo la differenza tra una classe normale e una `@dataclass` con un esempio concreto.

Senza usare la `@dataclass`:

```py
class Point:
  x: int
  y: int

  def init(self, x, y):
    self.x = x
    self.y = y

  def repr(self):
    return f"Point(x={self.x}, y={self.y})"

  def eq(self, other):
    return self.x == other.x and self.y == other.y

p1 = Point(1, 2)
p2 = Point(2, 1)
print(p1, p2)
print(p1 == p2)
```

```text
Output:
Point(x=1, y=2) Point(x=2, y=1)
False
```

Come si può vedere, dobbiamo scrivere manualmente sia il costruttore (`__init__`), sia i metodi `__repr__` e `__eq__`.

Usando la `@dataclass`:

```py
from dataclasses import dataclass

@dataclass
class Point:
  x: int
  y: int

p1 = Point(1, 2)
p2 = Point(2, 1)
print(p1, p2)
print(p1 == p2)
```

```text
Output:
Point(x=1, y=2) Point(x=2, y=1)
False
```

Come si può notare, l'output è lo stesso, ma non è stato necessario definire a mano i metodi `__init__`, `__repr__` o `__eq__`. La `@dataclass` li ha generati automaticamente.

## 3. Dettagli automatici

Quando usiamo `@dataclass`, Python genera automaticamente i seguenti metodi:

- `__init__`: per inizializzare gli attributi
- `__repr__`: per rappresentare l'oggetto in modo leggibile
- `__eq__`: per confrontare due oggetti

## 4. Esempio Avanzato

Ecco un altro esempio, in cui definiamo una classe per un inventario:

```py
from typing import ClassVar
from dataclasses import dataclass

@dataclass
class InventoryItem:
  '''Class for keeping track of an item in inventory'''
  name: str
  unit_price: float
  quantity_on_hand: int = 0
  class_var: ClassVar[int] = 100
```

In questo modo il costruttore che verrà generato ignorerà la variabile class_var.

```py
def init(self, name: str, unit_price: float, quantity_on_hand: int = 0):
  self.name = name
  self.unit_price = unit_price
  self.quantity_on_hand = quantity_on_hand
```

Possiamo vedere come la `@dataclass` ha semplificato molto la gestione degli attributi della classe.

## 5. Come ignorare variabili nella dataclass

In alcuni casi, potremmo voler evitare che alcune variabili vengano considerate nel costruttore generato automaticamente. Per esempio, potremmo avere variabili che non devono essere inizializzate dall'esterno. Possiamo ottenere questo comportamento usando ClassVar.

```py
from typing import ClassVar
from dataclasses import dataclass

@dataclass
class InventoryItem:
  '''Classe per tenere traccia degli articoli di inventario'''
  name: str
  unit_price: float
  quantity_on_hand: int = 0
  class_var: ClassVar[int] = 100
```

In questo caso, la variabile class_var non sarà inclusa nel costruttore.

## 6. Ereditarietà

### 6.1 Classi miste

Quando ereditiamo da una classe che non è una @dataclass, è necessario gestire manualmente alcune parti del processo di inizializzazione. Ad esempio:

```py
from dataclasses import dataclass

class Rectangle:
  def init(self, height, width):
    self.height = height
    self.width = width

@dataclass
class Square(Rectangle):
  side: float

  def post_init(self):
    super().init(self.side, self.side)
```

È necessario definire il metodo `__post_init__` manualmente. Come precedentemente, per la classe dataclass verranno automaticamente generati i metodi `__init__`, `__repr__` e `__eq__`.

### 6.2 Ereditarietà con sole dataclass

Quando sia la classe base che quella derivata sono @dataclass, Python gestisce tutto automaticamente. Vediamo un esempio:

```py
from dataclasses import dataclass

@dataclass
class Rectangle:
  width: int
  lenght: int

@dataclass
class ColorRectangle(Rectangle):
  color: str

rect = ColorRectangle(10, 10, "green")
```

In questo caso, non è necessario definire manualmente né il costruttore né il metodo `__post_init__`, poiché tutto viene generato automaticamente da Python.
