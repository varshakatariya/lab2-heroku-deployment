import React from "react";
import * as checkLoggedSession from "../actions/user_creadential_actions";
import {userData} from "../reducers/User_Credential_Reducer";
import {bindActionCreators} from 'redux'
import {connect} from "react-redux";
import {Link} from 'react-router-dom';
import * as postData from "../actions/project_bid_actions";
import {Redirect} from 'react-router-dom';

class Dashboard_Employer extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            listOfProjects_emp: [],
            redirect: false,
            listOfProjectBck: [],
            currentPage: 1,
            search:"",
            todosPerPage: 10
        }
        this.pageNumClicked = this.pageNumClicked.bind(this);
        this.searchData = this.searchData.bind(this);
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
            console.log("inside employer dashboard ------------ "+JSON.stringify(nextProps.projectData.data));
            this.setState({
                listOfProjects_emp : nextProps.projectData.data.listOfProjects_emp,
                listOfProjectBck : nextProps.projectData.data.listOfProjects_emp
            });

        }
    }

    componentWillMount(){
        this.props.checkSession();
        this.props.getListOfProjectPostedByEmployer();
    }

    pageNumClicked(event){
        this.setState({
            currentPage: Number(event.target.id)
        });
        var pageNums = Math.ceil(this.state.listOfProjects_emp.length / this.state.todosPerPage);
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

    onChange(e){
        this.setState({
            [e.target.name]:e.target.value
        });
    }


    searchData(){

        var projectList = [];
        var bckup = this.state.listOfProjectBck;

        this.setState({
            listOfProjects_emp : bckup
        })
        var searchStr = this.state.search;
        console.log("searchStr--------------------",searchStr);
        if(searchStr == ""){
            this.setState({
                listOfProjects_emp : bckup
            })
        }else {
            this.setState({
                listOfProjects_emp: this.state.listOfProjectBck.filter(function (project) {
                    var testStr = project.project_name + "";
                    if(testStr.indexOf(searchStr) != -1) {
                        console.log("------------found---------- ");
                        return true;
                    }
                })
            });
        }
    }

    chkProject(project, searchStr){
        if(project.project_name.includes(searchStr))
            return true;
        else false;
    }


    onChangeStatus(e){

        var searchStr = e.target.value;
        var projectList = [];
        console.log("listOfProjectBck",this.state.listOfProjectBck);
        var bckup = this.state.listOfProjectBck;

        this.setState({
            listOfProjects_emp : bckup
        })

        console.log("searchStr",searchStr);

        if(searchStr == "" || searchStr == "All"){
            this.setState({
                listOfProjects_emp : bckup
            })
        }else {
            if (searchStr == "Open" || searchStr == "Closed") {
                this.setState({
                    listOfProjects_emp: this.state.listOfProjectBck.filter(function (project) {
                        return (project.status.includes(searchStr));
                    })
                });
            }
        }

    }


    render() {
console.log("Employer Project-----------",this.state.listOfProjects_emp);

        const { currentPage, todosPerPage } = this.state;
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = this.state.listOfProjects_emp.slice(indexOfFirstTodo, indexOfLastTodo);

        console.log("currentTodos"+JSON.stringify(currentTodos));
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(this.state.listOfProjects_emp.length / todosPerPage); i++) {
            pageNumbers.push(i);
        }

        const { userData } = this.props;
        if(this.state.redirect)
            return (<Redirect to={{
                pathname: '/login'
            }} />)

        return (
            <div id = "EmployerView">
                <div className="display-flex justify-content-md-center mt40">
                    <input type="text"
                           name="search"
                           onChange={this.onChange.bind(this)}
                           placeholder="Search"
                           className="searchBox col-md-2 "/><button type="submit" className="p510" onClick={this.searchData}><i class="fa fa-search"></i></button>
                    <label className="col-md-2">Project Status</label>
                    <div className="">
                        <select
                            className="select-style"
                            name="status"
                            onChange={this.onChangeStatus.bind(this)}
                        >
                            <option value="All">All</option>
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                </div>
                <div className="display-flex justify-content-md-center mt40">
                    <div className="col-md-11 form-border mt30">
                        <nav className="row bar nav-black">
                            <div className="col-md-3 mt10 mb15">Project Name</div>
                            <div className="col-md-2 mt10 mb15">Average Bid</div>
                            <div className="col-md-3 mt10 mb15">Name</div>
                            <div className="col-md-2 mt10 mb15">Project Completion Date</div>
                            <div className="col-md-2 mt10 mb15">Status Of Project</div>
                        </nav>
                        <div className="mt20"></div>
                        {currentTodos && currentTodos.map((projectDetail,i) =>
                            <h5 key={i}>
                                <div className="row row-border mt20 ml7 mr7">
                                    <Link to={'/project-details/'+projectDetail.project_id} className="col-md-3 mt15 mb15">{projectDetail.project_name}</Link>
                                    <div className="col-md-2 mt15 mb15">{projectDetail.avg_bid}</div>
                                    <Link to={'/view-details/'+projectDetail.user_id} className="col-md-3 mt15 mb15">{projectDetail.user_name}</Link>
                                    <div className="col-md-2 mt15 mb15">{projectDetail.project_completion_date}</div>
                                    <div className="col-md-2 mt15 mb15">{projectDetail.status}</div>
                                </div>
                            </h5>)}
                    </div>
                </div>
                <div id="pagin" className="row display-flex justify-content-md-center mt40 pagination">{pageNumbers.map((number,i) =>
                    <button className="align-right btn color:white"><Link
                        to='#'
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
export default connect(mapStateToProps,mapDispatchToProps)(Dashboard_Employer);

