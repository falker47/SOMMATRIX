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

/* Language Toggle (segmented IT/EN) */
document.querySelectorAll('.lang-opt').forEach(opt => {
  opt.addEventListener('click', () => i18n.setLanguage(opt.dataset.lang));
});

/* Theme Toggle (light/dark, persisted) */
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('sommatrix_theme', next); } catch (e) { }
  });
}

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
const gridSizeButtons = document.querySelectorAll(".level-card");

/* Selezione dimensione griglia */
gridSizeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    gridSizeButtons.forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedGridSize = parseInt(btn.dataset.size);
  });
  btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      btn.click();
    }
  });
});
document.querySelector(".level-card[data-size='4']").classList.add("selected");

/* Anno corrente nel footer */
const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

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
  initTutorialDemo();
}

/* ===== Tutorial interattivo (widget isolato, non tocca il gameplay) ===== */
let tutorialWired = false;
let tutorialStep = 1;
const TUTORIAL_TOTAL = 4;
// Stato dimostrativo della riga "= 12" con numeri [5, 7, 8, 3] (5+7 = 12)
const tutorialStates = {
  1: { partial: 0, focus: true, cells: ["", "", "", ""], complete: false },
  2: { partial: 12, focus: false, cells: ["confirm", "confirm", "", ""], complete: false },
  3: { partial: 12, focus: false, cells: ["confirm", "confirm", "cancel", ""], complete: false },
  4: { partial: 12, focus: false, cells: ["confirm", "confirm", "cancel", "cancel"], complete: true }
};

function renderTutorialStep() {
  const state = tutorialStates[tutorialStep];
  // Testo dello step
  document.querySelectorAll('.tut-step').forEach(el => {
    el.classList.toggle('is-active', parseInt(el.dataset.step) === tutorialStep);
  });
  // Puntini
  document.querySelectorAll('.tut-dot').forEach(el => {
    el.classList.toggle('is-active', parseInt(el.dataset.step) === tutorialStep);
  });
  // Demo: parziale e header
  const partialEl = document.getElementById('demo-partial');
  if (partialEl) partialEl.textContent = state.partial;
  const th = document.getElementById('demo-th');
  if (th) {
    th.classList.toggle('is-focus', state.focus);
    th.classList.toggle('is-complete', state.complete);
  }
  // Demo: celle
  state.cells.forEach((cls, i) => {
    const cell = document.getElementById('demo-' + i);
    if (cell) {
      cell.classList.remove('confirm', 'cancel');
      if (cls) cell.classList.add(cls);
    }
  });
  // Bottoni nav
  const prev = document.getElementById('tut-prev');
  const next = document.getElementById('tut-next');
  if (prev) prev.disabled = tutorialStep === 1;
  if (next) next.disabled = tutorialStep === TUTORIAL_TOTAL;
}

function initTutorialDemo() {
  tutorialStep = 1;
  if (!tutorialWired) {
    const prev = document.getElementById('tut-prev');
    const next = document.getElementById('tut-next');
    if (prev) prev.addEventListener('click', () => {
      if (tutorialStep > 1) { tutorialStep--; renderTutorialStep(); }
    });
    if (next) next.addEventListener('click', () => {
      if (tutorialStep < TUTORIAL_TOTAL) { tutorialStep++; renderTutorialStep(); }
    });
    document.querySelectorAll('.tut-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        tutorialStep = parseInt(dot.dataset.step);
        renderTutorialStep();
      });
    });
    tutorialWired = true;
  }
  renderTutorialStep();
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
  displayRecord();
  showGame();
  startTimer();
});
showTutorialBtn.addEventListener("click", showTutorial);
backToMenuFromTutorialBtn.addEventListener("click", showMainMenu);
backToMenuFromGameBtn.addEventListener("click", showMainMenu);

