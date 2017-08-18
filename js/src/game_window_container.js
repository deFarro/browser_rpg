define(['react'], function (React) {

  const FaceContainer = ({container, breakLock}) => {
    const currentContainer = container();
    return (
      <div className="image-screen">
        <h3>You have found a safe.</h3>
        <img className="image" src= "img/safe.jpg" alt="robot" />
        <h4>Lock level: {currentContainer.lock.level}, seems to be {currentContainer.lock.electric === 1 ? 'electronic' : 'mechanic'}.</h4>
        <div className="btn-wrapper">
          <button className="btn" onClick={breakLock}>{currentContainer.lock.electric === 1 ? 'Try to hack' : 'Try to lockpick'}</button>
        </div>
      </div>
    )
  };

  const FaceItem = ({result, player, equipPlayer, equipCompanion}) => {
    const status = result().status;
    return (
      <div>
        <h3>{status.result}</h3>
        <h4 className="underline">{status.log}</h4>
        <h4>{status.stats}</h4>
        <div className="btn-wrapper">
          <button className="btn" onClick={equipPlayer}> Equip yourself</button>
          {player().companion ? <button className="btn" onClick={equipCompanion}>To companion</button> : null}
        </div>
      </div>
    )
  }

  const FinishedContainer = ({status, returnToStart}) => {
    return (
      <div>
        <h3>{status()}</h3>
        <div className="btn-wrapper">
          <button className="next-turn-button" onClick={returnToStart}>Next turn</button>
        </div>
      </div>
    )
  }
  
  const container = {
    FaceContainer,
    FaceItem,
    FinishedContainer
  }

  return container;
});
