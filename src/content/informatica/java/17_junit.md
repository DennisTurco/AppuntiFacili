---
title: "JUnit"
draft: false
lastUpdateDate: "2025-08-27"
subject: "Java"
category: "Informatica"
tags: ["java", "programmazione", "junit", "test", "difficile"]
author: "Dennis Turco"
videoLesson: false
---

[Java Unit Testing with JUnit - Tutorial - How to Create And Use Unit Tests](https://www.youtube.com/watch?v=vZm0lHciFsQ)

## 1. Contesto

Il testing su Java è un processo fondamentale nello sviluppo software volto a garantire che il codice funzioni correttamente e risponda alle aspettative.

In tutti gli ambienti di sviluppo, indipendentemente dal processo di produzione del codice adottato, la fase di testing è spesso trascurata. Questo accade per vari motivi, come la mancanza di tempo, la scarsa volontà degli sviluppatori, o semplicemente perché ritenuta di poco interesse. Tuttavia, il testing è fondamentale per garantire la qualità e la robustezza del software.

## 2. Definizione

Il testing del software è l'insieme di attività svolte per verificare che un'applicazione soddisfi i requisiti specificati e sia priva di errori. Consiste nell'eseguire un programma con l'intento di trovare bug o difetti, garantire che il comportamento del software sia conforme alle aspettative e validare che i risultati siano corretti.

## 3. Tipi di test

### 3.1 Test Unitari

Questi sono test che verificano la funzionalità di unità isolate di codice, come metodi o classi singole.

- **Test di Metodi**: Testano singoli metodi di una classe.
- **Test di Classi**: Testano l'interazione tra i metodi all'interno di una classe.
- **Test di Eccezioni**: Verificano che i metodi lancino le eccezioni corrette in determinate condizioni.

### 3.2 Test di Integrazione

Questi test verificano l'interazione tra diverse unità o componenti del sistema.

- **Test di Componenti**: Verificano l'integrazione tra classi o moduli diversi.
- **Test di Servizi**: Testano l'interazione tra vari servizi all'interno dell'applicazione.
- **Test di Database**: Verificano che l'integrazione con il database funzioni correttamente.

### 3.3 Test Funzionali

Questi test verificano che il sistema soddisfi i requisiti funzionali specificati.

- **Test di Requisiti**: Verificano che il comportamento del software corrisponda ai requisiti specificati.
- **Test di Scenari**: Testano scenari specifici di utilizzo dell'applicazione.

### 3.4 Test di Regressione

Questi test assicurano che le modifiche al codice non abbiano introdotto nuovi bug.

- **Test di Nuove Funzionalità**: Verificano che le nuove funzionalità non abbiano rotto il codice esistente.
- **Test di Bug Fix**: Assicurano che i bug risolti non si ripresentino.

### 3.5 Test di Carico e Prestazioni

Questi test verificano il comportamento del sistema sotto carico e la sua performance.

- **Test di Carico**: Testano come il sistema si comporta sotto carico pesante.
- **Test di Stress**: Verificano il comportamento del sistema oltre i limiti operativi normali.
- **Test di Performance**: Misurano i tempi di risposta e l'efficienza del sistema.

### 3.6 Test End-to-End

Questi test verificano l'intero flusso di lavoro dall'inizio alla fine, come farebbe un utente reale.

- **Test di Sistema**: Verificano il sistema nel suo complesso.
- **Test di Flusso di Lavoro**: Testano i flussi di lavoro completi attraverso vari moduli dell'applicazione.

### 3.7 Test di Interfaccia Utente (UI)

Questi test verificano che l'interfaccia utente funzioni correttamente.

- **Test di Componenti UI**: Testano singoli componenti dell'interfaccia utente.
- **Test di Usabilità**: Verificano che l'interfaccia sia intuitiva e facile da usare.

### 3.8 Strumenti e Annotazioni Utilizzati in JUnit

JUnit fornisce diverse annotazioni e strumenti per categorizzare e gestire i test:

| **Annotazione** | **Utilizzo** |
| --- | --- |
| **@Test** | per annotare i metodi di test |
| **@Before** | per annotare un metodo da eseguire prima dell'esecuzione di un test case (ad esempio l'apertura di una connessione ad un database, o uno stream) |
| **@After** | per annotare un metodo da eseguire dopo l'esecuzione di un test case (chiusura di risorse aperte in precedenza) |
| **@BeforeClass** | come `@Before` ma solo all'inizio dell'esecuzione del test |
| **@AfterClass** | come `@After` ma solo alla fine dell'esecuzione del test |
| **@BeforeEach**  | Esegue il codice prima ogni metodo di test. |
| **@AfterEach** | Esegue il codice dopo ogni metodo di test. |
| **@BeforeAll** | Esegue il codice prima ogni metodo di test. |
| **@AfterAll** | Esegue il codice una volta dopo tutti i metodi di test. |
| **@Ignore / @Disabled** | utilizzata per evitare l'esecuzione di un test (evitando di commentare) |
| **@Tag** | Categoria di test (utile per filtrare ed eseguire solo determinati gruppi di test). |

