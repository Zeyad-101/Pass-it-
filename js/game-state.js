export function createGameState(players, roundCount) {
  return {
    players: players.map((name, i) => ({ id: i, name, score: 0 })),
    currentPlayerIndex: 0,
    currentRound: 1,
    totalRounds: roundCount,
    log: []
  };
}

export function currentPlayer(state) {
  return state.players[state.currentPlayerIndex];
}

export function recordResult(state, points, meta) {
  const player = currentPlayer(state);
  player.score += points;
  state.log.push({ playerId: player.id, challengeType: meta.type, points, meta });
}

export function advanceTurn(state) {
  state.currentPlayerIndex++;
  if (state.currentPlayerIndex >= state.players.length) {
    state.currentPlayerIndex = 0;
    state.currentRound++;
  }
  if (state.currentRound > state.totalRounds) {
    return { done: true };
  }
  return { done: false };
}
