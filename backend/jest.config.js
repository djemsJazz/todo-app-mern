

/** @type {import("jest").Config} **/
export default {
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/__tests__/unit/**/*.test.ts'],
      preset: 'ts-jest',
      testEnvironment: 'node',
      globals: {
        'ts-jest': {
          tsconfig: 'tsconfig.test.json',
        },
      },
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/__tests__/integration/**/*.test.ts'],
      preset: 'ts-jest',
      testEnvironment: 'node',
      globals: {
        'ts-jest': {
          tsconfig: 'tsconfig.test.json',
        },
      },
      setupFilesAfterEnv: ['<rootDir>/__tests__/integration/setup.ts'],
    }
  ]
};
