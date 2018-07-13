import React from 'react';
import AdminHome from '../AdminPages/AdminHome';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Link } from 'react-router-dom'

class Login extends React.Component {
    
    constructor(props)
    {
        super(props);
        this.state =
        {
            username : '',
            password : '',
            renderHome: false
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

    async handleSubmit(event)
    {
        console.log("pressed submit");
        
        
    }

    // TODO
    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    renderLogin()
    {
        return(
            <div className="Login">
                <form onSubmit={this.handleSubmit}>
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
                <Link to='/admin/'>

                    <Button
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        onClick = {this.handleSubmit}
                    >
                        Login
                    </Button>
                </Link>
                </form>
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