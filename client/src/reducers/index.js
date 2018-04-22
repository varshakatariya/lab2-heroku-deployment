import {combineReducers} from 'redux';
import LoginReducer from './User_Credential_Reducer';
import UserReducer from './User_Reducer';
import ProjectReducer from './Project_Reducer';

const allReducers = combineReducers({
    LoginReducer, UserReducer, ProjectReducer
});

export default allReducers;