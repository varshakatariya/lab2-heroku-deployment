import React from "react";
import * as checkLoggedSession from "../actions/user_creadential_actions";
import {userData} from "../reducers/User_Credential_Reducer";
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as postData from "../actions/project_bid_actions";
import {Redirect,withRouter} from 'react-router-dom';
import freelancer from '../freelancer.svg';

class Header extends React.Component{

    state={
        loggedIn:false
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps);
        if(nextProps.userData){
            if(nextProps.userData.data.sessionActive == true){
                this.setState ({
                    loggedIn : true
                })
            }else {
                this.setState({
                    loggedIn: false
                })
            }
        }
    }


    componentWillMount(){
        this.props.checkSession();
    }

    logout(){
        this.props.logout();
        this.setState({
            loggedIn: false
        })
    }
    viewProfile(path){
        this.props.history.push(path);
    }
    login(path){
        this.props.history.push(path);
    }
    signup(path){
        this.props.history.push(path);
    }

    render(){
        const loggedIn = this.state;
        const { userData } = this.props;
        if(userData.data.logout === true)
            return (<Redirect to={{
                pathname: '/login'
            }} />)
        console.log(loggedIn);
        return(
            <div className="App-header">
                <img src={freelancer} className="App-logo" alt="logo" />
                {this.state.loggedIn ? (
                    <div className="fr">
                        <button className="btn btn-primary mlr30" onClick={this.logout.bind(this)}>Logout</button>
                    </div>
                ) : (
                    <div className="fr">
                        <button className="btn btn-primary mlr30" onClick={() => this.login('/login')}>Login</button><label>|</label>
                        <button className="btn btn-primary mlr30" onClick={() => this.signup('/signup')}>Sign Up</button>
                    </div>
                )}
            </div>
        );
    }
}


function mapStateToProps(state){
    return{
        projectData : state.ProjectReducer,
        userData : state.LoginReducer
    };
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(Object.assign({}, postData,checkLoggedSession),dispatch)

}
export default connect(mapStateToProps,mapDispatchToProps)(Header);
