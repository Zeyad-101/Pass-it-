import { escapeHtml } from '../ui.js';

// [title, items to rank (4 items)]
const LISTS = [
  ["Rank these superpowers (best to worst)", ["Fly", "Invisible", "Time Travel", "Mind Reading"]],
  ["Rank these foods (tastiest to worst)", ["Pizza", "Sushi", "Tacos", "Salad"]],
  ["Rank these holidays (best to worst)", ["Christmas", "Halloween", "New Year", "Easter"]],
  ["Rank these animals (coolest to most boring)", ["Tiger", "Penguin", "Golden retriever", "Pigeon"]],
  ["Rank these jobs (dream to nightmare)", ["YouTuber", "Astronaut", "Dentist", "Tax Inspector"]],
  ["Rank these movies (best to worst)", ["Avengers", "Titanic", "The Notebook", "Bee Movie"]],
  ["Rank these apps (most important to least)", ["WhatsApp", "Google Maps", "TikTok", "Calculator"]],
  ["Rank these sleeping spots (best to worst)", ["5-star hotel", "Your bed", "Friend's sofa", "Camping tent"]],
  ["Rank these awkward situations (worst to least worst)", ["Calling teacher 'Mum'", "Reply-all work email", "Waving back at wrong person", "Falling in public"]],
  ["Rank these snacks (best to worst)", ["Chips", "Chocolate", "Popcorn", "Fruit"]],
  ["Rank these social media (favourite to least)", ["Instagram", "YouTube", "Twitter/X", "LinkedIn"]],
  ["Rank these punishments (least to most terrible)", ["No phone 1 week", "No internet 1 month", "No music 1 year", "No coffee ever"]],
  ["Rank these celebrities (who you'd most want as a friend)", ["Dwayne Johnson", "Rihanna", "Elon Musk", "Beyonce"]],
  ["Rank these vehicles (coolest to most boring)", ["Lamborghini", "Private jet", "Yacht", "Scooter"]],
  ["Rank these life skills (most important to least)", ["Cooking", "Swimming", "Driving", "Coding"]],
  ["Rank these fears (most rational to least)", ["Heights", "Public speaking", "Spiders", "Clowns"]],
  ["Rank these TV genres (favourite to least)", ["Thriller", "Comedy", "Reality TV", "Documentary"]],
  ["Rank these drinks (best to worst)", ["Coffee", "Boba Tea", "Energy drink", "Plain water"]],
  ["Rank these dates (best to worst)", ["Restaurant", "Picnic", "Netflix at home", "Amusement park"]],
  ["Rank these ways to die (least scary)", ["Old age in sleep", "Volcano", "Eaten by sharks", "Embarrassment"]],
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function mount(container, player, onComplete, allPlayers = []) {
  const [title, originalItems] = LISTS[Math.floor(Math.random() * LISTS.length)];
  let items = shuffle([...originalItems]);
  let ranked = [];
  let submitted = false;

  function render() {
    const remaining = items.filter(it => !ranked.includes(it));

    if (remaining.length === 0) {
      showResult();
      return;
    }

    const pos = ranked.length + 1;
    const labels = ['1st \uD83E\uDD47', '2nd \uD83E\uDD48', '3rd \uD83E\uDD49', '4th'];

    container.innerHTML = `
      <div class="screen accent-grass">
        <p style="color:var(--accent); font-weight:bold; font-size:1rem; margin-bottom:4px;">RANK IT \uD83C\uDFC6</p>
        <p style="font-size:1rem; font-weight:bold; line-height:1.35; margin:0 0 6px;">${escapeHtml(title)}</p>
        ${ranked.length > 0 ? `<p style="font-size:0.85rem; color:var(--text-dim); margin:0 0 8px;">Ranked: ${ranked.map((r, i) => `${labels[i]} ${escapeHtml(r)}`).join(', ')}</p>` : ''}
        <p style="font-size:1.1rem; margin:0 0 10px;">Pick <strong style="color:var(--sun);">${labels[ranked.length]}</strong>:</p>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${remaining.map(item => `
            <button class="btn primary" data-item="${escapeHtml(item)}" style="font-size:1.05rem; padding:16px;">
              ${escapeHtml(item)}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('[data-item]').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator?.vibrate?.(25);
        ranked.push(btn.dataset.item);
        render();
      });
    });
  }

  function showResult() {
    if (submitted) return;
    submitted = true;
    const pts = 20;

    container.innerHTML = `
      <div class="screen accent-grass">
        <p style="font-size:2rem; margin:0;">\uD83C\uDFC6</p>
        <h2 style="margin:8px 0;">${escapeHtml(player.name)}'s ranking:</h2>
        ${ranked.map((r, i) => `
          <p style="margin:4px 0; font-size:1.05rem;">${['1st \uD83E\uDD47', '2nd \uD83E\uDD48', '3rd \uD83E\uDD49', '4th'][i]} <strong>${escapeHtml(r)}</strong></p>
        `).join('')}
        <p style="font-size:1.3rem; margin:12px 0;">+${pts} pts for ranking!</p>
        <button class="btn primary" id="continue-rank">Continue</button>
      </div>
    `;

    container.querySelector('#continue-rank').addEventListener('click', () => {
      onComplete(pts, {
        type: 'rank-it',
        title,
        ranking: ranked,
        summary: `Ranked: ${ranked.join(' > ')} (+${pts} pts)`
      });
    });
  }

  render();
}

export default { id: 'rank-it', mount };