/* Samurai mode: make the emblem go hardcore when armed */
(() => {
  const samuraiToggle = document.getElementById("samurai-toggle");
  const samuraiPanel = document.querySelector(".samurai-panel");
  if (!samuraiToggle || !samuraiPanel) return;
  samuraiToggle.addEventListener("change", () => {
    if (samuraiToggle.checked) {
      samuraiPanel.classList.add("armed");
      // brief activation burst: shake + katana slash, then settle
      samuraiPanel.classList.remove("striking");
      void samuraiPanel.offsetWidth; // restart the animation
      samuraiPanel.classList.add("striking");
      setTimeout(() => samuraiPanel.classList.remove("striking"), 550);
    } else {
      samuraiPanel.classList.remove("armed", "striking");
    }
  });
})();

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
  const modeIndicator = document.getElementById("mode-indicator");
  if (modeIndicator) {
    modeIndicator.textContent = currentMode === "confirm" ? i18n.t('confirm') : i18n.t('cancel');
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
  clearInterval(timerInterval);
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  if (gameOver) return;
  currentTime = Math.floor((Date.now() - startTime) / 1000);
  const timerValue = document.getElementById('timer-value');
  if (timerValue) timerValue.textContent = currentTime;
  // Aggiornamento del punteggio in tempo reale
  updateScore();
}

function updateScore() {
  // Nuova funzione per aggiornare il punteggio in tempo reale
  score = calculateScore();
  const scoreValue = document.getElementById('score-value');
  if (scoreValue) scoreValue.textContent = score;
}

function stopTimer() {
  clearInterval(timerInterval);
}

/* Funzioni per gestire i record */
function loadRecord() {
  const key = `sommatrix_record_${gridSize}`;
  const record = localStorage.getItem(key);
  return record ? parseInt(record) : 0;
}

function displayRecord() {
  const recordValue = document.getElementById('record-value');
  if (recordValue) {
    const currentRecord = loadRecord();
    recordValue.textContent = currentRecord;
  }
}

/* Calcola il punteggio finale */
function calculateScore() {
  const timeBonus = Math.max(0, 300 - currentTime); // Bonus tempo
  const errorPenalty = errors * 10; // Penalità errori
  const sizeBonus = gridSize * 50; // Bonus dimensione griglia
  const finalScore = Math.max(0, timeBonus + sizeBonus - errorPenalty);
  return finalScore;
}

/* Verifica unicità della soluzione per riga/colonna */
function countSubsetSums(numbers, target) {
  let count = 0;
  const n = numbers.length;
  for (let mask = 1; mask < (1 << n); mask++) {
    let sum = 0;
    for (let bit = 0; bit < n; bit++) {
      if (mask & (1 << bit)) {
        sum += numbers[bit];
      }
    }
    if (sum === target) {
      count++;
      if (count > 1) return count;
    }
  }
  return count;
}

function hasUniqueSolution() {
  for (let i = 0; i < gridSize; i++) {
    if (countSubsetSums(gridNumbers[i], rowTargets[i]) > 1) return false;
  }
  for (let j = 0; j < gridSize; j++) {
    const colNumbers = [];
    for (let i = 0; i < gridSize; i++) {
      colNumbers.push(gridNumbers[i][j]);
    }
    if (countSubsetSums(colNumbers, colTargets[j]) > 1) return false;
  }
  return true;
}

function generatePuzzle() {
  gridNumbers = [];
  gridSolution = [];
  rowTargets = [];
  colTargets = [];

  for (let i = 0; i < gridSize; i++) {
    gridNumbers[i] = [];
    gridSolution[i] = [];
    for (let j = 0; j < gridSize; j++) {
      gridNumbers[i][j] = Math.floor(Math.random() * 9) + 1;
      gridSolution[i][j] = (Math.random() < 0.5);
    }
  }

  // Forza almeno un true in ogni riga (posizione casuale)
  for (let i = 0; i < gridSize; i++) {
    if (!gridSolution[i].some(val => val === true)) {
      gridSolution[i][Math.floor(Math.random() * gridSize)] = true;
    }
  }
  // Forza almeno un true in ogni colonna (posizione casuale)
  for (let j = 0; j < gridSize; j++) {
    let hasTrue = false;
    for (let i = 0; i < gridSize; i++) {
      if (gridSolution[i][j]) { hasTrue = true; break; }
    }
    if (!hasTrue) {
      gridSolution[Math.floor(Math.random() * gridSize)][j] = true;
    }
  }

  // Calcola i target
  for (let i = 0; i < gridSize; i++) {
    let total = 0;
    for (let j = 0; j < gridSize; j++) {
      if (gridSolution[i][j]) total += gridNumbers[i][j];
    }
    rowTargets[i] = total;
  }
  for (let j = 0; j < gridSize; j++) {
    let total = 0;
    for (let i = 0; i < gridSize; i++) {
      if (gridSolution[i][j]) total += gridNumbers[i][j];
    }
    colTargets[j] = total;
  }
}

