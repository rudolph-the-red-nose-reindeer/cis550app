import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class TopProductsBrandRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="topinbrand-input">
				<div className="title">{this.props.title}</div>
				<div className="description">{this.props.description}</div>
				<div className="price">{this.props.price}</div>
				<div className="averageRating">{this.props.averageRating}</div>
			</div>
		);
	}
}
