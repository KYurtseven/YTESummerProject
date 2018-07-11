import React, { Component } from 'react';
import * as Constants from './Constants' ;
import * as BasePage from './BasePage';
import './Home.css';
import {
    Button, 
    Modal,
    FormGroup,
    ControlLabel,
    FormControl,
    ListGroup,
    ListGroupItem,
    ButtonToolbar
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
            isShowDepositModal: false,
            isShowDeleteDateModal : false,
            dates : [],
            error: ''
        };

        // Add Date
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleDateSubmit = this.handleDateSubmit.bind(this);

        this.showDateModal = this.showDateModal.bind(this);
        this.hideDateModal = this.hideDateModal.bind(this);

        // Deposit
        this.handleDepositChange = this.handleDepositChange.bind(this);
        this.handleDepositSubmit = this.handleDepositSubmit.bind(this);
   
        this.showDepositModal = this.showDepositModal.bind(this);
        this.hideDepositModal = this.hideDepositModal.bind(this);

        // Delete Date
        this.handleDeleteDateSubmit = this.handleDeleteDateSubmit.bind(this);

        this.showDeleteDateModal = this.showDeleteDateModal.bind(this);
        this.hideDeleteDateModal = this.hideDeleteDateModal.bind(this);
    }

    componentWillMount()
    {
        try
        {
            var myarr = []
            for(var i = 0; i < this.props.userInfo.dates.length; i++)
            {
                let tmpval = {};
                tmpval.date = this.props.userInfo.dates[i];
                tmpval.isSelected = false;
                myarr.push(tmpval);
            }
            this.setState({dates : myarr});
        }
        catch(error)
        {
            console.log('Error useritem componentwillmount: ' + error);
        }
    }
    // DATE FUNCTIONS

    // sets state of the date entry
    handleDateChange(event)
    {
        this.setState({dateValue: event.target.value});
    }

    // post to the database
    async handleDateSubmit(event)
    {
        if(BasePage.isValidDate(this.state.dateValue) == 'success')
        {
            var url;
            url = Constants.getRoot() + Constants.addDate;

            let body = JSON.stringify({
                username : this.props.userInfo.username,
                date : this.state.dateValue
            });

            try
            {
                let res = await BasePage.CallApiPost(url, body);
                if(res.status == 200)
                {
                    await this.props.fetchDataAgain();
                }
                else
                    throw(Constants.postNot200);
            }
            catch(e)
            {
                this.setState({error: e});
                console.log('Error on date submit: ' + this.state.error);
            }
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
    async handleDepositSubmit(event)
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
            
            try
            {
                let res = await BasePage.CallApiPost(url, body);
                if(res.status == 200)
                {
                    await this.props.fetchDataAgain();
                    // this page will be automatically re-rendered
                }
                else
                    throw(Constants.postNot200);
            }
            catch(e)
            {
                this.setState({error: e});
                console.log('Error on deposit submit' + this.state.error);
            }
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

    
    // DELETE DATE FUNCTIONS

    showDeleteDateModal()
    {
        this.setState({isShowDeleteDateModal: true});
    }

    hideDeleteDateModal()
    {
        this.setState({isShowDeleteDateModal: false});
    }

    async handleDeleteDateSubmit(event)
    {
        console.log("handle delete date SUBMIT");
        // we need to send the NOTSELECTED dates to the server
        // to update the server

        var notSelectedDates = [];

        for(var i = 0; i < this.state.dates.length; i++)
        {
            if(!this.state.dates[i].isSelected)
            {
                notSelectedDates.push(
                    this.state.dates[i].date
                );
            }
        }
        console.log("not selected dates: " + notSelectedDates);

        try
        {
            var url;
            url = Constants.getRoot() + Constants.deleteDates;

            let body = JSON.stringify({
                username : this.props.userInfo.username,
                dates : notSelectedDates
            });

            let res = await BasePage.CallApiPost(url, body);
            if(res.status == 200)
            {
                await this.props.fetchDataAgain();
                // this page will be automatically re-rendered
            }
            else
                throw(Constants.postNot200);
        }
        catch(e)
        {
            this.setState({error: e});
            console.log('Error on deposit submit' + this.state.error);
        }

    }

    dateClicked(event)
    {
        var index = event.target.value;
        var tmp = this.state.dates;
        
        // toggle selection
        tmp[index].isSelected = !tmp[index].isSelected;

        this.setState({dates: tmp});
    }

    renderDeleteDateModal(canRender)
    {
        if(!canRender)
        {
            return(<div/>);
        }
        var selectDates = [];
        
        for(var i = 0; i < this.state.dates.length; i++)
        {
            selectDates.push(
                <ListGroupItem
                    value = {i}
                    key = {i}
                    bsStyle = {(this.state.dates[i].isSelected ? "info" : "danger")}
                    onClick={(event) => this.dateClicked(event)}>
                        {this.state.dates[i].date}
                </ListGroupItem>
            );
        }
        return(
            <Modal show={this.state.isShowDeleteDateModal} onHide={this.hideDeleteDateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>DELETE DATE MODAL</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        {selectDates}
                    </ListGroup>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick = {this.hideDeleteDateModal}>Close</Button>
                    <Button onClick = {this.handleDeleteDateSubmit} bsStyle="success">Update</Button>
                </Modal.Footer>
            </Modal>
        );
    }

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

    renderDeleteDatesButton()
    {
        return(
            <Button bsStyle="primary" bsSize="sm" onClick={this.showDeleteDateModal}>
                Delete Dates
            </Button>
        );
    }

    render()
    {
        var lateDates = [];
        // isDataAcceptable is used for
        // when the data has no dates
        // it is a way to run away from an exception
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

                    <ButtonToolbar className = "User-div-right">
                        <Button bsStyle="primary" bsSize="sm" onClick={this.showDateModal}>
                            Add Late Date
                        </Button>

                        <Button bsStyle="primary" bsSize="sm" onClick={this.showDepositModal}>
                            Update Deposit
                        </Button>

                        {isDataAcceptable ? this.renderDeleteDatesButton() : <div/>}
                        
                    </ButtonToolbar>
                    
                    {this.renderDateModal()}
                    {this.renderDepositModal()}
                    {this.renderDeleteDateModal(isDataAcceptable)}
                </div>
            </div>
        );
    }
}

const LateDates = (props) =>
{
    return(
        <li className = "User-text-right" >
            {props.date}
        </li>
    );
}

export default UserItem;