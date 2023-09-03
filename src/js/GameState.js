export default class GameState {
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
