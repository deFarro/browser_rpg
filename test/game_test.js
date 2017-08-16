const expect = require('chai').expect;

const createItems = require('../js/game').createItems;
const makeWeaponsArray = require('../js/game').makeWeaponsArray;
const makeArmorsArray = require('../js/game').makeArmorsArray;
const Character = require('../js/game').Character;
const Enemy = require('../js/game').Enemy;
const NextEnemyStats = require('../js/game').NextEnemyStats;
const NPC = require('../js/game').NPC;
const Player = require('../js/game').Player;
const Container = require('../js/game').Container;
const Lock = require('../js/game').Lock;
const battle = require('../js/game').battle;
const battleRound = require('../js/game').battleRound;

describe('createItems', function() {
  let item;
  before(function() {
    item = createItems(1, {mainChar: 'demage', secondChar: 'apCost'}).next().value;
  });
  it('should return an object', function() {
    expect(item).to.be.an('object');
  });
  it('weapon should have needed props', function() {
    expect(item).to.have.property('demage');
    expect(item).to.have.property('apCost');
    expect(item).to.have.property('classLevel');
    expect(item).to.have.property('weight');
  });
  it('armor should have needed props', function() {
    item = createItems(1, {mainChar: 'defence'}).next().value;
    expect(item).to.have.property('defence');
    expect(item).to.have.property('classLevel');
    expect(item).to.have.property('weight');
  });
})

describe('makeWeaponsArray', function() {
  it('should return an array', function() {
    expect(makeWeaponsArray(25)).to.be.an('array');
  });
  it('array should have with proper length', function() {
    expect(makeWeaponsArray(25)).to.have.lengthOf(25);
  });
  it('array should contain only weapons', function() {
    expect(makeWeaponsArray(1)[0]).to.have.property('type', 'weapon');
  });
});

describe('makeArmorsArray', function() {
  it('should return an array with proper length', function() {
    expect(makeArmorsArray(25)).to.be.an('array').and.to.have.lengthOf(25);
  });
  it('array should have with proper length', function() {
    expect(makeWeaponsArray(25)).to.have.lengthOf(25);
  });
  it('array should contain only weapons', function() {
    expect(makeArmorsArray(1)[0]).to.have.property('type', 'armor');
  });
});

describe('Class Character', function() {
  let character;
  before(function() {
    const characterStats = {
      name: 'Test',
      stats: [0, 0]
    };
    character = new Character(characterStats);
  })
  it('should be a function', function() {
    expect(Character).to.be.a('function');
  });
  it('should return an object', function() {
    expect(character).to.be.an('object');
  });
  it('enemy should have all needed props', function() {
    expect(character).to.have.keys('hp', 'ap', 'dead', 'dex', 'level', 'name', 'str', 'weapon', 'armor');
  });
  it('enemy should have all needed methods', function() {
    expect(character).to.have.property('maxHp');
    expect(character).to.have.property('maxAp');
    expect(character).to.have.property('attackRate');
    expect(character).to.have.property('defenceRate');
    expect(character).to.have.property('updateHpAndAp');
    expect(character).to.have.property('attack');
  });

  describe('attack method', function() {
    let target;
    beforeEach(function() {
      target = {
        name: 'Test Target',
        level: 1,
        hp: 50,
        defenceRate: 1,
        dead: false
      };
    });
    it('should decrease targets hp', function() {
      const attackFunc = () => character.attack(target);
      const getHp = () => target.hp;
      expect(attackFunc).to.decrease(getHp);
    });
    it('should decrease characters ap', function() {
      const attackFunc = () => character.attack(target);
      const getAp = () => character.ap;
      expect(attackFunc).to.decrease(getAp);
    });
    it('should notify if target is dead', function() {
      target.hp = 1;
      expect(character.attack(target)).to.include('Test Target is dead.');
    });
    it('should return an array of strings', function() {
      expect(character.attack(target)).to.be.an('array');
      expect(character.attack(target)[0]).to.be.a('string');
    });
  });
})

