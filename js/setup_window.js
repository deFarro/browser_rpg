'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(['react'], function (React) {
  var GameTitle = function (_React$Component) {
    _inherits(GameTitle, _React$Component);

    function GameTitle(props) {
      _classCallCheck(this, GameTitle);

      var _this = _possibleConstructorReturn(this, (GameTitle.__proto__ || Object.getPrototypeOf(GameTitle)).call(this));

      _this.state = {
        animate: props["data-animate"],
        className: props.appliedClass
      };
      return _this;
    }

    _createClass(GameTitle, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        if (this.state.animate) {
          setTimeout(function () {
            _this2.setState({ className: 'clickedTitle' });
          }, 0);
        }
      }
    }, {
      key: 'render',
      value: function render() {
        return React.createElement(
          'div',
          { className: 'title-wrapper' },
          React.createElement(
            'h1',
            { className: this.state.className },
            'Future In The Past'
          )
        );
      }
    }]);

    return GameTitle;
  }(React.Component);

  var SetupWindow = function (_React$Component2) {
    _inherits(SetupWindow, _React$Component2);

    function SetupWindow(props) {
      _classCallCheck(this, SetupWindow);

      var _this3 = _possibleConstructorReturn(this, (SetupWindow.__proto__ || Object.getPrototypeOf(SetupWindow)).call(this));

      _this3.switchToGame = props.doNext;
      _this3.state = {
        statsRemain: 10,
        name: 'Jack',
        // To add/remove stat to the setup form just change these two following arrays
        stats: [0, 0, 0, 0],
        statNames: ['strength', 'dexterity', 'intellect', 'luck'],
        className: 'startButton'
      };
      return _this3;
    }

    _createClass(SetupWindow, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this4 = this;

        setTimeout(function () {
          _this4.setState({ className: 'setupScreen' });
          // Add and remove 'hidden' to avoid overflow blinking
          _this4.formEl.classList.remove('hidden');
        }, 0);
      }
    }, {
      key: 'enterName',
      value: function enterName(event) {
        var cName = event.target.value;
        // Only numbers, spaces, underscores and english letters are eligible
        if (/^[\w ]{0,20}$/.test(cName)) {
          this.setState({ name: cName });
        } else {
          return;
        }
      }
      //chooseGender(event) {}

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
          this.createButton.classList.remove('hidden');
        } else {
          this.createButton.classList.add('hidden');
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
        var _this5 = this;

        var fieldSet = this.state.statNames.map(function (stat, i) {
          return React.createElement(StatField, { key: i, title: stat, plus: _this5.plus.bind(_this5, i), minus: _this5.minus.bind(_this5, i), value: _this5.state.stats[i] });
        });

        return React.createElement(
          'div',
          { className: this.state.className },
          React.createElement(
            'p',
            null,
            'SETUP YOUR CHARACTER'
          ),
          React.createElement(
            'form',
            { ref: function ref(element) {
                return _this5.formEl = element;
              }, className: 'hidden' },
            React.createElement(NameField, { onChange: this.enterName.bind(this), value: this.state.name }),
            fieldSet,
            React.createElement(
              'p',
              { className: 'remain-stats' },
              'STATS REMAIN: ',
              this.state.statsRemain
            )
          ),
          React.createElement(CreateCharButton, { onClick: this.handleSubmit.bind(this), controlView: function controlView(element) {
              return _this5.createButton = element;
            } })
        );
      }
    }]);

    return SetupWindow;
  }(React.Component);

  var NameField = function NameField(_ref) {
    var onChange = _ref.onChange,
        value = _ref.value;

    return React.createElement(
      'div',
      null,
      React.createElement('input', { className: 'name-field', type: 'text', placeholder: 'Name', onChange: onChange, value: value })
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
          { className: 'minus', onClick: minus },
          '-'
        ),
        React.createElement('input', { type: 'text', value: value, disabled: true }),
        React.createElement(
          'i',
          { className: 'plus', onClick: plus },
          '+'
        )
      )
    );
  };

  var CreateCharButton = function CreateCharButton(_ref2) {
    var onClick = _ref2.onClick,
        controlView = _ref2.controlView;

    return React.createElement(
      'button',
      { className: 'create-char-button hidden', ref: controlView, onClick: onClick },
      'Create character'
    );
  };

  var SetupScreen = function SetupScreen(_ref3) {
    var switchToGame = _ref3.switchToGame;

    return React.createElement(
      'div',
      null,
      React.createElement(GameTitle, { appliedClass: 'gameTitle', 'data-animate': true }),
      React.createElement(SetupWindow, { doNext: switchToGame })
    );
  };

  var setupWindow = {
    GameTitle: GameTitle,
    SetupWindow: SetupWindow,
    NameField: NameField,
    StatField: StatField,
    CreateCharButton: CreateCharButton,
    SetupScreen: SetupScreen
  };

  return setupWindow;
});