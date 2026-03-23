FROM node:22.19.0-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma ./prisma/

RUN yarn install --frozen-lockfile

COPY . ./

RUN yarn prisma generate
RUN yarn build

FROM node:22.19.0-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

COPY package.json yarn.lock prisma.config.ts ./

RUN yarn install --frozen-lockfile --production=true && \
    yarn cache clean

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]