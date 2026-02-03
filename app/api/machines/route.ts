import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import { auth } from '../../../auth';
import { Machine } from '@prisma/client';

export async function GET() {
    const session = await auth();
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
        where: { email: session.user.email },
        include: {
            machines: {
                include: { authKey: true }
            }
        }
    });

    if (!user) {
        return NextResponse.json([]);
    }

    // Flatten authKey for frontend compatibility
    const machines = user.machines.map((m: Machine & { authKey?: { key: string } | null }) => ({
        ...m,
        authKey: m.authKey?.key || null
    }));

    return NextResponse.json(machines);
}

export async function POST(request: Request) {
    const session = await auth();
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Find next available IP suffix
    // (This is a simplified approach for the prototype. In production, use a proper IPAM)
    const allMachines = await db.machine.findMany({ select: { ip: true } });
    const usedSuffixes = allMachines.map(m => parseInt(m.ip.split('.').pop() || '0'));
    let nextSuffix = 1;
    while (usedSuffixes.includes(nextSuffix)) {
        nextSuffix++;
    }
    const fixedIP = `100.64.0.${nextSuffix}`;
    const newAuthKey = 'tskey-' + Math.random().toString(36).substr(2, 12).toUpperCase();

    // Create Machine and Auth Key
    const newMachine = await db.machine.create({
        data: {
            hostname: body.hostname || 'Unknown Device',
            os: body.os || 'other',
            ip: fixedIP,
            authKey: {
                create: {
                    key: newAuthKey
                }
            },
            user: {
                connect: { email: session.user.email }
            }
        },
        include: {
            authKey: true
        }
    });

    // Return format matching frontend expectation
    return NextResponse.json({
        ...newMachine,
        authKey: newAuthKey // Flatten for frontend convenience
    });
}
