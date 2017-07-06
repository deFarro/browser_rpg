'use strict';

requirejs.config({
  baseUlr: 'js/',
  paths: {
    react: 'lib/react',
    react_dom: 'lib/react-dom'
  }
});

requirejs(['react', 'react_dom', 'game'], function(React, ReactDOM) {

  class MainWindow extends React.Component {

    render() {
      return (
        <div>
          <h1 className="gameTitle">Future In The Past</h1>
          <p className="mainContent" onClick={initCharacterSetup}>START ADVENTURES</p>
        </div>
      )
    }
  }

  function initCharacterSetup(event) {
    event.currentTarget.innerHTML = "SETUP YOUR CHARACTER";
    document.querySelector('h1').classList.add('clickedTitle');
    event.currentTarget.classList.add('frameAppear');
  }

  ReactDOM.render(<MainWindow />, document.getElementById('root'));
});
