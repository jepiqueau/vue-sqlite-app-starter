export const createTablesEncrypted = `
    CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY NOT NULL,
        email TEXT UNIQUE NOT NULL,
        name TEXT
    );
    PRAGMA user_version = 1;
`;
export const createDataEncrypted = `
    DELETE FROM contacts;
    INSERT INTO contacts (name,email) VALUES ("Whiteley","Whiteley.com");
    INSERT INTO contacts (name,email) VALUES ("Jones","Jones.com");
`;

