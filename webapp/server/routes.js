var config = require('./db-config.js');
var mysql = require('mysql');
var oracledb = require('oracledb');

let connection;
async function run() {
  oracledb.outFormat = oracledb.OBJECT;
  connection = await oracledb.getConnection(config);
}
run();

/* ---- (Dashboard) ---- */
//1*
async function getAllCategories(req, res) {
  var query = `
  CREATE INDEX reviewIndex On Review(Overall, vote, reviewdate);
  CREATE INDEX reviewerIndex On Reviewer(name);
  CREATE INDEX productIndex On Product(title, price, brand);
  SELECT *
      FROM (SELECT DISTINCT Category FROM Category
      GROUP BY Category
      ORDER BY COUNT(*) DESC)
      WHERE rownum <=20`;
    try {
      console.log("Successfully connected to Oracle!")
      result = await connection.execute(query);
      res.json(result.rows);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

//2*
async function getCheapestReviewedProductsInCategory(req, res) {
  var inputCategory = req.params.category;
    var query = `
    SELECT * FROM(
      SELECT PR.title, PR.price, R.rating, R.numReviews
FROM (SELECT  R.Asin, AVG(Overall) AS rating, COUNT(*) AS numReviews
FROM Review R JOIN (SELECT Asin
FROM Category
WHERE Category = '` + inputCategory + `') P ON R.Asin = P.Asin
GROUP BY R.Asin) R JOIN Product PR ON R.Asin = PR.Asin
WHERE PR.title IS NOT NULL
ORDER BY PR.price, R.rating DESC, R.numReviews DESC
) WHERE rownum <= 10
  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};

//3*
async function getMostExpensiveReviewedProductsInCategory(req, res) {
  var inputCategory = req.params.category;
    var query = `
    SELECT * FROM(
      SELECT PR.title, PR.price, R.rating, R.numReviews
  FROM (SELECT  R.Asin, AVG(Overall) AS rating, COUNT(*) AS numReviews
  FROM Review R JOIN (SELECT Asin
  FROM Category
  WHERE Category = '${inputCategory}') P ON R.Asin = P.Asin
  GROUP BY R.Asin) R JOIN Product PR ON R.Asin = PR.Asin
  WHERE PR.title IS NOT NULL
  ORDER BY CASE WHEN PR.price IS NULL THEN 1 ELSE 0 END, PR.price DESC, R.rating DESC,
  R.numReviews DESC
  ) WHERE rownum <= 10
  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};


//4*
async function getMostReviewedProductsInCategory(req, res) {
    var inputCategory = req.params.category;
      var query = `
      SELECT * FROM(
        SELECT PR.title, R.rating, R.numReviews
    FROM (SELECT  R.Asin, AVG(Overall) AS rating, COUNT(*) AS numReviews
    FROM Review R JOIN (SELECT Asin
    FROM Category
    WHERE Category = '${inputCategory}') P ON R.Asin = P.Asin
    GROUP BY R.Asin) R JOIN Product PR ON R.Asin = PR.Asin
    WHERE PR.title IS NOT NULL
    ORDER BY R.numReviews DESC, R.rating DESC
    ) WHERE rownum <= 10
    `;

    try {
      console.log("Successfully connected to Oracle!")
      result = await connection.execute(query);
      res.json(result.rows);
      console.log(result.rows);
    } catch (err) {
      console.log("Error: ", err);
    }

  };

//5*
async function getTopReviewedProductsInCategory(req, res) {
  var inputCategory = req.params.category;
    var query = `
    SELECT * FROM(
      SELECT PR.title, R.rating, R.numReviews
  FROM (SELECT  R.Asin, AVG(Overall) AS rating, COUNT(*) AS numReviews
  FROM Review R JOIN (SELECT Asin
  FROM Category
  WHERE Category = '${inputCategory}') P ON R.Asin = P.Asin
  GROUP BY R.Asin) R JOIN Product PR ON R.Asin = PR.Asin
  WHERE PR.title IS NOT NULL
  ORDER BY R.rating DESC, R.numReviews DESC
  ) WHERE rownum <= 10

  `;

  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};

/* ---- (Reviews) ---- */


//6**
async function getNewestReviews(req, res) {
  //var inputNum = req.params.num;
    var query = `
    SELECT * FROM(
      SELECT RE.name, R.reviewdate, R.Overall AS rating, P.title AS productName, R.reviewText AS review,
      RE.Name AS reviewerName
     FROM Review R JOIN Product P ON R.Asin = P.Asin JOIN Reviewer RE ON
     R.reviewerID = RE.reviewerID
    ORDER BY CASE WHEN R.reviewdate IS NULL THEN 1 ELSE 0 END,
    to_date(R.reviewdate, 'mm dd, yyyy') DESC,
    R.Overall DESC) WHERE rownum <= 10

  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};

//7**
async function getTopReviews(req, res) {
  //var inputNum = req.params.num;
    var query = `
    SELECT * FROM(
      SELECT RE.name, R.reviewdate, R.Overall AS rating, P.title AS productName, R.reviewText AS review,
      RE.Name AS reviewerName
     FROM Review R JOIN Product P ON R.Asin = P.Asin JOIN Reviewer RE ON
     R.reviewerID = RE.reviewerID
     WHERE P.title =  '${inputTitle}'
    ORDER BY R.Overall

  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};


/* ---- (Products) ---- */
//8*
async function getProductInfo(req, res) {
  var inputTitle = req.params.title;
  var query = `
  SELECT Description, price, brand
  FROM Product
  WHERE P.title = '${inputTitle}'
  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};

//9* new
async function getNewestProductReviews(req, res) {
  var inputTitle = req.params.title;
    var query = `
    SELECT * FROM(
      SELECT RE.name, R.reviewdate, R.Overall AS rating, P.title AS productName, R.reviewText AS review,
      RE.Name AS reviewerName
     FROM Review R JOIN Product P ON R.Asin = P.Asin JOIN Reviewer RE ON
     R.reviewerID = RE.reviewerID
     WHERE P.title =  '${inputTitle}'
    ORDER BY CASE WHEN R.reviewdate IS NULL THEN 1 ELSE 0 END,
    to_date(R.reviewdate, 'mm dd, yyyy') DESC,
    R.Overall DESC) WHERE rownum <= 10

  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};

//10* new
async function getTopProductReviews(req, res) {
  var inputTitle = req.params.title;
  var query = `
  SELECT * FROM(
    SELECT P.title AS productName, R.Overall AS rating, R.reviewText AS review,
   RE.Name AS reviewerName, R.vote AS votes
   FROM Review R JOIN Product P ON R.Asin = P.Asin JOIN Reviewer RE ON
   R.reviewerID = RE.reviewerID
   WHERE P.title =  '${inputTitle}' ORDER BY R.Overall
) WHERE rownum <= 10
  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};

//11*
async function getProductStats(req, res) {
  var inputTitle = req.params.title;
  var query = `
  SELECT COUNT(*) AS numReviews, AVG(R.Overall) AS rating
  FROM Review R JOIN Product P ON R.Asin = P.Asin
  WHERE P.title = '${inputTitle}'
  GROUP BY R.Asin

  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};


//12*
async function getRelations(req, res) {
    var query = `
    SELECT DISTINCT label FROM related
  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};

//13*
async function getRelated(req, res) {
  var inputTitle = req.params.title;
  var inputLabel = req.params.relation;
    var query = `
    SELECT * FROM(
      SELECT PR.title, PR.Description, PR.price, AVG(RE.Overall) AS aveRatings
    FROM product P JOIN related R ON P.Asin=R.Asin JOIN Product PR
    ON R.asinRelated = PR.Asin LEFT JOIN Review RE ON RE.Asin = PR.Asin
    WHERE P.title = '${inputTitle}' AND R.label = '${inputLabel}'
    GROUP BY PR.title, PR.Description, PR.price
    ORDER BY CASE WHEN AVG(RE.Overall) IS NULL THEN 1 ELSE 0 END,
    AVG(RE.Overall) DESC, CASE WHEN PR.price IS NULL THEN 1 ELSE 0 END,
    PR.price DESC
  ) WHERE rownum <=10
  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};

//existential query
async function getUnreviewedProducts(req, res) {
    var query = `
    SELECT * FROM(
      SELECT PR.title, PR.Description, PR.price
    FROM product PR
    WHERE NOT EXISTS (SELECT * FROM Review R WHERE PR.Asin = R.Asin)
    ORDER BY PR.title) WHERE rownum <=10
  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};


/* ---- (Brands) ---- */
//14*
async function getTopProductsInBrand(req, res) {
  var inputBrand = req.params.brand;
  var query = `
  SELECT * FROM(
    WITH prod AS (SELECT title, Asin, price, description FROM Product
  WHERE brand = '${inputBrand}')
  SELECT P.title, P.Description, P.price, AVG(R.Overall)
    FROM prod P LEFT JOIN Review R ON R.Asin=P.Asin
      GROUP BY P.title, P.Description, P.price
    ORDER BY CASE WHEN AVG(R.Overall) IS NULL THEN 1 ELSE 0 END, AVG(R.Overall) DESC,
    COUNT(*) DESC) WHERE rownum <= 10

  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};

//15*
async function getMostReviewedBrands(req, res) {
  var query = `
  SELECT * FROM(
    WITH prod AS (SELECT brand, Asin FROM Product
WHERE brand IS NOT NULL)
SELECT P.brand, COUNT(*) AS numReviews, AVG(R.Overall) AS aveRating
  FROM prod P JOIN  Review R ON R.Asin= P.Asin
  GROUP BY P.brand
  ORDER BY COUNT(*) DESC, AVG(R.Overall) DESC) WHERE rownum <= 10
  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};


//16*
async function getMostExpensiveProductsInBrand(req, res) {
  var inputBrand = req.params.brand;
  var query = `
  SELECT * FROM(
    WITH prod AS (SELECT title, Asin, price, description FROM Product
  WHERE brand = '${inputBrand}')
  SELECT P.title, P.Description, P.price, AVG(R.Overall)
    FROM prod P LEFT JOIN Review R ON R.Asin=P.Asin
      GROUP BY P.title, P.Description, P.price
  ORDER BY CASE WHEN P.price IS NULL THEN 1 ELSE 0 END, P.price DESC,
  CASE WHEN AVG(R.Overall) IS NULL THEN 1 ELSE 0 END, AVG(R.Overall) DESC,
  COUNT(*) DESC) WHERE rownum <= 10
  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};

//17**
async function getBrandStats(req, res) {
  var inputBrand = req.params.brand;
  var query = `
  SELECT AVG(R.Overall) AS aveRating, AVG(P.price) AS avePrice
  FROM Review R JOIN Product P ON R.Asin = P.Asin
  WHERE P.brand = '${inputBrand}'
  GROUP BY P.brand
  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};

/* ---- (Reviewers) ---- */
//18*
async function getTopReviewers(req, res) {
  var query = `
  SELECT * FROM(
    SELECT RE.Name, COUNT(*) AS numReviews
    FROM Review R JOIN Reviewer RE ON R.reviewerID = RE.reviewerID
    GROUP BY RE.Name
    ORDER BY COUNT(*) DESC
) WHERE rownum <= 5

  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};

//19*
async function getReviewerStats(req, res) {
var inputName = req.params.name;
  var query = `
  SELECT RE.Name, COUNT(*) AS numReviews, AVG(R.Overall) AS avgRating
    FROM Review R JOIN Reviewer RE ON R.reviewerID = RE.reviewerID
    WHERE RE.Name = '${inputName}'
    GROUP BY RE.Name

  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};

//20*
async function getTopReviewsByReviewer(req, res) {
  var inputName = req.params.name;
    var query = `
    SELECT * FROM(
      SELECT P.title AS productName, R.Overall AS rating, R.reviewText AS review, R.vote AS votes
      FROM Review R JOIN Product P ON R.Asin = P.Asin JOIN  (SELECT reviewerID FROM Reviewer
WHERE Name = '${inputName}') RE ON R.reviewerID = RE.reviewerID
      ORDER BY R.Overall DESC, P.title
) WHERE rownum <= 10
  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};

//21*
async function getNewestReviewsByReviewer(req, res) {
  var inputName = req.params.name;
    var query = `
    SELECT * FROM(
      SELECT P.title AS productName, R.Overall AS rating, R.reviewText AS review, R.vote AS votes
      FROM Review R JOIN Product P ON R.Asin = P.Asin JOIN  (SELECT reviewerID FROM Reviewer
WHERE Name = '${inputName}') RE ON R.reviewerID = RE.reviewerID
      ORDER BY CASE WHEN R.reviewdate IS NULL THEN 1 ELSE 0 END,
      to_date(R.reviewdate, 'mm dd, yyyy') DESC, R.Overall DESC, P.title) WHERE rownum <= 10
  `;
  try {
    console.log("Successfully connected to Oracle!")
    result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.log("Error: ", err);
  }
};

module.exports = {
  getMostReviewedProductsInCategory: getMostReviewedProductsInCategory,
  getTopProductsInBrand: getTopProductsInBrand,
  getTopReviews: getTopReviews,
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
  getProductInfo: getProductInfo,
  getProductStats: getProductStats,
  getTopReviewers: getTopReviewers,
  getReviewerStats: getReviewerStats,
  getNewestProductReviews: getNewestProductReviews,
  getTopProductReviews: getTopProductReviews,
  getNewestReviewsByReviewer: getNewestReviewsByReviewer,
  getUnreviewedProducts: getUnreviewedProducts
}
