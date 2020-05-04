import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ProductStatsRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="productstats-input">
				<div className="">{this.props.title}</div>
				<div className="numReviews">{this.props.numReviews}</div>
				<div className="rating">{this.props.rating}</div>
			</div>
		);
	}
}
