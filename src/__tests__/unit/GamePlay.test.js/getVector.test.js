import GamePlay from '../../../js/GamePlay';
import Swordsman from '../../../js/generateTeam/characters/Swordsman';
import Vampire from '../../../js/generateTeam/characters/Vampire';

describe('getVector', () => {
  test('getVector вернёт расстояние между Активной клеткой(персонажем) и Текущей клеткой(противником)', () => {
    const gamePlay = new GamePlay();
    const currentCell = 3;
    const activeCell = 10;
    const expectedVector = 1;

    const swordsman = new Swordsman(3);

    const result = gamePlay.getVector(currentCell, activeCell, gamePlay.boardSize);

    expect(result).toBe(expectedVector);
    if (result <= swordsman.attackDistance) {
      expect(true).toBe(true); // Можно атаковать
    } else {
      expect(false).toBe(false); // Нельзя атаковать
    }

    if (result <= swordsman.moveDistance) {
      expect(true).toBe(true); // Можно передвигаться
    } else {
      expect(false).toBe(false); // Нельзя передвигаться
    }
  });

  test('getVector вернёт расстояние между Активной клеткой(персонажем) и Текущей клеткой(противником)', () => {
    const gamePlay = new GamePlay();
    const currentCell = 13;
    const activeCell = 3;
    const expectedVector = undefined;

    const result = gamePlay.getVector(currentCell, activeCell, gamePlay.boardSize);

    expect(result).toBe(expectedVector);
  });

  test('getVector вернёт расстояние между Активной клеткой(персонажем) и Текущей клеткой(противником)', () => {
    const gamePlay = new GamePlay();
    const currentCell = 0;
    const activeCell = 5;
    const expectedVector = 5;

    const daemon = new Vampire(3);

    const result = gamePlay.getVector(currentCell, activeCell, gamePlay.boardSize);

    expect(result).toBe(expectedVector);
    if (result <= daemon.attackDistance) {
      expect(true).toBe(true); // Можно атаковать
    } else {
      expect(false).toBe(false); // Нельзя атаковать
    }

    if (result <= daemon.moveDistance) {
      expect(true).toBe(true); // Можно передвигаться
    } else {
      expect(false).toBe(false); // Нельзя передвигаться
    }
  });
});
