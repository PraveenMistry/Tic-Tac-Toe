let origBoard;
const huPlayer = '0';
const aiPlayer = 'X';
const winCombinations =[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

const cells = document.querySelectorAll('.cell');

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => 
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombinations.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) { //check inner array of winCombinations
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombinations[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}


function turn(squareId, player){
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}


function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares(){
    return origBoard.filter(s => typeof s == 'number');
}

function checkTie(){
    if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function turnClick(square){
    if (typeof origBoard[square.target.id] == 'number') { // check if slot filled with player or number
        turn(square.target.id, huPlayer)
        let gameWon = checkWin(origBoard, huPlayer)
		if (!checkTie() && !gameWon) turn(bestSpot(), aiPlayer);
	}
}

function startGame(){
    document.querySelector('.endgame').style.display = 'none';
    origBoard = Array.from(Array(9).keys()); // create a number array [0,1,2,3,4,5,6,7,8]
    for(let i=0;i<cells.length;i++){
        cells[i].innerText ='';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click',turnClick,false);
    }
}

// algorithm to get bestSpot for next move
function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}


startGame();
