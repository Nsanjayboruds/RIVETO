# Use the standard Node image (bigger but much reliable than Alpine)
FROM node:18

WORKDIR /app

# Copy package files first
COPY package*.json ./

# THE FIX:
# 1. --legacy-peer-deps: Ignores strict version conflicts that often break builds
# 2. --no-audit: Skips security audit to save time and memory
RUN npm install --legacy-peer-deps --no-audit

# Copy the rest of the code
COPY . .

# Expose the Vite port
EXPOSE 5173

# Start command
CMD ["npm", "run", "dev", "--", "--host"]