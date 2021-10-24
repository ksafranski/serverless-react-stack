'use strict'

module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `Got ${process.env.PGHOST}`,
      },
      null,
      2
    ),
  }
}
