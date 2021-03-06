// TODO move to new file
Levels = new Meteor.Collection('levels');

Levels.findByLessonIdAndUserId = function(lessonId, userId, createIfAbsent) {
  userId = userId || Meteor.userId();
  if (_.isBoolean(createIfAbsent)) createIfAbsent = true;

  var level = Levels.findOne({
    userId: userId,
    lessonId: lessonId
  });

  if (level === undefined) {
    level = Levels.new(lessonId, userId);
    var id = Levels.insert(level);
    level._id = id;
  }

  return level;
};

Levels.new = function(lessonId, userId) {
  // Get the default starter level
  const levelDoc = Levels.findOne('starter');
  delete levelDoc._id;
  levelDoc.published = false;
  levelDoc.phase = 'build';
  levelDoc.updatedBy = userName();
  levelDoc.userId = userId,
  levelDoc.lessonId = lessonId;

  return levelDoc;
};

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
    var lastIndex = all.length - 1;
    return _.map(all, function(val, index) {
        return {index: index, value: val, last: index === lastIndex};
    });
});

function nameFromProfileOrNickName(profile) {
  return profile.name || profile.nickName;
};

userName = function() {
  var user = Meteor.user();
  if (!user) return 'Anonymous';
  return nameFromProfileOrNickName(user.profile);
};

userNameById = function(id) {
  var user = Meteor.users.findOne(id);
  if (!user) return 'Anonymous';
  return nameFromProfileOrNickName(user.profile);
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
    layoutTemplate: 'mainLayout'
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
      if (this.params.nickName) {
        var nickName = decodeURIComponent(this.params.nickName);
        data.isNotSelf = nickName !== userName();
        data.searchNickName = nickName;
      }
      data.user = Meteor.users.findOne({'profile.nickName': data.searchNickName});
      if (data.user) {
        console.log('the userid:', data.user._id);
        data.userId = data.user._id;
      }
      data.levels = Levels.find({userId : data.userId}).fetch();
      data.dynamos = UserDynamos.find({userId: data.userId}).fetch();
      console.log("data:", data);
      return data;
    }
  });

  this.route('training', {
    path: '/training',
    layoutTemplate: 'mainLayout'
  });

  this.route('customSprites', { path: '/customSprites' });

  this.route('play', { path: '/play', layoutTemplate: 'mainLayout' } );

  this.route('home', { path: '/:levelId?' });

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