# othello-js
othello-js is a JavaScript Othello library used for move generation, game logic, and display. All game logic and state are handled by ```othello.js.Othello```, while board display and gameflow are handled by ```othello-board.js.OthelloBoard``` and ```othello.css```

An example implementation of othello-js can be found in the [othello-ui](https://github.com/schwadan001/othello-ui) repository


## Getting started
The othello-js library cannot be imported via NPM or included as a CDN repository. Simply fork the project or download the files to get started with othello-js.

The following code will play a random game of Othello:

``` html
<html>
<head>
    <link rel='stylesheet' href='othello-js/othello.css'>
    <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css'>
</head>
<body>
    <div id='info'></div>
    <table id='board'></table>
</body>
<script src='https://code.jquery.com/jquery-1.12.4.min.js'></script>
<script src='othello-js/othello.js'></script>
<script src='othello-js/othello-board.js'></script>
<script>
    let othello = new Othello();
    let board = new OthelloBoard(othello, {
        'displayMoves': 'none',
        'onBlackMove': executeAiMove,
        'onWhiteMove': executeAiMove,
    });
    function executeAiMove() {
        setTimeout(function () {
            let moves = othello.getMoves();
            let move = moves[Math.floor(Math.random() * moves.length)];
            board.move(move);
        }, 3000);
    }
</script>
</html>
```


## API - othello.js (class Othello)

### Constructor - Othello()
The constructor takes an optional config object that may contain a specification for the field: ```fen```, which indicates the position of the board. If no fen is passed, the game will be initialized with the default starting position. 

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
Returns a list of all moves that have occurred during the game, along with the player who made them.

```javascript
let othello = new Othello();
othello.move({'row': 2, 'col': 4});
othello.move({'row': 2, 'col': 5});
othello.getHistory();
/* returns => 
[
  {'row': 2, 'col': 4, 'color': 'b'},
  {'row': 2, 'col': 5, 'color': 'w'}
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
othello.fen(); // returns '8|8|4b3|3bb3|3wb3|8|8|8 w'
othello.reset();
othello.fen(); // returns => '8|8|8|3bw3|3wb3|8|8|8 b'
othello.getHistory(); // returns => []
```

## API - othello-board.js (class OthelloBoard)

OthelloBoard requires jQuery for DOM manipulation. To use OthelloBoard, add the following to your html document:
```html
<script src='https://code.jquery.com/jquery-1.12.4.min.js'></script>
```

### Constructor - OthelloBoard()
The constructor takes 2 parameters:
  1. **othello** : Othello object - _(required)_
  1. **config** : json object - _(optional)_ - takes the following parameters, which are all optional:
      * **boardId** : string => id of the board object in the HTML document. Do not prefix with ```#```.
        * default = ```'board'```
      * **infoId** : string => id of an info/notification div in the HTML document. Do not prefix with ```#```.
        * default = ```'info'```
      * **boardVar** : string => variable name of the OthelloBoard object in your code. Used to tie your board object to button actions in the UI.
        * default = ```'board'```
      * **displayMoves** : string => determines which players will be able to see clickable move options displayed on the board. This should be selected for player moves and turned off for AI moves.
        * options : ```'both', 'none', 'b', 'w'```
        * default = ```'both'```
      * **onBlackMove** : string => function to execute when it's black's turn.
        * default = ```function () { }```
      * **onWhiteMove** : string => function to execute when it's black's turn.
        * default = ```function () { }```

``` javascript
// default board settings are player vs player
let othello = new Othello();
let board = new OthelloBoard(othello);

// example where HTML ids don't match the default values
let othello1 = new Othello();
let board1 = new OthelloBoard(othello1, config = {
  'boardId': 'myOthelloBoardId',
  'infoId': 'notificationDivId',
  'boardVar': 'board1'
});

// example where white is controlled by random AI
let othello2 = new Othello();
let board2 = new OthelloBoard(othello2, config = {
  'displayMoves': 'b', // only display possible moves for the human player (black)
  'onWhiteMove': executeAiMove,
  'boardVar': 'board2'
});
function executeAiMove() {
    setTimeout(function () {
        let moves = othello2.getMoves();
        let move = moves[Math.floor(Math.random() * moves.length)];
        board2.move(move);
    }, 3000);
}
```

### .move(position)
Executes move, updating the Othello object and the display. Also kicks off then next automated move, if applicable.

```javascript
// player vs player example
let othello = new Othello();
let board = new OthelloBoard(othello);
othello.fen() // returns => '8|8|8|3bw3|3wb3|8|8|8 b'
board.move({'row': 2, 'col': 4}); // move executed; display updated; turn switched to white
othello.fen() // returns '8|8|4b3|3bb3|3wb3|8|8|8 w'

// player vs AI example
let othello = new Othello();
let board = new OthelloBoard(othello2, config = {
  'displayMoves': 'b',
  'onWhiteMove': executeAiMove
});
function executeAiMove() {
    setTimeout(function () {
        let moves = othello2.getMoves();
        let move = moves[Math.floor(Math.random() * moves.length)];
        board2.move(move);
    }, 3000);
}
board.move({'row': 2, 'col': 4}); // move executed; display updated; turn switched to white
// executeAiMove() is called for white
// after AI move, turn switches back to black and waits for user input
```

### .updateDisplay()
Forces the update of the display (board and score), and highlights changes to the board since the display was last updated. There isn't a strong use case for calling this method since .move() calls .updateDisplay() automatically.
  * The piece that was placed is highlighted in purple.
  * Pieces that are flipped as a result of that placement are highlighted in pink.

### .reset()
Calls the ```.reset()``` method on the ```Othello``` object and updates the display. 

```javascript
// correct way to reset the board and game state
let othello = new Othello();
let board = new OthelloBoard(othello);
board.move({'row': 2, 'col': 4});
board.reset();

// NOT EQUIVALENT - this will highlight all the 'changes' that occur when the board is reset
let othello = new Othello();
let board = new OthelloBoard(othello);
board.move({'row': 2, 'col': 4});
othello.reset()
board.updateDisplay()
```