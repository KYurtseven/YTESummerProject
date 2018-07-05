import React, { Component } from 'react';
import tubitak_logo from './img/tubitak-logo.jpg';
import './App.css';
import * as Constants from './Constants' ;
import * as BasePage from './BasePage';

class Home extends Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            isLoading: true,
            user: [],
            response : {}
        }
    }
    async componentDidMount()
    {
        if(Constants.IS_MOCK)
        {
            var tmpuser = [];
            for(let i = 0; i < Constants.MOCK_USER_OBJ.length; i++)
                tmpuser[i] = Constants.MOCK_USER_OBJ[i];

            this.setState(
                {user : tmpuser}, 
                () => {console.log(this.state.user)}
            );

            var url;
            url = Constants.getRoot() + 'cassandraExample/';

            let res = await BasePage.CallApiGet(url);
            let restext = await res.text();
            //console.log("resCassandra: " + restext);

            this.setState({isLoading: false, response: JSON.parse(restext)});
            
        }
        else
        {
            // TO DO
        }
    }

    /*
    renderUser()
    {
        var data = this.state.user;
        // this renders per user
        const userNames = data.map(function(d)
        {
            // this renders users date of entry's
            const dates = d.entry_dates.map(function(d2, j)
            {
                return(<li key={d2}>{d2}</li>);
            });
            return(
            <div key={d.id} style={{border: 'double', textAlign: 'right'}} >
                
                <p style={{float: 'left',marginLeft: 20,fontSize: 16,}}>
                    {d.name}
                </p>
               
                <p style={{marginRight: 20}}>
                    {dates}
                </p>
            </div>
            );
        });
        return(<div>{userNames}</div>);
    }
    */

    render()
    {
        if(this.state.isLoading)
        {
            return (
                <div className="App">
                    <p> Not rendered yet </p>
                </div>
                );
        }
        else
        {
            // TO DO
            var renderUser = [];
            for(let i = 0; i < this.state.user.length; i++)
            {
                renderUser.push(
                    <UserItem 
                        key={i}
                        userInfo = {this.state.user[i]} />
                )
            }
            
            var renderCassandra = []
            for(let i = 0; i < this.state.response.length; i++)
            {
                renderCassandra.push(
                    <CassandraItem
                        key = {i}
                        data = {this.state.response[i]}/>
                );
            }

            return(
                <div className="App">
                    <header className="App-header" style ={styles.headerstyle}>
                        <img src={tubitak_logo} style = {styles.tubitak_logo} alt =''/>
                        <h1 className = "App-title" style = {styles.tubitak_header_text}> TÜBİTAK </h1>
                    </header>
                    <h1> Here is the mock data</h1>
                    {renderUser}
                    {renderCassandra}
                </div>
            );
        }
    }
}
const styles = 
{
    tubitak_logo:
    {
        float: 'left',
        height : 75,
        width : 75,
    },
    tubitak_header_text:
    {
        fontSize: 40,
        float: 'center',
    },
    headerstyle:
    {
        backgroundColor : 'red',
        height: 100
    },
    userDiv:
    {
        border: 'double', 
        textAlign: 'right'
    },
    userNameId:
    {
        float: 'left',
        marginLeft: 20,
        fontSize: 16
    }
}

const UserItem = (props) => 
{
    var entryDates = [];

    for(var i = 0; i < props.userInfo.entry_dates.length; i++)
    {
        entryDates.push(
            <EntryDates 
                key = {i}
                date = {props.userInfo.entry_dates[i]}/>
        );
    }

    return(
        <div style={styles.userDiv}>
            <p style={styles.userNameId}>{props.userInfo.name}</p>
            <p style={styles.userNameId}>{props.userInfo.id}</p>
            <p style={{marginRight: 20}}>{entryDates}</p>
        </div>
    );
}

const EntryDates = (props) =>
{
    return(
        <li>{props.date}</li>
    );
}

const CassandraItem = (props) =>
{
    return(
        <p>{props.data.uuid} {props.data.firstname} {props.data.lastname} </p>
    );
}
export default Home;