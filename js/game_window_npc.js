'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(['react'], function (React) {
  var FaceNPC = function (_React$Component) {
    _inherits(FaceNPC, _React$Component);

    function FaceNPC(props) {
      _classCallCheck(this, FaceNPC);

      var _this = _possibleConstructorReturn(this, (FaceNPC.__proto__ || Object.getPrototypeOf(FaceNPC)).call(this, props));

      _this.npc = props.npc();
      _this.nextAction = props.next;
      _this.returnToStart = props.returnToStart;
      _this.buttonSets = [{
        title: 'What will you do?',
        buttons: [{
          text: 'Ask to heal',
          action: 'heal'
        }, {
          text: 'Invite to join',
          action: 'join'
        }, {
          text: 'Demand a weapon',
          action: 'supply'
        }]
      }, {
        title: 'What will be your tactic?',
        buttons: [{
          text: 'Threaten',
          action: true
        }, {
          text: 'Persuade',
          action: false
        }, {
          text: 'Go away',
          action: 'run'
        }]
      }];
      _this.state = {
        display: _this.buttonSets[0],
        action: '',
        forced: ''
      };
      return _this;
    }

    _createClass(FaceNPC, [{
      key: 'chooseGoal',
      value: function chooseGoal(event) {
        this.state.action = event.target.dataset.action;
        this.setState({ display: this.buttonSets[1] });
      }
    }, {
      key: 'defineTactic',
      value: function defineTactic(event) {
        if (event.target.dataset.action === 'run') {
          this.returnToStart();
          return;
        }
        this.state.forced = event.target.dataset.action;
        this.nextAction(this.state.action, this.state.forced);
      }
    }, {
      key: 'render',
      value: function render() {
        return React.createElement(
          'div',
          { className: 'image-screen' },
          React.createElement(
            'h3',
            null,
            'You met a stranger: ',
            this.npc.name,
            ' (level: ',
            this.npc.level,
            ').'
          ),
          React.createElement('img', { className: 'image', src: 'img/npc.jpg', alt: 'robot' }),
          React.createElement(Conversation, { props: this.state.display, handleClick: this.state.display === this.buttonSets[0] ? this.chooseGoal.bind(this) : this.defineTactic.bind(this) })
        );
      }
    }]);

    return FaceNPC;
  }(React.Component);

  var Conversation = function Conversation(_ref) {
    var props = _ref.props,
        handleClick = _ref.handleClick;

    return React.createElement(
      'div',
      null,
      React.createElement(
        'h4',
        null,
        props.title
      ),
      React.createElement(
        'div',
        { className: 'btn-wrapper' },
        props.buttons.map(function (button, index) {
          return React.createElement(
            'button',
            { key: index, className: 'btn', 'data-action': button.action, onClick: handleClick },
            button.text
          );
        })
      )
    );
  };

  var FinishedConversation = function FinishedConversation(_ref2) {
    var result = _ref2.result,
        startBattle = _ref2.startBattle,
        returnToStart = _ref2.returnToStart;

    var currentResult = result();
    var status = void 0,
        action = void 0,
        handle = void 0,
        text = void 0;
    if (currentResult instanceof NPC) {
      status = 'Attempt failed.';
      action = currentResult.name + ' attacks you.';
      handle = startBattle;
      text = 'Fight back';
    } else {
      status = currentResult.status.result;
      action = currentResult.status.log;
      handle = returnToStart;
      text = 'Next turn';
    }
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h3',
        null,
        status
      ),
      React.createElement(
        'h4',
        null,
        action
      ),
      React.createElement(
        'div',
        { className: 'btn-wrapper' },
        React.createElement(
          'button',
          { className: 'next-turn-button', onClick: handle },
          text
        )
      )
    );
  };

  var npc = {
    FaceNPC: FaceNPC,
    Conversation: Conversation,
    FinishedConversation: FinishedConversation
  };

  return npc;
});