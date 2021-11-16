import log from '@shared/logger'

module.exports.ping = async event => {
  log('info', event)
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
