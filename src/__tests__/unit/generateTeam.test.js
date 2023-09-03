import { generateTeam } from '../../js/generateTeam/generators';

import Bowman from '../../js/generateTeam/characters/Bowman';
import Swordsman from '../../js/generateTeam/characters/Swordsman';
import Magician from '../../js/generateTeam/characters/Magician';

test('Проверка создания команды игроков', () => {
  const playerTypes = [
    Bowman,
    Swordsman,
    Magician,
  ];

  const playerTeam = generateTeam(playerTypes, 1, 4);
  expect(playerTeam.characters.length).toBe(4);
  expect(playerTeam.characters[0].level).toBe(1);
  expect(playerTeam.characters[1].level).toBe(1);
  expect(playerTeam.characters[2].level).toBe(1);
  expect(playerTeam.characters[3].level).toBe(1);
});
