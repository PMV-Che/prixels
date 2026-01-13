import { PixelOutline } from './PixelOutline.js';

export function renderGameScreen() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="game-screen">
      <header class="prixels-header">
        <span class="prixels-title">Prixles</span>
        <span class="prixels-subtitle">Find the hidden picture</span>
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
          <span>Points: <span id="score">1000</span></span>
          <span>Time: <span id="timer">30</span>s</span>
        </div>
        <div id="answers-area" style="width: 80%; display: grid; grid-template-columns: 1fr 1fr; gap: 0.7em;">
          <button class="answer-btn" style="padding: 1em; font-size: 1.1em; border-radius: 8px; border: 1px solid #ccc;">Option 1</button>
          <button class="answer-btn" style="padding: 1em; font-size: 1.1em; border-radius: 8px; border: 1px solid #ccc;">Option 2</button>
          <button class="answer-btn" style="padding: 1em; font-size: 1.1em; border-radius: 8px; border: 1px solid #ccc;">Option 3</button>
          <button class="answer-btn" style="padding: 1em; font-size: 1.1em; border-radius: 8px; border: 1px solid #ccc;">Option 4</button>
        </div>
      </section>
      <div id="popup-overlay" class="popup-overlay hidden">
        <div id="popup-modal" class="popup-modal taller-modal">
          <div id="popup-message" class="popup-message"></div>
          <img id="popup-image" class="popup-image" style="display:none; margin: 1.5em auto 0 auto; max-width: 180px; max-height: 180px;" />
          <button id="play-again-btn" class="play-again-btn">Play Again</button>
        </div>
      </div>
    </div>
  `;

  let intervalId = null;
  let dotsCount = 5;
  let points = 1000; // Start with 1000 points
  let gameEnded = false;
  let outline = null;
  let rightAnswerFile = null;

  // Disable answer buttons until game starts
  const answersArea = document.getElementById('answers-area');
  const answerBtns = Array.from(answersArea.children);
  answerBtns.forEach(btn => btn.disabled = true);

  // Load the JSON metadata and pick a random SVG
  fetch(`./src/static/examples/examples_metadata_v1.json?${Date.now()}`) // Add cache buster
    .then(response => response.json())
    .then(json => {
      const randomEntry = json[Math.floor(Math.random() * json.length)];
      const svgFile = randomEntry.file;
      rightAnswerFile = svgFile;

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

      const pixelsArea = document.getElementById('pixels-area');
      const startBtn = document.getElementById('start-dots-btn');
      const popupOverlay = document.getElementById('popup-overlay');
      const popupMessage = document.getElementById('popup-message');
      const playAgainBtn = document.getElementById('play-again-btn');
      const popupImage = document.getElementById('popup-image');
      const scoreSpan = document.getElementById('score');

      popupOverlay.classList.add('hidden'); // Hide by default

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

        pixelsArea.innerHTML = "";
        pixelsArea.appendChild(svg);

        // Points decrease by 10 for each new dot added after the initial 5
        points = Math.max(0, 1000 - 10 * (dotsCount - 5));
        scoreSpan.textContent = points;
      }

      function stopGame() {
        if (intervalId) clearInterval(intervalId);
        gameEnded = true;
      }

      // Show popup
      function showPopup(message) {
        popupMessage.textContent = message;
        // Show the SVG image for the right answer
        popupImage.src = `./src/static/examples/${rightAnswerFile}`;
        popupImage.style.display = 'block';
        popupOverlay.classList.remove('hidden');
      }

      // Hide popup and restart game
      playAgainBtn.onclick = () => {
        popupOverlay.classList.add('hidden');
        renderGameScreen();
      };

      // Start button logic
      startBtn.onclick = () => {
        startBtn.style.display = 'none';
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
      };

      // Answer buttons logic
      answerBtns.forEach(btn => {
        btn.onclick = () => {
          stopGame();
          if (btn.dataset.correct === "1") {
            showPopup("You are right!");
          } else {
            showPopup("Wrong");
          }
        };
      });
    });
}