import request from "supertest";
import { app } from "../app";
import { seed } from "../src/db/seed";
import { data } from "../src/data/test-data/data-index";
import { db } from "../src/db/db-connection";
import { Brew, Note, Recipe, User, Wine } from "../src/interfaces";
import endpoints from "../endpoints.json";

afterAll(() => db.end());

beforeEach(() => {
	return seed(data);
});

describe("general errors", () => {
	test("GET 404 /invalid/path - handles general 404 invalid path errors", async () => {
		const { body } = await request(app).get("/garbage").expect(404);
		expect(body.msg).toBe("Not found");
	});
});

describe("/api", () => {
	test("GET 200 /api - responds with a json containing all that available endpoints", async () => {
		const { body } = await request(app).get("/api").expect(200);
		expect(body.endpoints).toEqual(endpoints);
	});
});

describe("/api/users", () => {
	test("GET 200 /api/users - responds with an array of all users", async () => {
		const { body } = await request(app).get("/api/users").expect(200);
		const { users } = body;
		expect(users).toHaveLength(3);
		users.map((user: User) => {
			expect(user).toMatchObject({
				username: expect.any(String),
				password: expect.any(String),
				email: expect.any(String),
			});
		});
	});
});

describe("/api/users/:user_id", () => {
	describe("GET /api/users/:user_id", () => {
		test("GET 200 /api/users/:user_id - responds with an object containing user information plus number of completed and in progress brews", async () => {
			const { body } = await request(app).get("/api/users/3").expect(200);
			const { user } = body;
			expect(user).toEqual({
				id: 3,
				username: "tobycatXOXO",
				password: "theRealTobyCat#",
				email: "tobycat@hotmail.co.uk",
				brews_in_progress: 0,
				completed_brews: 0,
			});
		});
	});
	test("GET 404 /api/users/:user_id - responds with a 404 error for a non existent user id", async () => {
		const { body } = await request(app).get("/api/users/300").expect(404);
		expect(body.msg).toBe("Not found");
	});
	test("GET 400 /api/users/:user_id - responds with a 400 error for an invalid username", async () => {
		const { body } = await request(app).get("/api/users/garbage").expect(400);
		expect(body.msg).toBe("Bad request");
	});
});

describe("/api/brews", () => {
	test("GET 200: /api/brews - responds with an array of all brews", async () => {
		const { body } = await request(app).get("/api/brews").expect(200);
		const { brews } = body;
		expect(brews).toHaveLength(5);
		brews.forEach((brew: Brew) => {
			expect(brew).toEqual(
				expect.objectContaining({
					id: expect.any(Number),
					maker_id: expect.any(Number),
					brew_name: expect.any(String),
					date_started: expect.any(String),
				})
			);
			expect(brew).toHaveProperty("start_hydro_reading");
			expect(brew).toHaveProperty("current_percentage");
			expect(brew).toHaveProperty("recipe_id");
			expect(brew).toHaveProperty("yeast_used");
			expect(brew).toHaveProperty("volume_in_gals");
			expect(brew).toHaveProperty("date_finished");
			expect(brew).toHaveProperty("finished");
		});
	});
});

