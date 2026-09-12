import { escapeHtml } from '../ui.js';

// [dare text, time in seconds (0 = no timer)]
const DARES = [
  // Physical / Silly
  ["Do your best robot dance for 10 seconds", 12],
  ["Walk like a crab around the room for 10 seconds", 12],
  ["Do 10 jumping jacks while making animal noises", 15],
  ["Speak in a different accent for the next 2 rounds", 0],
  ["Do your best catwalk strut across the room", 10],
  ["Make the ugliest face you can and hold it for 5 seconds", 7],
  ["Pretend you are a TV reporter and report on what is happening right now", 15],
  ["Do a dramatic slow-motion fall to the ground", 8],
  ["Moonwalk from one side of the room to the other", 10],
  ["Wiggle your hips for 10 seconds non-stop", 12],
  ["Pretend to be a zombie and walk toward someone", 10],
  ["Do your best impression of a baby learning to walk", 10],
  ["Try to lick your elbow for 5 seconds", 7],
  // Voice / Performance
  ["Sing the chorus of any song like an opera singer", 15],
  ["Say the alphabet backwards as fast as you can", 20],
  ["Talk in slow motion for the next 30 seconds", 0],
  ["Beatbox for 10 seconds", 12],
  ["Narrate everything you are doing right now like a nature documentary", 15],
  ["Say tongue twister 3x fast: 'She sells seashells by the seashore'", 15],
  ["Say tongue twister 3x fast: 'How can a clam cram in a clean cream can?'", 15],
  ["Say tongue twister 3x fast: 'Fuzzy Wuzzy was a bear'", 10],
  ["Speak only in questions for the next 60 seconds", 0],
  // Social & Interaction
  ["Give everyone in the group a genuine compliment in under 20 seconds", 22],
  ["Let the group go through your most recent photos for 10 seconds", 0],
  ["Text someone random from your contacts a single emoji, right now", 0],
  ["Show everyone your most used emoji in your keyboard", 0],
  ["Do your best impression of the person to your left", 10],
  ["Try to make someone in the group laugh in 10 seconds", 12],
  ["Stare at someone without blinking for 10 seconds", 12],
  ["Give someone a 30-second motivational speech", 32],
  // Wild Card
  ["Put an ice cube on your neck and keep it there for 10 seconds", 12],
  ["Eat something spicy if available, otherwise do 15 push-ups", 0],
  ["Let the group DM someone on your behalf (they choose what to say)", 0],
  ["Hold a plank for 20 seconds", 22],
  ["Do 5 push-ups or 10 squats right now", 20],
  ["Speak only in rhymes for the next 2 minutes", 0],
  ["Let the group rename your phone wallpaper to something they choose (for 1 minute)", 0],
  ["Pretend you are on a cooking show and narrate making your last meal", 20],
  ["Freestyle rap for 15 seconds about the person next to you", 17],
  ["Act out a scene from your favourite movie in 15 seconds", 17],
];

