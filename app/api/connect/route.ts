import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function POST(request: Request) {
    const body = await request.json();
    const { authKey, action } = body;
    // action: 'connect' | 'disconnect' | 'heartbeat'

    if (!authKey) {
        return NextResponse.json({ success: false, error: 'Missing Auth Key' }, { status: 400 });
    }

    // 1. Find the key
    const validKey = await db.authKey.findUnique({
        where: { key: authKey },
        include: { machine: true }
    });

    if (!validKey || !validKey.machine) {
        return NextResponse.json({ success: false, error: 'Invalid Auth Key' }, { status: 401 });
    }

    const machine = validKey.machine;

    // 2. Update status
    let newStatus = machine.status;
    let lastSeen = new Date();

    if (action === 'connect') {
        newStatus = 'connected';
    } else if (action === 'disconnect') {
        newStatus = 'disconnected';
    } else if (action === 'heartbeat') {
        newStatus = 'connected';
    }

    await db.machine.update({
        where: { id: machine.id },
        data: {
            status: newStatus,
            lastSeen: lastSeen
        }
    });

    return NextResponse.json({
        success: true,
        ip: machine.ip,
        status: newStatus,
        publicKey: machine.publicKey // Return if needed
    });
}
