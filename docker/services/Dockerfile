# @author Artem Lytvynov
# @copyright Artem Lytvynov
# @license Apache-2.0

FROM node:18.16.0-alpine3.18 AS service

RUN apk add mc rxvt-unicode
ENV TERM rxvt-unicode
ENV NODE_ENV production

WORKDIR /hdml
RUN npm i @hdml/io.gateway@latest
RUN npm i @hdml/io.querier@latest
RUN ln -s /hdml/node_modules/@hdml/io.gateway/cjs/gateway.js /usr/local/bin/gateway
RUN ln -s /hdml/node_modules/@hdml/io.gateway/cjs/hideway.js /usr/local/bin/hideway
RUN ln -s /hdml/node_modules/@hdml/io.querier/cjs/querier.js /usr/local/bin/querier
RUN chmod +x /hdml/node_modules/@hdml/io.gateway/cjs/gateway.js
RUN chmod +x /hdml/node_modules/@hdml/io.gateway/cjs/hideway.js
RUN chmod +x /hdml/node_modules/@hdml/io.querier/cjs/querier.js