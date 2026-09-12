import { escapeHtml } from '../ui.js';

const PROMPTS = [
  // Classic "most likely to"
  'Most likely to survive a zombie apocalypse',
  'Most likely to become famous',
  'Most likely to cry during a movie',
  'Most likely to forget their own birthday',
  'Most likely to win a Nobel Prize',
  'Most likely to be late to their own wedding',
  'Most likely to accidentally start a fire',
  'Most likely to buy something ridiculous online at 3 AM',
  'Most likely to go viral on TikTok',
  'Most likely to eat an entire pizza alone',
  'Most likely to accidentally text the wrong person',
  'Most likely to become a millionaire',
  'Most likely to move to another country',
  'Most likely to sleep through an earthquake',
  'Most likely to get lost using GPS',
  'Most likely to talk to a stranger on a plane for 5 hours',
  'Most likely to adopt 10 cats',
  'Most likely to become a chef',
  'Most likely to binge-watch an entire series in one day',
  'Most likely to invent something cool',
  'Most likely to run a marathon',
  'Most likely to forget why they walked into a room',
  'Most likely to laugh at a funeral',
  'Most likely to become a reality TV star',
  'Most likely to own a boat',
  'Most likely to talk their way out of anything',
  'Most likely to try every food on the menu',
  'Most likely to be the last to know the gossip',
  'Most likely to start a cult accidentally',
  'Most likely to have the messiest room',
  'Most likely to cry at a commercial',
  'Most likely to win a dance-off',
  'Most likely to get a tattoo they regret',
  'Most likely to be a secret agent',
  'Most likely to name their kid something completely unexpected',
  'Most likely to end up on a true crime podcast',
  'Most likely to bring the whole squad together',
  'Most likely to fall asleep during a movie',
  'Most likely to be caught singing in the car',
  'Most likely to become a travel influencer',
  'Most likely to order the weirdest thing on the menu',
  'Most likely to befriend a wild animal',
  'Most likely to overthink a simple decision',
  'Most likely to win a game show',
  'Most likely to be the group therapist',
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
