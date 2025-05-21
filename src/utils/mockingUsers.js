import { fakerES as faker } from "@faker-js/faker";
import { createHash } from "./crypto.utils.js";

export const generateMockUsers = (count = 1) => {
  const roles = ["user", "admin"];

  return Array.from({ length: count }).map(() => ({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: createHash("coder123"),
    role: faker.helpers.arrayElement(roles),
    pets: [],
  }));
};