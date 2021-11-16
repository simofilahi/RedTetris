/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverageFrom: [
    "server/**/*.{js,jsx,ts,tsx}",
    // "client/**/*.{js,jsx,ts,tsx}",
    "!server/node_modules/",
    "!client/node_modules/",
  ],
};
