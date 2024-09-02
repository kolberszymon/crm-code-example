import { faker } from "@faker-js/faker";

const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = () => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int(40),
    visits: faker.number.int(1000),
    progress: faker.number.int(100),
    status: faker.helpers.shuffle(["relationship", "complicated", "single"])[0],
  };
};

const newToken = () => {
  const randomDate = faker.date.between({
    from: "2023-01-01T00:00:00.000Z",
    to: "2023-12-31T23:59:59.999Z",
  });
  const formattedTime = randomDate.toTimeString().split(" ")[0]; // Extracts HH:mm:ss
  const formattedDate = `${String(randomDate.getDate()).padStart(
    2,
    "0"
  )}.${String(randomDate.getMonth() + 1).padStart(
    2,
    "0"
  )}.${randomDate.getFullYear()}`;

  return {
    id: faker.number.int({ from: 0, to: 1000000 }),
    date: formattedDate,
    time: formattedTime,
    balance: faker.number.int({ from: 0, to: 1000000 }),
    transactionAmount: faker.number.int({ from: 0, to: 1000000 }),
  };
};

export function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d) => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };

  return makeDataLevel();
}

export function makeDataToken(len) {
  return range(len).map((d) => {
    return {
      ...newToken(),
    };
  });
}
