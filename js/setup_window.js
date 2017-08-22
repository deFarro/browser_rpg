'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(['react'], function (React) {
  var SetupWindow = function (_React$Component) {
    _inherits(SetupWindow, _React$Component);

    function SetupWindow(props) {
      _classCallCheck(this, SetupWindow);

      var _this = _possibleConstructorReturn(this, (SetupWindow.__proto__ || Object.getPrototypeOf(SetupWindow)).call(this));

      _this.switchToGame = props.doNext;
      _this.state = {
        statsRemain: 10,
        name: '',
        stats: [0, 0, 0, 0],
        statNames: ['strength', 'dexterity', 'intellect', 'luck'],
        className: 'startButton',
        showTip: false
      };
      return _this;
    }

    _createClass(SetupWindow, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        setTimeout(function () {
          _this2.setState({ className: 'setupScreen' });
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
          this.createButton.disabled = false;
          this.createButton.classList.remove('hidden');
        } else {
          this.createButton.disabled = true;
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
        var _this3 = this;

        var fieldSet = this.state.statNames.map(function (stat, i) {
          return React.createElement(StatField, { key: i, title: stat, plus: _this3.plus.bind(_this3, i), minus: _this3.minus.bind(_this3, i), value: _this3.state.stats[i] });
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
            } })
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

  var setupWindow = {
    SetupWindow: SetupWindow,
    NameField: NameField,
    StatField: StatField,
    CreateCharButton: CreateCharButton
  };

  return setupWindow;
});