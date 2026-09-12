import { escapeHtml } from '../ui.js';

const CONFESSIONS = [
  "Confess the most embarrassing song on your playlist right now",
  "Confess the last time you ugly-cried and why",
  "Confess something you do in private that would shock people",
  "Confess your most irrational fear",
  "Confess the pettiest thing you have ever done for revenge",
  "Confess the most ridiculous thing you have spent money on",
  "Confess a lie you have told that spiralled out of control",
  "Confess your most embarrassing childhood memory",
  "Confess something you pretend to like but secretly hate",
  "Confess the last time you did something purely out of spite",
  "Confess a habit you have that you know is disgusting",
  "Confess the weirdest thing you have eaten on a dare or bet",
  "Confess something you have genuinely been jealous of",
  "Confess your most embarrassing autocorrect moment",
  "Confess the most awkward thing that has happened to you on a date",
  "Confess something you used to believe that was completely wrong",
  "Confess the last time you pretended to be busy to avoid someone",
  "Confess the most dramatic thing you have done over a small problem",
  "Confess something you have googled that you would never admit to",
  "Confess your most cringe teenage phase",
];

const DARES = [
  "Let someone in the group post a story on your behalf",
  "Do your best impression of someone in the room",
  "Speak in a foreign accent for the next 3 minutes",
  "Let the group give you a temporary nickname for the rest of the game",
  "Send a voice note to a random contact saying you miss them",
  "Call someone and say 'I have news' then hang up after 10 seconds",
  "Let the group change your lockscreen for the next round",
  "Do 15 squats right now while reciting the alphabet",
  "Text your most recent contact a random motivational quote",
  "Stand up and do a full 30-second runway walk",
  "Freestyle rap your name for 20 seconds",
  "Let someone in the group post a caption on your next photo",
  "Do your best villain laugh for 10 seconds",
  "Describe someone in the room using only food emojis",
  "Sing your next sentence in opera style",
  "Let the group write a tweet/post on your phone (they choose the topic)",
  "Stare at someone without smiling for 15 seconds",
  "Do a dramatic reading of the last notification on your phone",
  "Call your most recent contact and say 'Can you keep a secret?' then hang up",
  "Speak only in movie quotes for the next 5 minutes",
];

function mount(container, player, onComplete, allPlayers = []) {
  const confession = CONFESSIONS[Math.floor(Math.random() * CONFESSIONS.length)];
  const dare = DARES[Math.floor(Math.random() * DARES.length)];
  const voters = allPlayers.filter(p => p.id !== player.id);
  let chosen = null;
  let voted = false;

  container.innerHTML = `
    <div class="screen accent-coral">
      <p style="color:var(--accent); font-weight:bold; font-size:1rem; margin-bottom:4px;">CONFESS OR DARE \uD83D\uDEA8</p>
      <h2 style="margin:0 0 12px;">${escapeHtml(player.name)}, choose your fate:</h2>
      <div style="background:rgba(0,0,0,0.15); border-radius:12px; padding:14px; margin-bottom:12px; text-align:left;">
        <p style="font-weight:bold; margin:0 0 4px; color:var(--sun);">\uD83D\uDE33 CONFESS:</p>
        <p style="margin:0; font-size:1rem; line-height:1.4;">${escapeHtml(confession)}</p>
      </div>
      <p style="font-size:1.1rem; font-weight:bold; margin:0 0 10px;">OR</p>
      <div style="background:rgba(0,0,0,0.15); border-radius:12px; padding:14px; margin-bottom:16px; text-align:left;">
        <p style="font-weight:bold; margin:0 0 4px; color:var(--accent);">\uD83D\uDD25 DARE:</p>
        <p style="margin:0; font-size:1rem; line-height:1.4;">${escapeHtml(dare)}</p>
      </div>
      <button class="btn primary" id="pick-confess" style="margin-bottom:10px;">\uD83D\uDE33 I'll Confess!</button>
      <button class="btn" id="pick-dare">\uD83D\uDD25 I'll Do the Dare!</button>
    </div>
  `;

  container.querySelector('#pick-confess').addEventListener('click', () => {
    chosen = 'confess';
    showChosen(confession, 'CONFESS', '\uD83D\uDE33', 'Confess out loud, then let the group vote if they believed you were truly embarrassed!');
  });

  container.querySelector('#pick-dare').addEventListener('click', () => {
    chosen = 'dare';
    showChosen(dare, 'DARE', '\uD83D\uDD25', 'Do the dare! The group will vote if you actually did it.');
  });

  function showChosen(text, label, emoji, instruction) {
    container.innerHTML = `
      <div class="screen accent-coral">
        <p style="color:var(--accent); font-weight:bold; font-size:1rem; margin-bottom:4px;">${emoji} ${label} IN PROGRESS</p>
        <p style="font-size:1.1rem; font-weight:bold; line-height:1.4; background:rgba(0,0,0,0.15); padding:14px; border-radius:12px; margin:0 0 12px;">${escapeHtml(text)}</p>
        <p style="color:var(--text-dim); font-size:0.85rem; margin:0 0 18px;">${escapeHtml(instruction)}</p>
        <button class="btn primary" id="completed-btn">Done! Let them judge me \uD83D\uDE43</button>
      </div>
    `;
    container.querySelector('#completed-btn').addEventListener('click', () => {
      if (voters.length === 0) { finish(true, 0, 0); return; }
      startVoting(text);
    });
  }

  function startVoting(text) {
    let voteIndex = 0;
    let yesVotes = 0;

    function nextVoter() {
      if (voteIndex >= voters.length) { finish(yesVotes > voters.length / 2, yesVotes, voters.length); return; }
      const voter = voters[voteIndex];
      container.innerHTML = `
        <div class="screen accent-coral">
          <h2>Pass to ${escapeHtml(voter.name)}</h2>
          <p style="margin:0 0 8px; color:var(--text-dim);">${chosen === 'confess' ? 'Was the confession real and juicy?' : 'Did they actually do the dare?'}</p>
          <button class="btn primary" id="v-yes" style="margin-bottom:10px; padding:16px;">${chosen === 'confess' ? '\uD83D\uDE31 Fully believed it!' : '\uD83D\uDD25 They did it!'}</button>
          <button class="btn" id="v-no" style="padding:16px;">${chosen === 'confess' ? '\uD83D\uDE44 Sounds fake...' : '\uD83D\uDC14 Chickened out!'}</button>
        </div>
      `;
      let v = false;
      container.querySelector('#v-yes').addEventListener('click', () => {
        if (v) return; v = true;
        navigator?.vibrate?.(30);
        yesVotes++; voteIndex++;
        nextVoter();
      });
      container.querySelector('#v-no').addEventListener('click', () => {
        if (v) return; v = true;
        navigator?.vibrate?.(30);
        voteIndex++;
        nextVoter();
      });
    }
    nextVoter();
  }

  function finish(success, yes, total) {
    const pts = success ? 20 + yes * 5 : 5;
    navigator?.vibrate?.(success ? [40, 40, 40] : [80, 40, 80]);
    onComplete(pts, {
      type: 'confess-or-dare',
      chosen,
      success,
      yes,
      total,
      summary: success ? `${chosen} accepted! +${pts} pts` : `Didn't quite land... +${pts} pts`
    });
  }
}

export default { id: 'confess-or-dare', mount };
