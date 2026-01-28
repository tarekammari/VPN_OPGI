export async function generateKey(): Promise<CryptoKey> {
    return window.crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt']
    );
}

export async function exportKey(key: CryptoKey): Promise<string> {
    const exported = await window.crypto.subtle.exportKey('jwk', key);
    return JSON.stringify(exported);
}

export async function importKey(jwkString: string): Promise<CryptoKey> {
    const jwk = JSON.parse(jwkString);
    return window.crypto.subtle.importKey(
        'jwk',
        jwk,
        { name: 'AES-GCM' },
        true,
        ['encrypt', 'decrypt']
    );
}

export async function encryptData(data: string, key: CryptoKey): Promise<{ iv: string; cipherText: string }> {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        encodedData
    );

    return {
        iv: Array.from(iv).toString(),
        cipherText: Array.from(new Uint8Array(encrypted)).toString(),
    };
}

export async function decryptData(cipherText: string, ivString: string, key: CryptoKey): Promise<string> {
    const iv = new Uint8Array(ivString.split(',').map(Number));
    const encryptedData = new Uint8Array(cipherText.split(',').map(Number));

    const decrypted = await window.crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        encryptedData
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
}

// Helper for demo keys
export const MASTER_KEY_STORAGE = 'vpn_master_key_v1';
export async function getOrGenerateMasterKey(): Promise<CryptoKey> {
    const stored = localStorage.getItem(MASTER_KEY_STORAGE);
    if (stored) {
        return importKey(stored);
    }
    const key = await generateKey();
    const exported = await exportKey(key);
    localStorage.setItem(MASTER_KEY_STORAGE, exported);
    return key;
}
