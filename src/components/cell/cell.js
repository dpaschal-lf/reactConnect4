import React from 'react';
import './cell.css';

const Cell = (props) => {
	function clickHandler(){
		console.log('child is clicked');
		props.clickCallback(props.row, props.column)
	}
	const newStyle = {
		backgroundColor : props.color
	}
	return (
		<div className="cell" onClick={ clickHandler }>
			<div className="circle" style={ newStyle }>{`${props.row},${props.column}`}</div>
		</div>
	)
}

export default Cell;