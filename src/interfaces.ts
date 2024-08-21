export interface Data {
	brewData: Brew[];
	noteTypeData: NoteTypes[];
	noteData: Note[];
	recipeData: Recipe[];
	userData: User[];
    wineRackData: Wine[];
}

export interface Brew {
    id?: number;
    maker_id?: number;
    brew_name: string;
    date_started: string;
    start_hydro_reading?: number | null;
    current_percentage?: number | null;
    yeast_used?: string | null;
    recipe_id?: number | null;
    volume_in_gals?: number | null;
    date_finished?: string | null;
    finished?: boolean | null;
}

export interface NoteTypes {
    type: string;
    description: string;
}

export interface Note {
    id?: number;
    maker_id: number;
    brew_id: number;
    date_added: string;
    type: string;
    note_title: string;
    body?: any | null;
}

export interface Recipe {
	id?: number;
	maker_id: number;
	recipe_name: string;
	date_added: string;
	link?: string | null;
	body?: string | null;
	image?: string | null;
	rating?: number | null;
	hidden?: boolean | null;
}

export interface User {
	id?: number;
	username: string;
	password: string;
	email: string;
}

export interface Wine {
    id?: number;
    batch_name: string;
    brew_id: number;
    date_bottled: string;
    num_of_bottles: number
}
