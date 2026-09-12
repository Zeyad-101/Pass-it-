import { escapeHtml } from '../ui.js';

function scoreFor(reactionMs) {
  if (reactionMs < 250) return 20;
  if (reactionMs < 400) return 15;
  if (reactionMs < 600) return 10;
  return 5;
}

function mount(container, player, onComplete) {
  container.innerHTML = `
    <div class="screen accent-coral">
      <h2>${escapeHtml(player.name)}'s turn</h2>
      <div id="tap-zone" class="btn" style="height: 240px; display:flex; align-items:center; justify-content:center; font-size:1.6rem; user-select:none; cursor:pointer;">
        Wait for it...
      </div>
    </div>
  `;
  const zone = container.querySelector('#tap-zone');
  let armedAt = null;
  let finished = false;
  const delay = 1500 + Math.random() * 2500;

  const timer = setTimeout(() => {
    zone.textContent = 'TAP NOW! 👆';
    zone.style.background = 'var(--accent)';
    zone.style.borderColor = 'var(--ink)';
    zone.style.boxShadow = '4px 4px 0 var(--ink)';
    armedAt = performance.now();
    navigator?.vibrate?.(30);
  }, delay);

  zone.addEventListener('click', () => {
    if (finished) return;
    finished = true;

    if (armedAt === null) {
      clearTimeout(timer);
      navigator?.vibrate?.([100, 50, 100]);
      zone.textContent = 'FALSE START! ⚠️';
      zone.style.background = '#3a1020';
      setTimeout(() => {
        onComplete(0, { type: 'reaction-tap', reactionMs: null, falseStart: true, summary: 'False start!' });
      }, 800);
      return;
    }

    navigator?.vibrate?.(40);
    const reactionMs = performance.now() - armedAt;
    const pts = scoreFor(reactionMs);
    zone.textContent = `${Math.round(reactionMs)}ms! (+${pts} pts)`;
    setTimeout(() => {
      onComplete(pts, { type: 'reaction-tap', reactionMs, falseStart: false, summary: `${Math.round(reactionMs)}ms reaction` });
    }, 800);
  });
}

export default { id: 'reaction-tap', mount };
