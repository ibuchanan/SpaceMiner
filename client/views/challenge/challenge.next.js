var lessonDep = new Deps.Dependency;
var lesson;

Template.challenge.created = function() {
  var id = Router.current().params._id;      
  Lessons.update({_id: id}, {$set: {lastViewed: new Date()}}, function(err, count) {
    lesson = Router.current().data();
    setLesson(lesson);
    lessonDep.changed();
  });
}

function getLesson() {
  return Session.get('lesson');
}

function setLesson(lesson) {
  Session.set('lesson', lesson);
}

Template.challenge.helpers({
  lesson: getLesson
});

Template.steps.helpers({
    notFinished: function() {
      lessonDep.depend();
      var lesson = getLesson();
      console.log(lesson);
      var notFin = lesson.finishing !== true;
      return notFin;
    },    
    lesson: getLesson
});

Template.step.helpers({
  typeNotError: function() {
    return this.expectation.type && this.expectation.type !== 'error';
  },
  previousAllowed: function() {
    return this.index > 0;
  },
  nextAllowed: function() {
    return this.index < getLesson().steps.length - 1;
  },
  last: function() {
    return this.index === getLesson().steps.length - 1;
  },
  pager: function() {
    return {current: this.index + 1, total: getLesson().steps.length};
  }
});

function lessonNavigate(currentIndex, newIndex, attemptedCurrent) {
    $('.explanation').hide();
    var lesson = getLesson();
    lesson.steps[currentIndex].current = false;
    if (attemptedCurrent) lesson.steps[currentIndex].attempted = true;
    lesson.steps[newIndex].current = true;
    var id = lesson._id;
    delete lesson._id;
    Lessons._collection.update({_id: id}, {$set: lesson});  
    setLesson(lesson);
}

function feedbackInsert(step, sense) {
    var feedback = {
      lessonStepName: step.name,
      lessonStepTitle: step.title,
      userId: Meteor.userId(),
      userName: userName(),
      date: new Date(),
      sense
    };
    StepFeedback.insert(feedback);
}

Template.step.events({
  'click .explanationShow': function() {
    $('.explanation').show();
  },
  'click .previous': function() {
    lessonNavigate(this.index, this.index - 1, false);
  },
  'click .next': function() {
    lessonNavigate(this.index, this.index + 1, true);
  },
  'click .finish': function() {
    var lesson = getLesson();    
    lesson.finishing = true;
    Lessons._collection.update({_id: lesson._id}, {finishing: lesson.finishing});
    setLesson(lesson);
  },
  'click .not': function() {
    feedbackInsert(this, 'not');
  },
  'click .almost': function() {
    feedbackInsert(this, 'almost');
  },
  'click .yes': function() {
    feedbackInsert(this, 'yes');
  }  
});

Template.finish.events({
  'click .challengesShow': function() {
    // TODO: this is super hacky:
    var lesson = getLesson();  
    lesson.finishing = false;
    for (var i = 0; i < lesson.steps.length; i++) lesson.steps[i].current = false;
    setLesson(lesson);
    lessonNavigate(0, 0, false);
  },
  'click .test': function() {
    var finish = getLesson().finish;    
    var code = ace.edit('finishCode').getSession().getValue();
    var testFuncDef = '(function() { var val = (function(){' + code + '\n;\n' + finish.completion + ';})(); return ' + finish.assertion + ';})';
    try {
      var testFunc = eval(testFuncDef);
      if (_.isFunction(testFunc) && testFunc() === true) {
        Challenges.insert({userId:Meteor.userId(), challenge:Router.current().params._id}, function(err) {
          if (err) {
            bootbox.alert("Sorry! There was an error saving your challenge results. Please try again.");
          } else {
            bootbox.alert('Good job!');
          }
          /* TODO this once made sense as a follow on from beating the first level, but probably not now, at least not at the moment
          if (!err) {
            Levels.update({_id:Router.current().params.levelId}, {$set: {onWon:code}}, function(err) {
              if (!err) bootbox.alert('Good job!');
              else bootbox.alert("Sorry! There was en error saving. Please try again.");
            });
          }
          */
        });
      } else {
        bootbox.alert('Hmm. Something isn\'t right. Keep trying...');
      }
    } catch(ex) {
       bootbox.alert('Hmm. Something isn\'t right. Keep trying...');      
       console.log(ex);
    }
  }
});

Template.finish.rendered = function() {
  var editor = ace.edit('finishCode')  ;
  editor.setFontSize(16);
  editor.setTheme("ace/theme/monokai");
  var session = editor.getSession();
  session.setMode("ace/mode/javascript");     
  session.setValue(getLesson().finish.code);
  editor.setHighlightActiveLine(true);
};
