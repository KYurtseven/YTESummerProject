import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Login from './GlobalPages/Login';
import { BrowserRouter,Switch, Route } from 'react-router-dom'
import AdminHome from './AdminPages/AdminHome';
import UserHome from './UserPages/UserHome';
import Profile from './GlobalPages/Profile';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#E91E63', //pink500
    },
    secondary: {
      main: '#E91E63', //pink500
      // dark: will be calculated from palette.secondary.main,
    },
  },
});

class App extends React.Component { 
    render()
    {
      return(
        <div>
          <MuiThemeProvider theme={theme}>
            <Main />
          </MuiThemeProvider>
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
      <Route path = '/profile' component = {Profile}/>
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
