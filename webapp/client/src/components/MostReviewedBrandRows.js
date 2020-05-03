import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class MostReviewedBrandRows extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="product-input">
				<div className="brand">{this.props.brand}</div>
				<div className="number_of_reviews">{this.props.number_of_reviews}</div>
				<div className="average_rating">{this.props.average_rating}</div>
			</div>
		);
	}
}
