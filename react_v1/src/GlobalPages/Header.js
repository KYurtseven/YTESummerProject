import React from 'react';
import * as Constants from './Constants' ;
import * as BasePage from './BasePage';
import tubitak_logo from '../img/tubitak-logo.jpg';
import Cookies from "universal-cookie";
import {
    DropdownButton,
    MenuItem,
    Modal,
    FormGroup,
    FormControl,
    ControlLabel,
    Button
} from 'react-bootstrap';
import './Home.css';

class Header extends React.Component
{   
    constructor(props)
    {
        super(props);
        this.state = 
        {
            isShowChangeMailModal: false,
            newEmail : '',
            error: '',
        }
        this.handleLogout = this.handleLogout.bind(this);

        this.showChangeMailModal = this.showChangeMailModal.bind(this);
        this.hideChangeMailModal = this.hideChangeMailModal.bind(this);
        this.handleChangeMailSubmit = this.handleChangeMailSubmit.bind(this);
        this.handleChangeMailChange = this.handleChangeMailChange.bind(this);
    }


    handleLogout()
    {
        // TO DO
        // If the user keep moved between pages (user/admin)
        // the page is not rendered
        const cookies = new Cookies();
        cookies.remove('userInfo', {path: '/'});
        this.props.history.goBack();
    }

    showChangeMailModal()
    {
        this.setState({isShowChangeMailModal: true});
        
    }
    
    hideChangeMailModal()
    {
        this.setState({isShowChangeMailModal: false, newEmail: ''});
    }

    async handleChangeMailSubmit(event)
    {
        if(BasePage.validateEmail(this.state.newEmail) === 'success')
        {
            var url;
            url = Constants.getRoot() + Constants.changeEmail;

            let body = JSON.stringify({
                username : this.props.userInfo.username,
                email : this.state.newEmail
            });
            
            try
            {
                let res = await BasePage.CallApiPost(url, body);
                if(res.status === 200)
                {
                    //await this.props.fetchDataAgain();
                    // this page will be automatically re-rendered
                    await this.props.fetchDataAgain();
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
 
    handleChangeMailChange(event)
    {
        this.setState({ newEmail: event.target.value }); 

    }

    renderChangeMail()
    {
        return(
            <Modal show={this.state.isShowChangeMailModal} onHide={this.hideChangeMailModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Mail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FormGroup
                        controlId = "formBasicText"
                        validationState = {BasePage.validateEmail(this.state.newEmail)}
                        >
                        <ControlLabel>Type new email</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.newEmail}
                            placeholder="Type new email"
                            onChange={this.handleChangeMailChange}
                        />
                        <FormControl.Feedback />
                        </FormGroup>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick = {this.hideChangeMailModal}>Close</Button>
                    <Button onClick = {this.handleChangeMailSubmit} bsStyle="success">Update</Button>
                </Modal.Footer>
            </Modal>
        );
    }
    renderButtons()
    {
        return(
            <div
                className = "Logout-button">
                <DropdownButton
                    
                    bsStyle = {'default'}
                    title = {'Options'}
                    id = {1}
                >
                    <MenuItem 
                        eventKey= "1"
                        onClick = {this.showChangeMailModal}
                        >
                        Change mail
                    </MenuItem>

                    <MenuItem eventKey="2" active>
                        Active Item
                    </MenuItem>
                    <MenuItem divider />
                    <MenuItem 
                        eventKey="3"
                        onClick = {this.handleLogout}
                        >
                        Logout
                    </MenuItem>
                 </DropdownButton>

                 {this.renderChangeMail()}
            </div>
        );
    }
    render()
    {
        return(
            <header className="App-header">
                <img src={tubitak_logo} className = "App-logo" alt =''/>
                <h1 className = "App-title">TÜBİTAK</h1>
                {this.renderButtons()}
            </header>
            
        );
    }
}

export default Header;
