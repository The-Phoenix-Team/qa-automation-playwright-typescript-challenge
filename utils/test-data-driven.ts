// ✅ utils/test-data-driven.ts
import { UserType, ProductType, PaymentType, UserScenario } from "./types";

// FOLLWOING LINES are active at the end of the file!!
// Alias exports for test usage at the end of this file,
// export const userConfig = users;
// export const paymentConfig = payments;
// export const productConfig = products; // optional
// export const scenarioConfig = scenarios; // optional

export const users: Record<string, UserType> = {
  standard_user: { username: "standard_user", password: "secret_sauce" },
  problem_user: { username: "problem_user", password: "secret_sauce" },
  locked_out_user: { username: "locked_out_user", password: "secret_sauce" },
};

export const payments: Record<string, PaymentType> = {
  valid_1: { firstName: "Ali", lastName: "Khan", postalCode: "12345" },
  valid_2: { firstName: "Fatima", lastName: "Rahman", postalCode: "90210" },
  invalid_1: { firstName: "", lastName: "NoFirstName", postalCode: "" },
};

export const products: Record<string, ProductType> = {
  "sauce-labs-backpack": {
    id: "sauce-labs-backpack",
    name: "Sauce Labs Backpack",
    description: "Carry all the things...",
    price: "$29.99",
    imageSrc: "/static/media/sauce-backpack-1200x1500.34e7aa42.jpg",
  },
  "sauce-labs-bike-light": {
    id: "sauce-labs-bike-light",
    name: "Sauce Labs Bike Light",
    description: "Bright and useful bike light.",
    price: "$9.99",
    imageSrc: "/static/media/bike-light-1200x1500.a0c9caae.jpg",
  },
  "sauce-labs-bolt-t-shirt": {
    id: "sauce-labs-bolt-t-shirt",
    name: "Sauce Labs Bolt T-Shirt",
    description: "A cool t-shirt for testers.",
    price: "$15.99",
    imageSrc: "/static/media/bolt-shirt-1200x1500.c0dae290.jpg",
  },
  "sauce-labs-fleece-jacket": {
    id: "sauce-labs-fleece-jacket",
    name: "Sauce Labs Fleece Jacket",
    description:
      "It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day of testing.",
    price: "$49.99",
    imageSrc: "/static/media/sauce-pullover-1200x1500.439fc934.jpg",
  },
  "sauce-labs-onesie": {
    id: "sauce-labs-onesie",
    name: "Sauce Labs Onesie",
    description:
      "Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel.",
    price: "$7.99",
    imageSrc: "/static/media/red-onesie-1200x1500.2ec615b2.jpg",
  },
  "test.allthethings()-t-shirt-(red)": {
    id: "test.allthethings()-t-shirt-(red)",
    name: "Test.allTheThings() T-Shirt (Red)",
    description:
      "This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.",
    price: "$15.99",
    imageSrc: "/static/media/red-tatt-1200x1500.30dadef4.jpg",
  },
};

export const scenarios: UserScenario[] = [
  {
    scenarioName: "Standard user completes checkout",
    user: users["standard_user"],
    cartItems: ["sauce-labs-backpack"],
    payment: payments["valid_1"],
    expectedOutcome: "success",
  },
  {
    scenarioName: "Standard user fails with bad payment",
    user: users["standard_user"],
    cartItems: ["sauce-labs-backpack"],
    payment: payments["invalid_1"],
    expectedOutcome: "failure",
  },
  {
    scenarioName: "Standard user adds 3 items and checks out",
    user: users["standard_user"],
    cartItems: [
      "sauce-labs-backpack",
      "sauce-labs-bike-light",
      "sauce-labs-bolt-t-shirt",
    ],
    payment: payments["valid_2"],
    expectedOutcome: "success",
  },
  {
    scenarioName: "Edge Case: Standard user adds all items and checks out",
    user: users["standard_user"],
    cartItems: [
      "sauce-labs-backpack",
      "sauce-labs-bike-light",
      "sauce-labs-bolt-t-shirt",
      "sauce-labs-fleece-jacket",
      "sauce-labs-onesie",
      "test.allthethings()-t-shirt-(red)",
    ],
    payment: payments["valid_2"],
    expectedOutcome: "success",
  },
];
// Alias exports for test usage
export const userConfig = users;
export const paymentConfig = payments;
export const productConfig = products; // optional
export const scenarioConfig = scenarios; // optional
