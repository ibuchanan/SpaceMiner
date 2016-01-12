var lesson = null;
var lessonProgress;
var lessonDep = new Tracker.Dependency;

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
    }
    if (partIndex)  {
      // nothing special, just parse it
      partIndex = parseInt(partIndex) - 1;
    } else {
      partIndex = lessonProgress.sections.items[secIndex].parts.lastIndex;
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

let answeredDep = new Tracker.Dependency;
let isQuiz = new ReactiveVar(false);

Template.lesson.helpers({
  gameData: function() {
    return {
      level: "boxStep",
      enableSound: false
    };
  },
  lesson: getLesson,
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
  rendered: function() {
    var lesson = getLesson();
    return lesson !== null;
  },
  isQuiz: function() {
    let wellIsIt = isQuiz.get();
    return wellIsIt;
  },
  currentPartIndex() {
    return currentPartIndex.get();
  },
  selfAssessmentResourcePath() {
    const lesson = getLesson();
    const secIndex = currentSecIndex.get();
    const partIndex = currentPartIndex.get();
    const path = Lessons.resourcePath(lesson.lessonId, secIndex, partIndex);
    return path;
  },
  selfAssessmentData() {
    return { nothing: 'here yet'};
  },
  onAssessmentSelected() {
    const instance = Template.instance();
    return () => {
      const continueButton = instance.find('.continue');
      continueButton.removeAttribute('disabled');
    };
  },
  helpRequestsOptions() {    
    return { filterToUserId: Meteor.userId(), showLinks: true, displayMode: 'vertical'};
  },
  lessonFinished() {
    const index = currentSecIndex.get();     
    const lesson = getLesson();
    const sectionCount = lesson.sections.length;
    const partsCount = lesson.sections[index].parts.length;
    const partIndex = currentPartIndex.get();
    return (index >= lesson.sections.length - 1) && partIndex >= partsCount - 1;
  }
});

let popquiz = {finished:false};
const popquizDep = new Tracker.Dependency();

Template.popquiz.rendered = function() {
  popquiz = this.data;
  popquiz.finished = false;
  popquizDep.changed();
  isQuiz.set(true);
};

Template.popquiz.helpers({
  lesson: getLesson,
  finished() {
    popquizDep.depend();
    return popquiz.finished;
  }
});

Template.section.helpers({
  lessonLastViewed: function() {
    const lesson = getLesson();
    if (!lesson) return '';
    if (lesson.lastViewed) {
      const fmt = moment(lesson.lastViewed).fromNow();
      return 'lesson seen ' + fmt;
    }
    return 'lesson seen just now';
  },
  current() {
    var index = currentSecIndex.get();    
    return this.index === index;
  },
  lessonTitle: function() {
    const lesson = getLesson();
    if (!lesson) return '';
    return lesson.title;
  },  
  title() {
    var index = currentSecIndex.get();
    var lesson = getLesson();
    return lesson.sections[index].title;
  },
  currentPart() {
   var index = currentPartIndex.get();
   return this.index === index;
  },
  lastViewedPart() {
    currentPartIndex.get();
    return this.lastViewed ? 'step ' + (this.index+1) + ' seen ' + moment(this.lastViewed).fromNow() : 'step ' + (this.index+1) + ' seen just now';
  },
  partIndex() {
    return this.index + 1;
  },
  partIndex() {
    lessonDep.depend();
    const index = currentPartIndex.get();
    return index;
  },
  options() {
    lessonDep.depend();
    const secIndex = currentSecIndex.get();
    const partIndex = currentPartIndex.get();
    return { resourcePath: Lessons.resourcePath(Router.current().params.query.id, secIndex, partIndex), limit: 5 };
  }
});

Template.sectionNav.helpers({
  current() {
    return this.index === currentSecIndex.get() ? 'active' : '';
  },
  seenStar() {
    currentSecIndex.get();
    return this.lastViewed !== null ? 'fa-star' : 'fa-star-o';
  },
  seenBadge() {
    currentSecIndex.get();
    return this.lastViewed !== null ? 'alert-success' : '';
  },
  lastViewed() {
    var index = currentSecIndex.get();
    if (this.lastViewed) {
      var fmt = moment(this.lastViewed).fromNow();
      return 'seen ' + fmt;
    }
    return index === this.index ? 'seen just now' : 'never seen';
  }
});

Template.sectionNav.events({
  'click .sectionNav'(evt, template) {
    currentSecIndex.set(template.data.index);
    currentPartIndex.set(0);
    var lesson = getLesson();
    LessonsProgress.overlayOnLesson(lesson, lessonProgress);
    updateLessonProgressPartLastViewed(lessonProgress, template.data.index, 0, true);
  }
});

Template.lesson.events({  
  'click .prev'() {
    var index = currentSecIndex.get(); 
    currentSecIndex.set(index-1);
  },
  'click .continue'(evt, template) {
    var index = currentSecIndex.get();     
    var lesson = getLesson();
    LessonsProgress.overlayOnLesson(lesson, lessonProgress);
    var parts = lesson.sections[index].parts;
    var partIndex = currentPartIndex.get();
    if (partIndex < parts.length - 1) {
      const nextIndex = partIndex + 1;
      currentPartIndex.set(nextIndex);
      updateLessonProgressPartLastViewed(lessonProgress, index, nextIndex);
    }
    if (partIndex === parts.length -1) {
      currentSecIndex.set(index+1);
      currentPartIndex.set(0);
      updateLessonProgressPartLastViewed(lessonProgress, index+1, 0, true);
    }
    $(template.find('.continue')).attr('disabled', 'disabled');
  },  
});

Template.partNav.helpers({
  current() {
    var partIndex = currentPartIndex.get();
    return partIndex === this.index;
  },
  partIndex() {
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

Template.paragraph.rendered = function() {  
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
};

['paragraph', 'quickCheck', 'popquiz'].forEach(templateName => {
  Template[templateName].onRendered(() => {
    const lesson = getLesson();
    const resourcePath = `lesson/${lesson.lessonId}/${currentSecIndex.get()}/${currentPartIndex.get()}`;
    Presence.presenceUpdate(resourcePath, 'lesson');
  });
});

let questionClock = new ReactiveClock('questionClock');

let questionClockReset = () => {
  questionClock.setElapsedSeconds(0);
  questionClock.start();
};

let currentQuestionDep = new Tracker.Dependency();

Tracker.autorun(() => {
  currentQuestionDep.depend();
  questionClockReset();
});

Tracker.autorun(() => {
  let currentPart = currentPartIndex.get();
  isQuiz.set(false);
});

Template.question.rendered = function() {
  $('.choice').button();
  questionClockReset();
};

Template.question.helpers({
  current: function() {
    currentQuestionDep.depend();
    return this.current;
  },
  questionNumber: function() {
    return this.index + 1;
  },
  questionCount: function() {
    popquizDep.depend();
    if (popquiz.questions) return popquiz.questions.length;
    return 1;
  },
  prevDisabled: function() {
    answeredDep.depend();
    return this.index === 0 ? 'disabled' : '';
  },
  nextDisabled: function() {
    answeredDep.depend();
    return this.nextEnabled ? '' : 'disabled';
  }
});

let attemptLog = (index, attemptTime, correct) => ({
  index,
  attemptTime,
  correct
});

Template.question.events({
  'click .check': function(evt, template) {
    var val = $(template.find('.question .btn-group .btn[class*="active"] input')).val();
    let attemptTime = questionClock.elapsedTime();
    questionClockReset();
    if (val) {
      var index = parseInt(val);
      var correct = this.correctIndex == parseInt(index);
      var icon = correct ? 'fa fa-check' : 'fa fa-ban';
      var bg = correct ? 'seagreen' : 'indianred';
      $(template.find('.feedback')).html(`<div style='padding: 4px; color: white; background-color: ${bg}'><span class='${icon}'></span>&nbsp;` + this.choices[index].feedback + '</div>');
      $(template.find('.feedback')).hide();
      $(template.find('.feedback')).fadeIn('slow');
      this.correct = correct;
      this.attempts.push(attemptLog(index, attemptTime, correct));
      if (correct) this.nextEnabled = true;
      answeredDep.changed();
    }
  },
  'click .prevQuestion': function(evt, template) {
    let prev = popquiz.questions[this.index - 1];
    if (prev) {
      this.current = false;
      prev.current = true;
      currentQuestionDep.changed();
    }
  },
  'click .nextQuestion': function(evt, template) {
    let next = popquiz.questions[this.index + 1];
    if (next) {
      this.current = false;
      next.current = true;
    } else {
      popquiz.finished = true;
      this.current = false;
      popquizDep.changed();
    }
    currentQuestionDep.changed();
  }
});

Template.popquizChoiceReview.helpers({
  active: function() {
    return this.choice.value.correct ? 'active' : ''
  },
  correct: function() {
    return this.choice.value.correct ? 'greenChecked' : '';
  },
  attempt: function() {
    let attempts = popquiz.questions[this.question].attempts;
    let attemptIndex = 0;
    let theAttempt;
    let attemptNumber = 0;
    for(let attempt of attempts) {
      attemptIndex++;
      if (attempt.index === this.choice.index) {
        attemptNumber = attemptIndex;
        theAttempt = attempt;
        break;
      }
    }
    if (attemptNumber > 0) {
      let star = theAttempt.correct ? " <span class='fa fa-star'></span>" : '';
      return `<span class='badge' title='${theAttempt.attemptTime}'>${attemptNumber}${star}</span>`;
    }
    else return '';
  }
});

let popquizQuestionReviewTemplate = {};

Template.popquizQuestionReview.rendered = function() {
  let correctChoice;
  for(let choice of this.data.popquiz.choices) {
    if (choice.correct) correctChoice = choice;
  }
  const icon = 'fa fa-check';
  const bg = 'seagreen';
  $(this.view.templateInstance().find('.feedback-' + this.data.question)).html(`<div style='padding: 4px; color: white; background-color: ${bg}'><span class='${icon}'></span>&nbsp;` + correctChoice.feedback + '</div>');
  $(this.view.templateInstance().find('.feedback-' + this.data.question)).show();
};

Template.popquizChoiceReview.events({
  'click .choice': function() {
    const correct = this.choice.value.correct;
    const icon = correct ? 'fa fa-check' : 'fa fa-ban';
    const bg = correct ? 'seagreen' : 'indianred';
    $('.feedback-' + this.question).html(`<div style='padding: 4px; color: white; background-color: ${bg}'><span class='${icon}'></span>&nbsp;` + this.choice.value.feedback + '</div>');
    $('.feedback-' + this.question).hide();
    $('.feedback-' + this.question).fadeIn('slow');
  }
});