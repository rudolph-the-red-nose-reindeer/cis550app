import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class RecommendationsRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="movieResults"> //change (ERROR?)
				<div className="asin">{this.props.asin}</div>
				<div className="title">{this.props.title}</div>
				<div className="description">{this.props.description}</div>
				<div className="price">{this.props.price}</div>
				<div className="brand">{this.props.brand}</div>
			</div>
		);
	}
}
