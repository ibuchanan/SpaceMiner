Levels = new Meteor.Collection('levels');
SpriteParts = new Meteor.Collection('spriteParts');
SpriteSheets = new Meteor.Collection('spriteSheets');
Lessons = new Meteor.Collection('lessons');
LessonSteps = new Meteor.Collection('lessonSteps');

UI.registerHelper('addIndex', function (all) {
    return _.map(all, function(val, index) {
        return {index: index, value: val};
    });
});

Router.map(function() {
  this.route('home', {path: '/'});
  
  this.route('lesson', {path: '/lesson', layoutTemplate: 'lessonLayout'});
  
  this.route('levelCustomize', {
    action: function() {
      if(this.ready()) {
        console.log("We ready");
        this.render();
      }
    },    
    /*    
    waitOn: function() {
      console.log("We are waiting...");
      return Meteor.subscribe('levels', this.params._id);
    },*/
    path: '/levelCustomize/:_id',    
    data: function() {
      return Levels.findOne({_id: this.params._id});
      //return Levels.find({_id: this.params._id}).fetch();
    }
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