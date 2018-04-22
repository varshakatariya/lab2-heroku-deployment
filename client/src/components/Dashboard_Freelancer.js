import React from "react";
import * as checkLoggedSession from "../actions/user_creadential_actions";
import {userData} from "../reducers/User_Credential_Reducer";
import {bindActionCreators} from 'redux'
import {connect} from "react-redux";
import {Link} from 'react-router-dom';
import * as postData from "../actions/project_bid_actions";
import {Redirect} from 'react-router-dom';

class Dashboard_Freelancer extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            listOfProject: [],
            listOfProjectBck: [],
            search:"",
            currentPage: 1,
            todosPerPage: 10,
            redirect: false
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
            console.log("inside dashboard ------------ "+JSON.stringify(nextProps.projectData.data));
            this.setState({
                listOfProject : nextProps.projectData.data.listOfProjects,
                listOfProjectBck : nextProps.projectData.data.listOfProjects
            });

        }
    }

    componentWillMount(){
        this.props.checkSession();
        this.props.getListProjectUserHasBidOn();
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

    onChange(e){
        this.setState({
            [e.target.name]:e.target.value
        });
        //this.searchData();
    }

    searchData(){
        /* if("krutika mude".includes(this.state.search)) {
             alert(this.state.search);
         }*/
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
                        return (project.ProjectName.includes(searchStr));
                    })
                });
            }
    }

    onChangeStatus(e){
        var searchStr = e.target.value;
        var projectList = [];
        console.log("listOfProjectBck",this.state.listOfProjectBck);
        var bckup = this.state.listOfProjectBck;

        this.setState({
            listOfProject : bckup
        })

        console.log("searchStr",searchStr);

        if(searchStr == "" || searchStr == "All"){
            this.setState({
                listOfProject : bckup
            })
        }else {
            if (searchStr == "Open" || searchStr == "Closed") {
                this.setState({
                    listOfProject: this.state.listOfProjectBck.filter(function (project) {
                        return (project.status.includes(searchStr));
                    })
                });
            }
        }
    }

    render() {
        const { currentPage, todosPerPage } = this.state;
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = this.state.listOfProject && this.state.listOfProject.slice(indexOfFirstTodo, indexOfLastTodo);

        const pageNumbers = [];
        for (let i = 1; this.state.listOfProject && i <= Math.ceil(this.state.listOfProject.length / todosPerPage); i++) {
            pageNumbers.push(i);
        }

        const { userData } = this.props;
        if(this.state.redirect)
            return (<Redirect to={{
                pathname: '/login'
            }} />)
        return (
            <div>
                <div id = "FreelancerView">
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
                                <div className="col-md-2 mt10">Project Name</div>
                                <div className="col-md-3 mt10">Employer</div>
                                <div className="col-md-2 mt10">Average Bid</div>
                                <div className="col-md-2 mt10">Your Bid</div>
                                <div className="col-md-1 mt10">Status Of Project</div>
                            </nav>
                            <div className="mt20"></div>
                            {currentTodos && currentTodos.map((projectDetail,i) =>
                                <h5 key={i}>
                                    <div className="row row-border mt20 ml7 mr7">
                                        <Link to={'/project-details/'+projectDetail.project_id} className="col-md-2 mt15 mb15">{projectDetail.ProjectName}</Link>
                                        <Link to={'/view-details/'+projectDetail.emp_id} className="col-md-3 mt15 mb15">{projectDetail.EmpName}</Link>
                                        <div className="col-md-2 mt15 mb15">{projectDetail.avg_bid}</div>
                                        <div className="col-md-2 mt15 mb15">{projectDetail.bid_price}</div>
                                        <div className="col-md-1 mt15 mb15">{projectDetail.status}</div>
                                    </div>
                                </h5>)}
                        </div>
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
export default connect(mapStateToProps,mapDispatchToProps)(Dashboard_Freelancer);

