import { escapeHtml } from '../ui.js';

const CATEGORIES = [
  ["Countries", "Name a country starting with"],
  ["Animals", "Name an animal starting with"],
  ["Foods", "Name a food starting with"],
  ["Movies", "Name a movie starting with"],
  ["Celebrity names", "Name a celebrity starting with"],
  ["Sports", "Name a sport starting with"],
  ["Cities", "Name a city starting with"],
  ["Things in a kitchen", "Name something in a kitchen starting with"],
  ["TV Shows", "Name a TV show starting with"],
  ["Car brands", "Name a car brand starting with"],
  ["Things at a party", "Name something at a party starting with"],
  ["Clothing items", "Name a clothing item starting with"],
  ["Board games", "Name a board game starting with"],
  ["Famous people called...", "Name a famous person whose name starts with"],
  ["Songs", "Name a song starting with"],
];

const LETTERS = 'ABCDEFGHIJKLMNOPRSST'.split('');

function mount(container, player, onComplete) {
  const [catName, prefix] = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  const TIME = 20;
  let count = 0;
  let timeLeft = TIME;
  let timerInterval;
  let finished = false;

  // Pick 5 random letters
  const letters = [...LETTERS].sort(() => Math.random() - 0.5).slice(0, 5);
  let letterIdx = 0;

  function showLetter() {
    if (letterIdx >= letters.length) { done(); return; }
    const letter = letters[letterIdx];
    let answered = false;

    container.innerHTML = `
      <div class="screen accent-violet">
        <p style="color:var(--accent); font-weight:bold; font-size:1rem; margin-bottom:2px;">ALPHABET BLAST \uD83D\uDD24 (${letterIdx+1}/${letters.length})</p>
        <p style="color:var(--text-dim); font-size:0.85rem; margin:0 0 8px;">Category: <strong>${escapeHtml(catName)}</strong></p>
        <p style="font-size:1rem; margin:0 0 6px;">${escapeHtml(prefix)}:</p>
        <p style="font-size:5rem; font-weight:900; color:var(--sun); margin:0 0 12px; line-height:1;">${letter}</p>
        <p style="color:var(--text-dim); font-size:0.85rem; margin:0 0 14px;">Say an answer out loud within 5 seconds!</p>
        <button class="btn primary" id="got-it" style="margin-bottom:10px;">\u2705 I got one!</button>
        <button class="btn" id="skip-it">\u23E9 Skip this letter</button>
      </div>
    `;

    let secLeft = 5;
    const countdown = setInterval(() => {
      secLeft--;
      if (secLeft <= 0) { clearInterval(countdown); if (!answered) { answered = true; letterIdx++; setTimeout(showLetter, 300); } }
    }, 1000);

    container.querySelector('#got-it').addEventListener('click', () => {
      if (answered) return; answered = true;
      clearInterval(countdown);
      count++;
      navigator?.vibrate?.(40);
      letterIdx++;
      setTimeout(showLetter, 300);
    });

    container.querySelector('#skip-it').addEventListener('click', () => {
      if (answered) return; answered = true;
      clearInterval(countdown);
      navigator?.vibrate?.([40, 20, 40]);
      letterIdx++;
      setTimeout(showLetter, 300);
    });
  }

  function done() {
    if (finished) return;
    finished = true;
    const pts = count * 10 + (count === letters.length ? 15 : 0);
    navigator?.vibrate?.([40, 30, 40]);
    container.innerHTML = `
      <div class="screen accent-violet">
        <p style="font-size:2.5rem; margin:0;">\uD83D\uDD24</p>
        <h2 style="margin:8px 0;">Done!</h2>
        <p style="margin:0 0 6px;">${count}/${letters.length} letters answered!</p>
        ${count === letters.length ? '<p style="color:var(--sun); font-weight:bold; margin:0 0 6px;">PERFECT SCORE! \uD83C\uDF1F +15 bonus</p>' : ''}
        <p style="font-size:1.3rem; margin:8px 0;">+${pts} pts</p>
      </div>
    `;
    setTimeout(() => {
      onComplete(pts, {
        type: 'alphabet-blast',
        category: catName,
        answered: count,
        total: letters.length,
        summary: `${count}/${letters.length} answered in ${catName}! +${pts} pts`
      });
    }, 1400);
  }

  showLetter();
}

export default { id: 'alphabet-blast', mount };