describe("/api/brews/:brew_id", () => {
	describe("GET /api/brews/:brew_id", () => {
		test("GET 200: /api/brews/:brew_id - responds with an object containing the corresponding brew", async () => {
			const { body } = await request(app).get("/api/brews/2").expect(200);
			expect(body.brew).toMatchObject({
				id: 2,
				maker_id: 1,
				brew_name: "Strawberry wine",
				date_started: "2024-03-05T21:03:28.822Z",
				start_hydro_reading: "1.122",
				current_percentage: "14.9",
				recipe_id: 2,
				yeast_used: "Lalvin e118",
				volume_in_gals: 2,
				finished: false,
			});
		});
		test("GET 400: /abi/brew/:brew_id - responds with a 400 error when given an invalid id", async () => {
			const { body } = await request(app).get("/api/brews/garbage").expect(400);
			expect(body.msg).toBe("Bad request");
		});
		test("GET 404: /abi/brew/:brew_id - responds with a 404 error when given a non-existent", async () => {
			const { body } = await request(app).get("/api/brews/2000").expect(404);
			expect(body.msg).toBe("Not found");
		});
	});
	describe("PATCH /api/brews/:brew_id", () => {
		test("PATCH 200 /api/brews/:brew_id - responds with updated brew object", async () => {
			const payload = {
				recipe_id: 4,
				yeast_used: "Lalvin e118",
			};
			const { body } = await request(app)
				.patch("/api/brews/5")
				.send(payload)
				.expect(200);
			expect(body["brew"]).toMatchObject({
				id: 5,
				maker_id: 2,
				brew_name: "Lavender",
				date_started: "2024-06-10T21:03:28.822Z",
				start_hydro_reading: null,
				current_percentage: "0.0",
				recipe_id: 4,
				yeast_used: "Lalvin e118",
				volume_in_gals: null,
				date_finished: null,
				finished: false,
			});
		});
		test("PATCH 400 /api/brews/:brew_id - invalid request format", async () => {
			const { body } = await request(app)
				.patch("/api/brews/5")
				.send({
					garbage: true,
				})
				.expect(400);
			expect(body.msg).toBe("Bad request");
		});
		test("PATCH 400 /api/brews/:brew_id - invalid datatypes", async () => {
			const { body } = await request(app)
				.patch("/api/brews/5")
				.send({
					finished: "yes it has",
				})
				.expect(400);
			expect(body.msg).toBe("Bad request");
		});
		test("PATCH 404 /api/brews/:brew_id - non existent brew id", async () => {
			const { body } = await request(app)
				.patch("/api/brews/3000")
				.send({
					recipe_id: 4,
					yeast_used: "Lalvin e118",
				})
				.expect(404);
			expect(body.msg).toBe("Not found");
		});
		test("PATCH 400 /api/brews/:brew_id - invalid brew id", async () => {
			const { body } = await request(app)
				.patch("/api/brews/garbage")
				.send({
					recipe_id: 4,
					yeast_used: "Lalvin e118",
				})
				.expect(400);
			expect(body.msg).toBe("Bad request");
		});
	});
	describe("DELETE /api/brews/:brew_id", () => {
		test("DELETE 204 /api/brews/:brew_id - responds with only the status code when successfully deleted", async () => {
			const brewBodyBefore: any = await request(app).get("/api/brews");
			expect(brewBodyBefore["body"]["brews"]).toHaveLength(5);

			const { body } = await request(app).delete("/api/brews/1").expect(204);

			const brewBodyAfter: any = await request(app).get("/api/brews");
			expect(brewBodyAfter["body"]["brews"]).toHaveLength(4);
		});
		test("DELETE 404 /api/brews/:brew_id - if the given id doesn't exist", async () => {
			const { body } = await request(app).delete("/api/brews/5000").expect(404);
			expect(body.msg).toBe("Not found");
		});
		test("DELETE 400 /api/brews/:brew_id - if given i d is invalid", async () => {
			const { body } = await request(app).delete("/api/brews/garbage").expect(400);
			expect(body.msg).toBe("Bad request");
		});
	});
});

