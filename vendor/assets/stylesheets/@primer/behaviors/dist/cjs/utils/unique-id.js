"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueId = void 0;
let idSeed = 10000;
function uniqueId() {
    return `__primer_id_${idSeed++}`;
}
exports.uniqueId = uniqueId;
