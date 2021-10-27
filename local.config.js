module.exports = {
  web: {
    proxyRoute: '/',
    httpPort: 8080,
  },
  functions: [
    {
      name: 'auth',
      path: './functions/auth',
      httpPort: 8081,
      proxyRoute: '/api/auth',
    },
    {
      name: 'data',
      path: './functions/data',
      httpPort: 8082,
      proxyRoute: '/api/data',
    },
    {
      name: 'socket',
      path: './functions/socket',
      websocketPort: 8083,
      proxyRoute: '/api/socket',
    },
  ],
}
