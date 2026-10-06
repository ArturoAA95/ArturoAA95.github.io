# Arturo Arellano-Arias — academic website

A one-page academic site, ready for GitHub Pages. No build step: plain HTML, CSS and a little JavaScript.

## Files

| File | What it is |
|---|---|
| `index.html` | All the content. Each section is marked with a comment like `<!-- ===== PAPERS ===== -->`. |
| `style.css` | Fonts, colours and layout. Colours are at the top of the file. |
| `figure.js` | Draws the branching Brownian motion figure under the introduction. |
| `images/` | Put your photo here as `photo.jpg`. |
| `.nojekyll` | Tells GitHub to serve the files as they are. Keep it. |

## Publish on GitHub Pages

1. On GitHub, create a new **public** repository named exactly `ArturoAA95.github.io`.
2. Upload every file in this folder to it, keeping the `images/` folder. On the repository page, choose **Add file → Upload files**, drag the files in, and commit.
   - `.nojekyll` is hidden on most computers. If it doesn't upload, choose **Add file → Create new file**, name it `.nojekyll`, leave it empty, and commit.
3. Go to **Settings → Pages**. Under "Build and deployment", set Source to **Deploy from a branch**, branch **main**, folder **/ (root)**, and save.
4. After a minute or two, the site is live at **https://ArturoAA95.github.io**.

To change something later, edit the file on GitHub (pencil icon) and commit. The site updates by itself within a few minutes.

## Still to fill in

Search `index.html` for `TODO` and `todo`:

- [ ] **Photo**: save as `images/photo.jpg` (portrait, about 4:5). Until then, your initials are shown.
- [ ] **CV**: add your academic CV as `cv.pdf` in the main folder (the "CV" button links to it).
- [ ] **Advisor**: replace "Advisor: add name" in the introduction.
- [ ] **Talks**: replace the placeholder with your talks (a template is in the comments).
- [ ] **Local limit theorem paper**: add the arXiv link once it is posted.
- [ ] Optional: Google Scholar and ORCID links (commented out under the profile links).

## Adding a paper

Copy one `<li>` … `</li>` block in the Papers section, paste it at the top of the list, and change the year, title, authors and arXiv number.
