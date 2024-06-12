export interface Data {
	brewData: Brew[];
	noteTypeData: NoteTypes[];
	noteData: Note[];
	recipeData: Recipe[];
	userData: User[];
}

export interface Brew {
	id?: number;
	maker_id: number;
	brew_name: string;
	date_started: string;
	start_hydro_reading?: number;
	current_percentage?: number;
	yeast_used?: string;
	recipe_id?: number;
	volume_in_gals?: number;
	date_finished?: string;
	finished?: boolean;
}

export interface NoteTypes {
	type: string;
}

export interface Note {
	id?: number;
	maker_id: number;
	brew_id: number;
	date_added: string;
	type: string;
	note_title: string;
	body?: any;
}

export interface Recipe {
	id?: number;
	maker_id: number;
	recipe_name: string;
	date_added: string;
	link?: string;
	body?: string;
	image?: string;
	rating?: number;
	hidden?: boolean;
}

export interface User {
	id?: number;
	username: string;
	password: string;
	email: string;
}
