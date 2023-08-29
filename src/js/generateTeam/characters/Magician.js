import Character from '../Character';

export default class Magician extends Character {
  constructor(level) {
    super(level, 'magician'); // Вызываем конструктор базового класса
    this.attack = 20;
    this.defence = 30;
    this.moveDistance = 1;
    this.attackDistance = 4;
  }
}
