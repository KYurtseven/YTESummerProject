import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Login from './GlobalPages/Login';
import { BrowserRouter,Switch, Route,Link  } from 'react-router-dom'
import AdminHome from './AdminPages/AdminHome';

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

const Header = () => (
  <header>
    <nav>
      <ul>
        <li><Link to='/'>Login</Link></li>
        <li><Link to='/admin/'>Home</Link></li>
      </ul>
    </nav>
  </header>
)
const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Login}/>
      <Route path='/admin/' component={AdminHome}/>
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
