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
COPY ./docker/monolith/conf/trino/* /trino/etc/


# Pulsar image.
FROM base AS pulsar
RUN mkdir -p /downloads && mkdir -p /pulsar
RUN wget -P /downloads https://archive.apache.org/dist/pulsar/pulsar-3.1.0/apache-pulsar-3.1.0-bin.tar.gz
RUN tar -xf /downloads/apache-pulsar-3.1.0-bin.tar.gz -C /downloads/
RUN mv /downloads/apache-pulsar-3.1.0/* /pulsar/
COPY ./docker/monolith/conf/pulsar/standalone.conf /pulsar/conf/


# Monolith image
FROM base AS standalone
COPY --from=trino /trino /trino
COPY --from=pulsar /pulsar /pulsar
RUN npm i -g @hdml/io.gateway@latest @hdml/io.querier@latest
RUN ln -s /usr/lib/node_modules/@hdml/io.gateway/cjs/gateway.js /usr/local/bin/gateway
RUN ln -s /usr/lib/node_modules/@hdml/io.gateway/cjs/hideway.js /usr/local/bin/hideway
RUN ln -s /usr/lib/node_modules/@hdml/io.querier/cjs/querier.js /usr/local/bin/querier
RUN chmod +x /usr/lib/node_modules/@hdml/io.gateway/cjs/gateway.js
RUN chmod +x /usr/lib/node_modules/@hdml/io.querier/cjs/querier.js
RUN chmod +x /usr/lib/node_modules/@hdml/io.gateway/cjs/hideway.js
COPY ./docker/monolith/conf/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
EXPOSE 8888 8887 8080 9090 6650
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]