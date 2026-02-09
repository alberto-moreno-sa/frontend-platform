import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  rootDir: "app",
  testRegex: ".*\\.(test|spec)\\.tsx?$",
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy",
    "^~/(.*)$": "<rootDir>/$1",
    "^react$": "<rootDir>/../node_modules/react",
    "^react/(.*)$": "<rootDir>/../node_modules/react/$1",
    "^react-dom$": "<rootDir>/../node_modules/react-dom",
    "^react-dom/(.*)$": "<rootDir>/../node_modules/react-dom/$1",
    "^recharts$": "<rootDir>/test-utils/recharts-mock.ts",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
        useESM: true,
      },
    ],
  },
  setupFilesAfterEnv: ["<rootDir>/test-setup.ts"],
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/index.ts",
    "!entry.*.{ts,tsx}",
    "!root.tsx",
    "!routes.ts",
  ],
  coverageDirectory: "../coverage",
};

export default config;
