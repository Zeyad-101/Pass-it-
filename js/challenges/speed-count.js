import { escapeHtml } from '../ui.js';

// Mini speed challenges — tap a button as many times as possible, or count items
const MODES = [
  {
    id: 'taps',
    label: 'TAP FRENZY \uD83D\uDC46',
    accent: 'accent-coral',
    instruction: 'Tap the button as many times as you can in 10 seconds!',
    time: 10,
    scoreFormula: (count) => Math.min(50, Math.floor(count / 2)),
    summaryFn: (count, pts) => `${count} taps! +${pts} pts`,
    resultFn: (count) => `You tapped ${count} times!`,
  },
  {
    id: 'countdown',
    label: 'COUNTDOWN \u23F3',
    accent: 'accent-sun',
    instruction: 'Tap STOP when you think exactly 10 seconds have passed. No counting — just feel it!',
    time: null,
    scoreFormula: (diff) => Math.max(0, 20 - Math.floor(diff / 200) * 2),
    summaryFn: (diff, pts) => `Off by ${(diff / 1000).toFixed(2)}s! +${pts} pts`,
    resultFn: (diff) => `You were ${(diff / 1000).toFixed(2)}s off!`,
  },
  {
    id: 'double-tap',
    label: 'DOUBLE TAP \u26A1',
    accent: 'accent-grass',
    instruction: 'Double-tap the button as many times as you can in 8 seconds!',
    time: 8,
    scoreFormula: (count) => Math.min(45, count * 4),
    summaryFn: (count, pts) => `${count} double-taps! +${pts} pts`,
    resultFn: (count) => `You double-tapped ${count} times!`,
  },
];

