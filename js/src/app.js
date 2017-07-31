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
        stats: [15, 5, 0, 0],
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
      this.state = {
      gameScreens: [<NextTurnButton startTurn={this.startTurn.bind(this)} />],
      game: new Game(),
      player: new Player(props.player, this.weapons, this.armors),
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
      this.setState(battle(this.state.player, new Enemy(this.weapons, this.armors)));
    }
    render() {
      return (
        <div className={this.state.className}>
          <div ref={element => this.gameEl = element} className="hidden">
          <GameFlowWindow>
            {this.state.gameScreens[0]}
          </GameFlowWindow>
          <PlayerWindow player={this.state.player} />
          <LogWindow />
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
    return <button className="next-turn-button" onClick={startTurn}>Next turn</button>
  };

  const FaceEnemy = () => {};
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

  const LogWindow = () => {
    return (
      <div className="log-window">Battle log</div>
    )
  }

  const GameScreen = ({character}) => {
    return (
      <div>
        <GameTitle appliedClass="clickedTitle" />
        <GameWindow player={character} />
      </div>
    )
  }

  ReactDOM.render(<MainWindow />, document.getElementById('root'));
});
