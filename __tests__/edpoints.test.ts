import request from "supertest";
import { app } from "../app";
import { seed } from "../src/db/seed";
import { data } from "../src/data/test-data/data-index";
import { db } from "../src/db/db-connection";
import { Brew, User } from "../src/interfaces";
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
        const { body } = await request(app)
            .get("/api/users/garbage")
            .expect(400);
        expect(body.msg).toBe("Bad request");
    });
});

describe("/api/users/:user_id/brews", () => {
    describe("GET /api/users/:user_id/brews", () => {
        test("GET 200 /api/users/:user_id/brews - responds with an array of brews relating to the current user", async () => {
            const { body } = await request(app)
                .get("/api/users/2/brews")
                .expect(200);
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
            const { body } = await request(app)
                .get("/api/users/2000/brews")
                .expect(404);
            expect(body.msg).toBe("Not found");
        });
        test("GET 404 - responds with a special 404 error when passed an existing id with no associated brews", async () => {
            const { body } = await request(app)
                .get("/api/users/3/brews")
                .expect(404);
            expect(body.msg).toBe("No brews yet!");
        });
        test("GET 400 - responds with a 400 error when passed an invalid id", async () => {
            const { body } = await request(app)
                .get("/api/users/garbage/brews")
                .expect(400);
            expect(body.msg).toBe("Bad request");
        });
    });
    describe("POST /api/users/:user_id/brews", () => {
        test("POST 201 /api/users/:user_id/brews - responds with the newly inserted brew object", async () => {
            const payload: Brew = {
                brew_name: "Cherry Wine",
                date_started: "2024-06-10T21:03:28.822Z",
            };
            const { body } = await request(app)
                .post("/api/users/2/brews")
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
        test("POST 400 /api/users/:user_id/brews - 400 code when post body has incorrect format", async () => {
            const payload = {
                garbage: "also garbage",
                date_started: "2024-06-10T21:03:28.822Z",
            };
            const { body } = await request(app)
                .post("/api/users/2/brews")
                .send(payload)
                .expect(400);
            expect(body["msg"]).toBe("Bad request");
        });
        test("POST 400 /api/users/:user_id/brews - 400 code when post body has invalid values", async () => {
            const payload = {
                brew_name: "Cherry wine",
                date_started: "2024-06-10T21:03:28.822Z",
                recipe_id: "not a number",
            };
            const { body } = await request(app)
                .post("/api/users/2/brews")
                .send(payload)
                .expect(400);
            expect(body["msg"]).toBe("Bad request");
        });
      test("POST 404 /api/users/:user_id/brews - 404 code when a non existant id is given", async () => {
          const payload = {
              brew_name: "Cherry wine",
              date_started: "2024-06-10T21:03:28.822Z",
          };
          const { body } = await request(app)
              .post("/api/users/3000/brews")
              .send(payload)
              .expect(404);
          expect(body["msg"]).toBe("Not found");
      });
       test("POST 400 /api/users/:user_id/brews - 404 code when an invalid id is given", async () => {
           const payload = {
               brew_name: "Cherry wine",
               date_started: "2024-06-10T21:03:28.822Z",
           };
           const { body } = await request(app)
               .post("/api/users/garbage/brews")
               .send(payload)
               .expect(400);
           expect(body["msg"]).toBe("Bad request");
       });
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
            const { body } = await request(app)
                .get("/api/brews/garbage")
                .expect(400);
            expect(body.msg).toBe("Bad request");
        });
        test("GET 404: /abi/brew/:brew_id - responds with a 404 error when given a non-existent", async () => {
            const { body } = await request(app)
                .get("/api/brews/2000")
                .expect(404);
            expect(body.msg).toBe("Not found");
        });
    });
});
