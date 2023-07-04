import Character from '../Character';

export default class Undead extends Character {
  constructor(level) {
    super(level, 'undead'); // Вызываем конструктор базового класса
    this.attack = 40;
    this.defence = 10;
  }
}
