import Character from '../Character';

export default class Swordsman extends Character {
  constructor(level) {
    super(level, 'swordsman'); // Вызываем конструктор базового класса
    this.attack = 40;
    this.defence = 10;
  }
}
