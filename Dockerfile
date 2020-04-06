FROM debian:buster-slim as audiowaveform
LABEL stage=build

# install dependencies
RUN apt-get update
RUN apt-get install -y wget git make cmake gcc g++ libmad0-dev \
    libid3tag0-dev libsndfile1-dev libgd-dev libboost-filesystem-dev \
    libboost-program-options-dev libboost-regex-dev

# clone audiowaveform
RUN git clone https://github.com/bbc/audiowaveform.git /_
WORKDIR /_

# build audiowaveform
RUN cmake -D BUILD_STATIC=1 -D ENABLE_TESTS=0
RUN make

# target container
FROM node:12-alpine

# install ffmpeg
RUN apk add ffmpeg

WORKDIR /app
# copy audiowaveform
COPY --from=audiowaveform /_/audiowaveform audiowaveform
# install npm dependancies
COPY package.json .
RUN npm install
# copy source file
COPY . .

# start app at container start
CMD [ "npm", "start" ]