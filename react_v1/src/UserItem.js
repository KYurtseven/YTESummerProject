import React, { Component } from 'react';
import * as Constants from './Constants' ;
import * as BasePage from './BasePage';
import './Home.css';

class UserItem extends Component 
{
    constructor(props)
    {
        super(props);
        this.state = {
            dateValue : '',
            depositValue: ''
        };

        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleDateSubmit = this.handleDateSubmit.bind(this);

        this.handleDepositChange = this.handleDepositChange.bind(this);
        this.handleDepositSubmit = this.handleDepositSubmit.bind(this);
    }

    handleDateChange(event)
    {
        this.setState({dateValue: event.target.value});
    }

    handleDateSubmit(event)
    {
        if(BasePage.isValidDate(this.state.dateValue))
        {
            this.addDate(this.state.dateValue, this.props.userInfo.username);
            // TO DO
            event.preventDefault(); // how it works? What is it?
        }
        else
        {
            alert('Please enter date as yyyy-MM-dd, entered value was: ' + this.state.dateValue);
        }
    }

    handleDepositChange(event)
    {
        this.setState({depositValue: event.target.value});
    }

    handleDepositSubmit(event)
    {
        if(!isNaN(this.state.depositValue))
        {
            alert("Entered value was: " + this.state.depositValue);
            var url;
            url = Constants.getRoot() + Constants.updateDeposit;

            let body = JSON.stringify({
                username : this.props.userInfo.username,
                deposit : this.state.depositValue
            });
            BasePage.CallApiPost(url, body).done(() => {});
        }
        else
        {
            alert("Please enter an integer");
        }
    }
 
    addDate(val, name)
    {
        var url;
        url = Constants.getRoot() + Constants.addDate;

        let body = JSON.stringify({
            username : name,
            date : val
        });
        BasePage.CallApiPost(url, body).done(() => {});
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
                    
                    <div>
                        <form onSubmit={this.handleDateSubmit}>
                            <label>
                                Add Late Date:
                                <textarea value={this.state.dateValue} onChange={this.handleDateChange} />
                            </label>
                            <input type="submit" value="Submit" />
                        </form>
                    </div>

                    <div>
                        <form onSubmit={this.handleDepositSubmit}>
                            <label>
                                Update Deposit:
                                <textarea value={this.state.depositValue} onChange={this.handleDepositChange} />
                            </label>
                            <input type="submit" value="Submit" />
                        </form>
                    </div>

                </div>
            </div>
        );
    }

}

const LateDates = (props) =>
{
    return(
        <li className = "User-text-right" >{props.date}</li>
    );
}

export default UserItem;