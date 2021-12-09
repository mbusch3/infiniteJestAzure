var allUsers = [];

module.exports = async function (context, req) {

    // const sql = require('mssql');

    // const AZURE_CONNECTION_STRING = process.env["DB_CONNECTION_STRING"];
    // allUsers = [];

    // let connectionPromise = new Promise(function(resolve, reject) {
    //     sql.connect(AZURE_CONNECTION_STRING);
    //     var userQuery = new sql.Request();
    //     var results = userQuery.query("SELECT * FROM Users FOR JSON PATH", function (err) { if (err) throw err; });
    //     if(results){
    //         resolve(results);
    //     }
    //     else {
    //         reject(null);
    //     }
    // });
    
    // connectionPromise.then(
    //     function(results) { context.res(results); },
    //     function(error) { throw error; }
    // );
        
    // context.res.json({
    //     text: allUsers,
    // });


    // VERSION 1 - What am I missing to make this readable?
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
        var userQuery = new sql.Request();
        var queryResults = userQuery.query("SELECT * FROM Users", function (error, results) {
            console.log("Here's what I found in the database:\n");
            console.log(results.recordset);
            if (error) {
                reject("Database query failed");
                throw error;
            } else {
                resolve(JSON.stringify(results.recordset));
            } 
        });
    });
    
    console.log("Here's what's outside of the query:\n");
    console.log(await databaseQuery);

    context.res = {
        text: await databaseQuery
    }



    // VERSION 2
    // const { Connection, Request } = require("tedious");

    // // Create connection to database
    // const config = {
    //   authentication: {
    //     options: {
    //       userName: "cloudadmin",
    //       password: "Outs1der"
    //     },
    //     type: "default"
    //   },
    //   server: "infinite-jest.database.windows.net",
    //   options: {
    //     database: "infiniteJest",
    //     encrypt: true
    //   }
    // };
    
    // /* 
    //     //Use Azure VM Managed Identity to connect to the SQL database
    //     const config = {
    //         server: process.env["db_server"],
    //         authentication: {
    //             type: 'azure-active-directory-msi-vm',
    //         },
    //         options: {
    //             database: process.env["db_database"],
    //             encrypt: true,
    //             port: 1433
    //         }
    //     };
    
    //     //Use Azure App Service Managed Identity to connect to the SQL database
    //     const config = {
    //         server: process.env["db_server"],
    //         authentication: {
    //             type: 'azure-active-directory-msi-app-service',
    //         },
    //         options: {
    //             database: process.env["db_database"],
    //             encrypt: true,
    //             port: 1433
    //         }
    //     });
    
    // */
    
    // const connection = new Connection(config);
    
    // // Attempt to connect and execute queries if connection goes through
    // connection.on("connect", err => {
    //   if (err) {
    //     console.error(err.message);
    //   } else {
    //     queryDatabase();
    //   }
    // });
    
    // connection.connect();
    
    // function queryDatabase() {
    //   console.log("Reading rows from the Table...");
    
    //   // Read all rows from table
    //   const request = new Request(
    //     `SELECT *
    //      FROM [dbo].[Users]`,
    //     (err, rowCount) => {
    //       if (err) {
    //         console.error(err.message);
    //       } else {
    //         console.log(`${rowCount} row(s) returned`);
    //       }
    //     }
    //   );
    //   var responseMessage = '';
    //   request.on("row", columns => {
    //     columns.forEach(column => {
    //       responseMessage += ("%s\t%s", column.metadata.colName, column.value);
    //     });
    //   });

    //   request.on("requestCompleted", function() {
    //       context.res = {
    //           status: 200,
    //           body: "This here means that everything ran!\n" + responseMessage,
    //       }
    //   })
    
    //   connection.execSql(request);
    // }



    
    // Quick connection test
    // context.res = {
    //     text: "Hello from the API"
    // };

}