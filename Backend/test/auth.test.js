import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

import { app } from "../server.js"; // import your express app

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe("Auth Routes", () => {
  const userData = {
    fullName: "Test User",
    email: "test@example.com",
    password: "StrongPass123!",
  };

  it("should register a user successfully", async () => {
    const res = await request(app).post("/api/auth/signup").send(userData);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(userData.email);
  });

  it("should fail to register with weak password", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ ...userData, password: "123" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should login successfully", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it("should logout successfully", async () => {
    const login = await request(app).post("/api/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    const cookie = login.headers["set-cookie"];
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Logged out successfully");
  });
});
