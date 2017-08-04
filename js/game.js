'use strict';
//Класс для отслеживания хода игры
class Game {
  constructor() {
    this.turn = 0;
    this.whosTurn = 0;
    this.weapons = makeWeaponsArray(15);
    this.armors = makeArmorsArray(15);
  }
}

// Общий прото-класс для всех персонажей игры - игроков, противников, NPC
class Character{
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
// Универсальный метод для атаки
  attack(target, log) {
    let damage = this.attackRate - target.defenceRate;
    if (damage <= 0) {
      damage = 1;
    }
    target.hp -= damage;
    this.ap -= this.weapon.apCost;
    log.push(`${this.name} (level ${this.level}) hit ${target.name} (level ${target.level}) by ${damage}, ${this.ap} AP left.`);
    if (target.hp <= 0) {
      target.dead = true;
      log.push(`${target.name} is dead.`);
    }
  }
}

// Класс для игрока/игроков
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
// Methods for raising stats and for loosing them after death
  levelup(stat) {
    this.level++;
    this.levelups.push(stat);
    this[this.levelups[this.levelups.length - 1]]++;
  }
  leveldown() {
    console.log(`${this.name} lost a level.`)
    this.level--;
    if (this.levelups.length){
      this[this.levelups.pop()]--;
    }
  }
