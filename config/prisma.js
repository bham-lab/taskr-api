import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://postgres:1234@localhost:5432/todo_db";

const adapter = new PrismaPg({
    connectionString,
});

const prisma = new PrismaClient({
    adapter,
});

export default prisma;
