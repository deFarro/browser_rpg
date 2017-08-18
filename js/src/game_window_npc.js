define(['react'], function (React) {

  class FaceNPC extends React.Component {
    constructor(props) {
      super(props);
      this.npc = props.npc();
      this.nextAction = props.next;
      this.returnToStart = props.returnToStart;
      this.buttonSets = [
        {
          title: 'What will you do?',
          buttons: [
            {
              text: 'Ask to heal',
              action: 'heal'
            },
            {
              text: 'Invite to join',
              action: 'join'
            },
            {
              text: 'Demand a weapon',
              action: 'supply'
            }
          ]
        },
        {
          title: 'What will be your tactic?',
          buttons : [
            {
              text: 'Threaten',
              action: true
            },
            {
              text: 'Persuade',
              action: false
            },
            {
              text: 'Go away',
              action: 'run'
            }
          ]
        }
      ];
      this.state = {
        display: this.buttonSets[0],
        action: '',
        forced: ''
      }
    }
    chooseGoal(event) {
      this.state.action = event.target.dataset.action;
      this.setState({display: this.buttonSets[1]});
    }
    defineTactic(event) {
      if (event.target.dataset.action === 'run') {
        this.returnToStart();
        return;
      }
      this.state.forced = event.target.dataset.action;
      this.nextAction(this.state.action, this.state.forced);
    }
    render() {
      return (
        <div className="image-screen">
          <h3>You met a stranger: {this.npc.name} (level: {this.npc.level}).</h3>
          <img className="image" src= "img/npc.jpg" alt="robot" />
          <Conversation props={this.state.display} handleClick={this.state.display === this.buttonSets[0] ? this.chooseGoal.bind(this) : this.defineTactic.bind(this)} />
        </div>
      )
    }
  }

  const Conversation = ({props, handleClick}) => {
    return (
      <div>
        <h4>{props.title}</h4>
        <div className="btn-wrapper">
          {props.buttons.map((button, index) => <button key={index} className="btn" data-action={button.action} onClick={handleClick}>{button.text}</button>)}
        </div>
      </div>
    );
  }

  const FinishedConversation = ({result, startBattle, returnToStart}) => {
    const currentResult = result();
    let status, action, handle, text;
    if (currentResult instanceof NPC) {
      status = `Attempt failed.`;
      action = `${currentResult.name} attacks you.`;
      handle = startBattle;
      text = 'Fight back';
    }
    else {
      status = currentResult.status.result;
      action = currentResult.status.log;
      handle = returnToStart;
      text = 'Next turn';
    }
    return (
      <div>
        <h3>{status}</h3>
        <h4>{action}</h4>
        <div className="btn-wrapper">
          <button className="next-turn-button" onClick={handle}>{text}</button>
        </div>
      </div>
    );
  }

  const npc = {
    FaceNPC,
    Conversation,
    FinishedConversation
  }
  
  return npc;
});
