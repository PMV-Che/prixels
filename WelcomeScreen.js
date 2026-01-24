import { renderGameScreen } from './GameScreen.js';

export function renderWelcomeScreen() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="welcome-screen">
      <img src="./src/static/images/logo.png" alt="Prixels Logo" class="prixels-logo" />
      <h1 class="prixels-title">PRIXELS</h1>
      <div class="prixels-subtitle">🎯 Find the hidden picture as fast as you can! 🎯</div>
      <button id="start-btn" class="start-btn">🎮 START GAME 🎮</button>
      <div class="made-by">⚡ made by Pablo ⚡</div>
    </div>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
      
      body {
        background: linear-gradient(45deg, #0f172a 0%, #1e293b 50%, #334155 100%);
        margin: 0;
        font-family: 'Press Start 2P', monospace;
        overflow: hidden;
      }
      
      .welcome-screen {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: radial-gradient(circle at 50% 50%, rgba(255, 107, 53, 0.1) 0%, transparent 70%), 
                   linear-gradient(45deg, #0f172a 0%, #1e293b 50%, #334155 100%);
        position: relative;
        padding: 2rem;
        box-sizing: border-box;
      }
      .prixels-logo {
        max-width: 280px;
        width: 70%;
        margin-bottom: 2rem;
        animation: logoFloat 3s ease-in-out infinite alternate;
        filter: drop-shadow(0 0 20px rgba(255, 107, 53, 0.5));
      }
      
      @keyframes logoFloat {
        from { transform: translateY(0px) rotate(-2deg); }
        to { transform: translateY(-10px) rotate(2deg); }
      }
      
      .prixels-title {
        font-family: 'Press Start 2P', monospace;
        font-size: 3rem;
        background: linear-gradient(45deg, #ff6b35 0%, #ffa552 25%, #ff6b35 50%, #ffa552 75%, #ff6b35 100%);
        background-size: 200% 200%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: 0.1em;
        text-shadow: 4px 4px 0px rgba(0,0,0,0.8);
        margin-bottom: 1.5rem;
        animation: titleGlow 2s ease-in-out infinite alternate, gradientShift 3s linear infinite;
        text-align: center;
        line-height: 1.2;
      }
      
      @keyframes titleGlow {
        from { filter: drop-shadow(0 0 5px rgba(255, 107, 53, 0.8)); }
        to { filter: drop-shadow(0 0 25px rgba(255, 107, 53, 1)); }
      }
      
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .prixels-subtitle {
        font-family: 'Orbitron', monospace;
        font-size: 1.1rem;
        color: #94a3b8;
        margin-bottom: 2.5rem;
        text-align: center;
        padding: 0 1rem;
        font-weight: 400;
        letter-spacing: 0.05em;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        animation: subtitlePulse 4s ease-in-out infinite;
      }
      
      @keyframes subtitlePulse {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
      }
      
      .start-btn {
        font-family: 'Press Start 2P', monospace;
        padding: 1.5rem 3rem;
        font-size: 1rem;
        border-radius: 0;
        border: 4px solid #ff6b35;
        background: linear-gradient(45deg, #ff6b35 0%, #ffa552 50%, #ff6b35 100%);
        color: #0f172a;
        font-weight: normal;
        cursor: pointer;
        transition: all 0.3s ease;
        text-shadow: none;
        box-shadow: 
          0 0 0 2px #0f172a,
          0 0 0 6px #ff6b35,
          0 8px 15px rgba(255, 107, 53, 0.4),
          inset 0 2px 0 rgba(255,255,255,0.3);
        position: relative;
        letter-spacing: 0.1em;
        animation: buttonGlow 2s ease-in-out infinite alternate;
      }
      .start-btn:hover {
        background: linear-gradient(45deg, #ffa552 0%, #ff6b35 50%, #ffa552 100%);
        transform: translateY(-4px);
        box-shadow: 
          0 0 0 2px #0f172a,
          0 0 0 6px #ffa552,
          0 12px 20px rgba(255, 107, 53, 0.6),
          inset 0 2px 0 rgba(255,255,255,0.3);
      }
      
      .start-btn:active {
        transform: translateY(-1px);
      }
      
      @keyframes buttonGlow {
        from { filter: drop-shadow(0 0 5px rgba(255, 107, 53, 0.5)); }
        to { filter: drop-shadow(0 0 15px rgba(255, 107, 53, 0.8)); }
      }
      
      .made-by {
        position: absolute;
        bottom: 2rem;
        left: 0;
        width: 100%;
        text-align: center;
        font-family: 'Press Start 2P', monospace;
        font-size: 0.7rem;
        color: #64748b;
        letter-spacing: 0.1em;
        animation: footerBlink 3s ease-in-out infinite;
      }
      
      @keyframes footerBlink {
        0%, 90%, 100% { opacity: 0.7; }
        95% { opacity: 1; }
      }
      
      /* Mobile Responsiveness */
      @media (max-width: 480px) {
        .prixels-title {
          font-size: 2rem;
          line-height: 1.3;
        }
        
        .prixels-subtitle {
          font-size: 0.9rem;
          margin-bottom: 2rem;
        }
        
        .start-btn {
          font-size: 0.8rem;
          padding: 1.2rem 2rem;
        }
        
        .made-by {
          font-size: 0.6rem;
        }
      }
    </style>
  `;
  document.getElementById('start-btn').onclick = renderGameScreen;
}

// Only call this if this is the entry point
window.onload = renderWelcomeScreen;