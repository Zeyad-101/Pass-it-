import { escapeHtml } from '../ui.js';

// Player receives a random prompt — they must describe themselves in a fun creative way
const PROMPTS = [
  { q: "Describe yourself as a weather forecast", emoji: "\uD83C\uDF24\uFE0F" },
  { q: "Describe yourself as a pizza topping", emoji: "\uD83C\uDF55" },
  { q: "Describe yourself as a type of music genre", emoji: "\uD83C\uDFB8" },
  { q: "Describe yourself as a movie villain", emoji: "\uD83D\uDC7F" },
  { q: "Describe yourself as a natural disaster", emoji: "\uD83C\uDF0A" },
  { q: "Describe yourself as a car", emoji: "\uD83D\uDE97" },
  { q: "Describe yourself as a household appliance", emoji: "\uD83E\uDDF9" },
  { q: "Describe yourself as an animal at the zoo", emoji: "\uD83E\uDD81" },
  { q: "Describe yourself as a fast food order", emoji: "\uD83D\uDC1F" },
  { q: "Describe yourself as a type of shoe", emoji: "\uD83D\uDC5F" },
  { q: "Describe yourself as a dessert", emoji: "\uD83C\uDF70" },
  { q: "Describe yourself as a sport", emoji: "\u26BD" },
  { q: "Describe yourself as a season of the year", emoji: "\u2744\uFE0F" },
  { q: "Describe yourself as a TV channel", emoji: "\uD83D\uDCFA" },
  { q: "Describe yourself as a superpower", emoji: "\uD83E\uDDB8" },
  { q: "Describe yourself as a mythical creature", emoji: "\uD83D\uDC09" },
  { q: "Describe yourself as an emoji", emoji: "\uD83E\uDD14" },
  { q: "Describe yourself as a school subject", emoji: "\uD83D\uDCDA" },
  { q: "Describe yourself as an airport", emoji: "\uD83D\uDEEB" },
  { q: "Describe yourself as a type of bread", emoji: "\uD83C\uDF5E" },
  { q: "Describe yourself as a movie genre", emoji: "\uD83C\uDFAC" },
  { q: "Describe yourself as a holiday destination", emoji: "\uD83C\uDFDD\uFE0F" },
  { q: "Describe yourself as a phone notification", emoji: "\uD83D\uDD14" },
  { q: "Describe yourself as a type of noodle", emoji: "\uD83C\uDF5C" },
  { q: "Describe yourself as a historical era", emoji: "\uD83C\uDFDB\uFE0F" },
];

function mount(container, player, onComplete, allPlayers = []) {
  const prompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
  const voters = allPlayers.filter(p => p.id !== player.id);
  let voteIndex = 0;
  let funnyVotes = 0;

  container.innerHTML = `
    <div class="screen accent-sun">
      <p style="color:var(--accent); font-weight:bold; font-size:1rem; margin-bottom:4px;">DESCRIBE ME \uD83C\uDFA4</p>
      <p style="font-size:3.5rem; margin:8px 0;">${prompt.emoji}</p>
      <h2 style="margin:0 0 10px;">${escapeHtml(player.name)}:</h2>
      <p style="font-size:1.2rem; font-weight:bold; line-height:1.4; margin:0 0 16px;">${escapeHtml(prompt.q)}</p>
      <p style="color:var(--text-dim); font-size:0.9rem; margin:0 0 18px;">Be creative, funny, and honest! Say it out loud.</p>
      <button class="btn primary" id="said-it">I said it! \uD83D\uDD25</button>
    </div>
  `;

  container.querySelector('#said-it').addEventListener('click', () => {
    if (voters.length === 0) { finish(0, 0); return; }
    nextVoter();
  });

  function nextVoter() {
    if (voteIndex >= voters.length) { finish(funnyVotes, voters.length); return; }
    const voter = voters[voteIndex];
    container.innerHTML = `
      <div class="screen accent-sun">
        <h2>Pass to ${escapeHtml(voter.name)}</h2>
        <p style="color:var(--text-dim); margin:0 0 8px; font-size:0.9rem;">${escapeHtml(prompt.q)}</p>
        <p style="margin:0 0 18px;">Was ${escapeHtml(player.name)}'s answer funny and creative?</p>
        <button class="btn primary" id="v-funny" style="margin-bottom:10px; padding:16px;">\uD83D\uDE02 That was hilarious!</button>
        <button class="btn" id="v-meh" style="padding:16px;">\uD83D\uDE10 Pretty boring...</button>
      </div>
    `;
    let voted = false;
    container.querySelector('#v-funny').addEventListener('click', () => {
      if (voted) return; voted = true;
      navigator?.vibrate?.(30);
      funnyVotes++; voteIndex++;
      nextVoter();
    });
    container.querySelector('#v-meh').addEventListener('click', () => {
      if (voted) return; voted = true;
      navigator?.vibrate?.(30);
      voteIndex++;
      nextVoter();
    });
  }

  function finish(funny, total) {
    const pts = funny * 8 + (total > 0 && funny === total ? 10 : 0);
    onComplete(pts, {
      type: 'describe-me',
      prompt: prompt.q,
      funnyVotes: funny,
      totalVoters: total,
      summary: `${funny}/${total} laughed! +${pts} pts`
    });
  }
}

export default { id: 'describe-me', mount };
