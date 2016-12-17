FROM node:7.2
MAINTAINER Dennis Wolters <mail@dwolt.de>

ENV DEBIAN_FRONTEND noninteractive
ENV DEBIAN_PRIORITY critical
ENV DEBCONF_NOWARNINGS yes
ENV PANDOC_VERSION 1.19
ENV NODE_ENV production

RUN apt-get -qq update && \
    apt-get -qq -y install wget texlive-latex-base texlive-fonts-recommended && \
    apt-get -qq -y install texlive-fonts-extra texlive-latex-extra && \
    apt-get clean

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