module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  // transform: {
  //   '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  //   '^.+\\.(js|jsx)?$': 'babel-jest'
  // },
  // moduleNameMapper: {
  //   '^@/(.*)$': '<rootDir>/src/$1'
  // },
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testMatch: [
    '<rootDir>/(__tests__/**/**/*.(js|jsx|ts|tsx))'
  ],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
