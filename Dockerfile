###################
## DEVELOPMENT
###################

FROM node:18 As development

WORKDIR /app

COPY --chown=node:node package*.json ./

ENV NODE_ENV development

RUN npx prisma generate

RUN npm ci

COPY --chown=node:node . .

USER node

###################
## BUILD
###################

FROM node:18 As build

WORKDIR /app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npx prisma generate

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

###################
## PRODUCTION
###################

FROM node:18 As production

ENV NODE_ENV production

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/prisma ./prisma

CMD [ "node", "dist/main.js" ]