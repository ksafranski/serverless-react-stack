import log from './@shared/logger/log'

module.exports.ping = async event => {
  log('info', { message: 'Ping Request', event })
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Ok',
      },
      null,
      2
    ),
  }
}
