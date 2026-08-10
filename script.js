const board = document.querySelector('#board');
const flipsDisplay = document.querySelector('#flips');
const codesDisplay = document.querySelector('#codes-found');
const hint = document.querySelector('#hint');
const newGame = document.querySelector('#new-game');
const codeForm = document.querySelector('#code-form');
const codeEntry = document.querySelector('#code-entry');
const result = document.querySelector('#result');
const codeField = document.querySelector('.single-code-field');
const checkMessage = document.querySelector('#check-message');

const alphabet = 'abcdefghijklmnopqrstuvwxyz';
let flips = 0;
let codesFound = 0;
let answerKey = [];

function shuffle(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
  }
  return items;
}

function makeCode() {
  const letters = Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
  return letters;
}

function updateStatus() {
  flipsDisplay.textContent = flips;
  codesDisplay.textContent = `${codesFound} / 8`;
  hint.textContent = codesFound === 8
    ? 'You found all 8 secret codes! Start a new board to play again.'
    : 'There are 8 codes and 12 stars hidden on this board.';
}

function createBoard() {
  flips = 0;
  codesFound = 0;
  board.replaceChildren();
  answerKey = Array.from({ length: 8 }, () => makeCode());
  const tiles = shuffle([
    ...answerKey.map((letters, index) => ({ type: 'code', value: `${index + 1}-${letters}` })),
    ...Array.from({ length: 12 }, () => ({ type: 'star', value: '★' })),
  ]);
  codeEntry.value = '';
  codeField.classList.remove('correct', 'wrong');
  result.textContent = '';
  checkMessage.textContent = '';
  checkMessage.classList.remove('success');

  tiles.forEach((tileData, index) => {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = `tile ${tileData.type}`;
    tile.setAttribute('aria-label', `Square ${index + 1}, hidden`);
    tile.innerHTML = `
      <span class="tile-face tile-front" aria-hidden="true">${index + 1}</span>
      <span class="tile-face tile-back" aria-hidden="true"><span class="${tileData.type}-text">${tileData.value}</span></span>`;

    tile.addEventListener('click', () => {
      if (tile.classList.contains('flipped')) return;
      tile.classList.add('flipped');
      tile.setAttribute('aria-label', `Square ${index + 1}, ${tileData.type === 'code' ? `code ${tileData.value}` : 'star'}`);
      flips += 1;
      if (tileData.type === 'code') codesFound += 1;
      updateStatus();
    });
    board.append(tile);
  });
  updateStatus();
}

newGame.addEventListener('click', createBoard);
codeEntry.addEventListener('input', () => {
  codeEntry.value = codeEntry.value.toLowerCase().replace(/[^a-z]/g, '');
  codeField.classList.remove('correct', 'wrong');
  result.textContent = '';
  checkMessage.textContent = '';
  checkMessage.classList.remove('success');
});
codeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const isCorrect = codeEntry.value === answerKey.join('');
  codeField.classList.toggle('correct', isCorrect);
  codeField.classList.toggle('wrong', !isCorrect);
  result.textContent = isCorrect ? '✓' : '✕';
  checkMessage.textContent = isCorrect ? 'You decoded the complete code — you win!' : 'That sequence is not quite right. Check the code labels and try again.';
  checkMessage.classList.toggle('success', isCorrect);
});
createBoard();
