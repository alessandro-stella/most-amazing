export function generateRandomString(length: number): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";

    let result = "";

    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }

    return result;
}

export function generateSessionString(): string {
    const lengths = [8, 4, 4, 4, 12];
    const strings = lengths.map((length) => generateRandomString(length));

    const result = strings.join("-");

    return result;
}
