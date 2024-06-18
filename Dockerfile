# Use a specific version of node to ensure consistency across builds
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies using npm only
FROM base AS deps
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --prefer-offline --only=production --silent --omit=dev; \
    else echo "package-lock.json not found." && exit 1; \
    fi

# Build the Next.js application using npm
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image setup
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

# Add user for running the application
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy built files from the builder stage
COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 4321
ENV PORT 4321

ENTRYPOINT ["node", "server.js"]
