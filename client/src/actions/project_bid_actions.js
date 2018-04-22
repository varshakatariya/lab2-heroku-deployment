import axios from "axios";

export function hireFreelancer(hireData){
    return dispatch => {
        return axios.post('/project/hireFreelancer',hireData).then((response)=>{
            dispatch(hireInfo(response.data));
        });
    }
}

export function makePayment(paymentData){
    return dispatch => {
        return axios.post('/project/makePayment',paymentData).then((response)=>{
            dispatch(paymentInfo(response.data));
        });
    }
}

export function getProjectDataForHome(){
    return dispatch => {
        return axios.get('/project/getAllOpenProjects').then((response)=>{
            console.log("home data"+ JSON.stringify(response.data));
            dispatch(projectListInfo(response.data));
        });
    }
}

export function getProjectDetails(project_id){
    console.log("Inside get Project Details");
    return dispatch => {
        return axios.get('/project/getProjectDetails',{
            params: {project_id: project_id}
        }).then((response)=>{
            console.log("Inside get Project Details after response");
            console.log("home project data"+ JSON.stringify(response.data));
           dispatch(projectInfo(response.data));
        });
    }
}
export function getBids(project_id){
    return dispatch => {
        return axios.get('/project/getBids',{
            params: {project_id: project_id}
        }).then((response)=>{
            console.log("Bids List----------------------------"+ JSON.stringify(response.data));
            dispatch(bidsList(response.data));
        });
    }
}

export function bidProjectNow(bidData){
    return dispatch => {
        return axios.post('/project/bidProjectNow',bidData).then((response)=>{
            console.log("Bid Now data"+ JSON.stringify(response.data));
            //dispatch(projectListInfo(response.data));
        });
    }
}

export function getListProjectUserHasBidOn(){
    return dispatch => {
        return axios.get('/bid/listOfAllProjectUserHasBidOn').then((response)=>{
            console.log("Bid data"+ JSON.stringify(response.data));
            dispatch(flcrProjectListInfo(response.data));
        });
    }
}

export function getListOfProjectPostedByEmployer(){
    return dispatch => {
        return axios.get('/project/listOfAllProjectsPostedByEmployer').then((response)=>{
            console.log("Project data"+ JSON.stringify(response.data));
            dispatch(empProjectListInfo(response.data));
        });
    }
}

export function postProject(projectData){
    return dispatch => {
        return axios.post('/project/postProject',projectData).then((response)=>{
            dispatch(projectInfo(response.data));
        });
    }
}

export function projectInfo(values){
    return{
        type:"PROJECT_INFO",
        payload:values
    }
}

export function projectListInfo(values){
    console.log("Inside projectListInfo",values);
    return{
        type:"PROJECT_LIST_INFO",
        payload:values
    }
}

export function empProjectListInfo(values){

    console.log("Inside emp project list",values);
    return{
        type:"EMP_PROJ_LIST",
        payload:values
    }
}

export function flcrProjectListInfo(values){

    console.log("Inside freelancer project list",values);
    return{
        type:"FLCR_PROJ_LIST",
        payload:values
    }
}
export function bidsList(values){
    return{
        type:"BIDS_LIST",
        payload:values
    }
}

export function hireInfo(values){
    return{
        type:"HIRE_INFO",
        payload:values
    }
}

export function paymentInfo(values){
    return{
        type:"PAYMENT_INFO",
        payload:values
    }
}