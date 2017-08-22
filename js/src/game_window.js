define(['react', 'game_window_fight', 'game_window_container', 'game_window_npc', 'game'], function (React, fight, container, npc) {

  const {
    FaceEnemy,
    Escaped,
    BattleOver,
    LevelUp
  } = fight;

  const {
    FaceContainer,
    FaceItem,
    FinishedContainer
  } = container;

  const {
    FaceNPC,
    Conversation,
    FinishedConversation
  } = npc;

  class GameWindow extends React.Component {
    constructor(props) {
      super(props);
      this.playerStats = props;
      this.weapons = makeWeaponsArray(25);
      this.armors = makeArmorsArray(25);
      this.statUpgrade = 'str';
      this.screens = {
        nextTurn: <NextTurnButton startTurn={this.startTurn.bind(this)} />,
        faceEnemy: <FaceEnemy enemy={this.getActive.bind(this)} startBattle={this.startBattle.bind(this)} escape={this.escape.bind(this)}/>,
        escaped: <Escaped returnToStart={this.returnToStart.bind(this)} />,
        battleOver: <BattleOver results={this.getActive.bind(this)} player={this.getPlayer.bind(this)} returnToStart={this.returnToStart.bind(this)} levelUp={this.levelUp.bind(this)} />,
        levelUp: <LevelUp raise={this.raiseStat.bind(this)} trackValue={this.trackValue.bind(this)} getStat={this.getStat.bind(this)} />,
        faceContainer: <FaceContainer container={this.getActive.bind(this)} breakLock={this.breakLock.bind(this)} />,
        faceItem: <FaceItem result={this.getActive.bind(this)} player={this.getPlayer.bind(this)} equipPlayer={this.equipItem.bind(this, this.getPlayer.bind(this))} equipCompanion={this.equipItem.bind(this, this.getCompanion.bind(this))} />,
        finishedContainer: <FinishedContainer status={this.getActive.bind(this)} returnToStart={this.returnToStart.bind(this)} />,
        faceNPC: <FaceNPC npc={this.getActive.bind(this)} next={this.talk.bind(this)} returnToStart={this.returnToStart.bind(this)} />,
        finishedConversation: <FinishedConversation result={this.getActive.bind(this)} startBattle={this.startBattle.bind(this)} returnToStart={this.returnToStart.bind(this)} />,
        gameOver: <GameOver />
      };
      this.state = {
      currentScreen: <NextTurnButton startTurn={this.startTurn.bind(this)} />,
      game: new Game(),
      player: new Player(props.player, this.weapons, this.armors),
      active: {},
      className: 'setupScreen'
      };
    }
    componentDidMount() {
      setTimeout(() => {
        this.setState({className: 'gameScreen'});
      }, 0);
      setTimeout(() => {
        // Add and remove 'hidden' to avoid overflow blinking
        this.gameEl.classList.add('fit-the-window');
        this.gameEl.classList.remove('hidden');
      }, 600);
    }
    componentDidUpdate() {
      this.checkCompanion();
      this.checkLevel();
    }
    startTurn() {
      const nextAction = startNextTurn(this);
      this.state.active = nextAction;
      if (nextAction instanceof Enemy) {
        this.setState({currentScreen: this.screens.faceEnemy})
      }
      if (nextAction instanceof Container) {
        this.setState({currentScreen: this.screens.faceContainer})
      }
      if (nextAction instanceof NPC) {
        this.setState({currentScreen: this.screens.faceNPC})
      }
    }
    getActive() {
      return this.state.active;
    }
    getPlayer() {
      return this.state.player;
    }
    getCompanion() {
      return this.state.player.companion;
    }
    escape() {
      if (this.state.player.escape()) {
        this.setState({currentScreen: this.screens.escaped});
      }
      else {
        this.startBattle('notescaped');
      }
    }
    startBattle(fromEscape = "") {
      const battleResults = battle(this.state.player, this.state.active);
      this.setState({active: {
        winner: battleResults.winner,
        log: battleResults.log,
        fullLog: battleResults.fullLog,
        escaped: fromEscape
      }});
      this.setState({currentScreen: this.screens.battleOver});
    }
    levelUp() {
      this.setState({currentScreen: this.screens.levelUp});
    }
    trackValue(event) {
      this.statUpgrade = event.target.value;
    }
    getStat() {
      return this.statUpgrade;
    }
    raiseStat() {
      this.state.player.levelup(this.statUpgrade);
      this.state.active = '';
      this.setState({currentScreen: this.screens.nextTurn});
    }
    breakLock() {
      const result = this.state.player.breakAnyLock(this.state.active);
      this.state.active = result;
      if (typeof result === 'string') {
        this.setState({currentScreen: this.screens.finishedContainer});
      }
      else {
        this.setState({currentScreen: this.screens.faceItem});
      }
    }
    equipItem(target) {
      const result = this.state.player.equip(this.state.active.item, target());
      this.state.active = result;
      this.setState({currentScreen: this.screens.finishedContainer});
    }
    talk(goal, forced) {
      const result = this.state.player.talk(this.state.active, goal, forced);
      if (typeof result !== "string") {
        this.state.active = result;
        if (result.item) {
          this.setState({currentScreen: this.screens.faceItem});
          return;
        }
      }
      this.setState({currentScreen: this.screens.finishedConversation});
    }
    returnToStart() {
      this.state.active = '';
      this.setState({currentScreen: this.screens.nextTurn});
    }
    checkCompanion() {
      if (this.state.player.companion && this.state.player.companion.dead) {
        this.state.player.companion = undefined;
      }
    }
    checkLevel() {
      if (this.state.player.level >= 20) {
        this.setState({currentScreen: this.screens.gameOver});
      }
    }
    render() {
      return (
        <div className={this.state.className}>
          <div ref={element => this.gameEl = element} className="hidden">
          <GameFlowWindow>
            {this.state.currentScreen}
          </GameFlowWindow>
          <PlayerWindow player={this.state.player} />
          <LogWindow content={this.state.active.fullLog || null} />
          </div>
        </div>
      )
    }
  }

  const GameFlowWindow = ({children}) => {
    return (
      <div className="game-flow-window">
        {children}
      </div>
    )
  }

  const NextTurnButton = ({startTurn}) => {
    return (
      <div className="image-screen">
        <h3>There is a shack in front of you.</h3>
        <img className="image" src= "img/shack.jpg" alt="shack" />
        <div className="btn-wrapper">
          <button className="next-turn-button" onClick={startTurn}>Step in</button>
        </div>
      </div>
    )
  };

  const PlayerWindow = ({player}) => {
    return (
      <div className="player-window">
        <div className="title">
          <h1>{player.name}</h1>
          <h3>level: {player.level}</h3>
        </div>
        <div className="status">
          <h2>HP: {player.hp} / {player.maxHp}</h2>
          <h2>AP: {player.ap} / {player.maxAp}</h2>
        </div>
        <div className="items">
          <p>Weapon demage: {player.weapon.demage}</p>
          <p>Armor defence: {player.armor.defence}</p>
        </div>
        <div className="stats">
          <p>strength: {player.str}</p>
          <p>dexterity: {player.dex}</p>
          <p>intellect: {player.int}</p>
          <p>luck: {player.luc}</p>
        </div>
        <Companion companion={player.companion} />
      </div>
    )
  }

  const Companion = ({companion}) => {
    if (!companion) {
      return (
        <div className="companion">
          <h3>Companion: none</h3>
        </div>
      );
    }
    return (
      <div className="companion">
        <h3>Companion: {companion.name} (level {companion.level})</h3>
        <div className="status">
          <h3>HP: {companion.hp}/{companion.maxHp}</h3>
          <h3>AP: {companion.ap}/{companion.maxAp}</h3>
        </div>
        <div className="status">
          <h4>Weapon demage: {companion.weapon.demage}</h4>
          <h4>Armor defence: {companion.armor.defence}</h4>
        </div>
        <h3>STATS:</h3>
        <h4>STR:{companion.str} DEX:{companion.dex} INT:{companion.int}</h4>
      </div>
    )
  }

  const LogWindow = ({content}) => {
    return (
      <div className="log-window">
        <h4>Battle log</h4>
        <div>
          {content === null ? null : content.map((line, index) => <p key={index}>{line}</p>)}
        </div>
      </div>
    )
  }

  const GameOver = () => {
    const reload = () => {
      window.location.reload();
    }
    return (
      <div className="game-over">
        <h1>Congratulations! You won!</h1>
        <h3>Maximum level is 20.</h3>
        <h5>Things will get much more interesting when you are able to play with friends.</h5>
        <h5>Multiplayer is coming soon (or not so soon).</h5>
        <button className="btn" onClick={reload}>Back to title screen</button>
      </div>
    )
  }

  const GameScreen = ({character}) => {
    return (
      <div className="fullscreen">
        <GameWindow player={character} />
      </div>
    )
  }

  const gameWindow = {
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
  }

  return gameWindow;

});
