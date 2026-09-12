import { renderSetupScreen } from './players.js';
import { renderPassScreen, renderScoreReveal } from './ui.js';
import { createGameState, currentPlayer, recordResult, advanceTurn } from './game-state.js';
import { pickNextChallenge } from './challenges/index.js';
import { renderResults } from './results.js';

const app = document.getElementById('app');
let state = null;

function startGame(playerNames, roundCount) {
  state = createGameState(playerNames, roundCount);
  runTurn();
}

function runTurn() {
  const player = currentPlayer(state);
  renderPassScreen(app, player.name, () => runChallenge(player), {
    currentRound: state.currentRound,
    totalRounds: state.totalRounds
  });
}

function runChallenge(player) {
  const challenge = pickNextChallenge();
  challenge.mount(app, player, (points, meta) => {
    recordResult(state, points, meta);
    const subtitle = meta?.summary || '';
    renderScoreReveal(app, points, () => {
      const { done } = advanceTurn(state);
      if (done) {
        renderResults(app, state, () => renderSetupScreen(app, startGame));
      } else {
        runTurn();
      }
    }, subtitle);
  }, state.players);
}

renderSetupScreen(app, startGame);
