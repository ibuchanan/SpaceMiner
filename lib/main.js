Levels = new Meteor.Collection("levels");
SpriteParts = new Meteor.Collection("spriteParts");
SpriteSheets = new Meteor.Collection("spriteSheets");

Router.map(function() {
  this.route('home', {path: '/'});
  this.route('levelCustomize');  
});

boardFromText = function(board) {
  var rows = board.split('\n');
  board = [];
  _.each(rows, function(row) {
    var cols = row.split('');
    cols = _.map(cols, function(val) {
      return val;
    });
    board.push(cols);
  });
  return board;
}

boardToText = function(board) {
  return _.reduce(board, function(text, row) {
      return text + row.join('') + '\n';
    }, '');  
}