const STORAGE_KEY = 'passit:lastPlayers';

export function getLastPlayers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLastPlayers(names) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
  } catch {}
}

export function renderSetupScreen(container, onStart) {
  const lastPlayers = getLastPlayers();
  const initialNames = lastPlayers.length >= 2 ? lastPlayers : ['', ''];

  container.innerHTML = `
    <div class="screen accent-sky">
      <h1 class="logo">PASS IT! 🎮</h1>
      <p>2–8 players</p>
      <div class="player-list" id="player-list"></div>
      <button class="btn" id="add-player">+ Add Player</button>
      <label style="display:flex; align-items:center; gap:8px; justify-content:center; width:100%;">
        <span>Rounds:</span>
        <input type="number" id="round-count" value="10" min="3" max="30" style="width: 80px;">
      </label>
      <button class="btn primary" id="start-game">Start Game</button>
      <p id="error-msg" style="color: var(--coral); min-height: 1.2em; margin: 0;"></p>
    </div>
  `;

  const addBtn = container.querySelector('#add-player');
  const listEl = container.querySelector('#player-list');
  const errorEl = container.querySelector('#error-msg');

  function updateControls(count) {
    addBtn.disabled = count >= 8;
    listEl.querySelectorAll('.remove').forEach(el => {
      el.classList.toggle('disabled', count <= 2);
    });
  }

  function renderRows(names) {
    listEl.innerHTML = '';
    names.forEach((name, i) => {
      const row = document.createElement('div');
      row.className = 'player-row';
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = `Player ${i + 1}`;
      input.value = name;
      input.dataset.index = i;
      const remove = document.createElement('span');
      remove.className = names.length <= 2 ? 'remove disabled' : 'remove';
      remove.dataset.index = i;
      remove.textContent = '✕';
      row.appendChild(input);
      row.appendChild(remove);
      listEl.appendChild(row);
    });
    updateControls(names.length);
  }

  renderRows(initialNames);

  addBtn.addEventListener('click', () => {
    const current = getCurrentNames();
    if (current.length >= 8) return;
    renderRows([...current, '']);
  });

  listEl.addEventListener('click', (e) => {
    if (!e.target.classList.contains('remove')) return;
    const current = getCurrentNames();
    if (current.length <= 2) return;
    const idx = Number(e.target.dataset.index);
    current.splice(idx, 1);
    renderRows(current);
  });

  function getCurrentNames() {
    return Array.from(listEl.querySelectorAll('input')).map(input => input.value);
  }

  container.querySelector('#start-game').addEventListener('click', () => {
    const names = getCurrentNames().map(n => n.trim()).filter(Boolean);
    const roundCount = Number(container.querySelector('#round-count').value) || 10;

    if (names.length < 2) {
      errorEl.textContent = 'Need at least 2 players.';
      return;
    }
    if (names.length > 8) {
      errorEl.textContent = 'Max 8 players.';
      return;
    }

    navigator?.vibrate?.(30);
    saveLastPlayers(names);
    onStart(names, roundCount);
  });
}
