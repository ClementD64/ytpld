FROM alpine as audiowaveform
LABEL stage=build

RUN apk add --no-cache make cmake gcc g++ libmad-dev \
    libid3tag-dev libsndfile-dev gd-dev boost-dev \
    libgd libpng-dev zlib-dev \
    # static build
    # zlib-static libpng-static boost-static libvorbis-static \
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
 && wget https://github.com/bbc/audiowaveform/archive/1.4.2.tar.gz \
 && tar xzf 1.4.2.tar.gz \
 && cd audiowaveform-1.4.2 \
 # && cmake -D BUILD_STATIC=1 -D ENABLE_TESTS=0 . && make \
 && cmake -D ENABLE_TESTS=0 . && make \
 && mv audiowaveform /audiowaveform

FROM node:14-alpine

RUN apk add --no-cache ffmpeg \
    boost-build libgd libid3tag libmad libsndfile
COPY --from=audiowaveform /audiowaveform /usr/bin/audiowaveform

WORKDIR /app

# install npm dependancies
COPY package.json .
RUN npm install

COPY src/ ./src/
ENTRYPOINT [ "node", "src" ]
