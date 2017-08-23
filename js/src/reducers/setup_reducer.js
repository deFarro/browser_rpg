define(['../actions/setup_actions'], function(actions) {
  const {
    SHOW_WINDOW,
    ENTER_NAME,
    RAISE_STAT,
    REDUCE_STAT,
    SHOW_SUBMIT,
    HIDE_SUBMIT
  } = actions;

  const initialState = {
    statsRemain: 10,
    name: '',
    stats: [0, 0, 0, 0],
    statNames: ['strength', 'dexterity', 'intellect', 'luck'],
    className: 'startButton',
    showTip: false,
    showSubmit: false
  };

  const setup = (state = initialState, action) => {
    switch(action.type) {
      case SHOW_WINDOW:
        return Object.assign({}, state, {
          className: 'setupScreen'
        });
      case ENTER_NAME:
        return Object.assign({}, state, {
          name: action.name
        });
      case RAISE_STAT:
        let stateRa = Object.assign({}, state);
        if (stateRa.statsRemain > 0) {
          stateRa.statsRemain--;
          stateRa.stats[stateRa.statNames.indexOf(action.stat)]++;
        }
        return stateRa;
      case REDUCE_STAT:
        let stateRe = Object.assign({}, state);
        if (stateRe.stats[stateRe.statNames.indexOf(action.stat)] > 0) {
          stateRe.statsRemain++;
          stateRe.stats[stateRe.statNames.indexOf(action.stat)]--;
        }
        return stateRe;
      case SHOW_SUBMIT:
        return Object.assign({}, state, {
          showSubmit: true
        });
      case HIDE_SUBMIT:
        return Object.assign({}, state, {
          showSubmit: false
        });
      default:
        return state;
    }
  }

  return setup;
});
