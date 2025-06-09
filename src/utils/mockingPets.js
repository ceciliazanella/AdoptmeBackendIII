import { faker } from "@faker-js/faker";

export const generateMockPets = (numPets) => {
  const pets = [];

  for (let i = 0; i < numPets; i++) {
    const specie = faker.helpers.arrayElement(["Dog", "Cat"]);

    const breed = specie === "Dog" ? faker.animal.dog() : faker.animal.cat();

    const image = faker.image.urlPicsumPhotos({ category: "animals" });

    pets.push({
      _id: faker.database.mongodbObjectId(),
      name: faker.person.firstName(),
      specie,
      breed,
      birthDate: faker.date.past({ years: 15 }),
      adopted: false,
      owner: null,
      image,
    });
  }
  return pets;
};
