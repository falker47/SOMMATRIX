# SOMMATRIX

SOMMATRIX is a lightweight browser puzzle built with HTML, CSS and vanilla JavaScript. Each cell contains a number; the player must determine which cells belong to the hidden solution so that every row and column reaches its target sum.

**Live demo:** https://falker47.github.io/SOMMATRIX/

## How it works

Choose a 4x4, 6x6 or 8x8 grid. In **Confirm** mode, select numbers that belong to the solution; in **Cancel** mode, eliminate numbers that do not. Standard mode gives you three lives, while **Last Samurai** gives you one.

The puzzle is generated locally in the browser. Before a board is shown, SOMMATRIX enumerates the row subset candidates and uses the column constraints to count complete assignments. The board is accepted only when exactly one **global** solution exists. This avoids penalizing a player for a different assignment that satisfies the same row and column sums.

## Run locally

No build step, package manager or external JavaScript library is required to play.

```bash
git clone https://github.com/falker47/SOMMATRIX.git
cd SOMMATRIX
```

Open `index.html` in a modern browser.

## Browser storage and external resources

SOMMATRIX generates puzzles and evaluates player selections in the browser.

The application uses browser `localStorage` to remember:

- The selected language (Italian or English).
- The selected light or dark theme.
- High scores for each grid size.

Clearing the site's browser storage resets these saved values.

The page also requests fonts from Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`). These external resources are used for typography and are not required by the puzzle-generation logic.

## Verification

The puzzle-generation logic lives in `puzzle-core.js`, separate from the DOM code, so it can be tested directly with Node.js. The GitHub Actions workflow uses Node.js 22.

From the repository root, run:

```bash
node --test
```

No package installation is required.

The test suite covers:

- a globally unique puzzle whose individual row subset sum is ambiguous;
- a genuinely ambiguous puzzle;
- generated 4x4, 6x6 and 8x8 boards;
- consistency between the hidden solution and the published row/column targets.

GitHub Actions runs these tests on pushes to `main` and on pull requests. The workflow also checks the JavaScript syntax and a specific HTML formatting issue. It does not constitute a browser gameplay test or an independent security audit.

## Repository map

- `puzzle-core.js` — puzzle generation and global uniqueness solver
- `script.js` — game state, interactions, scoring and UI flow
- `i18n.js` — Italian/English strings
- `style.css` — responsive visual design
- `tests/` — zero-dependency Node tests

## License

No explicit software license is currently included in this repository.
