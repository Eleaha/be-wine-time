export interface Data {
    brewData: Brew[],
    noteTypeData: NoteTypes[],
    noteData: Note[],
    recipeData: Recipe[],
    userData: User[]
}

export interface Brew {
	maker: string,
	brew_name: string,
	date_started: string,
	start_hydro_reading: number,
	current_percentage: number,
	yeast_used: string,
	volume_in_gals: number,
	date_finished: string,
	finished: boolean
}

export interface NoteTypes {
    type: string
}

export interface Note {
    maker: string,
    date_added: string,
    type: string,
    note_title: string,
    body: any
}

export interface Recipe {
    maker: string,
    recipe_name: string,
    date_added: string,
    link: string,
    body: string,
    image: string,
    rating: number,
    hidden: boolean

}

export interface User {
    username: string,
    password: string,
    email: string,
}