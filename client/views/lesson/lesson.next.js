var lesson;
var lessonProgress;
var lessonDep = new Deps.Dependency;

var currentSecIndex = new ReactiveVar(0);
var currentPartIndex = new ReactiveVar(0);

function updateLessonProgress(lessonProgress) {
  LessonsProgress.update({_id:lessonProgress._id}, {$set: _.omit(lessonProgress, '_id')});
}

function getLessonProgressForCurrentUser() {
  return LessonsProgress.findOneForUser(lesson, Meteor.userId());
}

function updateLessonProgressPartLastViewed(lessonProgress, secIndex, partIndex, includeSec) {
  if (includeSec) {
    lessonProgress.sections.items[secIndex].lastViewed = new Date();
    lessonProgress.sections.lastIndex = secIndex;
  }
  lessonProgress.sections.items[secIndex].parts.items[partIndex].lastViewed = new Date();
  lessonProgress.sections.items[secIndex].parts.lastIndex = partIndex;
  updateLessonProgress(lessonProgress);
  console.log(lessonProgress);
}

function setupWindowGlobals() {
  window.display = function(expr) {
    bootbox.alert(String(expr));
  }
}

Template.lesson.rendered = function() {
  setupWindowGlobals();
  
  //var id = Router.current().params._id;
  var id = Router.current().params.query.id;
  console.log(id);

  // Insane: not sure why I have to do this, but it prevents errors...
  Lessons.update({_id: id}, {$inc: {views:1}}, function(err, count) {
    lesson = Router.current().data();
    
    var secIndex = Router.current().params.query.sec;
    var partIndex = Router.current().params.query.part;

    lessonProgress = getLessonProgressForCurrentUser();
    LessonsProgress.overlayOnLesson(lesson, lessonProgress);
    lessonProgress.lastViewed = new Date();

    if (secIndex) {
      secIndex = parseInt(secIndex) - 1;
    } else {
      secIndex = lessonProgress.sections.lastIndex;
      console.log(secIndex);
    }
    if (partIndex)  {
      // nothing special, just parse it
      partIndex = parseInt(partIndex) - 1;
    } else {
      partIndex = lessonProgress.sections.items[secIndex].parts.lastIndex;
      console.log(partIndex);
    }
    currentSecIndex.set(secIndex);
    currentPartIndex.set(partIndex);
    lessonDep.changed();
    updateLessonProgressPartLastViewed(lessonProgress, secIndex, partIndex, true);
  });
}

function getLesson() {
  lessonDep.depend();
  return lesson;
}

var answeredDep = new Deps.Dependency;

Template.lesson.helpers({
  gameData: function() {
    return {
      level: "boxStep",
      enableSound: false
    };
  },
  lesson: getLesson,
  lastViewed: function() {
    var lesson = getLesson();
    if (!lesson) return '';
    if (lesson.lastViewed) {
      var fmt = moment(lesson.lastViewed).fromNow();
      return 'lesson seen ' + fmt;
    }
    return 'lesson seen just now';
  },
  challengeReady: function() {
    answeredDep.depend();
    var lesson = getLesson();
    if (!lesson) return;
    var questions = lesson.questions;    
    var ready = _.every(questions, (question)=> {
      return question.correct;
    });
    if (ready) {
      $('.collapse').collapse('hide');
    }
    return ready;
  },
  lessonTitle: function() {    
    var lesson = getLesson();    
    if (!lesson) return '';    
    return 'Lesson: ' + lesson.title;
  }  
});

Template.popquiz.helpers({
  lesson: getLesson
});

Template.section.helpers({
  current: function() {
    var index = currentSecIndex.get();    
    return this.index === index;
  },
  currentPart: function() {
   var index = currentPartIndex.get();
   return this.index === index;
  },
  lastViewedPart: function() {
    currentPartIndex.get();
    return this.lastViewed ? 'step ' + (this.index+1) + ' seen ' + moment(this.lastViewed).fromNow() : 'step ' + (this.index+1) + ' seen just now';
  },
  partIndex: function() {
    return this.index + 1;
  }
});

Template.sectionNav.helpers({
  current: function() {
    return this.index === currentSecIndex.get() ? 'active' : '';
  },
  seenStar: function() {
    currentSecIndex.get();
    return this.lastViewed !== null ? 'fa-star' : 'fa-star-o';
  },
  seenBadge: function() {
    currentSecIndex.get();
    return this.lastViewed !== null ? 'alert-success' : '';
  },
  lastViewed : function() {
    var index = currentSecIndex.get();
    if (this.lastViewed) {
      var fmt = moment(this.lastViewed).fromNow();
      return 'seen ' + fmt;
    }
    return index === this.index ? 'seen just now' : 'never seen';
  }
});

