import React, { Component } from 'react';
// import AddQuestion from './containers/addQuestion';
// import AdminPage from './AdminPage';
import Check from './Check';
import {BrowserRouter as Router} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Check />          
        </Router>
      </div>
    );
  }
}

export default App;
