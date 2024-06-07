import request from "supertest";
import { app } from "../app";
import { seed } from "../src/db/seed";
import { data } from "../src/data/test-data/data-index";
import { db } from "../src/db/db-connection";
import { Brew } from "../src/interfaces";
import endpoints from "../endpoints.json";

afterAll(() => db.end());

beforeEach(() => {
	return seed(data);
});

describe("/api", () => {
	test("GET /api", async () => {
		const { body } = await request(app).get("/api").expect(200);
		expect(body.endpoints).toEqual(endpoints);
	});
});

describe("/api/brews", () => {
	test("GET /api/brews - responds with an array of all brews", async () => {
		const { body } = await request(app).get("/api/brews").expect(200);
		const { brews } = body;
		expect(brews).toHaveLength(5);
		brews.forEach((brew: Brew) => {
			expect(brew).toEqual(
				expect.objectContaining({
					id: expect.any(Number),
					maker: expect.any(String),
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
