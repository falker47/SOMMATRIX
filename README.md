# SOMMATRIX

SOMMATRIX is a lightweight browser puzzle built with HTML, CSS and vanilla JavaScript. Each cell contains a number; the player must determine which cells belong to the hidden solution so that every row and column reaches its target sum.

**Live demo:** https://falker47.github.io/SOMMATRIX/

## How it works

Choose a 4x4, 6x6 or 8x8 grid. In **Confirm** mode, select numbers that belong to the solution; in **Cancel** mode, eliminate numbers that do not. Standard mode gives you three lives, while **Last Samurai** gives you one.

The puzzle is generated locally in the browser. Before a board is shown, SOMMATRIX enumerates the row subset candidates and uses the column constraints to count complete assignments. The board is accepted only when exactly one **global** solution exists. This avoids penalizing a player for a different assignment that satisfies the same row and column sums.

## Run locally

No build step or external dependency is required.

```bash
git clone https://github.com/falker47/SOMMATRIX.git
cd SOMMATRIX
```

Open `index.html` in a modern browser.

## Verification

The puzzle-generation logic lives in `puzzle-core.js`, separate from the DOM code, so it can be tested directly with Node:

```bash
node --test tests/*.test.js
```

The test suite covers:

- a globally unique puzzle whose individual row subset sum is ambiguous;
- a genuinely ambiguous puzzle;
- generated 4x4, 6x6 and 8x8 boards;
- consistency between the hidden solution and the published row/column targets.

GitHub Actions runs the same tests on pushes and pull requests.

## Repository map

- `puzzle-core.js` — puzzle generation and global uniqueness solver
- `script.js` — game state, interactions, scoring and UI flow
- `i18n.js` — Italian/English strings
- `style.css` — responsive visual design
- `tests/` — zero-dependency Node tests

## License

No explicit software license is currently included in this repository.
