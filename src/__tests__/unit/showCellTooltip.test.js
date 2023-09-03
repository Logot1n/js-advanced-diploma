import GamePlay from '../../js/GamePlay';
import Bowman from '../../js/generateTeam/characters/Bowman';

test('Проверка сообщения при наводке на персонажа', () => {
  const gamePlay = new GamePlay();
  const bowman = new Bowman(1);
  const {
    level, attack, defence, health,
  } = bowman;
  const message = gamePlay.getCharacterInfo(level, attack, defence, health);
  expect(message).toBe('🎖 1 ⚔ 25 🛡 25 ❤ 50');
});
