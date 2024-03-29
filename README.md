# othello-js
othello-js is a JavaScript Othello library used for move generation, game logic, and state control.

An example implementation of othello-js can be found in the [othello-board-js](https://github.com/schwadan001/othello-board-js) repository, which also contains code for a simple Othello board.


## Getting started
The othello-js library cannot be imported via NPM or included as a CDN repository. Simply fork the project or download the files to get started with othello-js.


## API - othello.js (class Othello)

### Constructor - Othello()
The constructor takes an optional config object that may contain a specification for the field: ```fen```, which indicates the position of the board. If no FEN is passed, the game will be initialized with the default starting position. 

This Othello "FEN" is an adaptation on chess's [Forsyth-Edwards Notation (FEN)](http://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation), which specifies the game's state in a concise manner. In othello-js, this is simplified to the following structure:
  1. 'b' represents a black piece
  1. 'w' represents a white piece
  1. a number _x_ represents _x_ blank spaces
  1. a vertical bar ( | ) represents a new row
  1. the final character following the space denotes the turn

``` javascript
// will start at the new game position: fen = 8|8|8|3bw3|3wb3|8|8|8 b
let othello = new Othello();

// will start mid-game, with white moving next
let othello = new Othello({ 'fen': '8|6b1|4bb2|3bbw2|3www2|8|8|8 w' });
```

### .getMoves()
Returns all possible moves for the player whose turn it is. This will always return at least 1 move unless the game is over, since a player's turn is skipped if there are no valid moves.

```javascript
let othello = new Othello();
othello.getMoves();
/* returns => 
[
  {row: 2, col: 4},
  {row: 3, col: 5},
  {row: 4, col: 2},
  {row: 5, col: 3}
]
*/
```

### .move(position)
Executes a player move and flips over pieces accordingly. It takes a position object as the parameter, which consists of a row and column. The ```move()``` function automatically switches the turn.

```javascript
let othello = new Othello();
othello.fen() // returns => '8|8|8|3bw3|3wb3|8|8|8 b'
othello.move({'row': 2, 'col': 4}); // no return
othello.fen() // returns '8|8|4b3|3bb3|3wb3|8|8|8 w'
```

### .gameOver()
Returns a boolean value of whether or not the game is over. The end of the game occurs when neither player can make any more valid moves.

### .getBoard()
Returns a 2-dimensional list representing the current state of the board.
  * 'e' - empty
  * 'w' - white
  * 'b' - black

```javascript
let othello = new Othello();
othello.getBoard()
/* returns =>
[
  ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
  ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
  ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
  ['e', 'e', 'e', 'b', 'w', 'e', 'e', 'e'],
  ['e', 'e', 'e', 'w', 'b', 'e', 'e', 'e'],
  ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
  ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
  ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e']
]
*/
```

### .fen()
Returns the FEN of the current state of the game.

``` javascript
let othello = new Othello();
othello.fen() // returns => '8|8|8|3bw3|3wb3|8|8|8 b'
```

### .getHistory()
Returns...
- a list of all moves that have occurred during the game
- the player who made each move
- the FEN prior to each move being made

```javascript
let othello = new Othello();
othello.move({'row': 2, 'col': 4});
othello.move({'row': 2, 'col': 5});
othello.getHistory();
/* returns => 
[
  {
    fen: "8|8|8|3bw3|3wb3|8|8|8 b",
    turn: "b",
    move: {row: 2, col: 4}
  }, {
    fen: "8|8|8|3bbb2|3wb3|8|8|8 w",
    turn: "w",
    move: {row: 2, col: 5}
  }
]
*/
```

### .getOppColor(turn)
Returns the opposing player's color ('b' or 'w'), given the optional argument 'b' or 'w'. The turn parameter defaults to the current turn.

```javascript
let othello = new Othello();
othello.getOppColor(); // returns => 'w'
othello.getOppColor('w'); // returns => 'b'
```

### .reset()
Resets the Othello game to its starting position and clears the history

```javascript
let othello = new Othello();
othello.move({'row': 2, 'col': 4});
othello.fen(); // returns => '8|8|4b3|3bb3|3wb3|8|8|8 w'
othello.reset();
othello.fen(); // returns => '8|8|8|3bw3|3wb3|8|8|8 b'
othello.getHistory(); // returns => []
```

### .getScore(color)
Returns the number of pieces a player has on the board. Valid arguments are `'b'` or `'w'`.

```javascript
let othello = new Othello();
othello.getScore('b'); // returns => 2
othello.getScore('w'); // returns => 2
```

### .undo()
Take back the last half-move, returning the latest entry from the game history. Also removes that move from the game history.

```javascript
let othello = new Othello();
othello.move({'row': 2, 'col': 4});
othello.undo();
/*
returns => 
{
  fen: "8|8|8|3bw3|3wb3|8|8|8 b",
  turn: "b",
  move: {row: 2, col: 4}
}
*/
```

### Othello.fenToBoard(fen)
Static method that converts an Othello FEN to a board array.

```javascript
let fen = '8|8|4b3|3bb3|3wb3|8|8|8 w'
Othello.fenToBoard(fen);
/* returns =>
[
  ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
  ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
  ['e', 'e', 'e', 'e', 'b', 'e', 'e', 'e'],
  ['e', 'e', 'e', 'b', 'b', 'e', 'e', 'e'],
  ['e', 'e', 'e', 'w', 'b', 'e', 'e', 'e'],
  ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
  ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
  ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e']
]
*/
```