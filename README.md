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

## Status (9 November 2026)

The site is live at https://theleadershipfork.com.

Done:

- Author photo in place (`assets/img/author.jpg`, `.webp`).
- Git repo set up and connected to GitHub (`mike-dono-0815/bookhomepage`, branch `main`).
- GitHub Pages enabled; domain `theleadershipfork.com` (bought at Porkbun)
  points to it, HTTPS works, `www` and `http://` redirect to `https://theleadershipfork.com/`.
- Google Search Console: domain property verified (TXT record), sitemap submitted,
  indexing requested for the homepage.
- Search tweaks for the name and the hashtag `#TheLeadershipFork` (see below).
- Imprint and privacy filled in for Germany (see below).
- Decision: **no Google Analytics.** It sets cookies and would need a consent
  banner under German law (TDDDG § 25, GDPR). The site stays cookie free.

Still open:

1. **Email**: make sure `book@theleadershipfork.com` receives mail
   (Porkbun > Domain Management > Email Forwarding; send a test).
2. **Second contact channel** in the imprint (usually a phone number), which
   German law expects besides email.
3. **Legal check** of `imprint.html` and `privacy.html` (lawyer or eRecht24).
4. **Substack welcome email**: Substack > Settings > Emails > Welcome email for
   free subscribers. Add the chapter link:
   `https://theleadershipfork.com/read/the-leadership-fork-chapter-one-bcd841da.pdf`
5. **Chapter PDF**: currently a copy of the book's `chapter1.pdf`. Re-copy it to
   the same filename whenever the chapter changes.
6. **Hashtag**: use `#TheLeadershipFork` in LinkedIn, Instagram and TikTok posts and
   link theleadershipfork.com from all profiles. Links from these profiles help
   Google rank the site for the name.

## Deploy (GitHub Pages)

Repo: https://github.com/mike-dono-0815/bookhomepage (public). Every push to
`main` goes live within about a minute:

```
git add -A
git commit -m "Describe the change"
git push
```

One time setup (already done):

1. Repo > Settings > Pages > Deploy from branch `main`, folder `/ (root)`.
   The `CNAME` file sets the custom domain.
2. Porkbun > Domain Management > theleadershipfork.com > DNS. Porkbun's default
   parking records (`ALIAS` on the bare domain, `CNAME` for `*`) removed, then added:

   | Type  | Host  | Answer                     |
   |-------|-------|----------------------------|
   | A     | empty | 185.199.108.153            |
   | A     | empty | 185.199.109.153            |
   | A     | empty | 185.199.110.153            |
   | A     | empty | 185.199.111.153            |
   | CNAME | www   | mike-dono-0815.github.io   |
   | TXT   | empty | `google-site-verification=...` (keep it, Search Console needs it) |

   Optional IPv6: four `AAAA` records, host empty, `2606:50c0:8000::153` to
   `2606:50c0:8003::153`.
3. Repo > Settings > Pages > **Enforce HTTPS** ticked once the certificate was issued.

Because the repo is public, everything in it can be seen, including the
Chapter 1 PDF and the imprint address.

## Search engines and the hashtag

- **Google Search Console** (https://search.google.com/search-console), property
  `theleadershipfork.com` (type "Domain"). Sitemap submitted as the full URL
  `https://theleadershipfork.com/sitemap.xml` (domain properties need the full URL).
  The **Performance** report shows which searches find the site, without cookies.
  Check if the page is indexed by searching for `site:theleadershipfork.com` on Google.
- Google does not search by hashtags, so the page ties the names together instead:
  - JSON-LD in `index.html`: a `WebSite` entry with the alternate names
    `TheLeadershipFork`, `#TheLeadershipFork` and `theleadershipfork.com`, plus
    `alternateName` and `keywords` on the `Book` entry.
  - Visible line in the Connect section: "Share your fork moments with
    #TheLeadershipFork".
  - `robots` meta (`index, follow, max-image-preview:large`) and `og:locale`.
- `sitemap.xml` has a `lastmod` date. Update it after bigger content changes.
- `robots.txt` keeps `/read/` (the chapter PDF) out of search results.

## Legal pages (Germany)

- `imprint.html`: information according to § 5 DDG. Michael Donoser,
  Sulzbergweg 11, 12107 Berlin, Germany, `book@theleadershipfork.com`. Also names
  the person responsible for content under § 18 (2) MStV. (The template first
  cited Austrian law. That was replaced.)
- `privacy.html`: last updated 9 November 2026. Names the Berlin data protection
  authority (Berliner Beauftragte für Datenschutz und Informationsfreiheit). It
  states that the site sets no cookies and runs no analytics. If analytics are
  ever added, update this page.

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
