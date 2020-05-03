import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BrandStatsRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="brandstats-input">
				<div className="aveRating">{this.props.aveRating}</div>
				<div className="avePrice">{this.props.avePrice}</div>
			</div>
		);
	}
}
