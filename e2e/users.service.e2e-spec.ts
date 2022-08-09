import request from "supertest";
import path from 'path';
import fs from 'fs/promises';

import { App } from "../src/app";
import { boot } from "../src/main";
import { UserRegisterDto } from "../src/entities/users/dto/user-register.dto";

let application: App;
let testUser: UserRegisterDto;

const getFixturePath = (filename: string): string => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename: string): Promise<string> => fs.readFile(getFixturePath(filename), 'utf-8');

beforeAll(async () => {
  const { app } = await boot;
  application = app;
  testUser = JSON.parse(await readFile('user.json'));
})

afterAll(async () => {
  application.close();
})

describe('User Service', () => {
  it('Register: success', async () => {
    const result = await request(application.app)
      .post('/auth/register')
      .send({
        name: `Test user ${Math.random() * 1000}`,
        email: `${Math.random() * 1000}@mail.ru`,
        password: "password"
      });

    expect(result.statusCode).toBe(200);
  });

  it('Register: error', async () => {
    const result = await request(application.app)
      .post('/auth/register')
      .send({
        name: "User without email",
        password: "password_1"
      });

    expect(result.statusCode).toBe(422);
  });

  it('Log in: success', async () => {
    const result = await request(application.app)
      .post('/auth/login')
      .send(testUser);

    expect(result.statusCode).toBe(200);
    expect(result.body.accessToken).not.toBeUndefined();
  });

  it('Log in: error', async () => {
    const result = await request(application.app)
      .post('/auth/login')
      .send({ email: "new@mail.ru", password: "wrong-password" });

    expect(result.statusCode).toBe(401);
  });

  it('Get user info: success', async () => {
    const login = await request(application.app)
      .post('/auth/login')
      .send(testUser);

    const result = await request(application.app)
      .get('/auth/info')
      .set('Authorization', `Bearer ${login.body.accessToken}`)

    expect(result.statusCode).toBe(200);
    expect(result.body.id).not.toBeUndefined();
    expect(result.body.email).toBe(testUser.email);
  });

  it('Get user info: error', async () => {
    const result = await request(application.app)
      .get('/auth/info')
      .set({ authorization: 'wrong token' });

    expect(result.statusCode).toBe(401);
  })
})