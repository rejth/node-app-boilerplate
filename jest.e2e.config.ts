/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  rootDir: './e2e',
  preset: 'ts-jest',
  testMatch: ['**/?(*.)+(e2e-spec).[t]s'],
  testPathIgnorePatterns: ['/node_modules/', 'dist', 'build'],
  verbose: true,
};

export default config;
