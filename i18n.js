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
            chooseGridSize: 'Scegli la dimensione della griglia:',
            lastSamurai: "L'Ultimo Samurai",
            tutorial: 'Tutorial',
            play: 'Gioca!',

            // Tutorial
            tutorialTitle: 'Tutorial',
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
            chooseGridSize: 'Choose grid size:',
            lastSamurai: 'The Last Samurai',
            tutorial: 'Tutorial',
            play: 'Play!',

            // Tutorial
            tutorialTitle: 'Tutorial',
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
        const toggleBtn = document.getElementById('language-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = this.currentLanguage === 'it' ? '🇬🇧 EN' : '🇮🇹 IT';
            toggleBtn.title = this.currentLanguage === 'it' ? 'Switch to English' : 'Passa a Italiano';
        }
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    i18n.init();
});
