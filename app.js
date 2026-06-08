// Muskan Jain - Portfolio Interaction Logic

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroCanvas();
  initTerminal();
  initQuantDashboard();
  initSkillsFilter();
  initScrollReveal();
});

/* =========================================================================
   1. Navigation & Mobile Menu
   ========================================================================= */
function initNavbar() {
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  // Sticky Scroll Class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      // Simple toggle animation for menu bars
      const spans = menuToggle.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.querySelectorAll('span').forEach(s => s.style.transform = 'none');
        menuToggle.querySelector('span:nth-child(2)').style.opacity = '1';
      });
    });
  }
}

/* =========================================================================
   2. Canvas Background Particle Web
   ========================================================================= */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = canvas.offsetWidth;
  let height = canvas.height = canvas.offsetHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });

  const particles = [];
  const maxParticles = 40;

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 245, 245, 0.25)';
      ctx.fill();
    }
  }

  // Populate particles
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Subtle Grid background overlay
    ctx.strokeStyle = 'rgba(0, 245, 245, 0.02)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw connection lines
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.strokeStyle = `rgba(180, 80, 255, ${0.15 * (1 - dist / 120)})`;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* =========================================================================
   3. Interactive Developer Terminal CLI
   ========================================================================= */
function initTerminal() {
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');
  const inputLine = document.getElementById('terminal-input-line');

  if (!terminalInput) return;

  // Keep focus in input when clicking inside terminal
  terminalBody.addEventListener('click', () => {
    terminalInput.focus();
  });

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = terminalInput.value.trim().toLowerCase();
      processCommand(command);
      terminalInput.value = '';
    }
  });

  function processCommand(cmd) {
    // Write the entered command to terminal output
    appendLine(`$ ${cmd}`, 'terminal-prompt');

    if (!cmd) return;

    let output = '';
    let colorClass = 'terminal-output';

    switch (cmd) {
      case 'help':
        output = `Available commands:<br>
  - <strong style="color: var(--accent-cyan);">about</strong>: Summarizes my core background<br>
  - <strong style="color: var(--accent-cyan);">skills</strong>: Lists primary technology stacks<br>
  - <strong style="color: var(--accent-cyan);">backtest</strong>: Runs current quant strategy simulation<br>
  - <strong style="color: var(--accent-cyan);">contact</strong>: Shows contact channels<br>
  - <strong style="color: var(--accent-cyan);">clear</strong>: Flushes the screen buffer`;
        break;

      case 'about':
        output = `Muskan Jain is a Data Analyst & Software Engineer with 1.5+ years of experience specialized in building pipelines, data parsing solutions, and algorithmic trading systems (MQL4/MQL5 & Python).`;
        break;

      case 'skills':
        output = `Core Skills: Python, SQL, C++, MQL4/5, Pandas, NumPy, Power BI, FastAPI, Streamlit, MongoDB.`;
        colorClass = 'accent-cyan';
        break;

      case 'backtest':
        output = `Starting backtest simulation request. Triggering Quant Dashboard Engine below...`;
        colorClass = 'accent-green';
        // Proactively trigger the quant backtest
        const runBtn = document.getElementById('run-backtest-btn');
        if (runBtn && !runBtn.classList.contains('running')) {
          runBtn.click();
        }
        break;

      case 'contact':
        output = `Direct Communication Channels:<br>
  - Email: muskanjain6264@gmail.com<br>
  - Phone: +91 6268451652<br>
  - LinkedIn & HackerRank buttons are available in the Footer section.`;
        break;

      case 'clear':
        // Clear terminal lines except input line
        const lines = terminalBody.querySelectorAll('.terminal-line');
        lines.forEach(l => l.remove());
        return;

      default:
        output = `Command not recognized: '${cmd}'. Type 'help' to see list of valid commands.`;
        colorClass = 'text-muted';
    }

    appendLine(output, colorClass);
  }

  function appendLine(text, className) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    if (className === 'terminal-prompt') {
      line.innerHTML = `<span class="terminal-prompt">$</span>${text.substring(2)}`;
    } else {
      line.style.color = className === 'accent-cyan' ? 'var(--accent-cyan)' : className === 'accent-green' ? 'var(--accent-green)' : className === 'text-muted' ? 'var(--text-muted)' : 'var(--text-secondary)';
      line.innerHTML = text;
    }
    terminalBody.insertBefore(line, inputLine);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }
}

