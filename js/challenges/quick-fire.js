import { escapeHtml } from '../ui.js';

const QUESTIONS = [
  ['Pizza 🍕', 'Tacos 🌮'],
  ['Beach vacation 🏖️', 'Mountain vacation 🏔️'],
  ['Texting 💬', 'Calling 📞'],
  ['Coffee ☕', 'Tea 🍵'],
  ['Cats 🐱', 'Dogs 🐶'],
  ['Early bird 🌅', 'Night owl 🦉'],
  ['Sweet 🍩', 'Salty 🍟'],
  ['Books 📚', 'Movies 🎬'],
  ['Android 🤖', 'iPhone 🍎'],
  ['Summer ☀️', 'Winter ❄️'],
  ['Sneakers 👟', 'Boots 👢'],
  ['Pancakes 🥞', 'Waffles 🧇']
];

function mount(container, player, onComplete) {
  const [a, b] = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
  let finished = false;
  container.innerHTML = `
    <div class="screen accent-sun">
      <h2>${escapeHtml(player.name)}, pick one:</h2>
      <button class="btn primary" id="choice-a" style="font-size:1.4rem; padding:24px;">${escapeHtml(a)}</button>
      <button class="btn primary" id="choice-b" style="font-size:1.4rem; padding:24px;">${escapeHtml(b)}</button>
    </div>
  `;
  const finish = (choice, label) => {
    if (finished) return;
    finished = true;
    navigator?.vibrate?.(30);
    onComplete(10, { type: 'quick-fire', question: `${a} vs ${b}`, choice: label, summary: choice });
  };
  container.querySelector('#choice-a').addEventListener('click', () => finish(a, 'A'));
  container.querySelector('#choice-b').addEventListener('click', () => finish(b, 'B'));
}

export default { id: 'quick-fire', mount };
