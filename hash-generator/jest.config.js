module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['lib/**/*.js'],
  moduleFileExtensions: ['js', 'json', 'node'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
    'jest-watch-select-projects',
  ],
}