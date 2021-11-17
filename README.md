# Serverless + React Stack

A simple, containerized project for quickly starting with Serverless and React. The goal
of this project is to containerize development into an ephemeral enviroment that can be
quickly installed and run with minimal overhead.

## Installation

There are only three dependencies required to run this project:

- Docker: containerization of the environment
- NodeJS: Run local setup
- Binci: Lightweight, ephemeral container orchastration (`npm i binci -g`)

Once the above dependencies are installed you can build the local docker image and install all dependencies by running `binci install`.

## Running Locally

This environment is built to be a quick way to start up a local development environment that mimics your production environment.

To spin up the platform simply run the following:

```
npm run dev
# or...
yarn dev
```

Once this is complete and the web service and all functions have started you can open the web app in your browser at `http://localhost`.

## Web

The web app (`/web`) is a simple React starter. It uses the [Vite](https://vitejs.dev/) bundler by default for simplicity, but can easily be swapped out for your bundler of choice. It has HMR turned on by default as well, so editing the files will update the app in-browser.

## Functions

The `/functions` directory is where your functions should reside. To add functions you can use the `serverless create` command or simply add your `serverless.yml` and `handler.js` files and build from there.

Once you have a new function directory setup just add an entry to the `functions` array in `/local.config.js`.

The functions run with `serverless offline` so changes are applied on save just as happens with the web app's HMR.

## Environment Variables

The startup script will export a small set of environment variable on run. These include:

```
WEB_HTTP_PATH=/

# Mapped over functions config...
FUNCTION_<NAME>_HTTP_PORT=<NUMBER>
FUNCTION_<NAME>_HTTP_PATH=<STRING>
```

You can set additional env vars in the `binci.yml` config via static `FOO=bar`, internal `FOO=$BAR` or imported from the host system `FOO=${BAR}`

## Databases and Other Services

In the `binci.yml` you can configure other containers as services and expose them to the running container.

The `binci.yml` config includes an example using Postgres to show adding the service, then using the `before` script to get the host address assigned by the link and normalize the other needed environment variables.

## Using SSL Locally

Out of the box this project does not have SSL support, however, some web APIs require SSL, and adding it is fairly simple. You'll need the SSL cert and key files somewhere local in the project, then in `/scripts/local.dev.js` modify the `nginxConfig` to use the certs, replacing the beginning few lines with something like the following:

```
server {
  listen 443 ssl;

  ssl_certificate     /app/path_to_certificate.cert;
  ssl_certificate_key /app/path_to_key.key;
  ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
  ssl_ciphers         HIGH:!aNULL:!MD5;
  client_max_body_size 20M;

  # Rest of the file remains the same...
```

_Note: use a volume (in `binci.yml`) to mount the certs directory from your local/host system or be sure to add them to `.gitignore` so you don't push them to the repo._

The only other modifications you'll need are:

1. Expose `443:443` in `/binci.yml`
2. In `/web/vite.config.js` set `server.hmr.port` to `443` and `server.hmr.protocol` to `wss`

## Deployment

We want to ensure that only the services that have been updated get deployed. This means that, if a change is made to:

- functions and web

  Only the function that has been changed should be deployed. For ex, if you only change code in `auth`, then `socket` should not be deployed as a result.

- shared

  If a shared package is changed, then only the function(s) that depend on this package should be deployed. For ex, if `logger` is changed, then `auth` should be deployed.

- common files

  If any global code is changed, then all services will get deployed.

### Deployment Algorithm

The following steps produce reasonably small deployment plans. This can be improved on by using tooling that introspects which functions use which shared packages.

1. Run `lerna ls --since ${prevCommitSHA} -all` to list all packages that have changed since the last successful deployment. If this list includes one of the services, then deploy it.
2. Run `git diff --name-only ${prevCommitSHA} ${currentCommitSHA}` to get a list of all the updated files. If they don't belong to any of your Lerna packages (`lerna ls -all`), deploy all the services.
3. Otherwise skip the deployment.
