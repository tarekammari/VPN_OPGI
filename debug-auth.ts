
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function debugAuth() {
    console.log('--- START DEBUG ---');
    console.log('Env Check:');
    console.log('AUTH_SECRET exists:', !!process.env.AUTH_SECRET);
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

    const email = 'admin@opgi.dz';
    console.log(`\nLooking up user: ${email}`);

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.log('❌ User NOT found.');
            // List all users to see what we have
            const allUsers = await prisma.user.findMany();
            console.log('Available users:', allUsers.map(u => u.email));
        } else {
            console.log('✅ User found:', user.email);
            console.log('User ID:', user.id);
            console.log('Has password hash:', !!user.password);

            // Since I don't know the password, I can't verify it, but I can check if the hash looks valid.
            // Or I can create a temp user/reset password if needed. 
            // For now, let's just confirm the user exists and has a password.
        }
    } catch (error) {
        console.error('❌ DB Error:', error);
    } finally {
        await prisma.$disconnect();
        console.log('--- END DEBUG ---');
    }
}

debugAuth();
