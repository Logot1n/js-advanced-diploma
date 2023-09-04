/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/Board/themes.js
const themes = {
  prairie: 'prairie',
  desert: 'desert',
  arctic: 'arctic',
  mountain: 'mountain'
};
/* harmony default export */ const Board_themes = (themes);
;// CONCATENATED MODULE: ./src/js/generateTeam/Team.js
/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
class Team {
  constructor(characters) {
    this.characters = characters;
  }
}
;// CONCATENATED MODULE: ./src/js/generateTeam/Character.js
/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
class Character {
  constructor(level) {
    let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'generic';
    if (new.target === Character) {
      // Создаем ошибку при создание класса Character. Можно создавать только классы наследуемые от Character.
      throw new Error('Нельзя создать новый экземпляр класса Character');
    }
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
  }
}
;// CONCATENATED MODULE: ./src/js/generateTeam/PositionedCharacter.js

class PositionedCharacter {
  constructor(character, position) {
    this.character = character;
    this.position = position;
    if (!(character instanceof Character)) {
      throw new Error('character must be instance of Character or its children');
    }
    if (typeof position !== 'number') {
      throw new Error('position must be a number');
    }
  }
}
;// CONCATENATED MODULE: ./src/js/generateTeam/characters/Bowman.js

class Bowman extends Character {
  constructor(level) {
    super(level, 'bowman'); // Вызываем конструктор базового класса
    this.attack = 25;
    this.defence = 25;
    this.moveDistance = 2;
    this.attackDistance = 2;
  }
}
;// CONCATENATED MODULE: ./src/js/generateTeam/characters/Swordsman.js

class Swordsman extends Character {
  constructor(level) {
    super(level, 'swordsman'); // Вызываем конструктор базового класса
    this.attack = 40;
    this.defence = 15;
    this.moveDistance = 4;
    this.attackDistance = 1;
  }
}
;// CONCATENATED MODULE: ./src/js/generateTeam/characters/Magician.js

class Magician extends Character {
  constructor(level) {
    super(level, 'magician'); // Вызываем конструктор базового класса
    this.attack = 20;
    this.defence = 30;
    this.moveDistance = 1;
    this.attackDistance = 4;
  }
}
;// CONCATENATED MODULE: ./src/js/generateTeam/characters/Daemon.js

class Daemon extends Character {
  constructor(level) {
    super(level, 'daemon'); // Вызываем конструктор базового класса
    this.attack = 20;
    this.defence = 30;
    this.moveDistance = 1;
    this.attackDistance = 4;
  }
}
;// CONCATENATED MODULE: ./src/js/generateTeam/characters/Undead.js

class Undead extends Character {
  constructor(level) {
    super(level, 'undead'); // Вызываем конструктор базового класса
    this.attack = 40;
    this.defence = 15;
    this.moveDistance = 4;
    this.attackDistance = 1;
  }
}
;// CONCATENATED MODULE: ./src/js/generateTeam/characters/Vampire.js

class Vampire extends Character {
  constructor(level) {
    super(level, 'vampire'); // Вызываем конструктор базового класса
    this.attack = 25;
    this.defence = 25;
    this.moveDistance = 2;
    this.attackDistance = 2;
  }
}
;// CONCATENATED MODULE: ./src/js/generateTeam/generators.js