describe("/api/brews/user/:user_id", () => {
	describe("GET /api/brews/user/:user_id", () => {
		test("GET 200 /api/brews/user/:user_id - responds with an array of brews relating to the current user", async () => {
			const { body } = await request(app).get("/api/brews/user/2").expect(200);
			const { brews } = body;
			expect(brews).toHaveLength(3);
			brews.forEach((brew: Brew) => {
				expect(brew).toEqual(
					expect.objectContaining({
						id: expect.any(Number),
						maker_id: expect.any(Number),
						brew_name: expect.any(String),
						date_started: expect.any(String),
					})
				);
				expect(brew).toHaveProperty("start_hydro_reading");
				expect(brew).toHaveProperty("current_percentage");
				expect(brew).toHaveProperty("recipe_id");
				expect(brew).toHaveProperty("yeast_used");
				expect(brew).toHaveProperty("volume_in_gals");
				expect(brew).toHaveProperty("date_finished");
				expect(brew).toHaveProperty("finished");
			});
		});
		test("GET 404 - responds with a 404 error when passed a non existent id", async () => {
			const { body } = await request(app).get("/api/brews/user/2000").expect(404);
			expect(body.msg).toBe("Not found");
		});
		test("GET 404 - responds with a special 404 error when passed an existing id with no associated brews", async () => {
			const { body } = await request(app).get("/api/brews/user/3").expect(404);
			expect(body.msg).toBe("No brews yet!");
		});
		test("GET 400 - responds with a 400 error when passed an invalid id", async () => {
			const { body } = await request(app)
				.get("/api/brews/user/garbage")
				.expect(400);
			expect(body.msg).toBe("Bad request");
		});
	});
	describe("POST /api/brews/user/:user_id", () => {
		test("POST 201 /api/brews/user/:user_id - responds with the newly inserted brew object", async () => {
			const payload: Brew = {
				brew_name: "Cherry Wine",
				date_started: "2024-06-10T21:03:28.822Z",
			};
			const { body } = await request(app)
				.post("/api/brews/user/2")
				.send(payload)
				.expect(201);
			const { brew } = body;
			expect(brew).toEqual({
				id: 6,
				maker_id: 2,
				brew_name: "Cherry Wine",
				date_started: "2024-06-10T21:03:28.822Z",
				start_hydro_reading: null,
				current_percentage: "0.0",
				recipe_id: null,
				yeast_used: null,
				volume_in_gals: null,
				date_finished: null,
				finished: false,
			});
		});
		test("POST 400 /api/brews/user/:user_id - 400 code when post body has incorrect format", async () => {
			const payload = {
				garbage: "also garbage",
				date_started: "2024-06-10T21:03:28.822Z",
			};
			const { body } = await request(app)
				.post("/api/brews/user/2")
				.send(payload)
				.expect(400);
			expect(body["msg"]).toBe("Bad request");
		});
		test("POST 400 /api/brews/user/:user_id - 400 code when post body has invalid values", async () => {
			const payload = {
				brew_name: "Cherry wine",
				date_started: "2024-06-10T21:03:28.822Z",
				recipe_id: "not a number",
			};
			const { body } = await request(app)
				.post("/api/brews/user/2")
				.send(payload)
				.expect(400);
			expect(body["msg"]).toBe("Bad request");
		});
		test("POST 404 /api/brews/user/:user_id - 404 code when a non existant id is given", async () => {
			const payload = {
				brew_name: "Cherry wine",
				date_started: "2024-06-10T21:03:28.822Z",
			};
			const { body } = await request(app)
				.post("/api/brews/user/3000")
				.send(payload)
				.expect(404);
			expect(body["msg"]).toBe("Not found");
		});
		test("POST 400 /api/brews/user/:user_id - 404 code when an invalid id is given", async () => {
			const payload = {
				brew_name: "Cherry wine",
				date_started: "2024-06-10T21:03:28.822Z",
			};
			const { body } = await request(app)
				.post("/api/brews/user/garbage")
				.send(payload)
				.expect(400);
			expect(body["msg"]).toBe("Bad request");
		});
	});
});

describe("/api/recipes", () => {
	describe("GET /api/recipes", () => {
		test("GET 200 /api/recipes - responds with an array of all recipes", async () => {
			const { body } = await request(app).get("/api/recipes").expect(200);
			const { recipes } = body;

			expect(recipes).toHaveLength(4);
			recipes.map((recipe: Recipe) => {
				expect(recipe).toMatchObject({
					id: expect.any(Number),
					maker_id: expect.any(Number),
					recipe_name: expect.any(String),
					date_added: expect.any(String),
					hidden: expect.any(Boolean),
				});
				expect(recipe).toHaveProperty("link");
				expect(recipe).toHaveProperty("body");
				expect(recipe).toHaveProperty("image");
			});
		});
	});
});

