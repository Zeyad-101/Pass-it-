import { escapeHtml } from '../ui.js';

// [word to describe, forbidden words]
const CARDS = [
  ["Pizza", ["cheese", "dough", "Italian", "slice", "tomato"]],
  ["Beach", ["sand", "ocean", "sea", "waves", "sun"]],
  ["Superman", ["fly", "cape", "Clark", "hero", "Kryptonite"]],
  ["Birthday", ["cake", "candles", "party", "celebrate", "age"]],
  ["McDonald's", ["burger", "fries", "fast food", "golden", "Ronald"]],
  ["Netflix", ["stream", "show", "movie", "watch", "binge"]],
  ["Wedding", ["bride", "groom", "ring", "marry", "vows"]],
  ["Elephant", ["trunk", "big", "Africa", "grey", "tusks"]],
  ["Football", ["kick", "goal", "pitch", "ball", "team"]],
  ["Airport", ["plane", "fly", "travel", "passport", "terminal"]],
  ["Swimming pool", ["swim", "water", "splash", "dive", "chlorine"]],
  ["Chocolate", ["sweet", "cocoa", "brown", "candy", "dessert"]],
  ["Dentist", ["teeth", "drill", "tooth", "pain", "cavity"]],
  ["Instagram", ["photo", "filter", "post", "like", "follow"]],
  ["Earthquake", ["shake", "tremor", "ground", "disaster", "Richter"]],
  ["Astronaut", ["space", "rocket", "moon", "suit", "NASA"]],
  ["Vampire", ["blood", "bite", "coffin", "Dracula", "fangs"]],
  ["Gym", ["workout", "weights", "exercise", "muscle", "fitness"]],
  ["Library", ["books", "read", "quiet", "borrow", "shelves"]],
  ["Rollercoaster", ["ride", "fast", "scream", "amusement", "drop"]],
  ["Piano", ["keys", "music", "play", "notes", "instrument"]],
  ["Hospital", ["doctor", "nurse", "sick", "bed", "medicine"]],
  ["Google", ["search", "internet", "browser", "website", "online"]],
  ["Submarine", ["underwater", "navy", "sea", "torpedo", "dive"]],
  ["Barbecue", ["grill", "meat", "fire", "outdoor", "smoke"]],
  ["Dinosaur", ["extinct", "Jurassic", "fossil", "giant", "prehistoric"]],
  ["Prison", ["jail", "bars", "criminal", "cell", "sentence"]],
  ["Karaoke", ["sing", "microphone", "song", "bar", "lyrics"]],
  ["Tattoo", ["ink", "needle", "skin", "permanent", "artist"]],
  ["Rollerblades", ["skate", "wheels", "glide", "balance", "boot"]],
];

function mount(container, player, onComplete, allPlayers = []) {
  const [word, forbidden] = CARDS[Math.floor(Math.random() * CARDS.length)];
  const voters = allPlayers.filter(p => p.id !== player.id);
  const TIME = 30;
  let timeLeft = TIME;
  let timerInterval;
  let started = false;

  // Show word + forbidden words to describer
  container.innerHTML = `
    <div class="screen accent-coral">
      <p style="color:var(--accent); font-weight:bold; font-size:1rem; margin-bottom:4px;">TABOO \uD83D\uDEAB (${escapeHtml(player.name)})</p>
      <p style="color:var(--text-dim); font-size:0.9rem; margin:0 0 8px;">Describe the word WITHOUT saying:</p>
      <div style="background:rgba(255,0,0,0.15); border-radius:10px; padding:10px 14px; margin:0 0 12px;">
        ${forbidden.map(w => `<span style="display:inline-block; background:#ff5a5f; color:white; padding:4px 10px; border-radius:20px; margin:3px; font-weight:bold; font-size:0.9rem;">\uD83D\uDEAB ${escapeHtml(w)}</span>`).join('')}
      </div>
      <p style="font-size:2.2rem; font-weight:900; color:var(--sun); margin:0 0 16px;">${escapeHtml(word)}</p>
      <p style="color:var(--text-dim); font-size:0.85rem; margin:0 0 14px;">Others must guess the word! You have ${TIME} seconds.</p>
      <button class="btn primary" id="go-btn">GO! \uD83D\uDDE3\uFE0F</button>
    </div>
  `;

  container.querySelector('#go-btn').addEventListener('click', () => {
    if (started) return; started = true;
    navigator?.vibrate?.(40);

    container.innerHTML = `
      <div class="screen accent-coral">
        <p style="color:var(--accent); font-weight:bold; font-size:1rem; margin-bottom:4px;">TABOO \uD83D\uDEAB</p>
        <p style="color:var(--text-dim); font-size:0.85rem; margin:0 0 6px;">Forbidden:</p>
        <div style="margin:0 0 10px;">
          ${forbidden.map(w => `<span style="display:inline-block; background:#ff5a5f; color:white; padding:3px 8px; border-radius:16px; margin:2px; font-size:0.8rem;">${escapeHtml(w)}</span>`).join('')}
        </div>
        <p style="font-size:2.4rem; font-weight:900; color:var(--sun); margin:0 0 10px;">${escapeHtml(word)}</p>
        <div style="width:100%; background:var(--ink); border-radius:8px; height:10px; margin:0 0 6px;">
          <div id="tbar" style="height:10px; border-radius:8px; background:#ff5a5f; width:100%; transition:width ${TIME}s linear;"></div>
        </div>
        <p id="tleft" style="font-size:1.8rem; font-weight:900; margin:0 0 14px;">${timeLeft}s</p>
        <button class="btn primary" id="guessed-btn" style="margin-bottom:10px;">\uD83C\uDF89 They Guessed It!</button>
        <button class="btn" id="skip-btn">\u23E9 Time's up / No luck</button>
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
      if (timeLeft <= 5) navigator?.vibrate?.(20);
      if (timeLeft <= 0) { clearInterval(timerInterval); finish(false); }
    }, 1000);

    container.querySelector('#guessed-btn').addEventListener('click', () => {
      clearInterval(timerInterval);
      finish(true);
    });
    container.querySelector('#skip-btn').addEventListener('click', () => {
      clearInterval(timerInterval);
      finish(false);
    });
  });

  function finish(success) {
    const speedBonus = success ? Math.round(timeLeft * 1.5) : 0;
    const pts = success ? 20 + speedBonus : 0;
    navigator?.vibrate?.(success ? [40, 40, 40] : [80, 40, 80]);
    onComplete(pts, {
      type: 'taboo',
      word,
      success,
      summary: success ? `"${word}" guessed! +${pts} pts` : `Nobody guessed "${word}"`
    });
  }
}

export default { id: 'taboo', mount };