/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param playerTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
function* characterGenerator(playerTypes, maxLevel) {
  while (true) {
    const randomIndex = Math.floor(Math.random() * playerTypes.length);
    const RandomType = playerTypes[randomIndex];
    const level = Math.ceil(Math.random() * maxLevel);
    yield new RandomType(level);
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param playerTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
function generateTeam(playerTypes, maxLevel, characterCount) {
  const characters = [];
  const generator = characterGenerator(playerTypes, maxLevel);
  for (let i = 0; i < characterCount; i++) {
    const character = generator.next().value;
    characters.push(character);
  }
  return new Team(characters);
}
const generatePlayerPositionedCharacters = () => {
  // Новая функция генерации позиции команды игрока
  const playerTypes = [Bowman, Swordsman, Magician];
  const playerTeam = generateTeam(playerTypes, 1, 4);
  const playerCharacters = playerTeam.characters;
  const playerPositions = [];
  while (playerCharacters.length !== playerPositions.length) {
    const position = 8 * Math.floor(Math.random() * 8) + Math.round(Math.random());
    if (playerPositions.includes(position)) {
      continue;
    }
    playerPositions.push(position);
  }
  const playerPositionedCharacters = playerCharacters.map((character, i) => new PositionedCharacter(character, playerPositions[i]));
  return playerPositionedCharacters;
};
const generatePlayerNewPositionedCharacters = playerPositionedCharacters => {
  // Генерация новых позиций персонажей игрока в случае смены уровня
  const playerPositions = [];
  while (playerPositions.length !== 4) {
    const position = 8 * Math.floor(Math.random() * 8) + Math.round(Math.random());
    if (playerPositions.includes(position)) {
      continue;
    }
    playerPositions.push(position);
  }
  playerPositionedCharacters.forEach(char => {
    const randomIndex = Math.floor(Math.random() * playerPositions.length);
    const newPosition = playerPositions[randomIndex];
    char.position = newPosition;
    playerPositions.splice(randomIndex, 1);
  });
};
const generateEnemyPositionedCharacters = (currentTheme, themes) => {
  // Новая функция генерации позиции команды противника
  const enemysTypes = [Daemon, Undead, Vampire];
  let enemyTeam;
  if (currentTheme === themes.prairie) {
    // Условия для смены карты
    enemyTeam = generateTeam(enemysTypes, 1, 2);
  } else if (currentTheme === themes.desert) {
    enemyTeam = generateTeam(enemysTypes, 1, 3);
  } else if (currentTheme === themes.arctic) {
    enemyTeam = generateTeam(enemysTypes, 1, 4);
  } else if (currentTheme === themes.mountain) {
    enemyTeam = generateTeam(enemysTypes, 1, 5);
  }
  const enemyCharacters = enemyTeam.characters;
  const enemyPositions = [];
  while (enemyCharacters.length !== enemyPositions.length) {
    const position = 8 * Math.floor(Math.random() * 8) + Math.round(Math.random()) + 6;
    if (enemyPositions.includes(position)) {
      continue;
    }
    enemyPositions.push(position);
  }
  const enemiesPositionedCharacters = enemyCharacters.map((character, i) => new PositionedCharacter(character, enemyPositions[i]));
  return enemiesPositionedCharacters;
};
function whatAreChar(data) {
  let character;
  if (data.character.type === 'bowman') {
    character = new Bowman(data.character.level);
  } else if (data.character.type === 'swordsman') {
    character = new Swordsman(data.character.level);
  } else if (data.character.type === 'magician') {
    character = new Magician(data.character.level);
  } else if (data.character.type === 'daemon') {
    character = new Daemon(data.character.level);
  } else if (data.character.type === 'undead') {
    character = new Undead(data.character.level);
  } else if (data.character.type === 'vampire') {
    character = new Vampire(data.character.level);
  }
  character.attack = data.character.attack;
  character.defence = data.character.defence;
  character.health = data.character.health;
  character.type = data.character.type;
  character.attackDistance = data.character.attackDistance;
  character.moveDistance = data.character.moveDistance;
  return new PositionedCharacter(character, data.position);
}
;// CONCATENATED MODULE: ./src/js/cursors.js
const cursors = {
  auto: 'auto',
  pointer: 'pointer',
  crosshair: 'crosshair',
  notallowed: 'not-allowed'
};
/* harmony default export */ const js_cursors = (cursors);
;// CONCATENATED MODULE: ./src/js/GameState.js
class GameState {
  constructor(currentTheme, playerPositionedCharacters, enemiesPositionedCharacters, activePlayer, computerMoveDone, isGameFieldLocked) {
    this.currentTheme = currentTheme;
    this.playerPositionedCharacters = playerPositionedCharacters;
    this.enemiesPositionedCharacters = enemiesPositionedCharacters;
    this.activePlayer = activePlayer;
    this.computerMoveDone = computerMoveDone;
    this.isGameFieldLocked = isGameFieldLocked;
  }
  static from(object) {
    const gameState = new GameState();
    gameState.currentTheme = object.currentTheme;
    gameState.playerPositionedCharacters = object.playerPositionedCharacters;
    gameState.enemiesPositionedCharacters = object.enemiesPositionedCharacters;
    gameState.activePlayer = object.activePlayer;
    gameState.computerMoveDone = object.computerMoveDone;
    gameState.isGameFieldLocked = object.isGameFieldLocked;
    return gameState;
  }
}
;// CONCATENATED MODULE: ./src/js/GameController.js




class GameController {
  // основной контролирующий класс приложения
  constructor(gamePlay, stateService) {
    // класс принимает экземпляр gamePlay и stateService
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.themes = Board_themes;
    this.currentTheme = this.themes.prairie;
    this.playerPositionedCharacters = [];
    this.enemiesPositionedCharacters = [];
    this.concatedCharacters = [];
    this.activePlayer = null;
    this.computerMoveDone = true;
    this.cursor = js_cursors;
    this.currentCell = null;
    this.lastCell = null;
    this.isGameFieldLocked = false;
  }
  init() {
    // Инициализация игры
    this.gamePlay.drawUi(Board_themes.prairie); // отрисовка игрового поля с выбранной темой
    this.playerPositionedCharacters = generatePlayerPositionedCharacters(); // позиции и персонажи команды игрока
    this.enemiesPositionedCharacters = generateEnemyPositionedCharacters(this.currentTheme, this.themes); // позиции и персонажи команды противника
    this.concatedCharacters = [...this.playerPositionedCharacters, ...this.enemiesPositionedCharacters];
    this.gamePlay.redrawPositions(this.concatedCharacters); // генерация позиций и персонажей на поле
    this.setupMoveCursor(); // показать информацию о персонаже при наводке на него
    this.setupClickCursor(); // создать событие клика на ячейку
    this.setupControls(); // подписка на кнопки управления
    this.activePlayer = 0; // Начинаем с хода первого игрока
  }

  setupMoveCursor() {
    // Подписка на движение курсора
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  }
  setupClickCursor() {
    // Подписка на клик
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }
  setupControls() {
    // Подписка на кнопки управления
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));
  }
  onNewGameClick() {
    window.location.reload();
  }
  onSaveGameClick() {
    const state = GameState.from({
      currentTheme: this.currentTheme,
      playerPositionedCharacters: this.playerPositionedCharacters,
      enemiesPositionedCharacters: this.enemiesPositionedCharacters,
      activePlayer: this.activePlayer,
      computerMoveDone: this.computerMoveDone,
      isGameFieldLocked: this.isGameFieldLocked
    });
    this.stateService.save(state);
    this.gamePlay.showMessage('Игра сохранена');
  }
  onLoadGameClick() {
    const loadedState = this.stateService.load();
    if (loadedState) {
      const {
        currentTheme,
        playerPositionedCharacters,
        enemiesPositionedCharacters,
        activePlayer,
        computerMoveDone,
        isGameFieldLocked
      } = loadedState;
      this.currentTheme = currentTheme;
      this.playerPositionedCharacters = playerPositionedCharacters.map(data => whatAreChar(data));
      this.enemiesPositionedCharacters = enemiesPositionedCharacters.map(data => whatAreChar(data));
      this.concatedCharacters = [...this.playerPositionedCharacters, ...this.enemiesPositionedCharacters];
      this.activePlayer = activePlayer;
      this.computerMoveDone = computerMoveDone;
      this.isGameFieldLocked = isGameFieldLocked;
    } else {
      this.gamePlay.showError('Сохранение не найдено');
    }
    this.gamePlay.resetEvents();
    this.gamePlay.drawUi(this.currentTheme); // Перерисовываем интерфейс с темой
    this.gamePlay.redrawPositions(this.concatedCharacters); // Перерисовываем позиции персонажей
    this.setupMoveCursor(); // показать информацию о персонаже при наводке на него
    this.setupClickCursor(); // создать событие клика на ячейку
    this.setupControls(); // подписка на кнопки управления
    this.gamePlay.showMessage('Игровое сохранение загружено');
  }
  onCellEnter(index) {
    // Событие вызывается при наведении на ячейку поля
    const cellEl = this.gamePlay.cells[index];
    this.currentCell = this.gamePlay.cells.indexOf(cellEl); // Получаем индекс текущей ячейки
    const selectedCell = this.gamePlay.getIndexSelectedCell();
    const selectedCharacter = this.playerPositionedCharacters.find(char => char.position === selectedCell);
    const {
      character,
      characterPlayer,
      characterEnemy
    } = this.getCharByCell(this.currentCell); // Получаем данные персонажа по позиции

    if (characterPlayer) {
      // Если персонаж игрока меняем курсор на pointer
      this.gamePlay.setCursor(this.cursor.pointer);
    } else {
      this.gamePlay.setCursor(this.cursor.auto);
    }
    if (character) {
      // Получаем характеристики персонажа из найденного объекта
      const {
        level,
        attack,
        defence,
        health
      } = character.character;
      const message = this.gamePlay.getCharacterInfo(level, attack, defence, health);
      this.gamePlay.showCellTooltip(message, this.currentCell);
    }
    if (selectedCharacter && characterEnemy) {
      // Если персонаж выбран и мы навелись на противника меняем курсор и цвет ячейки в зависимости от дальности аттаки персонажа игрока
      const {
        attackDistance
      } = selectedCharacter.character;
      const vector = this.gamePlay.getVector(this.currentCell, selectedCell, this.gamePlay.boardSize);
      if (attackDistance >= vector) {
        this.gamePlay.selectCell(this.currentCell, 'red');
        this.gamePlay.setCursor(this.cursor.crosshair);
      } else {
        this.gamePlay.setCursor(this.cursor.notallowed);
      }
    }
    if (selectedCharacter && !character) {
      // Если персонаж выбран и мы навелись на пустую ячейку меняем курсор и цвет ячейки в зависимости от дальности движения персонажа игрока
      const {
        moveDistance
      } = selectedCharacter.character;
      const vector = this.gamePlay.getVector(this.currentCell, selectedCell, this.gamePlay.boardSize);
      if (moveDistance >= vector) {
        this.gamePlay.setCursor(this.cursor.pointer);
        this.gamePlay.selectCell(this.currentCell, 'green');
      } else {
        this.gamePlay.setCursor(this.cursor.notallowed);
      }
    }
  }
  onCellLeave(index) {
    // Событие вызывается при уходе курсора из ячейки поля
    const cellEl = this.gamePlay.cells[index];
    this.lastCell = this.gamePlay.cells.indexOf(cellEl); // Получаем индекс ячейки предыдущей ячейки
    this.gamePlay.hideCellTooltip(this.lastCell);
    const selectedCell = this.gamePlay.getIndexSelectedCell();
    if (this.lastCell === selectedCell) {} else {
      this.gamePlay.deselectCell(this.lastCell);
    }
  }
  onCellClick(index) {
    // Событие при клике на ячейку поля
    if (this.isGameFieldLocked) {
      return;
    }
    const cellEl = this.gamePlay.cells[index];
    this.currentCell = this.gamePlay.cells.indexOf(cellEl); // Получаем индекс текущей ячейки
    const selectedCell = this.gamePlay.getIndexSelectedCell();
    const selectedCharacter = this.playerPositionedCharacters.find(char => char.position === selectedCell);
    const selectedCharacterIndex = this.playerPositionedCharacters.findIndex(char => char.position === selectedCell);
    const {
      character,
      characterPlayer,
      characterEnemy
    } = this.getCharByCell(this.currentCell); // Получаем данные персонажа по позиции

    if (!this.computerMoveDone) {
      this.gamePlay.showMessage('Дождитесь завершения хода компьютера');
      return;
    }
    if (characterPlayer) {
      this.gamePlay.selectCell(this.currentCell, 'yellow');
      if (this.currentCell === selectedCell) {
        // При повторном клике снимается выделение
        this.gamePlay.deselectCell(selectedCell);
      } else {
        // Смена выбранного персонажа
        if (selectedCell !== null) {
          this.gamePlay.deselectCell(selectedCell);
        }
        this.gamePlay.selectCell(this.currentCell, 'yellow');
      }
    } else if (characterEnemy && selectedCell === null) {
      // выдаем ошибку, если это не персонаж игрока
      const message = 'Это не персонаж игрока, выберите другого';
      this.gamePlay.showError(message);
    }
    if (selectedCell !== null && !character) {
      // Перемещение выбранного персонажа
      const {
        moveDistance
      } = selectedCharacter.character;
      const vector = this.gamePlay.getVector(this.currentCell, selectedCell, this.gamePlay.boardSize);
      if (moveDistance >= vector) {
        selectedCharacter.position = this.currentCell;
        this.playerPositionedCharacters[selectedCharacterIndex].position = this.currentCell;
        this.gamePlay.redrawPositions(this.concatedCharacters);
        this.gamePlay.deselectCell(selectedCell);
        this.gamePlay.selectCell(this.currentCell, 'yellow');
      }
      this.switchActivePlayer();
    }
    if (selectedCell !== null && characterEnemy) {
      const {
        attackDistance
      } = selectedCharacter.character;
      const vector = this.gamePlay.getVector(this.currentCell, selectedCell, this.gamePlay.boardSize);
      if (attackDistance >= vector) {
        const damage = Math.floor(Math.max(selectedCharacter.character.attack - characterEnemy.character.defence, selectedCharacter.character.attack * 0.1));
        this.gamePlay.showDamage(this.currentCell, damage).then(() => {
          // Успешное выполнение действия
          characterEnemy.character.health -= damage; // Отнимаем жизни у врага
          this.gamePlay.redrawPositions(this.concatedCharacters); // Сразу перерисовываем полоску жизни у врага
          if (characterEnemy.character.health <= 0) {
            // Если жизней у врага меньше или равно 0
            const enemyIndex = this.enemiesPositionedCharacters.indexOf(characterEnemy); // Получаем индекс врага
            this.enemiesPositionedCharacters.splice(enemyIndex, 1); // По индексу удаляем из списка врагов
            const characterIndex = this.concatedCharacters.indexOf(characterEnemy); // Получаем индекс персонажа в списке персонажей
            this.concatedCharacters.splice(characterIndex, 1); // По индексу удаляем из списка персонажей
            this.gamePlay.redrawPositions(this.concatedCharacters); // Перерисовываем поле без убитого врага
          }
        });
      }

      if (this.enemiesPositionedCharacters.length === 0) {
        this.loseOrNextLevel();
      }
      this.switchActivePlayer();
    }
  }
  computerTurn() {
    // Актуальный код для хода компьютера
    setTimeout(() => {
      if (this.enemiesPositionedCharacters.length === 0) {
        this.computerMoveDone = true;
        this.loseOrNextLevel();
        this.switchActivePlayer();
        return;
      }
      const selectedCell = this.gamePlay.getIndexSelectedCell();
      let nearestDistanceOverall = Infinity; // Изначально устанавливаем бесконечное значение для общей ближайшей дистанции
      let nearestComputerIndex; // Индекс компьютера с самой ближней дистанцией
      let nearestTarget = null;
      let nearestTargetPosition; // Позиция игрока, ближайшего к компьютеру с самой ближней дистанцией

      for (let i = 0; i < this.enemiesPositionedCharacters.length; i++) {
        const computer = this.enemiesPositionedCharacters[i];
        let nearestDistance = Infinity;
        let target;
        let targetPosition;
        for (let j = 0; j < this.playerPositionedCharacters.length; j++) {
          const playerCharacter = this.playerPositionedCharacters[j];
          const distance = this.gamePlay.getVector(playerCharacter.position, computer.position, this.gamePlay.boardSize);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            target = playerCharacter;
            targetPosition = playerCharacter.position;
          }
        }
        if (nearestDistance < nearestDistanceOverall) {
          nearestDistanceOverall = nearestDistance;
          nearestComputerIndex = i;
          nearestTarget = target;
          nearestTargetPosition = targetPosition;
        }
      }
      if (nearestDistanceOverall !== Infinity) {
        // Если цель найдена
        const computer = this.enemiesPositionedCharacters[nearestComputerIndex];
        const {
          attackDistance
        } = computer.character;
        const {
          moveDistance
        } = computer.character;
        const computerCharPosition = computer.position;
        const computerIndex = this.enemiesPositionedCharacters.findIndex(char => char.position === computerCharPosition);
        let newPosition;
        const computerX = computerCharPosition % this.gamePlay.boardSize;
        const computerY = Math.floor(computerCharPosition / this.gamePlay.boardSize);
        const playerX = nearestTargetPosition % this.gamePlay.boardSize;
        const playerY = Math.floor(nearestTargetPosition / this.gamePlay.boardSize);
        if (nearestDistanceOverall <= attackDistance) {
          console.log('компьютер атакует, цель найдена');
          const damage = Math.floor(Math.max(computer.character.attack - nearestTarget.character.defence, computer.character.attack * 0.1));
          this.gamePlay.showDamage(nearestTargetPosition, damage).then(() => {
            nearestTarget.character.health -= damage;
            this.gamePlay.redrawPositions(this.concatedCharacters);
            if (nearestTarget.character.health <= 0) {
              const index = this.playerPositionedCharacters.findIndex(char => char.position === nearestTargetPosition);
              this.playerPositionedCharacters.splice(index, 1); // По индексу удаляем из списка персонажей
              const characterIndex = this.concatedCharacters.findIndex(char => char.position === nearestTargetPosition); // Получаем индекс персонажа игрока в списке персонажей
              this.concatedCharacters.splice(characterIndex, 1); // По индексу удаляем из списка персонажей
              this.gamePlay.redrawPositions(this.concatedCharacters); // Перерисовываем поле без убитого персонажа игрока
              if (selectedCell === nearestTargetPosition) {
                // если он был активен, снимаем выделение
                this.gamePlay.deselectCell(selectedCell);
              }
            }
          });
        } else if (moveDistance < nearestDistanceOverall && attackDistance < nearestDistanceOverall || nearestDistanceOverall > attackDistance && nearestDistanceOverall < moveDistance) {
          console.log('компьютер двигается, цель не найдена');
          const requariedMoveDistance = nearestDistanceOverall - attackDistance;
          const sumProp = attackDistance + moveDistance;
          if (nearestDistanceOverall > sumProp) {
            newPosition = this.gamePlay.computerMoving(computerX, computerY, playerX, playerY, computerCharPosition, moveDistance);
          } else {
            newPosition = this.gamePlay.computerMoving(computerX, computerY, playerX, playerY, computerCharPosition, requariedMoveDistance);
          }

          // Проверяем, что новая позиция находится в пределах игрового поля
          if (newPosition >= 0 && newPosition < this.gamePlay.boardSize ** 2 && !this.concatedCharacters.some(char => char.position === newPosition)) {
            computer.position = newPosition;
            this.enemiesPositionedCharacters[computerIndex].position = newPosition;
            this.gamePlay.redrawPositions(this.concatedCharacters);
          }
        }
      } else {
        // Цель не найдена
        console.log('таргет === null, выбирается случайное направление движения');
        const randomComputerIndex = Math.floor(Math.random() * this.enemiesPositionedCharacters.length);
        const randomComputer = this.enemiesPositionedCharacters[randomComputerIndex];
        const randomComputerPosition = randomComputer.position;
        const randomComputerMoveDistance = randomComputer.character.moveDistance;
        let newPosition = this.gamePlay.getRandomMove(randomComputerPosition, this.gamePlay.boardSize, randomComputerMoveDistance);
        const enemyPositions = this.enemiesPositionedCharacters.map(char => char.position);
        // Проверяем, что новая позиция находится в пределах игрового поля
        while (enemyPositions.includes(newPosition) || newPosition < 0 || newPosition >= this.gamePlay.boardSize ** 2) {
          newPosition = this.gamePlay.getRandomMove(randomComputerPosition, this.gamePlay.boardSize, randomComputerMoveDistance);
        }
        this.enemiesPositionedCharacters[randomComputerIndex].position = newPosition;
        randomComputer.position = newPosition;
        this.gamePlay.redrawPositions(this.concatedCharacters);
      }
      this.computerMoveDone = true;
      if (this.playerPositionedCharacters.length === 0) {
        this.loseOrNextLevel();
      } else {
        this.switchActivePlayer();
      }
    }, 2000);
  }
  switchActivePlayer() {
    // Смена активного игрока
    this.activePlayer = 1 - this.activePlayer; // Переключаем игрока

    if (this.activePlayer === 0) {} else {
      this.computerMoveDone = false;
      this.computerTurn(); // Запускаем ход компьютера
    }
  }

  getCharByCell(position) {
    // Получаем данные персонажа по позиции
    const character = this.concatedCharacters.find(char => char.position === position); // Получаем данные персонажа по позиции
    const characterPlayer = this.playerPositionedCharacters.find(char => char.position === position);
    const characterEnemy = this.enemiesPositionedCharacters.find(char => char.position === position);
    return {
      character,
      characterPlayer,
      characterEnemy
    };
  }
  loseOrNextLevel() {
    // Проверка на победу или переход на следующий уровень
    if (this.currentTheme === this.themes.mountain && this.enemiesPositionedCharacters.length === 0) {
      // Условие для победы
      this.gamePlay.showMessage('ВЫ ПОБЕДИЛИ!');
      this.isGameFieldLocked = true; // Запрет на действия на игровом поле
    }

    if (this.isGameFieldLocked !== true && this.enemiesPositionedCharacters.length === 0) {
      this.gamePlay.showMessage('переходим на следующий уровень!');
      this.gamePlay.reloadStats(this.playerPositionedCharacters); // Обновляем статы персонажей игрока

      if (this.currentTheme === this.themes.prairie) {
        // Условия для смены карты
        this.gamePlay.drawUi(this.themes.desert);
        this.currentTheme = this.themes.desert;
      } else if (this.currentTheme === this.themes.desert) {
        this.gamePlay.drawUi(this.themes.arctic);
        this.currentTheme = this.themes.arctic;
      } else if (this.currentTheme === this.themes.arctic) {
        this.gamePlay.drawUi(this.themes.mountain);
        this.currentTheme = this.themes.mountain;
      }
      this.enemiesPositionedCharacters = generateEnemyPositionedCharacters(this.currentTheme, this.themes);
      this.gamePlay.computerReloadStats(this.enemiesPositionedCharacters, this.currentTheme, this.themes); // Обновляем статы персонажей компьютера
      generatePlayerNewPositionedCharacters(this.playerPositionedCharacters); // Придаем случайные позиции персонажам игрока
      this.concatedCharacters = [...this.playerPositionedCharacters, ...this.enemiesPositionedCharacters];
      this.gamePlay.redrawPositions(this.concatedCharacters); // Перерисовываем поле
    }
  }
}
;// CONCATENATED MODULE: ./src/js/Board/utils.js
/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */

