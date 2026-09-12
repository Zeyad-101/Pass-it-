import { escapeHtml } from '../ui.js';

const QUESTIONS = [
  // Food & Drink
  ['Pizza 🍕', 'Tacos 🌮'],
  ['Coffee ☕', 'Tea 🍵'],
  ['Pancakes 🥞', 'Waffles 🧇'],
  ['Chocolate 🍫', 'Gummy bears 🐻'],
  ['Sushi 🍣', 'Burger 🍔'],
  ['Ice cream 🍦', 'Cake 🎂'],
  ['Sweet 🍩', 'Salty 🍟'],
  ['Cook at home 🍳', 'Eat out 🍽️'],
  ['Hot food 🌶️', 'Cold food 🧊'],
  ['Breakfast for dinner 🥞', 'Dinner for breakfast 🍗'],
  ['Spicy 🔥', 'Mild 🌿'],
  ['Juice 🍹', 'Soda 🥤'],
  // Travel & Lifestyle
  ['Beach vacation 🏖️', 'Mountain vacation 🏔️'],
  ['Road trip 🚗', 'Flight ✈️'],
  ['City life 🏙️', 'Countryside 🌾'],
  ['Travel alone 🎒', 'Travel with friends 👫'],
  ['Luxury hotel 🏨', 'Camping tent ⛺'],
  ['Early bird 🌅', 'Night owl 🦉'],
  ['Fast life ⚡', 'Slow life 🐢'],
  // Tech & Entertainment
  ['Texting 💬', 'Calling 📞'],
  ['Android 🤖', 'iPhone 🍎'],
  ['Netflix 🎬', 'YouTube 📺'],
  ['Books 📚', 'Movies 🎬'],
  ['Video games 🎮', 'Board games 🎲'],
  ['Podcast 🎙️', 'Music 🎵'],
  ['Social media 📱', 'No social media 🚫'],
  ['Work from home 🏠', 'Work at office 🏢'],
  ['E-book 📖', 'Paper book 📗'],
  // Animals & Nature
  ['Cats 🐱', 'Dogs 🐶'],
  ['Birds 🦜', 'Fish 🐠'],
  ['Rabbits 🐰', 'Hamsters 🐹'],
  ['Forest 🌲', 'Desert 🏜️'],
  ['Sea 🌊', 'Lake 🏞️'],
  // Fashion & Style
  ['Sneakers 👟', 'Boots 👢'],
  ['Summer ☀️', 'Winter ❄️'],
  ['Jeans 👖', 'Sweatpants 🩳'],
  ['Minimal style 🤍', 'Bold colours 🌈'],
  // Superpowers & Fun
  ['Fly ✈️', 'Be invisible 👻'],
  ['Read minds 🧠', 'See the future 🔮'],
  ['Time travel to past ⏮️', 'Time travel to future ⏭️'],
  ['Super speed ⚡', 'Super strength 💪'],
  ['Talk to animals 🐾', 'Speak all languages 🗣️'],
  // Personality
  ['Always be honest 😇', 'Always be kind 🥰'],
  ['Famous 🌟', 'Rich 💰'],
  ['Lots of friends 👥', 'One best friend 🤝'],
  ['Know everything 🧠', 'Experience everything 🎡'],
  // Random & Wild
  ['No phone for a week 📵', 'No Wi-Fi for a week 🚫'],
  ['Always speak in rhymes 🎤', 'Always speak in questions ❓'],
  ['Win the lottery 🎰', 'Live 200 years 🧬'],
  ['Be a superhero 🦸', 'Be a villain 🦹'],
  ['Own a dragon 🐉', 'Own a unicorn 🦄'],
  ['Live underwater 🌊', 'Live in space 🚀'],
  ['Restart your life 🔄', 'Fast-forward 10 years ⏩'],
  ['Always win arguments 🏆', 'Always be happy 😊'],
  ['Eat one food forever 🥗', 'Never eat your fav food 💔'],
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
