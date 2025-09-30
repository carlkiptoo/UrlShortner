import dns from 'node:dns/promises';
import net from 'node:net';

export async function isSafeUrl(url: string): Promise<boolean> {
    try {
        const {hostname} = new URL(url);

        if (net.isIP(hostname)) {
            return !isPrivate(hostname);
        }

        const addresses = await dns.lookup(hostname, {all: true});

        for (const {address} of addresses) {
            if (isPrivate(address)) {
                return false;
            }
        }
        return true;
    } catch (error) {
        console.error('Error checking URL safety:', error);
        return false;
    }
}

function isPrivate(ip: string): boolean {
    if (!net.isIP(ip)) return false;

    return (
        ip.startsWith('10.') ||
        ip.startsWith('192.168.') ||
        /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip) ||
        ip === '127.0.0.1' || ip === '::1' || 
        ip.startsWith('fc') || ip.startsWith('fd')
    );
}