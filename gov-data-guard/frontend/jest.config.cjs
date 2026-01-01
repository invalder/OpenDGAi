module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  transform: {
     '^.+\\.tsx?$': ['ts-jest', {
       diagnostics: {
         ignoreCodes: [1343]
       }
     }]
  }
};
