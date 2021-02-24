export const createAnimalsTable =  `
CREATE TABLE IF NOT EXISTS animals (
id INTEGER PRIMARY KEY NOT NULL,
name_dt TEXT UNIQUE NOT NULL,
description TEXT,
size INTEGER NOT NULL,
last_modified INTEGER DEFAULT (strftime('%s', 'now'))
);
CREATE INDEX IF NOT EXISTS animals_index_name_dt ON animals (name_dt);
CREATE TRIGGER IF NOT EXISTS animals_trigger_last_modified AFTER UPDATE ON animals
FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified  
BEGIN  
    UPDATE messages SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;   
END;      
PRAGMA user_version = 1;
`

export const createAnimalsData = `
DELETE FROM animals;
INSERT INTO animals (name_dt,description,size) VALUES ("Cat","The domestic cat is a member of the Felidae",19);
INSERT INTO animals (name_dt,description,size) VALUES ("Dog","The dog is a member of the genus Canis",30);
INSERT INTO animals (name_dt,description,size) VALUES ("Lion","A large tawny-coloured cat that lives in prides, found in Africa and north-western India",120);
`;

export const createOccurenciesTable =  `
CREATE TABLE IF NOT EXISTS occurencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
    sample_nr INTEGER,
    animal_nr INTEGER,
    count INTEGER,
    latitude FLOAT,
    longitude FLOAT,
    datetime TEXT
    );
`; 
export const createOccurenceData = `
    INSERT INTO occurencies (sample_nr, animal_nr, count, latitude, longitude, datetime) VALUES (?,?,1,?,?,?);
`;