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
	test("GET 200: /api/brews - responds with an array of all brews", async () => {
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
	describe("GET /api/brews/:brew_id", () => {
		test("GET 200: /api/brews/:brew_id - responds with an object containing the corresponding brew", async () => {
			const { body } = await request(app).get("/api/brews/2").expect(200);
			expect(body.brew).toMatchObject({
				id: 2,
				maker: "juzz0604",
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
});
