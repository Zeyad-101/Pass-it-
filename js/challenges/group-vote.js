import { escapeHtml } from '../ui.js';

const PROMPTS = [
  'Most likely to survive a zombie apocalypse',
  'Most likely to become famous',
  'Most likely to cry during a movie',
  'Most likely to forget their own birthday',
  'Most likely to win a Nobel Prize',
  'Most likely to be late to their own wedding',
  'Most likely to accidentally start a fire',
  'Most likely to buy something ridiculous online at 3 AM'
];

function mount(container, player, onComplete, allPlayers = []) {
  const prompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
  const voters = allPlayers.filter(p => p.id !== player.id);
  let voteIndex = 0;
  let yesVotes = 0;

  function renderIntro() {
    container.innerHTML = `
      <div class="screen accent-violet">
        <p style="color: var(--accent); font-weight: bold; margin-bottom: 4px;">GROUP VOTE 🗳️</p>
        <h2>${escapeHtml(prompt)}:</h2>
        <h1 style="font-size: 2.2rem; color: var(--sun);">${escapeHtml(player.name)}</h1>
        <p style="color: var(--text-dim);">Pass the device to each other player to vote!</p>
        <button class="btn primary" id="start-voting">Start Voting</button>
      </div>
    `;
    container.querySelector('#start-voting').addEventListener('click', renderNextVoter);
  }

  function renderNextVoter() {
    if (voteIndex >= voters.length) {
      finish();
      return;
    }
    const voter = voters[voteIndex];
    container.innerHTML = `
      <div class="screen accent-violet">
        <h2>Pass to ${escapeHtml(voter.name)}</h2>
        <p style="font-size: 1.15rem; line-height: 1.4;">${escapeHtml(prompt)}?<br><br><strong style="font-size: 1.5rem; color: var(--sun);">${escapeHtml(player.name)}</strong></p>
        <button class="btn primary" id="vote-yes" style="margin-bottom: 8px;">👍 Yes</button>
        <button class="btn" id="vote-no">👎 No</button>
      </div>
    `;
    let voted = false;
    container.querySelector('#vote-yes').addEventListener('click', () => {
      if (voted) return;
      voted = true;
      navigator?.vibrate?.(30);
      yesVotes++;
      voteIndex++;
      renderNextVoter();
    });
    container.querySelector('#vote-no').addEventListener('click', () => {
      if (voted) return;
      voted = true;
      navigator?.vibrate?.(30);
      voteIndex++;
      renderNextVoter();
    });
  }

  function finish() {
    const totalVoters = voters.length;
    const majority = totalVoters > 0 && yesVotes > totalVoters / 2;
    const points = yesVotes * 5 + (majority ? 10 : 0);
    const summary = `${yesVotes} of ${totalVoters} voted Yes`;
    onComplete(points, { type: 'group-vote', prompt, yesVotes, totalVoters, summary });
  }

  renderIntro();
}

export default { id: 'group-vote', mount };
