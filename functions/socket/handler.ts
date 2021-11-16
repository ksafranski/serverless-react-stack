module.exports.socket = async event => {
  const {
    requestContext: { routeKey, connectionId },
  } = event
  switch (routeKey) {
    case '$connect':
      console.log('CONNECTED:', connectionId)
      break

    case '$disconnect':
      console.log('DISCONNECTED', connectionId)
      break

    case '$default':
    default:
      console.log('SOCKET MESSAGE RECEIVED:', event.body)
  }

  return { statusCode: 200 }
}
