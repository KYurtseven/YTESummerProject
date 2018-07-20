import React, { Component } from 'react';
import * as Constants from '../GlobalPages/Constants' ;
import * as BasePage from '../GlobalPages/BasePage';

import '../GlobalPages/Home.css';
import {
    Button, 
    Modal,
    FormGroup,
    ControlLabel,
    FormControl,
    ListGroup,
    ListGroupItem
} from 'react-bootstrap';


class UserItem extends Component 
{
    constructor(props)
    {
        super(props);
        this.state = {
            dateValue : '',
            depositValue: '',
            isShowDateTab: false,
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
    
        this.toggleDateTab = this.toggleDateTab.bind(this);
        
    }

    componentWillMount()
    {
        try
        {
            var myarr = []
            for(var i = 0; i < this.props.userData.dates.length; i++)
            {
                let tmpval = {};
                tmpval.date = this.props.userData.dates[i];
                tmpval.isSelected = false;
                myarr.push(tmpval);
            }
            this.setState({dates : myarr});
        }
        catch(error)
        {
            //console.log('Error useritem componentwillmount: ' + error);
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
        if(BasePage.isValidDate(this.state.dateValue) === 'success')
        {
            var url;
            url = Constants.getRoot() + Constants.addDate;

            let body = JSON.stringify({
                username : this.props.userData.username,
                date : this.state.dateValue
            });

            try
            {
                let res = await BasePage.CallApiPost(url, body);
                if(res.status === 200)
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
                username : this.props.userData.username,
                deposit : this.state.depositValue
            });
            //BasePage.CallApiPost(url, body).done(() => {});
            
            try
            {
                let res = await BasePage.CallApiPost(url, body);
                if(res.status === 200)
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
                        validationState = {(!isNaN(this.state.depositValue) && this.state.depositValue !== '') ? 'success' : 'error'}
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
        
        try
        {
            var url;
            url = Constants.getRoot() + Constants.deleteDates;

            let body = JSON.stringify({
                username : this.props.userData.username,
                dates : notSelectedDates
            });

            let res = await BasePage.CallApiPost(url, body);
            if(res.status === 200)
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
                    <Modal.Title>DELETE DATE</Modal.Title>
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
            <div className="divTableBody">
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

    toggleDateTab()
    {
        this.setState({isShowDateTab: !this.state.isShowDateTab});
    }

    renderSubTable(isDataAcceptable, lateDates)
    {
        return(
            <div className="divTableRow" style={{backgroundColor : 'white'}} >
                <div className="divTableCell"></div>
                <div className="divTableCell">

                    <div className="divTable Table" >
                        <div className="divTableHeading">
                            <div className="divTableRow">
                                <div className="divTableHead">Dates</div>
                            </div>
                        </div>
                        {isDataAcceptable ? this.renderLateDates(lateDates) : this.renderNoLateData()}
                    </div>
                </div>

                <div className="divTableCell">
                    <Button bsStyle="primary" bsSize="sm" onClick={this.showDateModal}>
                        Add Late Date
                    </Button>
                </div>

                <div className="divTableCell">
                    <Button bsStyle="primary" bsSize="sm" onClick={this.showDepositModal}>
                        Update Deposit
                    </Button>
                </div>

                <div className="divTableCell">
                    {isDataAcceptable ? this.renderDeleteDatesButton() : <div/>}
                </div>
                
                <div className="divTableCell">
                    {this.renderDateModal()}
                    {this.renderDepositModal()}
                    {this.renderDeleteDateModal(isDataAcceptable)}

                </div>
            </div>
        );
    }

    render()
    {
        var lateDates = [];
        // isDataAcceptable is used for
        // when the data has no dates
        // it is a way to run away from an exception
        var isDataAcceptable = true;
        if(this.props.userData.dates === null || this.props.userData.dates === undefined)
            isDataAcceptable = false;
    
        for(var i = 0; isDataAcceptable && i < this.props.userData.dates.length; i++)
        {
            lateDates.push(
                <LateDates 
                    key = {i}
                    date = {this.props.userData.dates[i]}/>
            );
        }

        return(
            <div className="divTableBody">
                
                <div className="divTableRow" style={{background: (this.props.isOdd % 2 === 0 ? '#F5F5F5' : '#EEB2B2')}} >
                    <div className="divTableCell">
                        <Button bsStyle = "primary" bsSize = 'sm' onClick = {this.toggleDateTab}>
                            +
                        </Button>
                    </div>
                    <div className="divTableCell">{this.props.userData.username}</div>
                    <div className="divTableCell">{this.props.userData.name}</div>
                    <div className="divTableCell">{this.props.userData.email}</div>
                    <div className="divTableCell">{this.props.userData.deposit}</div>
                    <div className="divTableCell">{this.props.userData.usertype}</div>
                </div>
                    {this.state.isShowDateTab ? this.renderSubTable(isDataAcceptable, lateDates) : <div></div>}
            </div>
        );
    }
}

const LateDates = (props) =>
{
    return(
        <div className="divTableRow" style = {{}} > 
            <div className="divTableCell">{props.date}</div>
        </div>
    );
}

export default UserItem;