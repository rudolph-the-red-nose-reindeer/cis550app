const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

/* ---- (Dashboard) ---- */
app.get('/categories', routes.getAllCategories);
app.get('/categories/:category', routes.getTopProductsInCategory);

/* ---- (Reviews) ---- */
//app.get('/reviews', routes.getLongestReviews);

/* ---- (Products) ---- */
//app.get('/products', routes.getProductInfo);
//app.get('/products', routes.getProductStats);

/* ---- (Reviewers) ---- */
//app.get('/reviewers', routes.getTopReviewers);
//app.get('/reviewers/:reviewer', routes.getReviewerStats);


app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});
