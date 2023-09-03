import { calcHealthLevel, calcTileType } from './Board/utils';

export default class GamePlay { // Класс отвечает за создание игровых действий
  constructor() {
    this.boardSize = 8;
    this.container = null;
    this.boardEl = null;
    this.cells = [];
    this.cellClickListeners = [];
    this.cellEnterListeners = [];
    this.cellLeaveListeners = [];
    this.newGameListeners = [];
    this.saveGameListeners = [];
    this.loadGameListeners = [];
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  /**
   * Draws boardEl with specific theme
   *
   * @param theme
   */
  drawUi(theme) { // Создание основной HTML-страницы с выбранной темой
    this.checkBinding();

    this.container.innerHTML = `
      <div class="controls">
        <button data-id="action-restart" class="btn">New Game</button>
        <button data-id="action-save" class="btn">Save Game</button>
        <button data-id="action-load" class="btn">Load Game</button>
      </div>
      <div class="board-container">
        <div data-id="board" class="board"></div>
      </div>
    `;

    this.newGameEl = this.container.querySelector('[data-id=action-restart]');
    this.saveGameEl = this.container.querySelector('[data-id=action-save]');
    this.loadGameEl = this.container.querySelector('[data-id=action-load]');

    this.newGameEl.addEventListener('click', (event) => this.onNewGameClick(event));
    this.saveGameEl.addEventListener('click', (event) => this.onSaveGameClick(event));
    this.loadGameEl.addEventListener('click', (event) => this.onLoadGameClick(event));

    this.boardEl = this.container.querySelector('[data-id=board]');

    this.boardEl.classList.add(theme);
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('cell', 'map-tile', `map-tile-${calcTileType(i, this.boardSize)}`);
      cellEl.addEventListener('mouseenter', (event) => this.onCellEnter(event));
      cellEl.addEventListener('mouseleave', (event) => this.onCellLeave(event));
      cellEl.addEventListener('click', (event) => this.onCellClick(event));
      this.boardEl.appendChild(cellEl);
    }

    this.cells = Array.from(this.boardEl.children);
  }

  deleteBoard() {
    this.container.innerHTML = '';
  }

  resetEvents() {
    this.newGameEl.removeEventListener('click', (event) => this.onNewGameClick(event));
    this.saveGameEl.removeEventListener('click', (event) => this.onSaveGameClick(event));
    this.loadGameEl.removeEventListener('click', (event) => this.onLoadGameClick(event));
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.querySelector('.cell');
      cellEl.removeEventListener('mouseenter', (event) => this.onCellEnter(event));
      cellEl.removeEventListener('mouseleave', (event) => this.onCellLeave(event));
      cellEl.removeEventListener('click', (event) => this.onCellClick(event));
    }

