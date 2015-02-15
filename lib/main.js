Levels = new Meteor.Collection('levels');
LevelsChat = new Meteor.Collection('levelsChat');
SpriteParts = new Meteor.Collection('spriteParts');
SpriteSheets = new Meteor.Collection('spriteSheets');
Lessons = new Meteor.Collection('lessons');
StepFeedback = new Meteor.Collection('stepFeedback');
Challenges = new Meteor.Collection('challenges');
Surveys = new Meteor.Collection('surveys');
SurveyAnswers = new Meteor.Collection('surveyAnswers');
MissionStepViews = new Meteor.Collection('missionStepViews');
MissionStepSelfAssessments = new Meteor.Collection('missionStepSelfAssessments');

UI.registerHelper('addIndex', function (all) {
    return _.map(all, function(val, index) {
        return {index: index, value: val};
    });
});

userName = function() {
  return Meteor.user().profile.name || Meteor.user().profile.nickName;
}


UI.registerHelper("eq", function (op1, op2) {
  return op1 === op2;
});

Router.map(function() {
  this.route('lesson', {
    path: '/lesson/:_id',
    layoutTemplate: 'lessonLayout',
    data: function() {
      return Lessons.findOne({_id: this.params._id});
    }    
  });
  
  this.route('challenge', {
    path: '/challenge/:_id',
    layoutTemplate: 'lessonLayout',
    data: function() {
      return Lessons.findOne({_id: this.params._id});
    }    
  });  
  
  this.route('members', {
    path: '/members',
    layoutTemplate: 'mainLayout',
    data: function() {
      return Meteor.users.find();
    }
  });
  
  this.route('survey', {
    path : '/survey/:_id',
    layoutTemplate: 'mainLayout',
    data: function(){
      return Surveys.findOne( { _id: this.params.id });
    }
  });
  
  this.route('missionControl', {
    path: '/missionControl/:missionId',
    layoutTemplate: 'mainLayout'
  });  

  this.route('dash', {path: '/dash', layoutTemplate: 'mainLayout'});

  this.route('lessonEditor', {path: '/lessonEditor', layoutTemplate: 'mainLayout'});

  this.route('build', {
    path: '/build', 
    layoutTemplate: 'mainLayout',
    data: function() {
      var id = 'starter';
      var query = this.params.query;
      if (query && query.id) id = query.id;
      return Levels.findOne({_id: id});
    }
  });  
  
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

  this.route('training', {
    path: '/training',
    layoutTemplate: 'mainLayout'
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

boardFromNewToOld = function(board) {
  var tileMap = {
    t : 't',
    c : '-',
    e : 'E',
    g : 'G',
    p : 'P',
    '-' : '-'
  };
  return _.map(board, function(row) {
    return _.map(row, function(col) {
      return tileMap[col.toLowerCase()];
    });
  });
}


boardToText = function(board) {
  return _.reduce(board, function(text, row) {
      return text + row.join('') + '\n';
    }, '');  
};