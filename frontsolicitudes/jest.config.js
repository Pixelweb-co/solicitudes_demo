module.exports = {
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
   
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(axios)/)', // Cambia 'axios' a otros módulos si es necesario
      ],
      testEnvironment: 'jsdom', 
  };