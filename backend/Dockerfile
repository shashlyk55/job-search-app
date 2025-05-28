FROM node:20.17.0-alpine3.20 AS production

WORKDIR /app

COPY package*.json ./

RUN npm install --production && \
    npm install -g pm2

COPY . .

RUN addgroup -S appgroup && adduser -S appuser -G appgroup && chown -R appuser:appgroup /app

EXPOSE 3000

USER appuser

CMD ["pm2-runtime", "start", "app.js"]