## 4. Esempi Pratici

- **DeterminatoreVoto.java**

    Questa classe contiene un metodo per convertire un voto numerico in una lettera, secondo una scala prestabilita.

    ```java
    public class DeterminatoreVoto {
        public char determinaVotoInLettera (int voto) {
            if (voto < 0) {
                throw new IllegalArgumentException("Il voto non puo' essere negativo");
            } 
            else if (voto > 100) {
                throw new IllegalArgumentException("Il voto non puo' essere superiore a 100");
            }
            else if (voto < 60) {
                return 'F';
            }
            else if (voto < 70) {
                return 'D';
            }
            else if (voto < 80) {
                return 'C';
            }
            else if (voto < 90) {
                return 'B';
            }
            else {
                return 'A';
            }
        }
    }
    ```

- **DeterminatoreVotoTest.java**

    Questa classe utilizza JUnit per verificare che il metodo **`determinaVotoInLettera`** funzioni correttamente. Include vari test case per coprire diverse situazioni.

    ```java
    import org.junit.Test;

    import static org.junit.Assert.assertEquals;
    import static org.junit.Assert.assertNotNull;
    import static org.junit.Assert.assertThrows;

    import org.junit.Before;
    import org.junit.After;

    public class DeterminatoreVotoTest {

        private DeterminatoreVoto determinatore;

        @Before
        public void startup() {
            determinatore = new DeterminatoreVoto();
        }

        @After
        public void cleanup() {
            determinatore = null;
        }

        @Test
        public void testCinquantacinqueDovrebbeRitornareF() {
            char lettera = determinatore.determinaVotoInLettera(55);
            assertEquals('F', lettera);
        }

        @Test
        public void testSessantacinqueDovrebbeRitornareD() {
            char lettera = determinatore.determinaVotoInLettera(65);
            assertEquals('D', lettera);
        }

        @Test
        public void testSettantacinqueDovrebbeRitornareC() {
            char lettera = determinatore.determinaVotoInLettera(75);
            assertEquals('C', lettera);
        }

        @Test
        public void testOttantacinqueDovrebbeRitornareB() {
            char lettera = determinatore.determinaVotoInLettera(85);
            assertEquals('B', lettera);
        }

        @Test
        public void testNovantacinqueDovrebbeRitornareA() {
            char lettera = determinatore.determinaVotoInLettera(95);
            assertEquals('A', lettera);
        }

        @Test
        public void testVotoNegativoDovrebbeRitornareException() {
            assertThrows(IllegalArgumentException.class, () -> {
                determinatore.determinaVotoInLettera(-10);
            });
        }

        @Test
        public void testVotoEccessivoDovrebbeRitornareException() {
            assertThrows(IllegalArgumentException.class, () -> {
                determinatore.determinaVotoInLettera(101);
            });
        }

        @Test
        public void testCheNonRestituisceNull() {
            char lettera = determinatore.determinaVotoInLettera(75);
            assertNotNull(lettera);
        }
    }

    ```

- **DeterminatoreVotoTest2.java** *(esempio appena più complesso)*

    Utilizza un array bidimensionale per contenere i dati di test e un ciclo per eseguire i test in modo parametrizzato.

    ```java
    import org.junit.Test;
    import static org.junit.Assert.assertEquals;
    import static org.junit.Assert.assertThrows;

    public class DeterminatoreVotoTest2 {

        private DeterminatoreVoto determinatore = new DeterminatoreVoto();

        @Test
        public void testVoti() {
            Object[][] testData = {
                {55, 'F'},
                {65, 'D'},
                {75, 'C'},
                {85, 'B'},
                {95, 'A'},
                {60, 'D'},
                {70, 'C'},
                {80, 'B'},
                {90, 'A'},
                {-10, "EXCEPTION"},
                {101, "EXCEPTION"}
            };

            for (Object[] data : testData) {
                int voto = (int) data[0];
                Object expected = data[1];

                if (expected.equals("EXCEPTION")) {
                    assertThrows(IllegalArgumentException.class, () -> {
                        determinatore.determinaVotoInLettera(voto);
                    });
                } else {
                    char expectedLetter = (char) expected;
                    char lettera = determinatore.determinaVotoInLettera(voto);
                    assertEquals(expectedLetter, lettera);
                }
            }
        }
    }
    ```
