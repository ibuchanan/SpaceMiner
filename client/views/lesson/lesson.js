function getLesson() {
  return Lessons.findOne({name:'variables'});
}

Template.steps.helpers({
  lesson: getLesson
});

Template.steps.events({
  'click .next': function(event, template) {
    var lesson = getLesson();
    lesson.steps[this.index].current = false;
    lesson.steps[this.index+1].current = true;
    var id = lesson._id;
    delete lesson._id;
    Lessons._collection.update({_id: id}, {$set: lesson});
  }
});