function mount(container, player, onComplete, allPlayers = []) {
  const [dare, timeLimit] = DARES[Math.floor(Math.random() * DARES.length)];
  const voters = allPlayers.filter(p => p.id !== player.id);
  let dareAccepted = false;
  let timerInterval;
  let timeLeft = timeLimit;
  let dareStarted = false;

  function renderDare() {
    container.innerHTML = `
      <div class="screen accent-violet">
        <p style="color:var(--accent); font-weight:bold; font-size:1rem; margin-bottom:4px;">DARE \uD83D\uDD25</p>
        <h2 style="margin:0 0 12px;">${escapeHtml(player.name)}'s dare:</h2>
        <p style="font-size:1.15rem; font-weight:bold; line-height:1.4; background:rgba(0,0,0,0.15); padding:16px; border-radius:12px; margin:0 0 16px;">${escapeHtml(dare)}</p>
        ${timeLimit > 0 ? `<p style="color:var(--text-dim); font-size:0.9rem; margin:0 0 16px;">\u23F1 You have ${timeLimit} seconds!</p>` : '<p style="color:var(--text-dim); font-size:0.9rem; margin:0 0 16px;">\u267E\uFE0F No timer \u2014 take your time!</p>'}
        <button class="btn primary" id="start-dare">Let's Go! \uD83D\uDD25</button>
      </div>
    `;
    container.querySelector('#start-dare').addEventListener('click', startDare);
  }

  function startDare() {
    if (dareStarted) return;
    dareStarted = true;
    navigator?.vibrate?.(50);

    if (timeLimit > 0) {
      renderTimer();
    } else {
      renderNoTimer();
    }
  }

  function renderTimer() {
    container.innerHTML = `
      <div class="screen accent-violet">
        <p style="font-size:1.1rem; font-weight:bold; line-height:1.4; margin:0 0 12px; font-style:italic;">"${escapeHtml(dare)}"</p>
        <div style="width:100%; background:var(--ink); border-radius:8px; height:14px; margin:10px 0 8px;">
          <div id="timer-bar" style="height:14px; border-radius:8px; background:#ff5a5f; width:100%; transition:width ${timeLimit}s linear;"></div>
        </div>
        <p id="timer-text" style="font-size:2.5rem; font-weight:900; margin:0 0 16px;">${timeLeft}</p>
        <button class="btn primary" id="done-btn">Done! \u2705</button>
      </div>
    `;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const bar = container.querySelector('#timer-bar');
      if (bar) bar.style.width = '0%';
    }));

    timerInterval = setInterval(() => {
      timeLeft--;
      const tt = container.querySelector('#timer-text');
      if (tt) tt.textContent = timeLeft;
      if (timeLeft <= 5) navigator?.vibrate?.(20);
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        renderVote();
      }
    }, 1000);

    container.querySelector('#done-btn').addEventListener('click', () => {
      clearInterval(timerInterval);
      renderVote();
    });
  }

  function renderNoTimer() {
    container.innerHTML = `
      <div class="screen accent-violet">
        <p style="font-size:1.1rem; font-weight:bold; line-height:1.4; margin:0 0 20px; font-style:italic;">"${escapeHtml(dare)}"</p>
        <p style="color:var(--text-dim); font-size:0.9rem; margin:0 0 16px;">Do the dare, then tap when done.</p>
        <button class="btn primary" id="done-btn">Done! \u2705</button>
      </div>
    `;
    container.querySelector('#done-btn').addEventListener('click', renderVote);
  }

  function renderVote() {
    let voteIndex = 0;
    let yesVotes = 0;

    if (voters.length === 0) {
      finish(true, 0, 0);
      return;
    }

    function nextVoter() {
      if (voteIndex >= voters.length) {
        finish(yesVotes > voters.length / 2, yesVotes, voters.length);
        return;
      }
      const voter = voters[voteIndex];
      container.innerHTML = `
        <div class="screen accent-violet">
          <h2>Pass to ${escapeHtml(voter.name)}</h2>
          <p style="font-size:0.95rem; line-height:1.35; margin:0 0 16px; color:var(--text-dim);">Did ${escapeHtml(player.name)} actually do the dare?</p>
          <button class="btn primary" id="v-yes" style="margin-bottom:10px;">\uD83D\uDD25 Yes they did!</button>
          <button class="btn" id="v-no">\uD83D\uDE05 They chickened out!</button>
        </div>
      `;
      let voted = false;
      container.querySelector('#v-yes').addEventListener('click', () => {
        if (voted) return; voted = true;
        navigator?.vibrate?.(30);
        yesVotes++; voteIndex++;
        nextVoter();
      });
      container.querySelector('#v-no').addEventListener('click', () => {
        if (voted) return; voted = true;
        navigator?.vibrate?.(30);
        voteIndex++;
        nextVoter();
      });
    }
    nextVoter();
  }

  function finish(success, yes, total) {
    const pts = success ? 25 : 0;
    navigator?.vibrate?.(success ? [40, 40, 40] : [100, 50, 100]);
    onComplete(pts, {
      type: 'dare',
      dare,
      success,
      yesVotes: yes,
      totalVoters: total,
      summary: success ? `Dare done! +${pts} pts` : 'Chickened out! +0 pts'
    });
  }

  renderDare();
}

export default { id: 'dare', mount };
