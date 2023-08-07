import Character from '../Character';

export default class Magician extends Character {
  constructor(level) {
    super(level, 'magician'); // Вызываем конструктор базового класса
    this.attack = 10;
    this.defence = 40;
    this.moveDistance = 1;
    this.attackDistance = 4;
  }
}
