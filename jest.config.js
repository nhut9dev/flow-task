// jest.config.js
module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  testMatch: ['**/__tests__/**/*.[tj]s?(x)', '<rootDir>/src/tests/**/*.(spec|test).[tj]s?(x)'],
  moduleNameMapper: {
    '^~ui/(.*)$': '<rootDir>/src/components/ui/$1',
    '^~components/(.*)$': '<rootDir>/src/components/$1',
    '^~constants/(.*)$': '<rootDir>/src/constants/$1',
    '^~models/(.*)$': '<rootDir>/src/models/$1',
    '^~assets/(.*)$': '<rootDir>/src/assets/$1',
    '^~types/(.*)$': '<rootDir>/src/types/$1',
    '^~hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^~i18n/(.*)$': '<rootDir>/src/i18n/$1',
    '^~stores/(.*)$': '<rootDir>/src/stores/$1',
    '^~utils/(.*)$': '<rootDir>/src/utils/$1',
    '^~api/(.*)$': '<rootDir>/src/lib/api/$1',
    '^~lib/(.*)$': '<rootDir>/src/lib/$1',
    '^~app/(.*)$': '<rootDir>/src/app/$1',
    '^~/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './jest-results/',
        outputName: 'jest-results.xml',
      },
    ],
    [
      'jest-html-reporter',
      {
        pageTitle: 'Jest Results',
        outputPath: './jest-results/jest-results.html',
      },
    ],
  ],
};
