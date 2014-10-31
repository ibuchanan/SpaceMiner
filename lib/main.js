Levels = new Meteor.Collection('levels');
SpriteParts = new Meteor.Collection('spriteParts');
SpriteSheets = new Meteor.Collection('spriteSheets');
Lessons = new Meteor.Collection('lessons');
StepFeedback = new Meteor.Collection('stepFeedback');
Challenges = new Meteor.Collection('challenges');

UI.registerHelper('addIndex', function (all) {
    return _.map(all, function(val, index) {
        return {index: index, value: val};
    });
});

Router.map(function() {
  this.route('lesson', {
    path: '/lesson/:_id/:levelId',
    layoutTemplate: 'lessonLayout',
    data: function() {
      return Lessons.findOne({_id: this.params._id});
    }    
  });

  this.route('dash', {path: '/dash'});
  
  this.route('levelCustomize', {
    action: function() {
      if(this.ready()) {
        console.log("We ready");
        this.render();
      }
    },    
    path: '/levelCustomize/:_id',    
    data: function() {
      return Levels.findOne({_id: this.params._id});
    }
  });

  this.route('home', {
    path: '/:levelId?'
  });
  
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