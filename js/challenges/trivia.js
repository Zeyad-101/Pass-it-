import { escapeHtml } from '../ui.js';

// [question, correct answer, wrong1, wrong2, wrong3]
const TRIVIA = [
  // Geography
  ["What is the capital of Australia?", "Canberra", "Sydney", "Melbourne", "Perth"],
  ["Which country has the most natural lakes?", "Canada", "Russia", "Brazil", "USA"],
  ["What is the longest river in the world?", "Nile", "Amazon", "Yangtze", "Mississippi"],
  ["Which continent is the largest?", "Asia", "Africa", "Europe", "North America"],
  ["What country has the most islands?", "Sweden", "Philippines", "Japan", "Indonesia"],
  ["Which ocean is the deepest?", "Pacific", "Atlantic", "Indian", "Arctic"],
  ["What is the smallest country in the world?", "Vatican City", "Monaco", "San Marino", "Liechtenstein"],
  // Science
  ["How many bones are in the adult human body?", "206", "208", "198", "215"],
  ["What is the chemical symbol for gold?", "Au", "Ag", "Go", "Gd"],
  ["What planet is closest to the Sun?", "Mercury", "Venus", "Mars", "Earth"],
  ["How many hearts does an octopus have?", "3", "1", "2", "4"],
  ["What gas do plants absorb from the air?", "Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"],
  ["What is the speed of light (approx)?", "300,000 km/s", "150,000 km/s", "450,000 km/s", "200,000 km/s"],
  ["Which element is the most abundant in the universe?", "Hydrogen", "Helium", "Oxygen", "Carbon"],
  ["What is the hardest natural substance?", "Diamond", "Quartz", "Titanium", "Ruby"],
  // Pop Culture
  ['Who sang "Shape of You"?', "Ed Sheeran", "Justin Bieber", "Bruno Mars", "Harry Styles"],
  ["What is the best-selling video game of all time?", "Minecraft", "Tetris", "GTA V", "Wii Sports"],
  ["How many seasons does Game of Thrones have?", "8", "7", "6", "9"],
  ["In what year was the first iPhone released?", "2007", "2005", "2008", "2006"],
  ["Who plays Iron Man in the MCU?", "Robert Downey Jr.", "Chris Evans", "Mark Ruffalo", "Chris Hemsworth"],
  ['What movie features the line "Just keep swimming"?', "Finding Nemo", "Shark Tale", "The Little Mermaid", "Finding Dory"],
  // History
  ["Who was the first person on the Moon?", "Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "Michael Collins"],
  ["In what year did World War II end?", "1945", "1943", "1944", "1946"],
  ["Who painted the Mona Lisa?", "Leonardo da Vinci", "Michelangelo", "Raphael", "Caravaggio"],
  ["What ancient wonder was in Alexandria?", "The Lighthouse", "The Colossus", "The Temple of Artemis", "The Hanging Gardens"],
  ["Who invented the telephone?", "Alexander Graham Bell", "Thomas Edison", "Nikola Tesla", "Guglielmo Marconi"],
  // Animals
  ["What is a group of flamingos called?", "A flamboyance", "A flock", "A gaggle", "A colony"],
  ["How long is an elephant pregnant?", "22 months", "12 months", "18 months", "9 months"],
  ["Which bird can fly backwards?", "Hummingbird", "Sparrow", "Parrot", "Eagle"],
  ["What is the fastest land animal?", "Cheetah", "Lion", "Pronghorn", "Greyhound"],
  // Food
  ["Where did pizza originate?", "Italy", "Greece", "France", "Spain"],
  ["What is the main ingredient in guacamole?", "Avocado", "Lime", "Tomato", "Onion"],
  ["Which nut is used to make marzipan?", "Almond", "Walnut", "Cashew", "Hazelnut"],
  ["What country invented sushi?", "Japan", "China", "Korea", "Thailand"],
  // Math & Numbers
  ["How many sides does a hexagon have?", "6", "5", "7", "8"],
  ["What is 12 x 12?", "144", "124", "148", "136"],
  ["What is the square root of 169?", "13", "11", "14", "12"],
  ["How many zeros in one million?", "6", "5", "7", "8"],
  // Random Fun
  ["What colour is a polar bear skin?", "Black", "White", "Pink", "Clear"],
  ["How many strings does a standard guitar have?", "6", "4", "5", "7"],
  ["What is the world most spoken language?", "Mandarin Chinese", "English", "Spanish", "Hindi"],
  ["How many players are on a basketball team on court?", "5", "6", "4", "7"],
  ["What year did the Titanic sink?", "1912", "1910", "1914", "1908"],
  ["What is the capital of Japan?", "Tokyo", "Kyoto", "Osaka", "Hiroshima"],
  ["How many days are in a leap year?", "366", "365", "364", "367"],
  ["What planet has rings?", "Saturn", "Jupiter", "Uranus", "Neptune"],
  ["How many continents are there?", "7", "6", "5", "8"],
  ["What is the national animal of Australia?", "Kangaroo", "Koala", "Wombat", "Emu"],
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function mount(container, player, onComplete) {
  const [question, correct, ...wrongs] = TRIVIA[Math.floor(Math.random() * TRIVIA.length)];
  const answers = shuffle([correct, ...wrongs]);
  const TIME_LIMIT = 15;
  let finished = false;
  let timeLeft = TIME_LIMIT;
  let timerInterval;

  function render() {
    container.innerHTML = `
      <div class="screen accent-grass">
        <p style="color: var(--accent); font-weight: bold; margin-bottom: 4px; font-size:1rem;">TRIVIA &#x1F9E0;</p>
        <p style="font-size:1.15rem; font-weight:bold; margin: 0 0 10px; line-height:1.35;">${escapeHtml(player.name)}: ${escapeHtml(question)}</p>
        <div id="timer-bar-wrap" style="width:100%; background:var(--ink); border-radius:8px; height:10px; margin-bottom:8px;">
          <div id="timer-bar" style="height:10px; border-radius:8px; background:var(--accent); width:100%; transition:width ${TIME_LIMIT}s linear;"></div>
        </div>
        <p id="timer-text" style="margin:0 0 12px; font-size:0.95rem; color:var(--text-dim);">&#x23F1; ${timeLeft}s</p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          ${answers.map(a => `<button class="btn" data-answer="${escapeHtml(a)}" style="font-size:0.95rem; padding:14px 8px; line-height:1.2;">${escapeHtml(a)}</button>`).join('')}
        </div>
      </div>
    `;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const bar = container.querySelector('#timer-bar');
        if (bar) bar.style.width = '0%';
      });
    });

    timerInterval = setInterval(() => {
      timeLeft--;
      const timerText = container.querySelector('#timer-text');
      if (timerText) timerText.textContent = `\u23F1 ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        finish(null);
      }
    }, 1000);

    container.querySelectorAll('[data-answer]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (finished) return;
        clearInterval(timerInterval);
        finish(btn.dataset.answer);
      });
    });
  }

  function finish(chosen) {
    if (finished) return;
    finished = true;
    const isCorrect = chosen === correct;
    const speedBonus = isCorrect ? Math.max(0, Math.round(timeLeft * 2)) : 0;
    const pts = isCorrect ? 15 + speedBonus : 0;
    navigator?.vibrate?.(isCorrect ? 40 : [80, 40, 80]);

    container.innerHTML = `
      <div class="screen accent-grass">
        <p style="font-size:3rem; margin:0;">${isCorrect ? '\u2705' : '\u274C'}</p>
        <h2 style="margin:8px 0;">${isCorrect ? 'Correct!' : chosen === null ? 'Time is up!' : 'Wrong!'}</h2>
        ${chosen && !isCorrect ? `<p style="color:var(--text-dim); margin:0 0 4px;">You said: <strong>${escapeHtml(chosen)}</strong></p>` : ''}
        ${!isCorrect ? `<p style="margin:4px 0;">Answer: <strong style="color:var(--sun)">${escapeHtml(correct)}</strong></p>` : ''}
        <p style="font-size:1.4rem; margin:8px 0;">+${pts} pts</p>
      </div>
    `;

    setTimeout(() => {
      onComplete(pts, {
        type: 'trivia',
        question,
        correct,
        chosen,
        isCorrect,
        summary: isCorrect ? `Correct! +${pts} pts` : `Wrong (${correct})`
      });
    }, 1400);
  }

  render();
}

export default { id: 'trivia', mount };
