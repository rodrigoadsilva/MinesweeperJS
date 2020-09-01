function containsObject(obj, list) {
    for (let x = 0; x < list.length; x++) {
        if (list[x].row == obj.row && list[x].column == obj.column) {
            return true;
        }
    }
    return false;
}

function randomNumbers(quantity, numberInitial, numberEnding) {
    let numberList = [];
    while (numberList.length < quantity) {
        let col = Math.floor(Math.random() * numberEnding) + numberInitial;
        let row = Math.floor(Math.random() * numberEnding) + numberInitial;
        if (numberList.indexOf(col) < 0 && col <= numberEnding) {
            let bomb = { "column": col, "row": row };
            if (!containsObject(bomb, numberList))
                numberList.push(bomb);
        }
    }
    return numberList;
}

function initField(columns, rows, field) {
    for (let c = 0; c < columns; c++) {
        field[c] = [];
        for (let r = 0; r < rows; r++) {
            field[c].push({
                'column': c,
                'row': r,
                'celContent': 0,
                'status': 'hide'
            });
        }
    }
    return field;
}

function fillFieldWithBombs(columns, rows, field) {
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows; r++) {
            let b = { "column": c, "row": r };
            if (containsObject(b,
                    listBombs)) {
                field[c][r].celContent = "bomb";
            }
        }
    }
    return field;
}

function fillFieldWithNumbers(listBombs, internalField) {
    for (let b = 0; b < listBombs.length; b++) {
        let bombColumn = listBombs[b].column;
        let bombRow = listBombs[b].row;
        for (let col = -1; col <= 1; col++) {
            for (let row = -1; row <= 1; row++) {
                if ((bombColumn + col) >= 0 && (bombRow + row) >= 0) {
                    if (internalField[bombColumn + col][bombRow + row].celContent != 'bomb') {
                        internalField[bombColumn + col][bombRow + row].celContent += 1;
                    }
                }
            }
        }
    }
    return internalField;
}

function makerField(columns, rows, bombs) {
    let field = [];
    listBombs = randomNumbers(bombs, 0, columns - 1);
    console.log("Lista de Bombas: ", listBombs);
    field = initField(columns, rows, field);
    field = fillFieldWithBombs(columns, rows, field);
    field = fillFieldWithNumbers(listBombs, field);

    let fieldToReturn = {
        "field": field,
        "columns": columns,
        "rows": rows,
        "bombsQuantity": bombs
    };
    return fieldToReturn;
}

/// REGRAS
/// Se for uma celula em branco: revela a si mesmo e chama a mesma funcao para celulas adjacentes
/// Se for uma celula com valor numerico: Revela a si mesma e para ai.
/// Se for uma bomba: revela a si mesma e para ai e trigar gameover
function revealCel(column, row) {
    if (column >= fieldComplete.columns || column < 0) { return; }
    if (row >= fieldComplete.rows || row < 0) { return; }

    //console.log(`Revelar o ${column}-${row}`);
    let obj = fieldComplete.field[column][row];

    if (obj.celContent == "flag") { return; }
    if (obj.status != "hide") { return; }

    if (obj.celContent == 0) {
        obj.status = "reveal";
        //revela lados
        revealCel(column - 1, row);
        revealCel(column + 1, row);
        //revela cima e baixo
        revealCel(column, row - 1);
        revealCel(column, row + 1);
        //revela diagonais da esquerda
        revealCel(column - 1, row - 1);
        revealCel(column - 1, row + 1);
        //revela diagonais da direita
        revealCel(column + 1, row + 1);
        revealCel(column + 1, row - 1);
    } else if (obj.celContent != 'bomb') {
        obj.status = "reveal";
    }

    updateFieldDisplay(column, row);
    return;
}

function flagCel(column, row) {
    Swal.fire(`teste ${column}, ${row}`);
    let element = fieldComplete.field[column][row];
    if (element.status == "reveal") { return false; }
    element.celContent = "flag";
    return false;
}

function gameOver(sizeFolder) {
    listBombs.forEach((item, index) => {
        let el = document.querySelector(`#field-${item.column}-${item.row}`);
        setTimeout(() => {
            el.innerHTML = `<img src="assets/${sizeFolder}/bomb.gif"></td>`;
            document.querySelector("#explosion-audio").cloneNode(true).play();
            setTimeout(() => {
                el.innerHTML = `<img src="assets/${sizeFolder}/tile_bomb.png"></td>`;
            }, 400);

        }, 100 * (index + 1));
    });
    setTimeout(() => { Swal.fire('You die, MOTHERFUCKER') }, 150 * (listBombs.length));
}

function fieldDisplay(fieldObj) {
    if (window.innerWidth >= 400) {
        var sizeFolder = '61x61';
    } else {
        var sizeFolder = '31x31';
    }
    let tableField = '<table>';
    for (let r = 0; r < fieldObj.columns; r++) {
        tableField = tableField + '<tr>';
        for (let c = 0; c < fieldObj.rows; c++) {
            tableField = tableField + `<td id="field-${c}-${r}" onclick="revealCel(${c},${r})" oncontextmenu="flagCel(${c},${r})"><img src="assets/${sizeFolder}/tile_hide.png"></td>`;
        }
        tableField = tableField + '</tr>';
    }
    tableField = tableField + '</table>';
    document.getElementById("minefield").innerHTML = tableField;
}

function updateFieldDisplay(column, row) {
    let el = document.querySelector(`#field-${column}-${row}`);
    let obj = fieldComplete.field[column][row];
    if (window.innerWidth >= 400) {
        var sizeFolder = '61x61';
    } else {
        var sizeFolder = '31x31';
    }
    if (obj.celContent == 'bomb') {
        el.innerHTML = `<img src="assets/${sizeFolder}/bomb.gif"></td>`;
        setTimeout(() => { el.innerHTML = `<img src="assets/${sizeFolder}/tile_bomb.png"></td>`; }, 400);
        document.querySelector("#explosion-audio").play();
        gameOver(sizeFolder);
    } else if (obj.celContent == 0) {
        el.innerHTML = `<img src="assets/${sizeFolder}/tile_empty.png"></td>`;
    } else if (obj.celContent == 'flag') {
        el.innerHTML = `<img src="assets/${sizeFolder}/tile_flag.png"></td>`;
    } else {
        el.innerHTML = `<img src="assets/${sizeFolder}/tile_${obj.celContent}.png"></td>`;
    }
}

var listBombs;