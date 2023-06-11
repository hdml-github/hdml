# @author Artem Lytvynov
# @copyright Artem Lytvynov
# @license Apache-2.0

# JDK, Python, NVM, Node, tools.
FROM azul/zulu-openjdk:17-latest AS base
ENV NVM_DIR=.nvm
RUN mkdir .nvm
RUN apt-get update && \
    apt-get -y dist-upgrade && \
    apt-get -y install --no-install-recommends \
      mc \
      curl \
      wget \
      python3 \
      python3-kazoo \
      python3-pip
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN ln -s /usr/bin/python3 /usr/bin/python
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash && apt-get install -y nodejs


# Downloaded and unpacked Trino and Pulsar.
FROM base as downloads
RUN mkdir -p /downloads
RUN wget -P /downloads https://repo1.maven.org/maven2/io/trino/trino-server/418/trino-server-418.tar.gz
RUN wget -P /downloads https://archive.apache.org/dist/pulsar/pulsar-3.0.0/apache-pulsar-3.0.0-bin.tar.gz
RUN tar -xf /downloads/trino-server-418.tar.gz -C /downloads/
RUN tar -xf /downloads/apache-pulsar-3.0.0-bin.tar.gz -C /downloads/


# Image configured for the build process
FROM base AS build-env
RUN apt-get -y install --no-install-recommends git cmake gcc g++ build-essential
RUN mkdir flatc
RUN git clone --depth 1 --branch v23.1.4 https://github.com/google/flatbuffers.git flatc
RUN cd flatc && cmake -G "Unix Makefiles" -DCMAKE_BUILD_TYPE=Release && make
RUN ln -s /flatc/flatc /usr/local/bin/flatc
RUN chmod +x /flatc/flatc
RUN npx playwright install-deps
RUN mkdir -p /hdml
COPY ./package-lock.json /hdml
COPY ./package.json /hdml
RUN cd /hdml && npm install


# Configured Trino image.
FROM downloads AS trino
RUN mkdir -p /trino/data && mkdir -p /trino/etc/catalog
RUN mv /downloads/trino-server-418/* /trino/
COPY ./docker/testing/trino/* /trino/etc/


# Configured Pulsar image.
FROM downloads AS pulsar
RUN mkdir -p /pulsar
RUN mv /downloads/apache-pulsar-3.0.0/* /pulsar/
COPY ./docker/testing/pulsar/standalone.conf /pulsar/conf/


# Image with built hdml modules
FROM build-env AS build
COPY ./packages/ /hdml/packages/
COPY ./tsconfig /hdml/tsconfig/
COPY ./.eslintrc.js /hdml
COPY ./.jestrc.js /hdml
COPY ./.rollup.config.js /hdml
COPY ./.web-test.config.js /hdml
COPY ./lerna.json /hdml
RUN cd /hdml && npm run bootstrap
RUN cd /hdml && npm run build
RUN ln -s /hdml/packages/io.gateway/cjs/gateway.js /usr/local/bin/gateway
RUN ln -s /hdml/packages/io.gateway/cjs/hideway.js /usr/local/bin/hideway
RUN ln -s /hdml/packages/io.querier/cjs/querier.js /usr/local/bin/querier
RUN chmod +x /hdml/packages/io.gateway/cjs/gateway.js
RUN chmod +x /hdml/packages/io.gateway/cjs/hideway.js
RUN chmod +x /hdml/packages/io.querier/cjs/querier.js


# Standalone image
FROM build AS standalone
RUN apt-get install -y supervisor
COPY --from=trino /trino /trino
COPY --from=pulsar /pulsar /pulsar
COPY ./docker/testing/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
CMD ["/usr/bin/supervisord"]