describe("/api/recipes/:recipe_id", () => {
	describe("GET /api/recipes/:recipe_id", () => {
		test("GET 200 /api/recipes/:recipes_id - responds with an object relating to the specified id", async () => {
			const { body } = await request(app).get("/api/recipes/1").expect(200);
			const { recipe } = body;
			expect(recipe).toMatchObject({
				id: 1,
				maker_id: 1,
				recipe_name: "Maple Mead",
				date_added: "2023-06-02T16:03:28.822Z",
				link: "https://www.growforagecookferment.com/maple-mead/",
				body: "used 300g more honey",
				image: "www.test/image",
				hidden: true,
			});
		});
		test("GET 404 /api/recipes/:recipes_id - non-existant id is given", async () => {
			const { body } = await request(app).get("/api/recipes/3000").expect(404);
			expect(body["msg"]).toBe("Not found");
		});
		test("GET 400 /api/recipes/:recipes_id - invalid id is given", async () => {
			const { body } = await request(app).get("/api/recipes/garbage").expect(400);
			expect(body["msg"]).toBe("Bad request");
		});
	});
	describe("PATCH /api/recipes/:recipe_id", () => {
		test("PATCH 200 /api/recipes/:recipe_id - responds with the updated recipe object", async () => {
			const payload = {
				link: "www.payloadlink.com/lemon mint and lavander",
				hidden: true,
			};
			const { body } = await request(app)
				.patch("/api/recipes/4")
				.send(payload)
				.expect(200);
			const { recipe } = body;
			expect(recipe).toMatchObject({
				maker_id: 2,
				recipe_name: "lemon, mint and lavender",
				date_added: "2023-11-26T21:03:28.822Z",
				body:
					"a really detailed recipe on how to make lemon, mint and lavender wine",
				link: "www.payloadlink.com/lemon mint and lavander",
				image: "uploaded lemon mint and lavender pic",
				hidden: true,
			});
		});
		test("PATCH 400 /api/recipes/:recipe_id - bad request body format", async () => {
			const payload = {
				garbage: true,
			};
			const { body } = await request(app)
				.patch("/api/recipes/3")
				.send(payload)
				.expect(400);
			expect(body["msg"]).toBe("Bad request");
		});
		test("PATCH 400 /api/recipes/:recipe_id - bad request body types", async () => {
			const payload = {
				link: "www.payloadlink.com/lemon mint and lavander",
				hidden: "hidden",
			};
			const { body } = await request(app)
				.patch("/api/recipes/3")
				.send(payload)
				.expect(400);
			expect(body["msg"]).toBe("Bad request");
		});
		test("PATCH 404 /api/recipes/:recipe_id - non-existant recipe id", async () => {
			const payload = {
				link: "www.payloadlink.com/lemon mint and lavander",
				hidden: true,
			};
			const { body } = await request(app)
				.patch("/api/recipes/3000")
				.send(payload)
				.expect(404);
			expect(body["msg"]).toBe("Not found");
		});
		test("PATCH 400 /api/recipes/:recipe_id - invalid recipe id", async () => {
			const payload = {
				link: "www.payloadlink.com/lemon mint and lavander",
				hidden: true,
			};
			const { body } = await request(app)
				.patch("/api/recipes/garbage")
				.send(payload)
				.expect(400);
			expect(body["msg"]).toBe("Bad request");
		});
	});
	describe("DELETE /api/recipes/:recipe_id", () => {
		test("DELETE 204 /api/recipes/:recipe_id - responds with status code only", async () => {
			const { body } = await request(app).delete("/api/recipes/1").expect(204);
			expect(body).toEqual({});
			const recipesBody: any = await request(app).get("/api/recipes");
			expect(recipesBody.body.recipes).toHaveLength(3);
		});
	});
	test("DELETE 404 /api/recipes/:Recipe_id - when given a non-existant id", async () => {
		const { body } = await request(app).delete("/api/recipes/3000").expect(404);
		expect(body["msg"]).toBe("Not found");
	});
	test("DELETE 400 /api/recipes/:Recipe_id - when given an invalid id", async () => {
		const { body } = await request(app)
			.delete("/api/recipes/garbage")
			.expect(400);
		expect(body["msg"]).toBe("Bad request");
	});
});

