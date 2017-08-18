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
    GameTitle,
    SetupWindow,
    NameField,
    StatField,
    CreateCharButton,
    SetupScreen
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
      this.state = {visible: 'titleScreen'};
    }
    switchToSetup() {
      this.setState({visible: 'setupScreen'});
    }
    switchToGameScreen(player) {
      this.setState({character: player});
      this.setState({visible: 'gameScreen'});
    }
    render() {
      if (this.state.visible === 'titleScreen') {
        return <TitleScreen clickHandler={this.switchToSetup.bind(this)}/>
      }
      else if (this.state.visible === 'setupScreen') {
        return <SetupScreen switchToGame={this.switchToGameScreen.bind(this)}/>
      }
      else if (this.state.visible === 'gameScreen') {
        return <GameScreen character={this.state.character} />
      }
    }
  }

  const StartButton = ({clickHandler}) => {
    return <p className="startButton" onClick={clickHandler}>START ADVENTURES</p>
  }

  const TitleScreen = ({clickHandler}) => {
    return (
      <div>
        <GameTitle appliedClass="gameTitle"/>
        <StartButton clickHandler={clickHandler} />
      </div>
    )
  }

  ReactDOM.render(<MainWindow />, document.getElementById('root'));
});
