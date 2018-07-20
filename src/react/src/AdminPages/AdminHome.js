import React, { Component } from 'react';
import '../GlobalPages/Home.css';
import * as Constants from '../GlobalPages/Constants' ;
import * as BasePage from '../GlobalPages/BasePage';
import UserItem from './UserItem';
import 'typeface-roboto';
import Cookies from "universal-cookie";
import Header from '../GlobalPages/Header';
import {
    Modal,
    FormGroup,
    FormControl,
    ControlLabel,
    Button
} from 'react-bootstrap';
import { withRouter } from 'react-router';

class AdminHome extends Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            // initially load the data
            isLoading: true,
            userData : {}, // api response
            userInfo : {}, // cookie
            groupname: '',
            isShowUserModal: false,

            // newuser
            newUserEmail: '',
            newUserUsername : '',
            newUserPassword: '',
            newUserName: '',

            error: ''
        }

        this.showAddUserModal = this.showAddUserModal.bind(this);
        this.hideAddUserModal = this.hideAddUserModal.bind(this);

        this.handleAddUserEmailChange = this.handleAddUserEmailChange.bind(this);
        this.handleAddUserUsernameChange = this.handleAddUserUsernameChange.bind(this);
        this.handleAddUserPasswordChange = this.handleAddUserPasswordChange.bind(this);
        this.handleAddUserNameChange = this.handleAddUserNameChange.bind(this);

        this.handleAddUserSubmit = this.handleAddUserSubmit.bind(this);
    }

    sortByKey(array, key)
    {
        return array.sort(function(a,b){
            var x = a[key]; var y = b[key];
            return((x < y) ? -1: ((x > y) ? 1 : 0));
        });
    }

    async componentDidMount()
    {
        if(Constants.IS_MOCK)
        {
            var tmp = Constants.MOCK_ADMIN_OBJ;
            this.setState({userData: tmp.users, groupname: tmp.groupname, isLoading: false});
        }
        else
        {
            this.setState({isLoading: true});
            var url;
            const cookies = new Cookies();
            let userInfo = cookies.get('userInfo');
            this.setState({userInfo : userInfo});
            
            if(userInfo)
            {
                url = Constants.getRoot() + Constants.adminFetch + cookies.get('userInfo').groupid;
                
                try
                {
                    let res = await BasePage.CallApiGet(url);
                    if(res.status === 200)
                    {
                        let restext = await res.text();
                        let resJSON = JSON.parse(restext);
                        
                        let users = resJSON.users;
                        users = this.sortByKey(users, 'username');
                        this.setState({userData: users, groupname: resJSON.groupname, isLoading: false});
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
            else
            {
                // probably cookie is corrupted
                console.log('no cookie is present');
                this.setState({isLoading: true});
            }
        }
    }

    async fetchDataAgain()
    {
        await this.componentDidMount();
    }

    renderIsLoading()
    {
        return (
            <div className="App">
                <p> Not rendered yet </p>
            </div>
            );
    }

    showAddUserModal()
    {
        this.setState({isShowUserModal: true});
    }

    hideAddUserModal()
    {
        this.setState({isShowUserModal: false});
    }
    
    handleAddUserEmailChange(event)
    {
        this.setState({newUserEmail : event.target.value});
    }
    
    handleAddUserUsernameChange(event)
    {
        this.setState({newUserUsername: event.target.value});
    }

    handleAddUserPasswordChange(event)
    {
        this.setState({newUserPassword: event.target.value});
    }

    handleAddUserNameChange(event)
    {
        this.setState({newUserName: event.target.value});
    }

    checkValidity()
    {
        if(this.state.newUserUsername.length >= 5)
        {
            if(BasePage.validateEmail(this.state.newUserEmail) === 'success')
            {
                if(this.state.newUserPassword.length >= 5)
                {
                    return true;
                }
            }
        }
        return false;
    }

    async handleAddUserSubmit()
    {
        if(this.checkValidity())
        {
            try
            {
                var url;
                url = Constants.getRoot() + Constants.addUser;

                let body = JSON.stringify({
                    username : this.state.newUserUsername,
                    email : this.state.newUserEmail,
                    password : this.state.newUserPassword,
                    name : this.state.newUserName,
                    groupid : this.state.userInfo.groupid
                });
                    
                let res = await BasePage.CallApiPost(url, body);
               
                if(res.status === 200)
                {
                    let restext = await res.text();
                    let resJSON = JSON.parse(restext);
                    if(resJSON.error !== '')
                        throw(resJSON.error);

                    this.hideAddUserModal();
                    await this.fetchDataAgain();
                    //this page will be automatically re-rendered
                }
                else
                    throw(Constants.postNot200);
            }
            catch(e)
            {
                this.setState({error: e});
                console.log('Error on adduser submit' + this.state.error);
            }
        }
        else
        {
            alert("Check fields");
        }
    }

    renderAddUserModal()
    {
        return(
            <Modal show={this.state.isShowUserModal} onHide={this.hideAddUserModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>

                        <FormGroup
                        controlId = "formUsername"
                        validationState = {this.state.newUserUsername.length >= 5 ? 'success' : 'error'}
                        >
                        <ControlLabel>Username</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.newUserUsername}
                            placeholder="Type new username"
                            onChange={this.handleAddUserUsernameChange}
                        />
                        <FormControl.Feedback />
                        </FormGroup>


                        <FormGroup
                        controlId = "formEmail"
                        validationState = {BasePage.validateEmail(this.state.newUserEmail)}
                        >
                        <ControlLabel>Email</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.newUserEmail}
                            placeholder="Type new email"
                            onChange={this.handleAddUserEmailChange}
                        />
                        <FormControl.Feedback />
                        </FormGroup>


                        <FormGroup
                        controlId = "formName"
                        >
                        <ControlLabel>Name</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.newUserName}
                            placeholder="Type name"
                            onChange={this.handleAddUserNameChange}
                        />
                        <FormControl.Feedback />
                        </FormGroup>


                        <FormGroup
                        controlId = "formPassword"
                        validationState = {this.state.newUserPassword.length >= 5 ? 'success' : 'error'}
                        >
                        <ControlLabel>Password</ControlLabel>
                        <FormControl
                            type="password"
                            value={this.state.newUserPassword}
                            placeholder="Type password"
                            onChange={this.handleAddUserPasswordChange}
                        />
                        <FormControl.Feedback />
                        </FormGroup>

                    </form>

                    {this.state.error}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick = {this.hideAddUserModal}>Close</Button>
                    <Button onClick = {this.handleAddUserSubmit} bsStyle="success">Update</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    renderTable(renderCassandra)
    {
        return(
            <div style= {{margin: 20}}>
                <div className="divTable Table">
                    <div className="divTableHeading">
                        <div className="divTableRow">
                            <div className="divTableHead" style={{width: 50}}>
                            <Button bsStyle="primary" bsSize="sm" onClick={this.showAddUserModal}>
                                +
                            </Button>
                            </div>
                            <div className="divTableHead">User name</div>
                            <div className="divTableHead">Name</div>
                            <div className="divTableHead">E-mail</div>
                            <div className="divTableHead" style = {{width:100}} >Deposit</div>
                            <div className="divTableHead">User type</div>
                        </div>
                    </div>
                        
                    {renderCassandra}

                    {this.renderAddUserModal()}
                </div>
            </div>
        );
    }

    render()
    {
        if(this.state.isLoading)
            return (this.renderIsLoading());
        else
        {
            var renderCassandra = []
            for(let i = 0; i < this.state.userData.length; i++)
            {
                renderCassandra.push(
                    <UserItem
                        key = {i}
                        userData = {this.state.userData[i]}
                        fetchDataAgain = {this.fetchDataAgain.bind(this)}
                    />
                );
            }
            return(
                <div>
                    <Header name = {this.state.groupname}/>
                    
                    <div style={{marginTop: 100}}/>
                    
                    {renderCassandra}
              </div>
            );
        }
    }
}


export default withRouter(AdminHome);