import React from 'react';
import './cell.css';

const Cell = (props) => {
	//click handler to pass the component's row and column back to the parent
	function clickHandler(){
		console.log('child is clicked');
		props.clickCallback(props.row, props.column)
	}
	//change the background color of the inner div
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