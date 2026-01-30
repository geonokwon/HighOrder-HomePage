# Use the official Node.js runtime as the base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Install dependencies based on the preferred package manager
# Copy package files first for better caching
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

# Copy source code (this layer will be rebuilt when source changes)
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

# Install curl, wget for healthcheck and su-exec for user switching
RUN apk add --no-cache curl wget su-exec

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public files
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Fix permissions for public directory
RUN chown -R nextjs:nodejs /app/public
RUN chmod -R 755 /app/public

# Create data directories for volume mounts
RUN mkdir -p /app/data
RUN mkdir -p /app/src/chatbot/data
RUN mkdir -p /app/public/uploads/cards
RUN mkdir -p /app/public/uploads/reviews
RUN chown -R nextjs:nodejs /app/data
RUN chown -R nextjs:nodejs /app/src/chatbot/data
RUN chown -R nextjs:nodejs /app/public/uploads
RUN chmod -R 755 /app/data
RUN chmod -R 755 /app/src/chatbot/data
RUN chmod -R 755 /app/public/uploads

# ✅ standalone 대신 전체 복사 (server.js 누락 문제 해결)
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Create startup script to fix permissions (볼륨 마운트된 디렉토리만)
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo '# 볼륨 마운트된 디렉토리만 권한 설정 (빌드 시 이미 설정된 디렉토리는 스킵)' >> /app/start.sh && \
    echo 'if [ -d /app/data ]; then chown -R nextjs:nodejs /app/data 2>/dev/null || true; fi' >> /app/start.sh && \
    echo 'if [ -d /app/src/chatbot/data ]; then chown -R nextjs:nodejs /app/src/chatbot/data 2>/dev/null || true; fi' >> /app/start.sh && \
    echo 'if [ -d /app/public/uploads ]; then chown -R nextjs:nodejs /app/public/uploads 2>/dev/null || true; fi' >> /app/start.sh && \
    echo '# nextjs 유저로 전환 후 서버 시작 (npm start 사용)' >> /app/start.sh && \
    echo 'exec su-exec nextjs npm start' >> /app/start.sh && \
    chmod +x /app/start.sh

# Run as root to handle volume permissions
USER root

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use startup script instead of direct node command
CMD ["/app/start.sh"]
