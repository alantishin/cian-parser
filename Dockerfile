FROM node:14.16-stretch as base

RUN  apt-get update \
     && apt-get install -y wget gnupg ca-certificates procps libxss1 \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y google-chrome-stable \
     && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install && npm cache clean --force

COPY --chown=node:node . .


ENV TELEGRAM_BOT_TOKEN=TELEGRAM_BOT_TOKEN
ENV TELEGRAM_USER_ID=TELEGRAM_USER_ID


CMD ["npm", "run", "dev"]