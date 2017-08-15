const expect = require('chai').expect;

const Character = require('../js/game').Character;
const Enemy = require('../js/game').Enemy;
const NextEnemyStats = require('../js/game').NextEnemyStats;
const makeWeaponsArray = require('../js/game').makeWeaponsArray;
const makeArmorsArray = require('../js/game').makeArmorsArray;

describe('Class Enemy', function() {
  it('should be a function', function() {
    expect(Enemy).to.be.a('function');
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
