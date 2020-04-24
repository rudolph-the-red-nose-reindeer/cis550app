var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


/* ---- Q1a (Dashboard) ---- */
function getAllGenres(req, res) {
  var query = `
    SELECT DISTINCT genre
    FROM Genres;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getAllCategories(req, res) {
  var query = `
  SELECT DISTINCT Category
  FROM Category;  
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


/* ---- Q1b (Dashboard) ---- */
function getTopInGenre(req, res) {
  var inputLogin = req.params.genre;

    // TODO: (3) - Edit query below
    var query = `
      SELECT M.title, M.rating, M.vote_count
      FROM Movies M JOIN Genres G ON M.id=G.movie_id
      WHERE G.genre='${inputLogin}'
      ORDER BY M.rating DESC, M.vote_count DESC
      LIMIT 10;`;
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        console.log(rows);
        res.json(rows);
      }
    });
};

function getTopInCategory(req, res) {
  var inputCategory = req.params.genre;

    var query = `
    WITH products AS (SELECT Asin
      FROM Category
      WHERE Category = '${inputCategory}'),
      ratings AS (SELECT  Asin, AVE(Overall) AS rating
      FROM Review
      GROUP BY Asin)
      SELECT P.title, R.rating, count(R.rating) AS num_rating
      FROM products P JOIN ratings R ON P.Asin=R.Asin
      ORDER BY R.rating DESC, P.title 
      LIMIT 10;`;
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        console.log(rows);
        res.json(rows);
      }
    });
};

/* ---- Q2 (Recommendations) ---- */
function getRecs(req, res) {
  var inputLogin = req.params.rec;

    var query = `
    SELECT M.title, M.id, M.rating, M.vote_count
    FROM (SELECT movie_id, count(*)
        FROM Genres X JOIN (select genre
                    FROM Genres G JOIN Movies M ON G.movie_id=M.id
                    WHERE M.title='${inputLogin}') Y
        ON X.genre=Y.genre
        GROUP BY movie_id
        HAVING COUNT(*)=(SELECT COUNT(*)
                        FROM Genres G JOIN Movies M ON G.movie_id=M.id
                        WHERE M.title='${inputLogin}')) G
    JOIN Movies M ON G.movie_id=M.id
    WHERE M.title <> '${inputLogin}'
    GROUP BY M.rating DESC, M.vote_count DESC
    LIMIT 5;`;
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        console.log(rows);
        res.json(rows);
      }
    });
};

/* ---- (Best Genres) ---- */
function getDecades(req, res) {
	var query = `
    SELECT DISTINCT (FLOOR(year/10)*10) AS decade
    FROM (
      SELECT DISTINCT release_year as year
      FROM Movies
      ORDER BY release_year
    ) y
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

/* ---- Q3 (Best Genres) ---- */
function bestGenresPerDecade(req, res) {
  var inputLogin = req.params.decade;

    // TODO: (3) - Edit query below
    var query = `
    SELECT T.genre, AVG(COALESCE(M.rating, 0)) AS avg_rating
    FROM (SELECT DISTINCT genre FROM Genres) T LEFT JOIN
    (SELECT M.title, G.genre, M.rating
    FROM Movies M JOIN Genres G ON M.id=G.movie_id
    WHERE (FLOOR(release_year/10)*10) = ${inputLogin}) M
    ON T.genre=M.genre
    GROUP BY T.genre
    ORDER BY AVG(COALESCE(M.rating, 0)) DESC, T.genre;`;
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        console.log(rows);
        res.json(rows);
      }
    });
};

// The exported functions, which can be accessed in index.js.
module.exports = {
	getAllGenres: getAllGenres,
  getTopInGenre: getTopInGenre,
  getAllCategories: getAllCategories,
  getTopInCategory: getTopInCategory,
	getRecs: getRecs,
	getDecades: getDecades,
  bestGenresPerDecade: bestGenresPerDecade
}
