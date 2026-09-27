import json
from pathlib import Path
from pypdf import PdfReader

pdf = Path("output/pdf/omar-dev-notes-complete.pdf")
reader = PdfReader(pdf)
export = json.loads(Path("planning/audit-results/pdf-export.json").read_text(encoding="utf-8"))
assert len(reader.pages) == export["pages"]
assert len(export["parts"]) == 15, "Cover plus seven sections per language"
assert all(part["pages"] > 0 for part in export["parts"])
terms = {
    "binary": "00000101",
    "local_network_lab": "Set up a local request-and-response lab",
    "staged_shopping": "Build four runnable stages",
    "memory_translation": "Addresses and virtual memory",
    "input_validation": "Read and validate user input",
    "text_processing": "Clean, search, and split text",
    "saved_list": "Save a list and open it again",
    "shopping_project": "Build and test a shopping list",
    "wifi_practice": "Connect to Wi-Fi and diagnose problems",
    "shopping_code": "foundations-shopping-v1",
    "certificates": "Domain Validation",
    "lists": "discountedPrice",
    "http_length": "Content-Length: 27",
    "english_binary_lesson": "How computers represent numbers and text",
    "english_certificates_lesson": "Connection encryption and website certificates",
    "final_database_lesson": "Schema, indexes, and migrations",
}
hits = {key: [] for key in terms}
for number, page in enumerate(reader.pages, 1):
    text = " ".join((page.extract_text() or "").split())
    for key, term in terms.items():
        if term in text:
            hits[key].append(number)
assert all(hits.values()), hits
assert hits["english_binary_lesson"][0] > hits["lists"][0]
assert hits["final_database_lesson"][-1] > len(reader.pages) * .9
result = {
    "pages": len(reader.pages), "bytes": pdf.stat().st_size,
    "parts": len(export["parts"]), "evidence_pages": hits,
}
Path("planning/audit-results/pdf-checks.json").write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
print(json.dumps(result))

