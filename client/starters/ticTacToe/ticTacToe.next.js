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
        // TODO move this hack?
        game.turn = game.turn === 'X' ? 'O' : 'X';
        GameTicTacToe.updateGame(game.getState());
      }
    }
  }
  
  function board(moves) {
    return {
      get allMoves() { return JSON.parse(JSON.stringify(moves)); },
      move: function(row, col, player) {
        moves[row][col] = player;
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
    console.log(game);
    return new Path(game, game.board.allMoves[rowNumber], name);
  }

  function getCol(game, colNumber, name) {
    return new Path(game, [getMove(game.board.allMoves, 0, colNumber), getMove(game.board.allMoves, 1, colNumber), getMove(game.board.allMoves, 2, colNumber)], name);
  }

  function getDiag(game, startY, startX, slope, name) {
    return new Path(game, [
      getMove(game.board.allMoves, startY, startX),
      getMove(game.board.allMoves, startY + slope.y, startX + slope.x),
      getMove(game.board.allMoves, startY + slope.y * 2, startX + slope.x * 2)
    ], name);
  }

  var defaults = {
    move: function(board, row, col, player) {
      board.move(row, col, player);
    },
    detectWin: function(moves) {
      return moves[0] != E && moves[0] === moves[1] && moves[1] === moves[2];
    },
    hasWinner: function() {
      return this.row0.isWinner || this.row1.isWinner || this.row2.isWinner
        || this.col0.isWinner || this.col1.isWinner || this.col2.isWinner
        || this.diagLeft.isWinner || this.diagRight.isWinner;
    }
  };

  var Ttt = class {
    constructor(id, userId) {
      this._id = id;
      this.createdBy = userId;
      this.board = board([
        [E, E, E],
        [E, E, E],
        [E, E, E]
      ]);
      this.turn = X;
      this.reset();
    }
    
    getState() {
      var gameState = _.pick(this, '_id', 'board', 'createdBy', 'turn');
      gameState.board = gameState.board.allMoves;
      return gameState;
    }
    
    setState(gameState) {
      this._id = gameState._id;
      this.board = board(gameState.board);
      this.turn = gameState.turn;
      this.createdBy = gameState.createdBy;      
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
  Ttt.prototype.reset = function() {
    this.move = defaults.move;
    this.detectWin = defaults.detectWin;
    this.hasWinner = defaults.hasWinner;
  };
  return Ttt;
}());

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  console.log('Query variable %s not found', variable);
}

 function getGameId() {
  var id = getQueryVariable('gameId');
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
  
function getUpdatedGame(template, id) {
  return function() {
    var gameState = GameTicTacToe.findOne(id);
    template.game.setState(gameState);
    console.log("The game id:" + id);
    return template.game;
  };
}  

Template.ticTacToe.created = function() {
  this.ready = new ReactiveVar(false);
};

Template.ticTacToe.rendered = function() {
  // Yay, global
  window.tttGame = { get : function() { return this.getGame(); } };
  window.onConsoleLoaded = function(sandbox) {
    var init = `Object.defineProperty(this, 'ttt', {
  get: function() {
    return {
      get game() { return top.tttGame.get(); }
    };
  }
})`;
    console.log(init);
    sandbox.model.iframeEval(init);
  };
};

Template.ticTacToe.helpers({
  ready: function() {
    var ready = Template.instance().ready.get();
    return ready ? ready : false;
  },
  game: function() {
    var game = Template.instance().getGame();
    return game;
  },
  rows: function() {
    var game = Template.instance().getGame();
    var m = game.board;
    console.log("all moves");
    console.log(m.allMoves);
    return m.allMoves;
  },
  allPaths: function() {
    var game = Template.instance().getGame();
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
    var game = template.getGame();
    // buzz off if not the right player
    if (game.turn === template.myPlayer) {
      var move = getMove(event);
      var row = move.row;
      var col = move.col;
      game.player(game.turn).move(row, col);
    } else {
      console.warn("Not your turn right now...");
    }
  },
  'click .join': function(event, template) {
      var id = $(template.find('.gameId')).val();
      var game = new TicTacToe(id, null);
      template.game = game;  
      template.getGame = getUpdatedGame(template, id);    
      template.getGame();
      template.myPlayer = 'O';
      template.ready.set(id);
  },
  'click .start': function(event, template) {
    var id = getGameId();
    var game = new TicTacToe(id, Meteor.userId());
    template.game = game;  
    var gameState = game.getState();
  
    GameTicTacToe.insert(gameState, function(err, id) {
      if (err) {
        console.log("Err:");
        console.log(err);
      } else {
        template.getGame = getUpdatedGame(template, id);    
        template.myPlayer = 'X';
        template.ready.set(id);
      }
    });  
  }
});

}());