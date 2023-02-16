FROM ubuntu:20.04

ENV TZ=Asia/Seoul

ADD . /home/cns-fileUpload/
WORKDIR /home/cns-fileUpload/

RUN apt-get update -y && apt-get install -y vim && apt-get install -y sudo && apt-get install -y curl

RUN apt-get install -y curl && curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
RUN sudo apt-get install -y nodejs

RUN npm install
RUN npm install -g pm2 

RUN pm2 install pm2-logrotate
RUN pm2 set pm2-logrotate:retain 60 && pm2 set pm2-logrotate:dateFormat YYYY-MM-DD && pm2 set pm2-logrotate:workerInterval 180 && pm2 set pm2-logrotate:rotateInterval '0 0 * * *'

EXPOSE 3001

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
#CMD [ "nodemon", "-L", "./bin/www" ]

