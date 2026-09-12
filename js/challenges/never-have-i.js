import { escapeHtml } from '../ui.js';

const STATEMENTS = [
  "Never have I ever gone skinny dipping",
  "Never have I ever been in a police car",
  "Never have I ever pulled an all-nighter",
  "Never have I ever eaten an entire tub of ice cream in one sitting",
  "Never have I ever had a crush on a fictional character",
  "Never have I ever been in a physical fight",
  "Never have I ever lied about my age",
  "Never have I ever kissed a stranger",
  "Never have I ever been to a music festival",
  "Never have I ever run from the police",
  "Never have I ever slept in a car",
  "Never have I ever cheated at a card or board game",
  "Never have I ever pretended to know a celebrity's song when I didn't",
  "Never have I ever eaten food directly out of the bin",
  "Never have I ever sent a love letter or DM that was embarrassing",
  "Never have I ever stayed up until 6am for no reason",
  "Never have I ever had a crush on my friend's partner",
  "Never have I ever worn the same clothes 3 days in a row",
  "Never have I ever snuck out of the house at night",
  "Never have I ever been blocked by someone",
  "Never have I ever cried watching a cartoon",
  "Never have I ever won money gambling",
  "Never have I ever had a secret social media account",
  "Never have I ever faked a phone call to get out of a situation",
  "Never have I ever set an alarm and ignored it on purpose",
  "Never have I ever eaten something off someone else's plate without asking",
  "Never have I ever been to a strip club",
  "Never have I ever lied on a job application or CV",
  "Never have I ever done something only because peer pressure made me",
  "Never have I ever ordered delivery food and eaten it before it even arrived",
];

function mount(container, player, onComplete, allPlayers = []) {
  const statement = STATEMENTS[Math.floor(Math.random() * STATEMENTS.length)];
  const others = allPlayers.filter(p => p.id !== player.id);
  let voteIndex = 0;
  let handsUp = 0;

  // Show statement to current player first
  container.innerHTML = `
    <div class="screen accent-violet">
      <p style="color:var(--accent); font-weight:bold; font-size:1rem; margin-bottom:4px;">NEVER HAVE I EVER \uD83C\uDF78</p>
      <h2 style="margin:0 0 12px;">${escapeHtml(player.name)}, read this aloud:</h2>
      <p style="font-size:1.25rem; font-weight:bold; line-height:1.45; background:rgba(0,0,0,0.15); padding:18px; border-radius:14px; margin:0 0 14px;">"${escapeHtml(statement)}"</p>
      <p style="color:var(--text-dim); font-size:0.9rem; margin:0 0 16px;">Then everyone who HAS done it raises their hand. Pass the phone around to record the votes!</p>
      <button class="btn primary" id="start-vote">Start Voting \uD83D\uDC46</button>
    </div>
  `;

  container.querySelector('#start-vote').addEventListener('click', nextVoter);

  function nextVoter() {
    const allVoters = allPlayers; // Everyone votes including current player
    if (voteIndex >= allVoters.length) { finish(); return; }
    const voter = allVoters[voteIndex];
    const isCurrentPlayer = voter.id === player.id;

    container.innerHTML = `
      <div class="screen accent-violet">
        <h2>Pass to ${escapeHtml(voter.name)}</h2>
        <p style="font-size:1rem; line-height:1.4; margin:0 0 6px; font-style:italic;">"${escapeHtml(statement)}"</p>
        <p style="color:var(--text-dim); font-size:0.9rem; margin:0 0 18px;">${isCurrentPlayer ? 'Have YOU done this?' : `Has ${escapeHtml(voter.name)} done this?`}</p>
        <button class="btn primary" id="v-yes" style="margin-bottom:10px; padding:18px; font-size:1.2rem;">\uD83C\uDF79 I HAVE!</button>
        <button class="btn" id="v-no" style="padding:18px; font-size:1.2rem;">\uD83D\uDE07 Never!</button>
      </div>
    `;
    let voted = false;
    container.querySelector('#v-yes').addEventListener('click', () => {
      if (voted) return; voted = true;
      navigator?.vibrate?.(40);
      handsUp++;
      voteIndex++;
      nextVoter();
    });
    container.querySelector('#v-no').addEventListener('click', () => {
      if (voted) return; voted = true;
      navigator?.vibrate?.(20);
      voteIndex++;
      nextVoter();
    });
  }

  function finish() {
    // The current player gets points based on how many people HAVEN'T done it (they're the wildest)
    const totalVoters = allPlayers.length;
    const playerDid = handsUp > 0; // simplification for scoring
    const pts = handsUp * 5;
    onComplete(pts, {
      type: 'never-have-i',
      statement,
      handsUp,
      total: totalVoters,
      summary: `${handsUp}/${totalVoters} have done it! +${pts} pts`
    });
  }
}

export default { id: 'never-have-i', mount };
