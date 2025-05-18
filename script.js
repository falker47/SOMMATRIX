/* Variabili Globali */
let currentMode = "confirm";
let gridSize = 4;
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
let selectedGridSize = 4;
let startTime = 0;
let currentTime = 0;
let timerInterval = null;
let errors = 0;
let score = 0;

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
const scoreDisplay = document.getElementById("score-display");
const timerDisplay = document.getElementById("timer-display");
const gridSizeButtons = document.querySelectorAll(".grid-size-btn");

/* Selezione dimensione griglia */
gridSizeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    gridSizeButtons.forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedGridSize = parseInt(btn.dataset.size);
  });
});
document.querySelector(".grid-size-btn[data-size='4']").classList.add("selected");

/* Navigazione Schermate */
function showMainMenu() {
  mainMenu.style.display = "block";
  tutorialScreen.style.display = "none";
  gameScreen.style.display = "none";
  stopTimer();
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
  errors = 0;
  initGame();
  showGame();
  startTimer();
});
showTutorialBtn.addEventListener("click", showTutorial);
backToMenuFromTutorialBtn.addEventListener("click", showMainMenu);
backToMenuFromGameBtn.addEventListener("click", showMainMenu);

/* Toggle Modalità */
modeToggleBtn.addEventListener("click", () => {
  if (currentMode === "confirm") {
    currentMode = "cancel";
    modeToggleBtn.classList.add("cancel");
    updateModeIndicator(); // Aggiunta chiamata funzione
  } else {
    currentMode = "confirm";
    modeToggleBtn.classList.remove("cancel");
    updateModeIndicator(); // Aggiunta chiamata funzione
  }
});

/* Aggiorna indicatore di modalità */
function updateModeIndicator() {
  // Funzione aggiunta per aggiornare l'indicatore testuale sotto il toggle
  const modeIndicator = document.getElementById("mode-indicator");
  if (modeIndicator) {
    modeIndicator.textContent = currentMode === "confirm" ? "Conferma" : "Cancella";
    modeIndicator.className = currentMode === "confirm" ? "mode-confirm" : "mode-cancel";
  }
}

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
    html = `<div class="life full samurai"></div>`;
  }
  healthBar.innerHTML = html;
}

/* Timer e Punteggio */
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  if (gameOver) return;
  currentTime = Math.floor((Date.now() - startTime) / 1000);
  timerDisplay.textContent = `Tempo: ${currentTime}s`;
  // Aggiornamento del punteggio in tempo reale
  updateScore();
}

function updateScore() {
  // Nuova funzione per aggiornare il punteggio in tempo reale
  score = calculateScore();
  scoreDisplay.textContent = `Punteggio: ${score}`;
}

function stopTimer() {
  clearInterval(timerInterval);
}

function calculateScore() {
  const time = currentTime;
  let calculatedScore = Math.round(Math.pow(gridSize, 3) * (1 - (errors * 0.2)) * (1 - (time * 0.001)));
  if (calculatedScore < 0) calculatedScore = 0;

  // Aggiungi questo blocco per il moltiplicatore samurai
  const isSamuraiMode = document.getElementById("samurai-toggle").checked;
  if (isSamuraiMode) {
    calculatedScore = Math.round(calculatedScore * 1.5);
  }

  return calculatedScore;
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
  scoreDisplay.textContent = "Punteggio: 0"; // Inizializzato il punteggio
  updateHealthBar();

  currentMode = "confirm";
  modeToggleBtn.classList.remove("cancel");
  updateModeIndicator(); // Aggiornamento indicatore modalità

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
    if (rowCompleted[i]) continue; // Salta se la riga è già marcata come completata
    let partial = 0;
    for (let j = 0; j < gridSize; j++) {
      if (gridState[i][j] === 1) {
        partial += gridNumbers[i][j];
      }
    }
    const rowTh = document.getElementById("row-indicator-" + i);
    if (rowTh) {
      // Aggiorna sempre il contenuto parziale a meno che non sia già completato
      if (!rowCompleted[i]) { // Evita di sovrascrivere l'indicatore di completamento
        rowTh.innerHTML = `<span class="partial">${partial}</span><span class="slash-bold">/${rowTargets[i]}</span>`;
      }

      if (partial === rowTargets[i] && !rowCompleted[i]) { // Aggiunto !rowCompleted[i] per eseguire solo una volta
        rowCompleted[i] = true;
        rowTh.classList.add("indicator-completed");
        rowTh.innerHTML = `<span class="completed-icon">✓</span> <span class="target-sum">${rowTargets[i]}</span>`;

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
                  // Rimuoviamo la chiamata a updateIndicators() da qui per evitare cicli o aggiornamenti non necessari
                  // Potrebbe essere necessario richiamare checkWin() o una logica specifica se l'auto-cancellazione completa altre righe/colonne
                }, 500);
              }
            }, delay);
            delay += 300;
          }
        }
        // La riga `setTimeout(() => { rowTh.innerHTML = ""; }, delay + 500);` è stata rimossa/commentata
        checkWin(); // Chiamiamo checkWin dopo aver processato la riga completata
      }
    }
  }

  // Colonne
  for (let j = 0; j < gridSize; j++) {
    if (colCompleted[j]) continue; // Salta se la colonna è già marcata come completata
    let partial = 0;
    for (let i = 0; i < gridSize; i++) {
      if (gridState[i][j] === 1) {
        partial += gridNumbers[i][j];
      }
    }
    const colTh = document.getElementById("col-indicator-" + j);
    if (colTh) {
      // Aggiorna sempre il contenuto parziale a meno che non sia già completato
      if (!colCompleted[j]) { // Evita di sovrascrivere l'indicatore di completamento
        colTh.innerHTML = `<span class="partial">${partial}</span><span class="slash-bold">/${colTargets[j]}</span>`;
      }

      if (partial === colTargets[j] && !colCompleted[j]) { // Aggiunto !colCompleted[j] per eseguire solo una volta
        colCompleted[j] = true;
        colTh.classList.add("indicator-completed");
        colTh.innerHTML = `<span class="completed-icon">✓</span> <span class="target-sum">${colTargets[j]}</span>`;

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
                  // Rimuoviamo la chiamata a updateIndicators() da qui
                }, 500);
              }
            }, delay);
            delay += 300;
          }
        }
        // La riga `setTimeout(() => { colTh.innerHTML = ""; }, delay + 500);` è stata rimossa/commentata
        checkWin(); // Chiamiamo checkWin dopo aver processato la colonna completata
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
  errors++;
  updateHealthBar();
  updateScore(); // Aggiorna il punteggio dopo un errore
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
  stopTimer();

  const finalScore = calculateScore();

  if (won) {
    messageDiv.textContent = "Hai vinto!";
    messageDiv.classList.add("win-animation");
    scoreDisplay.textContent = `Punteggio: ${finalScore}`;
  } else {
    messageDiv.textContent = "Game Over!";
    scoreDisplay.textContent = "Punteggio: 0";
  }
}
