const fs = require('fs')
var getDirName = require('path').dirname
const config = require('../local.config')

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Create nginx config from web and lambda config
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

const nginxConfig = `
server {
  listen 80 default_server;
  server_name _;

  location ${config.web.httpPath} {
    proxy_pass  http://127.0.0.1:${config.web.httpPort};
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 86400;
  }

${config.functions
  .map(
    l => `
  location ~ ${l.httpPath}/(?<path>.+) {
    proxy_pass  http://127.0.0.1:${l.httpPort}/$path$is_args$args;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
`
  )
  .join('\n')}
}
`

function writeFile(path, contents, cb = () => null) {
  fs.mkdir(getDirName(path), { recursive: true }, function(err) {
    if (err) throw err
    fs.writeFile(path, contents, () => null)
  })
}

writeFile('/etc/nginx/sites-enabled/default', nginxConfig)

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Write environment startup script
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

const procNames = `-n web,${config.functions.map(l => l.name).join(',')}`

const functionsProcCommands = config.functions
  .map(
    l =>
      `"cd ${l.path} && $(npm bin)/sls offline --httpPort ${
        l.httpPort
      } --lambdaPort ${l.httpPort + 1000}"`
  )
  .join(' ')

const environmentVariables = `
export WEB_HTTP_PATH=${config.web.httpPath}
${config.functions
  .map(
    l => `
export FUNCTION_${l.name.toUpperCase()}_HTTP_PORT=${l.httpPort}
export FUNCTION_${l.name.toUpperCase()}_HTTP_PATH=${l.httpPath}
`
  )
  .join('')}
`

const startupScript = `
#!/bin/sh
concurrently ${procNames} \
  "cd ./web && yarn dev" \
  ${functionsProcCommands} \
  ${environmentVariables}
`

writeFile('./tmp/startup.sh', startupScript)
