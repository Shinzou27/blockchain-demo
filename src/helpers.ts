import {createHash, BinaryLike} from 'crypto'

export function hash(data: BinaryLike) {
    return createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

export function authHash({hash, diff = 4, prefix = '0'}: {hash: string, diff: number, prefix: string}): boolean {
    const check = prefix.repeat(diff);
    return hash.startsWith(check);
}