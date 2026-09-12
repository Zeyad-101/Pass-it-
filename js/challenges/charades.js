import { escapeHtml } from '../ui.js';

// Categories and their words
const DECKS = [
  {
    label: 'Act It Out \uD83C\uDFAD',
    emoji: '\uD83C\uDFAD',
    accent: 'accent-coral',
    type: 'act',
    prompt: 'Act it out \u2014 no talking!',
    words: [
      'Swimming', 'Riding a horse', 'Eating spaghetti', 'Taking a selfie',
      'Brushing teeth', 'Driving a car', 'Playing guitar', 'Opening a present',
      'Sneezing', 'Sleeping', 'Yoga', 'Bowling', 'Skydiving', 'Rock climbing',
      'Cooking pasta', 'Walking a dog', 'Texting someone', 'Doing push-ups',
      'Playing piano', 'Crying', 'Laughing hysterically', 'Being scared',
      'Winning a race', 'Proposing', 'Knitting', 'Fishing', 'Surfing',
    ]
  },
  {
    label: 'Sound It Out \uD83D\uDD0A',
    emoji: '\uD83D\uDD0A',
    accent: 'accent-sun',
    type: 'sound',
    prompt: 'Make sounds \u2014 no words!',
    words: [
      'Thunderstorm', 'Popping popcorn', 'Baby crying', 'Train arriving',
      'Dog barking', 'Cat purring', 'Crowd cheering', 'Balloon popping',
      'Ocean waves', 'Snoring', 'Helicopter', 'Coffee machine', 'Doorbell',
      'Phone ringing (old style)', 'Someone typing fast', 'Washing machine',
      'Laughing baby', 'Fireworks', 'Flushing toilet',
    ]
  },
  {
    label: 'Draw It! \u270F\uFE0F',
    emoji: '\u270F\uFE0F',
    accent: 'accent-grass',
    type: 'draw',
    prompt: 'Draw it in the air with your finger \u2014 no talking!',
    words: [
      'Eiffel Tower', 'Smiley face', 'Rocket ship', 'Birthday cake',
      'Christmas tree', 'Rainbow', 'Spider web', 'Guitar', 'Umbrella',
      'Trophy', 'Crown', 'Diamond', 'Skull', 'Snowflake', 'Butterfly',
      'Camera', 'Briefcase', 'Volcano', 'Compass', 'Hourglass',
    ]
  },
];

function mount(container, player, onComplete, allPlayers = []) {
  const deck = DECKS[Math.floor(Math.random() * DECKS.length)];
  const word = deck.words[Math.floor(Math.random() * deck.words.length)];
  const TIME_LIMIT = 30;
  const guessers = allPlayers.filter(p => p.id !== player.id);
  let finished = false;
  let timeLeft = TIME_LIMIT;
  let timerInterval;
  let guessedCorrectly = false;

  // Step 1: Show the word to the performer
  container.innerHTML = `
    <div class="screen ${escapeHtml(deck.accent)}">
      <p style="color: var(--accent); font-weight: bold; font-size:1rem; margin-bottom:4px;">${deck.label} CHALLENGE</p>
      <p style="color:var(--text-dim); font-size:0.95rem; margin:0 0 8px;">${escapeHtml(deck.prompt)}</p>
      <h2 style="margin:0 0 6px;">${escapeHtml(player.name)}, your word is:</h2>
      <p style="font-size:2.8rem; font-weight:900; color:var(--sun); margin: 10px 0;">${escapeHtml(word)}</p>
      <p style="color:var(--text-dim); font-size:0.9rem; margin:0 0 16px;">Don't say the word! Show the others.</p>
      <button class="btn primary" id="start-btn">I'm Ready! Start Timer</button>
    </div>
  `;

  container.querySelector('#start-btn').addEventListener('click', startTimer);

  function startTimer() {
    container.innerHTML = `
      <div class="screen ${escapeHtml(deck.accent)}">
        <p style="color: var(--accent); font-weight: bold; font-size:1rem; margin-bottom:4px;">${deck.emoji} ${escapeHtml(deck.type === 'act' ? 'ACTING' : deck.type === 'sound' ? 'SOUNDS' : 'DRAWING')}...</p>
        <p style="font-size:2rem; font-weight:900; color:var(--sun); margin:8px 0; border: 3px dashed var(--ink); padding: 10px 18px; border-radius:12px;">${escapeHtml(word)}</p>
        <div style="width:100%; background:var(--ink); border-radius:8px; height:10px; margin:10px 0 6px;">
          <div id="timer-bar" style="height:10px; border-radius:8px; background:var(--accent); width:100%; transition:width ${TIME_LIMIT}s linear;"></div>
        </div>
        <p id="timer-text" style="font-size:1.3rem; font-weight:bold; margin:0 0 16px;">\u23F1 ${timeLeft}s</p>
        <button class="btn primary" id="btn-got-it" style="margin-bottom:10px;">\uD83C\uDF89 They Got It!</button>
        <button class="btn" id="btn-skip">\uD83D\uDE05 Nobody Got It</button>
      </div>
    `;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const bar = container.querySelector('#timer-bar');
        if (bar) bar.style.width = '0%';
      });
    });
    navigator?.vibrate?.(30);

    timerInterval = setInterval(() => {
      timeLeft--;
      const tt = container.querySelector('#timer-text');
      if (tt) tt.textContent = `\u23F1 ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        finish(false);
      }
    }, 1000);

    container.querySelector('#btn-got-it').addEventListener('click', () => {
      clearInterval(timerInterval);
      finish(true);
    });
    container.querySelector('#btn-skip').addEventListener('click', () => {
      clearInterval(timerInterval);
      finish(false);
    });
  }

  function finish(success) {
    if (finished) return;
    finished = true;
    const speedBonus = success ? Math.max(0, Math.round(timeLeft * 1.5)) : 0;
    const pts = success ? 20 + speedBonus : 0;
    navigator?.vibrate?.(success ? 40 : [80, 40, 80]);

    container.innerHTML = `
      <div class="screen ${escapeHtml(deck.accent)}">
        <p style="font-size:3rem; margin:0;">${success ? '\uD83C\uDF89' : '\uD83D\uDE05'}</p>
        <h2 style="margin:8px 0;">${success ? 'They got it!' : 'No luck!'}</h2>
        <p style="margin:4px 0; color:var(--text-dim);">The word was: <strong style="color:var(--sun);">${escapeHtml(word)}</strong></p>
        <p style="font-size:1.4rem; margin:8px 0;">+${pts} pts</p>
      </div>
    `;

    setTimeout(() => {
      onComplete(pts, {
        type: 'charades',
        deck: deck.label,
        word,
        success,
        summary: success ? `Guessed "${word}"! +${pts}pts` : `Missed "${word}"`
      });
    }, 1400);
  }
}

export default { id: 'charades', mount };
