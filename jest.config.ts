/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

const config: Config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    // Include specific directories - uncomment these if you want to collect from all files
    "components/**/*.{ts,tsx,js,jsx}",
    "!components/ui/**/*",
    "!components/sidebar/*",
    "!components/tasks/*",
    "!components/profile/*",
    
    // Exclude specific directories
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/dist/**",
    "!app/layout.tsx",
    "!app/task/*",
    "!app/profile/**",
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // Skip coverage collection for certain paths
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/",
    "/.next/",
    "/coverage/"
  ],

  // File extensions your modules use
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Module name mapper for path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  // Setup files for testing environment
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // The test environment that will be used for testing
  testEnvironment: "jsdom",

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],

  // Paths to ignore when running tests
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.next/"
  ],

  // Transform files with specific transformers if needed
  transformIgnorePatterns: [
    "/node_modules/(?!.*\\.mjs$)",
  ]
};

export default createJestConfig(config);