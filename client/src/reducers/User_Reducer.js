
import {combineReducers} from 'redux'

export const uData = (state =  {
    email: "",
    name: "",
    total_balance:0,
    listOfTrans:[],
    message:""
}, action) =>{

    switch (action.type) {
        case "USER_INFO_UP":
            console.log("In User info"+action.payload.email);
            state= {
                ...state,
                email:action.payload.email,
                name:action.payload.name
            };
            break;
        case "BALANCE":
            state= {
                ...state,
                balance: action.payload
            };
            break;
        case "LIST_OF_TRANS":
            state= {
                ...state,
                listOfTrans:action.payload
            };
            break;
        case "ADD_MONEY":
            state= {
                ...state,
                message:action.payload
            };
            break;
        case "WITHDRAW_MONEY":
            state= {
                ...state,
                message:action.payload
            };
            break;
        default:
            return state;
    }
    return state;
}
export default combineReducers({
    uData
});