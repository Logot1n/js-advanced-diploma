import themes from './Board/themes';
import { generatePlayerPositionedCharacters, generateEnemyPositionedCharacters } from './generateTeam/generators';
import cursors from './cursors';
import GamePlay from './GamePlay';


export default class GameController { // основной контролирующий класс приложения
  constructor(gamePlay, stateService) { // класс принимает экземпляр gamePlay и stateService
    this.gamePlay = gamePlay;
    this.stateService = stateService;

    this.playerPositionedCharacters = [];
    this.enemiesPositionedCharacters = [];
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

  onCellEnter = (index) => { // Событие вызывается при наведении на ячейку поля
    const cellEl = this.gamePlay.cells[index];
    this.currentCell = this.gamePlay.cells.indexOf(cellEl); // Получаем индекс ячейки текущей ячейки
    const characterEl = cellEl.querySelector('.character');
    const selectedCell = this.getIndexSelectedCharacter();

    if(characterEl) { // Если элемент содержит в себе класс 'character'
      const character = this.concatedCharacters.find((char) => char.position === this.currentCell); // Получаем данные персонажа по позиции
      const characterPlayer = this.playerPositionedCharacters.find((char) => char.position === this.currentCell);

      if(characterPlayer) { // Если персонаж игрока меняем курсор на pointer
        this.gamePlay.setCursor(this.cursor[1]);
      }

      if(character) { // Получаем характеристики персонажа из найденного объекта
        const level = character.character.level;
        const attack = character.character.attack;
        const defence = character.character.defence;
        const health = character.character.health;
        const message = this.getCharacterInfo(level, attack, defence, health);
        this.gamePlay.showCellTooltip(message, this.currentCell);

        // const characterValidAttackDistance = this.getValidAttackDistance(character.character.type);
        // const characterValidMoveDistance = this.getValidMoveDistance(character.character.type);
        // const distanceToCell = Math.max(Math.abs(this.currentCell % this.gamePlay.boardSize - selectedCell % this.gamePlay.boardSize), Math.abs(Math.floor(this.currentCell / this.gamePlay.boardSize) - Math.floor(selectedCell / this.gamePlay.boardSize)));
        // console.log(distanceToCell)

        // if(selectedCell !== null && distanceToCell <= characterValidMoveDistance && !characterEl) { // Если ячейка содержит персонажей противника, то выделяем их красным
        //   this.gamePlay.setCursor(this.cursor[2]);
        //   this.gamePlay.selectCell(this.currentCell, 'red');
        // }
      }
      
      if (selectedCell !== null && this.enemiesPositionedCharacters.some(char => char.position === this.currentCell)) { // Если ячейка содержит персонажей противника, то выделяем их красным
        this.gamePlay.setCursor(this.cursor[2]);
        this.gamePlay.selectCell(this.currentCell, 'red');
      }

    } else if(selectedCell !== null && !characterEl) {
      this.gamePlay.setCursor(this.cursor[1]);
      this.gamePlay.selectCell(this.currentCell, 'green');
    }
  }

  onCellLeave = (index) => { // Событие вызывается при уходе курсора из ячейки поля
    const cellEl = this.gamePlay.cells[index];
    this.lastCell = this.gamePlay.cells.indexOf(cellEl); // Получаем индекс ячейки предыдущей ячейки
    this.gamePlay.hideCellTooltip(this.lastCell);
    const selectedCell = this.getIndexSelectedCharacter();
    if(this.lastCell === selectedCell) {
    } else {
      this.gamePlay.deselectCell(this.lastCell);
    }
  }

  onCellClick = (index) => { // Событие при клике на ячейку поля
    const cellEl = this.gamePlay.cells[index];
    const characterEl = cellEl.querySelector('.character');
    const selectedCell = this.getIndexSelectedCharacter();
    if(characterEl) {
      const characterPlayer = characterEl.classList.contains('bowman') || characterEl.classList.contains('swordsman') || characterEl.classList.contains('magician');
      if(characterPlayer) {
        const cellIndex = this.gamePlay.cells.indexOf(cellEl); // Получаем индекс ячейки
        if(selectedCell !== null && cellIndex === selectedCell) { // При повторном клике снимается выделение
          this.gamePlay.deselectCell(selectedCell);
        } else { // Смена выбранного персонажа
          if (selectedCell !== null) { 
            this.gamePlay.deselectCell(selectedCell);
          }
          this.gamePlay.selectCell(cellIndex, 'yellow');
        }
      } else { // выдаем ошибку, если это не персонаж игрока
        const message = 'Это не персонаж игрока, выберите другого';
        GamePlay.showError(message);
      }
    }
  }

  getIndexSelectedCharacter() { // Получаем индекс выбранного персонажа или возвращаем null
    const selectCell = this.gamePlay.cells.find((cellEl) => cellEl.classList.contains('selected-yellow'));
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

  getValidAttackDistance(character) { // получаем дистанцию атаки в зависимости от типа персонажа
    switch(character) {
      case 'swordsman':
      case 'undead':
        return 1;
      case 'bowman':
      case 'vampire':
        return 2;
      case 'magician':
      case 'daemon':
        return 4;
      default:
        return 0;
    }
  }
  
  getValidMoveDistance(character) { // получаем дистанцию перемещения в зависимости от типа персонажа
    switch(character) {
      case 'swordsman':
      case 'undead':
        return 4;
      case 'bowman':
      case 'vampire':
        return 2;
      case 'magician':
      case 'daemon':
        return 1;
      default:
        return 0;
    }
  }
}
