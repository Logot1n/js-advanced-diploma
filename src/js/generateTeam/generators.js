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
  for (const type of playerTypes) {
    const level = Math.ceil(Math.random() * maxLevel);
    yield new type(level);
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
  return new Team(characterGenerator(playerTypes, maxLevel), characterCount);
}
