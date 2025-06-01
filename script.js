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
const gridSizeButtons = document.querySelectorAll(".level-card");

/* Selezione dimensione griglia */
gridSizeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    gridSizeButtons.forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedGridSize = parseInt(btn.dataset.size);
  });
});
document.querySelector(".level-card[data-size='4']").classList.add("selected");

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
  displayRecord();
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

/* Funzioni per gestire i record */
function loadRecord() {
  const key = `sommatrix_record_${gridSize}`;
  const record = localStorage.getItem(key);
  return record ? parseInt(record) : 0;
}

function displayRecord() {
  const recordDisplay = document.getElementById('record-display');
  if (recordDisplay) {
    const currentRecord = loadRecord();
    recordDisplay.textContent = `Record: ${currentRecord}`;
    
    // Rimuovi la classe di animazione se presente
    recordDisplay.classList.remove('new-record');
  }
}

// Nella funzione showVictoryAnimation, aggiungi:
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
    
      // Aggiungi animazione per nuovo record
      setTimeout(() => {
        const recordDisplay = document.getElementById('record-display');
        if (recordDisplay) {
          recordDisplay.classList.add('new-record');
          // Rimuovi l'animazione dopo 5 secondi
          setTimeout(() => {
            recordDisplay.classList.remove('new-record');
          }, 5000);
        }
      }, 1000);
    }

    const victoryOverlay = document.createElement('div');
    victoryOverlay.className = 'victory-overlay animate__animated animate__fadeIn';

    const recordText = isNewRecord ?
      `🏆 Nuovo Record: ${finalScore}! 🏆` :
      `Punteggio: ${finalScore}`;

    victoryOverlay.innerHTML = `
        <div class="victory-content animate__animated animate__bounceIn animate__delay-1s">
            <h2 class="animate__animated animate__pulse animate__infinite animate__slow">VITTORIA!</h2>
            <p class="animate__animated animate__fadeInUp animate__delay-2s">
                Complimenti! Hai risolto il puzzle!<br>
                <strong>${recordText}</strong>
            </p>
            <div class="victory-buttons animate__animated animate__fadeInUp animate__delay-3s">
                <button class="victory-btn" id="play-again-btn">Gioca Ancora</button>
                <button class="victory-btn secondary" id="victory-menu-btn">Menu Principale</button>
            </div>
        </div>
    `;

    gameScreen.appendChild(victoryOverlay);

    // Aggiorna la visualizzazione del record
    displayRecord();

    // Event listeners
    document.getElementById('play-again-btn').addEventListener('click', () => {
      victoryOverlay.classList.remove('animate__fadeIn');
      victoryOverlay.classList.add('animate__fadeOut');
      victoryOverlay.addEventListener('animationend', function handleAnimationEnd() {
        victoryOverlay.removeEventListener('animationend', handleAnimationEnd);
        victoryOverlay.remove();
        restartGame();
      });
    });

    document.getElementById('victory-menu-btn').addEventListener('click', () => {
      victoryOverlay.classList.remove('animate__fadeIn');
      victoryOverlay.classList.add('animate__fadeOut');
      victoryOverlay.addEventListener('animationend', function handleAnimationEnd() {
        victoryOverlay.removeEventListener('animationend', handleAnimationEnd);
        victoryOverlay.remove();
        showMainMenu();
      });
    });

  }, 800);
}

/* Animazione Sconfitta */
function showDefeatAnimation() {
  const gameScreen = document.getElementById('game-screen');

  // Anima le vite rimanenti
  const lives = document.querySelectorAll('.life');
  lives.forEach((life, index) => {
    setTimeout(() => {
      life.classList.add('animate__animated', 'animate__shakeX');
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
    defeatOverlay.className = 'defeat-overlay animate__animated animate__fadeIn animate__delay-1s';
    defeatOverlay.innerHTML = `
        <div class="defeat-content animate__animated animate__slideInDown animate__delay-2s">
            <h2 class="animate__animated animate__headShake animate__infinite animate__slow">GAME OVER</h2>
            <p class="animate__animated animate__fadeInUp animate__delay-3s">
                Non ti arrendere! Ogni errore è un passo verso la vittoria!
            </p>
            <div class="defeat-buttons animate__animated animate__fadeInUp animate__delay-4s">
                <button class="defeat-btn retry-btn" id="retry-btn">Riprova</button>
                <button class="defeat-btn menu-btn" id="defeat-menu-btn">Menu Principale</button>
            </div>
        </div>
    `;

    gameScreen.appendChild(defeatOverlay);

    // Event listeners
    document.getElementById('retry-btn').addEventListener('click', () => {
      defeatOverlay.classList.remove('animate__fadeIn');
      defeatOverlay.classList.add('animate__fadeOut');
      defeatOverlay.addEventListener('animationend', function handleAnimationEnd() {
        defeatOverlay.removeEventListener('animationend', handleAnimationEnd);
        defeatOverlay.remove();
        restartGame();
      });
    });

    document.getElementById('defeat-menu-btn').addEventListener('click', () => {
      defeatOverlay.classList.remove('animate__fadeIn');
      defeatOverlay.classList.add('animate__fadeOut');
      defeatOverlay.addEventListener('animationend', function handleAnimationEnd() {
        defeatOverlay.removeEventListener('animationend', handleAnimationEnd);
        defeatOverlay.remove();
        showMainMenu();
      });
    });

  }, 1000);
}

/* Funzione per riavviare il gioco */
function restartGame() {
  // Rimuovi tutte le overlay esistenti
  const existingOverlays = document.querySelectorAll('.victory-overlay, .defeat-overlay');
  existingOverlays.forEach(overlay => overlay.remove());
  
  // Ferma il timer esistente se attivo
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  // Chiama esattamente la stessa logica del bottone "Gioca!" dal menu
  // I valori di difficoltà e samurai mode rimangono invariati
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
  startTimer();
}

/* Calcola il punteggio finale */
function calculateScore() {
  const timeBonus = Math.max(0, 300 - currentTime); // Bonus tempo
  const errorPenalty = errors * 10; // Penalità errori
  const sizeBonus = gridSize * 50; // Bonus dimensione griglia
  const finalScore = Math.max(0, timeBonus + sizeBonus - errorPenalty);
  return finalScore;
}

function initGame() {
  gameOver = false;
  gridNumbers = [];
  gridSolution = [];
  gridState = [];
  rowTargets = [];
  colTargets = [];
  rowCompleted = new Array(gridSize).fill(false);
  colCompleted = new Array(gridSize).fill(false);

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