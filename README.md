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
npm run dev # or yarn dev
```

Once this is complete and the web service and all functions have started you can open the web app in your browser at `http://localhost`.

## Web

The web app (`/web`) is a simple React starter. It uses the [Vite](https://vitejs.dev/) bundler by default for simplicity, but can easily be swapped out for your bundler of choice. It has HMR turned on by default so editing the files will update the app in-browser.

## Functions

The `/functions` directory is where your functions should reside. To add functions you can use the `serverless create` command or simply add your `serverless.yml` and `handler.js` files and build from there.

Once you have a new function directory setup just add an entry to the `functions` array in `/local.config.js`.
