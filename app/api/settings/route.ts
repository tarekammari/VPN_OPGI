import { NextResponse } from 'next/server';
import { getDb, saveDb } from '../../../lib/db';

export async function GET() {
    const db = getDb();
    return NextResponse.json(db.settings);
}

export async function POST(request: Request) {
    const body = await request.json();
    const db = getDb();

    // Merge new settings with existing ones
    db.settings = {
        ...db.settings,
        ...body
    };

    saveDb(db);
    return NextResponse.json({ success: true, settings: db.settings });
}
