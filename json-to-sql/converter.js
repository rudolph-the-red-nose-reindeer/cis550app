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

  const valueInserts = [];

  // use jsonfile module to read json file
  jsonfile.readFile(jsonFilename, (err, data) => {
    if (err) return console.error("We have an error" + err);

    const source = data;
    //fetchReviewerData(source);
    //fetchReviewData(source);
    //fetchProductData(source);
    // fetchCategoriesData(source);
    fetchRelatedData(source)
    const inserts = toSql(valueInserts);
    //const inserts = toCsv(valueInserts);
    writeOutput(inserts)
  });

  function fetchProductData(source) {
    var t = 0;
    for (var i in source) {
      t++;
      let temp = source[i];
      if (temp["reviewerID"]) break;
      var asin = `'${temp["asin"]}'`;
      var title = temp["title"] ? `${cleanText(temp["title"])}` : null;
      var tempDescription = temp["description"] ? fetchDescription(temp["description"]) : null;
      var description = tempDescription ? `${cleanText(tempDescription)}` : null;
      var price = temp["price"] ? cleanPriceText(temp["price"]) : null;
      var brand = temp["brand"] ? `${cleanText(temp["brand"])}` : null;
      if (t === 5000) {
        valueInserts.push(`COMMIT`)
        t = 0;
      }
      const query = `INSERT INTO Product (asin, title, description, price, brand) 
      VALUES (${asin}, ${title}, ${description}, ${price}, ${brand})`;
      valueInserts.push(query);
    }
  }



  function fetchRelatedData(source) {
    var t = 0;
    for (var i in source) {
      t++;
      if (t === 5000) {
        valueInserts.push(`COMMIT`)
        t = 0;
      }
      let temp = source[i];
      if (temp["reviewerID"]) break;
      var asin = `'${temp["asin"]}'`;

      if (temp["also_bought"]) alsoBoughtData(temp["also_bought"], asin)
      if (temp["also_buy"]) alsoBoughtData(temp["also_buy"], asin)
      if (temp["also_viewed"]) alsoViewedData(temp["also_viewed"], asin)
      if (temp["also_view"]) alsoViewedData(temp["also_view"], asin)
      if (temp["bought_together"]) boughtTogetherData(temp["bought_together"], asin)
      if (temp["buy_after_viewing"]) buyAfterViewingData(temp["buy_after_viewing"], asin)
    }
  }

  function alsoBoughtData(arr, asin) {
    for (var product in arr) {
      var bought_asin = `'${arr[product]}'`
      const query = `INSERT INTO Related (asin, asinRelated, label) 
          VALUES (${asin}, ${bought_asin}, 'also bought')`;
      valueInserts.push(query);
    }
  }

  function alsoViewedData(arr, asin) {
    for (var product in arr) {
      var bought_asin = `'${arr[product]}'`
      const query = `INSERT INTO Related (asin, asinRelated, label) 
          VALUES (${asin}, ${bought_asin}, 'also viewed')`;
      valueInserts.push(query);
    }
  }

  function boughtTogetherData(arr, asin) {
    for (var product in arr) {
      var bought_asin = `'${arr[product]}'`
      const query = `INSERT INTO Related (asin, asinRelated, label) 
          VALUES (${asin}, ${bought_asin}, 'bought together')`;
      valueInserts.push(query);
    }
  }

  function buyAfterViewingData(arr, asin) {
    for (var product in arr) {
      var bought_asin = `'${arr[product]}'`
      const query = `INSERT INTO Related (asin, asinRelated, label) 
          VALUES (${asin}, ${bought_asin}, 'buy after viewing')`;
      valueInserts.push(query);
    }
  }

  function fetchDescription(descriptionArray) {
    return descriptionArray[0];
  }

  function fetchReviewerData(source) {
    for (var i in source) {
      let temp = source[i];
      if (!temp["reviewerID"]) break;
      //console.log("this is example obj: " + JSON.stringify(temp));
      const query = `INSERT INTO Reviewer (reviewerID, name) VALUES ('${temp["reviewerID"]}', '${temp["reviewerName"]}')`;
      valueInserts.push(query);
    }
  }

  function fetchReviewData(source) {
    var t = 0;
    for (var i in source) {
      t++;
      if (t === 5000) {
        valueInserts.push(`COMMIT`)
        t = 0;
      }
      let temp = source[i];
      //console.log("this is example obj: " + JSON.stringify(temp));
      if (!temp["reviewerID"]) break;
      let reviewText = temp["reviewText"];
      let asin = temp["asin"] ? temp["asin"] : null;
      let overall = temp["overall"] ? temp["overall"] : null;
      let summary = temp["summary"] ? cleanText(temp["summary"]) : null;
      let newReviewText = reviewText ? cleanText(reviewText) : null;
      let vote = temp["vote"] ? `'${temp["vote"]}'` : null;
      const query = `INSERT INTO Review (reviewerID, asin, vote, reviewText, overall, summary, time, reviewDate) 
      VALUES ('${temp["reviewerID"]}', '${asin}', ${vote}, ${newReviewText}, ${overall}, ${summary}, ${temp["unixReviewTime"]}, '${temp["reviewTime"]}')`;
      valueInserts.push(query);
    }
  }

  function fetchCategoriesData(source) {
    // const header = `CATEGORY, ASIN`;
    //valueInserts.push(header);
    var t = 0;
    for (var i in source) {
      t++;
      if (t === 5000) {
        valueInserts.push(`COMMIT`)
        t = 0;
      }
      let temp = source[i];
      if (temp["reviewerID"]) break;
      var asin = `'${temp["asin"]}'`
      if (temp["categories"]) {
        for (var cat in temp["categories"]) {
          var arr = temp["categories"]
          var txt = arr[cat]
          const query = `INSERT INTO Category (category, asin) VALUES ('${txt}', ${asin})`;
          // const query = `'${txt}', ${asin}`;
          valueInserts.push(query);
        }
      }

      else if (temp["category"]) {
        for (var cat in temp["category"]) {
          var arr = temp["category"]
          var txt = arr[cat]
          const query = `INSERT INTO Category (category, asin) VALUES ('${txt}', ${asin})`;
          //const query = `'${txt}', ${asin}`;
          valueInserts.push(query);
        }
      }

      else if (temp["main_cat"]) {
        const query = `INSERT INTO Category (category, asin) VALUES ('${temp["main_cat"]}', ${asin})`;
        //const query = `'${temp["main_cat"]}', ${asin}`;
        valueInserts.push(query);
      }
    }
  }

  function cleanText(text) {
    let newReviewText1 = text.slice(0, 255);
    //console.log(newReviewText1);
    let temp = JSON.stringify(newReviewText1);
    let tempt = temp.replace(/'/g, "''");
    //console.log(tempt);
    let one = replaceAt(0, tempt, "'");
    let two = replaceAt((one.length - 1), one, "'");;
    return two;
  }

  function cleanCatText(text) {
    let newReviewText1 = text;
    //console.log(newReviewText1);
    let temp = JSON.stringify(newReviewText1);
    let tempt = temp.replace(/'/g, "''");
    //console.log(tempt);
    let one = replaceAt(0, tempt, "'");
    let two = replaceAt((one.length - 1), one, "'");;
    return two;
  }

  function cleanPriceText(price) {
    let newPrice = price.slice(1)
    return newPrice;
  }

  function replaceAt(index, str, chr) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
  }

  function toSql(queries) {
    return queries.join(`;\n`) + ';';
  }

  function toCsv(queries) {
    return queries.join(`\n`);
  }

  function writeOutput(combinedSql) {
    fs.writeFile(sqlFilename, combinedSql, (err2) => {
      if (err2) return console.error(err2);
      console.log('Done');
    });
  }
}