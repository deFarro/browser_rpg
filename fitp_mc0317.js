'use strict';

function rand(from, to){
  return Math.floor(Math.random() * (to - from + 1) + from);
}




class Character{
  constructor(player){
    this.name = player.name;
    this.str = player.stats[0];
    this.dex = player.stats[1];
    this.int = player.stats[2];
    this.luc = player.stats[3];
    this.hp = this.maxHp;
    this.ap = this.maxAp;
    this.weapon = {demage: 1, apCost: 1};
    this.dead = false;
  }
  get maxHp(){
    return this.str * 10 + 10;
  }
  get maxAp(){
    return this.dex * 2;
  }
  get attackRate(){
    return this.weapon.demage * this.str;
  }

  attack(target){
  let demage = attack.call(this, target);
  console.log(`${this.name} hit ${target.name} by ${demage}`);
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

class Boss{
  constructor(){
    this.name = 'RD-' + rand(1000, 9999);
    this.hp = 100;
    this.ap = 15;
    this.attackRate = 10;
    this.dead = false;
    this.weapon = {demage: 1, apCost: 3};
  }
  attack(target){
    let demage = attack.call(this, target);
    console.log(`${this.name} hit ${target.name} by ${demage}`);
  }
}

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
    this.demage = rand(4, 5);
    this.apCost = 2;
  }
}

function open(player, container){
  player.lockpick(container);
}

function hack(player, container){
  player.hack(container);
}

function attack(target){
  let damage = this.attackRate * rand(1, 2);
  target.hp -= damage;
  this.ap -= this.weapon.apCost;
  if (target.hp <= 0){
    target.dead = true;
  }
  return damage;
}

function hit(side1, side2){
  console.log(`${side1.name} hit ${side2.name} by ${attack(side1, side2)}`);
  if (side2.dead){
    console.log(`${side2.name} is dead`);
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

//-----------------------------
var player = '{"name": "John Doe", "stats": [5, 10, 5, 5]}';
player = JSON.parse(player);

var player1 = new Character(player);
var boss1 = new Boss();
var weapon1 = new Weapon();
var container1 = new Container();

open(player1, container1);
hack(player1, container1);
fight(player1, boss1);

player1.attack(boss1);
boss1.attack(player1);
