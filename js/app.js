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

requirejs(['react', 'react_dom', 'setup_window', 'game_window', 'game'], function (React, ReactDOM, setupWindow, gameWindow) {
  var GameTitle = setupWindow.GameTitle,
      SetupWindow = setupWindow.SetupWindow,
      NameField = setupWindow.NameField,
      StatField = setupWindow.StatField,
      CreateCharButton = setupWindow.CreateCharButton,
      SetupScreen = setupWindow.SetupScreen;
  var GameWindow = gameWindow.GameWindow,
      GameFlowWindow = gameWindow.GameFlowWindow,
      NextTurnButton = gameWindow.NextTurnButton,
      FaceEnemy = gameWindow.FaceEnemy,
      Escaped = gameWindow.Escaped,
      BattleOver = gameWindow.BattleOver,
      LevelUp = gameWindow.LevelUp,
      FaceContainer = gameWindow.FaceContainer,
      FaceItem = gameWindow.FaceItem,
      FinishedContainer = gameWindow.FinishedContainer,
      FaceNPC = gameWindow.FaceNPC,
      Conversation = gameWindow.Conversation,
      FinishedConversation = gameWindow.FinishedConversation,
      PlayerWindow = gameWindow.PlayerWindow,
      Companion = gameWindow.Companion,
      LogWindow = gameWindow.LogWindow,
      GameScreen = gameWindow.GameScreen;

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

  ReactDOM.render(React.createElement(MainWindow, null), document.getElementById('root'));
});