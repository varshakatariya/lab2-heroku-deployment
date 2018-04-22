var express = require('express');
var router = express.Router();
var mysql = require('mysql');

//Put your mysql configuration settings - user, password, database and port
function getConnection(){
    var connectionPool = mysql.createPool({
        connectionLimit : 500,
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        database : 'freelancer_prototype_db',
        port	 : 3306
    });
    return connectionPool;
}

/*function getConnection(){
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        database : 'freelancer_prototype_db',
        port	 : 3306
    });
    return connection;
}*/

function fetchData(callback,sqlQuery){

    console.log("\nSQL Query::"+sqlQuery);

    var pool = getConnection();

    pool.getConnection(function(err, connection){
        if(err){
            console.log("ERROR: "+err.message);
            return;
        }
        connection.query(sqlQuery,function(error, results, fields) {
            if (error) {
                console.log("ERROR: " + error.message);
            }
            else{
                console.log("DB results : ",results);
            }
            callback(err, results);
            console.log("\nConnection closed..");
        });

    });
}
/*
function fetchData(callback,sqlQuery){

    console.log("\nSQL Query::"+sqlQuery);

    var connection=getConnection();

    connection.query(sqlQuery, function(err, rows, fields) {
        if(err){
            console.log("ERROR: " + err.message);
        }
        else
        {	// return err or result
            console.log("DB Results:"+rows);

        }
        callback(err, rows);
    });
    console.log("\nConnection closed..");
    connection.end();
}*/

exports.fetchData=fetchData;
