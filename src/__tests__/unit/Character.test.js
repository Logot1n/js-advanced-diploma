import Character from '../../js/generateTeam/Character';
import Bowman from '../../js/generateTeam/characters/Bowman';
import Daemon from '../../js/generateTeam/characters/Daemon';
import Magician from '../../js/generateTeam/characters/Magician';
import Swordsman from '../../js/generateTeam/characters/Swordsman';
import Undead from '../../js/generateTeam/characters/Undead';
import Vampire from '../../js/generateTeam/characters/Vampire';

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
      level: 3, attack: 25, attackDistance: 2, defence: 25, health: 50, moveDistance: 2, type: 'bowman',
    });
  });
  test('Создание экземпляра класса Daemon', () => {
    expect(daemon).toEqual({
      level: 3, attack: 20, attackDistance: 4, defence: 30, health: 50, moveDistance: 1, type: 'daemon',
    });
  });
  test('Создание экземпляра класса Magician', () => {
    expect(magician).toEqual({
      level: 3, attack: 20, attackDistance: 4, defence: 30, health: 50, moveDistance: 1, type: 'magician',
    });
  });
  test('Создание экземпляра класса Swordsman', () => {
    expect(swordsman).toEqual({
      level: 3, attack: 40, attackDistance: 1, defence: 15, health: 50, moveDistance: 4, type: 'swordsman',
    });
  });
  test('Создание экземпляра класса Undead', () => {
    expect(undead).toEqual({
      level: 3, attack: 40, attackDistance: 1, defence: 15, health: 50, moveDistance: 4, type: 'undead',
    });
  });
  test('Создание экземпляра класса Vampire', () => {
    expect(vampire).toEqual({
      level: 3, attack: 25, attackDistance: 2, defence: 25, health: 50, moveDistance: 2, type: 'vampire',
    });
  });
});
