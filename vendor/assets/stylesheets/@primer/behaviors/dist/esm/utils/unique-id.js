let idSeed = 10000;
export function uniqueId() {
    return `__primer_id_${idSeed++}`;
}
