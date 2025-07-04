# Environment Configuration

This project supports both development and production environments through environment variables.

## Configuration

### Server (`/apps/server/.env`)

```env
# Environment Configuration
IS_PRODUCTION=false  # Set to true for production

# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5433/postgres?schema=public"
DATABASE_URL_PROD="postgres://avnadmin:AVNS_vx51RWRQRvKn7WXG2K0@pg-6be0ec4-zchat.j.aivencloud.com:26873/defaultdb?sslmode=require"

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL_PROD="redis://default:Aa7eAAIjcDE1NzlmZWM4ZmM4Nzc0Yjc1YTIxNDg2ZTU1ODg3NWQ2NnAxMA@picked-walrus-44766.upstash.io:6379"

# Kafka Configuration
KAFKA_BROKER=localhost:9092
KAFKA_BROKER_PROD="kafka-28720e62-zchat.j.aivencloud.com:26875"
KAFKA_SASL_USERNAME=""  # Set these for production if needed
KAFKA_SASL_PASSWORD=""

# Server Configuration
PORT=3005
```

### Web (`/apps/web/.env`)

```env
# Environment Configuration
IS_PRODUCTION=false  # Set to true for production

# Server Configuration
NEXT_PUBLIC_SERVER_URL=http://localhost:3005
NEXT_PUBLIC_SERVER_URL_PROD=https://your-production-server.com
```

## How it works

### Development Mode (`IS_PRODUCTION=false`)
- Uses local PostgreSQL database
- Uses local Redis instance
- Uses local Kafka broker
- Web app connects to local server

### Production Mode (`IS_PRODUCTION=true`)
- Uses Aiven PostgreSQL database
- Uses Upstash Redis
- Uses Aiven Kafka with SSL/SASL
- Web app connects to production server

## Switching Between Modes

To switch between development and production:

1. **For Development**: Set `IS_PRODUCTION=false` in both `.env` files
2. **For Production**: Set `IS_PRODUCTION=true` in both `.env` files

## Services Used

### Development (Local Docker)
- PostgreSQL: `localhost:5433`
- Redis: `localhost:6379`
- Kafka: `localhost:9092`

### Production (Aiven/Upstash)
- PostgreSQL: Aiven PostgreSQL
- Redis: Upstash Redis
- Kafka: Aiven Kafka

## Files Modified

- `/apps/server/src/config/index.ts` - Central configuration management
- `/apps/server/src/services/kafka.ts` - Kafka service with env support
- `/apps/server/src/services/socket.ts` - Socket.io with Redis env support
- `/apps/server/src/services/prisma.ts` - Database configuration
- `/apps/server/src/index.ts` - Server entry point
- `/apps/web/config/index.ts` - Web app configuration
- `/apps/web/context/SocketProvider.tsx` - Socket client configuration

## Running the Application

1. Set your environment variables in both `.env` files
2. Start the server: `cd apps/server && npm run dev`
3. Start the web app: `cd apps/web && npm run dev`

The application will automatically use the appropriate services based on the `IS_PRODUCTION` flag.
