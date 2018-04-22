import React from "react";
import * as checkLoggedSession from "../actions/user_creadential_actions";
import {userData} from "../reducers/User_Credential_Reducer";
import {bindActionCreators} from 'redux'
import {connect} from "react-redux";
import * as postData from "../actions/project_bid_actions";
import {Redirect} from 'react-router-dom';

import {Link} from 'react-router-dom';

class Home extends React.Component{
    constructor(props){
        super(props);
        this.state={
            listOfProject: [],
            redirect : false,
            period_in_days:"",
            bid_price:"",
            project_id:"",
            currentPage: 1,
            todosPerPage: 10,
            search:"",
            listOfProjectBck:[],
            userSkills:[]
        }
        this.showProject = this.showProject.bind(this);
        this.pageNumClicked = this.pageNumClicked.bind(this);
        this.searchData = this.searchData.bind(this);
    }


    componentWillReceiveProps(nextProps){
        console.log(nextProps);
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
            console.log("Project data :  ---------------------------   ",nextProps.projectData.data.listOfProjects);
            this.setState({
                listOfProject : nextProps.projectData.data.listOfProjects,
                listOfProjectBck : nextProps.projectData.data.listOfProjects
            });
        }
        if(nextProps.userData){
            let skills = [];
            if(nextProps.userData.data && nextProps.userData.data.skills) {
                skills = (nextProps.userData.data.skills).split(',');
                this.setState({
                    userSkills: skills
                });
            }
        }
    }


    componentWillMount(){
        this.props.checkSession();
        this.props.getProjectDataForHome();
        this.props.getUserData()
    }

    componentDidMount(){
        var doc = document.getElementById("1");
        if(doc != undefined) {
            doc.style.backgroundColor = "blue";
            doc.style.color = "white";
        }
    }

    bid(id){

        var str = "bid-details"+id;
        var x = document.getElementById(str);
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    }

    showProject(id){

        this.props.projectId = id;
    }

    bidNow(id){
        var bidData = {};
        console.log("Project ID -----------------",id);
        bidData.project_id = id;
        bidData.period_in_days = this.state.period_in_days;
        bidData.bid_price = this.state.bid_price;
        var str = "bid-details"+id;
        var x = document.getElementById(str);
        x.style.display = "none";
        this.props.bidProjectNow(bidData).then(
            (data) => {
                this.props.getProjectDataForHome();
            },
            (err) => {
                this.setState({redirect:true})
            });
    }

    onChange(e){
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    nextPath(path) {
        this.props.history.push(path);
    }

    logout(){
        this.props.logout();
    }
    pageNumClicked(event){
        this.setState({
            currentPage: Number(event.target.id)
        });
        var pageNums = Math.ceil(this.state.listOfProject.length / this.state.todosPerPage);
        var doc;
        for (var i=1; i<=pageNums; i++){
            console.log("page number"+i);
            doc = document.getElementById(""+i);
            if(i == event.target.id) {
                doc.style.backgroundColor = "blue";
                doc.style.color = "white";
            }else{
                doc.style.backgroundColor = "white";
                doc.style.color = "blue";
            }
        }
    }

    searchData(){
        var projectList = [];
        var bckup = this.state.listOfProjectBck;

        this.setState({
            listOfProject : bckup
        })
        var searchStr = this.state.search;
        if(searchStr == ""){
            this.setState({
                listOfProject : bckup
            })
        }else {
            this.setState({
                listOfProject: this.state.listOfProjectBck.filter(function (project) {
                    return (project.title.includes(searchStr) || project.skills.includes(searchStr));
                })
            });
        }
    }

    onChange(e){
        this.setState({
            [e.target.name]:e.target.value
        });
        //this.searchData();
    }


    revProject(){
        var projectList = [];
        var bckup = this.state.listOfProjectBck;

        this.setState({
            listOfProject : bckup
        })
        for(var i=0;i<this.state.userSkills.length;i++){
            for(var j=0;j<this.state.listOfProject.length;j++){
                if(this.state.listOfProject[j].skills.includes(this.state.userSkills[i])){
                    projectList.push(this.state.listOfProject[j]);
                }
            }
        }
        this.setState({
            listOfProject : projectList
        })
        console.log("projectList"+JSON.stringify(projectList));

    }

    allProject(){
        var projectList = this.state.listOfProjectBck;
        this.setState({
            listOfProject : projectList
        })
    }

    render() {
        const { currentPage, todosPerPage } = this.state;
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos =
            this.state.listOfProject  &&
            this.state.listOfProject.slice(indexOfFirstTodo, indexOfLastTodo);

        const { userData } = this.props;
        if(this.state.redirect || userData.data.logout === true)
            return (<Redirect to={{
                pathname: '/login'
            }} />)

        const pageNumbers = [];
        for (let i = 1;  this.state.listOfProject && i <= Math.ceil(this.state.listOfProject.length / todosPerPage); i++) {
            pageNumbers.push(i);
        }
        /*{
            var cr = document.getElementById("credentials");
            console.log("check element",document.getElementById("credentials"));

            var l = document.getElementById("l");
            console.log("check element",document.getElementById("l"));

            var s = document.getElementById("sg");
            console.log("check element",document.getElementById("sg"));
        }*/
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
                <div>
                    <section className="display-flex justify-content-md-center mt20">
                        <div>
                            <label className="col-md-5">
                                <input type="Radio" name="view" onClick={this.revProject.bind(this)}></input> Display Relevant Projects
                            </label>
                            <label className="col-md-5">
                                <input type="Radio" name="view" defaultChecked={true} onClick={this.allProject.bind(this)}></input> Display All Projects
                            </label>
                        </div>
                    </section>
                    <div className="App-header">
                        <input type="text"
                               name="search"
                               onChange={this.onChange.bind(this)}
                               placeholder="Search"
                               className="searchBox col-md-4"/><button type="submit" className="p510" onClick={this.searchData}><i class="fa fa-search"></i></button>
                        <button className="btn btn-primary logout-btn" onClick={this.logout.bind(this)}>Logout</button>

                    </div>
                <div className="display-flex justify-content-md-center mt20">
                    <div className="col-md-11 form-border mt30 border-blue pb20">
                        <nav className="row bar nav-black border-blue nav-font">
                            <div className="col-md-2 mt10">Project Name</div>
                            <div className="col-md-2 mt10">Description</div>
                            <div className="col-md-2 mt10">Skills Required</div>
                            <div className="col-md-2 mt10">Employer</div>
                            <div className="col-md-1 mt10">Number of Bids</div>
                            <div className="col-md-2 mt10">Bid</div>
                        </nav>
                        <div className="mt20"></div>
                        {this.state.listOfProject && this.state.listOfProject.map((projectDetail,i) =>
                            <h5 key={i}>
                                <div className="row row-border mt20 ml7 mr7">
                                <Link to={'/project-details/'+projectDetail.project_id} className="col-md-2 mt15 mb15">{projectDetail.title}</Link>
                                <div className="col-md-2 mt15 mb15">{projectDetail.description}</div>
                                <div className="col-md-2 mt15 mb15">{projectDetail.skills}</div>
                                <Link to={'/view-details/'+projectDetail.employer_id} className="col-md-2 mt15 mb15">{projectDetail.employer_name}</Link>
                                <div className="col-md-1 mt15 mb15">{projectDetail.avg_bid}</div>
                                <div className="col-md-2 mt15 mb15 ml60">
                                    <button className="btn btn-primary" onClick={() => this.bid(projectDetail.project_id)}>Bid Project</button>
                                    <div id={"bid-details"+projectDetail.project_id} className="mt10" style={{display:'none'}}>
                                    <input
                                        placeholder="Enter Period"
                                        className="form-control col-md-10 mt10"
                                        type="text"
                                        name="period_in_days"
                                        required
                                        label=""
                                        onChange={this.onChange.bind(this)}
                                        />
                                    <input
                                        placeholder="Enter Amount"
                                        className="form-control col-md-10 mt10"
                                        type="text"
                                        name="bid_price"
                                        required
                                        label=""
                                        onChange={this.onChange.bind(this)}
                                        />
                                        <button className="btn btn-primary mt10" onClick={() => this.bidNow(projectDetail.project_id)}>Bid Now</button>
                                    </div>
                                </div>
                                </div>
                            </h5>)}
                    </div>
                </div>
                </div>
                <div id="pagin" className="row display-flex justify-content-md-center mt40 pagination">{pageNumbers.map((number,i) =>
                    <button className="align-right btn color:white"><Link
                        to='/home'
                        key={i}
                        id={number}
                        className={'page'+number}
                        onClick={this.pageNumClicked}
                    >
                        {number}
                    </Link></button>
                )}</div>
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
export default connect(mapStateToProps,mapDispatchToProps)(Home);