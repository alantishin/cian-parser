FROM node:16-stretch-slim as base

RUN  apt-get update \
     && apt-get install -y wget gnupg ca-certificates procps libxss1 \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y google-chrome-stable \
     && apt-get install openvpn -y \
     && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

# USER root

RUN npm install && npm cache clean --force

COPY --chown=node:node . .


ENV TIME_STEP=30
ENV TELEGRAM_BOT_TOKEN=''
ENV TELEGRAM_USER_IDS=''
ENV CIAN_LINK=https://www.cian.ru/snyat-kvartiru-1-komn-ili-2-komn/

FROM base as dev
CMD ["npm", "run", "dev"]

FROM base as prod
CMD ["npm", "run", "prod"]