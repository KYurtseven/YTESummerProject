import React from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import * as Constants from './Constants';
import * as BasePage from './BasePage';

import Cookies from "universal-cookie";

class Login extends React.Component {
    
    constructor(props)
    {
        super(props);
        this.state =
        {
            username : '',
            password : '',
            isPressed : false,
            renderHome: false,
            userInfo : {},
            toPage : ''
        }
        
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    async componentWillMount()
    {

    }

    handleUsernameChange(event)
    {
        this.setState({username: event.target.value});
    }

    handlePasswordChange(event)
    {
        this.setState({password: event.target.value});
    }

    setCookiesAndPushRoute(userInfo)
    {
        const cookies = new Cookies();
        cookies.set('userInfo', userInfo, {path : '/'})
            
        if(userInfo.usertype === 'admin')
        {
            this.props.history.push('/admin/');
        }
        else if(userInfo.usertype === 'user')
        {
            this.props.history.push('/user/');
        }
        else
            return;
    }
    async handleSubmit(event)
    {
        // TO DO
        this.setState({isPressed: true});
        
        if(Constants.IS_MOCK)
        {
            let userInfo = Constants.MOCK_LOGIN_RESPONSE;
            this.setCookiesAndPushRoute(userInfo);
        }
        else
        {
            let url =   Constants.getRoot() + 
                        Constants.login + 
                        this.state.username + "/" + 
                        this.state.password;
            try
            {
                let res = await BasePage.CallApiGet(url);

                if(res.status === 200 && res.error != '')
                {
                    let restext = await res.text();
                    let resJSON = JSON.parse(restext);
                    
                    this.setCookiesAndPushRoute(resJSON);
                }
                else
                    throw(Constants.getNot200);
            }
            catch(e)
            {
                this.setState({error: e});
                console.log('Error on fetching data: ' + e);
            }
        }
        this.setState({isPressed: false});
    }

    validateForm()
    {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    renderLogin()
    {
        return(
            <div className="Login">
                    <FormGroup controlId="username" bsSize="large">
                        <ControlLabel>Username</ControlLabel>
                        <FormControl
                        autoFocus
                        type="username"
                        value={this.state.username}
                        onChange={this.handleUsernameChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="password" bsSize="large">
                        <ControlLabel>Password</ControlLabel>
                        <FormControl
                        value={this.state.password}
                        onChange={this.handlePasswordChange}
                        type="password"
                        />
                    </FormGroup>

                    <Button
                        block
                        bsSize="large"
                        disabled={!this.validateForm() || this.state.isPressed}
                        type="submit"
                        onClick = {this.handleSubmit}
                    >
                        Login
                    </Button>
                    <h1>{this.state.error}</h1>
            </div>
        );
    }
    render()
    {

        return(
            this.renderLogin()
        );
    }
  }
  
export default Login;