function calcTileType(index, boardSize) {
  const row = Math.floor(index / boardSize);
  const col = Math.ceil(index % boardSize);
  if (row === 0 && col === 0) {
    return 'top-left';
  }
  if (row === 0 && col === boardSize - 1) {
    return 'top-right';
  }
  if (row === boardSize - 1 && col === 0) {
    return 'bottom-left';
  }
  if (row === boardSize - 1 && col === boardSize - 1) {
    return 'bottom-right';
  }
  if (row === 0) {
    return 'top';
  }
  if (row === boardSize - 1) {
    return 'bottom';
  }
  if (col === 0) {
    return 'left';
  }
  if (col === boardSize - 1) {
    return 'right';
  }
  return 'center';
}
function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }
  if (health < 50) {
    return 'normal';
  }
  return 'high';
}
;// CONCATENATED MODULE: ./src/js/GamePlay.js

class GamePlay {
  // Класс отвечает за создание игровых действий
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
  drawUi(theme) {
    // Создание основной HTML-страницы с выбранной темой
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
    this.newGameEl.addEventListener('click', event => this.onNewGameClick(event));
    this.saveGameEl.addEventListener('click', event => this.onSaveGameClick(event));
    this.loadGameEl.addEventListener('click', event => this.onLoadGameClick(event));
    this.boardEl = this.container.querySelector('[data-id=board]');
    this.boardEl.classList.add(theme);
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('cell', 'map-tile', `map-tile-${calcTileType(i, this.boardSize)}`);
      cellEl.addEventListener('mouseenter', event => this.onCellEnter(event));
      cellEl.addEventListener('mouseleave', event => this.onCellLeave(event));
      cellEl.addEventListener('click', event => this.onCellClick(event));
      this.boardEl.appendChild(cellEl);
    }
    this.cells = Array.from(this.boardEl.children);
  }
  deleteBoard() {
    this.container.innerHTML = '';
  }
  resetEvents() {
    this.newGameEl.removeEventListener('click', event => this.onNewGameClick(event));
    this.saveGameEl.removeEventListener('click', event => this.onSaveGameClick(event));
    this.loadGameEl.removeEventListener('click', event => this.onLoadGameClick(event));
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.querySelector('.cell');
      cellEl.removeEventListener('mouseenter', event => this.onCellEnter(event));
      cellEl.removeEventListener('mouseleave', event => this.onCellLeave(event));
      cellEl.removeEventListener('click', event => this.onCellClick(event));
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
  redrawPositions(positions) {
    // Отрисовка позиций персонажей на поле
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
  addCellEnterListener(callback) {
    // Вход указателя мыши в ячейку поля
    this.cellEnterListeners.push(callback);
  }

  /**
   * Add listener to mouse leave for cell
   *
   * @param callback
   */
  addCellLeaveListener(callback) {
    // Выход указателя мыши из ячейки поля
    this.cellLeaveListeners.push(callback);
  }

  /**
   * Add listener to mouse click for cell
   *
   * @param callback
   */
  addCellClickListener(callback) {
    // Клик мышью по ячейке поля
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
    this.cellEnterListeners.forEach(o => o.call(null, index));
  }
  onCellLeave(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellLeaveListeners.forEach(o => o.call(null, index));
  }
  onCellClick(event) {
    const index = this.cells.indexOf(event.currentTarget);
    this.cellClickListeners.forEach(o => o.call(null, index));
  }
  onNewGameClick(event) {
    event.preventDefault();
    this.newGameListeners.forEach(o => o.call(null));
  }
  onSaveGameClick(event) {
    event.preventDefault();
    this.saveGameListeners.forEach(o => o.call(null));
  }
  onLoadGameClick(event) {
    event.preventDefault();
    this.loadGameListeners.forEach(o => o.call(null));
  }
  showError(message) {
    throw new Error(message);
  }
  showMessage(message) {
    alert(message);
  }
  selectCell(index) {
    let color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'yellow';
    this.deselectCell(index);
    this.cells[index].classList.add('selected', `selected-${color}`);
  }
  deselectCell(index) {
    const cell = this.cells[index];
    cell.classList.remove(...Array.from(cell.classList).filter(o => o.startsWith('selected')));
  }
  showCellTooltip(message, index) {
    this.cells[index].title = message;
  }
  hideCellTooltip(index) {
    this.cells[index].title = '';
  }
  showDamage(index, damage) {
    return new Promise(resolve => {
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
  getCharacterInfo(level, attack, defence, health) {
    // возвращаем информацию о персонаже
    const medal = String.fromCodePoint(0x1F396);
    const swords = String.fromCodePoint(0x2694);
    const shield = String.fromCodePoint(0x1F6E1);
    const heart = String.fromCodePoint(0x2764);
    return `${medal} ${level} ${swords} ${attack} ${shield} ${defence} ${heart} ${health}`;
  }
  getVector(currentCell, activeCell, boardSize) {
    // получаем вектор перемещения персонажа
    let result;
    const diff = Math.abs(currentCell - activeCell);
    const mod = currentCell % boardSize;
    const diagDiffKoef = Math.abs(Math.floor(currentCell / boardSize) - Math.floor(activeCell / boardSize));

    // вертикаль
    if (mod - activeCell % boardSize === 0) {
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
  getRandomMove(currentPosition, boardSize, moveDistance) {
    // Генерация перемещения компьютера, если цель не была найдена.
    const randomDirection = Math.floor(Math.random() * 4);
    const randomMove = Math.floor(Math.random() * moveDistance) + 1;
    let newPosition;
    switch (randomDirection) {
      case 0:
        // Влево
        newPosition = currentPosition % boardSize - randomMove >= 0 ? currentPosition - randomMove : currentPosition;
        break;
      case 1:
        // Вправо
        newPosition = currentPosition % boardSize + randomMove < boardSize ? currentPosition + randomMove : currentPosition;
        break;
      case 2:
        // Вверх
        newPosition = Math.floor(currentPosition / boardSize) - randomMove >= 0 ? currentPosition - boardSize * randomMove : currentPosition;
        break;
      default:
        // Вниз
        newPosition = Math.floor(currentPosition / boardSize) + randomMove < boardSize ? currentPosition + boardSize * randomMove : currentPosition;
        break;
    }
    return newPosition;
  }
  computerMoving(computerX, computerY, playerX, playerY, computerCharPosition, move) {
    // Перемещение компьютера
    let newPosition;
    if (computerY === playerY) {
      // движение по горизонтали
      if (computerX > playerX) {
        newPosition = computerCharPosition - move;
      } else {
        newPosition = computerCharPosition + move;
      }
    } else if (computerX === playerX) {
      // движение по вертикали
      if (computerY > playerY) {
        newPosition = computerCharPosition - this.boardSize * move;
      } else {
        newPosition = computerCharPosition + this.boardSize * move;
      }
    } else if (computerX > playerX && computerY > playerY) {
      // Влево и вверх
      newPosition = computerCharPosition - this.boardSize * move - move;
    } else if (computerX < playerX && computerY < playerY) {
      // Вправо и вниз
      newPosition = computerCharPosition + this.boardSize * move + move;
    } else if (computerX < playerX && computerY > playerY) {
      // Вправо и вверх
      newPosition = computerCharPosition - this.boardSize * move + move;
    } else if (computerX > playerX && computerY < playerY) {
      // Влево и вниз
      newPosition = computerCharPosition + this.boardSize * move - move;
    }
    return newPosition;
  }
  getIndexSelectedCell() {
    // Получаем индекс выбранного персонажа или возвращаем null
    const selectCell = this.cells.find(cellEl => cellEl.classList.contains('selected-yellow'));
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
  reloadStats(playerPositionedCharacters) {
    // Обновление характеристик персонажей игрока
    playerPositionedCharacters.forEach(char => {
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
  computerReloadStats(enemiesPositionedCharacters, currentTheme, themes) {
    // Обновление характеристик персонажей компьютера
    enemiesPositionedCharacters.forEach(char => {
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
;// CONCATENATED MODULE: ./src/js/GameStateService.js
class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }
  save(state) {
    this.storage.setItem('state', JSON.stringify(state));
  }
  load() {
    try {
      return JSON.parse(this.storage.getItem('state'));
    } catch (e) {
      throw new Error('Invalid state');
    }
  }
}
;// CONCATENATED MODULE: ./src/js/app.js
/**
 * Entry point of app: don't change this
 */



const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector('#game-container'));
const stateService = new GameStateService(localStorage);
const gameCtrl = new GameController(gamePlay, stateService);
gameCtrl.init();
// don't write your code here
;// CONCATENATED MODULE: ./src/index.js



// Точка входа webpack
// Не пишите код в данном файле
/******/ })()
;