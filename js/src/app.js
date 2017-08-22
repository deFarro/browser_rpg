'use strict';

requirejs.config({
  baseUlr: 'js/',
  paths: {
    react: 'lib/react',
    react_dom: 'lib/react-dom'
  }
});

requirejs(['react', 'react_dom', 'setup_window', 'game_window', 'game'], function(React, ReactDOM, setupWindow, gameWindow) {

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
        currentScreen = <SetupWindow doNext={this.switchToGameScreen.bind(this)}/>;
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
