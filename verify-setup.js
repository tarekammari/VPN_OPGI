
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

console.log('Checking environment variables...');
if (!process.env.AUTH_SECRET) {
    console.error('ERROR: AUTH_SECRET is not set in .env file.');
} else {
    console.log('SUCCESS: AUTH_SECRET is set.');
}

if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL is not set in .env file.');
} else {
    console.log('SUCCESS: DATABASE_URL is set.');
}

async function main() {
    console.log('Testing database connection...');
    const prisma = new PrismaClient();
    try {
        await prisma.$connect();
        console.log('SUCCESS: Connected to database.');

        // Check if user table exists (simple query)
        try {
            const userCount = await prisma.user.count();
            console.log(`SUCCESS: User table accessible. Found ${userCount} users.`);
        } catch (e) {
            console.error('ERROR: Could not query User table. Has "npx prisma migrate dev" been run?', e.message);
        }

    } catch (e) {
        console.error('ERROR: Database connection failed:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
