(function() {

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
  var b = "";
  var game = {
    _id: id,
    moves: [
      [b, b, b],
      [b, b, b],
      [b, b, b]
    ],
    turn: 'X',
    clicks: 0
  };
  this.game = new ReactiveVar(game);  
};

Template.ticTacToe.helpers({
  game: function() {
    var game = Template.instance().game.get();
    return game;
  },
  rows: function() { 
    var game = Template.instance().game.get();
    var m = game.moves;
    return m;
  },
  row: function() {
    return this;
  },
  move: function() {
    return this;
  }
});
  
Template.ticTacToe.events({
  'click .ttt-cell': function (event, template) {
    var game = template.game.get();
    game.clicks++;
    var move = getMove(event);
    var row = move.row;
    var col = move.col;
    if (game.moves[row][col] === '') game.moves[row][col] = game.turn;
    game.turn = game.turn === 'X' ? 'O' : 'X';
    template.game.set(game);
    console.log(game);
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