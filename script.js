/* Variabili Globali */
let currentMode = "confirm";
let gridSize = 5;
let lives = 3;
let initialLives = 3;
let gameOver = false;
let gridNumbers = [];
let gridSolution = [];
let gridState = [];
let rowTargets = [];
let colTargets = [];
let rowCompleted = [];
let colCompleted = [];
let selectedGridSize = 5;

/* Elementi DOM */
const mainMenu = document.getElementById("main-menu");
const tutorialScreen = document.getElementById("tutorial-screen");
const gameScreen = document.getElementById("game-screen");
const startGameBtn = document.getElementById("start-game");
const showTutorialBtn = document.getElementById("show-tutorial");
const backToMenuFromTutorialBtn = document.getElementById("back-to-menu-from-tutorial");
const backToMenuFromGameBtn = document.getElementById("back-to-menu-from-game");
const modeToggleBtn = document.getElementById("mode-toggle");
const modeLabel = document.getElementById("mode-label");
const healthBar = document.getElementById("health-bar");
const gameTable = document.getElementById("game-table");
const messageDiv = document.getElementById("message");
const gridSizeButtons = document.querySelectorAll(".grid-size-btn");

/* Selezione dimensione griglia */
gridSizeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    gridSizeButtons.forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedGridSize = parseInt(btn.dataset.size);
  });
});
document.querySelector(".grid-size-btn[data-size='5']").classList.add("selected");

/* Navigazione Schermate */
function showMainMenu() {
  mainMenu.style.display = "block";
  tutorialScreen.style.display = "none";
  gameScreen.style.display = "none";
}
function showTutorial() {
  mainMenu.style.display = "none";
  tutorialScreen.style.display = "block";
  gameScreen.style.display = "none";
}
function showGame() {
  mainMenu.style.display = "none";
  tutorialScreen.style.display = "none";
  gameScreen.style.display = "block";
}

/* Event Listeners Menu */
startGameBtn.addEventListener("click", () => {
  gridSize = selectedGridSize;
  if (document.getElementById("samurai-toggle").checked) {
    lives = 1;
    initialLives = 1;
  } else {
    lives = 3;
    initialLives = 3;
  }
  initGame();
  showGame();
});
showTutorialBtn.addEventListener("click", showTutorial);
backToMenuFromTutorialBtn.addEventListener("click", showMainMenu);
backToMenuFromGameBtn.addEventListener("click", showMainMenu);

/* Toggle Modalità */
modeToggleBtn.addEventListener("click", () => {
  if (currentMode === "confirm") {
    currentMode = "cancel";
    modeToggleBtn.textContent = "✖️";
    modeLabel.textContent = "Cancella";
    modeToggleBtn.classList.add("cancel");
  } else {
    currentMode = "confirm";
    modeToggleBtn.textContent = "✔️";
    modeLabel.textContent = "Conferma";
    modeToggleBtn.classList.remove("cancel");
  }
});

/* Aggiorna Health Bar */
function updateHealthBar() {
  let html = "";
  if (initialLives === 3) {
    if (lives === 3) {
      html = `<div class="life full green"></div>
              <div class="life full green"></div>
              <div class="life full green"></div>`;
    } else if (lives === 2) {
      html = `<div class="life full yellow"></div>
              <div class="life full yellow"></div>
              <div class="life empty yellow"></div>`;
    } else if (lives === 1) {
      html = `<div class="life full red"></div>
              <div class="life empty red"></div>
              <div class="life empty red"></div>`;
    }
  } else if (initialLives === 1) {
    html = `<div class="life full red"></div>`;
  }
  healthBar.innerHTML = html;
}

/* Inizializza il gioco */
function initGame() {
  gameOver = false;
  gridNumbers = [];
  gridSolution = [];
  gridState = [];
  rowTargets = [];
  colTargets = [];
  rowCompleted = new Array(gridSize).fill(false);
  colCompleted = new Array(gridSize).fill(false);
  messageDiv.textContent = "";
  updateHealthBar();

  currentMode = "confirm";
  modeToggleBtn.textContent = "✔️";
  modeLabel.textContent = "Conferma";
  modeToggleBtn.classList.remove("cancel");

  // Genera matrici
  for (let i = 0; i < gridSize; i++) {
    gridNumbers[i] = [];
    gridSolution[i] = [];
    gridState[i] = [];
    for (let j = 0; j < gridSize; j++) {
      gridNumbers[i][j] = Math.floor(Math.random() * 9) + 1;
      gridSolution[i][j] = (Math.random() < 0.5);
      gridState[i][j] = 0;
    }
  }

  // Forza almeno un true in ogni riga
  for (let i = 0; i < gridSize; i++) {
    const hasTrue = gridSolution[i].some(val => val === true);
    if (!hasTrue) {
      gridSolution[i][0] = true;
    }
  }
  // Forza almeno un true in ogni colonna
  for (let j = 0; j < gridSize; j++) {
    let hasTrue = false;
    for (let i = 0; i < gridSize; i++) {
      if (gridSolution[i][j]) {
        hasTrue = true;
        break;
      }
    }
    if (!hasTrue) {
      gridSolution[0][j] = true;
    }
  }

  // Calcola i target
  for (let i = 0; i < gridSize; i++) {
    let total = 0;
    for (let j = 0; j < gridSize; j++) {
      if (gridSolution[i][j]) {
        total += gridNumbers[i][j];
      }
    }
    rowTargets[i] = total;
  }
  for (let j = 0; j < gridSize; j++) {
    let total = 0;
    for (let i = 0; i < gridSize; i++) {
      if (gridSolution[i][j]) {
        total += gridNumbers[i][j];
      }
    }
    colTargets[j] = total;
  }

  buildTable();
}