    this.cellClickListeners = [];
    this.cellEnterListeners = [];
    this.cellLeaveListeners = [];
    this.newGameListeners = [];
    this.saveGameListeners = [];
    this.loadGameListeners = [];
  }

  /**
   * Draws positions (with chars) on boardEl
   *
   * @param positions array of PositionedCharacter objects
   */
  redrawPositions(positions) { // Отрисовка позиций персонажей на поле
    for (const cell of this.cells) {
      cell.innerHTML = '';
    }

    for (const position of positions) {
      const cellEl = this.boardEl.children[position.position];
      const charEl = document.createElement('div');
      charEl.classList.add('character', position.character.type);

      const healthEl = document.createElement('div');
      healthEl.classList.add('health-level');

      const healthIndicatorEl = document.createElement('div');
      healthIndicatorEl.classList.add('health-level-indicator', `health-level-indicator-${calcHealthLevel(position.character.health)}`);
      healthIndicatorEl.style.width = `${position.character.health}%`;
      healthEl.appendChild(healthIndicatorEl);

      charEl.appendChild(healthEl);
      cellEl.appendChild(charEl);
    }
  }

  /**
   * Add listener to mouse enter for cell
   *
   * @param callback
   */
  addCellEnterListener(callback) { // Вход указателя мыши в ячейку поля
    this.cellEnterListeners.push(callback);
  }

  /**
   * Add listener to mouse leave for cell
   *
   * @param callback
   */
  addCellLeaveListener(callback) { // Выход указателя мыши из ячейки поля
    this.cellLeaveListeners.push(callback);
  }

  /**
   * Add listener to mouse click for cell
   *
   * @param callback
   */
  addCellClickListener(callback) { // Клик мышью по ячейке поля
    this.cellClickListeners.push(callback);
  }

  /**
   * Add listener to "New Game" button click
   *
   * @param callback
   */
  addNewGameListener(callback) {
    this.newGameListeners.push(callback);
  }

  /**
   * Add listener to "Save Game" button click
   *
   * @param callback
   */
  addSaveGameListener(callback) {
    this.saveGameListeners.push(callback);
  }

  /**
   * Add listener to "Load Game" button click
   *
   * @param callback
   */
  addLoadGameListener(callback) {
    this.loadGameListeners.push(callback);
  }

  onCellEnter(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellEnterListeners.forEach((o) => o.call(null, index));
  }

  onCellLeave(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellLeaveListeners.forEach((o) => o.call(null, index));
  }

  onCellClick(event) {
    const index = this.cells.indexOf(event.currentTarget);
    this.cellClickListeners.forEach((o) => o.call(null, index));
  }

  onNewGameClick(event) {
    event.preventDefault();
    this.newGameListeners.forEach((o) => o.call(null));
  }

  onSaveGameClick(event) {
    event.preventDefault();
    this.saveGameListeners.forEach((o) => o.call(null));
  }

  onLoadGameClick(event) {
    event.preventDefault();
    this.loadGameListeners.forEach((o) => o.call(null));
  }

  showError(message) {
    throw new Error(message);
  }

  showMessage(message) {
    alert(message);
  }

  selectCell(index, color = 'yellow') {
    this.deselectCell(index);
    this.cells[index].classList.add('selected', `selected-${color}`);
  }

  deselectCell(index) {
    const cell = this.cells[index];
    cell.classList.remove(...Array.from(cell.classList)
      .filter((o) => o.startsWith('selected')));
  }

  showCellTooltip(message, index) {
    this.cells[index].title = message;
  }

  hideCellTooltip(index) {
    this.cells[index].title = '';
  }

  showDamage(index, damage) {
    return new Promise((resolve) => {
      const cell = this.cells[index];
      const damageEl = document.createElement('span');
      damageEl.textContent = damage;
      damageEl.classList.add('damage');
      cell.appendChild(damageEl);

      damageEl.addEventListener('animationend', () => {
        cell.removeChild(damageEl);
        resolve();
      });
    });
  }

  setCursor(cursor) {
    this.boardEl.style.cursor = cursor;
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('GamePlay not bind to DOM');
    }
  }

  getCharacterInfo(level, attack, defence, health) { // возвращаем информацию о персонаже
    const medal = String.fromCodePoint(0x1F396);
    const swords = String.fromCodePoint(0x2694);
    const shield = String.fromCodePoint(0x1F6E1);
    const heart = String.fromCodePoint(0x2764);

    return `${medal} ${level} ${swords} ${attack} ${shield} ${defence} ${heart} ${health}`;
  }

  getVector(currentCell, activeCell, boardSize) { // получаем вектор перемещения персонажа
    let result;
    const diff = Math.abs(currentCell - activeCell);
    const mod = currentCell % boardSize;

    const diagDiffKoef = Math.abs(Math.floor(currentCell / boardSize) - Math.floor(activeCell / boardSize));

    // вертикаль
    if (mod - (activeCell % boardSize) === 0) {
      result = diff / boardSize;
    }

    // горизонталь
    if (Math.floor(currentCell / boardSize) === Math.floor(activeCell / boardSize)) {
      result = diff;
    }

    // левая диагональ
    if (diff === (boardSize - 1) * diagDiffKoef) {
      result = diff / (boardSize - 1);
    }

    // правая диагональ
    if (diff === (boardSize + 1) * diagDiffKoef) {
      result = diff / (boardSize + 1);
    }

    return result;
  }

  getRandomMove(currentPosition, boardSize, moveDistance) { // Генерация перемещения компьютера, если цель не была найдена.
    const randomDirection = Math.floor(Math.random() * 4);
    const randomMove = Math.floor(Math.random() * moveDistance) + 1;

    let newPosition;

    switch (randomDirection) {
      case 0: // Влево
        newPosition = (currentPosition % boardSize) - randomMove >= 0
          ? currentPosition - randomMove
          : currentPosition;
        break;
      case 1: // Вправо
        newPosition = (currentPosition % boardSize) + randomMove < boardSize
          ? currentPosition + randomMove
          : currentPosition;
        break;
      case 2: // Вверх
        newPosition = Math.floor(currentPosition / boardSize) - randomMove >= 0
          ? currentPosition - boardSize * randomMove
          : currentPosition;
        break;
      default: // Вниз
        newPosition = Math.floor(currentPosition / boardSize) + randomMove < boardSize
          ? currentPosition + boardSize * randomMove
          : currentPosition;
        break;
    }

    return newPosition;
  }

  computerMoving(computerX, computerY, playerX, playerY, computerCharPosition, move) { // Перемещение компьютера
    let newPosition;
    if (computerY === playerY) { // движение по горизонтали
      if (computerX > playerX) {
        newPosition = computerCharPosition - move;
      } else {
        newPosition = computerCharPosition + move;
      }
    } else if (computerX === playerX) { // движение по вертикали
      if (computerY > playerY) {
        newPosition = computerCharPosition - this.boardSize * move;
      } else {
        newPosition = computerCharPosition + this.boardSize * move;
      }
    } else if (computerX > playerX && computerY > playerY) { // Влево и вверх
      newPosition = computerCharPosition - this.boardSize * move - move;
    } else if (computerX < playerX && computerY < playerY) { // Вправо и вниз
      newPosition = computerCharPosition + this.boardSize * move + move;
    } else if (computerX < playerX && computerY > playerY) { // Вправо и вверх
      newPosition = computerCharPosition - this.boardSize * move + move;
    } else if (computerX > playerX && computerY < playerY) { // Влево и вниз
      newPosition = computerCharPosition + this.boardSize * move - move;
    }
    return newPosition;
  }

  getIndexSelectedCell() { // Получаем индекс выбранного персонажа или возвращаем null
    const selectCell = this.cells.find((cellEl) => cellEl.classList.contains('selected-yellow'));
    if (selectCell) {
      return this.cells.indexOf(selectCell);
    }
    return null;
  }

  switchActivePlayer() {
    this.activePlayer = 1 - this.activePlayer; // Переключаем между 0 и 1
    if (this.activePlayer === 1) {
      this.computerTurn();
    }
  }

  reloadStats(playerPositionedCharacters) { // Обновление характеристик персонажей игрока
    playerPositionedCharacters.forEach((char) => {
      char.character.level++;

      const healthAfter = char.character.health + 40;
      char.character.health = healthAfter;
      if (healthAfter > 100) {
        char.character.health = 100;
      }

      const defenceAfter = Math.max(char.character.defence, char.character.defence * (80 + char.character.health) / 100);
      char.character.defence = Math.ceil(defenceAfter);

      const attackAfter = Math.max(char.character.attack, char.character.attack * (80 + char.character.health) / 100);
      char.character.attack = Math.ceil(attackAfter);
    });
  }

  computerReloadStats(enemiesPositionedCharacters, currentTheme, themes) { // Обновление характеристик персонажей компьютера
    enemiesPositionedCharacters.forEach((char) => {
      if (currentTheme === themes.desert) {
        char.character.level = 2;
      } else if (currentTheme === themes.arctic) {
        char.character.level = 3;
      } else if (currentTheme === themes.mountain) {
        char.character.level = 4;
      }

      const healthAfter = char.character.health + 20;
      char.character.health = healthAfter;
      if (healthAfter > 100) {
        char.character.health = 100;
      }

      const defenceAfter = Math.max(char.character.defence, char.character.defence * (80 + char.character.health) / 100);
      char.character.defence = Math.ceil(defenceAfter);

      const attackAfter = Math.max(char.character.attack, char.character.attack * (80 + char.character.health) / 100);
      char.character.attack = Math.ceil(attackAfter);
    });
  }
}
