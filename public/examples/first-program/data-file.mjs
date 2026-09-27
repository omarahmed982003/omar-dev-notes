import { readFileSync, writeFileSync } from 'node:fs';

const mode = process.argv[2];
const filename = 'practice-list.json';
try {
  if (mode === 'save') {
    const items = ['milk', 'bread'];
    writeFileSync(filename, JSON.stringify(items), { encoding: 'utf8', flag: 'wx' });
    console.log('Saved a new practice-list.json');
  } else if (mode === 'read') {
    const items = JSON.parse(readFileSync(filename, 'utf8'));
    if (!Array.isArray(items)) throw new Error('Expected a list');
    for (const item of items) {
      if (typeof item !== 'string') throw new Error('Expected text items');
    }
    console.log(items.join(' / '));
  } else {
    console.log('Use: node data-file.mjs save OR node data-file.mjs read');
  }
} catch (error) {
  if (error.code === 'ENOENT') console.log('No saved file. Run the save command first.');
  else if (error.code === 'EEXIST') console.log('File already exists. Read it or use a new practice folder.');
  else console.log('Cannot complete the operation. Check the file format and access.');
  process.exitCode = 1;
}
