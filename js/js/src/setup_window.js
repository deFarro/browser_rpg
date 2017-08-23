'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(['react', 'redux', 'react_redux', './actions/setup_actions'], function (React, Redux, ReactRedux, actions) {
  var bindActionCreators = Redux.bindActionCreators;
  var connect = ReactRedux.connect;
  var showWindow = actions.showWindow,
      enterName = actions.enterName,
      raiseStat = actions.raiseStat,
      reduceStat = actions.reduceStat,
      showTip = actions.showTip,
      hideTip = actions.hideTip,
      showSubmit = actions.showSubmit,
      hideSubmit = actions.hideSubmit;

  var SetupWindow = function (_React$Component) {
    _inherits(SetupWindow, _React$Component);

    function SetupWindow(props) {
      _classCallCheck(this, SetupWindow);

      var _this = _possibleConstructorReturn(this, (SetupWindow.__proto__ || Object.getPrototypeOf(SetupWindow)).call(this, props));

      _this.switchToGame = props.doNext;
      _this.state = {
        statsRemain: 10,
        name: '',
        stats: [0, 0, 0, 0],
        statNames: ['strength', 'dexterity', 'intellect', 'luck'],
        showTip: false
      };
      return _this;
    }

    _createClass(SetupWindow, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        setTimeout(function () {
          _this2.props.dispatch(showWindow());
          // Add and remove 'hidden' to avoid overflow blinking
          _this2.formEl.classList.remove('hidden');
        }, 0);
      }
    }, {
      key: 'enterName',
      value: function enterName(event) {
        var cName = event.target.value;
        // Only numbers, spaces, underscores and english letters are eligible
        if (/^[\w ]{0,20}$/.test(cName)) {
          this.setState({ showTip: false });
          this.setState({ name: cName });
        } else {
          this.setState({ showTip: true });
          return;
        }
      }
    }, {
      key: 'plus',
      value: function plus(index) {
        if (this.state.statsRemain === 0) {
          return;
        }
        var statList = this.state.stats;
        statList[index]++;
        this.setState({ statsRemain: this.state.statsRemain - 1, stats: statList });
      }
    }, {
      key: 'minus',
      value: function minus(index) {
        if (this.state.stats[index] === 0) {
          return;
        }
        var statList = this.state.stats;
        statList[index]--;
        this.setState({ statsRemain: this.state.statsRemain + 1, stats: statList });
      }
    }, {
      key: 'checkIfReady',
      value: function checkIfReady() {
        if (this.state.statsRemain === 0 && this.state.name) {
          //console.log(this.props.showSubmit);
          // this.createButton.disabled = false;
          // this.createButton.classList.remove('hidden');
          this.props.dispatch(showSubmit());
          //console.log(this.props.showSubmit);
        } else {
          // this.createButton.disabled = true;
          // this.createButton.classList.add('hidden');
          this.props.dispatch(hideSubmit());
        }
      }
    }, {
      key: 'handleSubmit',
      value: function handleSubmit(event) {
        event.preventDefault();
        var character = { 'name': this.state.name, 'stats': this.state.stats };
        this.switchToGame(character);
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        this.checkIfReady();
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        var dispatch = this.props.dispatch;

        var plus = bindActionCreators(raiseStat, dispatch);
        var minus = bindActionCreators(reduceStat, dispatch);

        var fieldSet = this.props.statNames.map(function (stat, i) {
          return React.createElement(StatField, { key: i, title: stat, plus: plus, minus: minus, value: _this3.props.stats[i] });
        });

        return React.createElement(
          'div',
          { className: this.props.className },
          React.createElement(
            'p',
            null,
            'SETUP YOUR CHARACTER'
          ),
          React.createElement(
            'form',
            { ref: function ref(element) {
                return _this3.formEl = element;
              }, className: 'hidden' },
            React.createElement(NameField, { onChange: this.enterName.bind(this), value: this.state.name, showTip: this.state.showTip }),
            fieldSet,
            React.createElement(
              'p',
              { className: 'remain-stats' },
              'STATS REMAIN: ',
              this.state.statsRemain
            )
          ),
          React.createElement(CreateCharButton, { onClick: this.handleSubmit.bind(this), controlView: function controlView(element) {
              return _this3.createButton = element;
            }, show: this.props.showSubmit })
        );
      }
    }]);

    return SetupWindow;
  }(React.Component);

  var NameField = function NameField(_ref) {
    var onChange = _ref.onChange,
        value = _ref.value,
        showTip = _ref.showTip;

    return React.createElement(
      'div',
      { className: 'name-input-block' },
      React.createElement('input', { className: 'name-field', type: 'text', placeholder: 'Name', onChange: onChange, value: value }),
      showTip ? React.createElement(
        'p',
        { className: 'tip' },
        '* english letters and numbers only'
      ) : null
    );
  };

  var StatField = function StatField(props) {
    var title = props.title,
        plus = props.plus,
        minus = props.minus,
        value = props.value;

    return React.createElement(
      'div',
      { className: 'stat-field', onMouseDown: function onMouseDown(event) {
          return event.preventDefault();
        } },
      React.createElement(
        'span',
        null,
        title,
        ':'
      ),
      React.createElement(
        'span',
        null,
        React.createElement(
          'i',
          { className: 'minus', onClick: function onClick() {
              minus(title);
            } },
          '-'
        ),
        React.createElement('input', { type: 'text', value: value, disabled: true }),
        React.createElement(
          'i',
          { className: 'plus', onClick: function onClick() {
              plus(title);
            } },
          '+'
        )
      )
    );
  };

  var CreateCharButton = function CreateCharButton(_ref2) {
    var onClick = _ref2.onClick,
        controlView = _ref2.controlView,
        show = _ref2.show;

    if (show) {
      return React.createElement(
        'button',
        { className: 'create-char-button', ref: controlView, onClick: onClick },
        'Create character'
      );
    }
    return React.createElement(
      'button',
      { className: 'create-char-button hidden', disabled: true, ref: controlView, onClick: onClick },
      'Create character'
    );
  };

  var mapStateToProps = function mapStateToProps(state) {
    console.log(state);
    return {
      statsRemain: state.statsRemain,
      name: state.name,
      stats: state.stats,
      statNames: state.statNames,
      className: state.className,
      showTip: state.showTip,
      showSubmit: state.showSubmit
    };
  };

  SetupWindow = connect(mapStateToProps)(SetupWindow);

  var setupWindow = {
    SetupWindow: SetupWindow,
    NameField: NameField,
    StatField: StatField,
    CreateCharButton: CreateCharButton
  };

  return setupWindow;
});