// Method for equipping an item
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
// Method for breaking a container lock
  breakAnyLock(target){
    const typeParam = target.lock.electric ? this.int : this.dex;
    const content = target.content;
    if (typeParam >= target.lock.level){
      if (this.ap < 2){
        return 'Not enought AP.';
      }
      this.ap -= 2;
      if (rand(0,9) + target.lock.level < typeParam + this.luc) {
        let result = {
          status: {
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
// Метод для восстановления здоровья, в зависимости от интеллекта. Без аргумента персонаж лечит себя
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
    console.log(`${this.name} healed ${target.name} by ${regenHp}.`);
  }
// Метод для восстановления AP. Игрок пропускает ход (только для мультиплеера)
  rest(){
    this.ap = this.maxAp;
  }
// Метод для взаимодействия с NPC: попросить присоединиться, вылечить или отдать оружие, убедить с помощью интеллекта или силы
  talk(target, ask = 'join', forced = false){
    if (this.ap < 2){
      console.log('Not enought AP.');
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
      console.log(`${target.name} won't ${subject} ${this.name}.`);
    }
  }
}
// Итератор для листания списка предметов персонажа
Player.prototype[Symbol.iterator] = function() {
  var items = [this.weapon, this.armor];
  items = items.concat(this.items);
  return {
    next() {
      return {done: !items.length, value: items.shift()};
    }
  }
}

// Класс противника. Использует объект со случайными данными для создания
class Enemy extends Character{
  constructor(weapons, armors){
    let protoStats = new NextEnemyStats();
    super(protoStats);
    this.level = protoStats.level;
    this.weapon = weapons[4];
    this.armor = armors[4];
  }
}

// Конструктор генерации объекта с данными для создания нового противника
class NextEnemyStats {
  constructor(){
    this.name = enemyNameGenerator();
    this.level = getRandomLevel();
    this.stats = this.getEnemyStats();
  }

// Функция, которая распределяет уровни противника по характеристикам
  getEnemyStats(){
    let stats = [], levelups = this.level;
    stats[0] = 1 + Math.ceil(levelups / 2);
    stats[1] = 1 + Math.floor(levelups / 2);
    return stats;
  }
}

// Функция генерации случайного уровня противника, с учётом того, что более высокие уровни должны генерироваться реже
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

// Класс для NPC, с которыми игрок сможет взаимодействовать
class NPC extends Enemy{
  constructor(weapons, armors){
    super(weapons, armors);
    this.name = npcNameGenerator();
    this.int = 5 + Math.floor(this.level / 2);
  }
  join(target){
    target.companion = this;
    console.log(`${this.name} joined ${target.name}.`);
  }
  supply(target){
    target.weapon = this.weapon;
    console.log(`${this.name} passed weapon to ${target.name}.`);
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
      return this.weapons[rand(0, this.weapons.length - 1)];
    }
    else {
      return this.armors[rand(0, this.armors.length - 1)];
    }
  }
}

class Lock{
  constructor(){
    this.fortified = rand(0, 1);
    this.electric = rand(0, 1);
    this.level = rand (1, 10);
  }
}

// Функция начала следующего хода - определяет что будет перед игроком - противник, контейнер или NPC
function startNextTurn(game) {
  let index = rand(0, 4);
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
      character.talk(new NPC());
  }
}

// Function for generating short battle log
function battleDisplay(player, enemy){
  return `${enemy.name} HP: ${enemy.hp}/${enemy.maxHp} AP: ${enemy.ap}/${enemy.maxAp}, ${player.name} HP: ${player.hp}/${player.maxHp} AP: ${player.ap}/${player.maxAp}`;
}
// Function for a fight
function battle(side1, side2){
  let status = {};
  status.fullLog = [];
  while (!side1.dead && !side2.dead){
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
    side1.hp = side1.maxHp;
    side1.ap = side1.maxAp;
    if (side1.level > 0){
      side1.leveldown();
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
function battleRound(side1, side2, log){
  // Проверяем на наличие помощника у цели. Если есть, то решаем кого атаковать (у кого меньше HP)
  if (side2.companion && !side2.companion.dead) {
    side2 = side2.hp > side2.companion.hp ? side2.companion : side2;
  }
  while (side1.ap - side1.weapon.apCost >= 0){
    side1.attack(side2, log);
    if (side2.dead){
      //side1.ap = side1.maxAp;
      return;
    }
  }
  side1.ap = side1.maxAp;
  // Проверяем на наличие помощника у атакующего. Если есть, то атакует помощник
  if (side1.companion && !side1.companion.dead) {
    battleRound(side1.companion, side2);
  }
}

function rand(from, to){
  return Math.floor(Math.random() * (to - from + 1) + from);
}

// Генератор предметов с разными параметрами. Принимает максимальное значение нужного бонуса и тип
function* createItems(maxChar, type) {
  for (let i = 0; i < maxChar; i++) {
    let item = {};
    item[type.mainChar] = i + 1;
    item.classLevel = i + 1;
    item.weight = Math.floor(i * 1.4);
    if (type.secondChar) {
      item[type.secondChar] = Math.floor(i / 3 + 1);
    }
// Итератор для листания свойств предмета
  item[Symbol.iterator] = function(){
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
function makeWeaponsArray(maxDem){
  var weapons = [];
  for (let weapon of createItems(maxDem, {mainChar: 'demage', secondChar: 'apCost'})){
    weapon.type = 'weapon';
    weapons.push(weapon);
  }
  return weapons;
}

// Генератор массива брони с разными параметрами
function makeArmorsArray(maxDef){
  var armors = [];
  for (let armor of createItems(maxDef, {mainChar: 'defence'})){
    armor.type = 'armor';
    armors.push(armor);
  }
  return armors;
}

// Генератор имён роботов
function enemyNameGenerator(){
  return 'RD-' + rand(1000, 9999);
}

// Генератор человеческих имён
function npcNameGenerator(){
  return npcNames[0][rand(0, 4)] + ' ' + npcNames[1][rand(0, 4)];
}
var npcNames = [['Jack', 'Nick', 'Mike', 'Jimmy', 'Frank'], ['Black', 'Brown', 'Green', 'White', 'Grey']];

//-----------------------------
// Инициализация персонажей и предметов на промисах
/*
var weapons, armors;

// Промис для подготовки массива с оружием и бронёй
var prepareWeapons = new Promise((done, fail) => {
  weapons = makeWeaponsArray(15);
  armors = makeArmorsArray(15);
  if (weapons instanceof Array && armors instanceof Array){
    done();
  }
  fail('Item generation error');
});

// Промис для подготовки объекта игрока
var initialize = new Promise((done, fail) => {
  try {
  let player = '{"name": "John Doe", "stats": [5, 5, 5, 5]}';
  var player1 = new Player(JSON.parse(player));
  }
  catch(err) {
    fail('JSON is incorrect');
  }
  // Проверяем на отсутствие свойств со значением "undefined"
  if (Object.keys(player1).map((key) => {return player1[key]}).indexOf(undefined) == -1) {
    done(player1);
  }
  fail('Stats are not full');
});

// Функция для совершения заданного количества ходов (для наглядности)
function doTurns(player, amount = 1){
  for (let i = 0; i < amount; i++){
    startNextTurn(player);
  }
}

prepareWeapons.then(initialize.then(player => doTurns(player, 3))).catch(err => console.log(err));
*/
//-----------------------------
// var weapons = makeWeaponsArray(15);
// var armors = makeArmorsArray(15);
//
// var player = '{"name": "John Doe", "stats": [5, 5, 5, 5]}';
// var player1 = new Player(JSON.parse(player));
//
// startNextTurn(player1);
// startNextTurn(player1);
// startNextTurn(player1);
