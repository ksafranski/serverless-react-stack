import log from '@shared/logger'

export const ping = async event => {
  log('info', event)
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `Ok`,
      },
      null,
      2
    ),
  }
}
