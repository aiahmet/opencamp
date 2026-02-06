FROM node:20-alpine

# Install Docker CLI for spawning containers
RUN apk add --no-cache docker-cli

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 4001

# Run the runner
CMD ["npm", "start"]
