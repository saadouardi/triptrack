FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production

RUN npm install --global serve@14.2.4 && npm cache clean --force
COPY --from=build /app/build ./build

USER node
EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
