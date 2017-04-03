'use strict';

class Character{
  constructor(characterStats){
    this.name = characterStats.name;
    this.str = characterStats.stats[0];
    this.dex = characterStats.stats[1];
    this.weapon = characterStats.weapon;
    this.armor = characterStats.armor;
    this.hp = this.maxHp;
    this.ap = this.maxAp;
    this.level = 0;
    this.dead = false;
  }
  get maxHp(){
    return this.str * 10 + 10;
  }
  get maxAp(){
    return this.dex;
  }
  get attackRate(){
    return this.weapon.demage + this.str;
  }
  get defenceRate(){
    return this.armor.defence + this.str;
  }
  attack(target){
    let damage = this.attackRate - target.defenceRate;
    if (damage < 0){
      damage = 0;
    }
    target.hp -= damage;
    this.ap -= this.weapon.apCost;
    console.log(`${this.name} (level ${this.level}) hit ${target.name} (level ${target.level}) by ${damage}, ${this.ap} AP left`);
    if (target.hp <= 0){
      target.dead = true;
      console.log(`${target.name} is dead`);
    }
  }
}

class Player extends Character{
  constructor(characterStats){
    super(characterStats);
    this.int = characterStats.stats[2];
    this.luc = characterStats.stats[3];
    this.companion = null;
  }
//Метод для взлома физических замков, в зависимости от ловкости
  lockpick(target){
    if (target.lock.electric){
      console.log('Cannot lockpick electric lock');
    }
    else {
      this.breakAnyLock(target, this.dex)
    }
  }
//Метод для взлома электронных замков, в зависимости от интеллекта
  hack(target){
    if (!target.lock.electric){
      console.log('Cannot hack physical lock');
    }
    else {
      this.breakAnyLock(target, this.int);
    }
  }
//Метод для реализации механики взлома замка
  breakAnyLock(target, typeParam){
    if (typeParam >= target.lock.level){
      if (this.ap < 2){
        console.log('Not enought AP');
        return false;
      }
      this.ap -= 2;
      if (rand(0,9) + target.lock.level < typeParam + this.luc) {
        this.weapon = target.content;
        console.log('Container opened');
      }
      else {
        console.log('Lockpick failed');
      }
    }
    else {
      console.log('Lock is too complicated');
    }
  }
//Метод для восстановления здоровья, в зависимости от интеллекта. Без аргумента персонаж лечит себя
  heal(target = this){
    if (this.ap < 2){
      console.log('Not enought AP');
      return false;
    }
    this.ap -= 2;
    let regenHp = target.maxHp / 10 * this.int;
    if (target.hp + regenHp > target.maxHp){
      regenHp = target.maxHp - target.hp;
      target.hp = target.maxHp;
    }
    else {
      target.hp += regenHp;
    }
    console.log(`${this.name} healed ${target.name} by ${regenHp}`);
  }
//Метод для восстановления AP. Игрок пропускает ход
  rest(){
    this.ap = this.maxAp;
  }
//Метод для взаимодействия с NPC: попросить присоединиться, вылечить или отдать оружие, убедить с помощью интеллекта или силы
  talk(target, ask = 'heal', forced = false){
    if (this.ap < 2){
      console.log('Not enought AP');
      return false;
    }
    this.ap -= 2;
    let param = forced ? 'str' : 'int';
    if (ask === 'heal'){
      this.makeToDo(target, this[param], target[param], target.heal, ask);
    }
    if (ask === 'join'){
      this.makeToDo(target, this[param], target[param], target.join, ask);
    }
    if (ask === 'supply'){
      this.makeToDo(target, this[param], target[param], target.supply, ask);
    }
  }
  //Метод убеждения NPC
  makeToDo(target, typeParamPlayer, typeParamNPC, action, subject){
    if (typeParamPlayer + Math.floor(this.luc / 2) > typeParamNPC) {
      action.call(target, this);
    }
    else {
      console.log(`${target.name} won't ${subject} you`);
    }
  }
}

//Класс противника. Использует объект со случайными данными для создания
class Enemy extends Character{
  constructor(){
    let protoStats = new NextEnemyStats();
    super(protoStats);
    this.level = protoStats.level;
  }
}

