Levels = new Meteor.Collection('levels');
LevelsChat = new Meteor.Collection('levelsChat');
SpriteParts = new Meteor.Collection('spriteParts');
SpriteSheets = new Meteor.Collection('spriteSheets');
StepFeedback = new Meteor.Collection('stepFeedback');
Challenges = new Meteor.Collection('challenges');
Surveys = new Meteor.Collection('surveys');
SurveyAnswers = new Meteor.Collection('surveyAnswers');
MissionStepViews = new Meteor.Collection('missionStepViews');
MissionStepSelfAssessments = new Meteor.Collection('missionStepSelfAssessments');
Messages = new Meteor.Collection('messages');

UI.registerHelper('addIndex', function (all) {
    return _.map(all, function(val, index) {
        return {index: index, value: val};
    });
});

userName = function() {
  if (!Meteor.user()) return 'Anonymous';
  return Meteor.user().profile.name || Meteor.user().profile.nickName;
};

message = function(text){
  Messages.insert({userName:userName(),text:text, userId: Meteor.userId(), date:new Date()});
  return 'Your message has been sent to the IntergalactiChat chat room';
};

numf = function(num) {
  if (_.isNumber(num)) return num.toLocaleString();
  return NaN;
}

css = function(klass, rules) {
  var css = '';
  _.each(rules, function(value, key) {
    css += key + ': ' + value + ';\n';
  });
  return '.' + klass + '{\n' + css + '}';
}

UI.registerHelper("eq", function (op1, op2) {
  return op1 === op2;
});

UI.registerHelper("typeOf", function (op1, type) {
  return typeof op1 === type;
});

Router.map(function() {
  /*
  this.route('lesson', {
    path: '/lesson/:_id',
    layoutTemplate: 'lessonLayout',
    data: function() {
      return Lessons.findOne({_id: this.params._id});
    }
  });
  */
  this.route('lessons', {
    path: '/lessons',
    layoutTemplate: 'mainLayout'
  })
  this.route('lesson', {
    path: '/lesson',
    layoutTemplate: 'lessonLayout',
    data: function() {
      var lesson = Lessons.findOne({_id: this.params.query.id});
      console.log("************");
      console.log(lesson);
      return lesson;
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
    data: function() {
      return Surveys.findOne( { _id: this.params.id });
    }
  });

  this.route('missionControl', {
    path: '/missionControl/:missionId',
    layoutTemplate: 'mainLayout'
  });

  this.route('lessonProgress', {
    path: '/lessonProgress/:lessonId',
    layoutTemplate: 'mainLayout',
    data: function() {
      var data = [
        Lessons.findOne({_id: Router.current().params.lessonId}),
        LessonsProgress.findOne({ userId: Meteor.userId(),
            lessonId: Router.current().params.lessonId
        })
      ];
      return data;
    }
  });

  this.route('dash', {path: '/dash', layoutTemplate: 'mainLayout'});

  this.route('lessonEditor', {path: '/lessonEditor', layoutTemplate: 'mainLayout'});

  this.route('intergalactiChat', {path: '/intergalactiChat'});

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

  this.route('profile', {
    path: '/profile/:nickName?',
    layoutTemplate: 'mainLayout',
    data: function() {
      var data = {
        isNotSelf: false,
        levels: [],
        searchNickName: userName(),
        user: Meteor.user(),
        userId: Meteor.userId()
      };
      if (Router.current().params.nickName) {
        var nickName = decodeURIComponent(Router.current().params.nickName);
        data.isNotSelf = nickName !== userName();
        data.searchNickName = nickName;
      }
      data.user = Meteor.users.findOne({'profile.nickName': data.searchNickName});
      if (data.user && data.user.profile) console.log(data.user.profile.nickName);
      if (data.user) {
        data.userId = data.user._id;
      }
      data.levels = Levels.find({userId : data.userId});
      data.dynamos = UserDynamos.find({userId: data.userId});
      return data;
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

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}