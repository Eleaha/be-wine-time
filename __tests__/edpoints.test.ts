import request, { Request } from "supertest";
import { app } from "../app";
import endpoints from "../endpoints.json";
import { seed } from "../src/db/seed";
import { data } from "../src/data/test-data/data-index";
import { db } from "../src/db/db-connection";

afterAll(() => [
	db.end()
])

beforeEach(() => {
	return seed(data)
})

describe("/api", () => {
	test("GET /api", async () => {
		const { body } = await request(app).get("/api").expect(200);
		const testDate: Date = new Date();
		console.log(testDate);
		expect(body.endpoints).toEqual(endpoints);
	});
});
