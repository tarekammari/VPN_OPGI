import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export interface Machine {
    id: string;
    hostname: string;
    os: 'windows' | 'linux' | 'macos' | 'android' | 'ios' | 'other';
    ip: string;
    lastSeen: string;
    status: 'connected' | 'disconnected' | 'new';
    authKey: string;
}

export interface Request {
    email: string;
    name: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface Database {
    machines: Machine[];
    requests: Request[];
}

export function getDb(): Database {
    if (!fs.existsSync(DB_PATH)) {
        const initial: Database = { machines: [], requests: [] };
        fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
        return initial;
    }
    const file = fs.readFileSync(DB_PATH, 'utf-8');
    try {
        return JSON.parse(file);
    } catch (e) {
        return { machines: [], requests: [] };
    }
}

export function saveDb(db: Database) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}
