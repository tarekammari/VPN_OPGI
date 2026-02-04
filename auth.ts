import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import db from './lib/db';
import bcrypt from 'bcryptjs';

async function getUser(email: string) {
    try {
        const user = await db.user.findUnique({ where: { email } });
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                try {
                    const parsedCredentials = z
                        .object({ email: z.string().email(), password: z.string().min(6) })
                        .safeParse(credentials);

                    if (parsedCredentials.success) {
                        const { email, password } = parsedCredentials.data;
                        const user = await getUser(email);
                        if (!user) return null;

                        const passwordsMatch = await bcrypt.compare(password, user.password || '');
                        if (passwordsMatch) return user;
                    }

                    console.log('Invalid credentials');
                    return null;
                } catch (error) {
                    console.error('Authorization error:', error);
                    // Attempt to log to file (Node.js runtime only)
                    try {
                        const fs = require('fs');
                        const path = require('path');
                        const logPath = path.join(process.cwd(), 'auth-errors.log');
                        fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${error instanceof Error ? error.message : String(error)}\n${error instanceof Error ? error.stack : ''}\n\n`);
                    } catch (e) {
                        console.error('Failed to write to log file:', e);
                    }
                    return null;
                }
            },
        }),
    ],
});
