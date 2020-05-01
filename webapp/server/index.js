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
app.get('/categories/:category', routes.getTopReviewedProductsInCategory);
app.get('/categories/:category', routes.getCheapestReviewedProductsInCategory);
app.get('/categories/:category', routes.getMostExpensiveReviewedProductsInCategory);
app.get('/categories/:category', routes.getMostReviewedProductsInCategory);


/* ---- (Reviews) ---- */
app.get('/reviews', routes.getLongestreviews);
app.get('/reviews', routes.getNewestReviews);

/* ---- (Products) ---- */
app.get('/products', routes.getProductInfo);
app.get('/products', routes.getProductStats);
app.get('/products', routes.getTopProductsInBrand);
app.get('/products', routes.getMostReviewedBrands);
app.get('/products', routes.getMostExpensiveProductsInBrand);
app.get('/products', routes.getBrandStats);
app.get('/products', routes.getRelations);
app.get('/products', routes.getRelated);

/* ---- (Reviewers) ---- */
app.get('/reviewers', routes.getTopReviewers);
app.get('/reviewers/:reviewer', routes.getReviewerStats);
app.get('/reviewers/:reviewer', routes.getReviewerTime);
app.get('/reviewers/:reviewer', routes.getTopReviewsByReviewer);

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});
