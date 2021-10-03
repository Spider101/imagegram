FROM node:14-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY "package.json" "./"
RUN NODE_ENV=development npm install --silent
COPY . .
EXPOSE 3001
RUN chown -R node /usr/src/app
USER node
CMD ["node", "-r", "ts-node/register", "src/api/index.ts"]