"""Generate the package catalog from the Markdown files in packages/details."""

import argparse
import re
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from io import BytesIO
from pathlib import Path
from urllib.parse import quote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
CATALOG = Path("docs/packages/catalog.md")
DETAILS = CATALOG.parent / "details"
HEADING = re.compile(r"^# +(.+?)(?: +#+)? *$", re.MULTILINE)
MARKDOWN_PUNCTUATION = str.maketrans({
    char: f"&#{ord(char)};" for char in "&<>[]|`*_\\"
})


def generate_catalog():
    rows = [
        "<!-- Generated from docs/packages/details by scripts/package_catalog.py. -->",
        "",
        "## Package catalog",
        "",
        "| Package guide |",
        "| --- |",
    ]
    for path in sorted((ROOT / DETAILS).rglob("*")):
        if not path.is_file() or path.suffix.lower() != ".md":
            continue
        heading = HEADING.search(path.read_text(encoding="utf-8-sig"))
        title = heading.group(1) if heading else path.stem
        title = title.replace("`", "").translate(MARKDOWN_PUNCTUATION)
        url = quote(path.relative_to(ROOT / CATALOG.parent).as_posix())
        rows.append(f"| [{title}]({url}) |")
    return "\n".join(rows) + "\n"


class PreviewHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        if urlsplit(self.path).path != f"/{CATALOG.as_posix()}":
            return super().send_head()

        content = generate_catalog().encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/markdown; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        return BytesIO(content)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--serve", action="store_true", help="Preview with a live catalog")
    args = parser.parse_args()
    if args.serve:
        handler = partial(PreviewHandler, directory=ROOT)
        with ThreadingHTTPServer(("127.0.0.1", 8000), handler) as server:
            print("Preview at http://127.0.0.1:8000/", flush=True)
            server.serve_forever()
    else:
        (ROOT / CATALOG).write_text(generate_catalog(), encoding="utf-8")
