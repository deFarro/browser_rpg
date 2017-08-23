define(['react', 'redux', 'react_redux', './actions/setup_actions'], function (React, Redux, ReactRedux, actions) {

  const {bindActionCreators} = Redux;
  const {connect} = ReactRedux;

  const {
    showWindow,
    enterName,
    raiseStat,
    reduceStat,
    showSubmit,
    hideSubmit
  } = actions;

  class SetupWindow extends React.Component {
    componentDidMount() {
      setTimeout(() => {
        // Set and change class to run animation
        this.props.dispatch(showWindow());
        // Add and remove 'hidden' to avoid overflow blinking
        this.formEl.classList.remove('hidden');
      }, 0);
    }
    componentDidUpdate() {
      // Check if name and stat input finished
      if(this.props.statsRemain === 0 && this.props.name) {
        this.props.dispatch(showSubmit());
      }
      else {
        this.props.dispatch(hideSubmit());
      }
    }
    handleSubmit(event) {
      event.preventDefault();
      const character = {'name': this.props.name, 'stats': this.props.stats};
      this.props.doNext(character);
    }
    render() {
      const {dispatch} = this.props;
      const changeName = bindActionCreators(enterName, dispatch);
      const plus = bindActionCreators(raiseStat, dispatch);
      const minus = bindActionCreators(reduceStat, dispatch);

      const fieldSet = this.props.statNames.map((stat, i) => {
        return <StatField key={i} title={stat} plus={plus} minus={minus} value={this.props.stats[i]} />
      });

      return (
        <div className={this.props.className}>
          <p>SETUP YOUR CHARACTER</p>
          <form ref={element => this.formEl = element} className="hidden">
            <NameField changeName={changeName} value={this.props.name} />
            {fieldSet}
            <p className="remain-stats">STATS REMAIN: {this.props.statsRemain}</p>
          </form>
          <CreateCharButton onClick={this.handleSubmit.bind(this)} show={this.props.showSubmit}/>
        </div>
      )
    }
  }

  class NameField extends React.Component {
    constructor(props) {
      super();
      this.props = props;
      this.state = {
        showTip: false
      }
    }
    updateName(event) {
      const cName = event.target.value;
      // Only numbers, spaces, underscores and english letters are eligible
      if (/^[\w ]{0,20}$/.test(cName)) {
        this.props.changeName(cName);
        this.setState({showTip: false});
      }
      else {
        this.setState({showTip: true});
      }
    }
    render() {
      return (
        <div className="name-input-block">
          <input className="name-field" type="text" placeholder="Name" onChange={this.updateName.bind(this)} value={this.props.value}></input>
          {this.state.showTip ? <p className="tip">* english letters and numbers only</p> : null}
        </div>
      )
    }
  }

  const StatField = (props) => {
    const {title, plus, minus, value} = props;
    return (
      <div className="stat-field" onMouseDown={(event) => event.preventDefault()}>
        <span>{title}:</span>
        <span>
          <i className="minus" onClick={() => {minus(title)}}>&#45;</i>
          <input type="text" value={value} disabled></input>
          <i className="plus" onClick={() => {plus(title)}}>&#43;</i>
        </span>
      </div>
    )
  }

  const CreateCharButton = ({onClick, show}) => {
    if (show) {
      return <button className="create-char-button" onClick={onClick}>Create character</button>
    }
    return <button className="create-char-button hidden" disabled={true} onClick={onClick}>Create character</button>
  }

  const mapStateToProps = state => {
    return {
      statsRemain: state.statsRemain,
      name: state.name,
      stats: state.stats,
      statNames: state.statNames,
      className: state.className,
      showSubmit: state.showSubmit
    }
  }

  SetupWindow = connect(mapStateToProps)(SetupWindow);

  const setupWindow = {
    SetupWindow,
    NameField,
    StatField,
    CreateCharButton
  }

  return setupWindow;
});
