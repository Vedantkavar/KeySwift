class TypingTest {
  constructor(difficulty = 'beginner') {
    this.difficulty = difficulty;
    this.wordList = difficulty === 'beginner' ? BEGINNER_WORD_LIST : ADVANCED_WORD_LIST;
    this.wordList = difficulty === 'medium' ? MEDIUM_WORD_LIST : this.wordList;
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
    this.typedWords = []; // Array to store words the user has typed
    this.visibleWordCount = 30; // Number of words to display at once
    this.wordDisplayOffset = 0; // Track which subset of words we're displaying
    this.cursorPosition = 0; // Track cursor position within the current word
    this.incorrectChars = 0; // Track the number of incorrect characters

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
    this.typedWords = []; // Reset typed words
    this.wordDisplayOffset = 0; // Reset display offset
    this.currentWordIndex = 0;
    this.cursorPosition = 0;
    this.incorrectChars = 0;
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
      
      const inputValue = e.target.value;
      // Only update if the input has actually changed
      if (inputValue !== this.currentInput) {
        this.handleInput(inputValue);
      }
    });

    this.inputField.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        e.preventDefault(); // Always prevent default for space
        this.handleSpaceKey();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.reset();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.reset();
        if (this.isRunning) {
          this.stopGame();
        }
        // Set game mode to time and time to 30s
        this.setTimeMode30s();
        this.showDifficultySelection();
      } else if (e.key === 'Backspace' && this.currentInput.length === 0 && this.currentWordIndex > 0) {
        // CHANGE 2: Allow backspace to previous word
        e.preventDefault();
        this.handleBackspace();
      } else {
        // Prevent typing more characters than the current word length
        const currentWord = this.words[this.currentWordIndex];
        if (this.currentInput.length >= currentWord.length && 
            !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
          e.preventDefault();
          this.handleSpaceKey(); // Automatically move to next word
        }
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
        // Set game mode to time and time to 30s
        this.setTimeMode30s();
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

  // CHANGE 2: New method to handle backspace to previous word
  handleBackspace() {
    // Move back to the previous word
    this.currentWordIndex--;
    
    // Get the previously typed word
    const previousTypedWord = this.typedWords.pop();
    
    // Update statistics (decrement total word count)
    this.totalWords--;
    
    // If the previous word was correct, decrement correct words count
    if (previousTypedWord && previousTypedWord.correct) {
      this.correctWords--;
    }
    
    // Set the current input to the previous word's text
    this.currentInput = previousTypedWord ? previousTypedWord.text : '';
    this.cursorPosition = this.currentInput.length;
    this.inputField.value = this.currentInput;
    
    // Update display
    this.displayWords();
    this.updateProgressDisplay();
  }

  // Method to handle input changes
  handleInput(inputValue) {
    const currentWord = this.words[this.currentWordIndex];
    
    // Limit input to current word length
    if (inputValue.length > currentWord.length) {
      inputValue = inputValue.substring(0, currentWord.length);
      this.inputField.value = inputValue;
    }
    
    this.currentInput = inputValue;
    this.cursorPosition = inputValue.length;
    
    // CHANGE 1: Track incorrect characters
    this.updateIncorrectCharCount();
    
    this.displayWords();
  }

  // CHANGE 1: New method to count incorrect characters
  updateIncorrectCharCount() {
    const currentWord = this.words[this.currentWordIndex];
    let incorrectCount = 0;
    
    for (let i = 0; i < this.currentInput.length; i++) {
      if (i < currentWord.length && this.currentInput[i] !== currentWord[i]) {
        incorrectCount++;
      }
    }
    
    this.incorrectChars = incorrectCount;
  }

  // Method to handle space key
  // Method to handle space key
handleSpaceKey() {
  const currentWord = this.words[this.currentWordIndex];
  
  // Only proceed to next word if the input length matches the current word length
  // This prevents skipping words with space if they're not complete
  if (this.currentInput.length === currentWord.length) {
    // CHANGE 1: Check if the word has any incorrect characters
    const hasIncorrectChars = this.incorrectChars > 0;
    
    // Check if the word is correct (exact match)
    const isCorrect = this.currentInput === currentWord;
    
    // Store the typed word along with whether it was correct
    this.typedWords.push({
      text: this.currentInput,
      correct: isCorrect,
      incorrectChars: this.incorrectChars // Store count of incorrect chars for this word
    });
    
    // Update statistics
    this.totalWords++;
    if (isCorrect) {
      this.correctWords++;
    }
    
    // Move to the next word
    this.currentWordIndex++;
    
    // Check if we're nearing the end of visible words and need to shift
    if (this.currentWordIndex - this.wordDisplayOffset > this.visibleWordCount - 10) {
      this.wordDisplayOffset = Math.max(0, this.currentWordIndex - 5);
      
      // Check if we need to generate more words
      if (this.currentWordIndex >= this.words.length - this.visibleWordCount) {
        this.generateMoreWords();
      }
    }
    
    // Reset current input and cursor
    this.currentInput = '';
    this.cursorPosition = 0;
    this.incorrectChars = 0;
    this.inputField.value = '';
    
    // Check if we've reached the target in words mode
    if (this.gameMode === 'words' && this.totalWords >= this.targetValue) {
      this.end();
    } else {
      this.displayWords();
      this.updateProgressDisplay();
    }
  }
}

  // Method to generate more words when reaching near the end
  generateMoreWords() {
    const additionalWords = Array.from({ length: 100 }, () =>
      this.wordList[Math.floor(Math.random() * this.wordList.length)]
    );
    this.words = [...this.words, ...additionalWords];
  }

  displayWords() {
    // Calculate how many words to show before and after the current word
    const wordsToShow = this.words.slice(this.wordDisplayOffset, this.wordDisplayOffset + this.visibleWordCount);
    
    // Create a MonkeyType-style word display with clean layout
    let wordDisplayHTML = '<div class="word-flow-container">';
    
    wordsToShow.forEach((word, index) => {
      // Calculate the real index in the full words array
      const realIndex = index + this.wordDisplayOffset;
      const isCurrentWord = realIndex === this.currentWordIndex;
      
      if (realIndex < this.currentWordIndex) {
        // Words already typed - CHANGE 1: Show character-by-character highlight for errors
        const typedWord = this.typedWords[realIndex];
        
        if (typedWord) {
          wordDisplayHTML += '<span class="word">';
          
          // Show each character with proper coloring
          for (let i = 0; i < word.length; i++) {
            if (i < typedWord.text.length) {
              // Character was typed - check if correct
              const isCharCorrect = word[i] === typedWord.text[i];
              const charClass = isCharCorrect ? 'typed-correct-char' : 'typed-incorrect-char';
              wordDisplayHTML += `<span class="${charClass}">${word[i]}</span>`;
            } else {
              // Character was not typed (word cut short)
              wordDisplayHTML += `<span class="missed-char">${word[i]}</span>`;
            }
          }
          
          // Extra characters if typed
          for (let i = word.length; i < typedWord.text.length; i++) {
            wordDisplayHTML += `<span class="typed-incorrect-char">${typedWord.text[i]}</span>`;
          }
          
          wordDisplayHTML += '</span> ';
        } else {
          wordDisplayHTML += `<span class="word">${word}</span> `;
        }
      } else if (isCurrentWord) {
        // Show cursor before the first character of current word
        if (this.currentInput.length === 0) {
          wordDisplayHTML += '<span class="word current"><span class="cursor-line"></span>';
          
          // Show the word characters
          for (let i = 0; i < word.length; i++) {
            wordDisplayHTML += `<span>${word[i]}</span>`;
          }
          
          wordDisplayHTML += '</span> ';
        } else {
          // Current word - show character by character with cursor
          wordDisplayHTML += '<span class="word current">';
          
          for (let i = 0; i < word.length; i++) {
            // If this is where the cursor is, add cursor line before the character
            if (i === this.cursorPosition) {
              wordDisplayHTML += '<span class="cursor-line"></span>';
            }
            
            if (i < this.currentInput.length) {
              // Character was typed
              const charClass = word[i] === this.currentInput[i] ? 'correct' : 'incorrect';
              wordDisplayHTML += `<span class="${charClass}">${word[i]}</span>`;
            } else {
              // Character not typed yet
              wordDisplayHTML += `<span>${word[i]}</span>`;
            }
          }
          
          // If cursor is at the end of the word
          if (this.cursorPosition === word.length) {
            wordDisplayHTML += '<span class="cursor-line"></span>';
          }
          
          wordDisplayHTML += '</span> ';
        }
      } else {
        // Upcoming words
        wordDisplayHTML += `<span class="word">${word}</span> `;
      }
    });
    
    wordDisplayHTML += '</div>';
    
    this.wordDisplay.innerHTML = wordDisplayHTML;
    
    // Add CSS to style the cursor with a blinking animation if not already in your CSS
    const style = document.createElement('style');
    if (!document.querySelector('style#cursor-style')) {
      style.id = 'cursor-style';
      style.textContent = `
        /* Thinner cursor that appears before the character */
        .cursor-line {
          display: inline-block;
          width: 2px;
          height: 1.2em;
          background-color: #64ffda;
          margin-right: -2px;
          vertical-align: middle;
          position: relative;
          animation: blink 1s infinite;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .word-flow-container {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          line-height: 1.5;
        }
        
        .word {
          position: relative;
          white-space: nowrap;
        }
        
        /* CHANGE 1: Character-specific styling for typed words */
        .typed-correct-char {
          color: #64ffda;
        }
        
        .typed-incorrect-char {
          color: #f44336;
          text-decoration: underline;
        }
        
        .missed-char {
          color: #888;
        }
        
        .correct {
          color: #64ffda;
        }
        
        .incorrect {
          color: #f44336;
          text-decoration: underline;
        }
        
        .current {
          position: relative;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Method to set game mode to time and time to 30s
  setTimeMode30s() {
    this.gameMode = 'time';
    this.targetValue = 30;
    this.timeLeft = 30;
    
    // Update UI to reflect changes
    this.modeButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.mode === 'time') {
        btn.classList.add('active');
      }
    });
    
    this.timeButtons.forEach(btn => {
      btn.classList.remove('active');
      const value = btn.dataset.value;
      btn.textContent = `${value}s`;
      if (parseInt(value) === 30) {
        btn.classList.add('active');
      }
    });
    
    this.updateProgressDisplay();
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
    this.cursorPosition = 0;
    this.incorrectChars = 0;
    this.inputField.value = '';
    this.inputField.disabled = false;
    this.typedWords = [];
    this.wordDisplayOffset = 0;
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

  stopGame() {
    clearInterval(this.timer);
    this.isRunning = false;
  }
}