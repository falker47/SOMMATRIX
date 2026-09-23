/**
 * SOMMATRIX - Internationalization (i18n) Module
 * Supports Italian (IT) and English (EN) languages
 */

const i18n = {
    currentLanguage: 'it',

    translations: {
        it: {
            // Main Menu
            title: 'SOMMATRIX',
            tagline: 'Ogni numero conta. Fai quadrare <b>righe</b> e <b>colonne</b>.',
            chooseGridSize: 'Scegli la sfida',
            lvl4Name: 'Schizzo',
            lvl4Desc: 'Per prendere la mano',
            lvl6Name: 'Studio',
            lvl6Desc: 'La sfida classica',
            lvl8Name: 'Capolavoro',
            lvl8Desc: 'Per menti allenate',
            lastSamurai: "L'Ultimo Samurai",
            samuraiSub: 'Una sola vita. Nessun errore.',
            tutorial: 'Tutorial',
            play: 'Gioca',

            // UI controls (aria)
            toggleTheme: 'Cambia tema chiaro/scuro',
            toggleMode: 'Cambia modalità conferma/cancella',
            backToMenu: 'Torna al menu',
            prevStep: 'Passo precedente',
            nextStep: 'Passo successivo',

            // Tutorial
            tutorialTitle: 'Come si gioca',
            tutorialDemoTitle: 'Esempio 4×4',
            tutorialTargetLabel: 'TARGET',
            tutorialVisual1: 'TARGET <b>12</b> · le quattro celle evidenziate sono gli addendi candidati.',
            tutorialVisual2: '<b>5 + 7 = 12</b> · questi due addendi sono confermati.',
            tutorialVisual3: 'TARGET <b>6</b> · <b>7</b> e <b>9</b> sono impossibili: da soli superano già il target.',
            tutorialVisual4: 'Raggiunto il target, gli altri candidati della riga vengono eliminati automaticamente.',
            demoLabel: 'Obiettivo riga: <b>12</b>',
            tutStep1: 'Il numero dopo la barra è il <b>target</b>. Le celle evidenziate sono gli <b>addendi candidati</b>: devi capire quali sommare per raggiungerlo.',
            tutStep2: 'In modalità <b>Conferma</b> seleziona solo addendi che hai dedotto corretti. Qui <b>5 + 7 = 12</b>.',
            tutStep3: 'In modalità <b>Cancella</b> elimina solo numeri sicuramente impossibili. Con target <b>6</b>, 7 e 9 non possono far parte della somma perché lo superano già da soli.',
            tutStep4: 'Quando una riga o colonna raggiunge il target, gli altri candidati si cancellano automaticamente. <b>Ultimo Samurai</b>: una vita sola!',
            gameObjective: 'Obiettivo del Gioco',
            gameObjectiveText: 'Benvenuto su <strong>SOMMATRIX</strong>! L\'obiettivo è far sì che in ogni riga e colonna la somma dei numeri confermati raggiunga esattamente il totale indicato.',
            controls: 'Controlli',
            controlsIntro: 'Per risolvere l\'enigma puoi eseguire due operazioni sui numeri:',
            confirm: 'Conferma',
            confirmText: 'Clicca per confermare un numero che fa parte della somma',
            cancel: 'Cancella',
            cancelText: 'Clicca per cancellare un numero che NON fa parte della somma',
            warning: '<strong>Attenzione:</strong> Se sbagli perdi una vita e verrà segnalato da un flash rosso!',
            tips: 'Suggerimenti',
            tip1: 'Una volta selezionati tutti gli addendi corretti di una riga o colonna, i numeri da cancellare si auto-eliminano automaticamente',
            tip2: 'Usa la modalità "Cancella" per eliminare i numeri che sicuramente non fanno parte della somma',
            tip3: 'Controlla sempre i totali parziali per verificare i tuoi progressi',
            samuraiMode: 'Modalità "Ultimo Samurai"',
            samuraiWarningTitle: 'Solo per Veri Temerari!',
            samuraiWarningText: 'Farai la partita con <strong>una sola vita</strong> - non c\'è alcun margine di errore!',

            // Game
            time: 'Tempo',
            score: 'Punteggio',
            record: 'Record',

            // Victory
            victory: 'VITTORIA!',
            victoryMessage: 'Complimenti! Hai risolto il puzzle!',
            newRecord: 'Nuovo Record',
            playAgain: 'Gioca Ancora',
            mainMenu: 'Menu Principale',

            // Defeat
            gameOver: 'GAME OVER',
            defeatMessage: 'Non ti arrendere! Ogni errore è un passo verso la vittoria!',
            retry: 'Riprova'
        },

        en: {
            // Main Menu
            title: 'SOMMATRIX',
            tagline: 'Every number counts. Make <b>rows</b> and <b>columns</b> add up.',
            chooseGridSize: 'Choose your challenge',
            lvl4Name: 'Sketch',
            lvl4Desc: 'Warm up your mind',
            lvl6Name: 'Study',
            lvl6Desc: 'The classic challenge',
            lvl8Name: 'Masterpiece',
            lvl8Desc: 'For trained minds',
            lastSamurai: 'The Last Samurai',
            samuraiSub: 'One life. No mistakes.',
            tutorial: 'Tutorial',
            play: 'Play',

            // UI controls (aria)
            toggleTheme: 'Toggle light/dark theme',
            toggleMode: 'Toggle confirm/cancel mode',
            backToMenu: 'Back to menu',
            prevStep: 'Previous step',
            nextStep: 'Next step',

            // Tutorial
            tutorialTitle: 'How to play',
            tutorialDemoTitle: '4×4 example',
            tutorialTargetLabel: 'TARGET',
            tutorialVisual1: 'TARGET <b>12</b> · the four highlighted cells are candidate addends.',
            tutorialVisual2: '<b>5 + 7 = 12</b> · these two addends are confirmed.',
            tutorialVisual3: 'TARGET <b>6</b> · <b>7</b> and <b>9</b> are impossible: each already exceeds the target.',
            tutorialVisual4: 'Once the target is reached, the remaining candidates in that row are removed automatically.',
            demoLabel: 'Row target: <b>12</b>',
            tutStep1: 'The number after the slash is the <b>target</b>. Highlighted cells are <b>candidate addends</b>: work out which ones must sum to it.',
            tutStep2: 'In <b>Confirm</b> mode, select only addends you have deduced are correct. Here <b>5 + 7 = 12</b>.',
            tutStep3: 'In <b>Cancel</b> mode, remove only numbers that are certainly impossible. With target <b>6</b>, 7 and 9 cannot belong because each exceeds it on its own.',
            tutStep4: 'When a row or column reaches its target, the remaining candidates are removed automatically. <b>Last Samurai</b>: one life only!',
            gameObjective: 'Game Objective',
            gameObjectiveText: 'Welcome to <strong>SOMMATRIX</strong>! Your goal is to make sure that the sum of the confirmed numbers in each row and column matches exactly the indicated total.',
            controls: 'Controls',
            controlsIntro: 'To solve the puzzle you can perform two operations on the numbers:',
            confirm: 'Confirm',
            confirmText: 'Click to confirm a number that is part of the sum',
            cancel: 'Cancel',
            cancelText: 'Click to cancel a number that is NOT part of the sum',
            warning: '<strong>Warning:</strong> If you make a mistake you lose a life and a red flash will signal it!',
            tips: 'Tips',
            tip1: 'Once you select all the correct addends in a row or column, the remaining numbers are automatically canceled',
            tip2: 'Use "Cancel" mode to eliminate numbers that definitely do not belong to the sum',
            tip3: 'Always check the partial totals to verify your progress',
            samuraiMode: '"Last Samurai" Mode',
            samuraiWarningTitle: 'For True Daredevils Only!',
            samuraiWarningText: 'You play with <strong>only one life</strong> - there\'s no room for error!',

            // Game
            time: 'Time',
            score: 'Score',
            record: 'Record',

            // Victory
            victory: 'VICTORY!',
            victoryMessage: 'Congratulations! You solved the puzzle!',
            newRecord: 'New Record',
            playAgain: 'Play Again',
            mainMenu: 'Main Menu',

            // Defeat
            gameOver: 'GAME OVER',
            defeatMessage: "Don't give up! Every mistake is a step towards victory!",
            retry: 'Retry'
        }
    },

    /**
     * Initialize i18n system
     * Loads saved language preference or defaults to Italian
     */
    init() {
        const savedLang = localStorage.getItem('sommatrix_language');
        if (savedLang && this.translations[savedLang]) {
            this.currentLanguage = savedLang;
        }
        this.applyTranslations();
        this.updateToggleButton();
    },

    /**
     * Get translation for a key
     * @param {string} key - Translation key
     * @returns {string} Translated text
     */
    t(key) {
        return this.translations[this.currentLanguage][key] ||
            this.translations['it'][key] ||
            key;
    },

    /**
     * Set the current language
     * @param {string} lang - Language code ('it' or 'en')
     */
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('sommatrix_language', lang);
            this.applyTranslations();
            this.updateToggleButton();
        }
    },

    /**
     * Toggle between languages
     */
    toggleLanguage() {
        const newLang = this.currentLanguage === 'it' ? 'en' : 'it';
        this.setLanguage(newLang);
    },

    /**
     * Apply translations to all elements with data-i18n attribute
     */
    applyTranslations() {
        // Text content translations
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);
            if (translation) {
                el.innerHTML = translation;
            }
        });

        // Placeholder translations
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            if (translation) {
                el.placeholder = translation;
            }
        });

        // Aria-label translations
        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            const translation = this.t(key);
            if (translation) {
                el.setAttribute('aria-label', translation);
            }
        });

        // Update document language attribute
        document.documentElement.lang = this.currentLanguage;
    },

    /**
     * Update the language toggle button appearance
     */
    updateToggleButton() {
        const sw = document.querySelector('.lang-switch');
        if (!sw) return;
        sw.classList.toggle('en', this.currentLanguage === 'en');
        sw.querySelectorAll('.lang-opt').forEach(opt => {
            const active = opt.dataset.lang === this.currentLanguage;
            opt.classList.toggle('is-active', active);
            opt.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    i18n.init();
});
