# Use a lightweight Node.js LTS image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies using npm ci for reproducible builds
RUN npm ci

# Copy the rest of the application code
COPY . .

# Set production environment
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -S nodejs && adduser -S appuser -G nodejs

# Create uploads directory and grant ownership
RUN mkdir -p /app/public/uploads && \
    chown -R appuser:nodejs /app

USER appuser

# Expose the port the application runs on
EXPOSE 3000

CMD ["npm", "start"]