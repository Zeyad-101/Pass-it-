import { escapeHtml } from '../ui.js';

// [emojis, answer, category]
const PUZZLES = [
  // Movies
  ["\uD83E\uDD81 \uD83D\uDC51", "The Lion King", "Movie"],
  ["\uD83D\uDC38 \uD83D\uDC51", "The Frog Prince", "Movie"],
  ["\uD83E\uDDD9 \uD83D\uDC8D \uD83D\uDD34", "Lord of the Rings", "Movie"],
  ["\uD83D\uDC20 \uD83C\uDF0A \uD83C\uDFA3", "Finding Nemo", "Movie"],
  ["\uD83D\uDC77 \uD83D\uDD37", "Spider-Man", "Movie"],
  ["\u2744\uFE0F \u2764\uFE0F \uD83D\uDC67", "Frozen", "Movie"],
  ["\uD83E\uDD96 \uD83C\uDF3C \uD83D\uDC4A", "Jurassic Park", "Movie"],
  ["\uD83E\uDDD1\u200D\uD83D\uDE80 \uD83C\uDF20 \uD83E\uDEF5", "Interstellar", "Movie"],
  ["\uD83D\uDC9E \uD83D\uDC97 \uD83D\uDC4D", "Pretty Woman", "Movie"],
  ["\uD83D\uDC7F \uD83D\uDCBB \uD83C\uDF81", "Die Hard", "Movie"],
  ["\uD83D\uDC38 \uD83D\uDC38 \uD83D\uDC38", "Three Frogs (The Three Musketeers)", "Movie"],
  ["\uD83E\uDD96 \uD83C\uDF0A", "Jaws", "Movie"],
  ["\uD83D\uDC2D \uD83C\uDFE0", "Stuart Little", "Movie"],
  ["\u26F5 \u2764\uFE0F \uD83D\uDC83", "Titanic", "Movie"],
  ["\uD83E\uDD78 \uD83D\uDE97 \uD83C\uDFCE\uFE0F", "Fast & Furious", "Movie"],
  ["\uD83D\uDC91 \uD83D\uDD2B \uD83C\uDF74", "Kill Bill", "Movie"],
  ["\uD83D\uDC51 \uD83D\uDC37 \uD83C\uDF3F", "Babe", "Movie"],
  ["\uD83E\uDD85 \uD83D\uDC8A \uD83D\uDC4D", "Ratatouille", "Movie"],
  // Songs
  ["\uD83D\uDD25 \uD83D\uDCCF \uD83D\uDE97", "Riding Dirty (Ridin)", "Song"],
  ["\uD83C\uDF5A \uD83D\uDC83", "Rice Rice Baby (Ice Ice Baby)", "Song"],
  ["\uD83D\uDE80 \uD83D\uDD25", "Rocket Man", "Song"],
  ["\uD83D\uDC85 \uD83D\uDCA5", "Hit Me Baby", "Song"],
  ["\uD83C\uDF08 \uD83D\uDD5B \uD83D\uDCA4", "Somewhere Over The Rainbow", "Song"],
  ["\uD83C\uDFB5 \uD83D\uDC83 \uD83C\uDF89", "Celebration", "Song"],
  ["\uD83E\uDD80 \uD83D\uDC83", "Macarena", "Song"],
  ["\uD83D\uDC8B \uD83D\uDC8B \uD83D\uDC8B", "Kiss Kiss Kiss", "Song"],
  ["\uD83C\uDF19 \u2606 \uD83C\uDF19", "Fly Me to the Moon", "Song"],
  ["\uD83D\uDCAA \uD83C\uDFCB\uFE0F\u200D\u2642\uFE0F \uD83C\uDFBC", "Eye of the Tiger", "Song"],
  // Phrases / Idioms
  ["\uD83D\uDCA7 \uD83E\uDEA3", "Water Bucket (Kick the Bucket)", "Phrase"],
  ["\uD83D\uDC1D \uD83D\uDC1D \uD83D\uDC1D", "Spelling Bee (Bee x3)", "Phrase"],
  ["\uD83C\uDF47 \uD83C\uDF77", "Sour Grapes", "Phrase"],
  ["\uD83D\uDC34 \uD83D\uDCAA", "Horse Power", "Phrase"],
  ["\uD83C\uDF27\uFE0F \uD83D\uDE08", "Brainstorm", "Phrase"],
  ["\uD83D\uDC36 \uD83C\uDF27\uFE0F", "Raining Cats and Dogs", "Phrase"],
  ["\uD83E\uDD8A \uD83E\uDD4A", "Fox Boxing", "Phrase"],
  // Tech & Modern
  ["\uD83D\uDD35 \uD83D\uDCF1 \uD83E\uDD1C", "Bluetooth", "Tech"],
  ["\uD83D\uDDA5\uFE0F \uD83D\uDC1B", "Computer Bug", "Tech"],
  ["\uD83D\uDCF7 \uD83D\uDCF1", "Smartphone Camera", "Tech"],
  ["\uD83D\uDD17 \uD83D\uDCD1", "Blockchain", "Tech"],
  ["\uD83E\uDD16 \uD83E\uDDE0", "Artificial Intelligence", "Tech"],
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick 3 unique puzzles for a mini-round
function pickBatch() {
  return shuffle(PUZZLES).slice(0, 3);
}

function mount(container, player, onComplete) {
  const batch = pickBatch();
  let current = 0;
  let totalPts = 0;
  let finished = false;
  const TIME_LIMIT = 20;

  function showPuzzle() {
    if (current >= batch.length) {
      showResult();
      return;
    }
    const [emojis, answer, category] = batch[current];
    let timeLeft = TIME_LIMIT;
    let solved = false;
    let timerInterval;

    container.innerHTML = `
      <div class="screen accent-sun">
        <p style="color:var(--accent); font-weight:bold; font-size:1rem; margin-bottom:2px;">EMOJI QUIZ \uD83E\uDDE9 &mdash; ${escapeHtml(category)} (${current + 1}/${batch.length})</p>
        <p style="font-size:3.5rem; letter-spacing:6px; margin:10px 0; line-height:1.2;">${emojis}</p>
        <p style="color:var(--text-dim); font-size:0.85rem; margin:0 0 8px;">Guess what this represents!</p>
        <div style="width:100%; background:var(--ink); border-radius:8px; height:10px; margin:0 0 6px;">
          <div id="tbar" style="height:10px; border-radius:8px; background:var(--accent); width:100%; transition:width ${TIME_LIMIT}s linear;"></div>
        </div>
        <p id="tleft" style="font-size:0.95rem; color:var(--text-dim); margin:0 0 14px;">\u23F1 ${timeLeft}s</p>
        <button class="btn primary" id="btn-got" style="margin-bottom:10px;">\uD83C\uDF89 I know it!</button>
        <button class="btn" id="btn-skip">Skip \u23E9</button>
      </div>
    `;

    requestAnimationFrame(() => requestAnimationFrame(() => {
      const bar = container.querySelector('#tbar');
      if (bar) bar.style.width = '0%';
    }));

    timerInterval = setInterval(() => {
      timeLeft--;
      const tl = container.querySelector('#tleft');
      if (tl) tl.textContent = `\u23F1 ${timeLeft}s`;
      if (timeLeft <= 0) { clearInterval(timerInterval); revealAnswer(false, 0, timeLeft); }
    }, 1000);

    container.querySelector('#btn-got').addEventListener('click', () => {
      if (solved) return; solved = true;
      clearInterval(timerInterval);
      // Show answer reveal for group verification
      const speedBonus = Math.max(0, Math.round(timeLeft * 1.5));
      container.innerHTML = `
        <div class="screen accent-sun">
          <p style="font-size:3.2rem; letter-spacing:6px; margin:8px 0;">${emojis}</p>
          <p style="color:var(--text-dim); font-size:0.95rem; margin:0 0 6px;">The answer was:</p>
          <p style="font-size:1.6rem; font-weight:900; color:var(--ink); margin:0 0 16px;">${escapeHtml(answer)}</p>
          <button class="btn primary" id="btn-correct" style="margin-bottom:10px;">\u2705 Got it right!</button>
          <button class="btn" id="btn-wrong">\u274C Was wrong</button>
        </div>
      `;
      container.querySelector('#btn-correct').addEventListener('click', () => {
        revealAnswer(true, 15 + speedBonus, timeLeft);
      });
      container.querySelector('#btn-wrong').addEventListener('click', () => {
        revealAnswer(false, 0, timeLeft);
      });
    });

    container.querySelector('#btn-skip').addEventListener('click', () => {
      if (solved) return; solved = true;
      clearInterval(timerInterval);
      revealAnswer(false, 0, 0);
    });

    function revealAnswer(correct, pts, tl) {
      totalPts += pts;
      current++;
      navigator?.vibrate?.(correct ? 40 : [50, 30, 50]);
      setTimeout(showPuzzle, 400);
    }
  }

  function showResult() {
    if (finished) return;
    finished = true;
    onComplete(totalPts, {
      type: 'emoji-quiz',
      puzzlesPlayed: batch.length,
      totalPts,
      summary: `${batch.length} emoji puzzles, +${totalPts} pts`
    });
  }

  showPuzzle();
}

export default { id: 'emoji-quiz', mount };
