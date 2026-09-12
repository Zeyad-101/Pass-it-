import { escapeHtml } from '../ui.js';

// Funny prompt categories to inspire players
const PROMPTS = [
  "Something embarrassing that happened to you",
  "A weird food combination you actually like",
  "A secret talent or skill you have",
  "Something crazy you did as a kid",
  "A wild travel or adventure story",
  "A celebrity or famous person you have met or almost met",
  "Something about your daily routine people would find surprising",
  "A fear or phobia you have (real or fake)",
  "A record or achievement (real or made up) you hold",
  "Something about yourself nobody in this room knows",
  "A strange habit you have at home",
  "Something that happened to you that sounds fake but is true",
  "A bold claim about your skills",
  "Something you genuinely believe that most people disagree with",
];

function mount(container, player, onComplete, allPlayers = []) {
  const prompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
  const voters = allPlayers.filter(p => p.id !== player.id);
  let voteIndex = 0;
  let lieGuesses = {};
  let lieIndex = null; // 0, 1, or 2 — index of the lie
  let submitted = false;

  // Step 1: Player enters their 2 truths + 1 lie
  container.innerHTML = `
    <div class="screen accent-violet">
      <p style="color:var(--accent); font-weight:bold; font-size:1rem; margin-bottom:4px;">2 TRUTHS 1 LIE \uD83D\uDD75\uFE0F</p>
      <h2 style="margin:0 0 6px;">${escapeHtml(player.name)}, write 3 statements:</h2>
      <p style="color:var(--text-dim); font-size:0.85rem; margin:0 0 4px;">Hint: <em>${escapeHtml(prompt)}</em></p>
      <p style="color:var(--text-dim); font-size:0.8rem; margin:0 0 12px;">Two must be TRUE, one must be a LIE. Others will guess which is the lie!</p>
      <input class="btn" id="s1" type="text" placeholder="Statement 1" style="text-align:left; margin-bottom:8px; padding:12px; font-size:1rem; width:100%; box-sizing:border-box;" maxlength="80"/>
      <input class="btn" id="s2" type="text" placeholder="Statement 2" style="text-align:left; margin-bottom:8px; padding:12px; font-size:1rem; width:100%; box-sizing:border-box;" maxlength="80"/>
      <input class="btn" id="s3" type="text" placeholder="Statement 3 (make one a lie!)" style="text-align:left; margin-bottom:12px; padding:12px; font-size:1rem; width:100%; box-sizing:border-box;" maxlength="80"/>
      <p style="color:var(--text-dim); font-size:0.85rem; margin:0 0 6px;">Which one is the lie?</p>
      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:14px;">
        <button class="btn" id="lie-0" data-lie="0">Stmt 1</button>
        <button class="btn" id="lie-1" data-lie="1">Stmt 2</button>
        <button class="btn" id="lie-2" data-lie="2">Stmt 3</button>
      </div>
      <button class="btn primary" id="submit-btn" disabled>Start Voting \u27A1\uFE0F</button>
    </div>
  `;

  const submitBtn = container.querySelector('#submit-btn');
  const lieButtons = container.querySelectorAll('[data-lie]');

  lieButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      lieIndex = Number(btn.dataset.lie);
      lieButtons.forEach(b => b.style.background = '');
      btn.style.background = 'var(--accent)';
      btn.style.color = 'var(--ink)';
      tryEnable();
    });
  });

  ['s1', 's2', 's3'].forEach(id => {
    container.querySelector('#' + id).addEventListener('input', tryEnable);
  });

  function tryEnable() {
    const s1 = container.querySelector('#s1')?.value.trim();
    const s2 = container.querySelector('#s2')?.value.trim();
    const s3 = container.querySelector('#s3')?.value.trim();
    submitBtn.disabled = !(s1 && s2 && s3 && lieIndex !== null);
  }

  submitBtn.addEventListener('click', () => {
    if (submitted) return;
    submitted = true;
    const statements = [
      container.querySelector('#s1').value.trim(),
      container.querySelector('#s2').value.trim(),
      container.querySelector('#s3').value.trim(),
    ];
    startVoting(statements);
  });

  function startVoting(statements) {
    if (voters.length === 0) {
      finish(statements, {});
      return;
    }
    renderNextVoter(statements);
  }

  function renderNextVoter(statements) {
    if (voteIndex >= voters.length) {
      finish(statements, lieGuesses);
      return;
    }
    const voter = voters[voteIndex];
    container.innerHTML = `
      <div class="screen accent-violet">
        <h2>Pass to ${escapeHtml(voter.name)}</h2>
        <p style="color:var(--text-dim); font-size:0.9rem; margin:0 0 10px;">Which one is ${escapeHtml(player.name)}'s LIE?</p>
        ${statements.map((s, i) => `
          <button class="btn" data-vote="${i}" style="text-align:left; margin-bottom:8px; padding:14px; font-size:0.95rem; width:100%; line-height:1.3; box-sizing:border-box;">
            <strong>${i + 1}.</strong> ${escapeHtml(s)}
          </button>
        `).join('')}
      </div>
    `;
    let voted = false;
    container.querySelectorAll('[data-vote]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (voted) return; voted = true;
        navigator?.vibrate?.(30);
        lieGuesses[voter.id] = Number(btn.dataset.vote);
        voteIndex++;
        renderNextVoter(statements);
      });
    });
  }

  function finish(statements, guesses) {
    const voterIds = Object.keys(guesses);
    const fooled = voterIds.filter(id => Number(guesses[id]) !== lieIndex).length;
    const total = voterIds.length;
    const pts = fooled * 10 + (total > 0 && fooled === total ? 15 : 0);
    navigator?.vibrate?.(pts > 0 ? [40, 40, 40] : [80, 40, 80]);

    const correctVoters = voterIds.filter(id => Number(guesses[id]) === lieIndex)
      .map(id => allPlayers.find(p => p.id === Number(id))?.name).filter(Boolean);

    onComplete(pts, {
      type: 'two-truths',
      lie: statements[lieIndex],
      fooled,
      total,
      correctGuessers: correctVoters,
      summary: `Fooled ${fooled}/${total} players! +${pts} pts`
    });
  }
}

export default { id: 'two-truths', mount };
