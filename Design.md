# Design notes: theleadershipfork.com

How the landing page for *The Leadership Fork* (release 2027) was built, and why
it looks the way it does. For deployment and update steps, see `README.md`.

## Goal

One page with one job: get readers onto the Substack newsletter
(theleadershipfork.substack.com). The hook is the full Chapter 1 as a free PDF,
delivered through the welcome email. Everything else on the page builds the case
for signing up: what the book is, how it works, a real preview, who wrote it.

## Setup

- Static HTML, CSS and JS with no build step, hosted on GitHub Pages under
  theleadershipfork.com (`CNAME`, `.nojekyll`).
- Lives in its own repo. `bookhomepage/` is listed in the my-book `.gitignore`, so
  it is never pushed with the book sources.
- Privacy friendly: fonts, icons and the page flip library are self-hosted. The
  only third party is the Substack signup iframe (noted on the privacy page).
- The Chapter 1 PDF sits at an unlisted URL under `read/` and is excluded in
  `robots.txt`. It is not truly protected, since the repo is public.

## Design system

Based on the elayadesign landing-page-design skill
(github.com/elayadesign/ai-design-skills).

- **Colours** are sampled from the cover: cream `#faf8f1`, navy `#0b2340`,
  fork blue `#2e73a0`, fork orange `#ee8a20` (darker `#a85808` for text),
  sticker yellow `#ffc93c`, and the book's pullquote gold `#a88230`.
- **Type**: Manrope for everything (self-hosted, Tailwind type scale, named text
  styles, no italics). One deliberate exception: the two quotes use EB Garamond
  Italic, the book's own typeface (22 KB Latin subset, SIL OFL), so they read as
  the book speaking.
- **Spacing and radii** use fixed tokens (`--s-25` to `--s-900`, Tailwind radii).
  No background gradients.
- **Icons**: Phosphor (inlined SVG symbols); brand marks from Phosphor fill
  (LinkedIn, Instagram, TikTok) and Simple Icons (Substack).
- **Motion**: one easing curve, scroll reveals, a word-by-word tagline reveal,
  and full support for reduced motion.
- **Copy rules**: sentence case for headings, title case for nav labels, no
  invented facts, no hyphens in the page's own copy.

## Page structure, top to bottom

1. **Floating nav**: The Idea, Chapters, Read the Opening, Author, FAQ, plus a
   "Get Chapter 1" button. Full-height menu on phones.
2. **Hero**: "Same crisis. Same people. One team unravels. One grows." The book
   cover with a round yellow "Coming 2027" sticker on its lower right. The main
   button "Get Chapter 1 free" with the note "Free when you join the newsletter.
   Unsubscribe anytime." A one-line author credit with a round avatar.
3. **How the book works**: "Five stories, two paths each". One blue and orange
   road drawn across the section splits at the fork; its three stops mark The
   situation, The fork and The mechanisms. On phones it becomes a vertical rail.
4. **Tagline quote**: "The difference is rarely talent. It is small, almost
   invisible choices that harden into habits." Garamond italic between two gold
   rules, fork icon on the top rule, credited to Michael Donoser only (the wording
   is not a verbatim book quote).
5. **Why this book**: four benefit cards.
6. **Chapters**: five cards. Each has a situation tag, the title, a one or two
   sentence story hook (setup only, no spoilers), the theme, and three real
   mechanism titles under "11 mechanisms, including", plus "+ 8 more".
7. **Start reading now**: a flipbook of the real book pages (PDF pages 1 to 10:
   cover, introduction, opening of Chapter 1 up to the fork) with a page-turn
   animation (StPageFlip, MIT). The closed cover is centred and slides into the
   two-page position as the book opens. "Read larger" opens a zoom view. A plain
   text version sits collapsed underneath for screen readers and search engines.
8. **Signup**: dark panel with the Substack embed. Benefits: regular leadership
   lessons, the rest of Chapter 1, all 11 Chapter 1 mechanisms, first to hear the
   release date, and a "Coming soon" team check that ranks the mechanisms to
   start with.
9. **About the author**: photo (256 px wide on desktop), three stats (12 years,
   20+ products, billions in customer impact), a two-paragraph bio, and the
   verbatim Introduction quote "I do not share them as someone who has mastered
   them…" in the same Garamond and gold style as the tagline.
10. **FAQ**: seven questions, including what subscribers get and whether the
    stories are true.
11. **Final call to action**: "See which path your team is on".
12. **Connect**: a navy band with "Follow Michael for leadership lessons", a round
    photo with the book cover tucked in, and links to LinkedIn, Instagram, TikTok
    and Substack. Placed last so it does not pull readers away before the signup.
13. **Footer**: Newsletter, Privacy, Imprint.

Also included: a 404 page, imprint and privacy pages, favicon sizes, an OG share
image, and JSON-LD (Book with the author's profile links, plus FAQPage).

## Key decisions

- **Newsletter first.** Every Chapter 1 button carries a short note saying it is
  free with the newsletter, so nobody is surprised by the signup. The newsletter
  is presented as ongoing leadership lessons, not only book news.
- **Show the real book.** The preview uses rendered page images, not retyped
  text, so visitors see the book exactly as it will look in print.
- **Make the structure obvious.** The page states the counts once and plainly:
  5 situations, 5 stories, 2 teams, 11 mechanisms per chapter, 55 in total.
- **No assumed knowledge.** Read top to bottom, each section introduces what the
  next one relies on (stories, Team Alpha and Team Beta, mechanisms).
- **Honest promises.** No newsletter frequency is stated, the release date is
  "as soon as it is set", and the team check is marked "Coming soon".
- **Quotes from the book are verbatim** or carry no book attribution.

## Still to do before launch

- Fill the `{{...}}` placeholders in `imprint.html` and `privacy.html`.
- Add the Chapter 1 PDF link to the Substack welcome email (see `README.md`).
- Create the separate GitHub repo, enable Pages, and set the DNS records.
- When the chapter changes: re-copy the PDF and run `tools/render_pages.py`.
- If a mechanism is renamed in the book, update its title on the chapter cards.
