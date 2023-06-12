# @author Artem Lytvynov
# @copyright Artem Lytvynov
# @license Apache-2.0

# Development tools image
FROM mcr.microsoft.com/playwright:v1.31.1-jammy AS devtools
ARG DEBIAN_FRONTEND=noninteractive
ARG TZ=Etc/UTC
RUN apt-get update && \
    apt-get -y dist-upgrade && \
    apt-get -y install --no-install-recommends \
      mc \
      g++ \
      gcc \
      git \
      curl \
      wget \
      cmake \
      python3 \
      python3-pip \
      python3-kazoo \
      build-essential
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN ln -s /usr/bin/python3 /usr/bin/python
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash && apt-get install -y nodejs
RUN mkdir flatc
RUN git clone --depth 1 --branch v23.1.4 https://github.com/google/flatbuffers.git flatc
RUN cd flatc && cmake -G "Unix Makefiles" -DCMAKE_BUILD_TYPE=Release && make
RUN ln -s /flatc/flatc /usr/local/bin/flatc
RUN chmod +x /flatc/flatc