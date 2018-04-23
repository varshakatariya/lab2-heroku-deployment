import React from "react";
import * as transactionData from "../actions/user_detail_actions";
import * as checkLoggedSession from "../actions/user_creadential_actions";
import {bindActionCreators} from 'redux'
import {connect} from "react-redux";
import {Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom';
import PieChart from 'react-simple-pie-chart';

class Transaction extends React.Component{

    state={
        redirect:false,
        transactionDetails:{
            paymentType:"",
            amount:0
        },
        aMessage:"",
        wMessage:"",
        errors:"",
        totalFund:0,
        transList:[],
        addMoney:"",
        withdrawMoney:"",
        crDrlist:[]
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
        if (nextProps.transData.uData) {
            this.setState({
                totalFund: nextProps.transData.uData.balance,
                transList: nextProps.transData.uData.listOfTrans
            })
            this.state.transList = nextProps.transData.uData.listOfTrans;

            this.setState({
                transList: this.state.transList
            });
        }
    }

    componentWillMount(){
        this.props.checkSession();
        this.props.getTotalBalance();
        this.props.getTransactionList();
    }

    nextPath(path) {
        this.props.history.push(path);
    }

    logout(){
        this.props.logout();
    }

    addMoney(e){
        e.preventDefault();
        var aMoneyData = {};
        aMoneyData.money = this.state.addMoney;
        this.setState({
            addMoney : ""
        })
        this.props.addMoney(aMoneyData).then(
            (data) => {
                this.props.getTotalBalance();
                this.props.getTransactionList();
                this.setState({
                    totalFund: this.props.transData.uData.total_balance
                });
                this.state.transList = this.props.transData.uData.listOfTrans;
                this.setState({
                    transList: this.state.transList
                });
                this.setState({
                    aMessage: this.props.transData.uData.message
                });
            },
            (err) => {
                this.setState({errors : err.response.data.error});
                console.log(JSON.stringify(err.response));
            });
    }

    withdrawMoney(e){
        e.preventDefault();
        var wMoneyData = {};
        wMoneyData.money = this.state.withdrawMoney;
        this.setState({
            withdrawMoney : ""
        })
        this.props.withdrawMoney(wMoneyData).then(
            (data) => {
                this.props.getTotalBalance();
                this.props.getTransactionList();

                console.log("this.props.transData.uData----------",this.props.transData.uData);
                this.setState({
                    totalFund: this.props.transData.uData.total_balance
                });
                this.setState({
                    transList: this.props.transData.uData.listOfTrans
                });
                this.setState({
                    wMessage: this.props.transData.uData.message
                });
            },
            (err) => {
                this.setState({errors : err.response.data.error});
                console.log(JSON.stringify(err.response));
            });
    }

    render(){
        const {redirect,crDrlist}  = this.state;
        const {errors}  = this.state;
        const {message}  = this.state;
        const { userData } = this.props;
        if(this.state.redirect || userData.data.logout === true)
            return (<Redirect to={{
                pathname: '/login'
            }} />)
        console.log("message : ",this.state.message);
        var crDr = {};
        crDr = {color:'#008080',value:0};
        crDrlist.push(crDr);
        crDr = {color:'#808000',value:0};
        crDrlist[1] = crDr;
        for(let i=0;i<this.state.transList.length;i++){
            if(this.state.transList[i].payment_type == 'Db'){
                crDrlist[0].value+=Number(this.state.transList[i].amount);
            }
            else if(this.state.transList[i].payment_type == 'Cr'){
                crDrlist[1].value+=Number(this.state.transList[i].amount);
            }
        }
        console.log(JSON.stringify(this.state.crDrlist));
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
                        <h3 className="mb30 mt50 col-md-6">Transaction Details</h3>
                        <div className="col-md-offset-5 mt50">
                            <label className="font-bold col-md-2">Total Fund : </label>
                            <label className="font-bold col-md-1">{JSON.stringify(this.state.totalFund)} </label>
                        </div>
                        {errors && <div className="help-block">{errors}</div>}
                        {this.state.aMessage && <div className="success-block">{this.state.aMessage}</div>}
                        <div className="col-md-offset-5 mt20">
                            <input type="text" id="addValue" value={this.state.addMoney} onChange={(event)=>this.setState({addMoney  : event.target.value})} className="font-bold col-md-3"/>
                            <button type="button" onClick={this.addMoney.bind(this)}> Add Money </button>
                        </div>
                        {errors && <div className="help-block">{errors}</div>}
                        {this.state.wMessage && <div className="success-block">{this.state.wMessage}</div>}
                        <div className="col-md-offset-5 mt20">
                            <input type="text" id="withValue" value={this.state.withdrawMoney} onChange={(event)=>this.setState({withdrawMoney : event.target.value})} className="font-bold col-md-3"/>
                            <button type="button" onClick={this.withdrawMoney.bind(this)}> Withdraw Money </button>
                        </div>

                        <div className="col-md-8 mt20" style={{paddingLeft:350}}>
                                <PieChart slices={crDrlist} />
                        </div>
                            <div className="col-md-12 mt20">
                                <input style={{backgroundColor:'#008080', padding:'7px', width: '3px', height : '3px'}}></input> <label className="fs14"> Credited Transactions </label>
                                <input style={{backgroundColor:'#808000', padding:'7px' , width: '3px', height : '3px'}}></input> <label className="fs14"> Debited Transactions </label>
                            </div>


                        <br/>
                        <br/>

                        <div>
                            <div className="mt30">
                                <nav className="row bar nav-black">
                                    <div className="col-md-6 mt10 mb10">Transaction Type</div>
                                    <div className="col-md-6 mt10 mb10">Amount</div>
                                    <br/>
                                </nav>
                                <div className="mt20"></div>
                            </div>
                            <div>
                                {this.state.transList.map((ts,i) =>
                                    <h5 key={i}>
                                        <div className="row row-border mt20 ml7 mr7">
                                            <div className="col-md-6 mt15 mb15">{ts.payment_type}</div>
                                            <div className="col-md-6 mt15 mb15">{ts.amount}</div>
                                        </div>
                                    </h5>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return{
        transData : state.UserReducer,
        userData : state.LoginReducer
    };
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(Object.assign({}, transactionData,checkLoggedSession),dispatch)
}
export default connect(mapStateToProps,mapDispatchToProps)(Transaction);

