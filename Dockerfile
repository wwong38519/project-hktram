FROM wwong38519/rpi-node6x:latest

COPY package.json /usr/src/app/

WORKDIR /usr/src/app/

RUN npm install

COPY . /usr/src/app/

EXPOSE 1337

CMD ["npm", "run", "start"]
