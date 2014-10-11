Levels = new Meteor.Collection("levels");
SpriteParts = new Meteor.Collection("spriteParts");
SpriteSheets = new Meteor.Collection("spriteSheets");

Router.map(function() {
  this.route('home', {path: '/'});
  this.route('levelCustomize');  
});

boardFromText = function(board) {
  return _.map(board.split('\n'), function(row) {
    return row.split('');
  });
}

boardToText = function(board) {
  return _.reduce(board, function(text, row) {
      return text + row.join('') + '\n';
    }, '');  
}