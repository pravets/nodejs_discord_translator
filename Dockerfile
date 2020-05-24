FROM node:12-buster

RUN mkdir -p /usr/src/app/

WORKDIR /usr/src/app/

COPY . /usr/src/app/

RUN npm i

ENV DISCORD_TOKEN <token here>
ENV BOT_PREFIX /
ENV YA_TRANSLATE_TOKEN <yandex translate api token here>
ENV MONGODB_CONNECTION_STRING <mongodb connection here>

CMD ["npm","start"]