'use strict';

define(function () {

  var SHOW_WINDOW = 'setup/SHOW_WINDOW';
  var ENTER_NAME = 'setup/ENTER_NAME';
  var RAISE_STAT = 'setup/RAISE_STAT';
  var REDUCE_STAT = 'setup/REDUCE_STAT';
  var SHOW_SUBMIT = 'setup/SHOW_SUBMIT';
  var HIDE_SUBMIT = 'setup/HIDE_SUBMIT';

  var showWindow = function showWindow(className) {
    return {
      type: SHOW_WINDOW
    };
  };

  var enterName = function enterName(name) {
    return {
      type: ENTER_NAME,
      name: name
    };
  };

  var raiseStat = function raiseStat(stat) {
    return {
      type: RAISE_STAT,
      stat: stat
    };
  };

  var reduceStat = function reduceStat(stat) {
    return {
      type: REDUCE_STAT,
      stat: stat
    };
  };

  var showSubmit = function showSubmit() {
    return {
      type: SHOW_SUBMIT
    };
  };

  var hideSubmit = function hideSubmit() {
    return {
      type: HIDE_SUBMIT
    };
  };

  var actions = {
    SHOW_WINDOW: SHOW_WINDOW,
    ENTER_NAME: ENTER_NAME,
    RAISE_STAT: RAISE_STAT,
    REDUCE_STAT: REDUCE_STAT,
    SHOW_SUBMIT: SHOW_SUBMIT,
    HIDE_SUBMIT: HIDE_SUBMIT,
    showWindow: showWindow,
    enterName: enterName,
    raiseStat: raiseStat,
    reduceStat: reduceStat,
    showSubmit: showSubmit,
    hideSubmit: hideSubmit
  };

  return actions;
});