'use strict';
const WIN = '<img src="img/rum.jpeg">';
const LOST = '<img src="img/lost.jpeg">';
const NORMAL = '<img src="img/start.jpeg">';
const FLEG = '<span>🏴‍☠️</span>';
const MINE = '<span>💣</span>';
const LIVE = '❤';
const EASY = {
  mines: 2,
  size: 4,
  strikes: 2,
};
const HARD = {
  mines: 12,
  size: 8,
  strikes: 3,
};
const ULTIMATE = {
  mines: 30,
  size: 12,
  strikes: 3,
};
var gSelectedLvlName = 'Easy';
var gSelectedLvl = EASY;
var gBoard;
var gElTimer = document.querySelector('.timer');
var gIntervalId;
var gIsFirstClick;
var gRestart = document.querySelector('button');
var gStrikes = document.querySelector('.strikes');
var gCountStrikes;
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
};

function init() {
  gBoard = createBoard(gSelectedLvl.size);
  // console.log('model ' , gBoard)
  renderBoard();
  gGame.isOn = true;
  gIsFirstClick = true;
  clearInterval(gIntervalId);
  gRestart.innerHTML = NORMAL;
  gCountStrikes = gSelectedLvl.strikes;
  renderStrike();
}

function createBoard(lvl = EASY.size) {
  var board = [];
  for (var i = 0; i < lvl; i++) {
    board.push([]);
    for (var j = 0; j < lvl; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
    }
  }
  return board;
}

function renderBoard() {
  // console.table(board);
  var strHTML = '';
  for (var i = 0; i < gBoard.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < gBoard[0].length; j++) {
      var shown = gBoard[i][j].isShown ? 'revealed' : 'unrevealed';
      var className = getClassName({ i: i, j: j });
      strHTML += `<td data-i="${i}" data-j="${j}"
              class="${className} ${shown}"
              oncontextmenu=" getRightClick(event , ${i} , ${j})"
              onclick="cellClicked(this , ${i} , ${j})">`;
      if (gBoard[i][j].isShown && !gBoard[i][j].isMine) {
        strHTML += `<span>${
          gBoard[i][j].minesAroundCount === 0
            ? ''
            : gBoard[i][j].minesAroundCount
        }</span>`;
      } else if (gBoard[i][j].isShown && gBoard[i][j].isMine) {
        strHTML += MINE;
      }
      if (gBoard[i][j].isMarked) strHTML += FLEG;
      strHTML += '</td>';
    }
    strHTML += '</tr>';
  }
  // console.log('strHTML', strHTML)
  var elBoard = document.querySelector('.board');
  elBoard.innerHTML = strHTML;
}

function getMinesNegsCount(cellI, cellJ) {
  var mineCount = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue;
      if (gBoard[i][j].isMine) mineCount++;
    }
  }
  return mineCount;
}

function showAllNegs(cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue;
      if (getMinesNegsCount(cellI, cellJ) === 0) {
        if (gBoard[i][j].isMarked) {
          gBoard[i][j].isShown = false;
        } else {
          gBoard[i][j].isShown = true;
        }
      }
    }
  }
}

function cellClicked(elCell, cellI, cellJ) {
  if (gIsFirstClick === true) {
    timerHendler();
    gIsFirstClick = false;
    addMine(cellI, cellJ);
  }
  if (gBoard[cellI][cellJ].isMarked) return;
  if (!gGame.isOn) return;
  if (gBoard[cellI][cellJ].isShown && gBoard[cellI][cellJ].isMine) return ;
  showAllNegs(cellI, cellJ);
  var counter = 0;
  var cellCounterNoMines = gSelectedLvl.size * gSelectedLvl.size - gSelectedLvl.mines;
  gBoard[cellI][cellJ].isShown = true;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      gBoard[i][j].minesAroundCount = getMinesNegsCount(i, j);
      if (gBoard[i][j].isShown && !gBoard[i][j].isMine) counter++;
      console.log('counter: ', counter)
    }
  }
  if (counter === cellCounterNoMines)
  victory();
  if (gBoard[cellI][cellJ].isMine) {
    gCountStrikes--;
    renderStrike();
    if (gCountStrikes === 0) {
      gameOver();
    }
  }
  renderBoard();
}

function gameOver() {
  clearInterval(gIntervalId);
  gGame.isOn = false;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
        gBoard[i][j].isShown = true;
      }
    }
  }
  gRestart.innerHTML = LOST;
  renderBoard();
}

function getRightClick(event, cellI, cellJ) {
  event.preventDefault();
  if (!gGame.isOn) return;
  if (gBoard[cellI][cellJ].isShown) return;
  gBoard[cellI][cellJ].isMarked = !gBoard[cellI][cellJ].isMarked;
  renderBoard();
}

function victory() {
  clearInterval(gIntervalId);
  gGame.isOn = false;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine && !gBoard[i][j].isShown) {
        gBoard[i][j].isMarked = true;
      }
    }
  }
  gRestart.innerHTML = WIN;
  renderBoard();
}

function renderStrike() {
  gStrikes.innerHTML = '';
  for (var i = 0; i < gCountStrikes; i++) {
    gStrikes.innerHTML += LIVE;
  }
}