function mount(container, player, onComplete) {
  const mode = MODES[Math.floor(Math.random() * MODES.length)];
  let finished = false;

  container.innerHTML = `
    <div class="screen ${escapeHtml(mode.accent)}">
      <p style="color:var(--accent); font-weight:bold; font-size:1rem; margin-bottom:4px;">${mode.label}</p>
      <h2 style="margin:0 0 10px;">${escapeHtml(player.name)}</h2>
      <p style="font-size:1.05rem; line-height:1.4; margin:0 0 20px;">${escapeHtml(mode.instruction)}</p>
      <button class="btn primary" id="start-btn" style="font-size:1.3rem; padding:20px 32px;">Ready? GO!</button>
    </div>
  `;

  container.querySelector('#start-btn').addEventListener('click', () => {
    if (mode.id === 'taps') runTapFrenzy(mode);
    else if (mode.id === 'countdown') runCountdown(mode);
    else if (mode.id === 'double-tap') runDoubleTap(mode);
  });

  function runTapFrenzy(m) {
    let count = 0;
    let timeLeft = m.time;
    let timerInterval;
    let started = Date.now();

    container.innerHTML = `
      <div class="screen ${escapeHtml(m.accent)}">
        <div style="width:100%; background:var(--ink); border-radius:8px; height:12px; margin-bottom:10px;">
          <div id="tbar" style="height:12px; border-radius:8px; background:var(--accent); width:100%; transition:width ${m.time}s linear;"></div>
        </div>
        <p id="tleft" style="font-size:1rem; color:var(--text-dim); margin:0 0 8px;">\u23F1 ${timeLeft}s</p>
        <p id="tap-count" style="font-size:4rem; font-weight:900; margin:0 0 14px; color:var(--sun);">0</p>
        <button id="tap-btn" class="btn primary" style="font-size:1.6rem; padding:30px 50px; user-select:none;">TAP!</button>
      </div>
    `;

    requestAnimationFrame(() => requestAnimationFrame(() => {
      const bar = container.querySelector('#tbar');
      if (bar) bar.style.width = '0%';
    }));

    navigator?.vibrate?.(30);
    timerInterval = setInterval(() => {
      timeLeft--;
      const tl = container.querySelector('#tleft');
      if (tl) tl.textContent = `\u23F1 ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        const btn = container.querySelector('#tap-btn');
        if (btn) btn.disabled = true;
        finishGame(m, count);
      }
    }, 1000);

    container.querySelector('#tap-btn').addEventListener('click', () => {
      count++;
      navigator?.vibrate?.(10);
      const tc = container.querySelector('#tap-count');
      if (tc) tc.textContent = count;
    });
  }

  function runCountdown(m) {
    const startTime = performance.now();
    const TARGET = 10000; // 10 seconds
    let clicked = false;

    container.innerHTML = `
      <div class="screen ${escapeHtml(m.accent)}">
        <p style="font-size:1.1rem; margin:0 0 20px; line-height:1.4;">Tap <strong>STOP</strong> when you think exactly<br><span style="font-size:2.5rem; font-weight:900; color:var(--sun);">10 seconds</span><br>have passed!</p>
        <p style="color:var(--text-dim); font-size:0.9rem; margin:0 0 20px;">No counting. Just feel it. \uD83E\uDDD8</p>
        <button id="stop-btn" class="btn primary" style="font-size:1.5rem; padding:28px 48px;">\u23F9\uFE0F STOP</button>
      </div>
    `;
    navigator?.vibrate?.(30);
    container.querySelector('#stop-btn').addEventListener('click', () => {
      if (clicked) return; clicked = true;
      const elapsed = performance.now() - startTime;
      const diff = Math.abs(elapsed - TARGET);
      finishGame(m, diff);
    });
  }

  function runDoubleTap(m) {
    let count = 0;
    let timeLeft = m.time;
    let timerInterval;
    let lastTap = 0;
    const DOUBLE_TAP_GAP = 400; // ms

    container.innerHTML = `
      <div class="screen ${escapeHtml(m.accent)}">
        <div style="width:100%; background:var(--ink); border-radius:8px; height:12px; margin-bottom:10px;">
          <div id="tbar" style="height:12px; border-radius:8px; background:var(--accent); width:100%; transition:width ${m.time}s linear;"></div>
        </div>
        <p id="tleft" style="font-size:1rem; color:var(--text-dim); margin:0 0 8px;">\u23F1 ${timeLeft}s</p>
        <p id="dt-count" style="font-size:4rem; font-weight:900; margin:0 0 6px; color:var(--sun);">0</p>
        <p style="color:var(--text-dim); font-size:0.85rem; margin:0 0 12px;">double taps</p>
        <button id="dt-btn" class="btn primary" style="font-size:1.5rem; padding:30px 50px; user-select:none;">\u26A1 DOUBLE TAP \u26A1</button>
      </div>
    `;

    requestAnimationFrame(() => requestAnimationFrame(() => {
      const bar = container.querySelector('#tbar');
      if (bar) bar.style.width = '0%';
    }));

    navigator?.vibrate?.(30);
    timerInterval = setInterval(() => {
      timeLeft--;
      const tl = container.querySelector('#tleft');
      if (tl) tl.textContent = `\u23F1 ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        const btn = container.querySelector('#dt-btn');
        if (btn) btn.disabled = true;
        finishGame(m, count);
      }
    }, 1000);

    container.querySelector('#dt-btn').addEventListener('click', () => {
      const now = performance.now();
      if (lastTap && (now - lastTap) <= DOUBLE_TAP_GAP) {
        count++;
        navigator?.vibrate?.(30);
        const dc = container.querySelector('#dt-count');
        if (dc) {
          dc.textContent = count;
          dc.style.transform = 'scale(1.3)';
          setTimeout(() => { dc.style.transform = 'scale(1)'; }, 150);
        }
        lastTap = 0;
      } else {
        lastTap = now;
      }
    });
  }

  function finishGame(m, rawValue) {
    if (finished) return;
    finished = true;
    const pts = m.scoreFormula(rawValue);
    navigator?.vibrate?.(pts > 10 ? [40, 40, 40] : [60, 30, 60]);

    container.innerHTML = `
      <div class="screen ${escapeHtml(m.accent)}">
        <p style="font-size:2.5rem; margin:0;">${pts >= 30 ? '\uD83D\uDD25' : pts >= 15 ? '\uD83D\uDC4F' : '\uD83D\uDE05'}</p>
        <h2 style="margin:8px 0;">${m.resultFn(rawValue)}</h2>
        <p style="font-size:1.4rem; margin:8px 0;">+${pts} pts</p>
      </div>
    `;

    setTimeout(() => {
      onComplete(pts, {
        type: 'speed-count',
        mode: m.id,
        rawValue,
        summary: m.summaryFn(rawValue, pts)
      });
    }, 1400);
  }
}

export default { id: 'speed-count', mount };
