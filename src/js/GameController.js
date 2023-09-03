import themes from './Board/themes';
import {
  generatePlayerPositionedCharacters, generateEnemyPositionedCharacters, generatePlayerNewPositionedCharacters, whatAreChar,
} from './generateTeam/generators';
import cursors from './cursors';
import GameState from './GameState';

export default class GameController { // основной контролирующий класс приложения
  constructor(gamePlay, stateService) { // класс принимает экземпляр gamePlay и stateService
    this.gamePlay = gamePlay;
    this.stateService = stateService;

    this.themes = themes;
    this.currentTheme = this.themes.prairie;
    this.playerPositionedCharacters = [];
    this.enemiesPositionedCharacters = [];
    this.concatedCharacters = [];
    this.activePlayer = null;
    this.computerMoveDone = true;

    this.cursor = cursors;

    this.currentCell = null;
    this.lastCell = null;

    this.isGameFieldLocked = false;
  }

  init() { // Инициализация игры
    this.gamePlay.drawUi(themes.prairie); // отрисовка игрового поля с выбранной темой
    this.playerPositionedCharacters = generatePlayerPositionedCharacters(); // позиции и персонажи команды игрока
    this.enemiesPositionedCharacters = generateEnemyPositionedCharacters(this.currentTheme, this.themes); // позиции и персонажи команды противника
    this.concatedCharacters = [...this.playerPositionedCharacters, ...this.enemiesPositionedCharacters];
    this.gamePlay.redrawPositions(this.concatedCharacters); // генерация позиций и персонажей на поле
    this.setupMoveCursor(); // показать информацию о персонаже при наводке на него
    this.setupClickCursor(); // создать событие клика на ячейку
    this.setupControls(); // подписка на кнопки управления
    this.activePlayer = 0; // Начинаем с хода первого игрока
  }

  setupMoveCursor() { // Подписка на движение курсора
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  }

