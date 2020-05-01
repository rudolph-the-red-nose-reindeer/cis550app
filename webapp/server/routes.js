var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


/* ---- (Dashboard) ---- */

function getAllCategories(req, res) {
  var query = `
    SELECT DISTINCT Category
    FROM Category
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};
function getCheapestReviewedProductsInCategory(req, res) {
  var inputCategory = req.params.category;
    var query = `
    SELECT * FROM (
    WITH products AS (SELECT Asin
    FROM Category
    WHERE Category = '` + inputCategory + `'),
    ratings AS (SELECT  Asin, AVG(Overall) AS rating, COUNT(*) AS numReviews
    FROM Review
    GROUP BY Asin)
    SELECT PR.title, PR.price, R.rating, R.numReviews
    FROM products P JOIN ratings R ON P.Asin=R.Asin JOIN Product PR ON P.Asin = PR.Asin
    WHERE PR.title IS NOT NULL
    ORDER BY PR.price, R.rating DESC, R.numReviews DESC
  ) WHERE rownum <=10
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getMostExpensiveReviewedProductsInCategory(req, res) {
  var inputCategory = req.params.category;
    var query = `
    SELECT * FROM (
    WITH products AS (SELECT Asin
    FROM Category
    WHERE Category = '` + inputCategory + `'),
    ratings AS (SELECT  Asin, AVG(Overall) AS rating, COUNT(*) AS numReviews
    FROM Review
    GROUP BY Asin)
    SELECT PR.title, PR.price, R.rating, R.numReviews
    FROM products P JOIN ratings R ON P.Asin=R.Asin JOIN Product PR ON P.Asin = PR.Asin
    WHERE PR.title IS NOT NULL
    ORDER BY CASE WHEN PR.price IS NULL THEN 1 ELSE 0 END, PR.price DESC, R.rating DESC,
    R.numReviews DESC
  ) WHERE rownum <=10
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


  function getMostReviewedProductsInCategory(req, res) {
    var inputCategory = req.params.category;
      var query = `
      SELECT * FROM (
      WITH products AS (SELECT Asin
      FROM Category
      WHERE Category = '` + inputCategory + `'),
      ratings AS (SELECT  Asin, AVG(Overall) AS rating, COUNT(*) AS numReviews
      FROM Review
      GROUP BY Asin)
      SELECT PR.title, R.rating, R.numReviews
      FROM products P JOIN ratings R ON P.Asin=R.Asin JOIN Product PR ON P.Asin = PR.Asin
      WHERE PR.title IS NOT NULL
      ORDER BY R.numReviews DESC, R.rating DESC
    ) WHERE rownum <=10
    `;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

unction getTopReviewedProductsInCategory(req, res) {
  var inputCategory = req.params.category;
    var query = `
    SELECT * FROM (
    WITH products AS (SELECT Asin
    FROM Category
    WHERE Category = '` + inputCategory + `'),
    ratings AS (SELECT Asin, AVG(Overall) AS rating, COUNT(*) AS numReviews
    FROM Review
    GROUP BY Asin)
    SELECT PR.title, R.rating, R.numReviews
    FROM products P JOIN ratings R ON P.Asin=R.Asin JOIN Product PR ON P.Asin = PR.Asin
    WHERE PR.title IS NOT NULL
    ORDER BY R.rating DESC, R.numReviews DESC
  ) WHERE rownum <=10
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
  //var inputNum = req.params.num;
    var query = `
    SELECT * FROM(
    SELECT P.title AS productName, R.Overall AS rating, R.reviewText AS review,
    RE.Name AS reviewerName, R.time AS time
    FROM Review R JOIN Product P ON R.Asin = P.Asin JOIN Reviewer RE ON
    R.reviewerID = RE.reviewerID
    WHERE R.Asin IN (SELECT Asin
    FROM Product
    WHERE title = '` + inputTitle + `')
    ORDER BY R.time DESC, R.Overall) WHERE rownum <= 10

  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
    });
};


function getNewestReviews(req, res) {
  var inputTitle = req.params.title;
    var query = `
    SELECT * FROM(
    SELECT RE.name, R.reviewdate, R.Overall AS rating, P.title AS productName, R.reviewText AS review,
    RE.Name AS reviewerName
    FROM Review R JOIN Product P ON R.Asin = P.Asin JOIN Reviewer RE ON R.reviewerID = RE.reviewerID
    WHERE P.title = '` + inputTitle + `'
    ORDER BY CASE WHEN R.reviewdate IS NULL THEN 1 ELSE 0 END, to_date(R.reviewdate, 'mm dd, yyyy') DESC,
    R.Overall DESC) WHERE rownum <= 10

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
  FROM Product P LEFT JOIN Review R ON R.Asin=P.Asin LEFT JOIN Reviewer RE ON R.reviewerID = RE.reviewerID
  WHERE R.Asin IN (SELECT Asin
  FROM Product
  WHERE title = '` + inputTitle + `')
  ORDER BY CASE WHEN R.Overall IS NULL THEN 1 ELSE 0 END, R.Overall DESC) WHERE rownum <= 10
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getProductStats(req, res) {
  var inputTitle = req.params.title;
  var query = `
  SELECT COUNT(*) AS numReviews, AVG(R.Overall) AS rating
  FROM Review R JOIN Product P ON R.Asin = P.Asin
  WHERE P.title = '` + inputTitle + `'
  GROUP BY R.Asin
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getTopProductsInBrand(req, res) {
  var inputBrand = req.params.brand;
  var query = `
  SELECT * FROM(
  SELECT P.title, P.Description, P.price, AVG(R.Overall)
  FROM Product P LEFT JOIN Review R ON R.Asin=P.Asin
  WHERE P.brand = '` + inputBrand + `'
  GROUP BY P.title, P.Description, P.price
  ORDER BY CASE WHEN AVG(R.Overall) IS NULL THEN 1 ELSE 0 END, AVG(R.Overall) DESC,
  COUNT(*) DESC) WHERE rownum <= 10
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getMostReviewedBrands(req, res) {
  var query = `
  SELECT * FROM(
  SELECT P.brand, COUNT(*) AS numReviews, AVG(R.Overall) AS aveRating
  FROM Product P JOIN Review R ON R.Asin= P.Asin
  WHERE P.brand IS NOT NULL
  GROUP BY P.brand
  ORDER BY COUNT(*) DESC, AVG(R.Overall) DESC) WHERE rownum <= 10
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};



function getMostExpensiveProductsInBrand(req, res) {
  var inputBrand = req.params.brand;
  var query = `
  SELECT * FROM(
  SELECT P.title, P.Description, P.price, AVG(R.Overall)
  FROM Product P LEFT JOIN Review R ON R.Asin=P.Asin
  WHERE P.brand = '` + inputBrand + `'
  GROUP BY P.title, P.Description, P.price
  ORDER BY CASE WHEN P.price IS NULL THEN 1 ELSE 0 END, P.price DESC,
  CASE WHEN AVG(R.Overall) IS NULL THEN 1 ELSE 0 END, AVG(R.Overall) DESC,
  COUNT(*) DESC) WHERE rownum <= 10
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


function getBrandStats(req, res) {
  var inputBrand = req.params.brand;
  var query = `
  SELECT AVG(R.Overall) AS aveRating, AVG(P.price) AS avePrice
  FROM Review R RIGHT JOIN Product P ON R.Asin = P.Asin
  WHERE P.brand = '` + inputBrand + `'
  GROUP BY P.brand
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getRelations(req, res) {
    var query = `
    SELECT DISTINCT label FROM related
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getRelated(req, res) {
  var inputTitle = req.params.title;
  var inputLabel = req.params.relation;
    var query = `
    SELECT * FROM(
    SELECT PR.title, PR.Description, PR.price, AVG(RE.Overall) AS aveRatings
    FROM product P JOIN related R ON P.Asin=R.Asin JOIN Product PR
    ON R.asinRelated = PR.Asin LEFT JOIN Review RE ON RE.Asin = PR.Asin
    WHERE P.title = '` + inputTitle+ `' AND R.label = '` + inputLabel + `'
    GROUP BY PR.title, PR.Description, PR.price
    ORDER BY CASE WHEN AVG(RE.Overall) IS NULL THEN 1 ELSE 0 END,
    AVG(RE.Overall) DESC, CASE WHEN PR.price IS NULL THEN 1 ELSE 0 END,
    PR.price DESC
  ) WHERE rownum <=10
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};
/* ---- (Reviewers) ---- */
function getTopReviewers(req, res) {
  var query = `
  SELECT * FROM(
  SELECT RE.Name, COUNT(*) AS numReviews
  FROM Review R JOIN Reviewer RE ON R.reviewerID = RE.reviewerID
  GROUP BY RE.Name
  ORDER BY COUNT(*) DESC) WHERE rownum <= 5

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
  GROUP BY RE.Name
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getReviewerTime(req, res) {
var inputName = req.params.name;
  var query = `
  SELECT RE.Name, SUM(R.time) AS totalTime
  FROM Review R JOIN Reviewer RE ON R.reviewerID = RE.reviewerID
  WHERE RE.Name = '` + inputName + `'
  GROUP BY RE.Name
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getTopReviewsByReviewer(req, res) {
  var inputName = req.params.name;
    var query = `
    SELECT * FROM(
    SELECT P.title AS productName, R.Overall AS rating, R.reviewText AS review, R.time AS time
    FROM Review R JOIN Product P ON R.Asin = P.Asin JOIN Reviewer RE ON R.reviewerID = RE.reviewerID
    WHERE RE.name = '` + inputName + `'
    ORDER BY R.Overall DESC, R.productName) WHERE rownum <= 10
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
    });
};





module.exports = {
  getMostReviewedProductsInCategory: getMostReviewedProductsInCategory,
  getTopProductsInBrand: getTopProductsInBrand,
  getReviewerTime: getReviewerTime,
  getTopReviewsByReviewer: getTopReviewsByReviewer,
  getBrandStats: getBrandStats,
  getMostExpensiveProductsInBrand: getMostExpensiveProductsInBrand,
  getMostExpensiveReviewedProductsInCategory: getMostExpensiveReviewedProductsInCategory,
  getCheapestReviewedProductsInCategory: getCheapestReviewedProductsInCategory,
  getNewestReviews: getNewestReviews,
  getRelated: getRelated,
  getMostReviewedBrands: getMostReviewedBrands,
  getRelations:getRelations,
  getAllCategories: getAllCategories,
  getTopReviewedProductsInCategory: getTopReviewedProductsInCategory,
  getLongestReviews: getLongestReviews,
  getProductInfo: getProductInfo,
  getProductStats: getProductStats,
  getTopReviewers: getTopReviewers,
  getReviewerStats: getReviewerStats
}
