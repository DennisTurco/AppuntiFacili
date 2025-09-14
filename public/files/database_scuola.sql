create database scuola;

CREATE TABLE Scuola (
    id_scuola int PRIMARY KEY NOT NULL,
    nome char(20) NOT NULL,
    tipologia char(20) NOT NULL
);


CREATE TABLE Classe (
    id_classe int PRIMARY KEY NOT NULL,
    nome char(2) NOT NULL,
    fk_scuola int NOT NULL,

    CONSTRAINT FK_ClasseScuola FOREIGN KEY (fk_scuola) REFERENCES Scuola(id_scuola)
);


CREATE TABLE Studente (
    matricola int PRIMARY KEY NOT NULL,
    nome char(32) NOT NULL,
    cognome char(32) NOT NULL,
    fk_classe int NOT NULL,

    CONSTRAINT FK_StudenteClasse FOREIGN KEY (fk_classe) REFERENCES Classe(id_classe)
);


CREATE TABLE Insegnante (
    id_insegnante int PRIMARY KEY NOT NULL,
    nome char(32) NOT NULL,
    cognome char(32) NOT NULL
);


CREATE TABLE Lezione ( 
    fk_insegnanteLezione int NOT NULL,
    fk_classeLezione int NOT NULL,

    CONSTRAINT FK_InsegnLez FOREIGN KEY (fk_insegnanteLezione) REFERENCES Insegnante(id_insegnante),
    CONSTRAINT FK_InsegnClas FOREIGN KEY (fk_classeLezione) REFERENCES Classe(id_classe),

    PRIMARY KEY (fk_insegnanteLezione, fk_classeLezione)
);


INSERT INTO Scuola(id_scuola, nome, tipologia) VALUES (1, 'Marconi', 'ITIS');
INSERT INTO Scuola(id_scuola, nome, tipologia) VALUES (2, 'Berenini', 'ITIS');
INSERT INTO Scuola(id_scuola, nome, tipologia) VALUES (3, 'Berinini', 'Liceo');
INSERT INTO Scuola(id_scuola, nome, tipologia) VALUES (4, 'Zani', 'Media');
INSERT INTO Scuola(id_scuola, nome, tipologia) VALUES (5, 'Matei', 'Liceo');

INSERT INTO Classe(id_classe, nome, fk_scuola) VALUES (1, '1A', 1);
INSERT INTO Classe(id_classe, nome, fk_scuola) VALUES (2, '1B', 3);
INSERT INTO Classe(id_classe, nome, fk_scuola) VALUES (3, '1A', 1); 
INSERT INTO Classe(id_classe, nome, fk_scuola) VALUES (4, '2C', 2);
INSERT INTO Classe(id_classe, nome, fk_scuola) VALUES (5, '3D', 1);
INSERT INTO Classe(id_classe, nome, fk_scuola) VALUES (6, '2C', 4);
INSERT INTO Classe(id_classe, nome, fk_scuola) VALUES (7, '3D', 5);

INSERT INTO Studente(matricola, nome, cognome, fk_classe) VALUES (123432, 'Carlo', 'Agosti', 1);
INSERT INTO Studente(matricola, nome, cognome, fk_classe) VALUES (345789, 'Franco', 'Firli', 1);
INSERT INTO Studente(matricola, nome, cognome, fk_classe) VALUES (123543, 'Vincenzo', 'Fazzi', 3);
INSERT INTO Studente(matricola, nome, cognome, fk_classe) VALUES (312345, 'Giorgio', 'Mirli', 2);
INSERT INTO Studente(matricola, nome, cognome, fk_classe) VALUES (980123, 'Matteo', 'Ficci', 4);
INSERT INTO Studente(matricola, nome, cognome, fk_classe) VALUES (678453, 'Alessandro', 'Pattini', 5);
INSERT INTO Studente(matricola, nome, cognome, fk_classe) VALUES (123765, 'Margherita', 'Mici', 2);
INSERT INTO Studente(matricola, nome, cognome, fk_classe) VALUES (234765, 'Marta', 'Sbirci', 2);
INSERT INTO Studente(matricola, nome, cognome, fk_classe) VALUES (234543, 'Martina', 'Frinci', 3);
INSERT INTO Studente(matricola, nome, cognome, fk_classe) VALUES (265325, 'Andrea', 'Sfurci', 3);
INSERT INTO Studente(matricola, nome, cognome, fk_classe) VALUES (258342, 'Federico', 'Sgui', 5);
INSERT INTO Studente(matricola, nome, cognome, fk_classe) VALUES (854234, 'Jessica', 'Luri', 4);
INSERT INTO Studente(matricola, nome, cognome, fk_classe) VALUES (784452, 'Ginevra', 'Kick', 4); 

INSERT INTO Insegnante(id_insegnante, nome, cognome) VALUES (1, 'Carlo', 'Figghi');
INSERT INTO Insegnante(id_insegnante, nome, cognome) VALUES (2, 'Monica', 'Inglù');
INSERT INTO Insegnante(id_insegnante, nome, cognome) VALUES (3, 'Francesca', 'Miranti');
INSERT INTO Insegnante(id_insegnante, nome, cognome) VALUES (4, 'Franco', 'Francino');

INSERT INTO Lezione(fk_insegnanteLezione, fk_classeLezione) VALUES (1, 2);
INSERT INTO Lezione(fk_insegnanteLezione, fk_classeLezione) VALUES (4, 5);
INSERT INTO Lezione(fk_insegnanteLezione, fk_classeLezione) VALUES (2, 4);
INSERT INTO Lezione(fk_insegnanteLezione, fk_classeLezione) VALUES (2, 2);
INSERT INTO Lezione(fk_insegnanteLezione, fk_classeLezione) VALUES (3, 2);
INSERT INTO Lezione(fk_insegnanteLezione, fk_classeLezione) VALUES (3, 1);
INSERT INTO Lezione(fk_insegnanteLezione, fk_classeLezione) VALUES (3, 7);
INSERT INTO Lezione(fk_insegnanteLezione, fk_classeLezione) VALUES (1, 6);