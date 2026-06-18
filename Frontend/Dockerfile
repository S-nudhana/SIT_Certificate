FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install

COPY . .
RUN bun run build

# Stage 2: Serve
FROM oven/bun:1-slim AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["bunx", "serve", "-s", "dist", "-l", "3000"]