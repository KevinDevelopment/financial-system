FROM node:22-bookworm

RUN mkdir -p /home/node/app/node_modules \
    /home/node/app/docker

RUN chown -R node:node /home/node

WORKDIR /home/node/app

COPY package*.json ./

RUN apt-get update && apt-get install -y \
    dumb-init \
    postgresql-client \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*


RUN npm install

COPY --chown=node:node . .
COPY docker/entrypoint.sh /home/node/app/docker/entrypoint.sh

RUN npm run build

RUN chown -R node:node /home/node
RUN chmod +x /home/node/app/docker/entrypoint.sh

USER node

EXPOSE 8755

ENTRYPOINT ["dumb-init", "--"]
CMD ["./docker/entrypoint.sh"]
# CMD ["node", "dist/src/web/server.js"]

