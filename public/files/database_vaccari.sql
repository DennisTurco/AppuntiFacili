--
-- Database: query_Vaccari1
--

-- --------------------------------------------------------

--
-- Struttura della tabella categorie
--

CREATE TABLE categorie (
  idcategoria int(11) NOT NULL,
  tipo char(15) DEFAULT NULL
);

-- --------------------------------------------------------

--
-- Struttura della tabella commenti
--

CREATE TABLE commenti (
  idcommento int(11) NOT NULL,
  voto int(11) DEFAULT NULL,
  testo char(150) DEFAULT NULL,
  data date DEFAULT NULL,
  idevento int(11) DEFAULT NULL,
  idutente int(11) DEFAULT NULL
);

--
-- Dump dei dati per la tabella commenti
--

INSERT INTO commenti (idcommento, voto, testo, data, idevento, idutente) VALUES
(1, 5, NULL, '2021-03-03', 2, 1),
(2, 3, 'rfegergetrget', '2020-12-15', 2, 2);

-- --------------------------------------------------------

--
-- Struttura della tabella eventi
--

CREATE TABLE eventi (
  ideventi int(11) NOT NULL,
  titoloevento char(20) DEFAULT NULL,
  dataevento date DEFAULT NULL,
  luogo int(11) DEFAULT NULL,
  categoria int(11) DEFAULT NULL,
  artista char(20) DEFAULT NULL,
  inserito_da int(11) DEFAULT NULL
);

--
-- Dump dei dati per la tabella eventi
--

INSERT INTO eventi (ideventi, titoloevento, dataevento, luogo, categoria, artista, inserito_da) VALUES
(2, 'concerto', '2021-03-09', NULL, NULL, 'vasco rossi', 1),
(3, 'concerto', '2021-03-21', NULL, NULL, 'vasco rossi', 2);

-- --------------------------------------------------------

--
-- Struttura della tabella interessi
--

CREATE TABLE interessi (
  Idutente int(11) DEFAULT NULL,
  idcategoria int(11) DEFAULT NULL
);

-- --------------------------------------------------------

--
-- Struttura della tabella luogo
--

CREATE TABLE luogo (
  idluogo int(11) NOT NULL,
  nome char(20) DEFAULT NULL,
  indirizzo char(15) DEFAULT NULL,
  citta char(15) DEFAULT NULL
);

--
-- Dump dei dati per la tabella luogo
--

INSERT INTO luogo (idluogo, nome, indirizzo, citta) VALUES
(1, 'teatro regio', 'via rossi1', 'reggio'),
(2, 'san siro', 'via bernardi 5', 'milano');

-- --------------------------------------------------------

--
-- Struttura della tabella utenti
--

CREATE TABLE utenti (
  Idutente int(11) NOT NULL,
  nickname char(20) DEFAULT NULL,
  nome char(10) DEFAULT NULL,
  cognome char(15) DEFAULT NULL,
  email char(30) DEFAULT NULL,
  provincia char(20) DEFAULT NULL
);

--
-- Dump dei dati per la tabella utenti
--

INSERT INTO utenti (Idutente, nickname, nome, cognome, email, provincia) VALUES
(1, 'fabiosalat', 'fabio', 'salatino', 'fabiosalat@gmail.it', 'RE'),
(2, 'and', 'andi', 'gul', 'angul@libero.com', 'CR');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle categorie
--
ALTER TABLE categorie
  ADD PRIMARY KEY (idcategoria);

--
-- Indici per le tabelle commenti
--
ALTER TABLE commenti
  ADD PRIMARY KEY (idcommento);


--
-- Indici per le tabelle eventi
--
ALTER TABLE eventi
  ADD PRIMARY KEY (ideventi);

--
-- Indici per le tabelle interessi
--

--
-- Indici per le tabelle luogo
--
ALTER TABLE luogo
  ADD PRIMARY KEY (idluogo);

--
-- Indici per le tabelle utenti
--
ALTER TABLE utenti
  ADD PRIMARY KEY (Idutente);

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella commenti
--
ALTER TABLE commenti
  ADD CONSTRAINT commenti_ibfk_1 FOREIGN KEY (idevento) REFERENCES eventi (ideventi);
ALTER TABLE commenti
  ADD CONSTRAINT commenti_ibfk_2 FOREIGN KEY (idutente) REFERENCES utenti (Idutente);

--
-- Limiti per la tabella eventi
--
ALTER TABLE eventi
  ADD CONSTRAINT eventi_ibfk_1 FOREIGN KEY (luogo) REFERENCES luogo (idluogo);
ALTER TABLE eventi
  ADD CONSTRAINT eventi_ibfk_2 FOREIGN KEY (categoria) REFERENCES categorie (idcategoria);
ALTER TABLE eventi
  ADD CONSTRAINT eventi_ibfk_3 FOREIGN KEY (inserito_da) REFERENCES utenti (Idutente);

--
-- Limiti per la tabella interessi
--
ALTER TABLE interessi
  ADD CONSTRAINT interessi_ibfk_1 FOREIGN KEY (Idutente) REFERENCES utenti (Idutente);
ALTER TABLE interessi
  ADD CONSTRAINT interessi_ibfk_2 FOREIGN KEY (idcategoria) REFERENCES categorie (idcategoria);