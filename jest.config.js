module.exports = {
  verbose: true,
  transform: {
    '^.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  globals: {
    NODE_ENV: 'test'
  }
};
