# theleadershipfork.com

Static landing page for *The Leadership Fork*. No build step: plain HTML, CSS and
JS, ready for GitHub Pages.

## Files

- `index.html` - the landing page (hero, how it works, tagline, benefits,
  chapters, excerpt, Substack signup, author, FAQ, final CTA)
- `assets/styles.css`, `assets/main.js` - visual system and interactions
- `assets/fonts/` - self-hosted Manrope (no Google Fonts request), plus a
  Latin subset of EB Garamond Italic (the book's typeface, SIL OFL), used only
  for the tagline quote
- `assets/img/` - cover, favicon sizes, `og.jpg` share image
- `read/the-leadership-fork-chapter-one-bcd841da.pdf` - the free chapter
  (unlisted URL, excluded in robots.txt)
- `privacy.html`, `imprint.html`, `404.html`, `CNAME`, `robots.txt`, `sitemap.xml`

## Before launch

1. **Author photo**: save as `assets/img/author.jpg` (4:5) and swap the placeholder
   in the `#author` section of `index.html` (instructions in the HTML comment).
2. **Imprint and privacy**: fill the `{{...}}` placeholders.
3. **Substack welcome email**: Substack > Settings > Emails > Welcome email for
   free subscribers. Add the chapter link:
   `https://theleadershipfork.com/read/the-leadership-fork-chapter-one-bcd841da.pdf`
4. **Chapter PDF**: currently a copy of `../chapter1.pdf`. Re-copy it to the same
   filename whenever the chapter changes.

## Deploy (GitHub Pages)

1. Create a repo `theleadershipfork` and push the contents of this folder to `main`.
2. Repo > Settings > Pages > Deploy from branch `main`, folder `/ (root)`.
   The `CNAME` file sets the custom domain.
3. At your domain registrar, add DNS records:
   - `A` records for `@`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - `CNAME` for `www`: `mike-dono-0815.github.io`
4. Once the certificate is issued, tick **Enforce HTTPS**.

## Updating the excerpt

The excerpt has two forms:

- **Flipbook** (what visitors see): images of PDF pages 1 to 10 of
  `../chapter1.pdf` (cover, Introduction, chapter title page, opening scene up
  to the fork), in `assets/pages/`. After recompiling the chapter, run
  `python tools/render_pages.py`. If the fork moves to a different page, change
  `LAST_PAGE` in the script and the page list in the `#flipbook` block of
  `index.html`. The page turn uses StPageFlip 2.0.7 (MIT), self-hosted in
  `assets/vendor/`.
- **Plain text version** (collapsed under the book, for screen readers, search
  engines and anyone who prefers text): sits between the
  `<!--EXCERPT_INTRO:start-->` / `<!--EXCERPT_CH1:start-->` markers, converted
  from `Intro.tex` and `chapter1.tex`.

## Local preview

The page uses absolute `/assets` paths, so open it through a local server, not
by double-clicking `index.html`. From the `bookhomepage` folder run:

```
cd C:/Users/micha/OneDrive/Root/Code/bookhomepage
C:/Users/micha/AppData/Local/Programs/Python/Python312/python -m http.server 8765 --bind 127.0.0.1
```

Then open http://127.0.0.1:8765/ in the browser. `--bind 127.0.0.1` keeps the
server reachable from this computer only. Stop it with `Ctrl+C` in that terminal.

After changing CSS or JS, reload with `Ctrl+Shift+R` so the browser does not
show a cached copy.
