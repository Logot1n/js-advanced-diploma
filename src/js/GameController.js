import themes from './Board/themes';
import { generatePlayerPositionedCharacters, generateEnemyPositionedCharacters, generatePlayerNewPositionedCharacters } from './generateTeam/generators';
import cursors from './cursors';
import GamePlay from './GamePlay';
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
    this.enemiesPositionedCharacters = generateEnemyPositionedCharacters(); // позиции и персонажи команды противника
    this.concatedCharacters = [...this.playerPositionedCharacters, ...this.enemiesPositionedCharacters];
    this.gamePlay.redrawPositions(this.concatedCharacters); // генерация позиций и персонажей на поле
    this.setupMoveCursor(); // показать информацию о персонаже при наводке на него
    this.setupClickCursor(); // создать событие клика на ячейку
    this.setupControls(); // подписка на кнопки управления
    this.activePlayer = 0; // Начинаем с хода первого игрока
  }

  setupMoveCursor() { // Подписка на движение курсора
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
  }

  setupClickCursor() { // Подписка на клик
    this.gamePlay.addCellClickListener(this.onCellClick);
  }

  setupControls() { // Подписка на кнопки управления
    this.gamePlay.addNewGameListener(this.onNewGameClick);
    this.gamePlay.addSaveGameListener(this.onSaveGameClick);
    this.gamePlay.addLoadGameListener(this.onLoadGameClick);
  }

  onNewGameClick = () => {
    window.location.reload();
  }

  onSaveGameClick = () => {
    const state = GameState.from({
      currentTheme: this.currentTheme,
      playerPositionedCharacters: this.playerPositionedCharacters,
      enemiesPositionedCharacters: this.enemiesPositionedCharacters,
      concatedCharacters: this.concatedCharacters,
      activePlayer: this.activePlayer,
      computerMoveDone: this.computerMoveDone,
      isGameFieldLocked: this.isGameFieldLocked
    })

    this.stateService.save(state);
    console.log('Игра сохранена');
  }

  onLoadGameClick = () => {
    const loadedState = this.stateService.load();
    if (loadedState) {
      const {
        currentTheme,
        playerPositionedCharacters,
        enemiesPositionedCharacters,
        concatedCharacters,
        activePlayer,
        computerMoveDone,
        isGameFieldLocked
      } = loadedState;

      this.currentTheme = currentTheme;
      // this.playerPositionedCharacters = loadedState.playerPositionedCharacters.map(data => new PositionedCharacter(data.character, data.position));
      // this.enemiesPositionedCharacters = loadedState.enemiesPositionedCharacters.map(data => new PositionedCharacter(data.character, data.position));
      // this.concatedCharacters = loadedState.concatedCharacters.map(data => new PositionedCharacter(data.character, data.position));
      this.playerPositionedCharacters = playerPositionedCharacters;
      this.enemiesPositionedCharacters = enemiesPositionedCharacters;
      this.concatedCharacters = concatedCharacters;
      this.activePlayer = activePlayer;
      this.computerMoveDone = computerMoveDone;
      this.isGameFieldLocked = isGameFieldLocked;

      this.gamePlay.drawUi(this.currentTheme); // Перерисовываем интерфейс с темой
      this.gamePlay.redrawPositions(this.concatedCharacters); // Перерисовываем позиции персонажей
      console.log('Игровое сохранение загружено');
    }
  }

  onCellEnter = (index) => { // Событие вызывается при наведении на ячейку поля
    const cellEl = this.gamePlay.cells[index];
    this.currentCell = this.gamePlay.cells.indexOf(cellEl); // Получаем индекс текущей ячейки
    const selectedCell = this.gamePlay.getIndexSelectedCell();
    const selectedCharacter = this.playerPositionedCharacters.find((char) => char.position === selectedCell);

    const { character, characterPlayer, characterEnemy } = this.getCharByCell(this.currentCell); // Получаем данные персонажа по позиции

    if(characterPlayer) { // Если персонаж игрока меняем курсор на pointer
      this.gamePlay.setCursor(this.cursor.pointer);
    } else {
      this.gamePlay.setCursor(this.cursor.auto);
    }

    if(character) { // Получаем характеристики персонажа из найденного объекта
      const {level, attack, defence, health } = character.character;
      const message = this.gamePlay.getCharacterInfo(level, attack, defence, health);
      this.gamePlay.showCellTooltip(message, this.currentCell);
    }

    if(selectedCharacter && characterEnemy) { // Если персонаж выбран и мы навелись на противника меняем курсор и цвет ячейки в зависимости от дальности аттаки персонажа игрока
      const attackDistance = selectedCharacter.character.attackDistance;
      let vector = this.gamePlay.getVector(this.currentCell, selectedCell, this.gamePlay.boardSize);
      if(attackDistance >= vector) {
        this.gamePlay.selectCell(this.currentCell, 'red');
        this.gamePlay.setCursor(this.cursor.crosshair);
      } else {
        this.gamePlay.setCursor(this.cursor.notallowed);
      }
    }

    if(selectedCharacter && !character) { // Если персонаж выбран и мы навелись на пустую ячейку меняем курсор и цвет ячейки в зависимости от дальности движения персонажа игрока
      const moveDistance = selectedCharacter.character.moveDistance;
      let vector = this.gamePlay.getVector(this.currentCell, selectedCell, this.gamePlay.boardSize);
      if(moveDistance >= vector) {
        this.gamePlay.setCursor(this.cursor.pointer);
        this.gamePlay.selectCell(this.currentCell, 'green');
      } else {
        this.gamePlay.setCursor(this.cursor.notallowed);
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
    if(this.isGameFieldLocked) {
      return;
    }
    const cellEl = this.gamePlay.cells[index];
    this.currentCell = this.gamePlay.cells.indexOf(cellEl); // Получаем индекс текущей ячейки
    const selectedCell = this.gamePlay.getIndexSelectedCell();
    let selectedCharacter = this.playerPositionedCharacters.find((char) => char.position === selectedCell);

    const { character, characterPlayer, characterEnemy } = this.getCharByCell(this.currentCell); // Получаем данные персонажа по позиции

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
    

    if(selectedCell !== null && !character) { // Перемещение выбранного персонажа
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
      const attackDistance = selectedCharacter.character.attackDistance;
      let vector = this.gamePlay.getVector(this.currentCell, selectedCell, this.gamePlay.boardSize);
      if(attackDistance >= vector) {
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
    
      if(this.enemiesPositionedCharacters.length === 0) {
        this.loseOrNextLevel();
      }
      this.switchActivePlayer();
    }
  }

  computerTurn() { // Противник умеет пока что только бить в пределах дистанции атаки
    setTimeout(() => {
      if (this.enemiesPositionedCharacters.length === 0) {
        this.computerMoveDone = true; // Завершил ход компьютера
        this.loseOrNextLevel();
        this.switchActivePlayer();
        return; // Выход из функции, так как нет персонажей компьютера
      }

      const randomTarget = Math.floor(Math.random() * this.playerPositionedCharacters.length) // Выбираем случайного персонажа игрока
      const targetPosition = this.playerPositionedCharacters[randomTarget].position // Получаем позицию случайного персонажа игрока
      const selectedCell = this.gamePlay.getIndexSelectedCell();

      let attackExecuted = false;
      let moveExecuted = false;

      for (let i = 0; i < this.enemiesPositionedCharacters.length; i++) {
        const enemy = this.enemiesPositionedCharacters[i];
        const attackDistance = enemy.character.attackDistance;
        const moveDistance = enemy.character.moveDistance;
        const enemyPosition = enemy.position;
        let distanceToPlayer = this.gamePlay.getVector(targetPosition, enemyPosition, this.gamePlay.boardSize);
        if (attackDistance >= distanceToPlayer) {
          console.log('компьютер атакует');
          const damage = Math.floor(Math.max(enemy.character.attack - this.playerPositionedCharacters[randomTarget].character.defence, enemy.character.attack * 0.1));
          this.gamePlay.showDamage(targetPosition, damage).then(() => {
            this.playerPositionedCharacters[randomTarget].character.health -= damage;
            this.gamePlay.redrawPositions(this.concatedCharacters);
            if (this.playerPositionedCharacters[randomTarget].character.health <= 0) {
              this.playerPositionedCharacters.splice(randomTarget, 1); // По индексу удаляем из списка персонажей
              const characterIndex = this.concatedCharacters.findIndex((char) => char.position === targetPosition); // Получаем индекс персонажа игрока в списке персонажей
              this.concatedCharacters.splice(characterIndex, 1); // По индексу удаляем из списка персонажей
              this.gamePlay.redrawPositions(this.concatedCharacters); // Перерисовываем поле без убитого персонажа игрока
              if (selectedCell === targetPosition) { // если он был активен, снимаем выделение
                this.gamePlay.deselectCell(selectedCell);
              }
            }
          });
          attackExecuted = true;
          break; // Выходим из цикла после атаки
        } else if (moveDistance < distanceToPlayer) {
          // тут должен быть код для движения, НО ЕГО НЕТ (компьютер не может двигаться)
        }
      }
      this.computerMoveDone = true; // Завершил ход компьютера
      if(this.playerPositionedCharacters.length === 0) {
        this.loseOrNextLevel();
      } else {
        this.switchActivePlayer(); // После хода компьютера переключаем ход на игрока
      }
    }, 2000); // Задержка перед ходом компьютера
  }

  switchActivePlayer() { // Смена активного игрока
    this.activePlayer = 1 - this.activePlayer; // Переключаем игрока

    if (this.activePlayer === 0) {
      console.log('Ходит игрок');
    } else {
      console.log('Ходит компьютер');
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
    if(this.currentTheme === this.themes.mountain && this.enemiesPositionedCharacters.length === 0) { // Условие для победы
      console.log('ВЫ ПОБЕДИЛИ!')
      this.isGameFieldLocked = true; // Запрет на действия на игровом поле
    }    

    if(this.isGameFieldLocked !== true && this.enemiesPositionedCharacters.length === 0) {
      console.log('переходим на следующий уровень!');

      this.gamePlay.reloadStats(this.playerPositionedCharacters); // Обновляем статы персонажей игрока

      if (this.currentTheme === this.themes.prairie) { // Условия для смены карты
        this.gamePlay.drawUi(this.themes.desert);
        this.currentTheme = this.themes.desert;
      } else if(this.currentTheme === this.themes.desert) {
        this.gamePlay.drawUi(this.themes.arctic);
        this.currentTheme = this.themes.arctic;
      } else if (this.currentTheme === this.themes.arctic) {
        this.gamePlay.drawUi(this.themes.mountain);
        this.currentTheme = this.themes.mountain;
      }  

      this.enemiesPositionedCharacters = generateEnemyPositionedCharacters();
      this.gamePlay.computerReloadStats(this.enemiesPositionedCharacters, this.currentTheme, this.themes); // Обновляем статы персонажей компьютера
      generatePlayerNewPositionedCharacters(this.playerPositionedCharacters); // Придаем случайные позиции персонажам игрока
      this.concatedCharacters = [...this.playerPositionedCharacters, ...this.enemiesPositionedCharacters];
      this.gamePlay.redrawPositions(this.concatedCharacters); // Перерисовываем поле
    }
  }
}
