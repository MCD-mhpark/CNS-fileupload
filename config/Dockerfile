FROM ubuntu:20.04

ENV TZ=Asia/Seoul

ADD . /cns-fileUpload/
WORKDIR /cns-fileUpload/

RUN apt-get update -y && apt-get install -y vim && apt-get install -y sudo && apt-get install -y curl

RUN apt-get install -y curl && curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
RUN apt-get install -y nodejs

RUN npm install
RUN npm install -g nodemon

EXPOSE 3001

CMD [ "nodemon", "-L", "./bin/www" ]