describe('Class Enemy', function() {
  let enemy;
  before(function() {
    const weapons = makeWeaponsArray(25);
    const armors = makeArmorsArray(25);
    enemy = new Enemy(weapons, armors);
  })
  it('should be a function', function() {
    expect(Enemy).to.be.a('function');
  });
  it('should return an object', function() {
    expect(enemy).to.be.an('object');
  });
  it('enemy should have all needed props', function() {
    expect(enemy).to.have.keys('hp', 'ap', 'armor', 'dead', 'dex', 'level', 'name', 'str', 'weapon');
  });

  describe('NextEnemyStats', function() {
    it('should be a function', function() {
      expect(NextEnemyStats).to.be.a('function');
    });
    it('should return an object', function() {
      expect(new NextEnemyStats()).to.be.an('object');
    });
    it('should contain correct properties', function() {
      expect(new NextEnemyStats().name).to.be.a('string');
      expect(new NextEnemyStats().level).to.be.a('number');
      expect(new NextEnemyStats().stats).to.be.an('array');
    });
    it('should return both strength and dexterity stats', function() {
      expect(new NextEnemyStats().stats.length).to.equal(2);
    });
  });
});

describe('Class NPC', function() {
  let npc;
  before(function() {
    const weapons = makeWeaponsArray(25);
    const armors = makeArmorsArray(25);
    npc = new NPC(weapons, armors);
  });
  it('should be a function', function() {
    expect(NPC).to.be.a('function');
  });
  it('should return an object', function() {
    expect(npc).to.be.an('object');
  });
  it('enemy should have all needed props', function() {
    expect(npc).to.have.all.keys('hp', 'ap', 'armor', 'dead', 'dex', 'level', 'name', 'str', 'weapon', 'int');
  });
  it('enemy should have all needed methods', function() {
    expect(npc).to.have.property('join');
    expect(npc).to.have.property('supply');
  });

  describe('heal method', function() {
    let target;
    beforeEach(function() {
      npc.ap = 4;
      target = {
        name: 'Test',
        hp: 20,
        maxHp: 50,
        companion: null
      };
    });
    it('should return notificatio if there is not enough action points', function() {
      npc.ap = 0;
      expect(npc.heal(target)[0]).to.equal('Not enought AP.');
    });
    it('should increase targets hp', function() {
      const healFunc = () => npc.heal(target);
      const getHp = () => target.hp;
      expect(healFunc).to.increase(getHp);
    });
    it('should heal targets companion if there is one', function() {
      target.companion = {
        name: 'Test Companion',
        hp: 20,
        maxHp: 50
      };
      const healFunc = () => npc.heal(target);
      const getHp = () => target.companion.hp;
      expect(healFunc).to.increase(getHp);
    });
    it('should return array with strings', function() {
      expect(npc.heal(target)).to.be.an('array');
      expect(npc.heal(target)[0]).to.be.a('string');
    });
  });

  describe('join method', function() {
    let target;
    beforeEach(function() {
      target = {name: 'Test'};
    });
    it('should alter a target', function() {
      npc.join(target);
      expect(target.companion).to.eql(npc);
    });
    it('should return an array of strings', function() {
      expect(npc.join(target)).to.be.an('array');
      expect(npc.join(target)[0]).to.be.a('string');
    });
  });

  describe('supply method', function() {
    let target = {name: 'Test'};
    it('should return array with strings', function() {
      expect(npc.supply(target)).to.be.an('array');
      expect(npc.supply(target)[0]).to.be.a('string');
    });
  });
});

describe('Class Player', function() {
  let player;
  before(function() {
    const weapons = makeWeaponsArray(25);
    const armors = makeArmorsArray(25);
    const characterStats = {
      name: 'Test',
      stats: [0, 0, 0, 0]
    };
    player = new Player(characterStats, weapons, armors);
  });
  it('should be a function', function() {
    expect(Player).to.be.a('function');
  });
  it('should return an object', function() {
    expect(player).to.be.an('object');
  });
  it('enemy should have all needed props', function() {
    expect(player).to.have.all.keys('hp', 'ap', 'armor', 'dead', 'dex', 'level', 'name', 'str', 'weapon', 'int', 'luc', 'companion', 'items', 'levelups');
  });
  it('enemy should have all needed methods', function() {
    expect(player).to.have.property('levelup');
    expect(player).to.have.property('leveldown');
    expect(player).to.have.property('equip');
    expect(player).to.have.property('breakAnyLock');
    expect(player).to.have.property('escape');
    expect(player).to.have.property('heal');
    expect(player).to.have.property('rest');
    expect(player).to.have.property('talk');
    expect(player).to.have.property('makeToDo');
  });
  it('should be iterable', function() {
    let item = [...player];
    expect(item).to.be.an('array');
  });

  describe('levelup method', function() {
    it('should raise players level');
  });

  describe('leveldown method', function() {
    it('should reduce players level');
  });

  describe('equip method', function() {
    it('should equip item');
  });

  describe('breakAnyLock method', function() {
    it('should break containers lock');
  });

  describe('escape method', function() {
    it('should escape from battle');
  });

  describe('talk method', function() {
    it('should talk to NPC');
  });

  describe('makeToDo method', function() {
    it('should make NPC to do proper things');
  });
});

