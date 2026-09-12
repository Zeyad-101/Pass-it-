import { escapeHtml } from '../ui.js';

const COLORS = ['#ff5a5f', '#3aa6ff', '#ffc93c', '#3fb868'];

function mount(container, player, onComplete) {
  let sequence = [];
  let longestCorrect = 0;
  let playerInput = [];

  container.innerHTML = `
    <div class="screen accent-grass">
      <h2>${escapeHtml(player.name)}: Watch, then repeat!</h2>
      <div id="grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; width:220px; margin: 10px 0;"></div>
      <p id="status" style="font-size:1.2rem; min-height:1.5em; margin:0;">Get ready...</p>
    </div>
  `;
  const grid = container.querySelector('#grid');
  const status = container.querySelector('#status');

  COLORS.forEach((color, i) => {
    const tile = document.createElement('div');
    tile.dataset.index = i;
    tile.style.cssText = `background:${color}; height:100px; border-radius:14px; border:3px solid var(--ink); opacity:0.4; cursor:pointer; transition: opacity 0.15s ease, transform 0.1s ease;`;
    grid.appendChild(tile);
  });
  const tiles = grid.querySelectorAll('div');

  function flash(index) {
    return new Promise(resolve => {
      tiles[index].style.opacity = '1';
      tiles[index].style.transform = 'scale(1.05)';
      setTimeout(() => {
        tiles[index].style.opacity = '0.4';
        tiles[index].style.transform = 'scale(1)';
        setTimeout(resolve, 150);
      }, 400);
    });
  }

  async function playSequence() {
    status.textContent = 'Watch...';
    grid.style.pointerEvents = 'none';
    for (const idx of sequence) {
      await flash(idx);
    }
    status.textContent = 'Your turn!';
    grid.style.pointerEvents = 'auto';
    playerInput = [];
  }

  function nextRound() {
    sequence.push(Math.floor(Math.random() * COLORS.length));
    playSequence();
  }

  grid.addEventListener('click', (e) => {
    const idx = Number(e.target.dataset.index);
    if (Number.isNaN(idx)) return;

    tiles[idx].style.opacity = '1';
    navigator?.vibrate?.(25);
    setTimeout(() => {
      tiles[idx].style.opacity = '0.4';
    }, 200);

    playerInput.push(idx);
    const stepIndex = playerInput.length - 1;

    if (sequence[stepIndex] !== idx) {
      grid.style.pointerEvents = 'none';
      navigator?.vibrate?.([80, 40, 80]);
      status.textContent = `Game over! Reached length ${longestCorrect}`;
      setTimeout(() => {
        onComplete(longestCorrect * 5, {
          type: 'memory-sequence',
          longestCorrect,
          summary: longestCorrect > 0 ? `Completed length ${longestCorrect}` : 'Missed on first try'
        });
      }, 700);
      return;
    }

    if (playerInput.length === sequence.length) {
      longestCorrect = sequence.length;
      status.textContent = 'Correct! Next round...';
      grid.style.pointerEvents = 'none';
      setTimeout(nextRound, 700);
    }
  });

  setTimeout(nextRound, 800);
}

export default { id: 'memory-sequence', mount };
