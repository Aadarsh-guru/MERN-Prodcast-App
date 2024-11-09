# Stage 1: Build
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

COPY client ./client
COPY src ./src
COPY tsconfig.json ./

RUN npm ci
RUN npm run build

# Stage 2: Production
FROM node:20 AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8000

CMD ["node", "./dist/index.js"]