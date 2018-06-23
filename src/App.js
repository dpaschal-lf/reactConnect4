import React, { Component } from 'react';
import Cell from './components/cell/cell.js'
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.makeBoardArray = this.makeBoardArrayInitial;
    this.playerColors = ['red','yellow']
    const boardArray = this.makeBoardArray(props.size);
    this.state = {
    	size: props.size,
    	board: boardArray,
    	currentPlayer: 0,
    	modalMessage: ''
    }

    console.log(boardArray);
    this.handleChildClick = this.handleChildClick.bind(this);
  }
  makeBoardArrayInitial(size){
  	const newBoardArray = [];
  	for(let row=0; row < size; row++){
  		newBoardArray.push([]);
  		for(let col=0; col < size; col++){
  			newBoardArray[row][col] = '';
  		}
  	}
  	this.makeBoardArray = this.makeBoardArraySubsequent;
  	return newBoardArray;
  }
  makeBoardArraySubsequent(){
  	const newBoardArray = [];
  	for(let row=0; row < this.state.board.length; row++){
  		newBoardArray.push([]);
  		for(let col=0; col < this.state.board[0].length; col++){
  			newBoardArray[row][col] = this.state.board[row][col];
  		}
  	}

  	return newBoardArray;
  }
  findUnoccupiedRow(col){
  	for(var rowI=0; rowI<this.state.board[col].length; rowI++){
  		if( this.state.board[rowI][col]!== ''){
  			return rowI-1;
  		}
  	}
  	return this.state.board[col].length-1;
  }


  makeBoard(){
  	const cellContainer = [];
  	for(let row=0, count=0; row < this.state.board.length; row++){
  		for(let col=0; col < this.state.board[0].length; col++, count++){
  			cellContainer.push( <Cell color={this.state.board[row][col]} clickCallback = {this.handleChildClick} index={count} key={count} row={row} column={col} />);
  		}
  	}

  	return cellContainer;
  }
  handleChildClick(row, col){
  	debugger;
  	const newBoard = this.makeBoardArray();
  	const openRow = this.findUnoccupiedRow(col);
  	newBoard[openRow][col] = this.playerColors[ this.state.currentPlayer];
  	this.checkForWin(openRow, col);
  	this.setState( {
  		board: newBoard,
  		currentPlayer: 1- this.state.currentPlayer
  	})
  }

  checkForWin(row, col){
  	const vectors = [
  		[{x:-1, y:0},{x:1, y:0}],
  		[{x:0, y:-1},{x:0, y:1}],
  		[{x:-1, y:-1},{x:1, y:1}],
  		[{x:1, y:-1},{x:-1, y:1}]
  	]
  	const currentColor = this.playerColors[this.state.currentPlayer];
  	for(var vectorI=0; vectorI<vectors.length; vectorI++){
  		const count0 = this.checkForWinInDirection({x:col,y:row}, vectors[vectorI][0],currentColor)
  		const count1 = this.checkForWinInDirection({x:col,y:row}, vectors[vectorI][1],currentColor)
  		if(count0+count1+1 === 4){
  			this.setState({
  				modalMessage: 'you won '+ currentColor
  			})
  		}
  	}
  	
  }
  checkForWinInDirection( start, vector, color){
  	const nextLocation = { x: start.x + vector.x, y: start.y+vector.y};
  	if( this.getValueAtLocation(nextLocation.y,nextLocation.x) === color){
  		return 1 + this.checkForWinInDirection( nextLocation, vector, color);
  	} else {
  		return 0;
  	}
  }
  getValueAtLocation(row, col){
  	if(this.state.board[row]!==undefined){
  		if(this.state.board[row][col]!==undefined){
  			return this.state.board[row][col];
  		}
  	}
  	return false;
  }
  render() {

    return (
      <div className="App connect4">
      	{ this.makeBoard() }
      	<div className='modalShadow' style={ {display: this.state.modalMessage ? 'block' : 'none'}}>
      		<div className='modalBody'>
      			{this.state.modalMessage}
      		</div>
      	</div>
      </div>
    );
  }
}

export default App;










