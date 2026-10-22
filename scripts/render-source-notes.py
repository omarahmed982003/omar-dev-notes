from pathlib import Path
import subprocess
from PIL import Image, ImageOps, ImageDraw

root = Path(__file__).resolve().parents[1]
output = root / 'tmp/source-notes'
output.mkdir(parents=True, exist_ok=True)
poppler = Path('C:/Users/omara/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe')
source = Path('C:/Users/omara/OneDrive/Desktop/php.pdf')
subprocess.run([str(poppler), '-scale-to', '1000', '-jpeg', '-jpegopt', 'quality=75', str(source), str(output/'page')], check=True)
pages = sorted(output.glob('page-*.jpg'))
for offset in range(0, len(pages), 12):
    sheet = Image.new('RGB', (1200, 2320), 'white')
    draw = ImageDraw.Draw(sheet)
    for position, file in enumerate(pages[offset:offset+12]):
        image = Image.open(file).convert('RGB')
        image.thumbnail((395, 550))
        x, y = (position % 3)*400, (position//3)*580
        sheet.paste(image, (x, y+25))
        draw.text((x+5,y+5), f'PDF page {offset+position+1}', fill='black')
    sheet.save(output/f'contact-{offset//12+1}.jpg', quality=90)
print(f'Rendered {len(pages)} source pages; contact sheets in {output}')
