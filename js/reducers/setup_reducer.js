'use strict';

define(['../actions/setup_actions'], function (actions) {
  var SHOW_WINDOW = actions.SHOW_WINDOW,
      ENTER_NAME = actions.ENTER_NAME,
      RAISE_STAT = actions.RAISE_STAT,
      REDUCE_STAT = actions.REDUCE_STAT,
      SHOW_SUBMIT = actions.SHOW_SUBMIT,
      HIDE_SUBMIT = actions.HIDE_SUBMIT;


  var initialState = {
    statsRemain: 10,
    name: '',
    stats: [0, 0, 0, 0],
    statNames: ['strength', 'dexterity', 'intellect', 'luck'],
    className: 'startButton',
    showTip: false,
    showSubmit: false
  };

  var setup = function setup() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    switch (action.type) {
      case SHOW_WINDOW:
        return Object.assign({}, state, {
          className: 'setupScreen'
        });
      case ENTER_NAME:
        return Object.assign({}, state, {
          name: action.name
        });
      case RAISE_STAT:
        var stateRa = Object.assign({}, state);
        if (stateRa.statsRemain > 0) {
          stateRa.statsRemain--;
          stateRa.stats[stateRa.statNames.indexOf(action.stat)]++;
        }
        return stateRa;
      case REDUCE_STAT:
        var stateRe = Object.assign({}, state);
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
  };

  return setup;
});