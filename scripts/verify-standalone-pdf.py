import json
import subprocess
from pathlib import Path
from pypdf import PdfReader

root = Path(__file__).resolve().parents[1]
pdf = root / 'output/pdf/omar-dev-notes-complete.pdf'
manifest = json.loads((root / 'planning/audit-results/pdf-export.json').read_text(encoding='utf-8'))
reader = PdfReader(pdf)
assert len(reader.pages) == manifest['pages']
assert len(manifest['parts']) == 13  # cover plus six courses in two languages
assert not any('object-oriented' in part['label'].lower() for part in manifest['parts'])
english = next(part for part in manifest['parts'] if part['label'].startswith('EN - Computer'))
tcp_page = None
software_page = None
for index in range(english['start'] - 1, english['start'] - 1 + english['pages']):
    text = ' '.join((reader.pages[index].extract_text() or '').split())
    if 'from the first SYN' in text and tcp_page is None:
        tcp_page = index + 1
    if 'Software: from source code' in text and software_page is None:
        software_page = index + 1
assert tcp_page and software_page
poppler = Path('C:/Users/omara/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe')
for number, name in [(1, 'cover'), (tcp_page, 'tcp')]:
    subprocess.run([str(poppler), '-f', str(number), '-l', str(number), '-scale-to', '1200', '-singlefile', '-png', str(pdf), str(root / f'planning/audit-results/standalone-pdf-{name}')], check=True)
result = {'pages':len(reader.pages), 'parts':len(manifest['parts']), 'tcpPage':tcp_page, 'softwarePage':software_page, 'bytes':pdf.stat().st_size}
(root / 'planning/audit-results/standalone-pdf-2026-10-20.json').write_text(json.dumps(result, indent=2)+'\n', encoding='utf-8')
print(json.dumps(result))
