/**
 * Entry point of app: don't change this
 */
import GameController from './GameController';
import GamePlay from './GamePlay';
import GameStateService from './GameStateService';

const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector('#game-container'));

const stateService = new GameStateService(localStorage);

const gameCtrl = new GameController(gamePlay, stateService);
gameCtrl.init();
// don't write your code here
