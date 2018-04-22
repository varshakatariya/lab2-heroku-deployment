var express = require('express');
var router = express.Router();
var mysql = require('./mysql');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://varsha:varsha@ds133659.mlab.com:33659/freelancer_prototype";
var mongoose = require('mongoose');

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

function getNumberOfBids(project_id){
    //var getBidsCount="select count(*) as numberOfBids from bid b where b.project_id=" +project_id;
    let getBidsCount={"project_id": project_id};
    let bids = 0;
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        console.log("we are connected");
        var dbo = db.db("freelancer_prototype");
        dbo.collection("project").find(getBidsCount,{avg_bid:1}).toArray(function(err, result) {
            if (err) throw err;
            else if(result.length>0){
                nBids = result[0].avg_bid;
            }
            console.log(result);
            db.close();
            //return bids;
        });
    });
    /*mysql.fetchData(function(err,results){
        if(results.length > 0) {
            nBids = results[0].numberOfBids;
        }
    },getBidsCount);*/
    return bids;
}

router.post('/bidProject', function(req, res){
    getNumberOfBids(req.param("project_id"));
    console.log("bid cnt : "+nBids);
    var bid_id;
    var user_id = req.session.userID;
    var errors;

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("freelancer_prototype");
        var myobj = { user_id:user_id, project_id: req.param("project_id"), bid_price: req.param("bid_price"), period_in_days:req.param("period_in_days") };
        dbo.collection("bid").insertOne(myobj, function(err, result) {
            if (err) throw err;
            console.log(result);
            MongoClient.connect(url, function(err, db) {
                if (err) {
                    errors="Unable to add project at this time."
                    res.status(400).json({errors});
                    throw err
                };
                getNumberOfBids();
                var dbo = db.db("freelancer_prototype");
                var myquery = { project_id: req.param("project_id")};
                console.log("average bid:"+nBids);
                var newvalues = { $set: {avg_bid: nBids+1} };
                dbo.collection("project").updateOne(myquery, newvalues, function(err, results) {
                    if (err) throw err;
                    console.log("1 document updated");
                    res.send("Bid Done Successfully");
                    db.close();
                });
            });
            db.close();
        });
    });
    /*var bid_id;
    var getBidId="select max(bid_id) as maxCnt from freelancer_prototype_db.bid";
    var errors;
    console.log("max Query is:"+getBidId);
    mysql.fetchData(function (error,results) {
        if(error){
            errors="Unable to process request";
            res.status(400).json(errors);
        }
        else{
            if(results.length > 0){
                bid_id = results[0].maxCnt+1;
                var bidProject="insert into freelancer_prototype_db.bid(bid_id,user_id,project_id,bid_price,period_in_days) values";
                bidProject= bidProject + " ('"+bid_id+"','"+req.param("user_id")+"','"+req.param("project_id")+"','"+req.param("bid_price")+"','"+req.param("period_in_days")+"' )";
                console.log("insert Query is:"+bidProject);
                mysql.fetchData(function (error,results) {
                    if(error){
                        errors="Unable to add project at this time."
                        res.status(400).json({error});
                    }
                    else{
                        if(results.affectedRows > 0){
                            console.log("inserted"+JSON.stringify(results));
                            res.send("Bid Done Successfully");
                        }
                    }
                },bidProject);
            }
        }
    },getBidId);*/
});

//get List of all bids for project
router.get('/listOfAllBidsForProject', function(req, res){
    var list= [];
    var data = {
        bidsList: []
    };
    var project_id= req.param("project_id");
    let getBid = {project_id:Number(project_id)};
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("freelancer_prototype");
        dbo.collection("bid").find(getBid).toArray(function(err, results) {
            if (err) throw err;
            if(results.length>0){
                let bidList = results;
                console.log("bidlist"+JSON.stringify(bidList));
                MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("freelancer_prototype");
                    dbo.collection("user").find({}).toArray(function(err, results) {
                        if (err) throw err;

                        if(results.length>0){
                            console.log("projlist"+JSON.stringify(results));
                            let project = {};
                            for(let i=0;i<bidList.length;i++){
                                for(let j=0;j<results.length;j++){
                                    if(bidList[i].user_id == results[j].user_id){
                                        project = {
                                            user_id : bidList[i].user_id,
                                            project_id : bidList[i].project_id,
                                            name: results[j].name,
                                            bid_price: bidList[i].bid_price,
                                            period_in_days: bidList[i].period_in_days
                                        }
                                        list.push(project);
                                    }
                                }
                            }
                            data.bidsList = list;
                            res.send(data);
                        }else{
                            errors="Unable to fetch user name";
                            res.status(400).json(errors);
                        }
                        db.close();
                    });
                });
            }else{
                errors="Unable to process your request";
                res.status(400).json(errors);
            }
            db.close();
        });
    });

    /* var list= [];
     var data = {
         bList: []
     };
     var project_id= req.param("project_id");

     var getProjectList="select u.user_id, b.project_id, u.profile_image, u.name, b.bid_price, b.period_in_days";
     getProjectList= getProjectList + " from freelancer_prototype_db.user u, freelancer_prototype_db.bid b ";
     getProjectList= getProjectList + " where b.user_id = u.user_id and b.project_id = "+project_id;

     console.log(getProjectList);
     mysql.fetchData(function(err,results){
         if(results.length > 0) {
             var i = 0;
             while(i<results.length) {
                 var project = {
                     user_id : results[i].user_id,
                     project_id : results[i].project_id,
                     profile_image: results[i].profile_image,
                     name: results[i].name,
                     bid_price: results[i].bid_price,
                     period_in_days: results[i].period_in_days
                 }
                 list.push(project);
                 i++;
             }
             data.bList = list;
             res.send(data);
         }
     },getProjectList);*/
});

