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
    return this.dex * 2;
  }
  get attackRate(){
    return this.weapon.demage + this.str;
  }
  get defenceRate(){
    return this.armor.defence + this.str;
  }
  attack(target){
    let damage = this.attackRate * rand(1, 2) - target.defenceRate;
    if (damage < 0){
      damage = 0;
    }
    target.hp -= damage;
    this.ap -= this.weapon.apCost;
    console.log(`${this.name} (level ${this.level}) hit ${target.name} (level ${target.level}) by ${damage}`);
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
    this.companion = {name: '', hp: 0, attackRate: 0, defenceRate: 0};
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
    if (!target.lock.opened){
      if (typeParam >= 5){
        if (rand(0,9) < typeParam) {
          target.lock.opened = true;
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
    else {
      console.log('Container is empty');
    }
  }
//Метод для восстановления здоровья, в зависимости от интеллекта. Без аргументов лечит себя
  heal(target = this){
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
//Метод для взаимодействия с NPC: попросить присоединиться, вылечить или отдать оружие, с помощью интеллекта или силы
  talk(target, ask = 'heal', forced = false){
    let param = forced ? 'str' : 'int';
    if (ask === 'heal'){
      this.makeToDo(target, this[param], target[param], target.heal);
    }
    if (ask === 'assist'){
      this.makeToDo(target, this[param], target[param], target.join);
    }
    if (ask === 'supply'){
      this.makeToDo(target, this[param], target[param], target.supply);
    }
  }
  //Метод убеждения NPC
  makeToDo(target, typeParamPlayer, typeParamNPC, action){
    if (typeParamPlayer > typeParamNPC) {
      action.call(target, this);
    }
    else {
      console.log(`${target.name} won't do it`);
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
    this.name = npcNameGenerator();
    this.int = Math.floor(this.level / 2);
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
    this.opened = false;
  }
}

class Weapon{
  constructor(){
    this.demage = rand(5, 10);
    this.apCost = rand(2, 3);
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
  console.log(`>>> Turn №${++turn}`);
  let index = rand(0, 5);
  switch (index){
    case 0:
    case 1:
    case 2:
      fight(character, new Enemy());
      break;
    case 3:
    case 4:
      character.lockpick(new Container());
      character.hack(new Container());
      break;
    case 5:
      character.talk(new NPC());
  }
}

function battleDisplay(player, boss){
  console.log(`${boss.name} HP: ${boss.hp}, ${boss.name} AP: ${boss.ap}, ${player.name} HP: ${player.hp}, ${player.name} AP: ${player.ap}`);
}

function fight(side1, side2){
  while (!side1.dead && !side2.dead){
    side1.attack(side2);
    if (side1.dead || side2.dead){
      break;
    }
    side2.attack(side1);
  }
  console.log(`Fight is over`);
  battleDisplay(side1, side2);
  if (!player1.dead){
    player1.heal();
  }
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
  return names[0][rand(0, 4)] + ' ' + names[1][rand(0, 4)];
}

//-----------------------------
var names = [['Jack', 'Nick', 'Mike', 'Jimmy', 'Frank'], ['Black', 'Brown', 'Green', 'White', 'Grey']];

var player = '{"name": "John Doe", "stats": [10, 10, 10, 5], "weapon": {"demage": 1, "apCost": 1}, "armor": {"defence": 0}}';
player = JSON.parse(player);
var player1 = new Player(player);

startNextTurn(player1);
startNextTurn(player1);
startNextTurn(player1);
