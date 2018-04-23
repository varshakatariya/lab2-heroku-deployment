import React from "react";
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import * as getData from '../actions/user_creadential_actions';
import Dropzone from 'react-dropzone';
import {Link} from 'react-router-dom';

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = { redirect: false, profileImage:null ,preview: null, docs:null, docsPreview: null, imageURL:null, fdData: null};
        this.onImageDrop = this.onImageDrop.bind(this);
        this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.userData){
            this.setState ({
                name : nextProps.userData.data.name,
                email : nextProps.userData.data.email,
                about : nextProps.userData.data.about,
                phone : nextProps.userData.data.phone,
                skills : nextProps.userData.data.skills,
                profileImage: nextProps.userData.data.profileImage,
                userFiles: nextProps.userData.data.userFiles
            })
        }

        console.log(nextProps);
    }

    componentWillMount(){
        this.props.getUserData().then(
            (data) => {

            },
            (err) => {
                this.setState({redirect:true})
            });
    }

    updateUserDetails(){
       this.props.updateUser(this.state);
    }

    logout(){
        this.props.logout();
    }

    isDataNotValid(){
        return true;
    }

    fileSelectedHandler(e) {
        /*const data = new FormData();*/
        this.state.docs = e.target.files[0];

        this.setState({
            docs: this.state.docs
        });

        console.log("selected file path : ",this.state.docs);
    }

    onImageDrop(file) {
        this.setState({
            profileImage: file[0],
            preview: file[0].preview
        })
        console.log("Image file path : ",this.state.profileImage);
    }
    nextPath(path) {
        this.props.history.push(path);
    }

    render(){
        const {redirect}  = this.state;
        const { userData } = this.props;
        if(this.state.redirect || userData.data.logout === true)
            return (<Redirect to={{
                pathname: '/login'
            }} />)

        return(
        <div>
            <div id="credentials">
                <h1>
                    <div id ="sg" className="top-right2"><canvas id="myCanvas" className="hideColor"></canvas></div>
                </h1>
            </div>
            <button className="btn btn-primary logout-btn" onClick={this.logout.bind(this)}>Logout</button>
            <nav class="bar nav-black">
                <Link to="/home" class="item-button bar-item ml75">Home</Link>
                <Link to="/dashboard" class="item-button bar-item">Dashboard</Link>
                <Link to="/profile" class="item-button bar-item">My Profile</Link>
                <Link to="/transaction" class="item-button bar-item">My Transaction</Link>
                <button className="btn-warning btn post-project-btn" onClick={() => this.nextPath('/post-project')}>Post Project</button>
            </nav>
            <div className="display-flex justify-content-md-center mt40">
                <div className="col-md-8 form-border mt30">
                    <div className="row">
                        <br/>
                        { this.state.preview &&
                        <img className="col-md-2 margin-left:100px" src={ this.state.preview } alt="image preview" />
                        }
                    </div>
                    <div className="row">
                        <Dropzone style="height: 50px"
                                  multiple={false}
                                  accept="image/*"
                                  onDrop={this.onImageDrop}
                                  className="col-md-8">

                            <label className="col-md-8" >
                                <u>Click here</u> to upload a profile image
                            </label>
                        </Dropzone>
                    </div>
                    <div className="row">
                    <label className="col-md-3">Name</label>
                    <input
                        placeholder="Name"
                        className="form-control col-md-3"
                        type="text"
                        label=""
                        required
                        value={this.state.name}
                        onChange={(event) => {
                            this.setState({
                                name: event.target.value
                            })
                        }}
                    />
                    </div>
                    <div className="row">
                        <label className="col-md-3">Email</label>
                        <input
                            placeholder="Email"
                            className="form-control  col-md-6"
                            type="email"
                            label=""
                            required
                            value={this.state.email}
                            onChange={(event) => {
                                this.setState({
                                    email: event.target.value
                                })
                            }}
                            disabled
                        />
                    </div>
                    <div className="row">
                        <label className="col-md-3">Phone Number</label>
                        <input
                            placeholder="Phone Number"
                            className="form-control  col-md-6"
                            type="tel"
                            required
                            label=""
                            value={this.state.phone}
                            onChange={(event) => {
                                this.setState({
                                    phone: event.target.value
                                })
                            }}
                        />
                    </div>
                    <div className="row">
                        <label className="col-md-3">About Me</label>
                        <input
                            placeholder="About"
                            className="form-control  col-md-6"
                            type="text"
                            required
                            label=""
                            value={this.state.about}
                            onChange={(event) => {
                                this.setState({
                                    about: event.target.value
                                })
                            }}
                        />
                    </div>
                    <div className="row">
                        <label className="col-md-3">Skills</label>
                        <input
                            placeholder="Skills"
                            className="form-control  col-md-6"
                            type="text"
                            required
                            value={this.state.skills}
                            onChange={(event) => {
                                this.setState({
                                    skills: event.target.value
                                })
                            }}
                        />
                    </div>
                    <br/>
                    <div className="row">
                        <label className="col-md-3">Resume</label>
                        <input
                            type="file"
                            onChange={this.fileSelectedHandler.bind(this)}
                        />
                    </div>
                    { this.state.docsPreview &&
                    <img src={ this.state.docsPreview } alt="image preview" />
                    }


                    <button onClick={this.updateUserDetails.bind(this)} className="btn btn-primary" >Update Details</button>
                    </div>
            </div>
        </div>
        );
    }
}

function mapStateToProps(state){
    return{
        userData : state.LoginReducer
    };
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(getData,dispatch)

}
export default connect(mapStateToProps,mapDispatchToProps)(Profile);