const test = require("node:test");
const assert = require("node:assert/strict");

const {
  calculateTargets,
  listSubsetMasks,
  countGlobalSolutions,
  hasUniqueSolution,
  generateUniquePuzzle
} = require("../puzzle-core.js");

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

test("global solver can prove uniqueness even when a row has multiple subset-sum candidates", () => {
  const gridNumbers = [
    [3, 7, 5],
    [1, 1, 1],
    [7, 7, 2]
  ];
  const rowTargets = [7, 2, 9];
  const colTargets = [8, 7, 3];

  assert.equal(listSubsetMasks(gridNumbers[1], rowTargets[1]).length, 3);
  assert.equal(countGlobalSolutions(gridNumbers, rowTargets, colTargets, 2), 1);
  assert.equal(hasUniqueSolution(gridNumbers, rowTargets, colTargets), true);
});

test("global solver rejects a genuinely ambiguous puzzle", () => {
  const gridNumbers = [
    [1, 1],
    [1, 1]
  ];
  const rowTargets = [1, 1];
  const colTargets = [1, 1];

  assert.equal(countGlobalSolutions(gridNumbers, rowTargets, colTargets, 2), 2);
  assert.equal(hasUniqueSolution(gridNumbers, rowTargets, colTargets), false);
});

for (const size of [4, 6, 8]) {
  test(`generated ${size}x${size} puzzle is globally unique and targets match its solution`, () => {
    const puzzle = generateUniquePuzzle(size, {
      rng: seededRandom(20260921 + size),
      maxAttempts: 100
    });

    assert.ok(puzzle.attempts >= 1 && puzzle.attempts <= 100);
    assert.equal(
      countGlobalSolutions(
        puzzle.gridNumbers,
        puzzle.rowTargets,
        puzzle.colTargets,
        2
      ),
      1
    );

    const targets = calculateTargets(puzzle.gridNumbers, puzzle.gridSolution);
    assert.deepEqual(targets.rowTargets, puzzle.rowTargets);
    assert.deepEqual(targets.colTargets, puzzle.colTargets);
    assert.ok(puzzle.rowTargets.every((target) => target > 0));
    assert.ok(puzzle.colTargets.every((target) => target > 0));
  });
}
