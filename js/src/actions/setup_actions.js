define(function() {

  const SHOW_WINDOW = 'setup/SHOW_WINDOW';
  const ENTER_NAME = 'setup/ENTER_NAME';
  const RAISE_STAT = 'setup/RAISE_STAT';
  const REDUCE_STAT = 'setup/REDUCE_STAT';
  const SHOW_SUBMIT = 'setup/SHOW_SUBMIT';
  const HIDE_SUBMIT = 'setup/HIDE_SUBMIT';

  const showWindow = (className) => {
    return {
      type: SHOW_WINDOW
    }
  }

  const enterName = (name) => {
    return {
      type: ENTER_NAME,
      name
    }
  }

  const raiseStat = (stat) => {
    return {
      type: RAISE_STAT,
      stat
    }
  }

  const reduceStat = (stat) => {
    return {
      type: REDUCE_STAT,
      stat
    }
  }

  const showSubmit = () => {
    return {
      type: SHOW_SUBMIT
    }
  }

  const hideSubmit = () => {
    return {
      type: HIDE_SUBMIT
    }
  }

  const actions = {
    SHOW_WINDOW,
    ENTER_NAME,
    RAISE_STAT,
    REDUCE_STAT,
    SHOW_SUBMIT,
    HIDE_SUBMIT,
    showWindow,
    enterName,
    raiseStat,
    reduceStat,
    showSubmit,
    hideSubmit
  }

  return actions;
});
