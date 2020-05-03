import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Dashboard from './Dashboard';
import Reviews from './Reviews';
import Products from './Products';
import Reviewers from './Reviewers';
 /*import ProductsStats from './ProductsStats'
 import TopProductsBrand from './TopProductsBrand';
 import MostReviewedBrands from './MostReviewedBrands'
 import MostExpensiveProductinBrand from './MostExpensiveProductinBrand'
 import BrandStats from './BrandStats'
 import RelatedProducts from './RelatedProducts'
 import TopReviewers from './TopReviewers'
 import TopReviewsByReviewer from './TopReviewsByReviewer' */

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => (
								<Dashboard />
							)}
						/>
						<Route
							exact
							path="/dashboard"
							render={() => (
								<Dashboard />
							)}
						/>

						<Route
							exact
							path="/reviews"
							render={() => (
								<Reviews />
							)}
						/>
						<Route
							path="/reviewers"
							render={() => (
								<Reviewers />
							)}
						/>
						<Route
							path="/products"
							render={() => (
								<Products />
							)}
						/>

					</Switch>
				</Router>
			</div>
		);
	}
}


/*	<Route
		exact
		path="/topproductsbrand"
		render={() => (
			<TopProductsBrand />
		)}
	/>

	<Route
		exact
		path="/mostreviewedbrands"
		render={() => (
			<MostReviewedBrands />
		)}
	/>


	<Route
		exact
		path="/mostexpensiveproductinbrand"
		render={() => (
			<MostExpensiveProductinBrand />
		)}
	/>
	<Route
		exact
		path="/brandstats"
		render={() => (
			<BrandStats />
		)}
	/>
	<Route
		exact
		path="/relatedproducts"
		render={() => (
			<RelatedProducts />
		)}
	/>
	<Route
		exact
		path="/topreviewers"
		render={() => (
			<TopReviewers />
		)}
	/>
	<Route
		exact
		path="/topreviewsbyreviewer"
		render={() => (
			<TopReviewsByReviewer />
		)}
	/> */
	/*	<Route
			exact
			path="/productstats"
			render={() => (
				<ProductsStats />
			)}
		/> */