describe('Class Container', function() {
let container;
  before(function() {
    const weapons = makeWeaponsArray(25);
    const armors = makeArmorsArray(25);
    container = new Container(weapons, armors);
  });
  it('should be a function', function() {
    expect(Container).to.be.a('function');
  });
  it('should return an object', function() {
    expect(container).to.be.an('object');
  });
  it('enemy should have all needed props', function() {
    expect(container).to.have.keys('weapons', 'armors', 'lock');
  });
  it('enemy should have contents', function() {
    expect(container).to.have.property('content');
  });
  it('content should be an object', function() {
    expect(container.content).to.be.an('object');
  });
  it('content should be a weapon or an armor', function() {
    expect(container.content.type).to.be.oneOf(['weapon', 'armor']);
  });

  describe('Class Lock', function() {
    let lock;
    before(function() {
      lock = new Lock();
    });
    it('should be a function', function() {
      expect(Lock).to.be.a('function');
    });
    it('should return an object', function() {
      expect(lock).to.be.an('object');
    });
    it('enemy should have all needed props', function() {
      expect(lock).to.have.keys('fortified', 'electric', 'level');
    });
  })
});

describe('Battle round function', function() {
  let side1, side2;
  const weapons = makeWeaponsArray(25);
  const armors = makeArmorsArray(25);
  beforeEach(function() {
    side1 = new NPC(weapons, armors);
    side2 = new NPC(weapons, armors);
  });
  it('should quit if side2 is dead', function() {
    side2.dead = true;
    expect(battleRound(side1, side2)).to.be.undefined;
  });
  it('should attack companion if side2 has one', function() {
    side2.companion = new NPC(weapons, armors);
    const battleFunc = () => battleRound(side1, side2);
    const getHp = () => side2.companion.hp;
    expect(battleFunc).to.decrease(getHp);
  });
  it('if side 1 has a companion he should attack', function() {
    side1.ap = 0;
    side2.hp = 1000;
    side1.companion = new NPC(weapons, armors);
    let report = battleRound(side1, side2).filter(line => line.indexOf(side1.companion.name) >= 0);
    expect(report).to.have.lengthOf.at.least(1);
  });
  it('should return array with strings', function() {
    let report = battleRound(side1, side2);
    expect(report).to.be.an('array');
    expect(report[0]).to.be.a('string');
  });
});


describe('Battle function', function() {
  let side1, side2;
  const weapons = makeWeaponsArray(25);
  const armors = makeArmorsArray(25);
  beforeEach(function() {
    side1 = new NPC(weapons, armors);
    side2 = new NPC(weapons, armors);
    side1.leveldown = () => 'leveldown';
    side2.leveldown = () => 'leveldown';
  });
  it('should track a winner correctly', function() {
    let result = battle(side1, side2);
    let deathLine = result.fullLog.filter(line => line.indexOf('dead') >= 0)[0].split(' ');
    let loserName = deathLine[0] + ' ' + deathLine[1];
    expect(result.winner.name).to.not.be.equal(loserName);
  });
  it('should decrease the level of losing side', function() {
    side1.level = 1;
    side1.hp = 1;
    side2.hp = 1000;
    let result = battle(side1, side2);
    expect(result.fullLog).to.include('leveldown');
  });
  it('should revive player after death', function() {
    side1.hp = 1;
    side2.hp = 1000;
    let result = battle(side1, side2);
    expect(side1.dead).to.be.equal(false);
    expect(side1.hp).to.be.equal(side1.maxHp);
    expect(side1.ap).to.be.equal(side1.maxAp);
  });
  it('should return an object', function() {
    expect(battle(side1, side2)).to.be.an('object');
  });
  it('returned object should contain needed properties', function() {
    expect(battle(side1, side2)).to.have.keys('player', 'winner', 'log', 'fullLog');
  });
});
