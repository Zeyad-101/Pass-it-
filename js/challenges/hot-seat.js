import { escapeHtml } from '../ui.js';

// [question, emoji]
const QUESTIONS = [
  ["Have you ever been kicked out of somewhere?", "\uD83D\uDEB7"],
  ["Have you ever ghosted someone?", "\uD83D\uDC7B"],
  ["Have you ever cheated on a test or exam?", "\uD83D\uDCDD"],
  ["Have you ever lied to a doctor?", "\uD83D\uDC69\u200D\u2695\uFE0F"],
  ["Have you ever eaten food off the floor?", "\uD83C\uDF55"],
  ["Have you ever talked trash about a friend behind their back?", "\uD83D\uDE48"],
  ["Have you ever faked being sick to get out of something?", "\uD83E\uDD12"],
  ["Have you ever liked someone you absolutely shouldn't have?", "\uD83D\uDE0B"],
  ["Have you ever stolen something, even small?", "\uD83D\uDCB8"],
  ["Have you ever cried in the bathroom to hide it from people?", "\uD83D\uDEB6\u200D\u2642\uFE0F"],
  ["Have you ever pretended to laugh at a joke you didn't get?", "\uD83D\uDE02"],
  ["Have you ever read someone's private messages without permission?", "\uD83D\uDCF1"],
  ["Have you ever been in a fight (physical)?", "\uD83E\uDD4A"],
  ["Have you ever said 'I love you' and not meant it?", "\uD83D\uDC94"],
  ["Have you ever driven drunk or ridden with a drunk driver?", "\uD83D\uDE97"],
  ["Have you ever taken credit for someone else's work?", "\uD83D\uDCBC"],
  ["Have you ever sent a risky text to the wrong person?", "\uD83D\uDCE9"],
  ["Have you ever skipped work or school and lied about why?", "\uD83C\uDFEB"],
  ["Have you ever laughed at a very inappropriate moment?", "\uD83D\uDE02"],
  ["Have you ever fallen asleep during a conversation?", "\uD83D\uDE34"],
  ["Have you ever slid into someone's DMs and immediately regretted it?", "\uD83D\uDE33"],
  ["Have you ever eaten something you found on the street?", "\uD83C\uDF2E"],
  ["Have you ever faked confidence in a skill you have no idea about?", "\uD83C\uDFA4"],
  ["Have you ever had a crush on a teacher or boss?", "\uD83D\uDE33"],
  ["Have you ever broken something at someone's house and hid it?", "\uD83D\uDC94"],
  ["Have you ever blamed a smell on someone else?", "\uD83D\uDCA8"],
  ["Have you ever accidentally liked a photo from years ago while stalking someone?", "\uD83D\uDE28"],
  ["Have you ever catfished someone or been catfished?", "\uD83D\uDC1F"],
  ["Have you ever done something illegal just to see what it felt like?", "\uD83D\uDEA8"],
  ["Have you ever said 'I'm on my way' while still in bed?", "\uD83D\uDECF\uFE0F"],
];

function mount(container, player, onComplete, allPlayers = []) {
  // Pick 5 random questions
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
  let idx = 0;
  let yesCount = 0;
  let answered = false;

  function renderQ() {
    if (idx >= shuffled.length) { finish(); return; }
    const [q, emoji] = shuffled[idx];
    answered = false;

    container.innerHTML = `
      <div class="screen accent-coral">
        <p style="color:var(--accent); font-weight:bold; font-size:1rem; margin-bottom:4px;">HOT SEAT \uD83D\uDD25 (${idx+1}/${shuffled.length})</p>
        <h2 style="margin:0 0 10px; font-size:1.4rem;">${escapeHtml(player.name)}, answer fast:</h2>
        <p style="font-size:3rem; margin:0 0 8px;">${emoji}</p>
        <p style="font-size:1.15rem; font-weight:bold; line-height:1.4; margin:0 0 20px;">${escapeHtml(q)}</p>
        <button class="btn primary" id="btn-yes" style="margin-bottom:10px; font-size:1.2rem; padding:18px;">\u2705 YES</button>
        <button class="btn" id="btn-no" style="font-size:1.2rem; padding:18px;">\u274C NO</button>
      </div>
    `;

    container.querySelector('#btn-yes').addEventListener('click', () => {
      if (answered) return; answered = true;
      navigator?.vibrate?.(30);
      yesCount++;
      idx++;
      setTimeout(renderQ, 250);
    });
    container.querySelector('#btn-no').addEventListener('click', () => {
      if (answered) return; answered = true;
      navigator?.vibrate?.(30);
      idx++;
      setTimeout(renderQ, 250);
    });
  }

  function finish() {
    const pts = yesCount * 8;
    navigator?.vibrate?.([40, 30, 40]);
    onComplete(pts, {
      type: 'hot-seat',
      yesCount,
      total: shuffled.length,
      summary: `${yesCount}/${shuffled.length} yes answers! +${pts} pts`
    });
  }

  renderQ();
}

export default { id: 'hot-seat', mount };
