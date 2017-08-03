'use strict';

requirejs.config({
  baseUlr: 'js/',
  paths: {
    react: 'lib/react',
    react_dom: 'lib/react-dom'
  }
});

requirejs(['react', 'react_dom', 'game'], function(React, ReactDOM) {

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

  class GameTitle extends React.Component {
    constructor(props) {
      super();
      this.state = {
        animate: props["data-animate"],
        className: props.appliedClass
      }
    }
    componentDidMount() {
      if (this.state.animate) {
        setTimeout(() => {this.setState({className: 'clickedTitle'})}, 0);
      }
    }
    render() {
      return <h1 className={this.state.className}>Future In The Past</h1>;
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

  class SetupWindow extends React.Component {
    constructor(props) {
      super();
      this.switchToGame = props.doNext;
      this.state = {
        statsRemain: 0,
        name: 'Jack',
        // To add/remove stat to the setup form just change these two following arrays
        stats: [100, 0, 0, 0],
        statNames: ['strength', 'dexterity', 'intellect', 'luck'],
        className: 'startButton'
      }
    }
    componentDidMount() {
      setTimeout(() => {
        this.setState({className: 'setupScreen'});
        // Add and remove 'hidden' to avoid overflow blinking
        this.formEl.classList.remove('hidden');
      }, 0);
    }
    enterName(event) {
      const cName = event.target.value;
      // Only numbers, spaces, underscores and english letters are eligible
      if (/^[\w ]{0,20}$/.test(cName)) {
        this.setState({name: cName});
      }
      else {
        return;
      }
    }
    //chooseGender(event) {}
    plus(index) {
      if(this.state.statsRemain === 0) {
        return;
      }
      const statList = this.state.stats;
      statList[index]++;
      this.setState({statsRemain: this.state.statsRemain - 1, stats: statList});
    }
    minus(index) {
      if(this.state.stats[index] === 0) {
        return;
      }
      const statList = this.state.stats;
      statList[index]--;
      this.setState({statsRemain: this.state.statsRemain + 1, stats: statList});
    }
    checkIfReady() {
      if(this.state.statsRemain === 0 && this.state.name) {
        this.createButton.classList.remove('hidden');
      }
      else {
        this.createButton.classList.add('hidden');
      }
    }
    handleSubmit(event) {
      event.preventDefault();
      const character = {'name': this.state.name, 'stats': this.state.stats};
      this.switchToGame(character);
    }
    componentDidUpdate() {
      this.checkIfReady();
    }
    render() {
      const fieldSet = this.state.statNames.map((stat, i) => {
        return <StatField key={i} title={stat} plus={this.plus.bind(this, i)} minus={this.minus.bind(this, i)} value={this.state.stats[i]} />
      });

      return (
        <div className={this.state.className}>
          <p>SETUP YOUR CHARACTER</p>
          <form ref={element => this.formEl = element} className="hidden">
            <NameField onChange={this.enterName.bind(this)} value={this.state.name}/>
            {fieldSet}
            <p className="remain-stats">STATS REMAIN: {this.state.statsRemain}</p>
          </form>
          <CreateCharButton onClick={this.handleSubmit.bind(this)} controlView={(element) => this.createButton = element}/>
        </div>
      )
    }
  }

  const NameField = ({onChange, value}) => {
    return (
      <div>
        <input className="name-field" type="text" placeholder="Name" onChange={onChange} value={value}></input>
      </div>
    )
  }

  // Feature not yet finalazed
  const GenderField = () => {
    return (
      <div>
      <label>male
        <input className="gender-field" type="radio" name="gender" value="male" defaultChecked>
        </input>
        </label>
        <label>female
        <input className="gender-field" type="radio" name="gender" value="female">
        </input>
        </label>
      </div>
    )
  }

  const StatField = (props) => {
      const {title, plus, minus, value} = props;
    return (
      <div className="stat-field" onMouseDown={(event) => event.preventDefault()}>
      <span>{title}:</span>
      <span><i className="minus" onClick={minus}>&#45;</i><input type="text" value={value} disabled></input><i className="plus" onClick={plus}>&#43;</i></span>
      </div>
    )
  }

  const CreateCharButton = ({onClick, controlView}) => {
    return <button className="create-char-button hidden" ref={controlView} onClick={onClick}>Create character</button>
  }

  const SetupScreen = ({switchToGame}) => {
    return (
      <div>
        <GameTitle appliedClass="gameTitle" data-animate />
        <SetupWindow doNext={switchToGame}/>
      </div>
    )
  }

  class GameWindow extends React.Component {
    constructor(props) {
      super(props);
      this.playerStats = props;
      this.weapons = makeWeaponsArray(15);
      this.armors = makeArmorsArray(15);
      this.screens = {
        nextTurn: <NextTurnButton startTurn={this.startTurn.bind(this)} />,
        faceEnemy: <FaceEnemy enemy={this.getActive.bind(this)} startBattle={this.startBattle.bind(this)} escape={this.escape.bind(this)}/>,
        escaped: <Escaped returnToStart={this.returnToStart.bind(this)} />,
        battleOver: <BattleOver results={this.getActive.bind(this)} player={this.getPlayer.bind(this)} startTurn={this.startTurn.bind(this)} levelUp={this.levelUp.bind(this)} />,
        levelUp: <LevelUp raise={this.raiseStat.bind(this)} trackValue={this.trackValue.bind(this)} getStat={this.getStat.bind(this)} />
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
    startTurn() {
      const nextAction = startNextTurn(this);
      this.state.active = nextAction;
      if (nextAction instanceof Enemy) {
        this.setState({currentScreen: this.screens.faceEnemy})
      }
    }
    getActive() {
      return this.state.active;
    }
    getPlayer() {
      return this.state.player;
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
      this.setState({currentScreen: this.screens.nextTurn});
    }
    returnToStart() {
      this.setState({currentScreen: this.screens.nextTurn});
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
        <h3>There is a shack in front of you</h3>
        <img className="image" src= "../img/shack.jpg" alt="shack" />
        <div className="btn-wrapper">
          <button className="next-turn-button" onClick={startTurn}>Step in</button>
        </div>
      </div>
    )
  };

  const FaceEnemy = ({enemy, startBattle, escape}) => {
    const currentEnemy = enemy();
    return (
      <div className="image-screen">
        <h3>Enemy on your way: {currentEnemy.name} (level: {currentEnemy.level})</h3>
        <img className="image" src= "../img/robot.jpg" alt="robot" />
        <h4>Will you fight?</h4>
        <div className="btn-wrapper">
          <button className="btn" onClick={startBattle}>Fight</button>
          <button className="btn" onClick={escape}>Escape</button>
        </div>
      </div>
    )
  };

  const Escaped = ({returnToStart}) => {
    return (
      <div>
        <h3>You have escaped successfully</h3>
        <div className="btn-wrapper">
          <button className="next-turn-button" onClick={returnToStart}>Next turn</button>
        </div>
      </div>
    )
  }

  const BattleOver = ({results, player, startTurn, levelUp}) => {
    const battleResults = results();
    return (
      <div>
        <h3 className="underline">{battleResults.escaped === 'notescaped' ? 'Escape failed' : null}</h3>
        <h4>The battle is over</h4>
        <h3>{battleResults.winner.name} won!</h3>
        <h4 className="underline">Battle results:</h4>
        <h4>{battleResults.log}</h4>
        <div className="btn-wrapper">
          <button className="next-turn-button" onClick={battleResults.winner === player() ? levelUp : startTurn}>{battleResults.winner === player() ? 'Level up' : 'Next turn'}</button>
        </div>
      </div>
    )
  }

  const LevelUp = ({raise, trackValue, getStat}) => {
    return (
      <div>
        <h3>You have got a new level</h3>
        <h4>Which stat would you like to raise?</h4>
        <select className="level-up-stat" defaultValue={getStat()} onChange={trackValue}>
          <option value="str">strength</option>
          <option value="dex">dexterity</option>
          <option value="int">intellect</option>
          <option value="luc">luck</option>
        </select>
        <div className="btn-wrapper">
          <button className="btn" onClick={raise}>Confirm</button>
        </div>
      </div>
    )
  }

  const FaceContainer = () => {};
  const FaceNPC = () => {};

  const PlayerWindow = ({player}) => {
    return (
      <div className="player-window">
        <div className="title">
          <h1>{player.name}</h1>
          <h3>level: {player.level}</h3>
        </div>
        <div className="status">
          <h2>HP: {player.hp}</h2>
          <h2>AP: {player.ap}</h2>
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
    return (
      <div className="companion">
        <h3>Companion: {companion ? companion.name : "none"}</h3>
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

  const GameScreen = ({character}) => {
    return (
      <div className="fullscreen">
        <GameTitle appliedClass="clickedTitle" />
        <GameWindow player={character} />
      </div>
    )
  }

  ReactDOM.render(<MainWindow />, document.getElementById('root'));
});
