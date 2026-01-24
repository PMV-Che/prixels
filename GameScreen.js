import { PixelOutline } from './PixelOutline.js';

// Game state
let gameState = {
  currentRound: 0,
  totalRounds: 5,
  sessionScore: 0,
  playerName: '',
  gameData: []
};

export function renderGameScreen() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="game-screen">
      <header class="prixels-header">
        <span class="prixels-title">Prixles</span>
        <span class="prixels-subtitle">Round <span id="round-counter">${gameState.currentRound + 1}</span> of ${gameState.totalRounds}</span>
      </header>
      <!-- Pixels Drawing Area -->
      <section style="flex: 2 1 50%; display: flex; align-items: center; justify-content: center; background: #f4f4f4;">
        <div id="pixels-area" class="pixels-area">
          <button id="start-dots-btn" class="start-circle-btn">Start</button>
        </div>
      </section>
      <!-- Answers and Points Area -->
      <section style="flex: 1 1 34%; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; background: #fafafa; padding: 1em 0;">
        <div class="score-time-row" style="width: 80%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 1em;">
          <span>Round: <span id="score">1000</span></span>
          <span>Total: <span id="session-score">${gameState.sessionScore}</span></span>
        </div>
        <div id="answers-area" style="width: 80%; display: grid; grid-template-columns: 1fr 1fr; gap: 0.7em;">
          <button class="answer-btn" style="padding: 1em; font-size: 1.1em; border-radius: 8px; border: 1px solid #ccc;">Option 1</button>
          <button class="answer-btn" style="padding: 1em; font-size: 1.1em; border-radius: 8px; border: 1px solid #ccc;">Option 2</button>
          <button class="answer-btn" style="padding: 1em; font-size: 1.1em; border-radius: 8px; border: 1px solid #ccc;">Option 3</button>
          <button class="answer-btn" style="padding: 1em; font-size: 1.1em; border-radius: 8px; border: 1px solid #ccc;">Option 4</button>
        </div>
      </section>
      <!-- Player Name Popup -->
      <div id="name-popup-overlay" class="popup-overlay ${gameState.playerName ? 'hidden' : ''}">
        <div id="name-popup-modal" class="popup-modal">
          <h2 style="color: orange; margin-bottom: 1em;">Welcome to Prixels!</h2>
          <p style="margin-bottom: 1.5em; line-height: 1.6; text-align: left; color: #555;">🎯 <strong>How to Play:</strong><br/>You'll see dots that slowly reveal a hidden picture. Guess what it is as quickly as possible!<br/><br/>💰 <strong>Scoring:</strong><br/>Start with 1000 points per round, lose 10 points for each additional dot.<br/><br/>🎮 <strong>Game Format:</strong><br/>Complete all 5 rounds to see your final score and ranking!</p>
          <div style="margin-bottom: 1.5em;">
            <label for="player-name" style="display: block; margin-bottom: 0.5em;">Your Name:</label>
            <input type="text" id="player-name" value="${generateRandomName()}" style="padding: 0.8em; font-size: 1.1em; border: 2px solid #ddd; border-radius: 8px; width: 100%; box-sizing: border-box;" />
          </div>
          <button id="start-game-btn" class="play-again-btn">Start Game!</button>
        </div>
      </div>
      <!-- Round Result Popup -->
      <div id="popup-overlay" class="popup-overlay hidden">
        <div id="popup-modal" class="popup-modal taller-modal">
          <div id="popup-message" class="popup-message"></div>
          <img id="popup-image" class="popup-image" style="display:none; margin: 1.5em auto 0 auto; max-width: 180px; max-height: 180px;" />
          <button id="continue-btn" class="play-again-btn">Continue</button>
        </div>
      </div>
      <!-- Countdown Timer Popup -->
      <div id="countdown-overlay" class="countdown-overlay hidden">
        <div class="countdown-modal">
          <div id="countdown-number" class="countdown-number">3</div>
          <div class="countdown-text">Next round starting...</div>
        </div>
      </div>
      <!-- End Game Popup -->
      <div id="endgame-overlay" class="popup-overlay hidden">
        <div id="endgame-modal" class="popup-modal">
          <div id="endgame-message" class="popup-message"></div>
          <div id="endgame-stats" style="margin: 1em 0; font-size: 1.1em;"></div>
          <button id="main-menu-btn" class="play-again-btn">Main Menu</button>
        </div>
      </div>
    </div>
  `;

  // Initialize player name popup
  const namePopup = document.getElementById('name-popup-overlay');
  const startGameBtn = document.getElementById('start-game-btn');
  const playerNameInput = document.getElementById('player-name');

  startGameBtn.onclick = () => {
    gameState.playerName = playerNameInput.value.trim() || generateRandomName();
    namePopup.classList.add('hidden');
    // Add countdown for first round too
    showCountdown(() => startNewRound());
  };

  if (gameState.currentRound === 0 && !gameState.playerName) {
    return; // Wait for name input
  }

  function startNewRound() {
    if (gameState.currentRound >= gameState.totalRounds) {
      endGame();
      return;
    }

    // Reset round variables
    let intervalId = null;
    let dotsCount = 5;
    let points = 1000;
    let gameEnded = false;
    let outline = null;
    let rightAnswerFile = null;
    let currentGameData = null;

    // Update UI elements
    document.getElementById('round-counter').textContent = gameState.currentRound + 1;
    document.getElementById('session-score').textContent = gameState.sessionScore;
    document.getElementById('score').textContent = points;

    // Reset pixels area - auto-start after countdown
    const pixelsArea = document.getElementById('pixels-area');
    pixelsArea.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 200px; font-size: 1.2rem; color: #666;">Loading next challenge...</div>';

    // Disable answer buttons until game starts
    const answersArea = document.getElementById('answers-area');
    const answerBtns = Array.from(answersArea.children);
    answerBtns.forEach(btn => {
      btn.disabled = true;
      btn.textContent = 'Loading...';
    });

    // Load the JSON metadata and pick a random SVG
    fetch(`./src/static/examples/examples_metadata_v1.json?${Date.now()}`)
      .then(response => response.json())
      .then(json => {
        const randomEntry = json[Math.floor(Math.random() * json.length)];
        const svgFile = randomEntry.file;
        rightAnswerFile = svgFile;
        currentGameData = randomEntry;

        // Prepare answer options and shuffle
        const options = [
          { text: randomEntry.object, correct: true },
          { text: randomEntry.option1, correct: false },
          { text: randomEntry.option2, correct: false },
          { text: randomEntry.option3, correct: false }
        ];
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [options[i], options[j]] = [options[j], options[i]];
        }

        // Set button texts
        answerBtns.forEach((btn, idx) => {
          btn.textContent = options[idx].text;
          btn.dataset.correct = options[idx].correct ? "1" : "0";
        });

        return fetch(`./src/static/examples/${svgFile}`);
      })
      .then(response => response.text())
      .then(data => {
        outline = new PixelOutline(data, dotsCount);

        // Get fresh references to DOM elements after reset
        const currentPixelsArea = document.getElementById('pixels-area');
        const scoreSpan = document.getElementById('score');

        function renderDots() {
          const dots = outline.getDots();

          // Calculate bounding box of dots
          let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
          dots.forEach(([x, y]) => {
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          });

          // Padding for the dots inside the SVG area
          const padding = 8;
          const svgWidth = 100, svgHeight = 100;
          const boxWidth = maxX - minX || 1;
          const boxHeight = maxY - minY || 1;
          const scale = Math.min(
            (svgWidth - 2 * padding) / boxWidth,
            (svgHeight - 2 * padding) / boxHeight
          );

          // Centering offset
          const offsetX = (svgWidth - scale * boxWidth) / 2 - scale * minX;
          const offsetY = (svgHeight - scale * boxHeight) / 2 - scale * minY;

          const svgNS = "http://www.w3.org/2000/svg";
          const svg = document.createElementNS(svgNS, "svg");
          svg.setAttribute("width", "100%");
          svg.setAttribute("height", "100%");
          svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
          svg.setAttribute("style", "display: block; margin: auto;");

          dots.forEach(([x, y]) => {
            const circle = document.createElementNS(svgNS, "circle");
            circle.setAttribute("cx", x * scale + offsetX);
            circle.setAttribute("cy", y * scale + offsetY);
            circle.setAttribute("r", 0.7); // Radius of the dot
            circle.setAttribute("fill", "#222");
            svg.appendChild(circle);
          });

          currentPixelsArea.innerHTML = "";
          currentPixelsArea.appendChild(svg);

          // Points decrease by 10 for each new dot added after the initial 5
          points = Math.max(0, 1000 - 10 * (dotsCount - 5));
          scoreSpan.textContent = points;
        }

        function stopGame() {
          if (intervalId) clearInterval(intervalId);
          gameEnded = true;
        }

        // Show popup
        function showPopup(message, wasCorrect) {
          const popupOverlay = document.getElementById('popup-overlay');
          const popupMessage = document.getElementById('popup-message');
          const popupImage = document.getElementById('popup-image');
          const continueBtn = document.getElementById('continue-btn');
          
          popupMessage.textContent = message;
          popupImage.src = `./src/static/examples/${rightAnswerFile}`;
          popupImage.style.display = 'block';
          popupOverlay.classList.remove('hidden');
          
          // Award points only if correct, zero points if wrong
          const roundPoints = wasCorrect ? points : 0;
          if (wasCorrect) {
            gameState.sessionScore += roundPoints;
          }
          document.getElementById('session-score').textContent = gameState.sessionScore;

          // Continue to next round with countdown
          continueBtn.onclick = () => {
            popupOverlay.classList.add('hidden');
            gameState.currentRound++;
            
            if (gameState.currentRound < gameState.totalRounds) {
              showCountdown(() => startNewRound());
            } else {
              startNewRound(); // This will trigger endGame()
            }
          };
        }

        // Auto-start the round immediately - no button needed
        setTimeout(() => {
          answerBtns.forEach(btn => btn.disabled = false);
          renderDots();

          intervalId = setInterval(() => {
            if (gameEnded) return;
            if (dotsCount >= 500) {
              stopGame();
              return;
            }
            dotsCount += 2;
            outline.setDots(dotsCount);
            renderDots();
          }, 200); // 1/5 second = 200ms
        }, 100); // Small delay to ensure DOM is ready

        // Answer buttons logic
        answerBtns.forEach(btn => {
          btn.onclick = () => {
            stopGame();
            const wasCorrect = btn.dataset.correct === "1";
            if (wasCorrect) {
              showPopup(`🎉 Correct! +${points} points`, true);
            } else {
              showPopup(`❌ Wrong! The answer was "${currentGameData.object}" - 0 points`, false);
            }
          };
        });
      });
  }

  if (gameState.playerName) {
    startNewRound();
  }
}

function generateRandomName() {
  const adjectives = ['Quick', 'Smart', 'Sharp', 'Fast', 'Clever', 'Bright', 'Swift', 'Keen', 'Alert', 'Wise'];
  const nouns = ['Eagle', 'Tiger', 'Fox', 'Hawk', 'Wolf', 'Lion', 'Falcon', 'Panther', 'Cheetah', 'Bear'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj}${noun}`;
}

