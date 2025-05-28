FROM node:20-alpine3.20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

#FROM node:20-alpine3.20 AS production
#WORKDIR /app

#COPY package*.json ./
#RUN npm install --production

#COPY --from=build /app/dist ./dist

#EXPOSE 5000
#CMD ["npm", "run", "dev"]
#CMD ["serve", "-s", "dist", "-l", "3000"]
#npm install -g serve
#npx serve -s dist -l 3000