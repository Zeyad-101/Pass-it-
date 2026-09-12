import { getRankedPlayers } from './scoring.js';
import { assignTitles } from './titles.js';
import { escapeHtml } from './ui.js';

const RANK_CLASSES = ['rank-1', 'rank-2', 'rank-3'];

export function renderResults(container, state, onPlayAgain) {
  const ranked = getRankedPlayers(state);
  const titles = assignTitles(state);

  let currentRank = 1;
  const rows = ranked.map((p, i) => {
    if (i > 0 && p.score < ranked[i - 1].score) {
      currentRank = i + 1;
    }
    const rankClass = currentRank <= 3 ? RANK_CLASSES[currentRank - 1] : '';
    return `
      <div class="result-row ${rankClass}">
        <span class="result-rank">#${currentRank}</span>
        <span class="result-name">${escapeHtml(p.name)}</span>
        <span class="result-score">${p.score} pts</span>
        <span class="result-title">${titles[p.id].emoji} ${escapeHtml(titles[p.id].label)}</span>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="screen accent-sun">
      <h1>Final Results 🏁</h1>
      <div class="player-list">${rows}</div>
      <button class="btn primary" id="play-again">Play Again 🔄</button>
    </div>
  `;
  let resetting = false;
  container.querySelector('#play-again').addEventListener('click', () => {
    if (resetting) return;
    resetting = true;
    navigator?.vibrate?.(30);
    onPlayAgain();
  });
}