//Класс для NPC, с которыми игрок сможет взаимодействовать
class NPC extends Enemy{
  constructor(){
    super();
    this.name = npcNameGenerator() + this.level;
    this.int = 5 + Math.floor(this.level / 2);
  }
  join(target){
    target.companion = {name: this.name, hp: this.hp, attackRate: this.weapon.demage + this.str, defenceRate: this.armor.defence + this.str};
    console.log(`${this.name} joined ${target.name}`);
  }
  supply(target){
    target.weapon = this.weapon;
    console.log(`${this.name} passed weapon to ${target.name}`);
  }
}
NPC.prototype.heal = Player.prototype.heal;

class Container{
  constructor(){
    this.lock = new Lock();
    this.content = new Weapon();
  }
}

class Lock{
  constructor(){
    this.fortified = rand(0, 1);
    this.electric = rand(0, 1);
    this.level = rand (5, 10);
  }
}

class Weapon{
  constructor(){
    this.demage = rand(5, 10);
    this.apCost = rand(2, 2);
  }
}

class Armor{
  constructor(){
    this.defence = rand(5, 10);
  }
}

//Конструктор генерации объекта с данными для создания нового противника
class NextEnemyStats {
  constructor(level){
    this.name = enemyNameGenerator();
    this.stats = getEnemyStats();
    this.weapon = {demage: 2, apCost: 3};
    this.armor = {defence: 0};
    this.level = this.stats.reduce((sum, current) => {
      return sum + current;
    }, 0) - 10;
  }
}

//Функция генерации случайного уровня противника, с учётом того, что более высокие уровни должны генерироваться реже
function getRandomLevel(){
  let grade, index = rand(0, 9);
  switch (index){
    case 0:
    case 1:
    case 2:
    case 3:
      grade = [1, 5];
      break;
    case 4:
    case 5:
    case 6:
      grade = [6, 10];
      break;
    case 7:
    case 8:
      grade = [11, 15];
      break;
    case 9:
      grade = [16, 20];
  }
  return rand(...grade);
}

//Функция, которая распределяет уровни противника по характеристикам
function getEnemyStats(){
  let stats = [], levelups = getRandomLevel();
  stats[0] = 5 + Math.ceil(levelups / 2);
  stats[1] = 5 + Math.floor(levelups / 2);
  return stats;
}

//Функция начала следующего хода - определяет что будет перед игроком - противник, контейнер или NPC
var turn = 0;
function startNextTurn(character){
  console.log(`__________ Turn №${++turn} __________`);
  let index = rand(0, 5);
  switch (index){
    case 0:
    case 1:
    case 2:
      battle(character, new Enemy());
      break;
    case 3:
    case 4:
      character.lockpick(new Container());
      break;
    case 5:
      character.talk(new NPC());
  }
}
//Функция для вывода статуса боя
function battleDisplay(player, boss){
  console.log(`${boss.name} HP: ${boss.hp}, ${boss.name} AP: ${boss.ap}, ${player.name} HP: ${player.hp}, ${player.name} AP: ${player.ap}`);
}
//Функция боя
function battle(side1, side2){
  while (!side1.dead && !side2.dead){
    battleRound(side1, side2);
    if (side2.dead){
      break;
    }
    battleRound(side2, side1);
  }
  console.log(`Battle is over`);
  battleDisplay(side1, side2);
  if (side1.dead){
    side1.hp = side1.maxHp;
    if (side1.level > 0){
      side1.level--;
    }
    side1.dead = false;
    }
  else {
    side1.level++;
  }
}
//Функция для раунда боя (персонаж наносит урон, пока не кончатся AP)
function battleRound(side1, side2){
  let stamina = side1.ap;
  while (side1.ap - side1.weapon.apCost >= 0){
    side1.attack(side2);
    if (side2.dead){
      return;
    }
  }
  side1.ap = stamina;
}

function rand(from, to){
  return Math.floor(Math.random() * (to - from + 1) + from);
}

//Генератор имён роботов
function enemyNameGenerator(){
  return 'RD-' + rand(1000, 9999);
}

//Генератор человеческих имён
function npcNameGenerator(){
  return npcNames[0][rand(0, 4)] + ' ' + npcNames[1][rand(0, 4)];
}
var npcNames = [['Jack', 'Nick', 'Mike', 'Jimmy', 'Frank'], ['Black', 'Brown', 'Green', 'White', 'Grey']];

//-----------------------------

var player = '{"name": "John Doe", "stats": [5, 5, 5, 5], "weapon": {"demage": 1, "apCost": 1}, "armor": {"defence": 0}}';
player = JSON.parse(player);
var player1 = new Player(player);

startNextTurn(player1);
startNextTurn(player1);
startNextTurn(player1);
