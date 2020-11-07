FROM alpine as audiowaveform
LABEL stage=build

RUN apk add --no-cache git make cmake gcc g++ libmad-dev \
    libid3tag-dev libsndfile-dev gd-dev boost-dev \
    libgd libpng-dev zlib-dev \
    # static build
    zlib-static libpng-static boost-static \
    # manual static flac install
    autoconf automake libtool gettext \
 && wget https://github.com/xiph/flac/archive/1.3.3.tar.gz \
 && tar xzf 1.3.3.tar.gz \
 && cd flac-1.3.3 \
 && ./autogen.sh \
 && ./configure --enable-shared=no \
 && make \
 && make install \
    # audiowaveform build
 && git clone https://github.com/bbc/audiowaveform.git /tmp/audiowaveform \
 && cd /tmp/audiowaveform \
 && cmake -D BUILD_STATIC=1 -D ENABLE_TESTS=0 && make

FROM node:14-alpine

COPY --from=audiowaveform /tmp/audiowaveform/audiowaveform /usr/bin/audiowaveform
RUN apk add --no-cache ffmpeg

WORKDIR /app

# install npm dependancies
COPY package.json .
RUN npm install

COPY src/ ./src/
ENTRYPOINT [ "node", "src" ]