function initGame() {
  gameOver = false;
  rowCompleted = new Array(gridSize).fill(false);
  colCompleted = new Array(gridSize).fill(false);

  const scoreValue = document.getElementById('score-value');
  if (scoreValue) scoreValue.textContent = '0';
  updateHealthBar();

  currentMode = "confirm";
  modeToggleBtn.classList.remove("cancel");
  updateModeIndicator();

  // Genera puzzle con soluzione unica per ogni riga e colonna
  let attempts = 0;
  do {
    generatePuzzle();
    attempts++;
  } while (!hasUniqueSolution() && attempts < 100);

  // Inizializza stato griglia
  gridState = [];
  for (let i = 0; i < gridSize; i++) {
    gridState[i] = new Array(gridSize).fill(0);
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
      td.setAttribute("tabindex", "0");
      td.addEventListener("click", cellClick);
      td.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          cellClick(e);
        }
      });
      tr.appendChild(td);
    }
    gameTable.appendChild(tr);
  }
  if (gridSize >= 6) {
    gameTable.classList.add('large-grid');
  } else {
    gameTable.classList.remove('large-grid');
  }
}

/* Gestione clic su cella */
function cellClick(e) {
  if (gameOver) return;
  const cell = e.currentTarget;
  const i = parseInt(cell.dataset.row);
  const j = parseInt(cell.dataset.col);

  // Verifica che i dati siano validi
  if (isNaN(i) || isNaN(j) || i < 0 || i >= gridSize || j < 0 || j >= gridSize) {
    console.error('Dati cella non validi:', i, j);
    return;
  }

  // Controlla se la cella è già stata processata correttamente
  if ((gridSolution[i][j] && gridState[i][j] === 1) ||
    (!gridSolution[i][j] && gridState[i][j] === -1)) {
    return;
  }

  // Evita doppi click
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
        if (cell && gridState[i] && gridState[i][j] === -1) { // Verifica che la cella esista ancora
          cell.textContent = "";
          cell.style.pointerEvents = "none";
        }
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
  if (gameOver) return;
  const allRows = rowCompleted.every(val => val === true);
  const allCols = colCompleted.every(val => val === true);
  if (allRows && allCols) {
    endGame(true);
  }
}

/* Fine gioco con animazioni */
function endGame(won) {
  gameOver = true;
  stopTimer();

  const finalScore = calculateScore();

  if (won) {
    showVictoryAnimation(finalScore);
  } else {
    showDefeatAnimation();
  }
}

