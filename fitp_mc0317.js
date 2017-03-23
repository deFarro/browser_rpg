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
  attack(target){
    let damage = this.str * this.weapon.demage * rand(1,2);
    target.hp -= damage;
    this.ap -= this.weapon.apCost;
    if (target.hp <= 0) {
      target.dead = true;
    }
    return damage;
  }
  lockpick(target){
    if (target.lock.electric){
      console.log('Cannot lockpick electric lock');
      }
    else if (this.dex >= 5){
      if (rand(0, 9) > this.dex) {
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
  hack(target){
    if (!target.lock.electric){
      console.log('Cannot hack physical lock');
    }
    else if (this.int >= 5){
      target.lock.opened = true;
      this.weapon = target.content;
      console.log('Container opened');
    }
    else {
      console.log('Lock is too complicated');
    }
  }
  tryLuck(){

  }
}

class Container{
  constructor(){
    this.lock = new Lock();
    this.content = new Weapon(2);
  }
}

class Lock{
  constructor(){
    this.fortified = rand(0, 1);
    this.electric = rand(0, 1);
    this.opened = false;
  }
}

class Boss{
  constructor(){
    this.name = 'RD-' + rand(1000, 9999);
    this.hp = 100;
    this.ap = 15;
    this.attackRate = 10;
    this.dead = false;
  }
  attack(player){
    let damage = this.attackRate * rand(1, 2);
    player.hp -= damage;
    this.ap -= 3;
    if (player.hp <= 0){
      player.dead = true;
    }
    return damage;
  }
}

class Weapon{
  constructor(){
    this.demage = rand(4, 5);
    this.apCost = 2;
  }
}

function fight(side1, side2){
  while (!side1.dead && !side2.dead){
    hit(side1, side2);
    if (side1.dead || side2.dead){
      break;
    }
    hit(side2, side1);
  }
  console.log(`Fight is over`);
  battleDisplay(side1, side2);
}

function open(player, container){
  player.lockpick(container);
}

function hack(player, container){
  player.hack(container);
}

function hit(side1, side2){
  console.log(`${side1.name} hit ${side2.name} by ${side1.attack(side2)}`);
  if (side2.dead){
    console.log(`${side2.name} is dead`);
  }
}

function battleDisplay(player, boss){
  console.log(`${boss.name} HP: ${boss.hp}, ${boss.name} AP: ${boss.ap}, ${player.name} HP: ${player.hp}, ${player.name} AP: ${player.ap}`);
}

//-----------------------------
var player = '{"name": "John Doe", "stats": [5, 5, 5, 5]}';
player = JSON.parse(player);

var player1 = new Character(player);
var boss1 = new Boss();
var weapon1 = new Weapon();
var container1 = new Container();

open(player1, container1);
hack(player1, container1);
fight(player1, boss1);
