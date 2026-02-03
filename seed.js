const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@opgi.dz'; // Default admin email
    const password = 'admin-password-123'; // Default password
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (!existingUser) {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: 'Super Admin',
                role: 'admin',
            },
        });
        console.log(`Created user: ${user.email}`);
    } else {
        console.log('Admin user already exists.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
