import format from "pg-format";
import { db } from "./db-connection";
import { dropTables, createTables } from "./manage-tables";
import { Data } from "../interfaces";

export const seed = async ({
	brewData,
	noteTypeData,
	noteData,
	recipeData,
	userData,
}: Data) => {
	await dropTables();
	await createTables();

	const insertUserData = format(
		`INSERT INTO users (username, password, email)
    VALUES
    %L;`,
		userData.map(({ username, email, password }) => [username, email, password])
	);
	await db.query(insertUserData);

	const insertBrewData = format(
		`INSERT INTO brews (maker, brew_name, date_started, start_hydro_reading, current_percentage, yeast_used, volume_in_gals, date_finished, finished)
    VALUES
    %L;`,
		brewData.map(
			({
				maker,
				brew_name,
				date_started,
				start_hydro_reading,
				current_percentage,
				yeast_used,
				volume_in_gals,
				date_finished,
				finished,
			}) => [
				maker,
				brew_name,
				date_started,
				start_hydro_reading,
				current_percentage,
				yeast_used,
				volume_in_gals,
				date_finished,
				finished,
			]
		)
	);
	await db.query(insertBrewData);

	const insertNoteTypeData = format(
		`INSERT INTO note_types (type)
    VALUES
    %L;`,
		noteTypeData.map(({ type }) => [type])
	);
	await db.query(insertNoteTypeData);

	const insertNoteData = format(
		`INSERT INTO notes (maker, type, note_title, body)
    VALUES
    %L;`,
		noteData.map(({ maker, type, note_title, body }) => [
			maker,
			type,
			note_title,
			body,
		])
	);
	await db.query(insertNoteData);

	const insertRecipeData = format(
		`INSERT INTO recipes (maker, recipe_name, date_added, link, body, image, rating, public)
    VALUES
    %L;`,
		recipeData.map(
			({
				maker,
				recipe_name,
				date_added,
				link,
				body,
				image,
				rating,
				hidden,
			}) => [maker, recipe_name, date_added, link, body, image, rating, hidden]
		)
	);
	await db.query(insertRecipeData);
};