Template.sectionNav.events({
  'click .sectionNav': function(evt, template) {
    currentSecIndex.set(template.data.index);
    currentPartIndex.set(0);
    var lesson = getLesson();
    LessonsProgress.overlayOnLesson(lesson, lessonProgress);
    updateLessonProgressPartLastViewed(lessonProgress, template.data.index, 0, true);
  }
});

Template.lesson.events({  
  'click .prev': function() {
    var index = currentSecIndex.get(); 
    currentSecIndex.set(index-1);
  }
});

Template.partNav.helpers({
  current: function() {
    var partIndex = currentPartIndex.get();
    return partIndex === this.index;
  },
  partIndex: function() {
    return this.index + 1;
  }
});

Template.partNav.events({
  'click .partNav': function(evt, template) {
    currentPartIndex.set(template.data.index);
    LessonsProgress.overlayOnLesson(lesson, lessonProgress);
    updateLessonProgressPartLastViewed(lessonProgress, currentSecIndex.get(), template.data.index);    
  }
});

var sharedHelpers = {
  partIndex: function() {
    return this.index + 1;
  }  
};

_.each(['paragraph', 'quickCheck', 'popquiz'], function(item) {
  Template[item].helpers(sharedHelpers);
});

var sharedEvents = {
  'click .continue': function(evt, template) {
    var index = currentSecIndex.get();     
    var lesson = getLesson();
    LessonsProgress.overlayOnLesson(lesson, lessonProgress);
    var parts = lesson.sections[index].parts;
    if (template.data.index < parts.length - 1) {
      var partIndex = currentPartIndex.get();
      var nextIndex = partIndex + 1;
      currentPartIndex.set(nextIndex);
      console.log('changing:');
      console.log(partIndex);
      console.log(nextIndex);
      updateLessonProgressPartLastViewed(lessonProgress, index, nextIndex);
    }
    if (template.data.index === parts.length -1) {
      currentSecIndex.set(index+1);
      currentPartIndex.set(0);
      updateLessonProgressPartLastViewed(lessonProgress, index+1, 0, true);
    }
  },
  'click .quickCheckSubmit': (evt, template)=> {
    var input = $(template.find('.quickCheckInput')).val();
    var index = currentSecIndex.get();
    var lesson = getLesson();
    LessonsProgress.overlayOnLesson(lesson, lessonProgress);    
    var part = template.data;
    try {
      var evaluator = eval(part.evaluator);
      var correct = evaluator(input);
      if (correct) {
        bootbox.alert("<div class='bbalert'><i class='fa fa-smile-o'></i><h2>Correct!</h2> <p>Press OK to continue...</p></div>", ()=> {
          currentSecIndex.set(index+1);
          currentPartIndex.set(0);
          updateLessonProgressPartLastViewed(lessonProgress, index+1, 0, true);
        });
      } else {
        bootbox.alert("<div class='bbalert'><i class='fa fa-frown-o'></i><h2>Nope!</h2><p>Press OK to try again...</p></div>");
      }
    } catch(ex) {
      bootbox.alert("<h2>There was a problem with the system!</h2>");
    }
  }
};

_.each(['paragraph', 'quickCheck', 'popquiz'], function(item) {
  Template[item].events(sharedEvents);
});

Template.paragraph.rendered = function(evt, template) {  
  $('script[type="text/spaceminer+dynamic"]').each(function() {
    var el = $(this);
    var name = el.attr('data-name');
    var data;
    var text = el.text();
    try {
      var data = JSON.parse(text);
    } catch (ex) {
      data = text;
    }
    UI.insert(UI.renderWithData(Template[name], data), this.parentNode, this);
    el.remove();
  }); 
}

Template.question.rendered = function() {
  $('.choice').button();
}

Template.question.events({
  'click .check': function(evt, template) {
    var val = $(template.find('.question .btn-group .btn[class*="active"] input')).val();    
    if (val) {
      var index = parseInt(val);
      var correct = this.correctIndex == parseInt(index);
      var icon = correct ? 'fa fa-check' : 'fa fa-ban';
      var bg = correct ? 'seagreen' : 'indianred';
      $(template.find('.feedback')).html(`<div style='padding: 4px; color: white; background-color: ${bg}'><span class='${icon}'></span>&nbsp;` + this.choices[index].feedback + '</div>');
      $(template.find('.feedback')).hide();
      $(template.find('.feedback')).fadeIn('slow');
  
      this.correct = correct;
      answeredDep.changed();
    }
  }
});