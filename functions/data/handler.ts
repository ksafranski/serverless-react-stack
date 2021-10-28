'use strict'

module.exports.ping = async event => {
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
