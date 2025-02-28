document.addEventListener('DOMContentLoaded', () => {
  const difficultyButtons = document.querySelectorAll('.difficulty-button');
  const difficultyContainer = document.getElementById('difficulty-container');
  const gameContainer = document.getElementById('game-container');
  let game = null;

  difficultyButtons.forEach(button => {
      button.addEventListener('click', () => {
          const difficulty = button.dataset.difficulty;
          difficultyContainer.style.display = 'none';
          gameContainer.style.display = 'block';
          game = new TypingTest(difficulty);
      });
  });
});