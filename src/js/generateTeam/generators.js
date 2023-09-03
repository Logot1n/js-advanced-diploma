import Team from './Team';
import PositionedCharacter from './PositionedCharacter';
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Daemon from './characters/Daemon';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param playerTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(playerTypes, maxLevel) {
  while (true) {
    const randomIndex = Math.floor(Math.random() * playerTypes.length);
    const RandomType = playerTypes[randomIndex];
    const level = Math.ceil(Math.random() * maxLevel);
    yield new RandomType(level);
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param playerTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(playerTypes, maxLevel, characterCount) {
  const characters = [];
  const generator = characterGenerator(playerTypes, maxLevel);

  for (let i = 0; i < characterCount; i++) {
    const character = generator.next().value;
    characters.push(character);
  }
  return new Team(characters);
}

export const generatePlayerPositionedCharacters = () => { // Новая функция генерации позиции команды игрока
  const playerTypes = [
    Bowman,
    Swordsman,
    Magician,
  ];

  const playerTeam = generateTeam(playerTypes, 1, 4);

  const playerCharacters = playerTeam.characters;

  const playerPositions = [];

  while (playerCharacters.length !== playerPositions.length) {
    const position = 8 * Math.floor(Math.random() * 8) + Math.round(Math.random());

    if (playerPositions.includes(position)) {
      continue;
    }
    playerPositions.push(position);
  }

  const playerPositionedCharacters = playerCharacters.map((character, i) => new PositionedCharacter(character, playerPositions[i]));

  return playerPositionedCharacters;
};

export const generatePlayerNewPositionedCharacters = (playerPositionedCharacters) => { // Генерация новых позиций персонажей игрока в случае смены уровня
  const playerPositions = [];

  while (playerPositions.length !== 4) {
    const position = 8 * Math.floor(Math.random() * 8) + Math.round(Math.random());

    if (playerPositions.includes(position)) {
      continue;
    }
    playerPositions.push(position);
  }

  playerPositionedCharacters.forEach((char) => {
    const randomIndex = Math.floor(Math.random() * playerPositions.length);
    const newPosition = playerPositions[randomIndex];
    char.position = newPosition;
    playerPositions.splice(randomIndex, 1);
  });
};

export const generateEnemyPositionedCharacters = (currentTheme, themes) => { // Новая функция генерации позиции команды противника
  const enemysTypes = [
    Daemon,
    Undead,
    Vampire,
  ];

  let enemyTeam;

  if (currentTheme === themes.prairie) { // Условия для смены карты
    enemyTeam = generateTeam(enemysTypes, 1, 2);
  } else if (currentTheme === themes.desert) {
    enemyTeam = generateTeam(enemysTypes, 1, 3);
  } else if (currentTheme === themes.arctic) {
    enemyTeam = generateTeam(enemysTypes, 1, 4);
  } else if (currentTheme === themes.mountain) {
    enemyTeam = generateTeam(enemysTypes, 1, 5);
  }

  const enemyCharacters = enemyTeam.characters;

  const enemyPositions = [];

  while (enemyCharacters.length !== enemyPositions.length) {
    const position = 8 * Math.floor(Math.random() * 8) + Math.round(Math.random()) + 6;

    if (enemyPositions.includes(position)) {
      continue;
    }
    enemyPositions.push(position);
  }

  const enemiesPositionedCharacters = enemyCharacters.map((character, i) => new PositionedCharacter(character, enemyPositions[i]));

  return enemiesPositionedCharacters;
};

export function whatAreChar(data) {
  let character;

  if (data.character.type === 'bowman') {
    character = new Bowman(data.character.level);
  } else if (data.character.type === 'swordsman') {
    character = new Swordsman(data.character.level);
  } else if (data.character.type === 'magician') {
    character = new Magician(data.character.level);
  } else if (data.character.type === 'daemon') {
    character = new Daemon(data.character.level);
  } else if (data.character.type === 'undead') {
    character = new Undead(data.character.level);
  } else if (data.character.type === 'vampire') {
    character = new Vampire(data.character.level);
  }

  character.attack = data.character.attack;
  character.defence = data.character.defence;
  character.health = data.character.health;
  character.type = data.character.type;
  character.attackDistance = data.character.attackDistance;
  character.moveDistance = data.character.moveDistance;

  return new PositionedCharacter(character, data.position);
}