/* Animazione Vittoria */
function showVictoryAnimation(finalScore) {
  const gameScreen = document.getElementById('game-screen');

  // Anima le celle della griglia prima
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell, index) => {
    setTimeout(() => {
      cell.classList.add('victory-pulse');
    }, index * 50);
  });

  // Crea overlay per la vittoria dopo un breve delay
  setTimeout(() => {
    const key = `sommatrix_record_${gridSize}`;
    const oldRecord = loadRecord();
    let isNewRecord = false;

    if (finalScore > oldRecord) {
      localStorage.setItem(key, finalScore);
      isNewRecord = true;
    }

    const victoryOverlay = document.createElement('div');
    victoryOverlay.className = 'victory-overlay';

    const newRecordLabel = i18n.t('newRecord');
    const scoreLabel = i18n.t('score');
    const recordText = isNewRecord ?
      `🏆 ${newRecordLabel}: ${finalScore}! 🏆` :
      `${scoreLabel}: ${finalScore}`;

    victoryOverlay.innerHTML = `
        <div class="victory-content">
            <h2>${i18n.t('victory')}</h2>
            <p>
                ${i18n.t('victoryMessage')}<br>
                <strong>${recordText}</strong>
            </p>
            <div class="victory-buttons">
                <button class="victory-btn" id="play-again-btn">${i18n.t('playAgain')}</button>
                <button class="victory-btn secondary" id="victory-menu-btn">${i18n.t('mainMenu')}</button>
            </div>
        </div>
    `;

    gameScreen.appendChild(victoryOverlay);

    // Aggiorna la visualizzazione del record
    displayRecord();

    // Event listeners
    document.getElementById('play-again-btn').addEventListener('click', () => {
      victoryOverlay.classList.add('is-closing');
      setTimeout(() => {
        victoryOverlay.remove();
        restartGame();
      }, 280);
    });

    document.getElementById('victory-menu-btn').addEventListener('click', () => {
      victoryOverlay.classList.add('is-closing');
      setTimeout(() => {
        victoryOverlay.remove();
        showMainMenu();
      }, 280);
    });

  }, 800);
}

/* Animazione Sconfitta */
function showDefeatAnimation() {
  const gameScreen = document.getElementById('game-screen');

  // Anima le vite rimanenti
  const lifeElements = document.querySelectorAll('.life');
  lifeElements.forEach((life, index) => {
    setTimeout(() => {
      life.classList.add('life-shake');
    }, index * 100);
  });

  // Anima le celle con effetto shake
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell, index) => {
    setTimeout(() => {
      cell.classList.add('defeat-shake');
    }, index * 30);
  });

  // Crea overlay per la sconfitta
  setTimeout(() => {
    const defeatOverlay = document.createElement('div');
    defeatOverlay.className = 'defeat-overlay';
    defeatOverlay.innerHTML = `
        <div class="defeat-content">
            <h2>${i18n.t('gameOver')}</h2>
            <p>
                ${i18n.t('defeatMessage')}
            </p>
            <div class="defeat-buttons">
                <button class="defeat-btn retry-btn" id="retry-btn">${i18n.t('retry')}</button>
                <button class="defeat-btn menu-btn" id="defeat-menu-btn">${i18n.t('mainMenu')}</button>
            </div>
        </div>
    `;

    gameScreen.appendChild(defeatOverlay);

    // Event listeners
    document.getElementById('retry-btn').addEventListener('click', () => {
      defeatOverlay.classList.add('is-closing');
      setTimeout(() => {
        defeatOverlay.remove();
        restartGame();
      }, 280);
    });

    document.getElementById('defeat-menu-btn').addEventListener('click', () => {
      defeatOverlay.classList.add('is-closing');
      setTimeout(() => {
        defeatOverlay.remove();
        showMainMenu();
      }, 280);
    });

  }, 1000);
}

/* Funzione per riavviare il gioco */
function restartGame() {
  // Ferma il timer precedente, se attivo
  stopTimer();

  // Rimuovi tutte le animazioni dalle celle
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.classList.remove('victory-pulse', 'defeat-shake');
  });

  // Rimuovi animazioni dalle vite
  const livesElements = document.querySelectorAll('.life'); // Rinominato per evitare conflitto con la variabile 'lives' globale
  livesElements.forEach(life => {
    life.classList.remove('life-shake');
  });

  // Aggiungi le stesse istruzioni del bottone "Gioca" principale
  gridSize = selectedGridSize;
  if (document.getElementById("samurai-toggle").checked) {
    lives = 1; // Assicurati che questa sia la variabile globale 'lives'
    initialLives = 1;
  } else {
    lives = 3; // Assicurati che questa sia la variabile globale 'lives'
    initialLives = 3;
  }

  errors = 0;
  gameOver = false;
  // Resetta currentTime a 0 prima di chiamare initGame e startTimer
  currentTime = 0;
  const timerValue = document.getElementById('timer-value');
  if (timerValue) timerValue.textContent = '0';

  initGame();
  displayRecord();
  showGame();
  startTimer(); // Ora il nuovo timer parte dopo che tutto è stato resettato
}