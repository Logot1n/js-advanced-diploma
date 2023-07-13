import themes from './Board/themes';
import { generatePlayerPositionedCharacters, generateEnemyPositionedCharacters } from './generateTeam/generators';
import cursors from './cursors';

export default class GameController { // основной контролирующий класс приложения
  constructor(gamePlay, stateService) { // класс принимает экземпляр gamePlay и stateService
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() { // Инициализация игры
    const theme = themes.prairie; // <- выбор темы
    this.gamePlay.drawUi(theme); // <- отрисовка игрового поля с выбранной темой

    const playerPositionedCharacters = generatePlayerPositionedCharacters(); // генерация позиций персонажей игрока
    const enemyPositionedCharacters = generateEnemyPositionedCharacters(); // генерация позиций персонажей противника
    const charactersPositioned = this.gamePlay.redrawPositions(playerPositionedCharacters.concat(enemyPositionedCharacters)); // генерация персонажей на поле
    this.showInfo(); // показать информацию о персонаже при наводке на него
  }

  showInfo() { // метод показывает информацию о персонаже
    this.gamePlay.addCellEnterListener(this.onCellEnter);
  }

  onCellEnter(index) { // Метод вызывается при наведении на ячейку поля
    const cellEl = this.gamePlay.cells[index];
    const characterEl = cellEl.querySelector('.character');
    if (characterEl) {
      const level = characterEl.level;
      const attack = characterEl.attack;
      const defenсe = characterEl.defence;
      const health = characterEl.health;
      const message = this.getCharacterInfo(level, attack, defenсe, health);
      this.gamePlay.showCellTooltip(message, index);
    }
  }

  getCharacterInfo(level, attack, defence, health) {
    const medal = String.fromCodePoint(0x1F396);
    const swords = String.fromCodePoint(0x2694);
    const shield = String.fromCodePoint(0x1F6E1);
    const heart = String.fromCodePoint(0x2764);
  
    return `${medal} ${level} ${swords} ${attack} ${shield} ${defence} ${heart} ${health}`;
  }

  onCellClick(index) {
    
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
