import React from 'react';
import * as Constants from './Constants' ;
import * as BasePage from './BasePage';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Cookies from "universal-cookie";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import Header from './Header';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

class Profile extends React.Component
{  
    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }
    
    constructor(props)
    {
        super(props);
        this.state = 
        {
            userInfo : {},
            newEmail : '',
            newPassword: '',
            isLoadingEmail : false,
            isLoadingPassword : false,
        }
        
        this.handleChangeMailSubmit = this.handleChangeMailSubmit.bind(this);
        this.handleChangeMailChange = this.handleChangeMailChange.bind(this);

        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
    }

    componentWillMount()
    {
        const cookies = new Cookies();
        let tmpcookie = cookies.get('userInfo') 
        this.setState({userInfo: tmpcookie});
    }

    handleChangeMailChange(event)
    {
        this.setState({ newEmail: event.target.value }); 
    }

    async handleChangeMailSubmit(event)
    {
        if(BasePage.validateEmail(this.state.newEmail) === 'success')
        {
            if(this.state.isLoadingEmail)
                return;

            this.setState({isLoadingEmail: true});
            
            var url;
            url = Constants.getRoot() + Constants.changeEmail;

            let body = JSON.stringify({
                username : this.state.userInfo.username,
                email : this.state.newEmail
            });
            
            try
            {
                let res = await BasePage.CallApiPost(url, body);
                if(res.status === 200)
                {
                    this.setState({isLoadingEmail: false});
                    this.props.history.goBack();
                }
                else
                    throw(Constants.postNot200);
            }
            catch(e)
            {
                this.setState({error: e});
                console.log('Error on change mail submit' + this.state.error);
                this.setState({isLoadingEmail: false});
            }
        }
        else
        {
            alert("Please enter valid email address");
        }
    }

    renderEmail()
    {
        const { classes } = this.props;

        return(
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Change Email</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{display: 'table', width: '100%'}} >
                    <TextField
                        id="email"
                        label="Email"
                        style={{width: '100%'}}
                        value={this.state.newEmail}
                        onChange={this.handleChangeMailChange}
                        margin="normal"
                    />

                    <div className={classes.wrapper}>
                        <Button 
                            variant="contained" 
                            size="small"  
                            //style={{float: 'right', marginRight: 40}}
                            disabled = {this.state.isLoadingEmail}
                            onClick = {this.handleChangeMailSubmit}
                        >
                            <SaveIcon style = {{fontSize: 12}} />
                            Save
                        </Button>
                        {this.state.isLoadingEmail && 
                            <CircularProgress 
                                size={24} 
                                className={classes.buttonProgress} 
                            />
                        }

                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>

        );
    }

    handlePasswordChange(event)
    {
        this.setState({newPassword : event.target.value});
    }

    async handlePasswordSubmit()
    {
        if(this.state.isLoadingPassword)
            return;

        this.setState({isLoadingPassword: true});
        
        var url;
        url = Constants.getRoot() + Constants.changePassword;

        let body = JSON.stringify({
            username : this.state.userInfo.username,
            password : this.state.newPassword
        });
        
        try
        {
            let res = await BasePage.CallApiPost(url, body);
            if(res.status === 200)
            {
                this.setState({isLoadingPassword: false});
                this.props.history.goBack();
            }
            else
                throw(Constants.postNot200);
        }
        catch(e)
        {
            this.setState({error: e});
            console.log('Error on change password submit' + this.state.error);
            this.setState({isLoadingPassword: false});
        }
        
    }

    renderPassword()
    {
        const { classes } = this.props;

        return(
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Change Password</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{display: 'table', width: '100%'}} >
                    <TextField
                        id="password"
                        label="password"
                        type="password"
                        style={{width: '100%'}}
                        value={this.state.newPassword}
                        onChange={this.handlePasswordChange}
                        margin="normal"
                    />

                    <div className={classes.wrapper}>
                        <Button 
                            variant="contained" 
                            size="small"  
                            disabled = {this.state.isLoadingPassword}
                            onClick = {this.handlePasswordSubmit}
                        >
                            <SaveIcon style = {{fontSize: 12}} />
                            Save
                        </Button>
                        {this.state.isLoadingPassword && 
                            <CircularProgress 
                                size={24} 
                                className={classes.buttonProgress} 
                            />
                        }
                    </div>

                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }

    render()
    {
        return(
        <div style = {{marginTop: 100}} >
            
            <Header name = {'TÜBİTAK'}/>
            
            {this.renderEmail()}

            {this.renderPassword()}

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
        float: 'right',
        marginRight: 40
      },
});


Profile.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Profile));
