export function getRankedPlayers(state) {
  return [...state.players].sort((a, b) => b.score - a.score);
}
