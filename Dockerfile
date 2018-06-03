FROM node:8.11.0
WORKDIR /usr/src/app
EXPOSE 3000
EXPOSE 3001
VOLUME [ "/usr/src/app" ]
RUN apt-get update && apt-get install -f -y postgresql-client-9.4