//get List of all open projects except user posted project
router.get('/listOfAllProjectUserHasBidOn', function(req, res){

    var list= [];
    var data = {
        bList: []
    };
    var user_id= req.session.userID;

    let getBids = {user_id : user_id};
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("freelancer_prototype");
        dbo.collection("bid").find(getBids).toArray(function(err, results) {
            if (err) throw err;
            if(results.length>0){
                let bidsList = results;
                let getUser = {user_id : {$ne : user_id}};
                MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("freelancer_prototype");
                    dbo.collection("project").find({}).toArray(function(err, results) {
                        if (err) throw err;
                        if(results.length>0){
                            let projectList = results;
                            MongoClient.connect(url, function(err, db) {
                                if (err) throw err;
                                var dbo = db.db("freelancer_prototype");
                                dbo.collection("user").find({}).toArray(function(err, results) {
                                    if (err) throw err;
                                    if(results.length>0){
                                        console.log("----------------inside List of freelancer projects");
                                        let project = {};
                                        for(let i=0;i<bidsList.length;i++){
                                            for(let j=0;j<projectList.length;j++){
                                                for(let k=0;k<results.length;k++) {
                                                    if (bidsList[i].project_id == projectList[j].project_id && projectList[i].employer_id == results[k].user_id) {
                                                        project = {
                                                            project_id: projectList[j].project_id,
                                                            ProjectName: projectList[j].title,
                                                            user_id: projectList[j].user_id,
                                                            emp_id: results[k].user_id,
                                                            EmpName: results[k].name,
                                                            avg_bid: projectList[j].avg_bid,
                                                            bid_price: bidsList[i].bid_price,
                                                            status: projectList[j].status
                                                        }
                                                        list.push(project);
                                                    }
                                                }
                                            }
                                        }
                                        console.log("List of freelancer projects",list);
                                        data.bList = list;
                                        res.send(data);
                                    }else{
                                        errors="Unable to fetch users";
                                        res.status(400).json(errors);
                                    }
                                    db.close();
                                });
                            });
                        }else{
                            errors="Unable to fetch project list";
                            res.status(400).json(errors);
                        }
                        db.close();
                    });
                });
            }else{
                errors="Unable to fetch bids list";
                res.status(400).json(errors);
            }
            db.close();
        });
    });

    /*
    var list= [];
    var data = {
        bList: []
    };
    var user_id= req.session.userID;
    var getProjectList = "select p.project_id, u.user_id, p.title, u.name, p.avg_bid, b.bid_price,p.status ";
    getProjectList = getProjectList + " from freelancer_prototype_db.bid b, freelancer_prototype_db.project p, freelancer_prototype_db.user u ";
    getProjectList = getProjectList + " where b.project_id = p.project_id and p.status = '"+"Open"+"' and u.user_id = b.user_id and b.user_id = "+user_id;
    mysql.fetchData(function(err,results){
        if(results.length > 0) {
            var i = 0;
            while(i<results.length) {
                var project = {
                    project_id : results[i].project_id,
                    user_id : results[i].user_id,
                    ProjectName: results[i].title,
                    EmpName: results[i].name,
                    avg_bid: results[i].avg_bid,
                    bid_price: results[i].bid_price,
                    status: results[i].status
                }
                list.push(project);
                i++;
            }
            data.bList = list;
            res.send(data);
        }
    },getProjectList);*/
});

module.exports = router;
