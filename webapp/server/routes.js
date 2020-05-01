var config = require('./db-config.js');
var mysql = require('mysql');
var oracledb = require('oracledb');

let connection;
async function run(){
  oracledb.outFormat = oracledb.OBJECT;
  connection = await oracledb.getConnection(config);
}
run();


async function getAllCategories(req, res) {
  var query = 
    `SELECT * 
    FROM (SELECT DISTINCT Category FROM Category 
    GROUP BY Category 
    ORDER BY COUNT(*) DESC) 
    WHERE rownum <=20`;
    try{
       console.log("Successfully connected to Oracle!")
       result = await connection.execute(query);
       res.json(result.rows);
    } catch(err) {
        console.log("Error: ", err);
      } 
};

async function getTopProductsInCategory(req, res) {
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
  ) WHERE rownum <=10`;
    try{
       console.log("Successfully connected to Oracle!")
       result = await connection.execute(query);
       res.json(result.rows);
    } catch(err) {
        console.log("Error: ", err);
      } 
};

// The exported functions, which can be accessed in index.js.
module.exports = {
  getAllCategories: getAllCategories,
  getTopProductsInCategory: getTopProductsInCategory,
  /*getLongestReviews: getLongestReviews,
  getProductInfo: getProductInfo,
  getProductStats: getProductStats,
  getTopReviewers: getTopReviewers,
  getReviewerStats: getReviewerStats*/
}
