import { faker } from "@faker-js/faker";

export const generateMockPets = (numPets) => {
  let pets = [];

  for (let i = 0; i < numPets; i++) {
    pets.push({
      name: faker.animal.dog(),
      specie: faker.animal.type(),
      birthDate: faker.date.past(),
      adopted: false,
      image: faker.image.animals(),
    });
  }
  return pets;
};
