/*
 * @author Stepan Tanasiychuk <ceo@stfalcon.com>
 */

var game;

function init() {
    // настройки
    var cellSize = 40;
    var collsCount = 15;
    var rowsCount = 10;

    var canvas = document.getElementById("canvas");
    canvas.width  = cellSize*collsCount;
    canvas.height = cellSize*rowsCount;

    var context = canvas.getContext("2d");
    context.fillStyle = "#666";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // инициализация игры
    game = new Game(context, collsCount, rowsCount, cellSize);
    game.reset();

    var clicksCount = 0;

    // обработчик кликов
    canvas.onclick = function(e) {
        clicksCount++;

        var x = (e.pageX - canvas.offsetLeft) / cellSize | 0;
        var y = (e.pageY - canvas.offsetTop)  / cellSize | 0;
        game.click(x, y);
    };
}

// возвращает случайное целое число из заданого диапазона
function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// игра
function Game(context, collsCount, rowsCount, cellSize) {
    // ячейки
    var data = new Array();
    var maxX = collsCount - 1;
    var maxY = rowsCount - 1;

    // уровень сложности. влияет на колличество цветов
    var level = 1;

    // массив цветов
    var colors = ['white', 'orange', '#32CD32', '#87CEFA', 'yellow', 'silver'];

    function flipData() {
        var flipData = new Array();

        for (var x = 0; x <= maxX; x++) {
            flipData[x] = new Array();
            for (var y = 0; y <= maxY; y++) {
                flipData[x][y] = data[x][maxY-y];
            }
        }

        data = flipData;
        rebuildData();
    }

    // флипнуть матрицу и перерисовать поле
    this.flip = function() {
        flipData();
        draw();
    }

    // проверяет цвет ячейки и цвета соседних ячеек
    function clickOnCell(x, y, color, neighboringCells) {
        if(checkCellColor(x, y, color)) {
            data[x][y] = null;

            // соседние ячейки
            for (var i = 0; i < neighboringCells.length; i++) {
                newX = neighboringCells[i][0];
                newY = neighboringCells[i][1];
                // поиск координат соседних ячеек для соседней ячейки
                newNeighboringCells = searchNeighboringCellsByColor(newX, newY, color);
                // клик на соседнюю ячейку
                clickOnCell(newX, newY, color, newNeighboringCells);
            }
            return true;
        }
    }

    // проверяет существование ячейки
    function issetCell(x, y) {
        return (data[x] && data[x][y]);
    }

    function isCellColor(x, y) {
        return (issetCell(x,y) && data[x][y]);
    }

    // проверяет или цвет ячейки соответсвует заданому
    function checkCellColor(x, y, color) {
        return (issetCell(x, y) && data[x][y] == color);
    }

    // проверяет или столбик пустой
    function isEmptyColl(x) {
        var flag = true;
        // проверяем или в столбике есть цветные ячейки
        for (var y = 0; y <= maxY; y++) {
            flag = isCellColor(x,y) ? false : flag;
        }

        return flag;
    }

    // ищет и перемещает пустые столбики
    function findAndMoveEmptyColls() {
        for (var n = 0; n <= maxX; n++) {
            for (var x = maxX-1; x >= 0; x--) {
                // если цветных нету, тогда смещаем столбик до упора вправо
                if (isEmptyColl(x)) {
                    buffer = data[x+1];
                    data[x+1] = data[x];
                    data[x] = buffer;
                }
            }
        }
    }

    // пересобрать массив данных и вытолкнуть наверх ячейки без цвета
    function rebuildData() {
        for (var x = 0; x <= maxX; x++) {
            // сортировка пузырьком
            for (var n = 0; n < maxY; n++) {
                for (var y = maxY; y > 0; y--) {
                    if (data[x][y] == null) {
                        // выталкиваем наверх ячейку без цвета
                        data[x][y] = data[x][y-1];
                        data[x][y-1] = null;
                    }
                }
            }
        }
        // смещает пустые столбики
        findAndMoveEmptyColls();
    }

    // установка начальных значений
    function setup() {
        // количество цветов зависит от уровня
        var colorsCount = (colorsCount > colors.length) ? colors.length : (level + 2);
        for (var x = 0; x < collsCount; x++) {
            data[x] = new Array(rowsCount);
            for (var y = 0; y < rowsCount; y++) {
                data[x][y] = colors[getRandomInt(0, colorsCount - 1)];
            }
        }
    }

    // отрисовка игрового поля
    function draw() {
        for (var x = 0; x < collsCount; x++) {
            for (var y = 0; y < rowsCount; y++) {
                context.fillStyle = issetCell(x, y) ? data[x][y] : "black";
                context.fillRect(x*cellSize, y*cellSize, cellSize-1, cellSize-1);
            }
        }
    }

    // поиск соседских клеток с заданым цветом
    function searchNeighboringCellsByColor(x, y, color) {
        // по дефолту результат пустой
        var result = new Array();
        // матрица координат соседних ячеек
        var matrix = [[1,0], [-1,0], [0,1], [0,-1]];
        for(i = 0; i < matrix.length; i++) {
            var newX = x+matrix[i][0];
            var newY = y+matrix[i][1];
            if (checkCellColor(newX, newY, color)) {
                result.push([newX, newY]);
            }
        }

        return result;
    }

    // клик на ячейке
    this.click = function(x, y) {
        // цвет кликнутой ячейки
        var color = data[x][y];
        // соседние ячейки с таким цветом
        var neighboringCells = searchNeighboringCellsByColor(x, y, color);
        // клик защитывается только если по соседству есть ячейки с таким цветом
        if (color && neighboringCells.length) {
            clickOnCell(x, y, color, neighboringCells);
            // переместить пустые клетки вверх, пустые столбцы вправо
            rebuildData();
        }
        draw();
        checkResult();
    }

    // проверка поражения или победы
    function checkResult() {
        if (data[0][maxY] == null) {
            alert('YOU WON!!! Level #' + level);
            level++;
            game.reset();
        } else {
            if (checkLost()) {
                alert('YOU LOST.. Level #' + level);
                game.reset();
            }
        }
    }

    // проверяет на проигрыш
    function checkLost() {
        // для реальных данных
        if (checkIssetVariants()) {
            return false;
        }
        // для флипнутых данных
        var buffer = data;
        flipData();
        if (checkIssetVariants()) {
            alert('Try flip');
            data = buffer;
            return false;
        }
        data = buffer;
        return true;
    }

    // проверяет или есть ещё варианты ходов
    function checkIssetVariants() {
        // проверяем или ещё есть варианты ходов
        for (var x = 0; x <= maxX; x++) {
            for (var y = 0; y <= maxY; y++) {
                var color = data[x][y];
                var neighboringCells = searchNeighboringCellsByColor(x, y, color);
                if (color && neighboringCells.length) {
                    // есть ещё варианты ходов
                    return true;
                }
            }
        }

        // вариантов ходов нету
        return false;
    }

    // рестарт игры
    this.reset = function() {
        setup();
        draw();
    }
}