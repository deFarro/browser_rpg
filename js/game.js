'use strict';
// Class to track game progress
class Game {
  constructor() {
    this.turn = 0;
    this.whosTurn = 0;
    this.weapons = makeWeaponsArray(15);
    this.armors = makeArmorsArray(15);
  }
}

// Common class for all characters: players, enemies and NPCs
class Character {
  constructor(characterStats) {
    this.name = characterStats.name;
    this.str = characterStats.stats[0];
    this.dex = characterStats.stats[1];
    this.hp = this.maxHp;
    this.ap = this.maxAp;
    this.level = 0;
    this.dead = false;
  }
  get maxHp() {
    return this.str * 10 + 10;
  }
  get maxAp() {
    return this.dex + 2;
  }
  get attackRate() {
    return this.weapon.demage + this.str;
  }
  get defenceRate() {
    return this.armor.defence + this.str;
  }
  updateHpAndAp() {
    if (this.hp > this.maxHp) {
      this.hp = this.maxHp;
    }
    if (this.ap > this.maxAp) {
      this.ap = this.maxAp;
    }
  }
// Universal attack method
  attack(target, log) {
    let damage = (this.attackRate - target.defenceRate);
    if (damage <= 0) {
      damage = 1;
    }
    damage += this.weapon.demage;
    target.hp -= damage;
    this.ap -= this.weapon.apCost;
    log.push(`${this.name} (level ${this.level}) hit ${target.name} (level ${target.level}) by ${damage}, ${this.ap} AP left.`);
    if (target.hp <= 0) {
      target.dead = true;
      log.push(`${target.name} is dead.`);
    }
  }
}

