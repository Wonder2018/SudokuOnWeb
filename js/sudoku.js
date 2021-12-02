let cells = Array.from(document.querySelectorAll("td.sudoku-col"));
let rows = Array.from(document.querySelectorAll("tr.sudoku-row"));
let activeCell;
let createMode = false;
let puzzle = "000000000000000000000000000000000000000000000000000000000000000000000000000000000";

document.onkeydown = function (event) {
    if (!activeCell) {
        return true;
    }
    switch (event.key) {
        case "ArrowUp":
        case "w":
            return changeUp();
        case "ArrowDown":
        case "s":
            return changeDown();
        case "ArrowLeft":
        case "a":
            return changeLeft();
        case "ArrowRight":
        case "d":
            return changeRight();
        case "Enter":
            return changeNextLine();
        default:
            break;
    }
    if (!activeCell.classList.contains("ans") && !createMode) {
        return true;
    }
    if (event.key == 0 || isNaN(event.key * 1)) {
        setNum(activeCell, "");
        return true;
    }
    setNum(activeCell, event.key);
};

function changeUp() {
    let ind = cells.indexOf(activeCell);
    ind = (ind + 72) % 81;
    msactive(cells[ind]);
}
function changeDown() {
    let ind = cells.indexOf(activeCell);
    ind = (ind + 9) % 81;
    msactive(cells[ind]);
}
function changeLeft() {
    let ind = cells.indexOf(activeCell);
    ind = (ind + 80) % 81;
    msactive(cells[ind]);
}
function changeRight() {
    let ind = cells.indexOf(activeCell);
    ind = (ind + 1) % 81;
    msactive(cells[ind]);
}
function changeNextLine() {
    let ind = cells.indexOf(activeCell);
    ind = ind / 9;
    if (ind % 1 == 0) {
        ind += 1;
    } else {
        ind = Math.ceil(ind);
    }
    ind = (ind % 9) * 9;
    msactive(cells[ind]);
}

function msout() {
    rows.forEach((e) => {
        e.classList.remove("row-hover");
    });
    cells.forEach((e) => {
        e.classList.remove("col-hover");
        e.classList.remove("cell-hover");
    });
}

/**
 *
 *
 * @param {Element} obj
 * @param {Number} col
 */
function msover(obj, col) {
    msout();
    obj.parentElement.classList.add("row-hover");
    for (let ind = 0; ind < 9; ind++) {
        cells[ind * 9 + col].classList.add("col-hover");
    }
    let gridRow = Math.floor(cells.indexOf(obj) / 27);
    let gridCol = Math.floor(col / 3);
    let curcell = gridRow * 27 + gridCol * 3;
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            cells[curcell + y].classList.add("cell-hover");
        }
        curcell += 9;
    }
}
/**
 *
 *
 * @param {Element} obj
 */
function msactive(obj) {
    activeCell && activeCell.classList.remove("cell-active");
    obj.classList.add("cell-active");
    activeCell = obj;
}

function mscancel() {
    activeCell && activeCell.classList.remove("cell-active");
    activeCell = undefined;
    window.event.returnValue = false;
    return false;
}

function readValue() {
    let rst = "";
    cells.forEach((cell) => {
        if ("" == cell.innerHTML) {
            rst += 0;
        } else {
            rst += cell.innerHTML;
        }
    });
    return rst;
}

function printpuzzle(value) {
    let ind = 0;
    createMode = true;
    cells.forEach((cell) => {
        setNum(cell, value.charAt(ind));
        ind++;
    });
    puzzle = value;
    createMode = false;
}

function printAns(ans) {
    let ind = 0;
    cells.forEach((cell) => {
        if (puzzle.charAt(ind) == 0) {
            setNum(cell, ans.charAt(ind));
        }
        ind++;
    });
}

function clr() {
    cells.forEach((cell) => {
        if (createMode) {
            cell.classList.remove("ans");
            cell.classList.remove("puzzle-number");
            cell.innerHTML = "";
        } else if (cell.classList.contains("ans")) {
            cell.innerHTML = "";
        }
    });
}

function create(btn) {
    if (createMode) {
        btn.innerHTML = "出题模式";
        puzzle = readValue();
        cells.forEach((cell) => {
            if (cell.innerHTML == "") {
                cell.classList.add("ans");
            }
        });
    } else {
        btn.innerHTML = "保存题目";
    }
    createMode = !createMode;
}

function autoWork() {
    let ans = new Sudoku(puzzle);
    ans.execute();
    let ansStr = "";
    for (const line of ans.matrix) {
        for (const grid of line) {
            ansStr += grid;
        }
    }
    printAns(ansStr);
}

/**
 *
 *
 * @param {Element} cell
 * @param {Number} num
 */
function setNum(cell, num) {
    if (cell && (num == "" || num == 0)) {
        deleteNum(cell);
    } else if (cell) {
        inputNum(cell, num);
    }
}

/**
 *
 *
 * @param {Element} cell
 * @param {Number} num
 */
function inputNum(cell, num) {
    if (createMode) {
        cell.classList.remove("ans");
        cell.classList.add("puzzle-number");
        cell.innerHTML = num;
    } else {
        ind = cells.indexOf(cell);
        if (puzzle.charAt(ind) == 0) {
            cell.classList.add("ans");
            cell.innerHTML = num;
        }
    }
}

/**
 *
 *
 * @param {Element} cell
 * @param {Number} num
 */
function deleteNum(cell) {
    if (createMode) {
        cell.classList.remove("ans");
        cell.classList.remove("puzzle-number");
        cell.innerHTML = "";
    } else {
        ind = cells.indexOf(cell);
        if (puzzle.charAt(ind) == 0) {
            cell.classList.remove("puzzle-number");
            cell.innerHTML = "";
        }
    }
}
