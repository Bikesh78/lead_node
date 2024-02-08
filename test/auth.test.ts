import { agent as request } from "supertest";
import app from "../app";
import { User } from "../entity/user";
import { appDataSource } from "../utils/db";

const usersInDb = async () => {
  const users = await User.find();
  return users;
};

beforeEach(async () => {
  // connect to database
  await appDataSource.initialize();

  // empty the database
  const entities = appDataSource.entityMetadatas;
  for await (const entity of entities) {
    appDataSource.createQueryBuilder().delete().from(entity.name).execute();
  }
});

afterEach(async () => {
  // close connection to database
  await appDataSource.destroy();
});

test("valid users can be created", async () => {
  const usersAtStart = await usersInDb();

  const newUser = {
    username: "test@name.com",
    password: "dummy123",
    confirm_password: "dummy123",
  };

  const response = await request(app)
    .post("/api/sign-up")
    .send(newUser)
    .expect(201);

  expect(response.status).toBe(201);

  const usersAtEnd = await usersInDb();

  expect(usersAtEnd.length).toBe(usersAtStart.length + 1);
  const username = usersAtEnd.map((user) => user.username);
  expect(username).toContain("test@name.com");
});

test("username is required", async () => {
  const usersAtStart = await usersInDb();

  const newUser = { password: "dummy123", confirm_password: "dummy123" };

  await request(app).post("/api/sign-up").send(newUser).expect(400);

  const usersAtEnd = await usersInDb();

  expect(usersAtEnd).toHaveLength(usersAtStart.length);
});

test("email has to be unique", async () => {
  const newUser = {
    username: "test@name.com",
    password: "dummy123",
    confirm_password: "dummy123",
  };

  await request(app).post("/api/sign-up").send(newUser).expect(201);

  const usersAtStart = await usersInDb();

  const secondUser = {
    username: "test@name.com",
    password: "new_password",
    confirm_password: "new_password",
  };

  await request(app).post("/api/sign-up").send(secondUser).expect(400);
  const usersAtEnd = await usersInDb();

  expect(usersAtEnd).toHaveLength(usersAtStart.length);
});

test("user can login", async () => {
  const user = {
    username: "test@name.com",
    password: "dummy123",
    confirm_password: "dummy123",
  };

  await request(app).post("/api/sign-up").send(user).expect(201);
  const loginUser = {
    username: "test@name.com",
    password: "dummy123",
  };

  await request(app).post("/api/login").send(loginUser).expect(200);
});
