CREATE DATABASE viaggi

CREATE TABLE Autista(
    id_autista INT NOT NULL PRIMARY KEY,
    nome VARCHAR(20) NOT NULL,
    cognome VARCHAR(20) NOT NULL,
    foto CHAR(20)
);

CREATE TABLE Passeggero(
    id_passeggero INT NOT NULL PRIMARY KEY,
    nome VARCHAR(20) NOT NULL,
    cognome VARCHAR(20) NOT NULL
);

CREATE TABLE Viaggio(
    id_viaggio INT NOT NULL PRIMARY KEY,
    partenza VARCHAR(20) NOT NULL,
    arrivo VARCHAR(20) NOT NULL,
    costo float NOT NULL,
    fk_autista INT NOT NULL,

    CONSTRAINT FK_ViaggioAutista FOREIGN KEY (fk_autista) REFERENCES Autista(id_autista) 
);

CREATE TABLE Viaggio_Passeggero(
    fk_passeggero INT NOT NULL,
    fk_viaggio INT NOT NULL,

    CONSTRAINT FK_ViaggioPasseggero FOREIGN KEY (fk_viaggio) REFERENCES Viaggio(id_viaggio),
    CONSTRAINT FK_PasseggeroViaggio FOREIGN KEY (fk_passeggero) REFERENCES Passeggero(id_passeggero)
);

CREATE TABLE GiudizioPasseggero(
    id_giudiziopasseggero INT PRIMARY KEY,
    voto INT NOT NULL,
    commento TEXT,
    fk_autista INT NOT NULL,
    fk_passeggero INT NOT NULL,

    CONSTRAINT FK_Autista_GiudizioPasseggero FOREIGN KEY (fk_passeggero) REFERENCES Passeggero(id_passeggero),
    CONSTRAINT FK_Passeggero_GiudizioPasseggero FOREIGN KEY (fk_autista) REFERENCES Autista(id_autista)
);

CREATE TABLE GiudizioAutista(
    id_giudizioautista INT PRIMARY KEY,
    voto INT NOT NULL,
    commento TEXT,
    fk_autista INT NOT NULL,
    fk_passeggero INT NOT NULL,

    CONSTRAINT FK_Autista_GiudizioAutista FOREIGN KEY (fk_passeggero) REFERENCES Passeggero(id_passeggero),
    CONSTRAINT FK_Passeggero_GiudizioAutista FOREIGN KEY (fk_autista) REFERENCES Autista(id_autista)
);