describe("/api/recipes/user/:user_id", () => {
	describe("GET /api/recipes/user/:user_id", () => {
		test("GET 200 /api/recipes/user/:user_id - responds with an array of recipes related to the specified user", async () => {
			const { body } = await request(app).get("/api/recipes/user/2").expect(200);
			const { recipes } = body;
			expect(recipes).toHaveLength(3);
			recipes.forEach((recipe: Recipe) => {
				expect(recipe).toMatchObject({
					id: expect.any(Number),
					maker_id: expect.any(Number),
					recipe_name: expect.any(String),
					date_added: expect.any(String),
					hidden: expect.any(Boolean),
				});
				expect(recipe).toHaveProperty("link");
				expect(recipe).toHaveProperty("body");
				expect(recipe).toHaveProperty("image");
			});
		});
		test("GET 404 /api/recipes/user/:user_id - given a non-existent id", async () => {
			const { body } = await request(app)
				.get("/api/recipes/user/3000")
				.expect(404);
			expect(body["msg"]).toBe("Not found");
		});
		test("GET 400 /api/recipes/user/:user_id - given an invalid id", async () => {
			const { body } = await request(app)
				.get("/api/recipes/user/garbage")
				.expect(400);
			expect(body["msg"]).toBe("Bad request");
		});
		test("GET 404 /api/recipes/user/:user_id - given a valid id with no associated recipes", async () => {
			const { body } = await request(app).get("/api/recipes/user/3").expect(404);
			expect(body["msg"]).toBe("No recipes yet!");
		});
	});
	describe("POST /api/recipes/user/:user_id", () => {
		test("POST 201 /api/recipes/user/:user_id - responds with the newly created recipe object", async () => {
			const payload = {
				recipe_name: "Rubarb wine",
				body:
					"Excepteur consequat exercitation sit nulla eu quis qui Lorem proident cupidatat labore non incididunt.",
			};
			const { body } = await request(app)
				.post("/api/recipes/user/3")
				.expect(201)
				.send(payload);
			const { recipe } = body;
			expect(recipe).toMatchObject({
				maker_id: 3,
				recipe_name: "Rubarb wine",
				date_added: expect.any(String),
				body:
					"Excepteur consequat exercitation sit nulla eu quis qui Lorem proident cupidatat labore non incididunt.",
				link: null,
				image: null,
				hidden: true,
			});
		});
		test("POST 400 /api/recipes/user/:user_id - when given an invalid post body structure", async () => {
			const payload = {
				garbage: "also garbage",
			};
			const { body } = await request(app)
				.post("/api/recipes/user/3")
				.send(payload)
				.expect(400);
			expect(body["msg"]).toBe("Bad request");
		});
		test("POST 400 /api/recipes/user/:user_id - when given an invalid post body types", async () => {
			const payload = {
				recipe_name: "Rubarb wine",
				body:
					"Excepteur consequat exercitation sit nulla eu quis qui Lorem proident cupidatat labore non incididunt.",
				hidded: "maybe",
			};
			const { body } = await request(app)
				.post("/api/recipes/user/3")
				.send(payload)
				.expect(400);
			expect(body["msg"]).toBe("Bad request");
		});
		test("POST 400 /api/recipes/user/:user_id - when given an invalid user id", async () => {
			const payload = {
				recipe_name: "Rubarb wine",
				body:
					"Excepteur consequat exercitation sit nulla eu quis qui Lorem proident cupidatat labore non incididunt.",
			};
			const { body } = await request(app)
				.post("/api/recipes/user/garbage")
				.send(payload)
				.expect(400);
			expect(body["msg"]).toBe("Bad request");
		});
		test("POST 404 /api/recipes/user/:user_id - when given a non-existant user id", async () => {
			const payload = {
				recipe_name: "Rubarb wine",
				body:
					"Excepteur consequat exercitation sit nulla eu quis qui Lorem proident cupidatat labore non incididunt.",
			};
			const { body } = await request(app)
				.post("/api/recipes/user/3000")
				.send(payload)
				.expect(404);
			expect(body["msg"]).toBe("Not found");
		});
	});
});