function showCountdown(callback) {
  const countdownOverlay = document.getElementById('countdown-overlay');
  const countdownNumber = document.getElementById('countdown-number');
  const countdownText = document.querySelector('.countdown-text');
  
  countdownOverlay.classList.remove('hidden');
  
  // Update text based on round
  if (gameState.currentRound === 0) {
    countdownText.textContent = 'Get ready to play!';
  } else {
    countdownText.textContent = `Round ${gameState.currentRound + 1} starting...`;
  }
  
  let count = 3;
  countdownNumber.textContent = count;
  countdownNumber.style.animation = 'none';
  
  const timer = setInterval(() => {
    count--;
    if (count > 0) {
      countdownNumber.textContent = count;
      countdownNumber.style.animation = 'none';
      setTimeout(() => {
        countdownNumber.style.animation = 'countdownPulse 1s ease-in-out';
      }, 10);
    } else {
      countdownOverlay.classList.add('hidden');
      clearInterval(timer);
      callback();
    }
  }, 1000);
  
  // Start animation for first number
  setTimeout(() => {
    countdownNumber.style.animation = 'countdownPulse 1s ease-in-out';
  }, 10);
}

function saveScore(name, score) {
  let scores = [];
  try {
    const saved = localStorage.getItem('prixelsScores');
    scores = saved ? JSON.parse(saved) : [];
  } catch (e) {
    scores = [];
  }

  scores.push({
    name: name,
    score: score,
    date: new Date().toISOString().split('T')[0]
  });

  // Keep only top 10 scores
  scores.sort((a, b) => b.score - a.score);
  scores = scores.slice(0, 10);

  localStorage.setItem('prixelsScores', JSON.stringify(scores));
  return scores;
}

