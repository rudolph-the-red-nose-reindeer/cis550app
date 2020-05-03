import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class RelatedProductsRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="relatedproducts-input">
				<div className="title">{this.props.title}</div>
				<div className="Description">{this.props.Description}</div>
				<div className="price">{this.props.price}</div>
				<div className="aveRating">{this.props.aveRating}</div>
			</div>
		);
	}
}
