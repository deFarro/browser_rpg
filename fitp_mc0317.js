'use strict';

class Character{
  constructor(characterStats){
    this.name = characterStats.name;
    this.str = characterStats.stats[0];
    this.dex = characterStats.stats[1];
    this.int = characterStats.stats[2];
    this.luc = characterStats.stats[3];
    this.weapon = characterStats.weapon;
    this.hp = this.maxHp;
    this.ap = this.maxAp;
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

  attack(target){
    let damage = this.attackRate * rand(1, 2);
    target.hp -= damage;
    this.ap -= this.weapon.apCost;
    console.log(`${this.name} hit ${target.name} by ${damage}`);
    if (target.hp <= 0){
      target.dead = true;
      console.log(`${target.name} is dead`);
    }
  }
  lockpick(target){
    if (target.lock.electric){
      console.log('Cannot lockpick electric lock');
    }
    else {
      this.breakAnyLock(target, this.dex)
    }
  }
  hack(target){
    if (!target.lock.electric){
      console.log('Cannot hack physical lock');
    }
    else {
      this.breakAnyLock(target, this.int);
    }
  }
  breakAnyLock(target, typeParam){
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
}

// class Player extends Character{
//
// }
//
// class Enemy extends Character{
//
// }
//
// class NPC extends Character{
//
// }

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
}

function rand(from, to){
  return Math.floor(Math.random() * (to - from + 1) + from);
}

function nameGenerator(){
  return 'RD-' + rand(1000, 9999);
}

//-----------------------------
var player = '{"name": "John Doe", "stats": [5, 5, 5, 5], "weapon": {"demage": 1, "apCost": 1}}';
var boss = {name: nameGenerator(), stats: [7, 5, 5, 5], weapon: {demage: 2, apCost: 3}};

player = JSON.parse(player);

var player1 = new Character(player);
var boss1 = new Character(boss);
var container1 = new Container();


player1.lockpick(container1);
player1.hack(container1);
fight(player1, boss1);
