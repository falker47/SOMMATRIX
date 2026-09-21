(function (root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.SommatrixCore = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function validatePuzzleInputs(gridNumbers, rowTargets, colTargets) {
    if (!Array.isArray(gridNumbers) || gridNumbers.length === 0) {
      throw new TypeError("gridNumbers must be a non-empty square matrix");
    }

    const size = gridNumbers.length;
    if (size > 16) {
      throw new RangeError("grid size is too large for bit-mask enumeration");
    }

    for (const row of gridNumbers) {
      if (!Array.isArray(row) || row.length !== size) {
        throw new TypeError("gridNumbers must be a square matrix");
      }
      for (const value of row) {
        if (!Number.isInteger(value) || value <= 0) {
          throw new TypeError("grid values must be positive integers");
        }
      }
    }

    if (!Array.isArray(rowTargets) || rowTargets.length !== size ||
        !Array.isArray(colTargets) || colTargets.length !== size) {
      throw new TypeError("rowTargets and colTargets must match the grid size");
    }

    for (const target of [...rowTargets, ...colTargets]) {
      if (!Number.isInteger(target) || target < 0) {
        throw new TypeError("targets must be non-negative integers");
      }
    }

    return size;
  }

  function calculateTargets(gridNumbers, gridSolution) {
    if (!Array.isArray(gridNumbers) || !Array.isArray(gridSolution) ||
        gridNumbers.length === 0 || gridNumbers.length !== gridSolution.length) {
      throw new TypeError("gridNumbers and gridSolution must be equally sized square matrices");
    }

    const size = gridNumbers.length;
    const rowTargets = new Array(size).fill(0);
    const colTargets = new Array(size).fill(0);

    for (let row = 0; row < size; row++) {
      if (!Array.isArray(gridNumbers[row]) || gridNumbers[row].length !== size ||
          !Array.isArray(gridSolution[row]) || gridSolution[row].length !== size) {
        throw new TypeError("gridNumbers and gridSolution must be square matrices");
      }

      for (let col = 0; col < size; col++) {
        const value = gridNumbers[row][col];
        if (!Number.isInteger(value) || value <= 0) {
          throw new TypeError("grid values must be positive integers");
        }

        if (gridSolution[row][col]) {
          rowTargets[row] += value;
          colTargets[col] += value;
        }
      }
    }

    return { rowTargets, colTargets };
  }

  function listSubsetMasks(numbers, target) {
    const masks = [];
    const combinations = 1 << numbers.length;

    for (let mask = 0; mask < combinations; mask++) {
      let sum = 0;
      for (let bit = 0; bit < numbers.length; bit++) {
        if (mask & (1 << bit)) {
          sum += numbers[bit];
        }
      }
      if (sum === target) {
        masks.push(mask);
      }
    }

    return masks;
  }

  function countGlobalSolutions(gridNumbers, rowTargets, colTargets, limit = 2) {
    const size = validatePuzzleInputs(gridNumbers, rowTargets, colTargets);

    if (!Number.isInteger(limit) || limit < 1) {
      throw new RangeError("limit must be a positive integer");
    }

    const candidates = gridNumbers.map((row, index) =>
      listSubsetMasks(row, rowTargets[index])
    );

    if (candidates.some((rowCandidates) => rowCandidates.length === 0)) {
      return 0;
    }

    const rowOrder = Array.from({ length: size }, (_, index) => index)
      .sort((a, b) => candidates[a].length - candidates[b].length);

    const remainingMin = Array.from({ length: size + 1 }, () =>
      new Array(size).fill(0)
    );
    const remainingMax = Array.from({ length: size + 1 }, () =>
      new Array(size).fill(0)
    );

    for (let position = size - 1; position >= 0; position--) {
      const row = rowOrder[position];
      const rowCandidates = candidates[row];

      for (let col = 0; col < size; col++) {
        let canExclude = false;
        let canInclude = false;

        for (const mask of rowCandidates) {
          if (mask & (1 << col)) {
            canInclude = true;
          } else {
            canExclude = true;
          }

          if (canExclude && canInclude) {
            break;
          }
        }

        remainingMin[position][col] =
          remainingMin[position + 1][col] +
          (canExclude ? 0 : gridNumbers[row][col]);

        remainingMax[position][col] =
          remainingMax[position + 1][col] +
          (canInclude ? gridNumbers[row][col] : 0);
      }
    }

    const colSums = new Array(size).fill(0);
    let solutionCount = 0;

    function search(position) {
      if (solutionCount >= limit) {
        return;
      }

      if (position === size) {
        for (let col = 0; col < size; col++) {
          if (colSums[col] !== colTargets[col]) {
            return;
          }
        }
        solutionCount++;
        return;
      }

      const row = rowOrder[position];

      for (const mask of candidates[row]) {
        let valid = true;

        for (let col = 0; col < size; col++) {
          const contribution = (mask & (1 << col)) ? gridNumbers[row][col] : 0;
          const nextSum = colSums[col] + contribution;

          if (
            nextSum > colTargets[col] ||
            nextSum + remainingMin[position + 1][col] > colTargets[col] ||
            nextSum + remainingMax[position + 1][col] < colTargets[col]
          ) {
            valid = false;
            break;
          }
        }

        if (!valid) {
          continue;
        }

        for (let col = 0; col < size; col++) {
          if (mask & (1 << col)) {
            colSums[col] += gridNumbers[row][col];
          }
        }

        search(position + 1);

        for (let col = 0; col < size; col++) {
          if (mask & (1 << col)) {
            colSums[col] -= gridNumbers[row][col];
          }
        }

        if (solutionCount >= limit) {
          return;
        }
      }
    }

    search(0);
    return solutionCount;
  }

  function hasUniqueSolution(gridNumbers, rowTargets, colTargets) {
    return countGlobalSolutions(gridNumbers, rowTargets, colTargets, 2) === 1;
  }

  function generateCandidate(size, rng = Math.random) {
    if (!Number.isInteger(size) || size < 2 || size > 16) {
      throw new RangeError("size must be an integer between 2 and 16");
    }
    if (typeof rng !== "function") {
      throw new TypeError("rng must be a function");
    }

    const gridNumbers = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => Math.floor(rng() * 9) + 1)
    );
    const gridSolution = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => rng() < 0.5)
    );

    for (let row = 0; row < size; row++) {
      if (!gridSolution[row].some(Boolean)) {
        gridSolution[row][Math.floor(rng() * size)] = true;
      }
    }

    for (let col = 0; col < size; col++) {
      let hasSelectedCell = false;
      for (let row = 0; row < size; row++) {
        if (gridSolution[row][col]) {
          hasSelectedCell = true;
          break;
        }
      }

      if (!hasSelectedCell) {
        gridSolution[Math.floor(rng() * size)][col] = true;
      }
    }

    const { rowTargets, colTargets } = calculateTargets(
      gridNumbers,
      gridSolution
    );

    return {
      gridNumbers,
      gridSolution,
      rowTargets,
      colTargets
    };
  }

  function generateUniquePuzzle(size, options = {}) {
    const rng = options.rng || Math.random;
    const maxAttempts = options.maxAttempts ?? 100;

    if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
      throw new RangeError("maxAttempts must be a positive integer");
    }

    for (let attempts = 1; attempts <= maxAttempts; attempts++) {
      const puzzle = generateCandidate(size, rng);
      if (hasUniqueSolution(
        puzzle.gridNumbers,
        puzzle.rowTargets,
        puzzle.colTargets
      )) {
        return { ...puzzle, attempts };
      }
    }

    throw new Error(
      `Unable to generate a globally unique ${size}x${size} puzzle after ${maxAttempts} attempts`
    );
  }

  return {
    calculateTargets,
    listSubsetMasks,
    countGlobalSolutions,
    hasUniqueSolution,
    generateCandidate,
    generateUniquePuzzle
  };
});
