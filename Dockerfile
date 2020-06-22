FROM debian:buster-slim as audiowaveform
LABEL stage=build

# install dependencies and clone audiowaveform
RUN apt-get update \
    && apt-get install -y wget git make cmake gcc g++ libmad0-dev \
    libid3tag0-dev libsndfile1-dev libgd-dev libboost-filesystem-dev \
    libboost-program-options-dev libboost-regex-dev \
    && git clone https://github.com/bbc/audiowaveform.git /_

# clone audiowaveform
WORKDIR /_

# build audiowaveform
RUN cmake -D BUILD_STATIC=1 -D ENABLE_TESTS=0 && make

# target container
FROM node:12-buster-slim

# copy audiowaveform
COPY --from=audiowaveform /_/audiowaveform /usr/bin/audiowaveform

# install ffmpeg
RUN apt-get update && apt-get install ffmpeg -y

WORKDIR /app

# install npm dependancies
COPY package.json .
RUN npm install

# copy source file
COPY . .

# start app at container start
CMD [ "npm", "start" ]
