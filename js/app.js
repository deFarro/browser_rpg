'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

requirejs.config({
  baseUlr: 'js/',
  paths: {
    react: 'lib/react',
    react_dom: 'lib/react-dom'
  }
});

requirejs(['react', 'react_dom', 'game'], function (React, ReactDOM) {
  var MainWindow = function (_React$Component) {
    _inherits(MainWindow, _React$Component);

    function MainWindow() {
      _classCallCheck(this, MainWindow);

      var _this = _possibleConstructorReturn(this, (MainWindow.__proto__ || Object.getPrototypeOf(MainWindow)).call(this));

      _this.state = { visible: 'titleScreen' };
      return _this;
    }

    _createClass(MainWindow, [{
      key: 'switchToSetup',
      value: function switchToSetup() {
        this.setState({ visible: 'setupScreen' });
      }
    }, {
      key: 'switchToGameScreen',
      value: function switchToGameScreen(player) {
        this.setState({ character: player });
        this.setState({ visible: 'gameScreen' });
      }
    }, {
      key: 'render',
      value: function render() {
        if (this.state.visible === 'titleScreen') {
          return React.createElement(TitleScreen, { clickHandler: this.switchToSetup.bind(this) });
        } else if (this.state.visible === 'setupScreen') {
          return React.createElement(SetupScreen, { switchToGame: this.switchToGameScreen.bind(this) });
        } else if (this.state.visible === 'gameScreen') {
          return React.createElement(GameScreen, { character: this.state.character });
        }
      }
    }]);

    return MainWindow;
  }(React.Component);

  var GameTitle = function (_React$Component2) {
    _inherits(GameTitle, _React$Component2);

    function GameTitle(props) {
      _classCallCheck(this, GameTitle);

      var _this2 = _possibleConstructorReturn(this, (GameTitle.__proto__ || Object.getPrototypeOf(GameTitle)).call(this));

      _this2.state = {
        animate: props["data-animate"],
        className: props.appliedClass
      };
      return _this2;
    }

    _createClass(GameTitle, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this3 = this;

        if (this.state.animate) {
          setTimeout(function () {
            _this3.setState({ className: 'clickedTitle' });
          }, 0);
        }
      }
    }, {
      key: 'render',
      value: function render() {
        return React.createElement(
          'div',
          { className: 'title-wrapper' },
          React.createElement(
            'h1',
            { className: this.state.className },
            'Future In The Past'
          )
        );
      }
    }]);

    return GameTitle;
  }(React.Component);

  var StartButton = function StartButton(_ref) {
    var clickHandler = _ref.clickHandler;

    return React.createElement(
      'p',
      { className: 'startButton', onClick: clickHandler },
      'START ADVENTURES'
    );
  };

  var TitleScreen = function TitleScreen(_ref2) {
    var clickHandler = _ref2.clickHandler;

    return React.createElement(
      'div',
      null,
      React.createElement(GameTitle, { appliedClass: 'gameTitle' }),
      React.createElement(StartButton, { clickHandler: clickHandler })
    );
  };

  var SetupWindow = function (_React$Component3) {
    _inherits(SetupWindow, _React$Component3);

    function SetupWindow(props) {
      _classCallCheck(this, SetupWindow);

      var _this4 = _possibleConstructorReturn(this, (SetupWindow.__proto__ || Object.getPrototypeOf(SetupWindow)).call(this));

      _this4.switchToGame = props.doNext;
      _this4.state = {
        statsRemain: 0,
        name: 'Jack',
        // To add/remove stat to the setup form just change these two following arrays
        stats: [20, 20, 20, 0],
        statNames: ['strength', 'dexterity', 'intellect', 'luck'],
        className: 'startButton'
      };
      return _this4;
    }

    _createClass(SetupWindow, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this5 = this;

        setTimeout(function () {
          _this5.setState({ className: 'setupScreen' });
          // Add and remove 'hidden' to avoid overflow blinking
          _this5.formEl.classList.remove('hidden');
        }, 0);
      }
    }, {
      key: 'enterName',
      value: function enterName(event) {
        var cName = event.target.value;
        // Only numbers, spaces, underscores and english letters are eligible
        if (/^[\w ]{0,20}$/.test(cName)) {
          this.setState({ name: cName });
        } else {
          return;
        }
      }
      //chooseGender(event) {}

    }, {
      key: 'plus',
      value: function plus(index) {
        if (this.state.statsRemain === 0) {
          return;
        }
        var statList = this.state.stats;
        statList[index]++;
        this.setState({ statsRemain: this.state.statsRemain - 1, stats: statList });
      }
    }, {
      key: 'minus',
      value: function minus(index) {
        if (this.state.stats[index] === 0) {
          return;
        }
        var statList = this.state.stats;
        statList[index]--;
        this.setState({ statsRemain: this.state.statsRemain + 1, stats: statList });
      }
    }, {
      key: 'checkIfReady',
      value: function checkIfReady() {
        if (this.state.statsRemain === 0 && this.state.name) {
          this.createButton.classList.remove('hidden');
        } else {
          this.createButton.classList.add('hidden');
        }
      }
    }, {
      key: 'handleSubmit',
      value: function handleSubmit(event) {
        event.preventDefault();
        var character = { 'name': this.state.name, 'stats': this.state.stats };
        this.switchToGame(character);
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        this.checkIfReady();
      }
    }, {
      key: 'render',
      value: function render() {
        var _this6 = this;

        var fieldSet = this.state.statNames.map(function (stat, i) {
          return React.createElement(StatField, { key: i, title: stat, plus: _this6.plus.bind(_this6, i), minus: _this6.minus.bind(_this6, i), value: _this6.state.stats[i] });
        });

        return React.createElement(
          'div',
          { className: this.state.className },
          React.createElement(
            'p',
            null,
            'SETUP YOUR CHARACTER'
          ),
          React.createElement(
            'form',
            { ref: function ref(element) {
                return _this6.formEl = element;
              }, className: 'hidden' },
            React.createElement(NameField, { onChange: this.enterName.bind(this), value: this.state.name }),
            fieldSet,
            React.createElement(
              'p',
              { className: 'remain-stats' },
              'STATS REMAIN: ',
              this.state.statsRemain
            )
          ),
          React.createElement(CreateCharButton, { onClick: this.handleSubmit.bind(this), controlView: function controlView(element) {
              return _this6.createButton = element;
            } })
        );
      }
    }]);

    return SetupWindow;
  }(React.Component);

  var NameField = function NameField(_ref3) {
    var onChange = _ref3.onChange,
        value = _ref3.value;

    return React.createElement(
      'div',
      null,
      React.createElement('input', { className: 'name-field', type: 'text', placeholder: 'Name', onChange: onChange, value: value })
    );
  };

  // Feature not yet finalazed
  var GenderField = function GenderField() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'label',
        null,
        'male',
        React.createElement('input', { className: 'gender-field', type: 'radio', name: 'gender', value: 'male', defaultChecked: true })
      ),
      React.createElement(
        'label',
        null,
        'female',
        React.createElement('input', { className: 'gender-field', type: 'radio', name: 'gender', value: 'female' })
      )
    );
  };

  var StatField = function StatField(props) {
    var title = props.title,
        plus = props.plus,
        minus = props.minus,
        value = props.value;

    return React.createElement(
      'div',
      { className: 'stat-field', onMouseDown: function onMouseDown(event) {
          return event.preventDefault();
        } },
      React.createElement(
        'span',
        null,
        title,
        ':'
      ),
      React.createElement(
        'span',
        null,
        React.createElement(
          'i',
          { className: 'minus', onClick: minus },
          '-'
        ),
        React.createElement('input', { type: 'text', value: value, disabled: true }),
        React.createElement(
          'i',
          { className: 'plus', onClick: plus },
          '+'
        )
      )
    );
  };

  var CreateCharButton = function CreateCharButton(_ref4) {
    var onClick = _ref4.onClick,
        controlView = _ref4.controlView;

    return React.createElement(
      'button',
      { className: 'create-char-button hidden', ref: controlView, onClick: onClick },
      'Create character'
    );
  };

  var SetupScreen = function SetupScreen(_ref5) {
    var switchToGame = _ref5.switchToGame;

    return React.createElement(
      'div',
      null,
      React.createElement(GameTitle, { appliedClass: 'gameTitle', 'data-animate': true }),
      React.createElement(SetupWindow, { doNext: switchToGame })
    );
  };

  var GameWindow = function (_React$Component4) {
    _inherits(GameWindow, _React$Component4);

    function GameWindow(props) {
      _classCallCheck(this, GameWindow);

      var _this7 = _possibleConstructorReturn(this, (GameWindow.__proto__ || Object.getPrototypeOf(GameWindow)).call(this, props));

      _this7.playerStats = props;
      _this7.weapons = makeWeaponsArray(15);
      _this7.armors = makeArmorsArray(15);
      _this7.screens = {
        nextTurn: React.createElement(NextTurnButton, { startTurn: _this7.startTurn.bind(_this7) }),
        faceEnemy: React.createElement(FaceEnemy, { enemy: _this7.getActive.bind(_this7), startBattle: _this7.startBattle.bind(_this7), escape: _this7.escape.bind(_this7) }),
        escaped: React.createElement(Escaped, { returnToStart: _this7.returnToStart.bind(_this7) }),
        battleOver: React.createElement(BattleOver, { results: _this7.getActive.bind(_this7), player: _this7.getPlayer.bind(_this7), startTurn: _this7.startTurn.bind(_this7), levelUp: _this7.levelUp.bind(_this7) }),
        levelUp: React.createElement(LevelUp, { raise: _this7.raiseStat.bind(_this7), trackValue: _this7.trackValue.bind(_this7), getStat: _this7.getStat.bind(_this7) }),
        faceContainer: React.createElement(FaceContainer, { container: _this7.getActive.bind(_this7), breakLock: _this7.breakLock.bind(_this7) })
      };
      _this7.state = {
        currentScreen: React.createElement(NextTurnButton, { startTurn: _this7.startTurn.bind(_this7) }),
        game: new Game(),
        player: new Player(props.player, _this7.weapons, _this7.armors),
        active: {},
        className: 'setupScreen'
      };
      return _this7;
    }

    _createClass(GameWindow, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this8 = this;

        setTimeout(function () {
          _this8.setState({ className: 'gameScreen' });
        }, 0);
        setTimeout(function () {
          // Add and remove 'hidden' to avoid overflow blinking
          _this8.gameEl.classList.add('fit-the-window');
          _this8.gameEl.classList.remove('hidden');
        }, 600);
      }
    }, {
      key: 'startTurn',
      value: function startTurn() {
        var nextAction = startNextTurn(this);
        console.log(nextAction);
        this.state.active = nextAction;
        if (nextAction instanceof Enemy) {
          this.setState({ currentScreen: this.screens.faceEnemy });
        }
        if (nextAction instanceof Container) {
          this.setState({ currentScreen: this.screens.faceContainer });
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
        this.setState({ currentScreen: this.screens.nextTurn });
      }
    }, {
      key: 'breakLock',
      value: function breakLock() {
        this.state.player.breakAnyLock(this.state.active);
        console.log(this.state.player.weapon);
        console.log(this.state.player.armor);
        this.forceUpdate();
      }
    }, {
      key: 'returnToStart',
      value: function returnToStart() {
        this.setState({ currentScreen: this.screens.nextTurn });
      }
    }, {
      key: 'render',
      value: function render() {
        var _this9 = this;

        return React.createElement(
          'div',
          { className: this.state.className },
          React.createElement(
            'div',
            { ref: function ref(element) {
                return _this9.gameEl = element;
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

  var GameFlowWindow = function GameFlowWindow(_ref6) {
    var children = _ref6.children;

    return React.createElement(
      'div',
      { className: 'game-flow-window' },
      children
    );
  };

  var NextTurnButton = function NextTurnButton(_ref7) {
    var startTurn = _ref7.startTurn;

    return React.createElement(
      'div',
      { className: 'image-screen' },
      React.createElement(
        'h3',
        null,
        'There is a shack in front of you'
      ),
      React.createElement('img', { className: 'image', src: '../img/shack.jpg', alt: 'shack' }),
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

  var FaceEnemy = function FaceEnemy(_ref8) {
    var enemy = _ref8.enemy,
        startBattle = _ref8.startBattle,
        escape = _ref8.escape;

    var currentEnemy = enemy();
    return React.createElement(
      'div',
      { className: 'image-screen' },
      React.createElement(
        'h3',
        null,
        'Enemy on your way: ',
        currentEnemy.name,
        ' (level: ',
        currentEnemy.level,
        ')'
      ),
      React.createElement('img', { className: 'image', src: '../img/robot.jpg', alt: 'robot' }),
      React.createElement(
        'h4',
        null,
        'Will you fight?'
      ),
      React.createElement(
        'div',
        { className: 'btn-wrapper' },
        React.createElement(
          'button',
          { className: 'btn', onClick: startBattle },
          'Fight'
        ),
        React.createElement(
          'button',
          { className: 'btn', onClick: escape },
          'Escape'
        )
      )
    );
  };

  var Escaped = function Escaped(_ref9) {
    var returnToStart = _ref9.returnToStart;

    return React.createElement(
      'div',
      null,
      React.createElement(
        'h3',
        null,
        'You have escaped successfully'
      ),
      React.createElement(
        'div',
        { className: 'btn-wrapper' },
        React.createElement(
          'button',
          { className: 'next-turn-button', onClick: returnToStart },
          'Next turn'
        )
      )
    );
  };

  var BattleOver = function BattleOver(_ref10) {
    var results = _ref10.results,
        player = _ref10.player,
        startTurn = _ref10.startTurn,
        levelUp = _ref10.levelUp;

    var battleResults = results();
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h3',
        { className: 'underline' },
        battleResults.escaped === 'notescaped' ? 'Escape failed' : null
      ),
      React.createElement(
        'h4',
        null,
        'The battle is over'
      ),
      React.createElement(
        'h3',
        null,
        battleResults.winner.name,
        ' won!'
      ),
      React.createElement(
        'h4',
        { className: 'underline' },
        'Battle results:'
      ),
      React.createElement(
        'h4',
        null,
        battleResults.log
      ),
      React.createElement(
        'div',
        { className: 'btn-wrapper' },
        React.createElement(
          'button',
          { className: 'next-turn-button', onClick: battleResults.winner === player() ? levelUp : startTurn },
          battleResults.winner === player() ? 'Level up' : 'Next turn'
        )
      )
    );
  };

  var LevelUp = function LevelUp(_ref11) {
    var raise = _ref11.raise,
        trackValue = _ref11.trackValue,
        getStat = _ref11.getStat;

    return React.createElement(
      'div',
      null,
      React.createElement(
        'h3',
        null,
        'You have got a new level'
      ),
      React.createElement(
        'h4',
        null,
        'Which stat would you like to raise?'
      ),
      React.createElement(
        'select',
        { className: 'level-up-stat', defaultValue: getStat(), onChange: trackValue },
        React.createElement(
          'option',
          { value: 'str' },
          'strength'
        ),
        React.createElement(
          'option',
          { value: 'dex' },
          'dexterity'
        ),
        React.createElement(
          'option',
          { value: 'int' },
          'intellect'
        ),
        React.createElement(
          'option',
          { value: 'luc' },
          'luck'
        )
      ),
      React.createElement(
        'div',
        { className: 'btn-wrapper' },
        React.createElement(
          'button',
          { className: 'btn', onClick: raise },
          'Confirm'
        )
      )
    );
  };

  var FaceContainer = function FaceContainer(_ref12) {
    var container = _ref12.container,
        breakLock = _ref12.breakLock;

    var currentContainer = container();
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h3',
        null,
        'You have found a safe'
      ),
      React.createElement(
        'h4',
        null,
        '(lock level: ',
        currentContainer.lock.level,
        ')'
      ),
      React.createElement(
        'h4',
        null,
        'Lock seems to be ',
        currentContainer.lock.electric === 1 ? 'electronic' : 'mechanic'
      ),
      React.createElement(
        'div',
        { className: 'btn-wrapper' },
        React.createElement(
          'button',
          { className: 'btn', onClick: breakLock },
          currentContainer.lock.electric === 1 ? 'Try to hack' : 'Try to lockpick'
        )
      )
    );
  };

  var FaceNPC = function FaceNPC() {};

  var PlayerWindow = function PlayerWindow(_ref13) {
    var player = _ref13.player;

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
          player.hp
        ),
        React.createElement(
          'h2',
          null,
          'AP: ',
          player.ap
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

  var Companion = function Companion(_ref14) {
    var companion = _ref14.companion;

    return React.createElement(
      'div',
      { className: 'companion' },
      React.createElement(
        'h3',
        null,
        'Companion: ',
        companion ? companion.name : "none"
      )
    );
  };

  var LogWindow = function LogWindow(_ref15) {
    var content = _ref15.content;

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

  var GameScreen = function GameScreen(_ref16) {
    var character = _ref16.character;

    return React.createElement(
      'div',
      { className: 'fullscreen' },
      React.createElement(GameTitle, { appliedClass: 'clickedTitle' }),
      React.createElement(GameWindow, { player: character })
    );
  };

  ReactDOM.render(React.createElement(MainWindow, null), document.getElementById('root'));
});