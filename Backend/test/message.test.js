import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

import { app, io, userMap } from "../server.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";


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

describe("Chat Service API", () => {
  let user1, user2, token1;

  beforeEach(async () => {
    await User.deleteMany();
    await Message.deleteMany();

    // Create two users manually
    user1 = await User.create({
      fullName: "User One",
      email: "user1@example.com",
      password: "hashedpass1",
    });

    user2 = await User.create({
      fullName: "User Two",
      email: "user2@example.com",
      password: "hashedpass2",
    });
  });

  it("should return all contacts excluding self", async () => {
    const res = await request(app).get(`/api/chat/contacts/${user1._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.users.length).toBe(1);
    expect(res.body.data.users[0].email).toBe(user2.email);
  });

  it("should send a new message successfully", async () => {
    const res = await request(app).post(`/api/chat/send`).send({
      senderId: user1._id,
      receiverId: user2._id,
      text: "Hello user2!",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message.text).toBe("Hello user2!");
  });

  it("should return all messages between two users", async () => {
    await Message.create({
      senderId: user1._id,
      receiverId: user2._id,
      text: "Hey there!",
    });

    const res = await request(app).get(
      `/api/chat/messages/${user1._id}/${user2._id}`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message[0].text).toBe("Hey there!");
  });

  it("should return chat partners for a user", async () => {
    await Message.create({
      senderId: user1._id,
      receiverId: user2._id,
      text: "Chat started",
    });

    const res = await request(app).get(`/api/chat/partners/${user1._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.chatParteners[0].email).toBe(user2.email);
  });
});
