import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Home from './Home';

class App extends React.Component {
    render()
    {
      return(<Home />);
    }
  }
  
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
