import React from "react";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {userLogin} from '../actions/user_creadential_actions';
import freelancer from '../freelancer.svg';
import {Link} from 'react-router-dom';


class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email:"",
            password:""
        }
    }

    onChange(e){
        this.setState({
            [e.target.name]:e.target.value
        });
    }
    login(e){
        e.preventDefault();
        this.setState({errors:""});

        this.props.userLogin(this.state).then(
            (data) => {
                console.log("Inside userlogin success");
                this.setState({
                    redirect: true
                })
            },
            (err) => {this.setState({errors : err.response.data})
                console.log("Inside userlogin err");
                console.log(err.response);}
        );
    }
    render(){
        if (this.state.redirect)
            return (<Redirect to={{
                pathname: '/home'
            }} />)
        const {userLogin} = this.props;
        const {errors} = this.state;
        return(
            <div className="display-flex justify-content-md-center mt40">
                <div className="col-md-4 form-border mt30 form-height">
                    <form className="ml50" onSubmit={this.login.bind(this)}>
                        <img src={freelancer} className="freelance-logo mt20 ml50" alt="logo"/>
                        <hr/>
                        {errors && <div className="help-block">{errors}</div>}
                        <div>
                            <h5>Log In to Start</h5>
                        </div>
                        <hr/>
                        <div>
                            <div className="input-type ">
                                <input
                                    placeholder="Email Address"
                                    className="form-control col-md-10"
                                    type="email"
                                    name="email"
                                    required
                                    label=""
                                    onChange={this.onChange.bind(this)}/>
                            </div>
                            <div className="input-type">
                                <input
                                    placeholder="Password"
                                    className="form-control col-md-10"
                                    type="password"
                                    name="password"
                                    required
                                    label=""
                                    onChange={this.onChange.bind(this)}/>
                            </div>
                        </div>

                        <button className="btn btn-primary mt20 col-md-8">Log In</button>
                        <hr/>
                        <br/>
                        <label>Don't have an account? <Link to="/signup">Sign Up</Link></label>
                    </form>
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    userLogin: PropTypes.func.isRequired
}

export default connect(null,{userLogin})(Login);