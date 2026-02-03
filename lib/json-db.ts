import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'db.json');

export function getDb() {
    if (!fs.existsSync(dbPath)) {
        return { settings: {} };
    }
    const file = fs.readFileSync(dbPath, 'utf8');
    try {
        return JSON.parse(file);
    } catch (error) {
        console.error("Error parsing db.json", error);
        return { settings: {} };
    }
}

export function saveDb(data: any) {
    // Ensure directory exists
    const dirname = path.dirname(dbPath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}
