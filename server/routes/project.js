var express = require('express');
var router = express.Router();
var mysql = require('./mysql');
var nodemailer = require('nodemailer');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://varsha:varsha@ds133659.mlab.com:33659/freelancer_prototype";
var mongoose = require('mongoose');

mongoose.connect(url);

var nBids = 0;

/* GET users listing. */
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

router.post('/postProject', function(req, res){
    var getProjectId="select max(project_id) as maxCnt from project";
    var errors;
    var d = new Date(req.param("endDate"));
    var finDate = d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    var projectId;
    var userID = req.session.userID;

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        console.log("we are connected");
        var dbo = db.db("freelancer_prototype");
        dbo.collection("project").find().sort({project_id:-1}).limit(1).toArray(function(err, result) {
            if (err) throw err;
            else {
                let project_id = result[0].project_id;

                MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    else {
                        var dbo = db.db("freelancer_prototype");
                        var myobj = {
                            project_id: project_id+1,
                            employer_id:req.session.userID,
                            title: req.param("projectName"),
                            description: req.param("description"),
                            skills: req.param("skills"),
                            budget: req.param("budget"),
                            status: "Open",
                            avg_bid: req.param("avg_bid"),
                            project_completion_date: finDate,
                            freelancer_id:0
                        };
                        dbo.collection("project").insertOne(myobj, function (err, result) {
                            if (err) throw err;
                            res.send("Project Posted Successfully");
                            db.close();
                        });
                    }
                });
                db.close();
            }
        });
    });
   /* var getProjectId="select max(project_id) as maxCnt from project";
    var errors;
    var d = new Date(req.param("endDate"));
    var finDate = d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    var projectId;
    var userID = req.session.userID;
    console.log("SQL : :"+getProjectId);
    mysql.fetchData(function (error,results) {
        if(error){
            errors="Unable to process request";
            res.status(400).json(errors);
        }
        else{
            if(results.length > 0){
                projectId = results[0].maxCnt+1;
                //endDate = changeToDate(req.param("endDate"));

                var addProject="insert into project (project_id,employer_id,title,description, files, skills, budget, avg_bid, status, project_completion_date) values ('"+projectId+"','"+userID+"','" + req.param("projectName") +"','" + req.param("description") +"','" + req.param("projectFiles") +"','"+ req.param("skills") +"','" + req.param("budget")+"','0','Open','"+finDate+"')";
                console.log("insert SQL : :"+addProject);
                mysql.fetchData(function (error,results) {
                    if(error){
                        errors="Unable to add project at this time."
                        res.status(400).json({errors});
                    }
                    else{
                        if(results.affectedRows > 0){
                            console.log("SQL insert" +JSON.stringify(results));
                            res.send("Project Posted Successfully")
                        }
                    }
                },addProject);
            }
        }
    },getProjectId);*/
});

