export function renderPassScreen(container, playerName, onReady, roundInfo = null) {
  const roundBadge = roundInfo
    ? `<p style="font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.85rem; color: var(--text-dim); margin: 0;">Round ${roundInfo.currentRound} of ${roundInfo.totalRounds}</p>`
    : '';
  container.innerHTML = `
    <div class="screen">
      ${roundBadge}
      <h2>Pass the phone to</h2>
      <h1>${escapeHtml(playerName)}</h1>
      <p>Don't let anyone else see the screen!</p>
      <button class="btn primary" id="ready-btn">I'm Ready ▶</button>
    </div>
  `;
  let ready = false;
  container.querySelector('#ready-btn').addEventListener('click', () => {
    if (ready) return;
    ready = true;
    navigator?.vibrate?.(30);
    onReady();
  });
}

export function renderScoreReveal(container, points, onContinue, subtitle = '') {
  const sign = points >= 0 ? '+' : '';
  const subHtml = subtitle ? `<p style="font-size: 1.05rem; color: var(--ink); font-weight: 500;">${escapeHtml(subtitle)}</p>` : '';
  container.innerHTML = `
    <div class="screen accent-sun">
      <h1 class="score-pop">${sign}${points} pts</h1>
      ${subHtml}
      <button class="btn primary" id="continue-btn">Continue</button>
    </div>
  `;
  let continued = false;
  container.querySelector('#continue-btn').addEventListener('click', () => {
    if (continued) return;
    continued = true;
    navigator?.vibrate?.(30);
    onContinue();
  });
}

export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
