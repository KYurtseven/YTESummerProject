import React, { Component } from 'react';
import tubitak_logo from './img/tubitak-logo.jpg';
import './Home.css';
import * as Constants from './Constants' ;
import * as BasePage from './BasePage';
import UserItem from './UserItem';

class Home extends Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            // initially load the data
            isLoading: true,
            // when the submit button is pressed
            isSubmit: false,
            userData : {},
            submitValue : [],
            error: ''
        }
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
            var tmp = Constants.MOCK_USER_OBJ;

            this.setState({isLoading: false, userData: tmp});
        }
        else
        {
            this.setState({isLoading: true});
            var url;
            url = Constants.getRoot() + Constants.exampleURL;

            try
            {
                let res = await BasePage.CallApiGet(url);
                if(res.status == 200)
                {
                    let restext = await res.text();
                    let resJSON = JSON.parse(restext);
    
                    resJSON = this.sortByKey(resJSON, 'username');
                    this.setState({isLoading: false, userData: resJSON});
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
    }

    async fetchDataAgain()
    {
        await this.componentDidMount();
    }

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
            var renderCassandra = []
            for(let i = 0; i < this.state.userData.length; i++)
            {
                renderCassandra.push(
                    <UserItem
                        key = {i}
                        userInfo = {this.state.userData[i]}
                        fetchDataAgain = {this.fetchDataAgain.bind(this)}
                     />
                );
            }
            return(
                <div className="App">
                    <header className="App-header" style ={styles.headerstyle}>
                        <img src={tubitak_logo} style = {styles.tubitak_logo} alt =''/>
                        <h1 className = "App-title" style = {styles.tubitak_header_text}> TÜBİTAK </h1>
                    </header>
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
    }
}

export default Home;