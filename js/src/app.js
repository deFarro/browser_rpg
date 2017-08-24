'use strict';

requirejs.config({
  baseUlr: 'js/',
  paths: {
    react: '../node_modules/react/dist/react.min',
    react_dom: '../node_modules/react-dom/dist/react-dom.min',
    redux: '../node_modules/redux/dist/redux.min',
    react_redux: '../node_modules/react-redux/dist/react-redux.min'
  }
});

requirejs(['react', 'react_dom', 'redux', 'react_redux', './reducers/setup_reducer', 'setup_window', 'game_window', 'game'], function(React, ReactDOM, Redux, ReactRedux, setup, setupWindow, gameWindow) {

const {
    SetupWindow,
    NameField,
    StatField,
    CreateCharButton
  } = setupWindow;

  const {
    GameWindow,
    GameFlowWindow,
    NextTurnButton,
    FaceEnemy,
    Escaped,
    BattleOver,
    LevelUp,
    FaceContainer,
    FaceItem,
    FinishedContainer,
    FaceNPC,
    Conversation,
    FinishedConversation,
    PlayerWindow,
    Companion,
    LogWindow,
    GameScreen
  } = gameWindow;

  const {createStore} = Redux;

  const {Provider} = ReactRedux;

  const store = createStore(setup, window.devToolsExtension && window.devToolsExtension());

  class MainWindow extends React.Component {
    constructor() {
      super();
      this.state = {
        visible: 'titleScreen',
        title: 'gameTitle'
      };
    }
    switchToSetup() {
      this.setState({title: 'clickedTitle'});
      this.setState({visible: 'setupScreen'});
    }
    switchToGameScreen(player) {
      this.setState({character: player});
      this.setState({visible: 'gameScreen'});
    }
    render() {
      let currentScreen;
      if (this.state.visible === 'titleScreen') {
        currentScreen = <StartButton clickHandler={this.switchToSetup.bind(this)}/>;
      }
      else if (this.state.visible === 'setupScreen') {
        currentScreen = (
          <Provider store={store}>
            <SetupWindow doNext={this.switchToGameScreen.bind(this)}/>
          </Provider>
        );
      }
      else if (this.state.visible === 'gameScreen') {
        currentScreen = <GameScreen character={this.state.character} />;
      }
      return (
        <div className="game">
          <GameTitle appliedClass={this.state.title} />
          {currentScreen}
        </div>
      )
    }
  }

  const GameTitle = ({appliedClass}) => {
    return (
      <div className="title-wrapper">
        <h1 className={appliedClass}>Future In The Past</h1>
      </div>
    )
  }

  const StartButton = ({clickHandler}) => {
    return <p className="startButton" onClick={clickHandler}>START ADVENTURES</p>
  }

  ReactDOM.render(<MainWindow />, document.getElementById('root'));
});
