FROM nginx:1.20-alpine

COPY nginx.conf /etc/nginx

# Install dependencies
RUN apk --no-cache add --virtual python && \
    apk --no-cache add --virtual \
      builds-deps build-base nginx nodejs npm curl docker python3 git && \
    npm config set unsafe-perm true && \
    npm config set python /usr/bin/python && \
    npm i yarn serverless@2.64.1 concurrently lerna -g && \
    rm -rf /tmp/*
