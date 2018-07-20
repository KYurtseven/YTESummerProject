import React from 'react';
import * as Constants from './Constants';
import * as BasePage from './BasePage';
import './Home.css';
import Cookies from "universal-cookie";

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

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
    
    componentWillMount()
    {
        const cookies = new Cookies();
        let tmpcookie = cookies.get('userInfo')
        if(tmpcookie)
        {
            if(tmpcookie.usertype === 'admin')
            {
                this.props.history.push('/admin/');
            }
            else if(tmpcookie.usertype === 'user')
            {
                this.props.history.push('/user/');
            }
        }
            
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

                if(res.status === 200 && res.error !== '')
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
                this.setState({error: e.toString()});
                console.log('Error on fetching data: ' + e);
            }
        }
        this.setState({isPressed: false});
    }

    validateForm()
    {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    render()
    {
        const { classes } = this.props;
        
        // TO DO, fix marginTop value
        return(
            <div style = {{display: 'flex', justifyContent: 'center', marginTop: 250}} >
                <Card className={classes.card}>
                    <CardContent>
                        <form style={{display: 'flex',flexWrap: 'wrap',}} noValidate>
                            <TextField
                                id="username"
                                label="Username"
                                type="text"
                                onChange={this.handleUsernameChange}
                                style={{flex:1}}
                                InputLabelProps={{
                                shrink: true,
                                }}
                            />
                        </form>
                        <div style={{marginTop:20}}/>
                        <form style={{display: 'flex',flexWrap: 'wrap',}} noValidate>
                            <TextField
                                id="password"
                                label="Password"
                                type="password"
                                onChange={this.handlePasswordChange}
                                style={{flex: 1}}
                                InputLabelProps={{
                                shrink: true,
                                }}
                            />
                        </form>
                    </CardContent>

                    <CardActions style={{float: 'right'}}>
                        <Button 
                        onClick={this.handleSubmit}
                        color="secondary" autoFocus>
                            Submit
                        </Button>
                    </CardActions>
                </Card> 
            </div>
        );
    }
  }
const styles = {
    card: {
        minWidth: 500,
        alignSelf : 'flex-end'
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        marginBottom: 16,
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
};


Login.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);
