import { escapeHtml } from '../ui.js';

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion(difficulty) {
  if (difficulty === 'easy') {
    const a = randInt(2, 15), b = randInt(2, 15);
    const op = ['+', '-'][randInt(0, 1)];
    const ans = op === '+' ? a + b : a - b;
    return { q: `${a} ${op} ${b}`, ans };
  }
  if (difficulty === 'medium') {
    const ops = ['+', '-', 'x'];
    const op = ops[randInt(0, 2)];
    if (op === 'x') {
      const a = randInt(2, 12), b = randInt(2, 12);
      return { q: `${a} x ${b}`, ans: a * b };
    }
    const a = randInt(10, 50), b = randInt(5, 30);
    return { q: `${a} ${op} ${b}`, ans: op === '+' ? a + b : a - b };
  }
  // hard
  const ops = ['x', '+'];
  const a = randInt(7, 20), b = randInt(7, 20), c = randInt(2, 9);
  const op = ops[randInt(0, 1)];
  const ans = op === 'x' ? a * b + c : a + b * c;
  const q = op === 'x' ? `${a} x ${b} + ${c}` : `${a} + ${b} x ${c}`;
  return { q, ans };
}

function fakeAnswers(correct, difficulty) {
  const fakes = new Set();
  while (fakes.size < 3) {
    const delta = difficulty === 'easy' ? randInt(1, 8) : randInt(1, 15);
    const fake = correct + (Math.random() < 0.5 ? delta : -delta);
    if (fake !== correct && !fakes.has(fake)) fakes.add(fake);
  }
  const options = [...fakes, correct].sort(() => Math.random() - 0.5);
  return options;
}

function mount(container, player, onComplete) {
  const difficulties = ['easy', 'medium', 'hard'];
  const TIME = 8;
  const ROUNDS = 5;
  let round = 0;
  let totalPts = 0;
  let finished = false;

  function nextRound() {
    if (round >= ROUNDS) { done(); return; }
    const diff = difficulties[Math.min(round >= 3 ? 2 : round >= 1 ? 1 : 0, 2)];
    const { q, ans } = generateQuestion(diff);
    const options = fakeAnswers(ans, diff);
    let timeLeft = TIME;
    let answered = false;
    let timerInterval;

    container.innerHTML = `
      <div class="screen accent-grass">
        <p style="color:var(--accent); font-weight:bold; font-size:1rem; margin-bottom:4px;">MATH BLITZ \u26A1 (${round+1}/${ROUNDS})</p>
        <p style="color:var(--text-dim); font-size:0.8rem; margin:0 0 6px;">${escapeHtml(diff.charAt(0).toUpperCase() + diff.slice(1))}</p>
        <p style="font-size:2.8rem; font-weight:900; color:var(--sun); margin:6px 0 10px;">${escapeHtml(q)} = ?</p>
        <div style="width:100%; background:var(--ink); border-radius:8px; height:10px; margin:0 0 6px;">
          <div id="tbar" style="height:10px; border-radius:8px; background:var(--accent); width:100%; transition:width ${TIME}s linear;"></div>
        </div>
        <p id="tleft" style="font-size:1rem; color:var(--text-dim); margin:0 0 12px;">${timeLeft}s</p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          ${options.map(o => `<button class="btn" data-val="${o}" style="font-size:1.4rem; padding:18px; font-weight:bold;">${o}</button>`).join('')}
        </div>
      </div>
    `;

    requestAnimationFrame(() => requestAnimationFrame(() => {
      const bar = container.querySelector('#tbar');
      if (bar) bar.style.width = '0%';
    }));

    timerInterval = setInterval(() => {
      timeLeft--;
      const tl = container.querySelector('#tleft');
      if (tl) tl.textContent = timeLeft + 's';
      if (timeLeft <= 0) { clearInterval(timerInterval); if (!answered) { answered = true; showResult(false, 0, ans); } }
    }, 1000);

    container.querySelectorAll('[data-val]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        clearInterval(timerInterval);
        const chosen = Number(btn.dataset.val);
        const correct = chosen === ans;
        const pts = correct ? (diff === 'hard' ? 20 : diff === 'medium' ? 15 : 10) + Math.round(timeLeft * 1.5) : 0;
        showResult(correct, pts, ans);
      });
    });

    function showResult(correct, pts, answer) {
      totalPts += pts;
      navigator?.vibrate?.(correct ? 40 : [60, 30, 60]);
      container.innerHTML = `
        <div class="screen accent-grass">
          <p style="font-size:2.5rem; margin:0;">${correct ? '\u2705' : '\u274C'}</p>
          <p style="font-size:1.4rem; font-weight:bold; margin:8px 0;">${escapeHtml(q)} = <span style="color:var(--sun);">${answer}</span></p>
          <p style="margin:4px 0;">${correct ? '+' + pts + ' pts' : 'No points'}</p>
          <p style="color:var(--text-dim); font-size:0.9rem; margin:4px 0;">Total: ${totalPts} pts</p>
        </div>
      `;
      round++;
      setTimeout(nextRound, 900);
    }
  }

  function done() {
    if (finished) return;
    finished = true;
    onComplete(totalPts, {
      type: 'math-blitz',
      rounds: ROUNDS,
      summary: `Math blitz! +${totalPts} pts`
    });
  }

  nextRound();
}

export default { id: 'math-blitz', mount };
