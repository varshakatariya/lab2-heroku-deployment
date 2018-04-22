import React from "react";
import * as checkLoggedSession from "../actions/user_creadential_actions";
import {userData} from "../reducers/User_Credential_Reducer";
import {bindActionCreators} from 'redux'
import {connect} from "react-redux";
import * as postData from "../actions/project_bid_actions";
import {Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import freelancer from '../freelancer.svg';

class ProjectDetails extends React.Component{

    state={
        redirect:false,
        projectDetails:{
            projectName:"",
            description:"",
            skills:"",
            budget:"",
            bids:"",
            employer_id:"",
            status:"",
            transactionList: []
        },
        message:"",
        errors:"",
        bidsList:[],
        hireProjectDetails:{
            project_id:0,
            user_id:0
        },
        paymentMessage:""
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userData) {
            if (nextProps.userData.data.sessionActive == true) {
                this.setState({
                    redirect: false
                })
            } else {
                this.setState({
                    redirect: true
                })
            }
        }
        if (nextProps.projectData) {
            this.state.bidsList = nextProps.bidsList;
            console.log("nextProps.projectData",nextProps.projectData.data.projectData.transList);
            this.state.transactionList = nextProps.projectData.data.projectData.transList;
            this.setState({
                projectDetails: nextProps.projectData.data.projectData,
                bidsList: nextProps.projectData.data.bidsList,
                transactionList : nextProps.projectData.data.projectData.transList,
                message: nextProps.projectData.data.message
            });
        }
    }

    componentWillMount(){
        this.props.checkSession();
        this.props.getProjectDetails(this.props.match.params.project_id);
        this.props.getBids(this.props.match.params.project_id);
    }

    nextPath(path) {
        this.props.history.push(path);
    }

    hire(project){
        var hireData = {};
        hireData.project_id = project.project_id;
        hireData.user_id = project.user_id;
        this.setState({
            hireProjectDetails : project
        });
        this.props.hireFreelancer(hireData).then(
            (data) => {
            },
            (err) => {
                this.setState({errors : err.response.data.error});
                console.log(JSON.stringify(err.response));
            });
    };

    payment(project){
        var paymentData = {};
        paymentData.project_id = this.state.hireProjectDetails.project_id;
        paymentData.user_id = this.state.hireProjectDetails.user_id;
        paymentData.employer_id = this.state.projectDetails.employer_id;
        paymentData.bid_price = this.state.hireProjectDetails.bid_price;

        this.props.makePayment(paymentData).then(
            (data) => {
                console.log("After payment----------");
                console.log("After payment props-----------------",this.props);
                this.props.getProjectDetails(this.props.match.params.project_id);
                this.setState({
                    projectDetails: this.props.projectData.data.projectData
                });
                this.setState({
                    message : this.props.projectData.data.projectData.message
                });
            },
            (err) => {
                this.setState({errors : err.response.data.error});
                console.log(JSON.stringify(err.response));
            });
    };
    sortList(sortBy, action){
        var sortedList = [];
        var myData = this.state.bidsList;

        if(action == 'asc') {
            var myData = [].concat(this.state.bidsList)
                .sort((a, b) => a[sortBy] - b[sortBy]);
        }else{
            var myData = [].concat(this.state.bidsList)
                .sort((a, b) => b[sortBy] - a[sortBy]);
        }
        /*var initialVal = myData[0][sortBy];
        for(var i=0;i<myData.length;i++) {
            if()
                sortedList[i] = myData[i].props.children
        }*/
        this.setState({
            bidsList : myData
        });
    }

    componentDidMount(){

    }

    logout(){
        this.props.logout();
    }


    render(){
        const {redirect}  = this.state;
        const {errors}  = this.state;
        const {message}  = this.state;
        const { userData } = this.props;
        const {projectData} = this.props;
        console.log("project Data inside render:  " +JSON.stringify(projectData));
        console.log("Bids List inside render:  " +JSON.stringify(this.state.bidsList));
        console.log("Transaction List inside render: ",this.state.transactionList);
        if(this.state.redirect || userData.data.logout === true)
            return (<Redirect to={{
                pathname: '/login'
            }} />)

        console.log("message : ",this.state.message);

        return(
            <div>
                <div id="credentials">
                    <h1>
                        <div id ="sg" className="top-right2"><canvas id="myCanvas" className="hideColor"></canvas></div>
                    </h1>
                </div>
                <button className="btn btn-primary logout-btn" onClick={this.logout.bind(this)}>Logout</button>
                <nav className="bar nav-black">
                    <Link to="/home" className="item-button bar-item ml75">Home</Link>
                    <Link to="/dashboard" className="item-button bar-item">Dashboard</Link>
                    <Link to="/profile" className="item-button bar-item">My Profile</Link>
                    <Link to="/transaction" className="item-button bar-item">My Transaction</Link>
                    <button className="btn-warning btn post-project-btn" onClick={() => this.nextPath('/post-project')}>Post Project</button>
                </nav>
                <div className="display-flex justify-content-md-center mt40">
                    <div className="col-md-8  justify-content-md-center form-border mt30">
                        <h3 className="mb30 mt50 col-md-4">Project Details</h3>
                        <div className="col-md-offset-5 mt50">
                            <label className="font-bold col-md-3">Project Name : </label>
                            <label className="col-md-3">{this.state.projectDetails.projectName}</label>
                        </div>
                        <div className="col-md-offset-5 mt20">
                            <label className="font-bold col-md-3">Description : </label>
                            <label className="col-md-3">{this.state.projectDetails.description}</label>
                        </div>
                        <div className="col-md-offset-5 mt20">
                            <label className="font-bold col-md-3">Skills Required : </label>
                            <label className="col-md-3">{this.state.projectDetails.skills}</label>
                        </div>
                        <div className="col-md-offset-5 mt20">
                            <label className="font-bold col-md-3">Budget Range : </label>
                            <label className="col-md-3">{this.state.projectDetails.budget}</label>
                        </div>
                        <div className="col-md-offset-5 mt20">
                            <label className="font-bold col-md-3">Average Bid : </label>
                            <label className="col-md-3">{this.state.projectDetails.numberOfBids}</label>
                        </div>
                        <hr/>
                        <br/>
                        {errors && <div className="help-block">{errors}</div>}
                        {this.state.message && <div className="success-block">{this.state.message}</div>}
                        {(this.state.projectDetails.status) == "Open" ?
                            <div>
                                <h3 className="mb30 col-md-5">Bids On Project</h3>
                                {(this.state.message) === "" ?
                                    <div>
                                        <div className="mt30">
                                            <nav className="row bar nav-black">
                                                <div className="col-md-3 mt10 mb10">Freelancer Name</div>
                                                <div className="col-md-3 mt10 mb10">Bid Price</div>
                                                <div className="col-md-3 mt10 mb10">Period in Days</div>
                                                { projectData.data.projectData.isEmployer ?  <div className="col-md-3 mt10 mb10" id="hireLabel">Hire</div>  : '' }
                                            </nav>
                                            <div className="mt20"></div>
                                        </div>
                                        <div>
                                            {this.state.bidsList.map((pd,i) =>
                                                <h5 key={i}>
                                                    <div className="row row-border mt20 ml7 mr7">
                                                        <Link to={'/project-details/'+pd.user_id} className="col-md-3 mt15 mb15">{pd.name}</Link>
                                                        <div className="col-md-3 mt15 mb15">{pd.bid_price}</div>
                                                        <div className="col-md-3 mt15 mb15">{pd.period_in_days}</div>
                                                        { projectData.data.projectData.isEmployer ?  <div className="col-md-3 mt15 mb15"><button className="btn btn-primary hireBtn" onClick={() => this.hire(pd)}>Hire</button></div> : '' }
                                                    </div>
                                                </h5>
                                            )}
                                        </div>
                                    </div>
                                    : <div className="col-md-12 mt15 mb15"><button className="btn btn-primary hireBtn" onClick={() => this.payment(this.state.projectDetails)}>Make Payment</button></div> }
                            </div>
                            : <div>
                                <h4>Project is closed for hiring</h4>
                                <br/>
                                <h5>List of Transactions</h5>
                                <div className="mt30">
                                    <nav className="row bar nav-black">
                                        <div className="col-md-3 mt10 mb10">Employer Name</div>
                                        <div className="col-md-3 mt10 mb10">Freelancer Name</div>
                                        <div className="col-md-3 mt10 mb10">Transaction Type</div>
                                        <div className="col-md-3 mt10 mb10">Amount Paid</div>
                                        {/*{ projectData.data.projectData.isEmployer ?  <div className="col-md-3 mt10 mb10" id="hireLabel">Hire</div>  : '' }*/}
                                    </nav>
                                    <div className="mt20"></div>
                                </div>
                                <div>
                                    {this.state.transactionList && this.state.transactionList.map((ts,i) =>
                                        <h5 key={i}>
                                            <div className="row row-border mt20 ml7 mr7">
                                                <div className="col-md-3 mt15 mb15">{ts.user_id}</div>
                                                <div className="col-md-3 mt15 mb15">{ts.project_id}</div>
                                                <div className="col-md-3 mt15 mb15">{ts.payment_type}</div>
                                                <div className="col-md-3 mt15 mb15">{ts.amount}</div>
                                            </div>
                                        </h5>
                                    )}
                                </div>
                            </div>}
                    </div>
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
export default connect(mapStateToProps,mapDispatchToProps)(ProjectDetails);

ProjectDetails.propTypes = {
    project_id: PropTypes.string
};
