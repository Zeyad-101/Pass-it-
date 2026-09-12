import reactionTap from './reaction-tap.js';
import quickFire from './quick-fire.js';
import memorySequence from './memory-sequence.js';
import groupVote from './group-vote.js';
import trivia from './trivia.js';
import charades from './charades.js';
import truthBomb from './truth-bomb.js';
import dare from './dare.js';
import emojiQuiz from './emoji-quiz.js';
import twoTruths from './two-truths.js';
import speedCount from './speed-count.js';
import hotSeat from './hot-seat.js';
import neverHaveI from './never-have-i.js';
import impersonator from './impersonator.js';
import finishLyric from './finish-lyric.js';
import taboo from './taboo.js';
import hotTakes from './hot-takes.js';
import wordChain from './word-chain.js';
import rankIt from './rank-it.js';
import phoneConfess from './phone-confess.js';
import describeMe from './describe-me.js';
import mathBlitz from './math-blitz.js';
import confessOrDare from './confess-or-dare.js';
import alphabetBlast from './alphabet-blast.js';

const ALL_CHALLENGES = [
  reactionTap, quickFire, memorySequence, groupVote,
  trivia, charades, truthBomb, dare, emojiQuiz,
  twoTruths, speedCount, hotSeat, neverHaveI,
  impersonator, finishLyric, taboo, hotTakes,
  wordChain, rankIt, phoneConfess, describeMe,
  mathBlitz, confessOrDare, alphabetBlast
];

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
