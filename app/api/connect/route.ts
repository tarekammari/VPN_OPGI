import { NextResponse } from 'next/server';
import { getDb, saveDb } from '../../../lib/db';

export async function POST(request: Request) {
    const body = await request.json();
    const { authKey, action } = body;
    // action: 'connect' | 'disconnect' | 'heartbeat'

    const db = getDb();
    const machine = db.machines.find(m => m.authKey === authKey);

    if (!machine) {
        return NextResponse.json({ success: false, error: 'Invalid Auth Key' }, { status: 401 });
    }

    if (action === 'connect') {
        machine.status = 'connected';
        machine.lastSeen = 'Just now';
    } else if (action === 'disconnect') {
        machine.status = 'disconnected';
    } else if (action === 'heartbeat') {
        machine.lastSeen = 'Just now';
        machine.status = 'connected';
    }

    // Update in DB
    db.machines = db.machines.map(m => m.id === machine.id ? machine : m);
    saveDb(db);

    return NextResponse.json({
        success: true,
        ip: machine.ip,
        status: machine.status
    });
}
