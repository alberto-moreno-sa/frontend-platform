/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    "^@tracking/(.*)$": "<rootDir>/tracking/$1",
    "^@common/(.*)$": "<rootDir>/common/$1",
    "^@config$": "<rootDir>/config/index.ts",
  },
  collectCoverageFrom: ["**/*.ts", "!**/index.ts", "!main.ts"],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
};
