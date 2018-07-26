import React from 'react';
import * as Constants from './Constants';
import * as BasePage from './BasePage';
import './Home.css';
import Cookies from "universal-cookie";


import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

class Login extends React.Component {
    
    constructor(props)
    {
        super(props);
        this.state =
        {
            username : '',
            password : '',
            isLoading : false,
            isValid : false,
            userInfo : {},
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

    verifyInput()
    {
        console.log('verify');
        if(this.state.username.length > 0
            && this.state.password.length > 0)
        {
            this.setState({isValid: true});
        }
        else
            this.setState({isValid: false});
    }

    handleUsernameChange(event)
    {
        this.setState({username: event.target.value});
        this.verifyInput();
    }   

    handlePasswordChange(event)
    {
        this.setState({password: event.target.value});
        this.verifyInput();
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
        if(this.state.isLoading)
            return;

        this.setState({isLoading: true});
        
        if(Constants.IS_MOCK)
        {
            let userInfo = Constants.MOCK_LOGIN_RESPONSE;
            this.setState({isLoading: false});
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

                    this.setState({isLoading: false});
                    this.setCookiesAndPushRoute(resJSON);
                }
                else
                    throw(Constants.getNot200);
            }
            catch(e)
            {
                this.setState({error: e.toString()});
                console.log('Error on fetching data: ' + e);
                this.setState({isLoading: false});
            }
        }
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
                        <div className={classes.wrapper}>

                            <Button 
                            onClick={this.handleSubmit}
                            color="secondary" 
                            autoFocus
                            disabled={!this.state.isValid || this.state.isLoading}
                            >
                                Submit
                            </Button>
                            
                            {this.state.isLoading && 
                                <CircularProgress 
                                    size={24} 
                                    className={classes.buttonProgress} 
                                />
                            }
                        </div>
                    </CardActions>
                </Card> 
            </div>
        );
    }
  }
const styles = theme => ({
    card: {
        minWidth: 500,
        alignSelf : 'flex-end'
    },
    buttonProgress: {
        color: 'secondary',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    wrapper: {
        margin: theme.spacing.unit,
        position: 'relative',
      },
});


Login.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);
