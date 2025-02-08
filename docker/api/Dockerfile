# Build Stage
FROM node:22-alpine AS builder
WORKDIR /app

# Install all dependencies and build the project
COPY package.json ./
RUN npm i

# Copy source files and build the project
COPY . .
RUN npm run build

# Production Stage
FROM node:22-alpine
WORKDIR /app

# Install only production dependencies
COPY --from=builder /app/package.json /app/package-lock.json* ./
RUN npm ci --production

# Copy built files from the builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma

RUN npx prisma generate


# Create a script to check DB connection before running migrations
COPY wait-for-db.sh ./wait-for-db.sh
RUN chmod +x wait-for-db.sh

# Run migration in an entrypoint script instead of inside Dockerfile
ENTRYPOINT ["./wait-for-db.sh"]

# Set environment variables (adjust as needed, e.g., PORT)
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE ${PORT}

CMD ["node", "build/server.js"]

