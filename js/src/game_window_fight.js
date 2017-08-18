define(['react'], function (React) {

  const FaceEnemy = ({enemy, startBattle, escape}) => {
    const currentEnemy = enemy();
    return (
      <div className="image-screen">
        <h3>Enemy on your way: {currentEnemy.name} (level: {currentEnemy.level}).</h3>
        <img className="image" src= "img/robot.jpg" alt="robot" />
        <h4>Will you fight?</h4>
        <div className="btn-wrapper">
          <button className="btn" onClick={startBattle}>Fight</button>
          <button className="btn" onClick={escape}>Escape</button>
        </div>
      </div>
    )
  };

  const Escaped = ({returnToStart}) => {
    return (
      <div>
        <h3>You have escaped successfully.</h3>
        <div className="btn-wrapper">
          <button className="next-turn-button" onClick={returnToStart}>Next turn</button>
        </div>
      </div>
    )
  }

  const BattleOver = ({results, player, returnToStart, levelUp}) => {
    const battleResults = results();
    return (
      <div>
        <h3 className="underline">{battleResults.escaped === 'notescaped' ? 'Escape failed' : null}</h3>
        <h4>The battle is over.</h4>
        <h3>{battleResults.winner.name} won!</h3>
        <h4 className="underline">Battle results:</h4>
        <h4>{battleResults.log}</h4>
        <div className="btn-wrapper">
          <button className="next-turn-button" onClick={battleResults.winner === player() ? levelUp : returnToStart}>{battleResults.winner === player() ? 'Level up' : 'Next turn'}</button>
        </div>
      </div>
    )
  }

  const LevelUp = ({raise, trackValue, getStat}) => {
    return (
      <div>
        <h3>You have got a new level.</h3>
        <h4>Which stat would you like to raise?</h4>
        <select className="level-up-stat" defaultValue={getStat() || 'str'} onChange={trackValue}>
          <option value="str">strength</option>
          <option value="dex">dexterity</option>
          <option value="int">intellect</option>
          <option value="luc">luck</option>
        </select>
        <div className="btn-wrapper">
          <button className="btn" onClick={raise}>Confirm</button>
        </div>
      </div>
    )
  }
  const fight = {
    FaceEnemy,
    Escaped,
    BattleOver,
    LevelUp
  }

  return fight;
});
