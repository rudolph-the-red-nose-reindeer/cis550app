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

/*import from './' */

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
