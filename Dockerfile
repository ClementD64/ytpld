FROM debian:buster-slim as audiowaveform
LABEL stage=intermediate

# install dependencies
RUN apt-get update
RUN apt-get install -y wget git make cmake gcc g++ libmad0-dev \
    libid3tag0-dev libsndfile1-dev libgd-dev libboost-filesystem-dev \
    libboost-program-options-dev \
    libboost-regex-dev
# clone audiowaveform
RUN git clone https://github.com/bbc/audiowaveform.git
WORKDIR /audiowaveform
# install Google Test test framework
RUN wget https://github.com/google/googletest/archive/release-1.10.0.tar.gz
RUN tar xzf release-1.10.0.tar.gz
RUN ln -s googletest-release-1.10.0/googletest googletest
RUN ln -s googletest-release-1.10.0/googlemock googlemock
# build audiowaveform
RUN mkdir build
RUN cd build
RUN cmake -D BUILD_STATIC=1 -D ENABLE_TESTS=0 /audiowaveform
RUN make

# target container
FROM node:12-alpine

# install ffmpeg
RUN apk add ffmpeg

WORKDIR /usr/src/app
# copy audiowaveform
COPY --from=audiowaveform /audiowaveform audiowaveform
# install npm dependancies
COPY package.json .
RUN npm install
# copy source file
COPY . .

# start app at container start
CMD [ "npm", "start" ]