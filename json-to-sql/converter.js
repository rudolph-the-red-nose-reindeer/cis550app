const jsonfile = require('jsonfile');
const fs = require('fs');

/**
 * ===========================
 * Command line interface
 * ===========================
 */

// Extract command line arguments
const input = process.argv.splice(2);
const [jsonFilename, sqlFilename] = input;
parseIfNotExist();
/**
 * ===========================
 * Implementation
 * ===========================
 */

function parseIfNotExist() {
  fs.open(sqlFilename, 'r', function (fileNotExist, _) {
    if (fileNotExist) {
      converter(input);
    } else {
      console.log("output file already exists!");
    }
  })
}

function converter(input) {

  // exit if json or sql files are not specified
  if (!jsonFilename || !sqlFilename) return 'Error';

  const tables = [];
  var columns = [];
  var columnTypes = [];
  var columnInfo = [];
  var values = [];
  const valueInserts = [];
  const createTables = [];

  // use jsonfile module to read json file
  jsonfile.readFile(jsonFilename, (err, data) => {
    if (err) return console.error(err);

    const source = data;
    fetchReviewerData(source);
    fetchReviewData(source);
    const inserts = toSql(valueInserts);
    writeOutput(inserts)
  });

  function fetchReviewerData(source) {
    for (var i in source) {
      let temp = source[i];
      //console.log("this is example obj: " + JSON.stringify(temp));
      const query = `INSERT INTO Reviewer (reviewerID, reviewerName) VALUES ("${temp["reviewerID"]}", "${temp["reviewerName"]}")`;
      valueInserts.push(query);
    }
  }

  function fetchReviewData(source) {
    for (var i in source) {
      let temp = source[i];
      //console.log("this is example obj: " + JSON.stringify(temp));
      let reviewText = `${temp["reviewText"]}`;
      let newReviewText = cleanReviewText(reviewText);
      let vote = temp["vote"] ? `"${temp["vote"]}"` : null;
      const query = `INSERT INTO Review (reviewerID, asin, vote, reviewText, overall, summary, time, date) 
      VALUES ("${temp["reviewerID"]}", ${temp["asin"]}, ${vote}, "${newReviewText}", ${temp["overall"]}, "${temp["summary"]}", ${temp["unixReviewTime"]}, "${temp["reviewTime"]}")`;
      valueInserts.push(query);
    }
  }

  function cleanReviewText(reviewText) {
    let newReviewText1 = reviewText.slice(0, 255);
    let rt = newReviewText1.replace(/"/g, "'");
    return rt;
  }

  function toSql(queries) {
    return queries.join(`;\n`) + ';';
  }

  function writeOutput(combinedSql) {
    fs.writeFile(sqlFilename, combinedSql, (err2) => {
      if (err2) return console.error(err2);
      console.log('Done');
    });
  }
}