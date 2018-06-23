import React, { Component } from 'react';
import Cell from './components/cell/cell.js'
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    //point our makeBoardArray function at the initial version that creates an empty multi-dimensional array
    this.makeBoardArray = this.makeBoardArrayInitial;
    //we attach our array of possible player colors to our object directly because we don't need to track it in state
    this.playerColors = ['red','yellow'];
    //initiate our board array from our array creator
    const boardArray = this.makeBoardArray(props.size);
    //initiate our state of our app with the size of the board (passed in from props, the array of board color states, who the current player is, and what the modal message is)
    this.state = {
    	size: props.size,
    	board: boardArray,
    	currentPlayer: 0,
    	modalMessage: ''
    }
    //bind our click handler that we pass into all the cells, so it remembers our main app component
    this.handleChildClick = this.handleChildClick.bind(this);
  }
  makeBoardArrayInitial(size){
  	//make an array of empty elements in a size x size multi-dimensional array.  I don't like repeating so much code, though, as the next function
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
  	//make a copy of the multi-dimensional array for our board state
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
  	//go to a particular column and progress down the array until we find one that isn't empty
  	for(var rowI=0; rowI<this.state.board[col].length; rowI++){
  		//once we find one that isn't empty, go back one and return that value
  		if( this.state.board[rowI][col]!== ''){
  			return rowI-1;
  		}
  	}
  	//if we got here, we went through an entire column without finding a marker.  so the entire column is empty, and we give the last row instead
  	return this.state.board[col].length-1;
  }


  makeBoard(){
  	//create all the components that will make up our game board.
  	const cellContainer = [];
  	for(let row=0, count=0; row < this.state.board.length; row++){
  		for(let col=0; col < this.state.board[0].length; col++, count++){
  			//make our cells with the color it needs to be, the callback in the app to call when the cell is clicked, the index so we know which one was clicked (for debugging purposes), the row and column of each cell for update purposes
  			cellContainer.push( <Cell color={this.state.board[row][col]} clickCallback = {this.handleChildClick} index={count} key={count} row={row} column={col} />);
  		}
  	}

  	return cellContainer;
  }
  handleChildClick(row, col){
  	//this function is the callback for each cell when it is clicked.  it is passed in the row and column of the cell that was clicked
  	const newBoard = this.makeBoardArray();
  	//get the currently open cell.  
  	const openRow = this.findUnoccupiedRow(col);
  	if(openRow<0){
  		//column is full, skip
  		return;
  	}
  	//mark the cell with the current player's color
  	newBoard[openRow][col] = this.playerColors[ this.state.currentPlayer];
  	//see if the newest marked cell causes a win
  	this.checkForWin(openRow, col);
  	//update the state with the new board state, as well as the current player
  	this.setState( {
  		board: newBoard,
  		currentPlayer: 1- this.state.currentPlayer
  	})
  }

  checkForWin(row, col){
  	//this is a list of vectors to determine the delta of each check.  ie how far we go in what direction to check
  	const vectors = [
  		[{x:-1, y:0},{x:1, y:0}],
  		[{x:0, y:-1},{x:0, y:1}],
  		[{x:-1, y:-1},{x:1, y:1}],
  		[{x:1, y:-1},{x:-1, y:1}]
  	]
  	//get the color of the current player.  somewhat redundant, maybe optimize so it isn't in two places
  	const currentColor = this.playerColors[this.state.currentPlayer];
  	//go through each array of vectors, one at a time
  	for(var vectorI=0; vectorI<vectors.length; vectorI++){
  		//take the first vector and pass it into the check function.  for example, the left check.  store the resulting count of matching cells
  		const count0 = this.checkForWinInDirection({x:col,y:row}, vectors[vectorI][0],currentColor)
  		//take the second vector and pass it into the check function, for example the right check.  store the resulting count of matching cells
  		const count1 = this.checkForWinInDirection({x:col,y:row}, vectors[vectorI][1],currentColor)
  		//check if the total count is equal to our match.  this number should be stored in state and taken from props.  right now it checks to see if 1 direction, for example left, and the other, for example right, + 1 (the currently clicked cell) count up to 4 or greater
  		if(count0+count1+1 >= 4){
  			this.setState({
  				modalMessage: 'you won, '+ currentColor
  			})
  		}
  	}
  	
  }
  checkForWinInDirection( start, vector, color){
  	//check the next cell location based on our current location (start), and adding our vector
  	const nextLocation = { x: start.x + vector.x, y: start.y+vector.y};
  	//check if the next location is the same color as what we are looking for
  	if( this.getValueAtLocation(nextLocation.y,nextLocation.x) === color){
  		//if it is, call the function again, but starting from the next spot and going in the same direction
  		//add the result of that function call (and any subsequent recursive calls) to 1, for the match we just found
  		return 1 + this.checkForWinInDirection( nextLocation, vector, color);
  	} else {
  		//if it doesn't match, return 0, because this is being added to other things no matter what
  		return 0;
  	}
  }
  getValueAtLocation(row, col){
  	//this helps cut down on code so we don't keep a huge if in the middle of other code
  	//it checks if the outer most array exists, to prevent going out of bounds up and down
  	if(this.state.board[row]!==undefined){
  		//then it checks if the inner one exists, to prevent going out of bounds left to right
  		if(this.state.board[row][col]!==undefined){
  			return this.state.board[row][col];
  		}
  	}
  	//if we got all the way through, then it went out of bounds in some way, return false which will never match a color
  	return false;
  }
  render() {
  	//display the game board, and show the modal if the modalMessage in the state is a truthy value (like not '')
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










