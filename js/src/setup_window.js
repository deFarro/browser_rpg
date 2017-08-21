define(['react'], function (React) {

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
      return (
        <div className="title-wrapper">
          <h1 className={this.state.className}>Future In The Past</h1>
        </div>
      )
    }
  }

  class SetupWindow extends React.Component {
    constructor(props) {
      super();
      this.switchToGame = props.doNext;
      this.state = {
        statsRemain: 10,
        name: '',
        stats: [0, 0, 0, 0],
        statNames: ['strength', 'dexterity', 'intellect', 'luck'],
        className: 'startButton',
        showTip: false
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
        this.setState({showTip: false});
        this.setState({name: cName});
      }
      else {
        this.setState({showTip: true});
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
        this.createButton.disabled = false;
        this.createButton.classList.remove('hidden');
      }
      else {
        this.createButton.disabled = true;
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
            <NameField onChange={this.enterName.bind(this)} value={this.state.name} showTip={this.state.showTip} />
            {fieldSet}
            <p className="remain-stats">STATS REMAIN: {this.state.statsRemain}</p>
          </form>
          <CreateCharButton onClick={this.handleSubmit.bind(this)} controlView={(element) => this.createButton = element} />
        </div>
      )
    }
  }

  const NameField = ({onChange, value, showTip}) => {
    return (
      <div className="name-input-block">
        <input className="name-field" type="text" placeholder="Name" onChange={onChange} value={value}></input>
        {showTip ? <p className="tip">* english letters and numbers only</p> : null}
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

  const setupWindow = {
    GameTitle,
    SetupWindow,
    NameField,
    StatField,
    CreateCharButton,
    SetupScreen
  }

  return setupWindow;
});
