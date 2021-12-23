module.exports = async function (context, req) {

    const user = (req.query.user || (req.body && req.body.user));
    const pull = (req.query.pull || (req.body && req.body.pull));

    let queryString = '';

    // Yes, I am fully aware that the queries below are not SQL Injection-proof.
    if (!user) {
        queryString = "SELECT * FROM Jokes";
    }
    else if (pull && pull == 'mine') {
        queryString = "SELECT * FROM Jokes WHERE UserId = " + user;
    }
    else if (pull && pull == 'others') {
        queryString = "SELECT * FROM Jokes WHERE UserId != " + user;
    }
    else {
        queryString = "SELECT * FROM Jokes WHERE UserId = " + user;
    }

    const sql = require('mssql');

    const AZURE_CONNECTION_STRING = process.env["DB_CONNECTION_STRING"];

    let connection = new Promise(function(resolve, reject) {
        sql.connect(AZURE_CONNECTION_STRING, function(error) {
            if (error) { 
                reject("Database connection failed");
                throw error;
            } else {
                resolve("Database connected");
            }
        });
    });
    console.log(await connection);
    
    let databaseQuery = new Promise(function(resolve, reject){
        new sql.Request().query(queryString, function (error, results) {
            if (error) {
                reject("Database query failed");
                throw error;
            } else {
                resolve(JSON.stringify(results.recordset));
            }
        });
    });
    
    console.log(await databaseQuery);
    
    context.res = {
        status: 200,
        body: await databaseQuery
    };

    context.done();
    
}