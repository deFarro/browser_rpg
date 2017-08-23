"use strict";

define(['react'], function (React) {

  var FaceContainer = function FaceContainer(_ref) {
    var container = _ref.container,
        breakLock = _ref.breakLock;

    var currentContainer = container();
    return React.createElement(
      "div",
      { className: "image-screen" },
      React.createElement(
        "h3",
        null,
        "You have found a safe."
      ),
      React.createElement("img", { className: "image", src: "img/safe.jpg", alt: "robot" }),
      React.createElement(
        "h4",
        null,
        "Lock level: ",
        currentContainer.lock.level,
        ", seems to be ",
        currentContainer.lock.electric === 1 ? 'electronic' : 'mechanic',
        "."
      ),
      React.createElement(
        "div",
        { className: "btn-wrapper" },
        React.createElement(
          "button",
          { className: "btn", onClick: breakLock },
          currentContainer.lock.electric === 1 ? 'Try to hack' : 'Try to lockpick'
        )
      )
    );
  };

  var FaceItem = function FaceItem(_ref2) {
    var result = _ref2.result,
        player = _ref2.player,
        equipPlayer = _ref2.equipPlayer,
        equipCompanion = _ref2.equipCompanion;

    var status = result().status;
    return React.createElement(
      "div",
      null,
      React.createElement(
        "h3",
        null,
        status.result
      ),
      React.createElement(
        "h4",
        { className: "underline" },
        status.log
      ),
      React.createElement(
        "h4",
        null,
        status.stats
      ),
      React.createElement(
        "div",
        { className: "btn-wrapper" },
        React.createElement(
          "button",
          { className: "btn", onClick: equipPlayer },
          " Equip yourself"
        ),
        player().companion ? React.createElement(
          "button",
          { className: "btn", onClick: equipCompanion },
          "To companion"
        ) : null
      )
    );
  };

  var FinishedContainer = function FinishedContainer(_ref3) {
    var status = _ref3.status,
        returnToStart = _ref3.returnToStart;

    return React.createElement(
      "div",
      null,
      React.createElement(
        "h3",
        null,
        status()
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

  var container = {
    FaceContainer: FaceContainer,
    FaceItem: FaceItem,
    FinishedContainer: FinishedContainer
  };

  return container;
});