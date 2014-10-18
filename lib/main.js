Levels = new Meteor.Collection("levels");
SpriteParts = new Meteor.Collection("spriteParts");
SpriteSheets = new Meteor.Collection("spriteSheets");

Router.map(function() {
  this.route('home', {path: '/'});
});

Router.route('levelCustomize', {
    path: '/levelCustomize/:_id',
    waitOn: function() {
      return Meteor.subscribe('levels', this.params._id);
    },
    data: function() {
      return Levels.findOne({_id: this.params._id});
    }
    /*,
    action: function() {
      if (!this.ready()) { 
        var that = this;
        console.log('not ready');
        setTimeout(function() {
          if (that.ready()) that.render();
        }, 2000);
        //pause();
      }
      else this.render();
    }*/
});

boardFromText = function(board) {
  return _.map(board.split('\n'), function(row) {
    return row.split('');
  });
};

boardToText = function(board) {
  return _.reduce(board, function(text, row) {
      return text + row.join('') + '\n';
    }, '');  
};