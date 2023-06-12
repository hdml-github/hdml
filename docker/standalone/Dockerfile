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
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash && \
    source .nvm/nvm.sh && \
    nvm install v18.16.0


# Downloaded and unpacked Trino and Pulsar.
FROM base as downloads
RUN mkdir -p /downloads
RUN wget -P /downloads https://repo1.maven.org/maven2/io/trino/trino-server/418/trino-server-418.tar.gz
RUN wget -P /downloads https://archive.apache.org/dist/pulsar/pulsar-3.0.0/apache-pulsar-3.0.0-bin.tar.gz
RUN tar -xf /downloads/trino-server-418.tar.gz -C /downloads/
RUN tar -xf /downloads/apache-pulsar-3.0.0-bin.tar.gz -C /downloads/


# Configured Trino image.
FROM downloads AS trino
RUN mkdir -p /trino/data && mkdir -p /trino/etc/catalog
RUN mv /downloads/trino-server-418/* /trino/
COPY ./packages/ci.docker/standalone/trino/* /trino/etc


# Configured Pulsar image.
FROM downloads AS pulsar
RUN mkdir -p /pulsar
RUN mv /downloads/apache-pulsar-3.0.0/* /pulsar/


# Configured base services image.
FROM base AS services
COPY --from=trino /trino /trino
COPY --from=pulsar /pulsar /pulsar