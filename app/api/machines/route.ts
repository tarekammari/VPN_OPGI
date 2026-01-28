import { NextResponse } from 'next/server';
import { getDb, saveDb, Machine } from '../../../lib/db';

export async function GET() {
    const db = getDb();
    return NextResponse.json(db.machines);
}

export async function POST(request: Request) {
    const body = await request.json();
    const db = getDb();

    // Auto-approve/setup logic
    // Generate Static IP
    const usedSuffixes = db.machines.map(m => parseInt(m.ip.split('.').pop() || '0'));
    let nextSuffix = 1;
    while (usedSuffixes.includes(nextSuffix)) {
        nextSuffix++;
    }
    const fixedIP = `100.64.0.${nextSuffix}`;

    const newMachine: Machine = {
        id: Math.random().toString(36).substr(2, 9),
        hostname: body.hostname || 'Unknown Device',
        os: body.os || 'other',
        ip: fixedIP,
        lastSeen: 'Never',
        status: 'new',
        authKey: 'tskey-' + Math.random().toString(36).substr(2, 12).toUpperCase()
    };

    db.machines.push(newMachine);
    saveDb(db);

    return NextResponse.json(newMachine);
}
