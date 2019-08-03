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
    [2,4,7]
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
}


function turn(squareId, player){
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}


function turnClick(square){
    turn(square.target.id, huPlayer)
}

function startGame(){
    document.querySelector('.endgame').style.display = 'none';
    origBoard = Array.from(Array(9).keys);
    for(let i=0;i<cells.length;i++){
        cells[i].innerText ='';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click',turnClick,false);
    }
}

startGame();