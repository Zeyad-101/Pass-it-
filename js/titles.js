export function assignTitles(state) {
  const titles = {};
  const taken = new Set();

  function assign(playerId, emoji, label) {
    if (taken.has(playerId)) return false;
    titles[playerId] = { emoji, label };
    taken.add(playerId);
    return true;
  }

  const byScoreDesc = [...state.players].sort((a, b) => b.score - a.score);
  const byScoreAsc = [...state.players].sort((a, b) => a.score - b.score);

  if (byScoreDesc[0]) assign(byScoreDesc[0].id, '🏆', 'The Winner');

  const clownCounts = {};
  state.log.forEach(entry => {
    if (entry.meta && entry.meta.falseStart) {
      clownCounts[entry.playerId] = (clownCounts[entry.playerId] || 0) + 1;
    }
  });
  const clownRanked = Object.entries(clownCounts).sort((a, b) => b[1] - a[1]);
  for (const [playerId, count] of clownRanked) {
    if (count > 0 && assign(Number(playerId), '😂', 'The Clown')) break;
  }

  const memoryPoints = {};
  state.log.forEach(entry => {
    if (entry.challengeType === 'memory-sequence') {
      memoryPoints[entry.playerId] = (memoryPoints[entry.playerId] || 0) + entry.points;
    }
  });
  const tryhardRanked = Object.entries(memoryPoints).sort((a, b) => b[1] - a[1]);
  for (const [playerId, pts] of tryhardRanked) {
    if (pts > 0 && assign(Number(playerId), '🧠', 'The Tryhard')) break;
  }

  const menaceVotes = {};
  state.log.forEach(entry => {
    if (entry.challengeType === 'group-vote' && entry.meta && entry.meta.yesVotes !== undefined) {
      menaceVotes[entry.playerId] = (menaceVotes[entry.playerId] || 0) + entry.meta.yesVotes;
    }
  });
  const menaceRanked = Object.entries(menaceVotes).sort((a, b) => b[1] - a[1]);
  for (const [playerId, votes] of menaceRanked) {
    if (votes > 0 && assign(Number(playerId), '😈', 'The Menace')) break;
  }

  const topScore = byScoreDesc[0] ? byScoreDesc[0].score : 0;
  for (const p of byScoreAsc) {
    if (p.score < topScore && assign(p.id, '💀', 'Most Useless Player')) break;
  }

  state.players.forEach(p => {
    if (!titles[p.id]) {
      titles[p.id] = { emoji: '🎲', label: 'Wildcard' };
    }
  });

  return titles;
}
