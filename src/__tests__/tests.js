import { calcTileType } from '../js/Board/utils';
import Character from '../js/generateTeam/Character';
import Bowman from '../js/generateTeam/characters/Bowman';
import Daemon from '../js/generateTeam/characters/Daemon';
import Magician from '../js/generateTeam/characters/Magician';
import Swordsman from '../js/generateTeam/characters/Swordsman';
import Undead from '../js/generateTeam/characters/Undead';
import Vampire from '../js/generateTeam/characters/Vampire';
// import PositionedCharacter from '../js/generateTeam/PositionedCharacter';
// import GamePlay from '../js/GamePlay';
// import GameController from '../js/GameController';
// import GameStateService from '../js/GameStateService';
// import themes from '../js/Board/themes';

describe('calcTileType', () => {
  test.each([
    [0, 8, 'top-left'],
    [7, 8, 'top-right'],
    [56, 8, 'bottom-left'],
    [63, 8, 'bottom-right'],
    [1, 8, 'top'],
    [57, 8, 'bottom'],
    [8, 8, 'left'],
    [15, 8, 'right'],
    [27, 8, 'center'],
  ])('%s index ячейки и размер поля %s должны вернуть значение %s типа ячейки', (index, boardSize, expected) => {
    expect(calcTileType(index, boardSize)).toBe(expected);
  });
});

describe('Character и его дочерние классы', () => {
  test('Исключение при создании экземпляра класса Character', () => {
    expect(() => new Character(3, 'generic')).toThrow(Error('Нельзя создать новый экземпляр класса Character'));
  });

  const bowman = new Bowman(3);
  const swordsman = new Swordsman(3);
  const magician = new Magician(3);
  const daemon = new Daemon(3);
  const undead = new Undead(3);
  const vampire = new Vampire(3);

  test('Создание экземпляра класса Bowman', () => {
    expect(bowman).toEqual({
      level: 3, attack: 25, defence: 25, health: 100, type: 'bowman',
    });
  });
  test('Создание экземпляра класса Daemon', () => {
    expect(daemon).toEqual({
      level: 3, attack: 10, defence: 10, health: 100, type: 'daemon',
    });
  });
  test('Создание экземпляра класса Magician', () => {
    expect(magician).toEqual({
      level: 3, attack: 10, defence: 40, health: 100, type: 'magician',
    });
  });
  test('Создание экземпляра класса Swordsman', () => {
    expect(swordsman).toEqual({
      level: 3, attack: 40, defence: 10, health: 100, type: 'swordsman',
    });
  });
  test('Создание экземпляра класса Undead', () => {
    expect(undead).toEqual({
      level: 3, attack: 40, defence: 10, health: 100, type: 'undead',
    });
  });
  test('Создание экземпляра класса Vampire', () => {
    expect(vampire).toEqual({
      level: 3, attack: 25, defence: 25, health: 100, type: 'vampire',
    });
  });
});

// describe('Tooltip', () => { // Тесты не сделаны
//   test('Информация персонажа показывается при наведение', () => {

//   })

//   test('Информация скрывается при убирание курсора с ячейки персонажа', () => {

//   })
// })
