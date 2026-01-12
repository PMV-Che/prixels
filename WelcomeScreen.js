import { renderGameScreen } from './GameScreen.js';

export function renderWelcomeScreen() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="welcome-screen">
      <img src="../src/static/images/logo.png" alt="Prixels Logo" class="prixels-logo" />
      <h1 class="prixels-title">Prixels</h1>
      <div class="prixels-subtitle">Find the hidden picture as fast as you can</div>
      <button id="start-btn" class="start-btn">Start</button>
      <div class="made-by">made by Pablo</div>
    </div>
    <style>
      body {
        background: #1e3557; /* Elegant deep blue */
        margin: 0;
        font-family: 'Segoe UI', 'Arial', sans-serif;
      }
      .welcome-screen {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #1e3557;
        position: relative;
      }
      .prixels-logo {
        max-width: 300px;
        width: 80%;
        margin-bottom: 1.5em;
        animation: fadeIn 2s ease-out;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .prixels-title {
        font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
        font-size: 4em;
        color: orange;
        letter-spacing: 0.08em;
        text-shadow: 0 4px 24px #ff9800, 0 1px 0 #fff, 0 0 8px #ff9800;
        margin-bottom: 0.7em;
        transform: rotate(-8deg);
        animation: tiltLoop 5s cubic-bezier(.68,-0.55,.27,1.55) infinite alternate;
      }
      @keyframes tiltLoop {
        0% { transform: rotate(-8deg) scale(1); }
        50% { transform: rotate(8deg) scale(1.05);}
        100% { transform: rotate(-8deg) scale(1);}
      }
      .prixels-subtitle {
        font-family: 'Segoe UI', 'Arial', sans-serif;
        font-size: 1.5em;
        color: #ffe0b2;
        margin-bottom: 1.5em;
        opacity: 0.9;
        text-align: center;
        padding: 0 1em;
      }
      .start-btn {
        padding: 1.2em 3em;
        font-size: 1.7em;
        border-radius: 16px;
        border: none;
        background: linear-gradient(90deg, orange 60%, #ffb300 100%);
        color: #fff;
        font-weight: bold;
        box-shadow: 0 4px 24px #ff9800a0;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        animation: pulseBtn 1.5s infinite alternate;
      }
      .start-btn:hover {
        transform: scale(1.08);
        box-shadow: 0 8px 32px #ff9800c0;
        background: linear-gradient(90deg, #ffb300 0%, orange 100%);
      }
      @keyframes pulseBtn {
        0% { box-shadow: 0 4px 24px #ff9800a0; }
        100% { box-shadow: 0 8px 32px #ff9800c0; }
      }
      .made-by {
        position: absolute;
        bottom: 24px;
        left: 0;
        width: 100%;
        text-align: center;
        font-size: 1.05em;
        color: #ffe0b2;
        opacity: 0.85;
        letter-spacing: 0.12em;
        font-family: 'Fira Mono', 'Menlo', 'Monaco', 'monospace';
        font-style: italic;
      }
    </style>
  `;
  document.getElementById('start-btn').onclick = renderGameScreen;
}

// Only call this if this is the entry point
window.onload = renderWelcomeScreen;