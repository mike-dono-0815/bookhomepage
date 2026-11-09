"""Render the preview pages for the flipbook from the compiled chapter PDF.

Run from the bookhomepage folder after recompiling chapter1.tex:
    python tools/render_pages.py

Pages 1 to 10 of chapter1.pdf are the cover, the Introduction, the chapter
title page and the opening scene up to the fork. Adjust LAST_PAGE if the
layout of the book changes and the fork moves to another page.
"""
import pathlib
import fitz  # PyMuPDF
from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent.parent
PDF = HERE.parent / "chapter1.pdf"
OUT = HERE / "assets" / "pages"
FIRST_PAGE, LAST_PAGE = 1, 10   # 1-based, inclusive
HEIGHT = 1200                   # px; pages display at up to 600px tall, so this is 2x

OUT.mkdir(parents=True, exist_ok=True)
for old in OUT.glob("page-*.*"):
    old.unlink()

doc = fitz.open(PDF)
for n in range(FIRST_PAGE, LAST_PAGE + 1):
    page = doc[n - 1]
    zoom = HEIGHT / page.rect.height
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
    img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    name = OUT / ("page-%02d" % n)
    img.save(name.with_suffix(".webp"), quality=82, method=6)
    img.save(name.with_suffix(".jpg"), quality=82, optimize=True, progressive=True)
    print(name.name, img.size)
