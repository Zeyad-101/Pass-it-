import { escapeHtml } from '../ui.js';

// [partial lyric shown, answer - what comes next, artist/song hint]
const LYRICS = [
  ["Is this the real life?", "Is this just fantasy?", "Bohemian Rhapsody - Queen"],
  ["Never gonna give you up,", "Never gonna let you down", "Rick Astley"],
  ["Hello, is it me", "you're looking for?", "Lionel Richie"],
  ["I kissed a girl and", "I liked it", "Katy Perry"],
  ["Don't stop believin',", "Hold on to the feelin'", "Journey"],
  ["We will, we will", "rock you!", "Queen"],
  ["Baby one more time,", "I shouldn't have let you go", "Britney Spears"],
  ["Shake it off, shake it off,", "ooh-ooh-ooh", "Taylor Swift"],
  ["All the single ladies,", "All the single ladies", "Beyonce"],
  ["Rolling in the deep,", "We could have had it all", "Adele"],
  ["I will always love", "you", "Whitney Houston"],
  ["Cause baby you're a", "firework", "Katy Perry"],
  ["I came in like a", "wrecking ball", "Miley Cyrus"],
  ["Let it go, let it go,", "Can't hold it back anymore", "Frozen - Idina Menzel"],
  ["Wake me up before you", "go-go", "Wham!"],
  ["I'm walking on sunshine,", "Woah-oh!", "Katrina & The Waves"],
  ["Hit me baby one more", "time", "Britney Spears"],
  ["Don't you forget about", "me", "Simple Minds"],
  ["Every breath you take,", "Every move you make", "The Police"],
  ["I'm too sexy for my", "shirt", "Right Said Fred"],
  ["Billie Jean is not my", "lover", "Michael Jackson"],
  ["She's got a ticket to", "ride", "The Beatles"],
  ["Take on me,", "Take me on", "A-ha"],
  ["Call me maybe,", "Here's my number", "Carly Rae Jepsen"],
  ["Party rock is in the", "house tonight", "LMFAO"],
  ["I'm on the floor,", "I love to dance", "Jennifer Lopez"],
  ["Uptown funk you up,", "Uptown funk you up", "Bruno Mars"],
  ["Can't stop the feeling,", "I got this feeling in my bones", "Justin Timberlake"],
  ["Shape of you,", "The club isn't the best place to find a lover", "Ed Sheeran"],
  ["Blinding lights,", "I been tryna call", "The Weeknd"],
  ["Old town road, I'm gonna", "ride till I can't no more", "Lil Nas X"],
  ["Staying alive, staying", "alive", "Bee Gees"],
  ["Dancing queen, young and", "sweet, only seventeen", "ABBA"],
  ["Livin' on a prayer,", "Woah, we're halfway there", "Bon Jovi"],
  ["Eye of the tiger,", "It's the thrill of the fight", "Survivor"],
];

function mount(container, player, onComplete, allPlayers = []) {
  const voters = allPlayers.filter(p => p.id !== player.id);
  // Play 3 rounds
  const batch = [...LYRICS].sort(() => Math.random() - 0.5).slice(0, 3);
  let idx = 0;
  let totalPts = 0;

  function showLyric() {
    if (idx >= batch.length) { done(); return; }
    const [partial, answer, hint] = batch[idx];
    let revealed = false;

    container.innerHTML = `
      <div class="screen accent-grass">
        <p style="color:var(--accent); font-weight:bold; font-size:1rem; margin-bottom:4px;">\uD83C\uDFB5 FINISH THE LYRIC (${idx+1}/${batch.length})</p>
        <h2 style="margin:0 0 12px; font-size:1.3rem;">${escapeHtml(player.name)}, finish it:</h2>
        <p style="font-size:1.4rem; font-weight:bold; font-style:italic; line-height:1.4; background:rgba(0,0,0,0.15); padding:16px; border-radius:12px; margin:0 0 16px;">"${escapeHtml(partial)} ..."</p>
        <p style="color:var(--text-dim); font-size:0.85rem; margin:0 0 16px;">Hint: ${escapeHtml(hint)}</p>
        <button class="btn primary" id="reveal-btn">Reveal Answer \uD83D\uDC40</button>
      </div>
    `;

    container.querySelector('#reveal-btn').addEventListener('click', () => {
      if (revealed) return; revealed = true;
      container.innerHTML = `
        <div class="screen accent-grass">
          <p style="font-size:1.1rem; font-style:italic; margin:0 0 6px; color:var(--text-dim);">"${escapeHtml(partial)}"</p>
          <p style="font-size:1.6rem; font-weight:900; color:var(--sun); margin:0 0 16px;">... "${escapeHtml(answer)}"</p>
          <p style="color:var(--text-dim); font-size:0.85rem; margin:0 0 20px;">- ${escapeHtml(hint)}</p>
          <button class="btn primary" id="got-it" style="margin-bottom:10px;">\u2705 Got it right! (+15 pts)</button>
          <button class="btn" id="got-wrong">\u274C Nope, I missed it</button>
        </div>
      `;
      container.querySelector('#got-it').addEventListener('click', () => {
        totalPts += 15; idx++;
        navigator?.vibrate?.(40);
        setTimeout(showLyric, 300);
      });
      container.querySelector('#got-wrong').addEventListener('click', () => {
        idx++;
        navigator?.vibrate?.([60, 30, 60]);
        setTimeout(showLyric, 300);
      });
    });
  }

  function done() {
    onComplete(totalPts, {
      type: 'finish-lyric',
      rounds: batch.length,
      summary: `${Math.round(totalPts/15)}/${batch.length} lyrics correct! +${totalPts} pts`
    });
  }

  showLyric();
}

export default { id: 'finish-lyric', mount };
