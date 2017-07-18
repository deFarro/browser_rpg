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
    switchToGameScreen() {
      this.setState({visible: 'gameScreen'})
    }
    render() {
      if (this.state.visible === 'titleScreen') {
        return <TitleScreen clickHandler={this.switchToSetup.bind(this)}/>
      }
      else if (this.state.visible === 'setupScreen') {
        return <SetupScreen switchToGame={this.switchToGameScreen.bind(this)}/>
      }
      else if (this.state.visible === 'gameScreen') {
        return <GameScreen />
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
        statsRemain: 10,
        name: '',
        stats: [0, 0, 0, 0],
        statNames: ["strength", "dexterity", "intellect", "luck"],
        className: 'startButton'
      }
    }
    componentDidMount() {
      setTimeout(() => {this.setState({className: 'setupScreen'})}, 0);
    }
    enterName(event) {
      const cName = event.target.value;
      if (/[\w ]{0,20}$/g.test(cName)) {
        this.setState({name: cName});
      }
      else {
        return;
      }
    }
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
      this.switchToGame();
      console.log(character);
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
          <form>
            <NameField onChange={this.enterName.bind(this)} value={this.state.name}/>
            {fieldSet}
          </form>
          <p className="remain-stats">STATS REMAIN: {this.state.statsRemain}</p>
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

  class GameScreen extends React.Component {
    render() {
      return (
        <div>
          <GameTitle appliedClass="clickedTitle" />
          <div className="setupScreen">Поехали!</div>
        </div>
      )
    }
  }

  ReactDOM.render(<MainWindow />, document.getElementById('root'));
});