function getTopScores() {
  try {
    const saved = localStorage.getItem('prixelsScores');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

function endGame() {
  const finalScore = gameState.sessionScore;
  const topScores = saveScore(gameState.playerName, finalScore);
  const playerRank = topScores.findIndex(s => s.name === gameState.playerName && s.score === finalScore) + 1;
  
  const endgameOverlay = document.getElementById('endgame-overlay');
  const endgameMessage = document.getElementById('endgame-message');
  const endgameStats = document.getElementById('endgame-stats');
  const mainMenuBtn = document.getElementById('main-menu-btn');

  let message = '';
  if (playerRank <= 3) {
    message = `🏆 AMAZING! You're #${playerRank} on the leaderboard! 🏆`;
  } else if (playerRank <= 10) {
    message = `🎉 Great job! You made it to the top 10! (#${playerRank}) 🎉`;
  } else if (finalScore > 3000) {
    message = `👍 Not bad, ${gameState.playerName}! You've got potential!`;
  } else if (finalScore > 1500) {
    message = `😅 ${gameState.playerName}, are you even trying? That was... something.`;
  } else {
    message = `😂 Oh ${gameState.playerName}... maybe stick to easier games? Just kidding!`;
  }

  endgameMessage.textContent = message;
  endgameStats.innerHTML = `
    <div><strong>Final Score:</strong> ${finalScore} points</div>
    <div><strong>Rounds Completed:</strong> ${gameState.totalRounds}</div>
    <div><strong>Your Rank:</strong> #${playerRank} of ${topScores.length}</div>
  `;

  mainMenuBtn.onclick = () => {
    // Reset game state
    gameState = {
      currentRound: 0,
      totalRounds: 5,
      sessionScore: 0,
      playerName: '',
      gameData: []
    };
    // Go back to welcome screen
    import('./WelcomeScreen.js').then(module => {
      module.renderWelcomeScreen();
    });
  };

  endgameOverlay.classList.remove('hidden');
}