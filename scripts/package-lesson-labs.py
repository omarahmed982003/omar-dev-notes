"""Create the downloadable, reproducible lesson-lab archive."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
root=Path(__file__).resolve().parents[1]
output=root/'public/downloads/php-labs.zip';output.parent.mkdir(parents=True,exist_ok=True)
with ZipFile(output,'w',compression=ZIP_DEFLATED) as archive:
    for path in sorted((root/'examples/php-labs').rglob('*')):
        relative=path.relative_to(root/'examples/php-labs')
        if path.is_file() and 'vendor' not in relative.parts and (
            path.suffix in {'.php','.sql','.json','.lock','.md','.csv','.txt','.yaml','.ini','.conf'}
            or path.name in {'Dockerfile','.dockerignore'}
        ):
            entry=ZipInfo('php-labs/'+relative.as_posix(),(2026,9,27,0,0,0))
            entry.compress_type=ZIP_DEFLATED
            archive.writestr(entry,path.read_bytes())
print(output)
