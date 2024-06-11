import { db } from "./db-connection";

export const dropTables = async () => {
	await db.query(`DROP TABLE IF EXISTS recipes`);
	await db.query(`DROP TABLE IF EXISTS notes`);
	await db.query(`DROP TABLE IF EXISTS note_types`);
	await db.query(`DROP TABLE IF EXISTS brews`);
	await db.query(`DROP TABLE IF EXISTS users`);
};

export const createTables = async () => {
	await db.query(`CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR NOT NULL,
        password VARCHAR NOT NULL,
        email VARCHAR NOT NULL
    );`);
	await db.query(`CREATE TABLE brews (
        id SERIAL PRIMARY KEY,
        maker_id INT NOT NULL REFERENCES users(id),
        brew_name VARCHAR NOT NULL,
        date_started VARCHAR NOT NULL,
        start_hydro_reading DECIMAL(4,3),
        current_percentage DECIMAL(3,1) DEFAULT 0,
        recipe_id INT,
        yeast_used VARCHAR,
        volume_in_gals FLOAT,
        date_finished VARCHAR,
        finished BOOL DEFAULT false
    );`);
	await db.query(`CREATE TABLE note_types (
        type VARCHAR PRIMARY KEY
    )`);
	await db.query(`CREATE TABLE notes (
        id SERIAL PRIMARY KEY,
        maker_id INT NOT NULL REFERENCES users(id),
        brew_id INT NOT NULL REFERENCES brews(id),
        type VARCHAR NOT NULL REFERENCES note_types(type),
        note_title VARCHAR NOT NULL,
        body TEXT
    );`);
	await db.query(`CREATE TABLE recipes (
        id SERIAL PRIMARY KEY,
        maker_id INT NOT NULL REFERENCES users(id),
        recipe_name VARCHAR NOT NULL,
        date_added VARCHAR DEFAULT NOW(),
        link VARCHAR,
        body TEXT,
        image VARCHAR,
        rating DECIMAL (2,1) DEFAULT 0,
        hidden BOOL DEFAULT true
    );`);
};
