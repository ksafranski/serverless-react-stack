module.exports = {
  web: {
    httpPath: '/',
    httpPort: 8080,
  },
  functions: [
    {
      name: 'auth',
      path: './functions/auth',
      httpPort: 8081,
      httpPath: '/api/auth',
    },
    {
      name: 'data',
      path: './functions/data',
      httpPort: 8082,
      httpPath: '/api/data',
    },
  ],
}
