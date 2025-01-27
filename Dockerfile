FROM node:16.15.0-alpine as builder
WORKDIR /opt/app

RUN apk --no-cache add git
RUN apk add --no-cache -t build-dependencies make gcc g++ python3 libtool libressl-dev openssl-dev autoconf automake \
    && cd $(npm root -g)/npm \
    && npm config set unsafe-perm true \
    && npm install -g node-gyp

COPY package.json package-lock.json* /opt/app/

RUN npm ci --production

FROM node:16.15.0-alpine
WORKDIR /opt/app

# Create empty log file & link stdout to the application log file
RUN mkdir ./logs && touch ./logs/combined.log
RUN ln -sf /dev/stdout ./logs/combined.log

# Create a non-root user: ml-user
RUN adduser -D ml-user 

# Copy over filesfrom builder
COPY --chown=ml-user --from=builder /opt/app .

# Set non-root user
USER ml-user

# Copy actual code
COPY config /opt/app/config
COPY src /opt/app/src

EXPOSE 4001
CMD ["npm", "run", "start"]
