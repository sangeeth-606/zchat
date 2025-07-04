import {PrismaClient} from "@prisma/client";
import config from '../config';

// Override the DATABASE_URL environment variable based on configuration
if (config.database.url) {
  process.env.DATABASE_URL = config.database.url;
}

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

export default prisma;