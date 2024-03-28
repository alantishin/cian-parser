FROM node:18.20.0-buster as base

WORKDIR /home/node/app


ENV TIME_STEP=30
ENV TELEGRAM_BOT_TOKEN=''
ENV TELEGRAM_USER_IDS=''
ENV CIAN_LINK=https://www.cian.ru/snyat-kvartiru-1-komn-ili-2-komn/

RUN apt-get update
RUN apt-get install -y ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils

COPY . . 

RUN npm install
RUN npx puppeteer browsers install chrome

FROM base as dev
RUN npm install -g nodemon
CMD ["npm", "run", "dev"]

FROM base as prod
CMD ["npm", "run", "prod"]