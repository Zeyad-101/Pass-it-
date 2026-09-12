import { escapeHtml } from '../ui.js';

// [question, category emoji]
const QUESTIONS = [
  // Embarrassing / Confessions
  ["What is the most embarrassing thing you have ever done in public?", "😬"],
  ["What is the weirdest thing you have Googled in the last week?", "🔍"],
  ["What is a song you secretly love but would be embarrassed to admit?", "🎵"],
  ["Have you ever pretended to be sick to avoid something? What was it?", "🤒"],
  ["What is the longest you have gone without showering?", "🚿"],
  ["What food do you eat when no one is watching?", "🍕"],
  ["Have you ever walked into a glass door or window?", "🪟"],
  ["What is the most childish thing you still do?", "👶"],
  ["Have you ever laughed so hard you cried in public?", "😂"],
  ["What is something you have lied about to impress someone?", "🤥"],
  ["What is the pettiest thing you have ever done to someone?", "😈"],
  ["Have you ever pretended not to see someone in public to avoid them?", "👀"],
  // Wild & Extreme
  ["What is the most illegal thing you have ever done and got away with?", "🚔"],
  ["What is the weirdest dream you have ever had?", "💤"],
  ["If your search history was shown to everyone here right now, how worried would you be? (1-10)", "😰"],
  ["What is the last thing you deleted from your phone before someone could see it?", "🗑️"],
  ["Have you ever stalked someone on social media for more than 30 minutes straight?", "📱"],
  ["What is the most savage thing you have ever texted someone?", "📩"],
  ["What is something you have done that you hope your parents never find out about?", "🤫"],
  ["Have you ever blamed someone else for something you did?", "👉"],
  // Funny & Awkward
  ["What is the most awkward date you have ever been on?", "💔"],
  ["Describe the most awkward silence you have ever experienced.", "🤐"],
  ["What is something you believed as a child that turned out to be completely wrong?", "🧒"],
  ["What is the worst haircut or fashion choice you ever had?", "💇"],
  ["What is the most ridiculous reason you have ever cried?", "😭"],
  ["What is the dumbest argument you have ever had with someone?", "🗣️"],
  ["Have you ever been caught talking to yourself?", "💬"],
  ["What fictional character do you relate to way too much?", "🎬"],
  // Hot Takes & Opinions
  ["What is an unpopular opinion you genuinely hold?", "🔥"],
  ["What is a popular thing you just do not understand the hype about?", "🤷"],
  ["Who in this group would you call at 3am in an emergency?", "📞"],
  ["Who in this group would survive a zombie apocalypse the longest?", "🧟"],
  ["Rate everyone in this group from most to least likely to be famous (just say the order!)", "⭐"],
  // Self-Roast
  ["Roast yourself in 10 words or less.", "🔥"],
  ["What is your most annoying habit according to people who know you well?", "😤"],
  ["Describe yourself as a type of weather.", "🌤️"],
  ["If your life was a movie, what genre would it be and why?", "🎥"],
  ["What is the biggest lie you tell yourself?", "🪞"],
];

function mount(container, player, onComplete, allPlayers = []) {
  const [q, emoji] = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
  const voters = allPlayers.filter(p => p.id !== player.id);
  let voteIndex = 0;
  let yesVotes = 0;
  let answered = false;

  // Step 1: Show question to player privately
  container.innerHTML = `
    <div class="screen accent-coral">
      <p style="color:var(--accent); font-weight:bold; font-size:1rem; margin-bottom:4px;">TRUTH BOMB ${emoji}</p>
      <h2 style="margin:0 0 12px;">${escapeHtml(player.name)}, answer this out loud:</h2>
      <p style="font-size:1.2rem; font-weight:bold; line-height:1.4; background:rgba(0,0,0,0.15); padding:16px; border-radius:12px; margin:0 0 16px;">${escapeHtml(q)}</p>
      <p style="color:var(--text-dim); font-size:0.9rem; margin:0 0 16px;">Say your answer OUT LOUD to the group, then tap below.</p>
      <button class="btn primary" id="answered-btn">I answered it! ✅</button>
    </div>
  `;

  container.querySelector('#answered-btn').addEventListener('click', () => {
    if (answered) return;
    answered = true;
    if (voters.length === 0) {
      finish(0, 0);
      return;
    }
    renderVote();
  });

  function renderVote() {
    if (voteIndex >= voters.length) {
      finish(yesVotes, voters.length);
      return;
    }
    const voter = voters[voteIndex];
    container.innerHTML = `
      <div class="screen accent-coral">
        <h2>Pass to ${escapeHtml(voter.name)}</h2>
        <p style="font-size:0.95rem; color:var(--text-dim); margin:0 0 12px;">Did ${escapeHtml(player.name)} actually answer honestly?</p>
        <p style="font-size:1rem; line-height:1.35; margin:0 0 16px; font-style:italic;">"${escapeHtml(q)}"</p>
        <button class="btn primary" id="vote-legit" style="margin-bottom:10px;">😂 Yes, they answered!</button>
        <button class="btn" id="vote-dodge">🐔 They dodged it!</button>
      </div>
    `;
    let voted = false;
    container.querySelector('#vote-legit').addEventListener('click', () => {
      if (voted) return; voted = true;
      navigator?.vibrate?.(30);
      yesVotes++; voteIndex++;
      renderVote();
    });
    container.querySelector('#vote-dodge').addEventListener('click', () => {
      if (voted) return; voted = true;
      navigator?.vibrate?.(30);
      voteIndex++;
      renderVote();
    });
  }

  function finish(yes, total) {
    const majority = total > 0 && yes > total / 2;
    const pts = yes * 5 + (majority ? 15 : 0);
    onComplete(pts, {
      type: 'truth-bomb',
      question: q,
      yesVotes: yes,
      totalVoters: total,
      summary: `${yes}/${total} believed it (+${pts} pts)`
    });
  }
}

export default { id: 'truth-bomb', mount };