describe("/api/note-types", () => {
	test("GET /api/note-types - responds with an array of note types", async () => {
		const { body } = await request(app).get("/api/note-types").expect(200);
		const { noteTypes } = body;
		expect(noteTypes).toHaveLength(9);
		noteTypes.forEach((noteType: { type: string }) => {
			expect(noteType).toMatchObject({
				type: expect.any(String),
				description: expect.any(String),
			});
		});
	});
});

describe("/api/notes/:note_id", () => {
	describe("GET /api/notes/:note_id", () => {
		test("GET /api/note/:note_id", async () => {
			const { body } = await request(app).get("/api/notes/1").expect(200);
			const { note } = body;
			expect(note).toEqual({
				id: 1,
				maker_id: 1,
				brew_id: 1,
				date_added: "2023-01-03T21:03:28.822Z",
				type: "yeast-added",
				note_title: "Lalvin K1113 added",
				body: "didn't hydrate first",
			});
		});
		test("GET 404 /api/notes/:note_id - when given a non-existant note id", async () => {
			const { body } = await request(app).get("/api/notes/3000").expect(404);
			expect(body["msg"]).toBe("Not found");
		});
		test("GET 400 /api/notes/:note_id - when given an invalid note id", async () => {
			const { body } = await request(app).get("/api/notes/garbage").expect(400);
			expect(body["msg"]).toBe("Bad request");
		});
	});
	describe("PATCH /api/notes/:note_id", () => {
		test("PATCH 200 /api/notes/:note_id - responds with the updates note object", async () => {
			const payload = {
				body: "nearly ready but still a little sweet",
			};
			const { body } = await request(app)
				.patch("/api/notes/5")
				.send(payload)
				.expect(200);
			const { note } = body;
			expect(note).toEqual({
				id: 5,
				maker_id: 1,
				brew_id: 1,
				date_added: "2023-06-02T21:03:28.822Z",
				type: "tasting-note",
				note_title: "tasting-note",
				body: "nearly ready but still a little sweet",
			});
		});
		test("PATCH 400 /api/notes/:note_id - when given an invalid post body", async () => {
			const payload = {
				update: "nearly ready but still a little sweet",
			};
			const { body } = await request(app)
				.patch("/api/notes/5")
				.send(payload)
				.expect(400);
			expect(body["msg"]).toBe("Bad request");
		});
		test("PATCH 400 /api/notes/:note_id - when given an invalid note type", async () => {
			const payload = {
				note_type: "info",
			};
			const { body } = await request(app)
				.patch("/api/notes/5")
				.send(payload)
				.expect(400);
			expect(body["msg"]).toBe("Bad request");
		});
		test("PATCH 404 /api/notes/:note_id - when given a non-existant note id", async () => {
			const payload = {
				body: "nearly ready but still a little sweet",
			};
			const { body } = await request(app)
				.patch("/api/notes/3000")
				.send(payload)
				.expect(404);
			expect(body["msg"]).toBe("Not found");
		});
		test("PATCH 400 /api/notes/:note_id - when given an invalid id", async () => {
			const payload = {
				body: "nearly ready but still a little sweet",
			};
			const { body } = await request(app)
				.patch("/api/notes/garbage")
				.send(payload)
				.expect(400);
			expect(body["msg"]).toBe("Bad request");
		});
	});
	describe("DELETE /api/notes/:note_id", () => {
		test("DELETE 204 /api/notes/:note_id - deletes the given note returning status code only", async () => {
			await request(app).delete("/api/notes/1").expect(204);
			const notesBody: any = await request(app).get("/api/notes/1").expect(404);
		});
		test("DELETE 404 /api/notes/:note_id - when given a non-existant id", async () => {
			const { body } = await request(app).delete("/api/notes/3000").expect(404);
			expect(body["msg"]).toBe("Not found");
		});
		test("DELETE 400 /api/notes/:note_id - when given an invalid id", async () => {
			const { body } = await request(app).delete("/api/notes/garbage").expect(400);
			expect(body["msg"]).toBe("Bad request");
		});
	});
});

