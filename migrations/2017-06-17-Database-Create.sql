CREATE DATABASE IF NOT EXISTS pokedex;

CREATE TABLE IF NOT EXISTS pokemon (
	id int NOT NULL,
	weight float NOT NULL,
	height float NOT NULL,
	name varchar(255) NOT NULL,
	baseXP float NOT NULL,
	image LONGBLOB,
	generation int NOT NULL,
    type1Id int NOT NULL, 
	type2Id int,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS pokeType (
	id int NOT NULL,
	name varchar(255) NOT NULL, 
	generation int NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS move(
	id int NOT NULL,
    typeId int NOT NULL,
	name varchar(255) NOT NULL,
	class varchar(255) NOT NULL,
	power int NOT NULL,
	accuracy int NOT NULL,
	pp int NOT NULL,
	ailment varchar(255) NOT NULL,
	description varchar(255) NOT NULL,
	PRIMARY KEY (id),
    FOREIGN KEY (typeId) REFERENCES pokeType(id)
);

CREATE TABLE IF NOT EXISTS pokemonMove (
	pokeId int NOT NULL, 
	moveId int NOT NULL, 
	level int,
	PRIMARY KEY(pokeId,moveId),
	FOREIGN KEY (pokeId) REFERENCES pokemon(id),
	FOREIGN KEY (moveId) REFERENCES move(id) 
);

CREATE TABLE IF NOT EXISTS region(
	id int NOT NULL,
	name varchar(255) NOT NULL,
	generation int NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS  game (
	id int NOT NULL, 
    regionId int NOT NULL,
	name varchar(255) NOT NULL, 
	year int NOT NULL, 
	generation int NOT NULL, 
	platform varchar(255) NOT NULL,
	PRIMARY KEY (id),
    FOREIGN KEY (regionId) REFERENCES region (id)
);

CREATE TABLE IF NOT EXISTS ability (
	id int NOT NULL, 
	name varchar(255) NOT NULL, 
	description varchar(255) NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS damageMultiplier (
	attackingTypeId int NOT NULL,
	defendingTypeId int NOT NULL,
	multiplier float NOT NULL,
	PRIMARY KEY (attackingTypeId, defendingTypeId),
	FOREIGN KEY (attackingTypeId) REFERENCES pokeType(id),
	FOREIGN KEY (defendingTypeId) REFERENCES pokeType(id)
);

CREATE TABLE IF NOT EXISTS gameHasPokemon (
	gameId int NOT NULL, 
	pokeId int NOT NULL,
	PRIMARY KEY(gameId,pokeId),
	FOREIGN KEY (gameId) REFERENCES game (id),
	FOREIGN KEY (pokeId) REFERENCES pokemon (id)
);

CREATE TABLE IF NOT EXISTS pokemonHasAbility (
	pokeId int NOT NULL,
	abilityId int NOT NULL,
	PRIMARY KEY (pokeId,abilityId),
	FOREIGN KEY (pokeId) REFERENCES pokemon (id),
	FOREIGN KEY (abilityId) REFERENCES ability (id)
);

ALTER TABLE pokemon
ADD FOREIGN KEY (type1Id) REFERENCES pokeType(id),
ADD	FOREIGN KEY (type2Id) REFERENCES pokeType(id);
