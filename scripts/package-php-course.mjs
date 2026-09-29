import fs from 'node:fs';
import path from 'node:path';
import { deflateRawSync } from 'node:zlib';

const root = path.resolve('examples/php-course');
const output = path.resolve('public/downloads/php-course.zip');
const table = Uint32Array.from({ length: 256 }, (_, value) => {
    for (let i = 0; i < 8; i++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    return value >>> 0;
});
function crc32(bytes) {
    let crc = 0xffffffff;
    for (const byte of bytes) crc = table[(crc ^ byte) & 255] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
}
function walk(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap(entry => {
        if (['vendor', 'storage', '.phpunit.cache'].includes(entry.name) || entry.name.endsWith('.cache')) return [];
        const file = path.join(directory, entry.name);
        return entry.isDirectory() ? walk(file) : entry.isFile() && (/\.(php|json|lock|md)$/.test(entry.name) || entry.name === '.gitignore') ? [file] : [];
    });
}
const files = walk(root);
const local = [], central = [];
let offset = 0;
const date = ((2026 - 1980) << 9) | (9 << 5) | 27;
for (const file of files) {
    const name = Buffer.from('php-course/' + path.relative(root, file).split(path.sep).join('/'));
    const bytes = fs.readFileSync(file), compressed = deflateRawSync(bytes), checksum = crc32(bytes);
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(0x800, 6);
    header.writeUInt16LE(8, 8);
    header.writeUInt16LE(date, 12);
    header.writeUInt32LE(checksum, 14);
    header.writeUInt32LE(compressed.length, 18);
    header.writeUInt32LE(bytes.length, 22);
    header.writeUInt16LE(name.length, 26);
    local.push(header, name, compressed);
    const record = Buffer.alloc(46);
    record.writeUInt32LE(0x02014b50, 0);
    record.writeUInt16LE(20, 4);
    record.writeUInt16LE(20, 6);
    record.writeUInt16LE(0x800, 8);
    record.writeUInt16LE(8, 10);
    record.writeUInt16LE(date, 14);
    record.writeUInt32LE(checksum, 16);
    record.writeUInt32LE(compressed.length, 20);
    record.writeUInt32LE(bytes.length, 24);
    record.writeUInt16LE(name.length, 28);
    record.writeUInt32LE(offset, 42);
    central.push(record, name);
    offset += header.length + name.length + compressed.length;
}
const directory = Buffer.concat(central);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(files.length, 8);
end.writeUInt16LE(files.length, 10);
end.writeUInt32LE(directory.length, 12);
end.writeUInt32LE(offset, 16);
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, Buffer.concat([...local, directory, end]));
console.log('Packaged ' + files.length + ' files: ' + output);

