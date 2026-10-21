# The Case of the Disappearing Penny

A scrolling D3 story about currency debasement (Rome, Celtic Britain, Ptolemaic Alexandria, Tudor London, and the US dollar), plus an explorer page called the Evidence Room.

## Files

| File | What it is |
|---|---|
| `index.html` | The scrolling story (home page) |
| `explore.html` | The Evidence Room explorer |
| `common.js` | Shared data, colour palette and coin/chart drawing code used by both pages |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is |
| `data/` | The original source spreadsheets, kept for reference (the pages don't load them; the figures are in `common.js`) |

D3 v7.8.5 loads from cdnjs and the fonts (Cinzel, Special Elite, Crimson Pro) from Google Fonts, so there is nothing to install or build.

## Publish on GitHub Pages

1. Create a new repository on GitHub (for example `disappearing-penny`).
2. Upload everything in this folder to the repository root, including the hidden `.nojekyll` file. On the repo page: **Add file → Upload files**, drag the folder contents in, then **Commit changes**.
3. Go to **Settings → Pages**. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose the `main` branch and the `/ (root)` folder, then **Save**.
4. After a minute or two the site is live at `https://YOUR-USERNAME.github.io/disappearing-penny/`.

## Editing the text

All narrative text is currently placeholder copy made of the letter "a". Open `index.html` (story) or `explore.html` (explorer intros) in any text editor and replace the paragraphs inside the cards, prologue, epilogue and summaries. Headings, dates, chart labels and figures are real.

## Preview locally

Opening `index.html` directly works in most browsers. If anything doesn't load, run a small local server from this folder:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.
