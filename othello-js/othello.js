class Othello {

    dim = 8;
    history = [];

    colorMap = {
        'b': 'Black',
        'w': 'White'
    }

    startingPos = [
        ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
        ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
        ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
        ['e', 'e', 'e', 'b', 'w', 'e', 'e', 'e'],
        ['e', 'e', 'e', 'w', 'b', 'e', 'e', 'e'],
        ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
        ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
        ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e']
    ];

    constructor(config = {}) {
        this.board = (config.fen != undefined ? this.fenToBoard(config.fen) : this.startingPos);
        this.turn = (['b', 'w'].includes(config.turn) ? config.turn : 'b');
    }

    getMoves(turn = this.turn) {
        var moves = [];
        for (var row = 0; row < this.dim; row++) {
            for (var col = 0; col < this.dim; col++) {
                let square = this.board[row][col];
                if (square == 'e') {
                    let idxDeltas = [-1, 0, 1];
                    idxDeltas.forEach(rowDelta => {
                        idxDeltas.forEach(colDelta => {
                            var newR = row + rowDelta;
                            var newC = col + colDelta;
                            if (newR >= 0 && newR < this.dim && newC >= 0 && newC < this.dim && !(rowDelta == 0 && colDelta == 0)) {
                                if (this.isValidMove(turn, row, col, rowDelta, colDelta)) {
                                    let obj = { 'row': row, 'col': col };
                                    if (!moves.includes(obj)) {
                                        moves.push(obj);
                                    }
                                }
                            }
                        });
                    });
                }
            }
        }
        return moves;
    }

    isValidMove(turn, row, col, rowDelta, colDelta) {
        var newR = row + rowDelta;
        var newC = col + colDelta;
        var keepChecking = true;
        var oppCount = 0;
        while (newR >= 0 && newR < this.dim && newC >= 0 && newC < this.dim && keepChecking) {
            if (this.board[newR][newC] == this.getOppColor(turn)) {
                oppCount++;
            } else if (this.board[newR][newC] == turn && oppCount > 0) {
                keepChecking = false;
                return true;
            } else {
                keepChecking = false;
            }
            newR = newR + rowDelta;
            newC = newC + colDelta;
        }
        return false;
    }

    deepCopy(itm) {
        if (Array.isArray(itm)) {
            var newArr = [];
            itm.forEach(subItm => newArr.push(this.deepCopy(subItm)));
            return newArr;
        } else {
            return itm;
        }
    }

    move(obj) {
        let row = obj.row;
        let col = obj.col;
        this.setSquare(row, col, this.turn);
        let idxDeltas = [-1, 0, 1];
        idxDeltas.forEach(rowDelta => {
            idxDeltas.forEach(colDelta => {
                var newR = row + rowDelta;
                var newC = col + colDelta;
                var keepFlipping = true;
                var flipList = [];
                while (newR >= 0 && newR < this.dim && newC >= 0 && newC < this.dim && keepFlipping) {
                    let square = this.board[newR][newC];
                    if (square == this.getOppColor()) {
                        flipList.push({ 'row': newR, 'col': newC });
                    } else {
                        keepFlipping = false;
                        if (square == this.turn) {
                            flipList.forEach(sq => this.setSquare(sq.row, sq.col, this.turn));
                        }
                    }
                    newR = newR + rowDelta;
                    newC = newC + colDelta;
                }
            });
        });
        this.history.push({ "row": row, "col": col, "color": this.turn });
        this.switchTurn();
        if (this.getMoves().length == 0) {
            this.switchTurn();
        }
    }

    setSquare(row, col, val) {
        this.board[row][col] = val;
    }

    switchTurn() {
        this.turn = (this.turn == 'b') ? 'w' : 'b';
    }

    getOppColor(turn = this.turn) {
        return (turn == 'b') ? 'w' : 'b';
    }

    gameOver() {
        return this.getMoves().length == 0 && this.getMoves(this.getOppColor()).length == 0;
    }

    getBoard() {
        return this.fenToBoard(this.fen());
    }

    getHistory() {
        return this.deepCopy(this.history);
    }

    fen() {
        var f = ""
        for (var row = 0; row < this.dim; row++) {
            var blankCount = 0;
            for (var col = 0; col < this.dim; col++) {
                let sq = this.board[row][col]
                switch (sq) {
                    case 'e':
                        blankCount++;
                        break;
                    default:
                        if (blankCount > 0) {
                            f += blankCount.toString();
                            blankCount = 0;
                        }
                        f += sq;
                }
            }
            if (blankCount > 0) {
                f += blankCount.toString();
            }
            if (row != this.dim - 1) {
                f += "|";
            }
        }
        return f;
    }

    fenToBoard(fen) {
        var b = [[]];
        var row = 0;
        for (var i = 0; i < fen.length; i++) {
            let c = fen.charAt(i);
            switch (c) {
                case 'b':
                case 'w':
                    b[row].push(c);
                    break;
                case '|':
                    b.push([]);
                    row++;
                    break;
                default:
                    for (var j = 0; j < parseInt(c); j++) {
                        b[row].push('e');
                    }
            }
        }
        return b;
    }
}