/* Crea la tabella */
function buildTable() {
  gameTable.innerHTML = "";
  // Prima riga: indicatori colonna
  const headerRow = document.createElement("tr");
  const emptyHeader = document.createElement("th");
  headerRow.appendChild(emptyHeader);
  for (let j = 0; j < gridSize; j++) {
    const th = document.createElement("th");
    th.id = "col-indicator-" + j;
    th.innerHTML = `<span class="partial">0</span><span class="slash-bold">/${colTargets[j]}</span>`;
    headerRow.appendChild(th);
  }
  gameTable.appendChild(headerRow);

  // Righe
  for (let i = 0; i < gridSize; i++) {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.id = "row-indicator-" + i;
    th.innerHTML = `<span class="partial">0</span><span class="slash-bold">/${rowTargets[i]}</span>`;
    tr.appendChild(th);
    for (let j = 0; j < gridSize; j++) {
      const td = document.createElement("td");
      td.classList.add("cell");
      td.dataset.row = i;
      td.dataset.col = j;
      td.textContent = gridNumbers[i][j];
      td.addEventListener("click", cellClick);
      tr.appendChild(td);
    }
    gameTable.appendChild(tr);
  }
}

/* Gestione clic su cella */
function cellClick(e) {
  if (gameOver) return;
  const cell = e.currentTarget;
  const i = parseInt(cell.dataset.row);
  const j = parseInt(cell.dataset.col);

  if ((gridSolution[i][j] && gridState[i][j] === 1) ||
      (!gridSolution[i][j] && gridState[i][j] === -1)) {
    return;
  }
  if (gridState[i][j] !== 0) return;

  if (currentMode === "confirm") {
    if (gridSolution[i][j]) {
      gridState[i][j] = 1;
      cell.classList.add("cell-confirmed");
      cell.style.pointerEvents = "none";
    } else {
      triggerError();
    }
  } else {
    if (!gridSolution[i][j]) {
      gridState[i][j] = -1;
      cell.classList.add("cell-cancelled");
      setTimeout(() => {
        cell.textContent = "";
        cell.style.pointerEvents = "none";
      }, 500);
    } else {
      triggerError();
    }
  }
  updateIndicators();
}

/* Aggiorna indicatori e auto-cancellazione */
function updateIndicators() {
  // Righe
  for (let i = 0; i < gridSize; i++) {
    if (rowCompleted[i]) continue;
    let partial = 0;
    for (let j = 0; j < gridSize; j++) {
      if (gridState[i][j] === 1) {
        partial += gridNumbers[i][j];
      }
    }
    const rowTh = document.getElementById("row-indicator-" + i);
    if (rowTh) {
      rowTh.innerHTML = `<span class="partial">${partial}</span><span class="slash-bold">/${rowTargets[i]}</span>`;
      if (partial === rowTargets[i]) {
        rowCompleted[i] = true;
        let delay = 0;
        for (let j = 0; j < gridSize; j++) {
          if (!gridSolution[i][j] && gridState[i][j] === 0) {
            setTimeout(() => {
              gridState[i][j] = -1;
              const cell = document.querySelector(`td.cell[data-row='${i}'][data-col='${j}']`);
              if (cell) {
                cell.classList.add("cell-cancelled");
                setTimeout(() => {
                  cell.textContent = "";
                  cell.style.pointerEvents = "none";
                  updateIndicators();
                }, 500);
              }
            }, delay);
            delay += 300;
          }
        }
        setTimeout(() => { rowTh.innerHTML = ""; }, delay + 500);
        checkWin();
      }
    }
  }
  // Colonne
  for (let j = 0; j < gridSize; j++) {
    if (colCompleted[j]) continue;
    let partial = 0;
    for (let i = 0; i < gridSize; i++) {
      if (gridState[i][j] === 1) {
        partial += gridNumbers[i][j];
      }
    }
    const colTh = document.getElementById("col-indicator-" + j);
    if (colTh) {
      colTh.innerHTML = `<span class="partial">${partial}</span><span class="slash-bold">/${colTargets[j]}</span>`;
      if (partial === colTargets[j]) {
        colCompleted[j] = true;
        let delay = 0;
        for (let i = 0; i < gridSize; i++) {
          if (!gridSolution[i][j] && gridState[i][j] === 0) {
            setTimeout(() => {
              gridState[i][j] = -1;
              const cell = document.querySelector(`td.cell[data-row='${i}'][data-col='${j}']`);
              if (cell) {
                cell.classList.add("cell-cancelled");
                setTimeout(() => {
                  cell.textContent = "";
                  cell.style.pointerEvents = "none";
                  updateIndicators();
                }, 500);
              }
            }, delay);
            delay += 300;
          }
        }
        setTimeout(() => { colTh.innerHTML = ""; }, delay + 500);
        checkWin();
      }
    }
  }
}

/* Errore */
function triggerError() {
  const overlay = document.createElement("div");
  overlay.id = "error-overlay";
  document.body.appendChild(overlay);
  setTimeout(() => { overlay.remove(); }, 500);
  lives--;
  updateHealthBar();
  if (lives <= 0) {
    endGame(false);
  }
}

/* Verifica vittoria */
function checkWin() {
  const allRows = rowCompleted.every(val => val === true);
  const allCols = colCompleted.every(val => val === true);
  if (allRows && allCols) {
    endGame(true);
  }
}

/* Fine gioco */
function endGame(won) {
  gameOver = true;
  if (won) {
    messageDiv.textContent = "Hai vinto!";
    messageDiv.classList.add("win-animation");
  } else {
    messageDiv.textContent = "Game Over!";
  }
}
