Template.lesson.rendered = function() {
  var id = Router.current().params._id;      
  Lessons.update({_id: id}, {$set: {lastViewed: new Date()}}, function(err, count) {
    var lesson = Router.current().data();
    setLesson(lesson);
  });
}

function getLesson() {
  return Session.get('lesson');
}

function setLesson(lesson) {
  Session.set('lesson', lesson);
}

Template.lesson.helpers({
  lesson: getLesson
});

Template.lesson.events({
  'click .challengeShow': function() {
    $('.lesson').hide();
    $('.challenge').show();
  }
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
    }
  }
});