describe("/api/notes/brew/:brew_id", () => {
	describe("GET /api/notes/brew/:brew_id", () => {
		test("GET 200 /api/notes/brew/:brew_id - responds with all the notes associated with the given brew", async () => {
			const { body } = await request(app).get("/api/notes/brew/1").expect(200);
			const { notes } = body;
			expect(notes).toHaveLength(7);
			notes.forEach((note: Note) => {
				expect(note).toMatchObject({
					id: expect.any(Number),
					maker_id: expect.any(Number),
					brew_id: expect.any(Number),
					date_added: expect.any(String),
					type: expect.any(String),
					note_title: expect.any(String),
				});
				expect(note).toHaveProperty("body");
			});
		});
		test("GET 404 /api/notes/brew/:brew_id - when given a non-existant brew id", async () => {
			const { body } = await request(app).get("/api/notes/brew/3000").expect(404);
			expect(body["msg"]).toBe("Not found");
		});
		test("GET 400 /api/notes/brew/:brew_id - when given an invalid brew id", async () => {
			const { body } = await request(app)
				.get("/api/notes/brew/garbage")
				.expect(400);
			expect(body["msg"]).toBe("Bad request");
		});
		test("GET 404 /api/notes/brew/:brew_id - responds with a custom error message when brew is valid but has no notes associated", async () => {
			const { body } = await request(app).get("/api/notes/brew/4").expect(404);
			expect(body["msg"]).toBe("No notes yet!");
		});
	});
	describe("POST /api/notes/brew/:brew_id", () => {
		test("POST 201 /api/notes/brew/:brew_id - responds with the newly created note", async () => {
			const payload = {
				maker_id: 1,
				type: "text",
				note_title: "test",
				body: "test body",
			};
			const { body } = await request(app)
				.post("/api/notes/brew/1")
				.send(payload)
				.expect(201);
			const { note } = body;
			expect(note).toEqual({
				id: 8,
				maker_id: 1,
				brew_id: 1,
				date_added: expect.any(String),
				type: "text",
				note_title: "test",
				body: "test body",
			});
		});
		test("POST 400 /api/notes/brew/:brew_id - when given a bad body format", async () => {
			const payload = {
				maker_id: 1,
				type: "text",
				garbage: "test",
				body: "test body",
			};
			const { body } = await request(app)
				.post("/api/notes/brew/1")
				.send(payload)
				.expect(400);
			expect(body["msg"]).toBe("Bad request");
		});
		test("POST 400 /api/notes/brew/:brew_id - when given an invalid data type", async () => {
			const payload = {
				maker_id: "one",
				type: "text",
				note_title: "test",
				body: "test body",
			};
			const { body } = await request(app)
				.post("/api/notes/brew/1")
				.send(payload)
				.expect(400);
			expect(body["msg"]).toBe("Bad request");
		});
		test("POST 404 /api/notes/brew/:brew_id - when given a non-existant id", async () => {
			const payload = {
				maker_id: 1,
				type: "text",
				note_title: "test",
				body: "test body",
			};
			const { body } = await request(app)
				.post("/api/notes/brew/3000")
				.send(payload)
				.expect(404);
			expect(body["msg"]).toBe("Not found");
		});
		test("POST 404 /api/notes/brew/:brew_id - when given a non-existant id", async () => {
			const payload = {
				maker_id: 1,
				type: "text",
				note_title: "test",
				body: "test body",
			};
			const { body } = await request(app)
				.post("/api/notes/brew/garbage")
				.send(payload)
				.expect(400);
			expect(body["msg"]).toBe("Bad request");
		});
	});
});

