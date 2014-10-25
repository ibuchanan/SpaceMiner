Template.lesson.events({
  'click .challengeShow': function() {
    $('.lesson').hide();
    $('.challenge').show();
  }
});

function getLesson() {
  return Lessons.findOne({name:'variables'});
}

Template.steps.helpers({
  lesson: getLesson,
  previousAllowed: function() {
    return this.index > 0;
  },
  nextAllowed: function() {
    return this.attempted && this.index < getLesson().steps.length - 1;
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
}

Template.steps.events({
  'click .explanationShow': function() {
    $('.explanation').show();
  },
  'click .previous': function() {
    lessonNavigate(this.index, this.index - 1, false);
  },
  'click .next': function() {
    lessonNavigate(this.index, this.index + 1, true);
  }
});