/* =========================================================================
   4. Quant Backtesting Simulator Dashboard
   ========================================================================= */
function initQuantDashboard() {
  const canvas = document.getElementById('chart-canvas');
  const runBtn = document.getElementById('run-backtest-btn');
  const strategySelector = document.getElementById('strategy-selector');
  const consoleEl = document.getElementById('status-console');
  const watermark = document.getElementById('chart-watermark');
  
  // Metric elements
  const elStatus = document.getElementById('engine-status');
  const elWinRate = document.getElementById('metric-win-rate');
  const elProfit = document.getElementById('metric-profit-factor');
  const elDrawdown = document.getElementById('metric-drawdown');

  if (!canvas || !runBtn) return;
  const ctx = canvas.getContext('2d');
  
  let animationId = null;
  let isRunning = false;

  // Match canvas dimensions to container layout
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawGrid();
  }
  
  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 200);

  function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(0, 245, 245, 0.03)';
    ctx.lineWidth = 1;
    
    // Draw horizontal grid lines
    for (let y = 30; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    // Draw vertical grid lines
    for (let x = 40; x < canvas.width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
  }

  // Strategy Configurations & Outputs
  const strategies = {
    ema: {
      name: "Dual EMA Crossover strategy (MQL5)",
      winRate: 68.2,
      profitFactor: 2.15,
      drawdown: 8.4,
      points: [110, 105, 120, 115, 130, 122, 145, 138, 155, 150, 170, 162, 185],
      logs: [
        "Initializing MT5 Terminal Gateway connectivity...",
        "Loading H1 currency ticks for EURUSD...",
        "Strategy metrics set: Fast EMA = 9, Slow EMA = 21",
        "Fast EMA crossed above Slow EMA: BUY EURUSD at 1.0845",
        "Trailing stop calculated at 1.0820",
        "Position closed: profit booked at 1.0910 (+65 pips)",
        "Fast EMA crossed below Slow EMA: SELL EURUSD at 1.0890",
        "Trailing stop hit: position exited at 1.0895 (-5 pips)"
      ]
    },
    vol: {
      name: "Options Volatility Arbitrage",
      winRate: 74.5,
      profitFactor: 2.64,
      drawdown: 5.1,
      points: [140, 142, 135, 138, 144, 150, 146, 158, 162, 168, 164, 172, 180],
      logs: [
        "Pulling implied volatility index parameters...",
        "Calculating delta-neutral dispersion margins...",
        "Volatility skew detected in Nifty near-month puts",
        "Order routed: Short volatility spread initiated",
        "Vega hedge adjusted: balancing delta neutral constraints",
        "Time decay optimized: premium booking initiated",
        "Strategy matched boundaries: all spreads closed with net profit"
      ]
    },
    trend: {
      name: "Trending Sector Breakout (10Y Stock Data)",
      winRate: 61.8,
      profitFactor: 1.89,
      drawdown: 12.3,
      points: [90, 85, 95, 110, 105, 125, 120, 145, 135, 150, 168, 158, 175],
      logs: [
        "Analyzing 10 years of historical stock sector assets...",
        "Filtering Top Sectors: Energy & IT breakout channels...",
        "Breakout pattern recognized above 200-day Simple Moving Average",
        "Executing BUY order on leading equities",
        "Market pullback detected; maintaining dynamic stop-losses",
        "Profit-target triggered on sector strength",
        "Consolidation pattern detected; strategy successfully exited positions"
      ]
    }
  };

  runBtn.addEventListener('click', () => {
    if (isRunning) return;
    
    isRunning = true;
    runBtn.classList.add('running');
    runBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="animation: spin 1s linear infinite;"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
      Processing...
    `;
    
    watermark.style.display = 'none';
    elStatus.textContent = 'EXECUTING';
    elStatus.style.color = 'var(--accent-purple)';
    
    // Clear logs
    consoleEl.innerHTML = '';
    
    // Get strategy details
    const stratKey = strategySelector.value;
    const strat = strategies[stratKey];
    
    // Reset Metric display values
    elWinRate.textContent = '--%';
    elProfit.textContent = '--';
    elDrawdown.textContent = '--%';
    
    let step = 0;
    let logIndex = 0;
    const maxSteps = strat.points.length;
    const renderedCandles = [];
    
    // Custom Candlestick Simulation Animation
    function animateBacktest() {
      if (step >= maxSteps) {
        // Simulation finished
        isRunning = false;
        runBtn.classList.remove('running');
        runBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          Run Backtest
        `;
        elStatus.textContent = 'COMPLETE';
        elStatus.style.color = 'var(--accent-green)';
        
        // Populate final metrics
        animateNumber(elWinRate, 0, strat.winRate, '%');
        animateNumber(elProfit, 0, strat.profitFactor, '');
        animateNumber(elDrawdown, 0, strat.drawdown, '%');
        
        logToConsole(`[System] Backtest for ${strat.name} finished successfully.`);
        return;
      }
      
      drawGrid();
      
      // Calculate candlestick positions dynamically
      const xDistance = canvas.width / (maxSteps + 1);
      const startPrice = strat.points[step];
      const endPrice = step + 1 < maxSteps ? strat.points[step + 1] : startPrice + (Math.random() - 0.4) * 10;
      
      const open = startPrice;
      const close = endPrice;
      const high = Math.max(open, close) + Math.random() * 8;
      const low = Math.min(open, close) - Math.random() * 8;
      
      renderedCandles.push({
        x: xDistance * (step + 1),
        open,
        close,
        high,
        low
      });
      
      // Draw all rendered candles up to current step
      renderedCandles.forEach(candle => {
        const cX = candle.x;
        // Map prices to Y axis heights (inverted canvas coordinates)
        const scale = 1.2;
        const offset = 40;
        const cOpen = canvas.height - (candle.open * scale) + offset;
        const cClose = canvas.height - (candle.close * scale) + offset;
        const cHigh = canvas.height - (candle.high * scale) + offset;
        const cLow = canvas.height - (candle.low * scale) + offset;
        
        const isBullish = candle.close >= candle.open;
        const color = isBullish ? 'var(--accent-green)' : 'var(--accent-red)';
        
        // Wick line
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cX, cHigh);
        ctx.lineTo(cX, cLow);
        ctx.stroke();
        
        // Body candle
        ctx.fillStyle = color;
        const bodyHeight = Math.abs(cClose - cOpen) || 2;
        ctx.beginPath();
        ctx.rect(cX - 6, Math.min(cOpen, cClose), 12, bodyHeight);
        ctx.fill();
        
        // Neon Glow effect on candles
        ctx.shadowBlur = 4;
        ctx.shadowColor = color;
        ctx.rect(cX - 6, Math.min(cOpen, cClose), 12, bodyHeight);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });
      
      // Append strategy console logs progressively
      if (logIndex < strat.logs.length && Math.random() > 0.4) {
        logToConsole(`[Engine] ${strat.logs[logIndex]}`);
        logIndex++;
      }
      
      step++;
      setTimeout(animateBacktest, 250); // Frame duration 250ms
    }
    
    animateBacktest();
  });

  function logToConsole(msg) {
    const div = document.createElement('div');
    div.textContent = msg;
    consoleEl.appendChild(div);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }

  // Visual count-up logic for numbers
  function animateNumber(element, start, end, suffix) {
    let current = start;
    const range = end - start;
    const duration = 800; // ms
    const increment = range / (duration / 16);
    
    function step() {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        element.textContent = end + suffix;
      } else {
        element.textContent = current.toFixed(1) + suffix;
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }
}

/* =========================================================================
   5. Interactive Skill filterable Grid
   ========================================================================= */
function initSkillsFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.skill-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button selection states
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          // Force reflow and add opacity animation
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.95)';
          // Hide after transition duration
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* =========================================================================
   6. Scroll Reveal Observer
   ========================================================================= */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once item is visible, do not track it anymore to optimize performance
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));
}