describe("/api/wine-rack/:wine_id", () => {
	describe("GET /api/wine-rack/:wine_id", () => {
		test("GET 200 /api/wine-rack/:wine_id - responds with the with specified", async () => {
			const { body } = await request(app).get("/api/wine-rack/1").expect(200);
			expect(body.wine).toMatchObject({
				id: 1,
				batch_name: "Maple Mead",
				brew_id: 1,
				date_bottled: "2024-09-05T21:03:28.822Z",
				num_of_bottles: "6.0",
			});
		});
		test("GET 404 /api/wine-rack/:wine_id - non-existant wine id", async () => {
			const { body } = await request(app).get("/api/wine-rack/3000").expect(404);
			expect(body["msg"]).toBe("Not found");
		});
		test("GET 400 /api/wine-rack/:wine_id - invalid id", async () => {
			const { body } = await request(app)
				.get("/api/wine-rack/garbage")
				.expect(400);
			expect(body["msg"]).toBe("Bad request");
		});
	});
	describe("POST /api/wine-rack/:brew_id", () => {
		test("POST 201 /api/wine-rack/:brew_id - responds with the newly created wine object", async () => {
			const payload = {
				batch_name: "test wine",
				num_of_bottles: 6,
			};
			const { body } = await request(app)
				.post("/api/wine-rack/3")
				.send(payload)
				.expect(201);
			const { wine } = body;
			expect(wine).toEqual({
				id: 4,
				batch_name: "test wine",
				num_of_bottles: "6.0",
				brew_id: 3,
				date_bottled: expect.any(String),
			});
		});
		test("POST 404 /api/wine-rack/:brew_id - when given a non-existant brew_id", async () => {
			const payload = {
				batch_name: "test wine",
				num_of_bottles: 6,
			};
			const { body } = await request(app)
				.post("/api/wine-rack/3000")
				.send(payload)
				.expect(404);
			expect(body.msg).toBe("Not found");
		});
		test("POST 400 /api/wine-rack/:brew_id - when given an invalid brew_id", async () => {
			const payload = {
				batch_name: "test wine",
				num_of_bottles: 6,
			};
			const { body } = await request(app)
				.post("/api/wine-rack/garbage")
				.send(payload)
				.expect(400);
			expect(body.msg).toBe("Bad request");
		});
		test("POST 400 /api/wine-rack/:brew_id - when given a bad request body format", async () => {
			const payload = {
				garbage: "test wine",
				num_of_bottles: 6,
			};
			const { body } = await request(app)
				.post("/api/wine-rack/3")
				.send(payload)
				.expect(400);
			expect(body.msg).toBe("Bad request");
		});
		test("POST 400 /api/wine-rack/:brew_id - when given a bad request body value", async () => {
			const payload = {
				batch_name: "test wine",
				num_of_bottles: "six",
			};
			const { body } = await request(app)
				.post("/api/wine-rack/3")
				.send(payload)
				.expect(400);
			expect(body.msg).toBe("Bad request");
		});
	});
});

describe("/api/wine-rack/:user_id", () => {
	describe("GET /api/wine-rack/user/:user_id", () => {
		test("GET 200 /api/wine-rack/user/:user_id - returns an array of batches of wine", async () => {
			const { body } = await request(app).get("/api/wine-rack/user/1").expect(200);
			const { wineRack } = body;
			expect(wineRack).toHaveLength(2);
			wineRack.forEach((wine: Wine) => {
				expect(wine).toMatchObject({
					id: expect.any(Number),
					batch_name: expect.any(String),
					brew_id: expect.any(Number),
					date_bottled: expect.any(String),
					num_of_bottles: expect.any(String),
				});
			});
		});
		test("GET 404 /api/wine-rack/user/:user_id - non existant user id", async () => {
			const { body } = await request(app)
				.get("/api/wine-rack/uer/3000")
				.expect(404);
			expect(body["msg"]).toBe("Not found");
		});
		test("GET 400 /api/wine-rack/user/:user_id - invalid user id", async () => {
			const { body } = await request(app)
				.get("/api/wine-rack/user/garbage")
				.expect(400);
			expect(body["msg"]).toBe("Bad request");
		});
		test("GET 404 /api/wine-rack/user/:user_id - Custom error for when a user exists but has no associated wines", async () => {
			const { body } = await request(app).get("/api/wine-rack/user/3").expect(404);
			expect(body["msg"]).toBe("No wines in the rack yet!");
		});
	});
});
