import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import "./App.css";

import { NavBar } from './components/Navbar/navbar';
import { Login } from './containers/Login/Login';
import { Register } from './containers/Register/Register';
import { Home } from './containers/Home/Home';

function App() {

  return (
    <div className="App">
      <Router>
        <div id='navbarDiv'>
          <NavBar/>
        </div>
        <Switch>
          <Route path='/login' component={ Login } />
          <Route path='/register' component={ Register } />
          <Route path='/' component={ Home } />
        </Switch>
      </Router>
    </div>
  );
}

export default App;