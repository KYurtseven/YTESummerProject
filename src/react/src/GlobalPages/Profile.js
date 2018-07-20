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
            newEmail : ''
        }
        
        this.handleChangeMailSubmit = this.handleChangeMailSubmit.bind(this);
        this.handleChangeMailChange = this.handleChangeMailChange.bind(this);

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
                    this.props.history.goBack();
                }
                else
                    throw(Constants.postNot200);
            }
            catch(e)
            {
                this.setState({error: e});
                console.log('Error on change mail submit' + this.state.error);
            }
        }
        else
        {
            alert("Please enter valid email address");
        }
    }

    render()
    {
        return(
            <div style={{width: '100%'}}>
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
                    <Button 
                        variant="contained" 
                        size="small"  
                        style={{float: 'right', marginRight: 40}}
                        onClick = {this.handleChangeMailSubmit}
                    >
                        <SaveIcon style = {{fontSize: 12}} />
                        Save
                    </Button>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            </div>
        );
    }
}

export default withRouter(Profile);