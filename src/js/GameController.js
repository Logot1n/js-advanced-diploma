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
    this.activePlayer = null;
    this.computerMoveDone = true;
    
    this.cursor = Object.values(cursors);

    this.currentCell = null;
    this.lastCell = null;
  }

  init() { // Инициализация игры
    const theme = themes.prairie; // выбор темы
    this.gamePlay.drawUi(theme); // отрисовка игрового поля с выбранной темой

    this.playerPositionedCharacters = generatePlayerPositionedCharacters(); // позиции и персонажи команды игрока
    this.enemiesPositionedCharacters = generateEnemyPositionedCharacters(); // позиции и персонажи команды противника
    this.concatedCharacters = [...this.playerPositionedCharacters, ...this.enemiesPositionedCharacters];
    this.gamePlay.redrawPositions(this.concatedCharacters); // генерация позиций и персонажей на поле
    this.setupTooltip(); // показать информацию о персонаже при наводке на него
    this.setupCellClick(); // создать событие клика на ячейку
    this.activePlayer = 0; // Начинаем с хода первого игрока
    this.switchActivePlayer(); // Запускаем ход первого игрока
  }

  setupTooltip() { // метод показывает/скрывает информацию о персонаже
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
  }

  setupCellClick() { // метод выбирает персонажа
    this.gamePlay.addCellClickListener(this.onCellClick);
  }

  onCellEnter = (index) => { // Событие вызывается при наведении на ячейку поля
    const cellEl = this.gamePlay.cells[index];
    this.currentCell = this.gamePlay.cells.indexOf(cellEl); // Получаем индекс ячейки текущей ячейки
    const selectedCell = this.gamePlay.getIndexSelectedCell();

    const character = this.concatedCharacters.find((char) => char.position === this.currentCell); // Получаем данные персонажа по позиции
    const characterPlayer = this.playerPositionedCharacters.find((char) => char.position === this.currentCell);
    const characterEnemy = this.enemiesPositionedCharacters.find((char) => char.position === this.currentCell);
    const selectedCharacter = this.playerPositionedCharacters.find((char) => char.position === selectedCell);

    if(characterPlayer) { // Если персонаж игрока меняем курсор на pointer
      this.gamePlay.setCursor(this.cursor[1]);
    } else {
      this.gamePlay.setCursor(this.cursor[0]);
    }

    if(character) { // Получаем характеристики персонажа из найденного объекта
      const level = character.character.level;
      const attack = character.character.attack;
      const defence = character.character.defence;
      const health = character.character.health;
      const message = this.gamePlay.getCharacterInfo(level, attack, defence, health);
      this.gamePlay.showCellTooltip(message, this.currentCell);
    }

    if(selectedCharacter && characterEnemy) { // Если персонаж выбран и мы навелись на противника меняем курсор и цвет ячейки в зависимости от дальности аттаки персонажа игрока
      const attackDistance = selectedCharacter.character.attackDistance;
      let vector = this.gamePlay.getVector(this.currentCell, selectedCell, this.gamePlay.boardSize);
      if(attackDistance >= vector) {
        this.gamePlay.selectCell(this.currentCell, 'red');
        this.gamePlay.setCursor(this.cursor[2]);
      } else {
        this.gamePlay.setCursor(this.cursor[3]);
      }
    }

    if(selectedCharacter && !character) { // Если персонаж выбран и мы навелись на пустую ячейку меняем курсор и цвет ячейки в зависимости от дальности движения персонажа игрока
      const moveDistance = selectedCharacter.character.moveDistance;
      let vector = this.gamePlay.getVector(this.currentCell, selectedCell, this.gamePlay.boardSize);
      if(moveDistance >= vector) {
        this.gamePlay.setCursor(this.cursor[1]);
        this.gamePlay.selectCell(this.currentCell, 'green');
      } else {
        this.gamePlay.setCursor(this.cursor[3]);
      }
    }
  }

  onCellLeave = (index) => { // Событие вызывается при уходе курсора из ячейки поля
    const cellEl = this.gamePlay.cells[index];
    this.lastCell = this.gamePlay.cells.indexOf(cellEl); // Получаем индекс ячейки предыдущей ячейки
    this.gamePlay.hideCellTooltip(this.lastCell);
    const selectedCell = this.gamePlay.getIndexSelectedCell();
    if(this.lastCell === selectedCell) {
    } else {
      this.gamePlay.deselectCell(this.lastCell);
    }
  }

  onCellClick = (index) => { // Событие при клике на ячейку поля
    const cellEl = this.gamePlay.cells[index];
    this.currentCell = this.gamePlay.cells.indexOf(cellEl); // Получаем индекс ячейки текущей ячейки
    const selectedCell = this.gamePlay.getIndexSelectedCell();
    const character = this.concatedCharacters.find((char) => char.position === this.currentCell); // Получаем данные персонажа по позиции
    const characterPlayer = this.playerPositionedCharacters.find((char) => char.position === this.currentCell);
    const characterEnemy = this.enemiesPositionedCharacters.find((char) => char.position === this.currentCell);

    if (!this.computerMoveDone) {
      console.log('Дождитесь завершения хода компьютера');
      return;
    }

    if(characterPlayer) {
      this.gamePlay.selectCell(this.currentCell, 'yellow');
      if(this.currentCell === selectedCell) { // При повторном клике снимается выделение
        this.gamePlay.deselectCell(selectedCell);
      } else { // Смена выбранного персонажа
        if (selectedCell !== null) {
          this.gamePlay.deselectCell(selectedCell);
        }
        this.gamePlay.selectCell(this.currentCell, 'yellow');
      } 
    } else if(characterEnemy && selectedCell === null) { // выдаем ошибку, если это не персонаж игрока
      const message = 'Это не персонаж игрока, выберите другого';
      GamePlay.showError(message);
    }
    

    if(selectedCell !== null && !character) {
      const selectedCharacter = this.playerPositionedCharacters.find((char) => char.position === selectedCell);
      const moveDistance = selectedCharacter.character.moveDistance;
      let vector = this.gamePlay.getVector(this.currentCell, selectedCell, this.gamePlay.boardSize);
      if(moveDistance >= vector) {
        selectedCharacter.position = this.currentCell;
        this.gamePlay.redrawPositions(this.concatedCharacters);
        this.gamePlay.deselectCell(selectedCell);
        this.gamePlay.selectCell(this.currentCell, 'yellow');
      }
      this.switchActivePlayer();
    }

    if(selectedCell !== null && characterEnemy) { 
      const selectedCharacter = this.playerPositionedCharacters.find((char) => char.position === selectedCell);
      const attackDistance = selectedCharacter.character.attackDistance;
      let vector = this.gamePlay.getVector(this.currentCell, selectedCell, this.gamePlay.boardSize);
      if(attackDistance >= vector) {
        const damage = Math.max(selectedCharacter.character.attack - characterEnemy.character.defence, selectedCharacter.character.attack * 0.1);
        this.gamePlay.showDamage(this.currentCell, damage).then(() => { // Успешное выполнение действия
          characterEnemy.character.health -= damage; // Отнимаем жизни у врага
          this.gamePlay.redrawPositions(this.concatedCharacters); // Сразу перерисовываем полоску жизни у врага
          if (characterEnemy.character.health <= 0) { // Если жизней у врага меньше или равно 0
            const enemyIndex = this.enemiesPositionedCharacters.indexOf(characterEnemy); // Получаем индекс врага
            this.enemiesPositionedCharacters.splice(enemyIndex, 1); // По индексу удаляем из списка врагов
            const characterIndex = this.concatedCharacters.indexOf(characterEnemy); // Получаем индекс персонажа в списке персонажей
            this.concatedCharacters.splice(characterIndex, 1); // По индексу удаляем из списка персонажей
            this.gamePlay.redrawPositions(this.concatedCharacters); // Перерисовываем поле без убитого врага
          }
        });
      }
      this.switchActivePlayer();
    }
  }

  switchActivePlayer() {
    this.activePlayer = 1 - this.activePlayer; // Переключаем игрока

    if (this.activePlayer === 0) {
      console.log('Ходит игрок');
      this.computerMoveDone = false;
      this.computerTurn(); // Запускаем ход компьютера
    }
  }
  computerTurn() { // Противник умеет пока что только бить в пределах дистанции атаки
    setTimeout(() => {
      const randomTarget = Math.floor(Math.random() * this.playerPositionedCharacters.length) // Выбираем случайного персонажа игрока
      const targetPosition = this.playerPositionedCharacters[randomTarget].position

      const randomComputerCharacter = Math.floor(Math.random() * this.enemiesPositionedCharacters.length) // Выбираем случайного персонажа компьютера
      const attackingCharacterPosition = this.enemiesPositionedCharacters[randomComputerCharacter].position;
      const attackDistance = this.enemiesPositionedCharacters[randomComputerCharacter].character.attackDistance;
      const moveDistance = this.enemiesPositionedCharacters[randomComputerCharacter].character.moveDistance;

      let vector = this.gamePlay.getVector(targetPosition, attackingCharacterPosition, this.gamePlay.boardSize);
      if(attackDistance >= vector) {
        const damage = Math.max(this.enemiesPositionedCharacters[randomComputerCharacter].character.attack - this.playerPositionedCharacters[randomTarget].character.defence, this.enemiesPositionedCharacters[randomComputerCharacter].character.attack * 0.1);
        this.gamePlay.showDamage(targetPosition, damage).then(() => {  // Успешное выполнение действия
          this.playerPositionedCharacters[randomTarget].character.health -= damage; // Отнимаем жизни у персонажа игрока
          this.gamePlay.redrawPositions(this.concatedCharacters); // Сразу перерисовываем полоску жизни у персонажа игрока
          if (this.playerPositionedCharacters[randomTarget].character.health <= 0) { // Если жизней у персонажа меньше или равно 0
            this.playerPositionedCharacters.splice(randomTarget, 1); // По индексу удаляем из списка персонажей
            const characterIndex = this.concatedCharacters.findIndex((char) => char.position === targetPosition); // Получаем индекс персонажа игрока в списке персонажей
            this.concatedCharacters.splice(characterIndex, 1); // По индексу удаляем из списка персонажей
            this.gamePlay.redrawPositions(this.concatedCharacters); // Перерисовываем поле без убитого персонажа
          }
        })
      }
      this.computerMoveDone = true; // Завершил ход компьютера
      this.switchActivePlayer(); // После хода компьютера переключаем ход на игрока
    }, 2000); // Задержка перед ходом компьютера
  }
}
