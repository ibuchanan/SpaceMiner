(function() {

var TicTacToe = (function() {
  const X = 'X';
  const O = 'O';
  const E = ' ';

  function getMove(board, row, col) {
    return board[row][col]
  }

  function player(game, player) {
    return {
      move: function(row, col) {
        game.move(game.board, row, col, player);
      }
    }
  }

  var Path = (function() {
    const game = Symbol('game');
    return class {
      constructor(_game, moves, name) {
        this.moves = moves;
        this[game] = _game;
        this.name = name;
      }
      get isWinner() { return this[game].detectWin(this.moves); }
      get winner() { return this.isWinner ? this.moves[0] : E; }
    };
  }());

  function getRow(game, rowNumber, name) {
    return new Path(game, game.board[rowNumber], name);
  }

  function getCol(game, colNumber, name) {
    return new Path(game, [getMove(game.board, 0,colNumber), getMove(game.board, 1, colNumber), getMove(game.board, 2, colNumber)], name);
  }

  function getDiag(game, startY, startX, slope, name) {
    return new Path(game, [
      getMove(game.board, startY, startX),
      getMove(game.board, startY + slope.y, startX + slope.x),
      getMove(game.board, startY + slope.y * 2, startX + slope.x * 2)
    ], name);
  }

  return class {
    constructor(id) {
      this._id = id;
      this.board = [
        [E, E, E],
        [E, E, E],
        [E, E, E]
      ];
      this.turn = X;
    }
    // Default implementations of game logic
    move(board, row, col, player) {
      board[row][col] = player;
    }

    detectWin(moves) {
      return moves[0] != E && moves[0] === moves[1] && moves[1] === moves[2];
    }

    get hasWinner() {
      return this.row0.isWinner || this.row1.isWinner || this.row2.isWinner
        || this.col0.isWinner || this.col1.isWinner || this.col2.isWinner
        || this.diagLeft.isWinner || this.diagRight.isWinner;
    }

    player(playerLetter) { return player(this, playerLetter); }

    get playerX() { return player(this, X); }
    get playerO() { return player(this, O); }

    get row0() { return getRow(this, 0, 'row0'); }
    get row1() { return getRow(this, 1, 'row1'); }
    get row2() { return getRow(this, 2, 'row2'); }

    get col0() { return getCol(this, 0, 'col0'); }
    get col1() { return getCol(this, 1, 'col1'); }
    get col2() { return getCol(this, 2, 'col2'); }

    get diagLeft() { return getDiag(this, 0, 0, {x:1, y:1}, 'diagLeft'); }
    get diagRight() { return getDiag(this, 0, 2, {x:-1, y:1}, 'diagRight'); }

    get allPaths() {
      return [
               this.row0, this.row1, this.row2,
               this.col0, this.col1, this.col2,
               this.diagLeft, this.diagRight
             ];
    }

    get winner() {
      let waysToWin = ['row0', 'row1', 'row2', 'col0', 'col1', 'col2', 'diagLeft', 'diagRight'];
      let winningWay = '';
      for(let i = 0; i < waysToWin.length; i++) {
        if (this[waysToWin[i]].hasWinner) {
          winningWay = waysToWin[i];
          break;
        }
      }
      if (winningWay !== '') {
        return this[winningWay].winner;
      }
      return '';
    }
  };
}());

 function getGameId() {
  var id = location.search.substr(1);
  if (!id) id = Meteor.uuid().replace(/[^0-9]|-/gi, '').toUpperCase().substr(1, 5);
  return id;
}

function getMove(event) {
  var col = $(event.currentTarget);
  var parentRow = col.parent();

  var rowIndex = parentRow.index();
  var colIndex = col.index();

  return {
    row: rowIndex,
    col: colIndex
  };
}

Template.ticTacToe.created = function() {
  var id = getGameId();
  var game = new TicTacToe(id);
  this.game = new ReactiveVar(game);
};

Template.ticTacToe.rendered = function() {
  // Yay, global
  window.tttGame = this.game;
  window.onConsoleLoaded = function(sandbox) {
    var init = `Object.defineProperty(this, 'ttt', {
  get: function() {
    return {
      get game() { return top.tttGame.get(); },
      update: function() { top.tttGame.set(this.game); }
    };
  }
})`;
    console.log(init);
    sandbox.model.iframeEval(init);
  };
};

Template.ticTacToe.helpers({
  game: function() {
    var game = Template.instance().game.get();
    return game;
  },
  rows: function() {
    var game = Template.instance().game.get();
    var m = game.board;
    return m;
  },
  allPaths: function() {
    var game = Template.instance().game.get();
    var mapped = _.map(game.allPaths, function(path) {
      return _.pick(path, 'isWinner', 'moves', 'name');
    });
    return mapped;
  },
  row: function() {
    return this;
  },
  move: function() {
    return this;
  },
  isWinner: function() {
    return this.isWinner ? 'true' : 'false';
  },
  moves: function() {
    return JSON.stringify(this.moves);
  }
});

Template.ticTacToe.events({
  'click .ttt-cell': function (event, template) {
    var game = template.game.get();
    game.clicks++;
    var move = getMove(event);
    var row = move.row;
    var col = move.col;
    //if (game.moves[row][col] === '') game.moves[row][col] = game.turn;
    game.player(game.turn).move(row, col);
    game.turn = game.turn === 'X' ? 'O' : 'X';
    template.game.set(game);
    /*
    var move = template.model.getMove(event);
    template.model.scoreMove(move, game.turn, game.moves);
    var nextTurn =template.model.getNextTurn(game.turn);
    game.turn = nextTurn;
    template.model.save(Games, game);
    console.log(template.model.isBoardFull(game.moves));
    console.log(template.model.getWinningMoves(game.moves));
    */
  }
});

}());