var field = [];
var tableField;

function randomBombs(range, numberBombs) {
    for (var i = 0; i < numberBombs; i++) {
        bombaSorteada = Math.round(Math.random() * numberCels);

    }
}

function makerField(columms, rows, bombs) {
    tableField = '<table style="width:30%">';

    var celNumber = 1;
    for (var c = 0; c < columms; c++) {
        field[c] = [];
        tableField = tableField + "<tr>";
        for (var r = 0; r < rows; r++) {
            field[c].push({
                "coluna": c,
                "linha": r,
                "celNumber": celNumber
            });
            tableField = tableField + "<td>" + c + "/" + r + "<br>" + celNumber + "</td>";
            celNumber++;
        }
        tableField = tableField + "</tr>";
    }
    tableField = tableField + "</table>";

    document.getElementById("minefield").innerHTML = tableField;
}