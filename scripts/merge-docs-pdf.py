import io
import json
import sys
from pathlib import Path
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas

manifest = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
output = Path(sys.argv[2])
writer = PdfWriter()
parts = []
for part in manifest:
    reader = PdfReader(part["file"])
    parts.append({"label": part["label"], "pages": len(reader.pages), "start": len(writer.pages) + 1})
    writer.append(reader, outline_item=part["label"])
total = len(writer.pages)
for number, page in enumerate(writer.pages, 1):
    width, height = float(page.mediabox.width), float(page.mediabox.height)
    stream = io.BytesIO()
    layer = canvas.Canvas(stream, pagesize=(width, height))
    layer.setFont("Helvetica", 8)
    layer.setFillColorRGB(*( (0.92, 0.94, 0.98) if number == 1 else (0.36, 0.40, 0.48) ))
    layer.drawString(42.5, 24, "Omar Dev Notes")
    layer.drawRightString(width - 42.5, 24, f"{number} / {total}")
    layer.save()
    stream.seek(0)
    page.merge_page(PdfReader(stream).pages[0])
writer.add_metadata({"/Title": "Omar Programming Library - Complete Arabic and English Edition"})
with output.open("wb") as target:
    writer.write(target)
assert len(PdfReader(output).pages) == total
print(json.dumps({"pages": total, "parts": parts}))

