import themes from './Board/themes';
import { generatePlayerPositionedCharacters, generateEnemyPositionedCharacters } from './generateTeam/generators';
import cursors from './cursors';
import GamePlay from './GamePlay';


export default class GameController { // основной контролирующий класс приложения
  constructor(gamePlay, stateService) { // класс принимает экземпляр gamePlay и stateService
    this.gamePlay = gamePlay;
    this.stateService = stateService;

    this.playerPositionedCharacters = [];
    this.enemyPositionedCharacters = [];
    this.concatedCharacters = [];
    
    this.cursor = Object.values(cursors);

    this.currentCell = null;
    this.lastCell = null;
  }

  init() { // Инициализация игры
    const theme = themes.prairie; // <- выбор темы
    this.gamePlay.drawUi(theme); // <- отрисовка игрового поля с выбранной темой

    this.playerPositionedCharacters = generatePlayerPositionedCharacters(); // позиции и персонажи команды игрока
    this.enemiesPositionedCharacters = generateEnemyPositionedCharacters(); // позиции и персонажи команды противника
    this.concatedCharacters = [...this.playerPositionedCharacters, ...this.enemiesPositionedCharacters];
    this.gamePlay.redrawPositions(this.concatedCharacters); // генерация позиций и персонажей на поле
    this.tooltipStatus(); // показать информацию о персонаже при наводке на него
    this.characterSelection(); // выбор персонажа
  }

  tooltipStatus() { // метод показывает/скрывает информацию о персонаже
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
  }

  characterSelection() { // метод выбирает персонажа
    this.gamePlay.addCellClickListener(this.onCellClick);
  }

  onCellEnter = (index) => { // Событие вызывается при наведении на ячейку поля где есть персонаж
    const cellEl = this.gamePlay.cells[index];
    const characterEl = cellEl.querySelector('.character');
    const cellIndex = this.gamePlay.cells.indexOf(cellEl);
    this.currentCell = cellIndex; // Присваиваем текущую ячейку
    console.log(this.currentCell + " Текущая точка")
    const selectedPlayer = this.getIndexSelectedCharacter();
    
    if(characterEl) { // Если элемент содержит в себе класс 'character'
      const character = this.concatedCharacters.find((char) => char.position === cellIndex); // Получаем данные персонажа по позиции
      const characterPlayer = characterEl.classList.contains('bowman') || characterEl.classList.contains('swordsman') || characterEl.classList.contains('magician');

      if(characterPlayer) { // Если персонаж игрока меняем курсор
        this.gamePlay.setCursor(this.cursor[1]);
      }

      if(character) { // Получаем характеристики персонажа из найденного объекта
        const level = character.character.level;
        const attack = character.character.attack;
        const defence = character.character.defence;
        const health = character.character.health;
        const message = this.getCharacterInfo(level, attack, defence, health);
        this.gamePlay.showCellTooltip(message, cellIndex);
      }
    }
  }

  onCellLeave = (index) => { // Событие вызывается при уходе курсора из ячейки поля где есть персонаж
    const cellEl = this.gamePlay.cells[index];
    const cellIndex = this.gamePlay.cells.indexOf(cellEl);
    this.gamePlay.hideCellTooltip(cellIndex);
    this.gamePlay.setCursor(this.cursor[0]);
    const selectedPlayer = this.getIndexSelectedCharacter();
    this.lastCell = cellIndex; // Присваиваем предыдущую ячейку
    console.log(this.lastCell + " Предыдущая точка")
  }

  onCellClick = (index) => { // Событие при клике на ячейку поля где есть персонаж игрока
    const cellEl = this.gamePlay.cells[index];
    const characterEl = cellEl.querySelector('.character');
    const selectedPlayer = this.getIndexSelectedCharacter();
    if(characterEl) {
      const characterPlayer = characterEl.classList.contains('bowman') || characterEl.classList.contains('swordsman') || characterEl.classList.contains('magician');
      if(characterPlayer) {
        const cellIndex = this.gamePlay.cells.indexOf(cellEl);
        if(selectedPlayer !== null && cellIndex !== selectedPlayer) {
          this.gamePlay.deselectCell(selectedPlayer);
        }
        this.gamePlay.selectCell(cellIndex, 'yellow');
      } else {
        const message = 'Это не персонаж игрока, выберите другого';
        GamePlay.showError(message);
      }
    }
  }

  getIndexSelectedCharacter() { // Получаем индекс выбранного персонажа
    const selectCell = this.gamePlay.cells.find((cellEl) => cellEl.classList.contains('selected'));
    if(selectCell) {
      return this.gamePlay.cells.indexOf(selectCell);
    }
    return null;
  }

  getCharacterInfo(level, attack, defence, health) { // возвращаем информацию о персонаже
    const medal = String.fromCodePoint(0x1F396);
    const swords = String.fromCodePoint(0x2694);
    const shield = String.fromCodePoint(0x1F6E1);
    const heart = String.fromCodePoint(0x2764);

    return `${medal} ${level} ${swords} ${attack} ${shield} ${defence} ${heart} ${health}`;
  }
}
