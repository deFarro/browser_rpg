'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

requirejs.config({
  baseUlr: 'js/',
  paths: {
    react: '../node_modules/react/dist/react.min',
    react_dom: '../node_modules/react-dom/dist/react-dom.min',
    redux: '../node_modules/redux/dist/redux.min',
    react_redux: '../node_modules/react-redux/dist/react-redux.min'
  }
});

requirejs(['react', 'react_dom', 'redux', 'react_redux', './reducers/setup_reducer', 'setup_window', 'game_window', 'game'], function (React, ReactDOM, Redux, ReactRedux, setup, setupWindow, gameWindow) {
  var SetupWindow = setupWindow.SetupWindow,
      NameField = setupWindow.NameField,
      StatField = setupWindow.StatField,
      CreateCharButton = setupWindow.CreateCharButton;
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
  var createStore = Redux.createStore;
  var Provider = ReactRedux.Provider;


  var store = createStore(setup, window.devToolsExtension && window.devToolsExtension());

  var MainWindow = function (_React$Component) {
    _inherits(MainWindow, _React$Component);

    function MainWindow() {
      _classCallCheck(this, MainWindow);

      var _this = _possibleConstructorReturn(this, (MainWindow.__proto__ || Object.getPrototypeOf(MainWindow)).call(this));

      _this.state = {
        visible: 'titleScreen',
        title: 'gameTitle'
      };
      return _this;
    }

    _createClass(MainWindow, [{
      key: 'switchToSetup',
      value: function switchToSetup() {
        this.setState({ title: 'clickedTitle' });
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
        var currentScreen = void 0;
        if (this.state.visible === 'titleScreen') {
          currentScreen = React.createElement(StartButton, { clickHandler: this.switchToSetup.bind(this) });
        } else if (this.state.visible === 'setupScreen') {
          currentScreen = React.createElement(
            Provider,
            { store: store },
            React.createElement(SetupWindow, { doNext: this.switchToGameScreen.bind(this) })
          );
        } else if (this.state.visible === 'gameScreen') {
          currentScreen = React.createElement(GameScreen, { character: this.state.character });
        }
        return React.createElement(
          'div',
          { className: 'game' },
          React.createElement(GameTitle, { appliedClass: this.state.title }),
          currentScreen
        );
      }
    }]);

    return MainWindow;
  }(React.Component);

  var GameTitle = function GameTitle(_ref) {
    var appliedClass = _ref.appliedClass;

    return React.createElement(
      'div',
      { className: 'title-wrapper' },
      React.createElement(
        'h1',
        { className: appliedClass },
        'Future In The Past'
      )
    );
  };

  var StartButton = function StartButton(_ref2) {
    var clickHandler = _ref2.clickHandler;

    return React.createElement(
      'p',
      { className: 'startButton', onClick: clickHandler },
      'START ADVENTURES'
    );
  };

  ReactDOM.render(React.createElement(MainWindow, null), document.getElementById('root'));
});