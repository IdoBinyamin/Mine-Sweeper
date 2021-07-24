function getClassName(location) {
  var cellClass = 'cell-' + location.i + '-' + location.j;
  return cellClass;
}

function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setLevel(elBtn) {
  if (gSelectedLvlName == elBtn.value) return;
  gSelectedLvlName = elBtn.value;

  switch (elBtn.value) {
    case 'Easy':
      gSelectedLvl = EASY;
      clearInterval(gIntervalId);
      break;
    case 'Hard':
      gSelectedLvl = HARD;
      clearInterval(gIntervalId);
      break;
    case 'Ultimate':
      gSelectedLvl = ULTIMATE;
      clearInterval(gIntervalId);
      break;
  }

  init();
}

function getEmptyCells() {
  var emptyCells = [];
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      if (!gBoard[i][j].isMine) {
        emptyCells.push({ i: i, j: j });
      }
    }
  }
  return emptyCells;
}

function getEmptyCell() {
  var emptyCells = getEmptyCells();
  // console.log(emptyCells);
  var idx = getRandomIntInclusive(0, emptyCells.length - 1);
  var emptyCell = emptyCells[idx];
  return emptyCell;
}

function addMine(cellI, cellJ) {
  for (var i = 0; i < gSelectedLvl.mines; i++) {
    var cellForMine = getEmptyCell();
    while (cellForMine.i === cellI && cellForMine.j === cellJ) {
      cellForMine = getEmptyCell();
    }
    // console.log(cellForMine);
    gBoard[cellForMine.i][cellForMine.j].isMine = true;
  }
}

function timerHendler() {
  var minutesLabel = document.getElementById('minutes');
  var secondsLabel = document.getElementById('seconds');
  var totalSeconds = 0;
  gIntervalId = setInterval(setTime, 1000);

  function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
  }

  function pad(val) {
    var valString = val + '';
    if (valString.length < 2) {
      return '0' + valString;
    } else {
      return valString;
    }
  }
}

