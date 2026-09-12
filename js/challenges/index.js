import reactionTap from './reaction-tap.js';
import quickFire from './quick-fire.js';
import memorySequence from './memory-sequence.js';
import groupVote from './group-vote.js';

const ALL_CHALLENGES = [reactionTap, quickFire, memorySequence, groupVote];

let pool = shuffle(ALL_CHALLENGES.map(c => c.id));

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickNextChallenge() {
  if (pool.length === 0) {
    pool = shuffle(ALL_CHALLENGES.map(c => c.id));
  }
  const id = pool.pop();
  return ALL_CHALLENGES.find(c => c.id === id);
}

export { ALL_CHALLENGES };
