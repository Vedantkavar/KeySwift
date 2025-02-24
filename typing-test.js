class TypingTest {
  constructor(difficulty = 'beginner') {
    this.difficulty = difficulty;
    this.wordList = difficulty === 'beginner' ? BEGINNER_WORD_LIST : ADVANCED_WORD_LIST;
    this.words = [];
    this.currentWordIndex = 0;
    this.isRunning = false;
    this.correctWords = 0;
    this.totalWords = 0;
    this.timer = null;
    this.gameMode = 'time';
    this.targetValue = 30; // Default target value of 30
    this.timeLeft = this.targetValue;
    this.startTime = null;
    this.currentInput = '';
    this.currentCharIndex = 0;

    // DOM Elements
    this.difficultyContainer = document.getElementById('difficulty-container');
    this.gameContainer = document.getElementById('game-container');
    this.resultsContainer = document.getElementById('results-container');
    this.difficultyIndicator = document.querySelector('.difficulty-indicator');
    this.modeButtons = document.querySelectorAll('.mode-button');
    this.timeButtons = document.querySelectorAll('.time-button');
    this.progressDisplay = document.querySelector('.progress-display');
    this.wordDisplay = document.querySelector('.word-display');
    this.inputField = document.querySelector('.input-field');
    this.restartButton = document.querySelector('.restart-button');
    this.changeDifficultyButton = document.querySelector('.change-difficulty-button');

    this.init();
  }

  init() {
    // Set initial active state for time button matching default targetValue
    this.timeButtons.forEach(button => {
      if (parseInt(button.dataset.value) === this.targetValue) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
    
    this.generateWords();
    this.displayWords();
    this.setupEventListeners();
    this.updateProgressDisplay();
    this.updateDifficultyIndicator();
  }

  updateDifficultyIndicator() {
    this.difficultyIndicator.textContent = `Difficulty: ${this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1)}`;
  }

  generateWords() {
    const wordCount = Math.max(200, this.targetValue * 2);
    this.words = Array.from({ length: wordCount }, () =>
      this.wordList[Math.floor(Math.random() * this.wordList.length)]
    );
  }

  setupEventListeners() {
    // Mode selection buttons
    this.modeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const newMode = button.dataset.mode;
        if (this.gameMode !== newMode) {
          this.gameMode = newMode;
          this.modeButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');

          this.timeButtons.forEach(btn => {
            const value = btn.dataset.value;
            btn.textContent = this.gameMode === 'time' ? `${value}s` : `${value}w`;
          });

          this.reset();
        }
      });
    });

    // Time/Word count buttons
    this.timeButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.targetValue = parseInt(button.dataset.value);
        this.timeLeft = this.targetValue;
        this.timeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        this.reset();
      });
    });

    // Input field events
    this.inputField.addEventListener('input', (e) => {
      if (!this.isRunning) {
        this.start();
      }
      this.currentInput = e.target.value;
      this.displayWords();
    });

    this.inputField.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        this.handleWordSubmission();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.reset();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.reset();
        if (this.isRunning) {
          this.stopGame();
        }
        this.showDifficultySelection();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        if (this.isRunning) {
          this.stopGame();
        }
        this.reset();
        this.gameContainer.style.display = 'block';
        this.resultsContainer.style.display = 'none';
        this.inputField.focus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.reset();
        if (this.isRunning) {
          this.stopGame();
        }
        this.showDifficultySelection();
      }
    });

    // Restart and difficulty buttons
    this.restartButton.addEventListener('click', () => {
      this.reset();
      this.gameContainer.style.display = 'block';
      this.resultsContainer.style.display = 'none';
    });

    if (this.changeDifficultyButton) {
      this.changeDifficultyButton.addEventListener('click', () => {
        if (this.isRunning) {
          this.stopGame();
        }
        this.showDifficultySelection();
      });
    }
  }


  handleWordSubmission() {
    const currentWord = this.words[this.currentWordIndex];
    if (this.currentInput.trim()) {
      this.totalWords++;
      if (this.currentInput.trim() === currentWord) {
        this.correctWords++;
      }
      this.currentWordIndex++;
      this.currentInput = '';
      this.inputField.value = '';

      if (this.gameMode === 'words' && this.totalWords >= this.targetValue) {
        this.end();
      } else {
        this.displayWords();
        this.updateProgressDisplay();
      }
    }
  }

  displayWords() {
    const currentWord = this.words[this.currentWordIndex];
    const wordsToShow = this.words.slice(this.currentWordIndex, this.currentWordIndex + 10);
    
    const wordElements = wordsToShow.map((word, wordIndex) => {
      if (wordIndex === 0) {
        // Current word - show character by character comparison
        const chars = word.split('').map((char, charIndex) => {
          let className = '';
          if (charIndex < this.currentInput.length) {
            className = char === this.currentInput[charIndex] ? 'correct' : 'incorrect';
          }
          return `<span class="${className}">${char}</span>`;
        });
        return `<span class="current">${chars.join('')}</span>`;
      }
      return `<span>${word}</span>`;
    });

    this.wordDisplay.innerHTML = wordElements.join(' ');
    this.inputField.value = this.currentInput;
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.startTime = Date.now();

      if (this.gameMode === 'time') {
        this.timer = setInterval(() => {
          this.timeLeft--;
          this.updateProgressDisplay();
          if (this.timeLeft <= 0) {
            this.end();
          }
        }, 1000);
      }
    }
  }

  end() {
    clearInterval(this.timer);
    this.isRunning = false;
    this.inputField.disabled = true;

    const timeElapsed = (Date.now() - this.startTime) / 1000 / 60; // Convert to minutes
    const rawWPM = Math.round(this.totalWords / timeElapsed);
    const netWPM = Math.round(this.correctWords / timeElapsed);
    const accuracy = this.totalWords > 0
      ? Math.round((this.correctWords / this.totalWords) * 100)
      : 0;

    // Update results display
    document.querySelector('.raw-wpm-value').textContent = rawWPM;
    document.querySelector('.net-wpm-value').textContent = netWPM;
    document.querySelector('.accuracy-value').textContent = `${accuracy}%`;
    document.querySelector('.words-count-value').textContent = `${this.correctWords} / ${this.totalWords}`;

    this.gameContainer.style.display = 'none';
    this.resultsContainer.style.display = 'block';
  }

  reset() {
    clearInterval(this.timer);
    this.isRunning = false;
    this.currentWordIndex = 0;
    this.correctWords = 0;
    this.totalWords = 0;
    this.timeLeft = this.targetValue;
    this.startTime = null;
    this.currentInput = '';
    this.inputField.value = '';
    this.inputField.disabled = false;
    this.generateWords();
    this.displayWords();
    this.updateProgressDisplay();
    this.inputField.focus();
  }

  updateProgressDisplay() {
    if (this.gameMode === 'time') {
      this.progressDisplay.textContent = `Time: ${this.timeLeft}s`;
    } else {
      this.progressDisplay.textContent = `Words: ${this.totalWords}/${this.targetValue}`;
    }
  }

  showDifficultySelection() {
    this.gameContainer.style.display = 'none';
    this.resultsContainer.style.display = 'none';
    this.difficultyContainer.style.display = 'block';
  }
}