FROM node:12.16
MAINTAINER Jonas Friedmann <j@frd.mn>

WORKDIR /usr/src/app

ENV INFLUXDB_DB="speedtest" \
    INFLUXDB_HOST="influxdb" \
    SPEEDTEST_HOST="local" \
    SPEEDTEST_INTERVAL=3600 \
    SPEEDTEST_NETWORK_TYPE="not specified" \
    SPEEDTEST_NETWORK_NAME="not specified"

RUN apt-get update && apt-get install gnupg1 apt-transport-https dirmngr lsb-core software-properties-common -y
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 379CE192D401AB61
RUN add-apt-repository "deb https://ookla.bintray.com/debian $(lsb_release -sc) main"
RUN apt-get update
RUN apt-get install speedtest


COPY contents .
RUN npm ci

CMD [ "node", "index.js" ]
