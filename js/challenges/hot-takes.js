import { escapeHtml } from '../ui.js';

const TOPICS = [
  ["Pineapple on pizza", "\uD83C\uDF55"],
  ["Cats vs Dogs", "\uD83D\uDC31\uD83D\uDC36"],
  ["Skipping the gym", "\uD83C\uDFCB\uFE0F"],
  ["Waking up early", "\u23F0"],
  ["Social media is ruining society", "\uD83D\uDCF1"],
  ["Bottled water vs tap water", "\uD83D\uDCA7"],
  ["Superhero movies", "\uD83E\uDDB8"],
  ["Homework should be abolished", "\uD83D\uDCDA"],
  ["People who don't tip at restaurants", "\uD83D\uDCB0"],
  ["Reality TV shows", "\uD83D\uDCFA"],
  ["Morning showers vs night showers", "\uD83D\uDEB6"],
  ["Sending voice notes instead of texts", "\uD83C\uDFA4"],
  ["People who talk in cinemas", "\uD83C\uDFAC"],
  ["Socks with sandals", "\uD83E\uDDE6"],
  ["Eating loudly in public", "\uD83C\uDF7D\uFE0F"],
  ["Reclining your airplane seat", "\uD83D\uDEEB"],
  ["Replying to every message immediately", "\uD83D\uDCF2"],
  ["People who make their beds every morning", "\uD83D\uDECF\uFE0F"],
  ["Astrology", "\u2648"],
  ["Crypto and NFTs", "\uD83D\uDCB0"],
  ["Influencer culture", "\uD83E\uDD33"],
  ["Fast fashion", "\uD83D\uDC57"],
  ["Working from home forever", "\uD83C\uDFE0"],
  ["Parents posting kids on social media", "\uD83D\uDC76"],
  ["Wearing the same outfit two days in a row", "\uD83D\uDC55"],
  ["Peanut butter and jam sandwiches", "\uD83E\uDD5C"],
  ["Ghosts and supernatural things", "\uD83D\uDC7B"],
  ["Long-distance relationships", "\u2764\uFE0F"],
  ["Eating healthy food all the time", "\uD83E\uDD57"],
  ["AI taking over jobs", "\uD83E\uDD16"],
];

function mount(container, player, onComplete, allPlayers = []) {
  const [topic, emoji] = TOPICS[Math.floor(Math.random() * TOPICS.length)];
  const voters = allPlayers.filter(p => p.id !== player.id);
  let voteIndex = 0;
  let spicyVotes = 0;

  container.innerHTML = `
    <div class="screen accent-violet">
      <p style="color:var(--accent); font-weight:bold; font-size:1rem; margin-bottom:4px;">HOT TAKES \uD83D\uDD25</p>
      <h2 style="margin:0 0 8px;">${escapeHtml(player.name)}'s topic:</h2>
      <p style="font-size:3rem; margin:0 0 6px;">${emoji}</p>
      <p style="font-size:1.5rem; font-weight:900; color:var(--sun); margin:0 0 14px;">${escapeHtml(topic)}</p>
      <p style="color:var(--text-dim); font-size:0.9rem; margin:0 0 16px;">Give your HOTTEST most controversial opinion on this. Don't hold back!</p>
      <button class="btn primary" id="delivered-btn">I said it! \uD83D\uDD25</button>
    </div>
  `;

  container.querySelector('#delivered-btn').addEventListener('click', () => {
    if (voters.length === 0) { finish(0, 0); return; }
    nextVoter();
  });

  function nextVoter() {
    if (voteIndex >= voters.length) { finish(spicyVotes, voters.length); return; }
    const voter = voters[voteIndex];
    container.innerHTML = `
      <div class="screen accent-violet">
        <h2>Pass to ${escapeHtml(voter.name)}</h2>
        <p style="color:var(--text-dim); font-size:0.9rem; margin:0 0 8px;">Topic: <strong>${escapeHtml(topic)}</strong></p>
        <p style="margin:0 0 18px;">Was ${escapeHtml(player.name)}'s take actually spicy?</p>
        <button class="btn primary" id="v-spicy" style="margin-bottom:10px; padding:16px;">\uD83D\uDD25 That was SPICY!</button>
        <button class="btn" id="v-mild" style="padding:16px;">\uD83D\uDE34 That was boring...</button>
      </div>
    `;
    let voted = false;
    container.querySelector('#v-spicy').addEventListener('click', () => {
      if (voted) return; voted = true;
      navigator?.vibrate?.(30);
      spicyVotes++; voteIndex++;
      nextVoter();
    });
    container.querySelector('#v-mild').addEventListener('click', () => {
      if (voted) return; voted = true;
      navigator?.vibrate?.(30);
      voteIndex++;
      nextVoter();
    });
  }

  function finish(spicy, total) {
    const majority = total > 0 && spicy > total / 2;
    const pts = spicy * 8 + (majority ? 10 : 0);
    onComplete(pts, {
      type: 'hot-takes',
      topic,
      spicyVotes: spicy,
      totalVoters: total,
      summary: `${spicy}/${total} found it spicy! +${pts} pts`
    });
  }
}

export default { id: 'hot-takes', mount };
