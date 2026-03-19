FROM node:25-bookworm

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY src src

COPY config.ini .

COPY wait-for-it.sh .

RUN chmod +x ./wait-for-it.sh

EXPOSE 3000

CMD ["./wait-for-it.sh", "sysfind-db:3306", "--", "npm", "run", "start"]