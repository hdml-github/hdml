# @author Artem Lytvynov
# @copyright Artem Lytvynov
# @license Apache-2.0

# JDK, Python, Node.js, tools.
FROM azul/zulu-openjdk:17-latest AS base
RUN apt-get update && \
    apt-get -y dist-upgrade && \
    apt-get -y install --no-install-recommends \
      mc \
      curl \
      wget \
      python3 \
      python3-kazoo \
      python3-pip \
      ca-certificates \
      gnupg \
      supervisor
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN ln -s /usr/bin/python3 /usr/bin/python
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update
RUN apt-get install nodejs -y


# Trino image.
FROM base AS trino
RUN mkdir -p /downloads && mkdir -p /trino/data && mkdir -p /trino/etc/catalog
RUN wget -P /downloads https://repo1.maven.org/maven2/io/trino/trino-server/427/trino-server-427.tar.gz
RUN tar -xf /downloads/trino-server-427.tar.gz -C /downloads/
RUN rm -rf \
  /downloads/trino-server-427/plugin/atop \
  /downloads/trino-server-427/plugin/blackhole \
  /downloads/trino-server-427/plugin/delta-lake \
  /downloads/trino-server-427/plugin/example-http \
  /downloads/trino-server-427/plugin/exchange-filesystem \
  /downloads/trino-server-427/plugin/exchange-hdfs \
  /downloads/trino-server-427/plugin/hive \
  /downloads/trino-server-427/plugin/http-event-listener \
  /downloads/trino-server-427/plugin/hudi \
  /downloads/trino-server-427/plugin/iceberg \
  /downloads/trino-server-427/plugin/jmx \
  /downloads/trino-server-427/plugin/local-file \
  /downloads/trino-server-427/plugin/memory \
  /downloads/trino-server-427/plugin/mysql-event-listener \
  /downloads/trino-server-427/plugin/password-authenticators \
  /downloads/trino-server-427/plugin/phoenix5 \
  /downloads/trino-server-427/plugin/pinot \
  /downloads/trino-server-427/plugin/raptor-legacy \
  /downloads/trino-server-427/plugin/resource-group-managers \
  /downloads/trino-server-427/plugin/session-property-managers \
  /downloads/trino-server-427/plugin/thrift \
  /downloads/trino-server-427/plugin/tpcds \
  /downloads/trino-server-427/plugin/tpch
RUN mv /downloads/trino-server-427/* /trino/
COPY ./docker/testing/trino/* /trino/etc/


# Pulsar image.
FROM base AS pulsar
RUN mkdir -p /downloads && mkdir -p /pulsar
RUN wget -P /downloads https://archive.apache.org/dist/pulsar/pulsar-3.1.0/apache-pulsar-3.1.0-bin.tar.gz
RUN tar -xf /downloads/apache-pulsar-3.1.0-bin.tar.gz -C /downloads/
RUN mv /downloads/apache-pulsar-3.1.0/* /pulsar/
COPY ./docker/testing/pulsar/standalone.conf /pulsar/conf/


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


# Image with built hdml modules
FROM build-env AS build
COPY ./packages/ /hdml/packages/
COPY ./tsconfig /hdml/tsconfig/
COPY ./.eslintrc.js /hdml
COPY ./.jestrc.js /hdml
COPY ./.rollup.config.js /hdml
COPY ./.test.config.js /hdml
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