"""Create the downloadable, reproducible lesson-lab archive."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
root=Path(__file__).resolve().parents[1]
output=root/'public/downloads/php-labs.zip';output.parent.mkdir(parents=True,exist_ok=True)
with ZipFile(output,'w',compression=ZIP_DEFLATED) as archive:
    for path in sorted((root/'examples/php-labs').rglob('*')):
        if path.is_file() and path.suffix in {'.php','.sql','.json','.md','.csv','.txt'}:
            entry=ZipInfo('php-labs/'+path.relative_to(root/'examples/php-labs').as_posix(),(2026,9,26,0,0,0))
            entry.compress_type=ZIP_DEFLATED
            archive.writestr(entry,path.read_bytes())
print(output)