  setupClickCursor() { // Подписка на клик
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  setupControls() { // Подписка на кнопки управления
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
      isGameFieldLocked: this.isGameFieldLocked,
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
        isGameFieldLocked,
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

  onCellEnter(index) { // Событие вызывается при наведении на ячейку поля
    const cellEl = this.gamePlay.cells[index];
    this.currentCell = this.gamePlay.cells.indexOf(cellEl); // Получаем индекс текущей ячейки
    const selectedCell = this.gamePlay.getIndexSelectedCell();
    const selectedCharacter = this.playerPositionedCharacters.find((char) => char.position === selectedCell);

    const { character, characterPlayer, characterEnemy } = this.getCharByCell(this.currentCell); // Получаем данные персонажа по позиции

    if (characterPlayer) { // Если персонаж игрока меняем курсор на pointer
      this.gamePlay.setCursor(this.cursor.pointer);
    } else {
      this.gamePlay.setCursor(this.cursor.auto);
    }

    if (character) { // Получаем характеристики персонажа из найденного объекта
      const {
        level, attack, defence, health,
      } = character.character;
      const message = this.gamePlay.getCharacterInfo(level, attack, defence, health);
      this.gamePlay.showCellTooltip(message, this.currentCell);
    }

    if (selectedCharacter && characterEnemy) { // Если персонаж выбран и мы навелись на противника меняем курсор и цвет ячейки в зависимости от дальности аттаки персонажа игрока
      const { attackDistance } = selectedCharacter.character;
      const vector = this.gamePlay.getVector(this.currentCell, selectedCell, this.gamePlay.boardSize);
      if (attackDistance >= vector) {
        this.gamePlay.selectCell(this.currentCell, 'red');
        this.gamePlay.setCursor(this.cursor.crosshair);
      } else {
        this.gamePlay.setCursor(this.cursor.notallowed);
      }
    }

    if (selectedCharacter && !character) { // Если персонаж выбран и мы навелись на пустую ячейку меняем курсор и цвет ячейки в зависимости от дальности движения персонажа игрока
      const { moveDistance } = selectedCharacter.character;
      const vector = this.gamePlay.getVector(this.currentCell, selectedCell, this.gamePlay.boardSize);
      if (moveDistance >= vector) {
        this.gamePlay.setCursor(this.cursor.pointer);
        this.gamePlay.selectCell(this.currentCell, 'green');
      } else {
        this.gamePlay.setCursor(this.cursor.notallowed);
      }
    }
  }

  onCellLeave(index) { // Событие вызывается при уходе курсора из ячейки поля
    const cellEl = this.gamePlay.cells[index];
    this.lastCell = this.gamePlay.cells.indexOf(cellEl); // Получаем индекс ячейки предыдущей ячейки
    this.gamePlay.hideCellTooltip(this.lastCell);
    const selectedCell = this.gamePlay.getIndexSelectedCell();
    if (this.lastCell === selectedCell) {
    } else {
      this.gamePlay.deselectCell(this.lastCell);
    }
  }

  onCellClick(index) { // Событие при клике на ячейку поля
    if (this.isGameFieldLocked) {
      return;
    }
    const cellEl = this.gamePlay.cells[index];
    this.currentCell = this.gamePlay.cells.indexOf(cellEl); // Получаем индекс текущей ячейки
    const selectedCell = this.gamePlay.getIndexSelectedCell();
    const selectedCharacter = this.playerPositionedCharacters.find((char) => char.position === selectedCell);
    const selectedCharacterIndex = this.playerPositionedCharacters.findIndex(char => char.position === selectedCell);

    const { character, characterPlayer, characterEnemy } = this.getCharByCell(this.currentCell); // Получаем данные персонажа по позиции

    if (!this.computerMoveDone) {
      this.gamePlay.showMessage('Дождитесь завершения хода компьютера');
      return;
    }

    if (characterPlayer) {
      this.gamePlay.selectCell(this.currentCell, 'yellow');
      if (this.currentCell === selectedCell) { // При повторном клике снимается выделение
        this.gamePlay.deselectCell(selectedCell);
      } else { // Смена выбранного персонажа
        if (selectedCell !== null) {
          this.gamePlay.deselectCell(selectedCell);
        }
        this.gamePlay.selectCell(this.currentCell, 'yellow');
      }
    } else if (characterEnemy && selectedCell === null) { // выдаем ошибку, если это не персонаж игрока
      const message = 'Это не персонаж игрока, выберите другого';
      this.gamePlay.showError(message);
    }

    if (selectedCell !== null && !character) { // Перемещение выбранного персонажа
      const { moveDistance } = selectedCharacter.character;
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
      const { attackDistance } = selectedCharacter.character;
      const vector = this.gamePlay.getVector(this.currentCell, selectedCell, this.gamePlay.boardSize);
      if (attackDistance >= vector) {
        const damage = Math.floor(Math.max(selectedCharacter.character.attack - characterEnemy.character.defence, selectedCharacter.character.attack * 0.1));
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

      if (this.enemiesPositionedCharacters.length === 0) {
        this.loseOrNextLevel();
      }
      this.switchActivePlayer();
    }
  }

  computerTurn() { // Актуальный код для хода компьютера
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

      if (nearestDistanceOverall !== Infinity) { // Если цель найдена
        const computer = this.enemiesPositionedCharacters[nearestComputerIndex];
        const { attackDistance } = computer.character;
        const { moveDistance } = computer.character;
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
              const index = this.playerPositionedCharacters.findIndex((char) => char.position === nearestTargetPosition);
              this.playerPositionedCharacters.splice(index, 1); // По индексу удаляем из списка персонажей
              const characterIndex = this.concatedCharacters.findIndex((char) => char.position === nearestTargetPosition); // Получаем индекс персонажа игрока в списке персонажей
              this.concatedCharacters.splice(characterIndex, 1); // По индексу удаляем из списка персонажей
              this.gamePlay.redrawPositions(this.concatedCharacters); // Перерисовываем поле без убитого персонажа игрока
              if (selectedCell === nearestTargetPosition) { // если он был активен, снимаем выделение
                this.gamePlay.deselectCell(selectedCell);
              }
            }
          });
        } else if ((moveDistance < nearestDistanceOverall && attackDistance < nearestDistanceOverall) || (nearestDistanceOverall > attackDistance && nearestDistanceOverall < moveDistance)) {
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
      } else { // Цель не найдена
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

  switchActivePlayer() { // Смена активного игрока
    this.activePlayer = 1 - this.activePlayer; // Переключаем игрока

    if (this.activePlayer === 0) {
    } else {
      this.computerMoveDone = false;
      this.computerTurn(); // Запускаем ход компьютера
    }
  }

  getCharByCell(position) { // Получаем данные персонажа по позиции
    const character = this.concatedCharacters.find((char) => char.position === position); // Получаем данные персонажа по позиции
    const characterPlayer = this.playerPositionedCharacters.find((char) => char.position === position);
    const characterEnemy = this.enemiesPositionedCharacters.find((char) => char.position === position);

    return { character, characterPlayer, characterEnemy };
  }

  loseOrNextLevel() { // Проверка на победу или переход на следующий уровень
    if (this.currentTheme === this.themes.mountain && this.enemiesPositionedCharacters.length === 0) { // Условие для победы
      this.gamePlay.showMessage('ВЫ ПОБЕДИЛИ!');
      this.isGameFieldLocked = true; // Запрет на действия на игровом поле
    }

    if (this.isGameFieldLocked !== true && this.enemiesPositionedCharacters.length === 0) {
      this.gamePlay.showMessage('переходим на следующий уровень!');

      this.gamePlay.reloadStats(this.playerPositionedCharacters); // Обновляем статы персонажей игрока

      if (this.currentTheme === this.themes.prairie) { // Условия для смены карты
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
