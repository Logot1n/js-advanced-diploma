export default class GameState {
  constructor() {
    this.currentTheme = null;
    this.playerPositionedCharacters = [];
    this.enemiesPositionedCharacters = [];
    this.concatedCharacters = [];
    this.activePlayer = null;
    this.computerMoveDone = null;
    this.isGameFieldLocked = false;
  }
  static from(object) {
    const gameState = new GameState();

    gameState.currentTheme = object.currentTheme;
    gameState.playerPositionedCharacters = object.playerPositionedCharacters;
    gameState.enemiesPositionedCharacters = object.enemiesPositionedCharacters;
    gameState.concatedCharacters = object.concatedCharacters;
    gameState.activePlayer = object.activePlayer;
    gameState.computerMoveDone = object.computerMoveDone;
    gameState.isGameFieldLocked = object.isGameFieldLocked;

    return gameState;
  }
}
