# WS-Chat Monorepo

This repository contains a real-time chat application built as a monorepo using pnpm and TurboRepo. It consists of a Next.js frontend, a Node.js backend with Socket.io and Kafka integration, and shared UI components.

## Project Structure

- `apps/server`: The Node.js backend application.
- `apps/web`: The Next.js frontend application.
- `packages/ui`: A shared library for UI components.
- `packages/eslint-config`: Shared ESLint configurations.
- `packages/typescript-config`: Shared TypeScript configurations.

## Technical Stack

### Frontend (`apps/web`)
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **Real-time Communication**: Socket.io Client
- **Package Manager**: pnpm

### Backend (`apps/server`)
- **Runtime**: Node.js
- **Language**: TypeScript
- **Real-time Communication**: Socket.io
- **Database ORM**: Prisma
- **Database**: PostgreSQL (via Prisma)
- **Message Broker**: Kafka (via `kafkajs`)
- **Caching/Pub-Sub**: Redis (via `ioredis`)
- **Package Manager**: pnpm

### Monorepo Tooling
- **Monorepo Manager**: pnpm
- **Build System**: TurboRepo

## Getting Started

To set up the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ws-chat.git
    cd ws-chat
    ```

2.  **Install pnpm:**
    If you don't have pnpm installed, you can install it via npm:
    ```bash
    npm install -g pnpm
    ```

3.  **Frontend Setup (`apps/web`):
    *   **Install Dependencies:**
        ```bash
        pnpm install
        ```
    *   **Set up Environment Variables:**
        Copy `apps/web/.env.example` to `apps/web/.env` and fill in the required values.
        **`apps/web/.env` example:**
        ```
        NEXT_PUBLIC_SERVER_URL="http://localhost:8000"
        ```
    *   **Start Development Server:**
        ```bash
        pnpm --filter web dev
        ```
        The frontend will typically run on `http://localhost:3000`.

4.  **Backend Setup (Docker Compose for `apps/server` and its dependencies):
    *   **Install Docker and Docker Compose:** Ensure you have Docker and Docker Compose installed on your system.
    *   **Build and Run Services:** Navigate to the root directory of the monorepo and bring up the services:
        ```bash
        docker compose up --build -d
        ```
        This will build the `server` image, and start `postgres`, `redis`, `zookeeper`, `kafka`, and `server` containers. Prisma migrations will be automatically applied when the `server` container starts.
    *   **Verify Services:** You can check the status of your running containers:
        ```bash
        docker ps
        ```
    *   **Stop Services:** To stop and remove the containers, run from the root of the monorepo:
        ```bash
        docker compose down
        ```

## Deployment

This project requires separate deployment strategies for the frontend and backend due to their architectural differences.

### Frontend Deployment (`apps/web`)

The Next.js frontend is ideal for deployment on platforms like Vercel.

**Steps for Vercel Deployment:**
1.  **Connect your Git repository** to Vercel.
2.  **Configure the project root** to `apps/web`.
3.  **Set environment variables** (e.g., `NEXT_PUBLIC_SERVER_URL` pointing to your deployed backend URL).
4.  Vercel will automatically detect Next.js and build/deploy your application.

### Backend Deployment (`apps/server`)

The Node.js backend with Socket.io and Kafka requires a platform that supports long-running processes. Recommended platforms include Render, Heroku, DigitalOcean App Platform, or AWS EC2/ECS. You can leverage the `Dockerfile` created for `apps/server` to containerize your backend for deployment.

**General Steps for Containerized Backend Deployment:**
1.  **Choose a container orchestration platform** (e.g., Kubernetes, Docker Swarm) or a service that supports Docker containers (e.g., Render, DigitalOcean App Platform, AWS ECS/Fargate).
2.  **Provision managed services** for PostgreSQL, Redis, and Kafka if your chosen platform doesn't provide them directly or if you prefer managed services for production.
3.  **Build and push the `apps/server` Docker image** to a container registry (e.g., Docker Hub, AWS ECR).
    ```bash
    cd apps/server
    docker build -t your-dockerhub-username/ws-chat-server .
    docker push your-dockerhub-username/ws-chat-server
    ```
4.  **Configure environment variables** in your deployment environment for the `server` container, pointing to your managed database, Redis, and Kafka instances.
    *   `DATABASE_URL`
    *   `KAFKA_BROKER_URL`
    *   `REDIS_URL`
5.  **Deploy the `server` container** using your platform's deployment mechanisms. Ensure that the container runs the Prisma migrations as part of its startup command (as configured in the `Dockerfile` and `docker-compose.yml` for local development, this is handled by `npx prisma migrate deploy && node dist/index.js`).
6.  **Ensure network connectivity** between your deployed `server` container and the database, Redis, and Kafka services.


## Scripts

All scripts can be run from the root of the monorepo using `pnpm run <script-name>`.

- `pnpm run dev`: Starts development servers for both frontend and backend.
- `pnpm run build`: Builds both frontend and backend for production.
- `pnpm run lint`: Runs ESLint across the monorepo.
- `pnpm run format`: Formats code using Prettier.
- `pnpm run check-types`: Runs TypeScript type checks across the monorepo.

## Contributing

Feel free to contribute to this project. Please ensure your code adheres to the existing style and conventions.

