Levels = new Meteor.Collection("levels");
SpriteParts = new Meteor.Collection("spriteParts");
SpriteSheets = new Meteor.Collection("spriteSheets");

Router.map(function() {
  this.route('home', {path: '/'});
  this.route('levelCustomize');  
});

function parseBoard(board) {
  var rows = board.split('\n');
  board = [];
  _.each(rows, function(row) {
    var cols = row.split('');
    cols = _.map(cols, function(val) {
      if (val === 't') return 1;
      return val;
    });
    board.push(cols);
  });
  return board;
}