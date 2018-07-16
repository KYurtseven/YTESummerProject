import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Login from './GlobalPages/Login';
import { BrowserRouter,Switch, Route } from 'react-router-dom'
import AdminHome from './AdminPages/AdminHome';
import UserHome from './UserPages/UserHome';

class App extends React.Component { 
    render()
    {
      return(
        <div>
          <Main />
        </div>
    );
    }
  }

const Main = () => (
  <main>
    <Switch>
      <Route exact path = '/' component = {Login}/>
      <Route path = '/admin' component = {AdminHome}/>
      <Route path = '/user'  component = {UserHome}/>
    </Switch>
  </main>
)
/*
return(<Login/>);
*/
ReactDOM.render(
  (<BrowserRouter>
    <App />
  </BrowserRouter>)
  , document.getElementById('root'));
registerServiceWorker();
