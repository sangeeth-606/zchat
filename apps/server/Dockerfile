# Use a Node.js base image
FROM node:20-alpine

# Install Python, make, and g++ for node-gyp
RUN apk add --no-cache python3 make g++ bash

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy pnpm-workspace.yaml and package.json files from the root of the monorepo
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./

# Copy package.json files for all workspaces
COPY apps/server/package.json ./apps/server/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/ui/package.json ./packages/ui/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json

# Install dependencies for the entire monorepo
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the server application
WORKDIR /app/apps/server
RUN pnpm run build

# Expose the port the server runs on
EXPOSE 8000

# Command to run the application
CMD ["node", "dist/index.js"]