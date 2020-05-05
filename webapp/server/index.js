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
app.get('/reviews', routes.getTopreviews);
app.get('/reviews', routes.getNewestReviews);

/* ---- (Products) ---- */
app.get('/products', routes.getUnreviewedProducts);//NEW MUST INCLUDE UNVERSAL QUANTIFIER QUERY
app.get('/products', routes.getTopProductReviews); //NEW
app.get('/products/:product', routes.getProductInfo);
app.get('/Product%20stats/:product', routes.getProductStats);
app.get('/products', routes.getNewestProductReviews); //NEW
app.get('/Get%20product%20labels', routes.getRelations);
app.get('/Get%20related%20products/:title/:relation', routes.getRelated);

/* ---- (Brands) ---- */
app.get('/Top%20products%20in%20a%20brand/:brand', routes.getTopProductsInBrand);
app.get('/Most%20reviewed%20brands/', routes.getMostReviewedBrands);
app.get('/Most%20expensive%20products%20per%20brand/:brand', routes.getMostExpensiveProductsInBrand);
app.get('/Average%20rating%20and%20price%20in%20a%20brand/:brand', routes.getBrandStats);


/* ---- (Reviewers) ---- */
app.get('/Get%20top%20reviewers', routes.getTopReviewers);
app.get('/reviewers/:reviewer', routes.getReviewerStats);
app.get('/reviewers/:reviewer', routes.getNewestReviewsByReviewer); //NEW
app.get('/Top%20products%20a%20reviewer%20has%20reviewed/:reviewer', routes.getTopReviewsByReviewer);

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});
