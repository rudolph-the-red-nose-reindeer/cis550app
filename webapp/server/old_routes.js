var config = require('./db-config.js');
var mysql = require('mysql');
var oracledb = require('oracledb');


var testfunc =  async function() {
  config.connectionLimit = 10;
  var connection = oracledb.getConnection({
    user : 'cis550admin',
    password : 'Vhr8z*U{.8cr',
    connectString : '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=cis550project.c2khsgz1epv9.us-east-1.rds.amazonaws.com)(PORT=1521))(CONNECT_DATA=(SID=CIS550PR)))'
  }); 
  console.log('Hi2');
  return connection;
}

//var connection = await testfunc();

function getDBConnection(properties, oracledb, callback) {
  var dbProperties = {
    user          : properties[DB_USER],
    password      : properties[DB_PASSWORD],
    connectString : properties[DB_CONNECTION_STRING]
  };

  try {
    if (typeof oracledb !== 'undefined' && oracledb !== null ) {
        oracledb.getConnection(dbProperties)
         .then( conn => {
            console.log("After getting connection" + conn);                
             return callback(null, conn);
        })
        .catch(err => { 
            console.log("Error getting connection" + err);
            return callback(err, null);
        });
    } else {
        console.log("oracledb is undefined");
    }
  } catch (e) {
    console.log('Failed to connect oracledb');
    console.log(e);
    return callback(e, null);
  }
}


/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

/*(async function() {
  try{
     connection = await oracledb.getConnection(config);
     console.log("Successfully connected to Oracle!");
  } catch(err) {
      console.log("Error: ", err);
    } finally {
      if (connection) {
        try {
          connection.execute(
            `SELECT DISTINCT Category
            FROM Category;`,
            [],  
           function(err, result) {
              if (err) {
                console.error(err.message);
                return;
              }
              console.log(result.rows);
           });
          await connection.close();
        } catch(err) {
          console.log("Error when closing the database connection: ", err);
        }
      }
    }
  })()*/


  
    


/* ---- (Dashboard) ---- */
/*function getAllCategories(req, res) {
  console.log('check2');
  var query = `
    SELECT DISTINCT Category
    FROM Category;
  `;
  try {
    connection.execute(
      query,
      [],  
     function(err, result) {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log('Hi');
        console.log(result.rows);
        res.json(result.rows);
     });
  } catch(err) {
    console.log("Error when closing the database connection: ", err);
  }
  /*connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};*/


function getAllCategories(req, res) {
  console.log('check2');
  var query = "SELECT DISTINCT Category FROM Category";
  (async function() {
    try{
       connection = await oracledb.getConnection({
        user : 'cis550admin',
        password : 'Vhr8z*U{.8cr',
        connectString : '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=cis550project.c2khsgz1epv9.us-east-1.rds.amazonaws.com)(PORT=1521))(CONNECT_DATA=(SID=CIS550PR)))'
        });
       console.log("Successfully connected to Oracle!")
       //oracledb.outFormat = oracledb.OBJECT;
       result = await connection.execute(query);
       res.json(result.rows);
       console.log(result.rows);
    } catch(err) {
        console.log("Error: ", err);
      } finally {
        if (connection) {
          try {
            await connection.close();
          } catch(err) {
            console.log("Error when closing the database connection: ", err);
          }
        }
      }
    })() 
};





/* ---- (Dashboard) ---- */
function getTopProductsInCategory(req, res) {
  var inputCategory = req.params.category;
    var query = `
    SELECT * FROM (
    WITH products AS (SELECT Asin
    FROM Category
    WHERE Category = '${inputCategory}'),
    ratings AS (SELECT  Asin, AVG(Overall) AS rating, COUNT(*) AS numReviews
    FROM Review
    GROUP BY Asin)
    SELECT PR.title, R.rating, R.numReviews
    FROM products P JOIN ratings R ON P.Asin=R.Asin JOIN Product PR ON P.Asin = PR.Asin
    ORDER BY R.rating DESC, R.numReviews DESC
  ) WHERE rownum <=10;
  `;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

/* ---- (Reviews) ---- */
function getLongestReviews(req, res) {
  var inputTitle = req.params.title;
  //var inputNum = req.params.num;
    var query = `
    SELECT * FROM(
    SELECT P.title AS productName, R.Overall AS rating, R.reviewText AS review, RE.Name AS reviewerName, R.time AS time
    FROM Review R JOIN Product P ON R.Asin = P.Asin JOIN Reviewer RE ON R.reviewerID = RE.reviewerID
    WHERE R.Asin IN (SELECT Asin
    FROM Product
    WHERE title = '${inputTitle}')
    ORDER BY R.time DESC, RE.Name) WHERE rownum <= 10;

  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
    });
};






/* ---- (Products) ---- */
function getProductInfo(req, res) {
  var inputTitle = req.params.title;
  var query = `
  SELECT * FROM(
  SELECT P.Description, P.price, P.brand, RE.Name, R.reviewText, R.Overall, R.reviewDate
  FROM Review R JOIN Product P ON R.Asin=P.Asin JOIN Reviewer RE ON R.reviewerID = RE.reviewerID
  WHERE R.Asin IN (SELECT Asin
  FROM Product
  WHERE title = '${inputTitle}')
  ORDER BY R.Overall) WHERE rownum <= 10;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getProductStats(req, res) {
  var inputTitle = req.params.title;
  var query = `
  SELECT COUNT(*) AS numReviews, AVG(R.Overall) AS rating
  FROM Review R JOIN Product P ON R.Asin = P.Asin
  WHERE P.title = '${inputTitle}'
  GROUP BY R.Asin;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

/* ---- (Reviewers) ---- */
function getTopReviewers(req, res) {
  var query = `
  SELECT * FROM(
  SELECT RE.Name, COUNT(*)
  FROM Review R JOIN Reviewer RE ON R.reviewerID = RE.reviewerID
  GROUP BY RE.Name
  ORDER BY COUNT(*) DESC) WHERE rownum <= 5;

  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getReviewerStats(req, res) {
var inputName = req.params.name;
  var query = `
  SELECT RE.Name, COUNT(*) AS numReviews, AVG(R.Overall) AS avgRating
  FROM Review R JOIN Reviewer RE ON R.reviewerID = RE.reviewerID
  WHERE RE.Name = '` + inputName + `'
  GROUP BY RE.Name;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

// The exported functions, which can be accessed in index.js.
module.exports = {
  getAllCategories: getAllCategories,
  getTopProductsInCategory: getTopProductsInCategory,
  getLongestReviews: getLongestReviews,
  getProductInfo: getProductInfo,
  getProductStats: getProductStats,
  getTopReviewers: getTopReviewers,
  getReviewerStats: getReviewerStats

}
