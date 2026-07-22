FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --no-cache

COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

USER node

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

EXPOSE 3005

CMD ["node", "server.js"]