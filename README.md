# Arturo Arellano-Arias — academic website

A one-page academic site, ready for GitHub Pages. No build step: plain HTML, CSS and a little JavaScript.

## Files

| File | What it is |
|---|---|
| `index.html` | All the content. Each section is marked with a comment like `<!-- ===== PAPERS ===== -->`. |
| `style.css` | Fonts, colours and layout. Colours are at the top of the file. |
| `figure.js` | Draws the branching Brownian motion figure under the introduction. |
| `simulation.js` | The particles/density player in "Computation and code". The list of simulations is at the top. |
| `sims/` | The simulation frames, one folder per simulation. |
| `images/` | Put your photo here as `photo.jpg`. |
| `.nojekyll` | Tells GitHub to serve the files as they are. Keep it. |

## Publish on GitHub Pages

1. On GitHub, create a new **public** repository named exactly `ArturoAA95.github.io`.
2. Upload every file in this folder to it, keeping the `images/` and `sims/` folders. On the repository page, choose **Add file → Upload files**, drag the files in, and commit.
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
- [ ] **Local limit theorem paper**: hidden for now; uncomment it in the Papers section when it is posted (instructions are next to it).
- [ ] Optional: Google Scholar and ORCID links (commented out under the profile links).

## Adding a paper

Copy one `<li>` … `</li>` block in the Papers section, paste it at the top of the list, and change the year, title, authors and arXiv number.

## Adding a simulation

The player currently has two simulations: `sims/homogeneous/` and `sims/heterogeneous/`.

1. Make a new folder in `sims/` and put the frames in it, named `particles-01.webp` … `particles-10.webp` and `density-01.webp` … `density-10.webp`, with `01` the earliest time. PNG files also work if you set `ext` to `"png"`.
2. In `simulation.js`, copy one of the blocks in the list at the top, paste it before the final `];`, and change `id`, `label`, `folder` and `times`. The `environment` part (a picture and a note shown under the player) is optional.
