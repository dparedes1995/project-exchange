module.exports = {
  moduleFileExtensions: ['js', 'ts'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.ts'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/test/',
    '/test/',
    'src/utils/*',
    '\\.dto\\.ts$', // dto files
    '\\.module\\.ts$', // module files
    '\\.strategy\\.ts$', // strategy files
    '\\.filter\\.ts$', // strategy files
    'src/main.ts',
    '/dist/',
  ],
};
