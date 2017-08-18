'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(['react', 'setup_window', 'game_window_fight', 'game_window_container', 'game_window_npc', 'game'], function (React, setupWindow, fight, container, npc) {

  var GameTitle = setupWindow.GameTitle;

  var FaceEnemy = fight.FaceEnemy,
      Escaped = fight.Escaped,
      BattleOver = fight.BattleOver,
      LevelUp = fight.LevelUp;
  var FaceContainer = container.FaceContainer,
      FaceItem = container.FaceItem,
      FinishedContainer = container.FinishedContainer;
  var FaceNPC = npc.FaceNPC,
      Conversation = npc.Conversation,
      FinishedConversation = npc.FinishedConversation;

  var GameWindow = function (_React$Component) {
    _inherits(GameWindow, _React$Component);

    function GameWindow(props) {
      _classCallCheck(this, GameWindow);

      var _this = _possibleConstructorReturn(this, (GameWindow.__proto__ || Object.getPrototypeOf(GameWindow)).call(this, props));

      _this.playerStats = props;
      _this.weapons = makeWeaponsArray(25);
      _this.armors = makeArmorsArray(25);
      _this.statUpgrade = 'str';
      _this.screens = {
        nextTurn: React.createElement(NextTurnButton, { startTurn: _this.startTurn.bind(_this) }),
        faceEnemy: React.createElement(FaceEnemy, { enemy: _this.getActive.bind(_this), startBattle: _this.startBattle.bind(_this), escape: _this.escape.bind(_this) }),
        escaped: React.createElement(Escaped, { returnToStart: _this.returnToStart.bind(_this) }),
        battleOver: React.createElement(BattleOver, { results: _this.getActive.bind(_this), player: _this.getPlayer.bind(_this), returnToStart: _this.returnToStart.bind(_this), levelUp: _this.levelUp.bind(_this) }),
        levelUp: React.createElement(LevelUp, { raise: _this.raiseStat.bind(_this), trackValue: _this.trackValue.bind(_this), getStat: _this.getStat.bind(_this) }),
        faceContainer: React.createElement(FaceContainer, { container: _this.getActive.bind(_this), breakLock: _this.breakLock.bind(_this) }),
        faceItem: React.createElement(FaceItem, { result: _this.getActive.bind(_this), player: _this.getPlayer.bind(_this), equipPlayer: _this.equipItem.bind(_this, _this.getPlayer.bind(_this)), equipCompanion: _this.equipItem.bind(_this, _this.getCompanion.bind(_this)) }),
        finishedContainer: React.createElement(FinishedContainer, { status: _this.getActive.bind(_this), returnToStart: _this.returnToStart.bind(_this) }),
        faceNPC: React.createElement(FaceNPC, { npc: _this.getActive.bind(_this), next: _this.talk.bind(_this), returnToStart: _this.returnToStart.bind(_this) }),
        finishedConversation: React.createElement(FinishedConversation, { result: _this.getActive.bind(_this), startBattle: _this.startBattle.bind(_this), returnToStart: _this.returnToStart.bind(_this) })
      };
      _this.state = {
        currentScreen: React.createElement(NextTurnButton, { startTurn: _this.startTurn.bind(_this) }),
        game: new Game(),
        player: new Player(props.player, _this.weapons, _this.armors),
        active: {},
        className: 'setupScreen'
      };
      return _this;
    }

    _createClass(GameWindow, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        setTimeout(function () {
          _this2.setState({ className: 'gameScreen' });
        }, 0);
        setTimeout(function () {
          // Add and remove 'hidden' to avoid overflow blinking
          _this2.gameEl.classList.add('fit-the-window');
          _this2.gameEl.classList.remove('hidden');
        }, 600);
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        this.checkCompanion();
      }
    }, {
      key: 'startTurn',
      value: function startTurn() {
        var nextAction = startNextTurn(this);
        this.state.active = nextAction;
        if (nextAction instanceof Enemy) {
          this.setState({ currentScreen: this.screens.faceEnemy });
        }
        if (nextAction instanceof Container) {
          this.setState({ currentScreen: this.screens.faceContainer });
        }
        if (nextAction instanceof NPC) {
          this.setState({ currentScreen: this.screens.faceNPC });
        }
      }
    }, {
      key: 'getActive',
      value: function getActive() {
        return this.state.active;
      }
    }, {
      key: 'getPlayer',
      value: function getPlayer() {
        return this.state.player;
      }
    }, {
      key: 'getCompanion',
      value: function getCompanion() {
        return this.state.player.companion;
      }
    }, {
      key: 'escape',
      value: function escape() {
        if (this.state.player.escape()) {
          this.setState({ currentScreen: this.screens.escaped });
        } else {
          this.startBattle('notescaped');
        }
      }
    }, {
      key: 'startBattle',
      value: function startBattle() {
        var fromEscape = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

        var battleResults = battle(this.state.player, this.state.active);
        this.setState({ active: {
            winner: battleResults.winner,
            log: battleResults.log,
            fullLog: battleResults.fullLog,
            escaped: fromEscape
          } });
        this.setState({ currentScreen: this.screens.battleOver });
      }
    }, {
      key: 'levelUp',
      value: function levelUp() {
        this.setState({ currentScreen: this.screens.levelUp });
      }
    }, {
      key: 'trackValue',
      value: function trackValue(event) {
        this.statUpgrade = event.target.value;
      }
    }, {
      key: 'getStat',
      value: function getStat() {
        return this.statUpgrade;
      }
    }, {
      key: 'raiseStat',
      value: function raiseStat() {
        this.state.player.levelup(this.statUpgrade);
        this.state.active = '';
        this.setState({ currentScreen: this.screens.nextTurn });
      }
    }, {
      key: 'breakLock',
      value: function breakLock() {
        var result = this.state.player.breakAnyLock(this.state.active);
        this.state.active = result;
        if (typeof result === 'string') {
          this.setState({ currentScreen: this.screens.finishedContainer });
        } else {
          this.setState({ currentScreen: this.screens.faceItem });
        }
      }
    }, {
      key: 'equipItem',
      value: function equipItem(target) {
        var result = this.state.player.equip(this.state.active.item, target());
        this.state.active = result;
        this.setState({ currentScreen: this.screens.finishedContainer });
      }
    }, {
      key: 'talk',
      value: function talk(goal, forced) {
        var result = this.state.player.talk(this.state.active, goal, forced);
        if (typeof result !== "string") {
          this.state.active = result;
          if (result.item) {
            this.setState({ currentScreen: this.screens.faceItem });
            return;
          }
        }
        this.setState({ currentScreen: this.screens.finishedConversation });
      }
    }, {
      key: 'returnToStart',
      value: function returnToStart() {
        this.state.active = '';
        this.setState({ currentScreen: this.screens.nextTurn });
      }
    }, {
      key: 'checkCompanion',
      value: function checkCompanion() {
        if (this.state.player.companion && this.state.player.companion.dead) {
          this.state.player.companion = undefined;
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        return React.createElement(
          'div',
          { className: this.state.className },
          React.createElement(
            'div',
            { ref: function ref(element) {
                return _this3.gameEl = element;
              }, className: 'hidden' },
            React.createElement(
              GameFlowWindow,
              null,
              this.state.currentScreen
            ),
            React.createElement(PlayerWindow, { player: this.state.player }),
            React.createElement(LogWindow, { content: this.state.active.fullLog || null })
          )
        );
      }
    }]);

    return GameWindow;
  }(React.Component);

  var GameFlowWindow = function GameFlowWindow(_ref) {
    var children = _ref.children;

    return React.createElement(
      'div',
      { className: 'game-flow-window' },
      children
    );
  };

  var NextTurnButton = function NextTurnButton(_ref2) {
    var startTurn = _ref2.startTurn;

    return React.createElement(
      'div',
      { className: 'image-screen' },
      React.createElement(
        'h3',
        null,
        'There is a shack in front of you.'
      ),
      React.createElement('img', { className: 'image', src: 'img/shack.jpg', alt: 'shack' }),
      React.createElement(
        'div',
        { className: 'btn-wrapper' },
        React.createElement(
          'button',
          { className: 'next-turn-button', onClick: startTurn },
          'Step in'
        )
      )
    );
  };

  var PlayerWindow = function PlayerWindow(_ref3) {
    var player = _ref3.player;

    return React.createElement(
      'div',
      { className: 'player-window' },
      React.createElement(
        'div',
        { className: 'title' },
        React.createElement(
          'h1',
          null,
          player.name
        ),
        React.createElement(
          'h3',
          null,
          'level: ',
          player.level
        )
      ),
      React.createElement(
        'div',
        { className: 'status' },
        React.createElement(
          'h2',
          null,
          'HP: ',
          player.hp,
          ' / ',
          player.maxHp
        ),
        React.createElement(
          'h2',
          null,
          'AP: ',
          player.ap,
          ' / ',
          player.maxAp
        )
      ),
      React.createElement(
        'div',
        { className: 'items' },
        React.createElement(
          'p',
          null,
          'Weapon demage: ',
          player.weapon.demage
        ),
        React.createElement(
          'p',
          null,
          'Armor defence: ',
          player.armor.defence
        )
      ),
      React.createElement(
        'div',
        { className: 'stats' },
        React.createElement(
          'p',
          null,
          'strength: ',
          player.str
        ),
        React.createElement(
          'p',
          null,
          'dexterity: ',
          player.dex
        ),
        React.createElement(
          'p',
          null,
          'intellect: ',
          player.int
        ),
        React.createElement(
          'p',
          null,
          'luck: ',
          player.luc
        )
      ),
      React.createElement(Companion, { companion: player.companion })
    );
  };

  var Companion = function Companion(_ref4) {
    var companion = _ref4.companion;

    if (!companion) {
      return React.createElement(
        'div',
        { className: 'companion' },
        React.createElement(
          'h3',
          null,
          'Companion: none'
        )
      );
    }
    return React.createElement(
      'div',
      { className: 'companion' },
      React.createElement(
        'h3',
        null,
        'Companion: ',
        companion.name,
        ' (level ',
        companion.level,
        ')'
      ),
      React.createElement(
        'div',
        { className: 'status' },
        React.createElement(
          'h3',
          null,
          'HP: ',
          companion.hp,
          '/',
          companion.maxHp
        ),
        React.createElement(
          'h3',
          null,
          'AP: ',
          companion.ap,
          '/',
          companion.maxAp
        )
      ),
      React.createElement(
        'div',
        { className: 'status' },
        React.createElement(
          'h4',
          null,
          'Weapon demage: ',
          companion.weapon.demage
        ),
        React.createElement(
          'h4',
          null,
          'Armor defence: ',
          companion.armor.defence
        )
      ),
      React.createElement(
        'h3',
        null,
        'STATS:'
      ),
      React.createElement(
        'h4',
        null,
        'STR:',
        companion.str,
        ' DEX:',
        companion.dex,
        ' INT:',
        companion.int
      )
    );
  };

  var LogWindow = function LogWindow(_ref5) {
    var content = _ref5.content;

    return React.createElement(
      'div',
      { className: 'log-window' },
      React.createElement(
        'h4',
        null,
        'Battle log'
      ),
      React.createElement(
        'div',
        null,
        content === null ? null : content.map(function (line, index) {
          return React.createElement(
            'p',
            { key: index },
            line
          );
        })
      )
    );
  };

  var GameScreen = function GameScreen(_ref6) {
    var character = _ref6.character;

    return React.createElement(
      'div',
      { className: 'fullscreen' },
      React.createElement(GameTitle, { appliedClass: 'clickedTitle' }),
      React.createElement(GameWindow, { player: character })
    );
  };

  var gameWindow = {
    GameWindow: GameWindow,
    GameFlowWindow: GameFlowWindow,
    NextTurnButton: NextTurnButton,
    FaceEnemy: FaceEnemy,
    Escaped: Escaped,
    BattleOver: BattleOver,
    LevelUp: LevelUp,
    FaceContainer: FaceContainer,
    FaceItem: FaceItem,
    FinishedContainer: FinishedContainer,
    FaceNPC: FaceNPC,
    Conversation: Conversation,
    FinishedConversation: FinishedConversation,
    PlayerWindow: PlayerWindow,
    Companion: Companion,
    LogWindow: LogWindow,
    GameScreen: GameScreen
  };

  return gameWindow;
});