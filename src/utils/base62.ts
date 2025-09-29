const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function encodeBase62(num: number): string {
    if (num === 0) return ALPHABET[0] ?? '';
    let s = '';
    while (num > 0) {
        s = ALPHABET[num % 62] + s;
        num = Math.floor(num / 62);
    }
    return s;
}