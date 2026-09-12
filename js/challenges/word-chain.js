import { escapeHtml } from '../ui.js';

const STARTERS = [
  ["Cat", "Animals"], ["Fire", "Nature"], ["Sun", "Nature"],
  ["Ocean", "Nature"], ["Book", "Objects"], ["Music", "Entertainment"],
  ["Food", "Everyday"], ["City", "Places"], ["Dance", "Activities"],
  ["Love", "Feelings"], ["War", "History"], ["Space", "Science"],
  ["Dream", "Mind"], ["Money", "Life"], ["Game", "Fun"],
  ["School", "Everyday"], ["Phone", "Tech"], ["Car", "Transport"],
];

function mount(container, player, onComplete) {
  const [startWord, category] = STARTERS[Math.floor(Math.random() * STARTERS.length)];
  const TIME = 25;
  let timeLeft = TIME;
  let timerInterval;
  let chain = [startWord];
  let count = 0;
  let finished = false;

  function render() {
    const lastWord = chain[chain.length - 1];
    const lastLetter = lastWord.slice(-1).toUpperCase();

    container.innerHTML = `
      <div class="screen accent-sun">
        <p style="color:var(--accent); font-weight:bold; font-size:1rem; margin-bottom:4px;">WORD CHAIN \uD83D\uDD17 (${escapeHtml(player.name)})</p>
        <p style="color:var(--text-dim); font-size:0.85rem; margin:0 0 6px;">Each word must start with the last letter of the previous one!</p>
        <div style="width:100%; background:var(--ink); border-radius:8px; height:10px; margin:0 0 6px;">
          <div id="tbar" style="height:10px; border-radius:8px; background:var(--accent); width:100%; transition:width ${TIME}s linear;"></div>
        </div>
        <p id="tleft" style="font-size:1rem; color:var(--text-dim); margin:0 0 10px;">\u23F1 ${timeLeft}s</p>
        <p style="font-size:0.9rem; color:var(--text-dim); margin:0 0 4px;">Last word:</p>
        <p style="font-size:2rem; font-weight:900; color:var(--sun); margin:0 0 4px;">${escapeHtml(lastWord)}</p>
        <p style="font-size:1rem; margin:0 0 12px;">Next word must start with: <strong style="font-size:1.6rem; color:var(--accent);">${lastLetter}</strong></p>
        <p style="font-size:0.85rem; color:var(--text-dim); margin:0 0 8px;">Chain so far: ${chain.length} words</p>
        <input id="word-input" type="text" class="btn" placeholder="Type a word..." 
          style="text-align:left; padding:12px; font-size:1rem; width:100%; box-sizing:border-box; margin-bottom:10px;" maxlength="30" autocomplete="off" autocorrect="off" spellcheck="false"/>
        <button class="btn primary" id="submit-word">Submit</button>
        <p id="err" style="color:#ff5a5f; font-size:0.9rem; margin:8px 0 0; min-height:1.2em;"></p>
      </div>
    `;

    requestAnimationFrame(() => requestAnimationFrame(() => {
      const bar = container.querySelector('#tbar');
      if (bar) bar.style.width = '0%';
    }));

    const input = container.querySelector('#word-input');
    input.focus();

    timerInterval = setInterval(() => {
      timeLeft--;
      const tl = container.querySelector('#tleft');
      if (tl) tl.textContent = `\u23F1 ${timeLeft}s`;
      if (timeLeft <= 0) { clearInterval(timerInterval); endGame(); }
    }, 1000);

    const submit = () => {
      const word = input.value.trim();
      const err = container.querySelector('#err');
      if (!word) return;
      if (word[0].toUpperCase() !== lastLetter) {
        if (err) err.textContent = `Must start with "${lastLetter}"!`;
        navigator?.vibrate?.([40, 20, 40]);
        return;
      }
      if (chain.map(w => w.toLowerCase()).includes(word.toLowerCase())) {
        if (err) err.textContent = 'Already used that word!';
        navigator?.vibrate?.([40, 20, 40]);
        return;
      }
      clearInterval(timerInterval);
      count++;
      chain.push(word);
      navigator?.vibrate?.(25);
      timeLeft = TIME;
      render();
    };

    container.querySelector('#submit-word').addEventListener('click', submit);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  }

  function endGame() {
    if (finished) return;
    finished = true;
    const pts = count * 10;
    navigator?.vibrate?.([40, 30, 40]);
    container.innerHTML = `
      <div class="screen accent-sun">
        <p style="font-size:2.5rem; margin:0;">\uD83D\uDD17</p>
        <h2 style="margin:8px 0;">Chain ended!</h2>
        <p style="margin:0 0 6px; color:var(--text-dim);">You chained <strong style="color:var(--sun); font-size:1.4rem;">${count}</strong> word${count !== 1 ? 's' : ''}!</p>
        <p style="font-size:1.3rem; margin:8px 0;">+${pts} pts</p>
      </div>
    `;
    setTimeout(() => {
      onComplete(pts, {
        type: 'word-chain',
        chainLength: count,
        chain: chain.join(' → '),
        summary: `${count} word chain! +${pts} pts`
      });
    }, 1400);
  }

  render();
}

export default { id: 'word-chain', mount };
