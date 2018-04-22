import React from "react";
import * as checkLoggedSession from "../actions/user_creadential_actions";
import {userData} from "../reducers/User_Credential_Reducer";
import {bindActionCreators} from 'redux'
import {connect} from "react-redux";
import * as postData from "../actions/project_bid_actions";
import {Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom';
import Dashboard_Employer from './Dashboard_Employer';
import Dashboard_Freelancer from './Dashboard_Freelancer';;

class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            listOfProject: [],
            redirect: false
        }

        this.onHandleChangeFreelancer = this.onHandleChangeFreelancer.bind(this);
        this.onHandleChangeEmployer = this.onHandleChangeEmployer.bind(this);
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps);
        console.log("inside dashboard",nextProps);
        if(nextProps.userData){
            if(nextProps.userData.data.sessionActive == true){
                this.setState ({
                    redirect : false
                })
            }else {
                this.setState({
                    redirect: true
                })
            }
        }
        if(nextProps.projectData){
            console.log("inside dashboard ------------ "+JSON.stringify(nextProps.projectData.data));
            this.setState({
                listOfProject : nextProps.projectData.data.listOfProjects
            });

        }
    }

    componentWillMount(){
        this.props.checkSession();
        this.props.getListProjectUserHasBidOn();
    }

    componentDidMount(){
        var x = document.getElementById("freelancerView");
        x.style.display = "none";
    }

    onHandleChangeFreelancer(){
        var x = document.getElementById("employerView");
        var y = document.getElementById("freelancerView");
        x.style.display = "block";
        y.style.display = "none";
    }
    onHandleChangeEmployer(){
        var x = document.getElementById("freelancerView");
        var y = document.getElementById("employerView");
        x.style.display = "block";
        y.style.display = "none";
    }

    nextPath(path) {
        this.props.history.push(path);
    }

    logout(){
        this.props.logout();
    }


    render() {

        const { userData } = this.props;
        if(this.state.redirect  || userData.data.logout === true)
            return (<Redirect to={{
                pathname: '/login'
            }} />)
        return (
            <div>
                <div id="credentials">
                    <h1>
                        <div id ="sg" className="top-right2"><canvas id="myCanvas" className="hideColor"></canvas></div>
                    </h1>
                </div>

                <nav class="bar nav-black">
                    <Link to="/home" class="item-button bar-item ml75">Home</Link>
                    <Link to="/dashboard" class="item-button bar-item">Dashboard</Link>
                    <Link to="/profile" class="item-button bar-item">My Profile</Link>
                    <Link to="/transaction" class="item-button bar-item">My Transaction</Link>
                    <button className="btn-warning btn post-project-btn" onClick={() => this.nextPath('/post-project')}>Post Project</button>
                </nav>

               <button className="btn btn-primary logout-btn" onClick={this.logout.bind(this)}>Logout</button>

                <br/>
                <label>
                    <input type="Radio" name="view" defaultChecked={true} onClick={this.onHandleChangeFreelancer.bind()}></input> Freelancer
                </label>

                <label>
                    <input type="Radio" name="view" onClick={this.onHandleChangeEmployer.bind()}></input> Employer
                </label>

                <div id="employerView">
                    <Dashboard_Freelancer/>

                </div>
                <div id="freelancerView">
                    <Dashboard_Employer/>
                </div>
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
export default connect(mapStateToProps,mapDispatchToProps)(Dashboard);