router.get('/getAllOpenProjects', function(req, res){
    var list= [];
    var data = {
        bList: []
    };
    console.log("user_id"+user_id);
    var user_id= req.session.userID;


    var list= [];
    let errors = "";
    var data = {
        projectsList: []
    };
    var user_id= req.session.userID;
    let getProject = {status:'Open', employer_id:{$ne : user_id}};

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("freelancer_prototype");
        dbo.collection("project").find(getProject).toArray(function(err, results) {
            if (err) throw err;
            if(results.length>0){
                let projectList = results;
                console.log("projlist"+projectList[1].employer_id);
                let getUser = {userId : {$ne : user_id}};
                MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("freelancer_prototype");
                    dbo.collection("user").find({}).toArray(function(err, results) {
                        if (err) throw err;
                        if(results.length>0){
                            console.log("projlist"+JSON.stringify(results));
                            let project = {};
                            for(let i=0;i<projectList.length;i++){
                                for(let j=0;j<results.length;j++){
                                    if(projectList[i].employer_id == results[j].user_id){
                                        project = {
                                            project_id: projectList[i].project_id,
                                            description: projectList[i].description,
                                            employer_name : results[j].name,
                                            employer_id: projectList[i].employer_id,
                                            title: projectList[i].title,
                                            avg_bid: projectList[i].avg_bid,
                                            skills:projectList[i].skills,
                                            project_completion_date: projectList[i].project_completion_date,
                                            status: projectList[i].status
                                        }
                                        list.push(project);
                                    }
                                }
                            }
                            data.projectsList = list;
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


    /*var list= [];
    var data = {
        projectsList: []
    };
    var user_id= req.session.userID;
    var getProjectList  = "select p.project_id, p.description, u.name, p.employer_id, p.title, p.avg_bid, p.project_completion_date, p.status, p.skills ";
    getProjectList = getProjectList + "from freelancer_prototype_db.project p , freelancer_prototype_db.user u where p.employer_id = u.user_id";/!*and p.status = '"+"Open"+"'"*!/

    mysql.fetchData(function(err,results){
        if(results.length > 0) {
            var i = 0;
            while(i<results.length) {
                var project = {
                    project_id: results[i].project_id,
                    description: results[i].description,
                    employer_name : results[i].name,
                    employer_id: results[i].employer_id,
                    title: results[i].title,
                    avg_bid: results[i].avg_bid,
                    skills:results[i].skills,
                    project_completion_date: results[i].project_completion_date,
                    status: results[i].status
                }
                list.push(project);
                i++;
            }
            data.projectsList = list;
            res.send(data);
        }
    },getProjectList);*/
});

//get List of all projects posted by employer
router.get('/listOfAllProjectsPostedByEmployer', function(req, res){
    /*var list= [];
    var data = {
        bList: []
    };
    console.log("/listOfAllProjectsPostedByEmployer-----------------------------------------------",req.session.userID);
    var user_id= req.session.userID;
    var getProjectList = "select p.project_id, u.user_id, p.title, p.avg_bid, u.name, p.project_completion_date, p.status";
    getProjectList = getProjectList + " from freelancer_prototype_db.project p, freelancer_prototype_db.user u";
    getProjectList = getProjectList + " where u.user_id = p.employer_id and u.user_id = "+user_id;
    mysql.fetchData(function(err,results){
        if(results.length > 0) {
            var i = 0;
            while (i < results.length) {
                var project = {
                    project_id: results[i].project_id,
                    user_id: results[i].user_id,
                    projectName: results[i].title,
                    avg_bid: results[i].avg_bid,
                    userName: results[i].name,
                    project_completion_date: results[i].project_completion_date,
                    status: results[i].status
                }
                list.push(project);
                i++;
            }
            data.bList = list;
            res.send(data);
        }
    },getProjectList);*/

    var list= [];
    var data = {
        bList: []
    };
    var d;
    var finDate;
    var user_id= req.session.userID;
    console.log("Request param user ID "+user_id);
    let getProject = {employer_id : user_id};
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("freelancer_prototype");
        dbo.collection("project").find(getProject).toArray(function(err, results) {
            if (err) throw err;
            if(results.length>0){
                let projectList = results;
                console.log("project list====================="+JSON.stringify(results));
                let getUser = {user_id : {$ne : user_id}};
                MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("freelancer_prototype");
                    dbo.collection("user").find({}).toArray(function(err, results) {
                        if (err) throw err;
                        if(results.length>0){
                            console.log("user list====================="+JSON.stringify(results));
                            let project = {};
                            for(let i=0;i<projectList.length;i++){
                                for(let j=0;j<results.length;j++){
                                    if(projectList[i].employer_id == results[j].user_id){
                                        console.log("matched!!");
                                        project = {
                                            project_id: projectList[i].project_id,
                                            user_id: projectList[i].employer_id,
                                            user_name:results[j].name,
                                            project_name: projectList[i].title,
                                            avg_bid: projectList[i].avg_bid,
                                            project_completion_date: projectList[i].project_completion_date,
                                            status: projectList[i].status
                                        }
                                        list.push(project);
                                    }
                                }
                            }
                            data.bList = list;
                            console.log("List for empl prjct ",data.bList);
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

});


function getBidsCount(project_id){
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
    /*var getBids="select count(*) as numberOfBids from bid b where b.project_id=" +project_id;
    var bids = 0;
    mysql.fetchData(function(err,results){
        console.log("Bids function result", results[0].numberOfBids);
        if(results.length > 0) {
            nBids = results[0].numberOfBids;
        }
    },getBids);
    return bids;*/
    return bids;
}

router.get('/getBids', function(req, res){
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
                //let getUser = {userId : {$ne : user_id}};
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
    /*console.log("Bids List : inside node  inside getBids");
    console.log("Bids List : inside node  inside getBids project id",req.param("project_id"));
    var list= [];
    var data = {
        bidsList: []
    };
    var project_id= req.param("project_id");
    var getProjectList="select u.user_id, b.project_id,  u.name, b.bid_price, b.period_in_days";
    getProjectList= getProjectList + " from user u, bid b ";
    getProjectList= getProjectList + " where b.user_id = u.user_id and b.project_id = "+project_id;

    console.log(getProjectList);
    mysql.fetchData(function(err,results){
        if(results.length > 0) {
            var i = 0;
            while(i<results.length) {
                var project = {
                    userId : results[i].user_id,
                    project_id : results[i].project_id,
                    name: results[i].name,
                    bid_price: results[i].bid_price,
                    period_in_days: results[i].period_in_days
                }
                list.push(project);
                i++;
            }
            console.log("List of bids inside /getBids",list);
            data.bidsList = list;
            res.send(data);
        }
    },getProjectList);*/
});

router.post('/bidProjectNow', function(req, res){
    /*var bid_id;
    var user_id = req.session.userID;
    var bidProject="insert into bid(user_id,project_id,bid_price,period_in_days) values";
    bidProject= bidProject + " ('"+user_id+"','"+req.param("project_id")+"','"+req.param("bid_price")+"','"+req.param("period_in_days")+"' )";
    console.log("insert SQL : :"+bidProject);
    var errors;
    mysql.fetchData(function (error,results) {
        if(error){
            errors="Unable to process request";
            res.status(400).json(errors);
        }
        else{
            if(results.affectedRows > 0){
                var update_bid_count="update project set avg_bid = avg_bid+1 where project_id = "+req.param("project_id");
                console.log("insert SQL : :"+update_bid_count);

                mysql.fetchData(function (error,results) {
                    if(error){
                        errors="Unable to add project at this time."
                        res.status(400).json({errors});
                    }
                    else{
                        if(results.affectedRows > 0){
                            console.log("SQL insert" +JSON.stringify(results));
                            res.send("Bid Done Successfully");
                        }
                    }
                },update_bid_count);
            }
        }
    },bidProject);*/
    getNumberOfBids(req.param("project_id"));
    console.log("bid counttttttttt : "+nBids);
    var bid_id;
    var user_id = req.session.userID;
    //var bidProject="insert into bid(userId,project_id,bid_price,period_in_days) values ('"+user_id+"','"+req.param("project_id")+"','"+req.param("bid_price")+"','"+req.param("period_in_days")+"' )";
    //var bidProject="insert into bid(userId,project_id,bid_price,period_in_days) values ('"+user_id+"','"+req.param("project_id")+"','"+req.param("bid_price")+"','"+req.param("period_in_days")+"' )";
    var errors;

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("freelancer_prototype");
        var myobj = { userId:user_id, project_id: req.param("project_id"), bid_price: req.param("bid_price"), period_in_days:req.param("period_in_days") };
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
});

router.get('/getProjectDetails', function(req, res){
    var project_id= Number(req.param("project_id"));
    var isEmployer = false;
    var errors;
    //var getProject="select * from project where project_id="+project_id;
    var getProject={project_id: project_id};
    console.log("Query is:"+JSON.stringify(getProject));
    var data = {
        projectName: "",
        description: "",
        files: "",
        skills: "",
        budgetRange: "",
        averageBid: "",
        numberOfBids: "",
        employer_id:"",
        status:"",
        transList: null
    };

    getNumberOfBids(project_id);
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        console.log("we are connected");
        var dbo = db.db("freelancer_prototype");
        dbo.collection("project").find(getProject).toArray(function(err, results) {
            if (err) throw err;
            if(results.length>0){
                if(req.session.userID == results[0].employer_id){
                    isEmployer = true;
                }
                data = {
                    isEmployer,
                    project_id: results[0].project_id,
                    projectName: results[0].title,
                    description: results[0].description,
                    files: results[0].files,
                    skills: results[0].skills,
                    budget: results[0].budget,
                    averageBid:  results[0].averageBid,
                    numberOfBids: nBids,
                    employer_id: results[0].employer_id,
                    status: results[0].status
                };
                //let getPaymentHistory = {project_id:req.param("project_id")};
                MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    console.log("we are connected");
                    let i=0,list=[];
                    var dbo = db.db("freelancer_prototype");
                    dbo.collection("payment_history").find(getProject).toArray(function(err, results) {
                        if (err) throw err;
                        if(results.length>0){
                            while(i<results.length) {
                                var transaction = {
                                    user_id: results[i].user_id,
                                    project_id: results[i].project_id,
                                    payment_type : results[i].payment_type,
                                    amount: results[i].amount
                                }
                                list.push(transaction);
                                i++;
                            }
                            data.transList = list;

                            /*//data.transList = list;
                            console.log("Project details transaction list ",data);*/
                        }
                        console.log("==================Project details transaction list================================== ",data);
                        res.send(data);
                        db.close();
                    });
                });
            }
            else {
                errors = "Unable to fetch transaction details.";
                res.status(400).json(errors);
            }
            console.log(JSON.stringify(results));
            db.close();
        });
    });
    /*console.log("Inside Project details");
    var project_id= req.param("project_id");
    getBidsCount(project_id);

    var getProject="select * from project where project_id="+project_id;
    console.log("SQL :"+getProject);

    var isEmployer = false;
    var data = {
        projectName: "",
        description: "",
        files: "",
        skills: "",
        budgetRange: "",
        averageBid: "",
        numberOfBids: "",
        employer_id:"",
        status:"",
        transList: []
    };
    mysql.fetchData(function(error,results){
        if(results.length > 0) {
            if(req.session.userID == results[0].employer_id){
                isEmployer = true;
            }
            data = {
                isEmployer,
                projectName: results[0].title,
                description: results[0].description,
                files: results[0].files,
                skills: results[0].skills,
                budget: results[0].budget,
                averageBid:  results[0].avg_bid,
                numberOfBids: nBids,
                employer_id: results[0].employer_id,
                status: results[0].status
            };

            var getTransactions = "select h.user_id, h.project_id, h.payment_type, h.amount from freelancer_prototype_db.payment_history h where h.project_id =" + req.param("project_id");
            console.log("SQL select ", getTransactions);
            mysql.fetchData(function (error, results) {
                if (error) {
                    errors = "Unable to add payment at this time."
                    res.status(400).json({errors});
                }
                else {
                    if (results.length > 0) {
                        var i = 0;
                        var list= [];
                        while(i<results.length) {
                            var transaction = {
                                user_id: results[i].user_id,
                                project_id: results[i].project_id,
                                payment_type : results[i].payment_type,
                                amount: results[i].amount
                            }
                            list.push(transaction);
                            i++;
                        }
                        data.transList = list;
                        console.log("Project details transaction list ",data.transList);
                        res.send(data);
                    }else{
                        res.send(data);
                    }
                }
            }, getTransactions);
        }
    },getProject);*/
});

router.post('/hireFreelancer', function(req, res){
    //var addFreelancerDetails = "insert into project (user_id) values ('" + req.param("user_id") +"') where project_id = "+req.param("project_id");
/*    var addFreelancerDetails = "update project set freelancer_id ='" + req.param("user_id") +"' where project_id = "+req.param("project_id");
    var error = "";
    var data = {};
    mysql.fetchData(function(err,results){
        console.log(JSON.stringify(results));
        if(err){
            error = "Unable to process your request";
            res.status(400).json({error});
        }
        else if(results.affectedRows > 0) {
            data.message = "Freelancer Hired Successfully";
            res.send(data);
        }
    },addFreelancerDetails);*/
    var user_id = req.param("user_id");

    var addFreelancerDetails = {$set: {freelancer_id:req.param("user_id")}};
    var error = "";
    var data = {};
    MongoClient.connect(url, function(err, db) {
        if (err) {
            errors="Unable to process your request"
            res.status(400).json({errors});
            throw err
        };
        var dbo = db.db("freelancer_prototype");
        var myquery = { project_id: req.param("project_id")};
        dbo.collection("project").updateOne(myquery, addFreelancerDetails, function(err, results) {
            if (err) throw err;
            console.log("1 document updated");
            let details ={};
            details.user_id = user_id;
            details.project_id = req.param("project_id");
            console.log("inside hire freelancer",details);
            sendEmailToFreelancer(function(err,results){
                if(err){
                    error = "Unable to process your request";
                    res.status(400).json({error});
                }else{
                    //data.email = results.email;
                    res.send(data);
                }
            },details);
            db.close();
        });
    });
});

function sendEmailToFreelancer(callback,details){

    var getProject={project_id:details.project_id}, data, errors, project_name="";
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("freelancer_prototype");
        dbo.collection("project").find(getProject).toArray(function(err, result) {
            if (err) throw err;
            else{
                project_name = result[0].title;
            }
            console.log(result);
            db.close();
        });
    });

    var getEmail={user_id:details.user_id};
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("freelancer_prototype");
        dbo.collection("user").find(getEmail).toArray(function(err, result) {
            if (err) throw err;
            else{
                data = {
                    email: result[0].email_id
                };
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'varshakatariya0689@gmail.com',
                        pass: 'VarshaKatariya@12'
                    },
                    tls:{ rejectUnauthorized: false}
                });

                var mailOptions = {
                    from: 'varshakatariya0689@gmail.com',
                    to: 'varshaamrutlal.katariya@sjsu.edu',//data.email,
                    subject: 'Congratulations for getting hired as freelancer',
                    text: 'Dear User, Congratulations for getting hired as freelancer for project '+project_name+'. Please check more details by logging in to your freelancer account. Have a great day'
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                callback(err, result);

            }
            console.log(result);
            db.close();
        });
    });
    /*  var getEmail = "select email from  user where userId='" + userId + "'";
    var error = "";
    var data = {};
    mysql.fetchData(function(err,results){
        console.log(JSON.stringify(results));
        if(err){
            error = "Unable to process your request";
            //return err;
        }
        else if(results.length > 0) {
            data = {
                email: results[0].email
            };
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'varshhakataria@gmail.com',
                    pass: 'ShubhVarsha@12'
                },
                tls:{ rejectUnauthorized: false}
            });

            var mailOptions = {
                from: 'varshhakataria@gmail.com',
                to: data.email,
                subject: 'Sending Email using Node.js',
                text: 'You are Hired...congratulations!!!'
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            callback(err, results);
            //return data;
            //res.send(data);
        }
    },getEmail);*/
}

router.post('/makePayment', function(req, res){

    console.log("bid price",req.param("bid_price"));
    var error = "";
    var errors = "";
    var data = {};
    var updateEmpBal = "update user u set u.balance = u.balance - "+ req.param("bid_price") +" where u.user_id = "+req.param("employer_id");

    //1
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("freelancer_prototype");
        var myquery = { user_id:req.param("employer_id")};
        var newvalues = { $inc: { balance: -(req.param("bid_price"))} };
        //var newvalues = { $set: {name: req.param("name"), phone: req.param("phone"), about:req.param("about"), skills:req.param("skills")} };
        dbo.collection("user").updateOne(myquery, newvalues, function(err, result) {
            if (err) throw err;
            else{
                console.log("1 document updated");
                //2
                MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    console.log("we are connected");
                    var dbo = db.db("freelancer_prototype");
                    dbo.collection("payment_history").find().sort({trans_id:-1}).limit(1).toArray(function(err, result) {
                        if (err) throw err;
                        let trans_id = result[0].trans_id;
                        console.log("transaction id of last transaction before adding for employer debit in payment_history",trans_id);
                        //3
                        MongoClient.connect(url, function(err, db) {
                            if (err) throw err;
                            else {
                                var dbo = db.db("freelancer_prototype");
                                var myobj = {
                                    trans_id: trans_id+1,
                                    user_id: req.param("employer_id"),
                                    project_id: req.param("project_id"),
                                    payment_type: 'Db',
                                    amount: req.param("bid_price")
                                };
                                dbo.collection("payment_history").insertOne(myobj, function (err, result) {
                                    if (err) {
                                        errors="Unable to deduct payment from employer at this time."
                                        res.status(400).json({errors});
                                        throw err;
                                    }
                                    else{
                                        //4
                                        MongoClient.connect(url, function(err, db) {
                                            if (err) throw err;
                                            var dbo = db.db("freelancer_prototype");
                                            var myquery = { user_id:req.param("user_id") };
                                            var newvalues = { $inc: { balance: +(req.param("bid_price"))} };
                                            dbo.collection("user").updateOne(myquery, newvalues, function(err, result) {
                                                if (err) throw err;
                                                else{
                                                    //5
                                                    MongoClient.connect(url, function(err, db) {
                                                        if (err) throw err;
                                                        var dbo = db.db("freelancer_prototype");
                                                        dbo.collection("payment_history").find().sort({trans_id:-1}).limit(1).toArray(function(err, result) {
                                                            if (err) throw err;
                                                            else {
                                                                let trans_id = result[0].trans_id;
                                                                console.log("transaction id of last transaction before adding for user credit in payment_history",trans_id);
                                                                //6
                                                                MongoClient.connect(url, function(err, db) {
                                                                    if (err) throw err;
                                                                    else {
                                                                        var dbo = db.db("freelancer_prototype");
                                                                        var myobj = {
                                                                            trans_id: trans_id+1,
                                                                            user_id: req.param("user_id"),
                                                                            project_id: req.param("project_id"),
                                                                            payment_type: 'Cr',
                                                                            amount: req.param("bid_price")
                                                                        };
                                                                        dbo.collection("payment_history").insertOne(myobj, function (err, result) {
                                                                            if (err) throw err;
                                                                            else{
                                                                                //7
                                                                                MongoClient.connect(url, function(err, db) {
                                                                                    if (err) throw err;
                                                                                    var dbo = db.db("freelancer_prototype");
                                                                                    var myquery = { project_id:req.param("project_id") };
                                                                                    var newvalues = { $set: {status: 'Closed'} };
                                                                                    dbo.collection("project").updateOne(myquery, newvalues, function(err, result) {
                                                                                        if (err) throw err;
                                                                                        else{
                                                                                            //var getTransactions = "select h.user_id, h.project_id, h.payment_type, h.amount from payment_history h where h.project_id =" + req.param("project_id");
                                                                                            let getList={project_id:req.param("project_id")};
                                                                                            MongoClient.connect(url, function(err, db) {
                                                                                                if (err) throw err;
                                                                                                console.log("we are connected");
                                                                                                var dbo = db.db("freelancer_prototype");
                                                                                                dbo.collection("payment_history").find(getList).toArray(function(err, results) {
                                                                                                    console.log("*******************************last**************************");
                                                                                                    if (err) throw err;
                                                                                                    else if(results.length>0){
                                                                                                        let i = 0,transaction={}, data = {};
                                                                                                        let list= [];
                                                                                                        while(i<results.length) {
                                                                                                            transaction = {
                                                                                                                user_id: results[i].user_id,
                                                                                                                project_id: results[i].project_id,
                                                                                                                payment_type : results[i].payment_type,
                                                                                                                amount: results[i].amount
                                                                                                            }
                                                                                                            list.push(transaction);
                                                                                                            i++;
                                                                                                        }

                                                                                                        data.transList = list;
                                                                                                        data.message= "Payment done Successfully";
                                                                                                        res.send(data);
                                                                                                    }
                                                                                                    else {
                                                                                                        errors="Unable to process your request.";
                                                                                                        res.status(400).json(errors);
                                                                                                    }
                                                                                                    console.log(result);
                                                                                                    db.close();
                                                                                                });
                                                                                            });
                                                                                        }
                                                                                        db.close();
                                                                                    });
                                                                                });
                                                                            }
                                                                            db.close();
                                                                        });
                                                                    }
                                                                });
                                                                db.close();
                                                            }
                                                        });
                                                    });
                                                }
                                                console.log("1 document updated");
                                                db.close();
                                            });
                                        });

                                    }
                                    db.close();
                                });
                            }
                        });
                        db.close();
                    });
                });
            }
            db.close();
        });
    });

    /*console.log("bid price",req.param("bid_price"));
    var error = "";
    var data = {};
    var updateEmpBal = "update freelancer_prototype_db.user u set u.balance = u.balance - "+ req.param("bid_price") +" where u.user_id = "+req.param("employer_id");

    var errors;
    mysql.fetchData(function (error,results) {
        if(error){
            errors="Unable to process request";
            res.status(400).json(errors);
        }
        else{
            console.log("update Emp balance SQL : :"+updateEmpBal);
            if(results.affectedRows > 0){
                var getTransId="select max(trans_id) as maxCnt from freelancer_prototype_db.payment_history";
                mysql.fetchData(function (error,results) {
                    if(error){
                        errors="Unable to process request";
                        res.status(400).json(errors);
                    }
                    else {
                        if (results.length > 0) {
                            var transId = results[0].maxCnt + 1;
                            var update_emp_history = "insert into freelancer_prototype_db.payment_history (trans_id, user_id, project_id, payment_type, amount) values ( "+ transId + "," +req.param("employer_id") +"," + req.param("project_id")+ "," +"'Db'"+"," +req.param("bid_price")+" )";
                            console.log("SQL insert",update_emp_history);
                            mysql.fetchData(function (error,results) {
                                if(error){
                                    errors="Unable to deduct payment from employer at this time."
                                    res.status(400).json({errors});
                                }
                                else{
                                    console.log("update Eupdate_emp_history : :"+update_emp_history);
                                    if(results.affectedRows > 0){
                                        console.log("SQL update" +JSON.stringify(results));
                                        var updateUserBal = "update freelancer_prototype_db.user u set u.balance = u.balance + "+ req.param("bid_price") +" where u.user_id = "+req.param("user_id");
                                        console.log("SQL Update : :"+updateUserBal);

                                        mysql.fetchData(function (error,results) {
                                            if(error){
                                                errors="Unable to add payment at this time."
                                                res.status(400).json({errors});
                                            }
                                            else{
                                                console.log("update updateUserBal : :"+updateUserBal);
                                                if(results.affectedRows > 0){
                                                    console.log("SQL insert" +JSON.stringify(results));
                                                    var getTransId1="select max(trans_id) as maxCnt from freelancer_prototype_db.payment_history";
                                                    mysql.fetchData(function (error,results) {
                                                        if (error) {
                                                            errors = "Unable to process request";
                                                            res.status(400).json(errors);
                                                        }
                                                        else {
                                                            if (results.length > 0) {
                                                                var transId1 = results[0].maxCnt + 1;
                                                                var update_emp_history = "insert into freelancer_prototype_db.payment_history (trans_id, user_id, project_id, payment_type, amount) values ( " + transId1 +","+ req.param("user_id") + "," + req.param("project_id") + "," + "'Cr'" + "," + req.param("bid_price") + " )";
                                                                console.log("SQL insert ", update_emp_history);
                                                                mysql.fetchData(function (error, results) {
                                                                    if (error) {
                                                                        errors = "Unable to add payment at this time."
                                                                        res.status(400).json({errors});
                                                                    }
                                                                    else {
                                                                        if (results.affectedRows > 0) {
                                                                            console.log("SQL insert ", update_emp_history);
                                                                            console.log("SQL insert" + JSON.stringify(results));

                                                                            var update_project = "update freelancer_prototype_db.project p set p.status = " + "'Closed'" + " where p.project_id = " + req.param("project_id");
                                                                            console.log("SQL insert ", update_project);
                                                                            mysql.fetchData(function (error, results) {
                                                                                if (error) {
                                                                                    errors = "Unable to add payment at this time."
                                                                                    res.status(400).json({errors});
                                                                                }
                                                                                else {
                                                                                    if (results.affectedRows > 0) {
                                                                                        var getTransactions = "select h.user_id, h.project_id, h.payment_type, h.amount from freelancer_prototype_db.payment_history h where h.project_id =" + req.param("project_id");
                                                                                        console.log("SQL select ", getTransactions);
                                                                                        mysql.fetchData(function (error, results) {
                                                                                            if (error) {
                                                                                                errors = "Unable to add payment at this time."
                                                                                                res.status(400).json({errors});
                                                                                            }
                                                                                            else {
                                                                                                if (results.length > 0) {
                                                                                                    var i = 0;
                                                                                                    var list= [];
                                                                                                    while(i<results.length) {
                                                                                                        var transaction = {
                                                                                                            user_id: results[i].user_id,
                                                                                                            project_id: results[i].project_id,
                                                                                                            payment_type : results[i].payment_type,
                                                                                                            amount: results[i].amount
                                                                                                        }
                                                                                                        list.push(transaction);
                                                                                                        i++;
                                                                                                    }
                                                                                                    var data = {transList: list,
                                                                                                        message: "Payment done Successfully"
                                                                                                    }
                                                                                                    res.send(data);
                                                                                                }
                                                                                            }
                                                                                        }, getTransactions);
                                                                                    }
                                                                                }
                                                                            }, update_project);
                                                                        }
                                                                    }
                                                                }, update_emp_history);
                                                            }
                                                        }
                                                    },getTransId1);
                                                }
                                            }
                                        },updateUserBal);
                                    }
                                }
                            },update_emp_history);
                        }
                    }
                },getTransId);
            }
        }
    },updateEmpBal);*/
});

function changeToDate(date){
    if (date instanceof Date)
        return date.toLocaleFormat("%Y-%m-%d %H:%M:%S")
}

module.exports = router;