FROM node:7.2
MAINTAINER Dennis Wolters <mail@dwolt.de>

ENV PANDOC_VERSION 2.5
ENV NODE_ENV production

RUN wget https://github.com/jgm/pandoc/releases/download/${PANDOC_VERSION}/pandoc-${PANDOC_VERSION}-1-amd64.deb && \
    dpkg -i pandoc* && \
    rm pandoc* && \
    apt-get clean

RUN mkdir /app

WORKDIR /app

COPY ./ /app

RUN npm install

EXPOSE 80

CMD ["node", "server.js"]
