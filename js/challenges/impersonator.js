import { escapeHtml } from '../ui.js';

const TARGETS = [
  // Celebrities
  ["Morgan Freeman", "\uD83C\uDFAD", "narrating something in the room"],
  ["Borat", "\uD83C\uDDF0\uD83C\uDDFF", "introducing yourself"],
  ["Gollum", "\uD83D\uDC51", "talking about your precious phone"],
  ["Arnold Schwarzenegger", "\uD83D\uDCAA", "giving a motivational speech"],
  ["Donald Trump", "\uD83C\uDDFA\uD83C\uDDF8", "talking about how great you are"],
  ["Gordon Ramsay", "\uD83D\uDC68\u200D\uD83C\uDF73", "reviewing the last meal you ate"],
  ["Yoda", "\uD83D\uDC3C", "giving life advice"],
  ["Shrek", "\uD83E\uDDD2", "complaining about something"],
  ["David Attenborough", "\uD83C\uDF3F", "describing what you see in the room"],
  ["Snoop Dogg", "\uD83C\uDF77", "describing your morning routine"],
  ["Christopher Walken", "\uD83C\uDDFA\uD83C\uDDF8", "ordering food"],
  ["The Queen of England", "\uD83D\uDC51", "reacting to modern slang"],
  ["Shakespeare", "\uD83C\uDFAD", "texting someone"],
  ["A sports commentator", "\uD83C\uDFC6", "describing someone eating a sandwich"],
  ["A weather reporter", "\u26C5", "describing the room's 'weather'"],
  ["A pirate", "\uD83C\uDFF4\u200D\u2620\uFE0F", "giving directions"],
  ["A robot", "\uD83E\uDD16", "explaining your feelings"],
  ["A valley girl", "\uD83D\uDC85", "giving a TED talk"],
  ["A caveman", "\uD83E\uDDB4", "discovering a smartphone"],
  ["A 5-year-old", "\uD83D\uDC76", "explaining what you do for work"],
  ["A villain", "\uD83D\uDC7F", "announcing your evil plan"],
  ["A surfer dude", "\uD83C\uDFC4", "giving stock market advice"],
  ["A medieval knight", "\u2694\uFE0F", "reviewing a fast food restaurant"],
  ["An evil scientist", "\uD83E\uDDEC", "pitching a ridiculous invention"],
  ["A news anchor", "\uD83D\uDCFA", "reporting on the last thing someone in the room did"],
];

function mount(container, player, onComplete, allPlayers = []) {
  const [target, emoji, scenario] = TARGETS[Math.floor(Math.random() * TARGETS.length)];
  const voters = allPlayers.filter(p => p.id !== player.id);
  let voteIndex = 0;
  let goodVotes = 0;

  container.innerHTML = `
    <div class="screen accent-sun">
      <p style="color:var(--accent); font-weight:bold; font-size:1rem; margin-bottom:4px;">IMPERSONATOR ${emoji}</p>
      <h2 style="margin:0 0 6px;">${escapeHtml(player.name)}, you are:</h2>
      <p style="font-size:2.2rem; font-weight:900; color:var(--sun); margin:0 0 8px;">${escapeHtml(target)}</p>
      <p style="font-size:1rem; line-height:1.4; color:var(--text-dim); margin:0 0 18px;">Your scene: <strong>${escapeHtml(scenario)}</strong></p>
      <p style="font-size:0.9rem; color:var(--text-dim); margin:0 0 16px;">Do it for 15 seconds, then let the group vote!</p>
      <button class="btn primary" id="start-imp">I'm ready! GO \uD83D\uDC40</button>
    </div>
  `;

  container.querySelector('#start-imp').addEventListener('click', () => {
    let timeLeft = 15;
    navigator?.vibrate?.(50);

    container.innerHTML = `
      <div class="screen accent-sun">
        <p style="font-size:3rem; margin:0;">${emoji}</p>
        <p style="font-size:1.5rem; font-weight:900; margin:8px 0; color:var(--sun);">${escapeHtml(target)}</p>
        <p style="font-size:0.95rem; margin:0 0 12px; color:var(--text-dim);">${escapeHtml(scenario)}</p>
        <p id="timer" style="font-size:3rem; font-weight:900; margin:0 0 14px;">${timeLeft}</p>
        <button class="btn primary" id="done-imp">Done! \u2705</button>
      </div>
    `;

    const interval = setInterval(() => {
      timeLeft--;
      const t = container.querySelector('#timer');
      if (t) t.textContent = timeLeft;
      if (timeLeft <= 3) navigator?.vibrate?.(15);
      if (timeLeft <= 0) { clearInterval(interval); startVoting(); }
    }, 1000);

    container.querySelector('#done-imp').addEventListener('click', () => {
      clearInterval(interval);
      startVoting();
    });
  });

  function startVoting() {
    if (voters.length === 0) { finish(0, 0); return; }
    nextVoter();
  }

  function nextVoter() {
    if (voteIndex >= voters.length) { finish(goodVotes, voters.length); return; }
    const voter = voters[voteIndex];

    container.innerHTML = `
      <div class="screen accent-sun">
        <h2>Pass to ${escapeHtml(voter.name)}</h2>
        <p style="margin:0 0 8px; color:var(--text-dim);">Did ${escapeHtml(player.name)}'s <strong>${escapeHtml(target)}</strong> impression convince you?</p>
        <button class="btn primary" id="v-yes" style="margin-bottom:10px; padding:16px;">\uD83D\uDD25 Nailed it!</button>
        <button class="btn" id="v-no" style="padding:16px;">\uD83D\uDE45 Not even close!</button>
      </div>
    `;
    let voted = false;
    container.querySelector('#v-yes').addEventListener('click', () => {
      if (voted) return; voted = true;
      navigator?.vibrate?.(30);
      goodVotes++;
      voteIndex++;
      nextVoter();
    });
    container.querySelector('#v-no').addEventListener('click', () => {
      if (voted) return; voted = true;
      navigator?.vibrate?.(30);
      voteIndex++;
      nextVoter();
    });
  }

  function finish(yes, total) {
    const pts = yes * 8 + (total > 0 && yes === total ? 15 : 0);
    navigator?.vibrate?.(pts > 10 ? [40, 40, 40] : [80, 40, 80]);
    onComplete(pts, {
      type: 'impersonator',
      target,
      scenario,
      yes,
      total,
      summary: `${yes}/${total} convinced! +${pts} pts`
    });
  }
}

export default { id: 'impersonator', mount };
