var lesson;
var lessonDep = new Deps.Dependency;

Template.lesson.rendered = function() {
  var id = Router.current().params._id;      
  Lessons.update({_id: id}, {$set: {lastViewed: new Date()}}, function(err, count) {
    lesson = Router.current().data();
    lessonDep.changed();
  });
}

function getLesson() {
  lessonDep.depend();
  return lesson;
}

var answeredDep = new Deps.Dependency;

Template.lesson.helpers({
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
  }
});

Template.lesson.events({
  /* TODO still use this?
  'click .challengeShow': function() {
    $('.lesson').hide();
    $('.challenge').show();
  }
  */
});

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

