"use strict";

define(['react'], function (React) {

  var FaceEnemy = function FaceEnemy(_ref) {
    var enemy = _ref.enemy,
        startBattle = _ref.startBattle,
        escape = _ref.escape;

    var currentEnemy = enemy();
    return React.createElement(
      "div",
      { className: "image-screen" },
      React.createElement(
        "h3",
        null,
        "Enemy on your way: ",
        currentEnemy.name,
        " (level: ",
        currentEnemy.level,
        ")."
      ),
      React.createElement("img", { className: "image", src: "img/robot.jpg", alt: "robot" }),
      React.createElement(
        "h4",
        null,
        "Will you fight?"
      ),
      React.createElement(
        "div",
        { className: "btn-wrapper" },
        React.createElement(
          "button",
          { className: "btn", onClick: startBattle },
          "Fight"
        ),
        React.createElement(
          "button",
          { className: "btn", onClick: escape },
          "Escape"
        )
      )
    );
  };

  var Escaped = function Escaped(_ref2) {
    var returnToStart = _ref2.returnToStart;

    return React.createElement(
      "div",
      null,
      React.createElement(
        "h3",
        null,
        "You have escaped successfully."
      ),
      React.createElement(
        "div",
        { className: "btn-wrapper" },
        React.createElement(
          "button",
          { className: "next-turn-button", onClick: returnToStart },
          "Next turn"
        )
      )
    );
  };

  var BattleOver = function BattleOver(_ref3) {
    var results = _ref3.results,
        player = _ref3.player,
        returnToStart = _ref3.returnToStart,
        levelUp = _ref3.levelUp;

    var battleResults = results();
    return React.createElement(
      "div",
      null,
      React.createElement(
        "h3",
        { className: "underline" },
        battleResults.escaped === 'notescaped' ? 'Escape failed' : null
      ),
      React.createElement(
        "h4",
        null,
        "The battle is over."
      ),
      React.createElement(
        "h3",
        null,
        battleResults.winner.name,
        " won!"
      ),
      React.createElement(
        "h4",
        { className: "underline" },
        "Battle results:"
      ),
      React.createElement(
        "h4",
        null,
        battleResults.log
      ),
      React.createElement(
        "div",
        { className: "btn-wrapper" },
        React.createElement(
          "button",
          { className: "next-turn-button", onClick: battleResults.winner === player() ? levelUp : returnToStart },
          battleResults.winner === player() ? 'Level up' : 'Next turn'
        )
      )
    );
  };

  var LevelUp = function LevelUp(_ref4) {
    var raise = _ref4.raise,
        trackValue = _ref4.trackValue,
        getStat = _ref4.getStat;

    return React.createElement(
      "div",
      null,
      React.createElement(
        "h3",
        null,
        "You have got a new level."
      ),
      React.createElement(
        "h4",
        null,
        "Which stat would you like to raise?"
      ),
      React.createElement(
        "select",
        { className: "level-up-stat", defaultValue: getStat() || 'str', onChange: trackValue },
        React.createElement(
          "option",
          { value: "str" },
          "strength"
        ),
        React.createElement(
          "option",
          { value: "dex" },
          "dexterity"
        ),
        React.createElement(
          "option",
          { value: "int" },
          "intellect"
        ),
        React.createElement(
          "option",
          { value: "luc" },
          "luck"
        )
      ),
      React.createElement(
        "div",
        { className: "btn-wrapper" },
        React.createElement(
          "button",
          { className: "btn", onClick: raise },
          "Confirm"
        )
      )
    );
  };
  var fight = {
    FaceEnemy: FaceEnemy,
    Escaped: Escaped,
    BattleOver: BattleOver,
    LevelUp: LevelUp
  };

  return fight;
});