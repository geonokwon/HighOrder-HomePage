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

# Install curl for healthcheck
RUN apk add --no-cache curl

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

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create startup script to fix permissions
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'chown -R nextjs:nodejs /app/data' >> /app/start.sh && \
    echo 'chown -R nextjs:nodejs /app/src/chatbot/data' >> /app/start.sh && \
    echo 'chown -R nextjs:nodejs /app/public/uploads' >> /app/start.sh && \
    echo 'chmod -R 755 /app/data' >> /app/start.sh && \
    echo 'chmod -R 755 /app/src/chatbot/data' >> /app/start.sh && \
    echo 'chmod -R 755 /app/public/uploads' >> /app/start.sh && \
    echo 'exec node server.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# Run as root to handle volume permissions
USER root

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# Use startup script instead of direct node command
CMD ["/app/start.sh"] 