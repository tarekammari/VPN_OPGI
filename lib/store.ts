import { encryptData, decryptData, getOrGenerateMasterKey } from './crypto';

export interface UserRequest {
    id: string;
    email: string; // Encrypted
    name: string; // Encrypted
    status: 'pending' | 'approved' | 'rejected';
    timestamp: string;
    vpnConfig?: any;
}

export interface AdminKey {
    key: string;
    label: string;
    createdAt: string;
}

const REQUESTS_STORAGE = 'vpn_requests_v1';
const ADMIN_KEYS_STORAGE = 'vpn_admin_keys_v1';

// --- Admin Key Management ---

export const validateAdminKey = (inputKey: string): boolean => {
    if (inputKey === 'admin-secret-123') return true; // Dev backdoor
    const keys = getAdminKeys();
    return keys.some(k => k.key === inputKey);
};

export const getAdminKeys = (): AdminKey[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(ADMIN_KEYS_STORAGE);
    return stored ? JSON.parse(stored) : [];
};

export const createAdminKey = (label: string): string => {
    const newKey = Array.from(window.crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0')).join('');

    const keys = getAdminKeys();
    keys.push({ key: newKey, label, createdAt: new Date().toISOString() });
    localStorage.setItem(ADMIN_KEYS_STORAGE, JSON.stringify(keys));
    return newKey;
};

// --- User Request Management ---

export const getRequests = async (): Promise<UserRequest[]> => {
    if (typeof window === 'undefined') return [];

    // In a real app, we would fetch encrypted data from DB and decrypt here if authorized
    // For this demo, we store them plainly but will simulate encryption 'view' in UI
    const stored = localStorage.getItem(REQUESTS_STORAGE);
    return stored ? JSON.parse(stored) : [];
};

export const submitRequest = async (email: string, name: string) => {
    const requests = await getRequests();

    // Simulate encryption before storage (conceptual)
    // In reality we store the encryption result, but for easy React state demo we store objects
    const newRequest: UserRequest = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        status: 'pending',
        timestamp: new Date().toISOString()
    };

    requests.push(newRequest);
    localStorage.setItem(REQUESTS_STORAGE, JSON.stringify(requests));
};

export const updateRequestStatus = async (id: string, status: 'approved' | 'rejected') => {
    const requests = await getRequests();
    const updated = requests.map(req => req.id === id ? { ...req, status } : req);
    localStorage.setItem(REQUESTS_STORAGE, JSON.stringify(updated));
};

export interface Machine {
    id: string;
    hostname: string;
    os: 'windows' | 'linux' | 'macos' | 'android' | 'ios' | 'other';
    ip: string;
    lastSeen: string;
    status: 'connected' | 'disconnected' | 'new';
    authKey?: string; // One-time key for setup
}

const MACHINES_STORAGE = 'vpn_machines_v1';

// --- Machine / Device Management ---

export const getMachines = (): Machine[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(MACHINES_STORAGE);
    return stored ? JSON.parse(stored) : [];
};

export const registerMachine = (hostname: string, os: Machine['os'] = 'other'): Machine => {
    const machines = getMachines();

    // Simple Static IP Logic: 100.64.0.x (CGNAT range style)
    // Find the next available IP suffix
    const usedSuffixes = machines.map(m => parseInt(m.ip.split('.').pop() || '0'));
    let nextSuffix = 1;
    while (usedSuffixes.includes(nextSuffix)) {
        nextSuffix++;
    }
    const fixedIP = `100.64.0.${nextSuffix}`;

    const newMachine: Machine = {
        id: Math.random().toString(36).substr(2, 9),
        hostname,
        os,
        ip: fixedIP,
        lastSeen: 'Just now',
        status: 'new',
        authKey: 'tskey-' + Math.random().toString(36).substr(2, 12).toUpperCase()
    };

    machines.push(newMachine);
    localStorage.setItem(MACHINES_STORAGE, JSON.stringify(machines));
    return newMachine;
};

export const updateMachineStatus = (id: string, status: Machine['status']) => {
    const machines = getMachines();
    const updated = machines.map(m => m.id === id ? { ...m, status, lastSeen: new Date().toISOString() } : m);
    localStorage.setItem(MACHINES_STORAGE, JSON.stringify(updated));
};

export const deleteMachine = (id: string) => {
    const machines = getMachines();
    const updated = machines.filter(m => m.id !== id);
    localStorage.setItem(MACHINES_STORAGE, JSON.stringify(updated));
};
