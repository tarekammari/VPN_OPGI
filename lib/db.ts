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

export interface Settings {
    displayName: string;
    emailNotification: boolean;
    reportNotification: boolean;
}

export interface Database {
    machines: Machine[];
    requests: Request[];
    settings: Settings;
}

export function getDb(): Database {
    const defaultSettings: Settings = {
        displayName: 'Demo User',
        emailNotification: true,
        reportNotification: false
    };

    if (!fs.existsSync(DB_PATH)) {
        const initial: Database = { machines: [], requests: [], settings: defaultSettings };
        fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
        return initial;
    }
    const file = fs.readFileSync(DB_PATH, 'utf-8');
    try {
        const data = JSON.parse(file);
        // Ensure settings exist if reading from older DB version
        if (!data.settings) {
            data.settings = defaultSettings;
        }
        return data;
    } catch (e) {
        return { machines: [], requests: [], settings: defaultSettings };
    }
}

export function saveDb(db: Database) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}
