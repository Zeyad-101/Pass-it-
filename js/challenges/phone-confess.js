import { escapeHtml } from '../ui.js';

// Challenges that use the player's actual phone content
const TASKS = [
  { text: "Show everyone your most-used emoji", emoji: "\uD83D\uDE04", points: 10, how: "Open your keyboard and show the frequently used section" },
  { text: "Read your last 3 sent messages out loud", emoji: "\uD83D\uDCE4", points: 15, how: "Go to your messages and read them — no skipping!" },
  { text: "Show your most recent photo in your gallery", emoji: "\uD83D\uDCF7", points: 10, how: "Open photos and show the latest one" },
  { text: "Show your most-played song on Spotify/Apple Music", emoji: "\uD83C\uDFB5", points: 10, how: "Check your top songs or recently played" },
  { text: "Read out your most recent voice note", emoji: "\uD83C\uDFA4", points: 15, how: "Find a voice note and play it for everyone" },
  { text: "Show your screen time for this week", emoji: "\uD83D\uDCF1", points: 10, how: "Settings > Screen Time or Digital Wellbeing" },
  { text: "Show the last meme or video you sent to someone", emoji: "\uD83D\uDE02", points: 10, how: "Check your last chat and show the media" },
  { text: "Let the group go through your contacts and pick someone to text", emoji: "\uD83D\uDCDE", points: 20, how: "The group picks the contact. You approve what to send!" },
  { text: "Show your most-visited website or app this week", emoji: "\uD83C\uDF10", points: 10, how: "Check your browser history or screen time" },
  { text: "Read your most embarrassing autocorrect story or show a screenshot", emoji: "\uD83D\uDE31", points: 15, how: "Find an autocorrect fail in your messages" },
  { text: "Show the last Google search you made", emoji: "\uD83D\uDD0D", points: 15, how: "Open Google/browser and check history" },
  { text: "Let the group pick one app on your phone to delete (just kidding — but you have to agree to do it for 1 day)", emoji: "\uD83D\uDDD1\uFE0F", points: 20, how: "Group picks, you promise to avoid it for the day!" },
  { text: "Show your battery percentage — group gets points if it's below 30%", emoji: "\uD83D\uDD0B", points: 15, how: "Check your battery right now" },
  { text: "Do a dramatic reading of your most recent email", emoji: "\uD83D\uDCE7", points: 15, how: "Open email and read it like a Shakespearean actor" },
  { text: "Show your most cringe-worthy old photo", emoji: "\uD83D\uDE33", points: 20, how: "Dig into old photos — the older the better!" },
];

function mount(container, player, onComplete, allPlayers = []) {
  const task = TASKS[Math.floor(Math.random() * TASKS.length)];
  const voters = allPlayers.filter(p => p.id !== player.id);
  let voteIndex = 0;
  let doneVotes = 0;
  let started = false;

  container.innerHTML = `
    <div class="screen accent-grass">
      <p style="color:var(--accent); font-weight:bold; font-size:1rem; margin-bottom:4px;">PHONE CONFESS \uD83D\uDCF1</p>
      <p style="font-size:3rem; margin:6px 0;">${task.emoji}</p>
      <h2 style="margin:0 0 8px; font-size:1.25rem;">${escapeHtml(player.name)}, your task:</h2>
      <p style="font-size:1.15rem; font-weight:bold; line-height:1.4; margin:0 0 10px;">${escapeHtml(task.text)}</p>
      <p style="color:var(--text-dim); font-size:0.85rem; margin:0 0 18px; line-height:1.35;">How: ${escapeHtml(task.how)}</p>
      <button class="btn primary" id="done-task">Done! \u2705</button>
    </div>
  `;

  container.querySelector('#done-task').addEventListener('click', () => {
    if (started) return; started = true;
    if (voters.length === 0) { finish(true, 0, 0); return; }
    nextVoter();
  });

  function nextVoter() {
    if (voteIndex >= voters.length) { finish(doneVotes > voters.length / 2, doneVotes, voters.length); return; }
    const voter = voters[voteIndex];
    container.innerHTML = `
      <div class="screen accent-grass">
        <h2>Pass to ${escapeHtml(voter.name)}</h2>
        <p style="color:var(--text-dim); margin:0 0 10px;">Did ${escapeHtml(player.name)} actually do the task?</p>
        <p style="font-size:0.95rem; font-weight:bold; margin:0 0 18px;">"${escapeHtml(task.text)}"</p>
        <button class="btn primary" id="v-yes" style="margin-bottom:10px; padding:16px;">\uD83D\uDCF1 Yes, they did it!</button>
        <button class="btn" id="v-no" style="padding:16px;">\uD83D\uDE45 They chickened out!</button>
      </div>
    `;
    let voted = false;
    container.querySelector('#v-yes').addEventListener('click', () => {
      if (voted) return; voted = true;
      navigator?.vibrate?.(30);
      doneVotes++; voteIndex++;
      nextVoter();
    });
    container.querySelector('#v-no').addEventListener('click', () => {
      if (voted) return; voted = true;
      navigator?.vibrate?.(30);
      voteIndex++;
      nextVoter();
    });
  }

  function finish(success, yes, total) {
    const pts = success ? task.points : 0;
    navigator?.vibrate?.(success ? [40, 40, 40] : [80, 40, 80]);
    onComplete(pts, {
      type: 'phone-confess',
      task: task.text,
      success,
      summary: success ? `Task done! +${pts} pts` : `Didn't do it! +0 pts`
    });
  }
}

export default { id: 'phone-confess', mount };
