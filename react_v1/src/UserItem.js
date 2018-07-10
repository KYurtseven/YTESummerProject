import React, { Component } from 'react';
import * as Constants from './Constants' ;
import * as BasePage from './BasePage';
import './Home.css';
import {
    Button, 
    Modal,
    FormGroup,
    ControlLabel,
    FormControl
} from 'react-bootstrap';


class UserItem extends Component 
{
    constructor(props)
    {
        super(props);
        this.state = {
            dateValue : '',
            depositValue: '',
            isShowDateModal: false,
            isShowDepositModal: false
        };

        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleDateSubmit = this.handleDateSubmit.bind(this);

        this.handleDepositChange = this.handleDepositChange.bind(this);
        this.handleDepositSubmit = this.handleDepositSubmit.bind(this);
   
        this.showDateModal = this.showDateModal.bind(this);
        this.hideDateModal = this.hideDateModal.bind(this);

        this.showDepositModal = this.showDepositModal.bind(this);
        this.hideDepositModal = this.hideDepositModal.bind(this);

    }

    // DATE FUNCTIONS

    // sets state of the date entry
    handleDateChange(event)
    {
        this.setState({dateValue: event.target.value});
    }

    // post to the database
    handleDateSubmit(event)
    {
        if(BasePage.isValidDate(this.state.dateValue))
        {
            var url;
            url = Constants.getRoot() + Constants.addDate;

            let body = JSON.stringify({
                username : this.props.userInfo.username,
                date : this.state.dateValue
            });
            BasePage.CallApiPost(url, body);

            // TO DO
            event.preventDefault(); // how it works? What is it?
            this.setState({isShowDateModal : false});
        }
        else
        {
            alert('Please enter date as yyyy-MM-dd, entered value was: ' + this.state.dateValue);
        }
    }

    showDateModal()
    {
        this.setState({isShowDateModal: true});
    }

    hideDateModal() {
        this.setState({isShowDateModal: false});
    }

    renderDateModal()
    {
        return(
            <Modal show={this.state.isShowDateModal} onHide={this.hideDateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Late Date</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FormGroup
                        controlId = "formBasicText"
                        validationState = {BasePage.isValidDate(this.state.dateValue)}
                        >
                        <ControlLabel>Enter late date, format is yyyy-MM-dd</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.dateValue}
                            placeholder="Enter text"
                            onChange={this.handleDateChange}
                        />
                        <FormControl.Feedback />
                        </FormGroup>
                    </form>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick = {this.hideDateModal}>Close</Button>
                    <Button onClick = {this.handleDateSubmit} bsStyle="success">ADD</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    // END OF DATE FUNCTIONS
    
    
    // DEPOSIT FUNCTIONS

    // sets state of the deposit entry
    handleDepositChange(event)
    {
        this.setState({depositValue: event.target.value});
    }

    // post to the database
    handleDepositSubmit(event)
    {
        if(!isNaN(this.state.depositValue))
        {
            var url;
            url = Constants.getRoot() + Constants.updateDeposit;

            let body = JSON.stringify({
                username : this.props.userInfo.username,
                deposit : this.state.depositValue
            });
            //BasePage.CallApiPost(url, body).done(() => {});
            BasePage.CallApiPost(url, body);

            this.setState({isShowDepositModal : false});
        }
        else
        {
            alert("Please enter an integer");
        }
    }

    showDepositModal()
    {
        this.setState({isShowDepositModal: true});
    }

    hideDepositModal() {
        this.setState({isShowDepositModal: false});
    }

    renderDepositModal()
    {
        return(
            <Modal show={this.state.isShowDepositModal} onHide={this.hideDepositModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Deposit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FormGroup
                        controlId = "formBasicText"
                        validationState = {(!isNaN(this.state.depositValue) && this.state.depositValue != '') ? 'success' : 'error'}
                        >
                        <ControlLabel>Enter deposit</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.depositValue}
                            placeholder="Enter value"
                            onChange={this.handleDepositChange}
                        />
                        <FormControl.Feedback />
                        </FormGroup>
                    </form>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick = {this.hideDepositModal}>Close</Button>
                    <Button onClick = {this.handleDepositSubmit} bsStyle="success">Update</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    // END OF DEPOSIT FUNCTIONS


    renderNoLateData()
    {
        return(
            <div>
                <p className= "User-text-right">No Late Data</p>
            </div>
        );
    }

    renderLateDates(lateDates)
    {
        return(
            <div>
                {lateDates}
            </div>
        );
    }

    render()
    {
        var lateDates = [];
        var isDataAcceptable = true;
        if(this.props.userInfo.dates === null || this.props.userInfo.dates === undefined)
            isDataAcceptable = false;
    
        for(var i = 0; isDataAcceptable && i < this.props.userInfo.dates.length; i++)
        {
            lateDates.push(
                <LateDates 
                    key = {i}
                    date = {this.props.userInfo.dates[i]}/>
            );
        }

        return(
            <div className= "User-div-container">
                <div className = "User-div-left">
                    <div className = "User-text-left">
                        <p>username: {this.props.userInfo.username}</p>
                        <p>email: {this.props.userInfo.email}</p>
                        <p>name: {this.props.userInfo.name}</p>
                        <p>deposit: {this.props.userInfo.deposit}</p>
                        <p>userType: {this.props.userInfo.usertype}</p>
                    </div>
                </div>
                <div className = "User-div-right">
                    {isDataAcceptable ? this.renderLateDates(lateDates) : this.renderNoLateData()}

                    <Button bsStyle="primary" bsSize="large" onClick={this.showDateModal}>
                        Add Late Date
                    </Button>

                    <Button bsStyle="primary" bsSize="large" onClick={this.showDepositModal}>
                        Update Deposit
                    </Button>

                    {this.renderDateModal()}
                    {this.renderDepositModal()}
                </div>
            </div>
        );
    }
}

/**
 <div>
                        <form onSubmit={this.handleDateSubmit}>
                            <label>
                                Add Late Date:
                                <textarea value={this.state.dateValue} onChange={this.handleDateChange} />
                            </label>
                            <input type="submit" value="Submit" />
                        </form>
                    </div>
 */
const LateDates = (props) =>
{
    return(
        <li className = "User-text-right" >{props.date}</li>
    );
}

export default UserItem;