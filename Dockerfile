FROM node:22-bookworm

RUN mkdir -p /home/node/app/node_modules

RUN chown -R node:node /home/node

WORKDIR /home/node/app

COPY package*.json ./

RUN apt-get update && apt-get install -y \
    dumb-init \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN npm ci

COPY --chown=node:node . .

RUN npx prisma generate
RUN npm run build

RUN chown -R node:node /home/node

USER node

EXPOSE 8755

ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node dist/src/presentation/web/server.js"]