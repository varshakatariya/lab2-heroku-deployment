
import {combineReducers} from 'redux'

export const data = (state =  {
    listOfProjects:[],
    listOfProjects_emp:[],
    bidsList:[],
    projectData: {},
    message: "",
    transList: []
}, action) =>{

    switch (action.type) {
        case "PROJECT_INFO":
            console.log("In reducer project info",action.payload);
            state= {
                ...state,
                projectData:action.payload
            };
            console.log("inside PROJECT_INFO after setting",state);

        case "PROJECT_LIST_INFO":
            console.log("In ----------------PROJECT_LIST_INFO -------project list info",action.payload.projectsList);
            state= {
                ...state,
                listOfProjects:action.payload.projectsList
            };
            break;
        case "EMP_PROJ_LIST":
            console.log("In emp project list info",action.payload.bList);
            state= {
                ...state,
                listOfProjects_emp:action.payload.bList
            };
            break;
        case "FLCR_PROJ_LIST":
            console.log("In flcr project list info",action.payload.bList);
            state= {
                ...state,
                listOfProjects:action.payload.bList
            };
            break;
        case "BIDS_LIST":
            console.log("In reducer BIDS_LIST",action.payload.bidsList);
            state= {
                ...state,
                bidsList:action.payload.bidsList
            };
            console.log("In Bids  list info",state.bidsList);
            break;

        case "HIRE_INFO":
            console.log("In HIRE info"+action.payload.message);
            state= {
                ...state,
                message:action.payload.message
            };
            break;
        case "PAYMENT_INFO":
            console.log("In Payment info"+action.payload);
            state= {
                ...state,
                transList: action.payload.transList,
                message:action.payload.message
            };
            break;
        default:
            return state;
    }
    return state;
}
export default combineReducers({
    data
});