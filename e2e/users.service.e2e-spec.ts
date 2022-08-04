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

afterAll(() => {
  application.close();
})

describe('User Service', () => {
  it('Register: error', async () => {
    const result = await request(application.app)
      .post('/auth/register')
      .send(testUser);

    expect(result.statusCode).toBe(422);
  })
})