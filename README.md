# Serverless + React Stack

A simple, containerized project for quickly starting with Serverless and React. The goal
of this project is to containerize development into an ephemeral enviroment that can be
quickly installed and run with minimal overhead.

## Installation

There are only three dependencies required to run this project:

- Docker: containerization of the environment
- NodeJS: Run local setup
- Binci: Lightweight, ephemeral container orchastration (`npm i binci -g`)

Once the above dependencies are installed you can build the local docker image and install all dependencies by running the `./install.sh` script in the root of the project.

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

\*Note: use a volume (in `binci.yml`) to mount the certs directory from your local/host system or be sure to add them to `.gitignore` so you don't push them to the repo`

The only other modifications you'll need are:

1. Expose `443:443` in `/binci.yml`
2. In `/web/vite.config.js` set `server.hmr.port` to `80` and `server.hmr.protocol` to `wss`

## Deploying

I didn't define any deploy scripting simply because it's fairly simple. For the functions moving through them and running `sls deploy` is the starting point.

For the web app my go to is typically `S3` and `CloudFront` so scripting an `S3` push to your bucket, then running a `CloudFront` invalidation call would be the extent of it.

Things like comparing the diff's in the git history pre-deploy are a good idea in order to only deploy what's changed.
