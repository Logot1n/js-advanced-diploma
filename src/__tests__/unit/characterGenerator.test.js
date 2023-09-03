import { characterGenerator } from '../../js/generateTeam/generators';
import Bowman from '../../js/generateTeam/characters/Bowman';
import Swordsman from '../../js/generateTeam/characters/Swordsman';
import Magician from '../../js/generateTeam/characters/Magician';

test('Создание персонажей с учётом аргумента playerTypes = 3', () => {
  const playerTypes = [
    Bowman,
    Swordsman,
    Magician,
  ];

  const characters = [];
  const generator = characterGenerator(playerTypes, 1);
  for (let i = 0; i < 3; i++) {
    const character = generator.next().value;
    characters.push(character);
  }

  expect(characters.length).toBe(3);
});

test('Создание персонажей с учётом аргумента playerTypes = 10', () => {
  const playerTypes = [
    Bowman,
    Swordsman,
    Magician,
  ];

  const characters = [];
  const generator = characterGenerator(playerTypes, 1);
  for (let i = 0; i < 10; i++) {
    const character = generator.next().value;
    characters.push(character);
  }

  expect(characters.length).toBe(10);
});