// Subclass for players
class Player extends Character {
  constructor(characterStats, weapons, armors) {
    super(characterStats);
    this.weapon = weapons[0];
    this.armor = armors[0];
    this.int = characterStats.stats[2];
    this.luc = characterStats.stats[3];
    this.companion = null;
    this.levelups = [];
    this.items = ['Medkit', 'Ammo'];
  }
// Methods to raise stats and to loose them after death
  levelup(stat) {
    this.level++;
    this.levelups.push(stat);
    let replenishHp = this.hp + this.level * 5;
    this.hp = replenishHp > this.maxHp ? this.maxHp : replenishHp;
    this.ap = this.ap + 2 > this.maxAp ? this.maxAp : this.ap + 2;
    this[this.levelups[this.levelups.length - 1]]++;
  }
  leveldown() {
    this.level--;
    if (this.levelups.length){
      this[this.levelups.pop()]--;
    }
    this.updateHpAndAp();
    return `${this.name} lost a level.`;
  }
// Method to equip an item
  equip(item, target) {
    if (target.str >= item.weight) {
      if (item.classLevel >= target[item.type].classLevel) {
        target[item.type] = item;
        return `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} equipped.`;
      }
      else {
        return `This ${item.type} is not better then the one equipped.`;
      }
    }
    else {
      return `Cannot equip this ${item.type}. Too heavy.`;
    }
  }
// Method to breake a container lock
  breakAnyLock(target) {
    const typeParam = target.lock.electric ? this.int : this.dex;
    const content = target.content;
    if (typeParam >= target.lock.level){
      if (this.ap < 2){
        return 'Not enought AP.';
      }
      this.ap -= 2;
      if (target.lock.level <= typeParam + this.luc) {
        let result = {
          status: {
            result: 'Container opened.',
            log: `${this.name} found ${content.type === 'weapon' ? 'a' : 'an'} ${content.type}:`,
            stats: `${[...content].join(', ')}.`
          },
          item: content
        };
        return result;
      }
      else {
        return 'Lockpick failed.';
      }
    }
    else {
      return 'Lock is too complicated.';
    }
  }
  // Method to avoid battle
  escape() {
    if (rand(0, 19) > (this.dex + this.luc * 2)) {
      return false;
    }
    else {
      return true;
    }
  }
// Method to heal. Depends on intellect. Without arguments character heals himself
  heal(target = this) {
    if (this.ap < 2){
      console.log('Not enought AP.');
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
    return `${this.name} healed ${target.name} by ${regenHp}.`;
  }
// Method to replenish Action Points. Player skips his turn (multiplayer only)
  rest(){
    this.ap = this.maxAp;
  }
// Method to interact with NPCs: ask them to heal, join or pass their weapon. Character makes NPC to do it with strength or intellect
  talk(target, ask, forced) {
    let param = forced === 'true' ? 'str' : 'int';
    if (ask === 'heal'){
      return this.makeToDo(target, this[param], target[param], target.heal, ask, target.weapon);
    }
    if (ask === 'join'){
      return this.makeToDo(target, this[param], target[param], target.join, ask, target.weapon);
    }
    if (ask === 'supply'){
      return this.makeToDo(target, this[param], target[param], target.supply, ask, target.weapon);
    }
  }
  // Method to attempt threatening or persuading
  makeToDo(target, typeParamPlayer, typeParamNPC, action, subject, item) {
    if (typeParamPlayer + Math.floor(this.luc / 2) > typeParamNPC) {
      let result = {
        status: {
          result: 'Attempt succeeded.',
          log: `${target.name} has agreed to ${subject} ${this.name}.`
        },
        fullLog: [action.call(target, this)]
      };
      if (subject === 'supply') {
        result.status.log = `${target.name} passed weapon to ${this.name}:`;
        result.status.stats = `${[...item].join(', ')}.`;
        result.item = item;
      }
      return result;
    }
    else {
      return `${target.name} won't ${subject} ${this.name}.`;
    }
  }
}
// Iterator for going through player's inventory

Player.prototype[Symbol.iterator] = function() {
  var items = [this.weapon, this.armor];
  items = items.concat(this.items);
  return {
    next() {
      return {done: !items.length, value: items.shift()};
    }
  }
}

// Class for enemies. Uses object with random stats to create enemy instance
class Enemy extends Character {
  constructor(weapons, armors) {
    let protoStats = new NextEnemyStats();
    super(protoStats);
    this.level = protoStats.level;
    this.weapon = weapons[rand(this.level, this.level + 3)];
    this.armor = armors[rand(this.level, this.level + 3)];
  }
}

// Конструктор генерации объекта с данными для создания нового противника
class NextEnemyStats {
  constructor() {
    this.name = enemyNameGenerator();
    this.level = getNotRandomIndex(1, 20);
    this.stats = this.getEnemyStats();
  }

// Функция, которая распределяет уровни противника по характеристикам
  getEnemyStats() {
    let stats = [], levelups = this.level;
    stats[0] = 1 + Math.ceil(levelups / 2);
    stats[1] = 1 + Math.floor(levelups / 2);
    return stats;
  }
}

// Класс для NPC, с которыми игрок сможет взаимодействовать
class NPC extends Enemy {
  constructor(weapons, armors) {
    super(weapons, armors);
    this.name = npcNameGenerator();
    this.int = this.level + Math.floor(this.level / 3);
  }
  join(target) {
    target.companion = this;
    return `${this.name} joined ${target.name}.`;
  }
  supply(target) {
    return `${this.name} passed his weapon to ${target.name}.`;
  }
}
NPC.prototype.heal = Player.prototype.heal;

class Container {
  constructor(weapons, armors) {
    this.lock = new Lock();
    this.weapons = weapons;
    this.armors = armors;
  }
  get content() {
    if (rand(0, 1)) {
      return this.weapons[getNotRandomIndex(this.lock.level, this.lock.level + 10)];
    }
    else {
      return this.armors[getNotRandomIndex(this.lock.level, this.lock.level + 10)];
    }
  }
}

class Lock{
  constructor(){
    this.fortified = rand(0, 1);
    this.electric = rand(0, 1);
    this.level = getNotRandomIndex(1, 10);
  }
}

// Function for distributing loot not equally (good items are rare)
function getNotRandomIndex(from, to) {
  let grade, index = rand(0, 9);
  let mid = Math.floor((from + to) / 2);
  let midS = Math.floor((from + mid) / 2);
  let midL = Math.floor((mid + to) / 2);
  switch (index) {
    case 0:
    case 1:
    case 2:
    case 3:
      grade = [from, midS];
      break;
    case 4:
    case 5:
    case 6:
      grade = [midS, mid];
      break;
    case 7:
    case 8:
      grade = [mid, midL];
      break;
    case 9:
      grade = [midL, to];
  }
  return rand(...grade);
}

// Функция начала следующего хода - определяет что будет перед игроком - противник, контейнер или NPC
function startNextTurn(game) {
  let index = rand(0, 5);
  switch (index){
    case 0:
    case 1:
    case 2:
      return new Enemy(game.weapons, game.armors);
      break;
    case 3:
    case 4:
      return new Container(game.weapons, game.armors);
      break;
    case 5:
      return new NPC(game.weapons, game.armors);
  }
}

// Function for generating short battle log
function battleDisplay(player, enemy){
  return `${enemy.name} HP: ${enemy.hp}/${enemy.maxHp} AP: ${enemy.ap}/${enemy.maxAp}, ${player.name} HP: ${player.hp}/${player.maxHp} AP: ${player.ap}/${player.maxAp}`;
}
// Function for a fight
function battle(side1, side2) {
  let status = {};
  status.fullLog = [];
  while (!side1.dead && !side2.dead) {
    battleRound(side1, side2, status.fullLog);
    if (side2.dead){
      status.winner = side1;
      break;
    }
    battleRound(side2, side1, status.fullLog);
  }
  status.shortLog = battleDisplay(side1, side2);
  status.fullLog.push(`Battle is over.`);
  battleDisplay(side1, side2);
  if (side1.dead) {
    status.winner = side2;
    if (side1.companion) {
      status.fullLog.push(`Companion has left.`);
      side1.companion = undefined;
    }
    side1.hp = side1.maxHp;
    side1.ap = side1.maxAp;
    if (side1.level > 0) {

      status.fullLog.push(side1.leveldown());
    }
    side1.dead = false;
  }
  return {
    player: side1,
    winner: status.winner,
    log: status.shortLog,
    fullLog: status.fullLog
  };
}

// Функция для раунда боя (персонаж наносит урон, пока не кончатся AP)
function battleRound(side1, side2, log) {
  // Проверяем на наличие помощника у цели. Если есть, то решаем кого атаковать (у кого меньше HP)
  if (side2.companion && !side2.companion.dead) {
    side2 = side2.hp > side2.companion.hp ? side2.companion : side2;
  }
  while (side1.ap - side1.weapon.apCost >= 0) {
    side1.attack(side2, log);
    if (side2.dead) {
      //side1.ap = side1.maxAp;
      return;
    }
  }
  side1.ap = side1.maxAp;
  // Проверяем на наличие помощника у атакующего. Если есть, то атакует помощник
  if (side1.companion && !side1.companion.dead) {
    battleRound(side1.companion, side2, log);
  }
}

function rand(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

// Генератор предметов с разными параметрами. Принимает максимальное значение нужного бонуса и тип
function* createItems(maxChar, type) {
  for (let i = 0; i < maxChar; i++) {
    let item = {};
    item[type.mainChar] = i + 1;
    item.classLevel = i + 1;
    item.weight = Math.ceil(i / 2.5);
    if (type.secondChar) {
      item[type.secondChar] = Math.floor(i / 4 + 1);
    }
// Итератор для листания свойств предмета
  item[Symbol.iterator] = function() {
    let stats = Object.keys(item);
    stats = stats.map(stat => {return [stat] + ": " + item[stat]})
    .filter(stat => {return stat.indexOf('type') == -1})
    .filter(stat => {return stat.indexOf('classLevel') == -1});
    return {
      next() {
        return {done: !stats.length, value: stats.shift()}
      }
    }
  }
  yield item;
  }
}

// Генератор массива оружия с разными параметрами
function makeWeaponsArray(maxDem) {
  var weapons = [];
  for (let weapon of createItems(maxDem, {mainChar: 'demage', secondChar: 'apCost'})){
    weapon.type = 'weapon';
    weapons.push(weapon);
  }
  return weapons;
}

// Генератор массива брони с разными параметрами
function makeArmorsArray(maxDef) {
  var armors = [];
  for (let armor of createItems(maxDef, {mainChar: 'defence'})) {
    armor.type = 'armor';
    armors.push(armor);
  }
  return armors;
}

// Генератор имён роботов
function enemyNameGenerator() {
  return 'RD-' + rand(1000, 9999);
}

// Генератор человеческих имён
function npcNameGenerator() {
  return npcNames[0][rand(0, 4)] + ' ' + npcNames[1][rand(0, 4)];
}
var npcNames = [['Jack', 'Nick', 'Mike', 'Jimmy', 'Frank'], ['Black', 'Brown', 'Green', 'White', 'Grey']];

//--------------------------------------------------------------------------------------------
// Initialize items and character using promises (for multiplayer, when fetching is needed)
//--------------------------------------------------------------------------------------------
//
// var weapons, armors;
//
// // Promise for creating/fetching arrays with weapons/armors
// var prepareWeapons = new Promise((done, fail) => {
//   weapons = makeWeaponsArray(15);
//   armors = makeArmorsArray(15);
//   if (weapons instanceof Array && armors instanceof Array){
//     done();
//   }
//   fail('Item generation error');
// });
//
// // Promise for creating player/players
// var initialize = new Promise((done, fail) => {
//   try {
//   let player = '{"name": "John Doe", "stats": [5, 5, 5, 5]}';
//   var player1 = new Player(JSON.parse(player));
//   }
//   catch(err) {
//     fail('JSON is incorrect');
//   }
//   // Check if there are any undefined properties
//   if (Object.keys(player1).map((key) => {return player1[key]}).indexOf(undefined) == -1) {
//     done(player1);
//   }
//   fail('Stats are not full');
// });
//
// // Function to execute proper amount of turns (for visualization only)
// function doTurns(player, amount = 1){
//   for (let i = 0; i < amount; i++){
//     startNextTurn(player);
//   }
// }
//
// prepareWeapons.then(initialize.then(player => doTurns(player, 3))).catch(err => console.log(err));
//
//--------------------------------------------------------------------------------------------
// Code below needed for running in Node.js
//--------------------------------------------------------------------------------------------
//
// var weapons = makeWeaponsArray(15);
// var armors = makeArmorsArray(15);
//
// var player = '{"name": "John Doe", "stats": [5, 5, 5, 5]}';
// var player1 = new Player(JSON.parse(player));
//
// startNextTurn(player1);
// startNextTurn(player1);
// startNextTurn(player1);
//
//--------------------------------------------------------------------------------------------
// Exporting data for manual Mocha/Chai tests
//--------------------------------------------------------------------------------------------
//
// module.exports = {
//   Character,
//   Enemy,
//   NextEnemyStats,
//   makeWeaponsArray,
//   makeArmorsArray
// };
