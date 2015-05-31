var bsBackgrounds = [
  'primary', 'success', 'info', 'warning', 'danger'
];

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

var indicatorMap = {
  'Not exactly': {
    icon: 'fa-frown-o',
    klass: 'label label-danger'
  },
  'Got it': {
    icon: 'fa-smile-o',
    klass: 'label label-success'
  },
  'Almost there': {
    icon: 'fa-meh-o',
    klass: 'label label-warning'
  }
};

var lesson;
var lessonDep = new Deps.Dependency;

Template.lessonProgress.created = function() {
  lesson = Lessons.findOne({_id: Router.current().params.lessonId});
  console.log('Id:' + Router.current().params.lessonId);
  console.log("Lesson:" + lesson);
  var lessonProgress = LessonsProgress.findOne({
    userId: Meteor.userId(),
    lessonId: Router.current().params.lessonId
  });
  LessonsProgress.overlayOnLesson(lesson, lessonProgress);

  lessonDep.changed();
};

Template.lessonProgress_section.helpers({
  lesson: function() {
    lessonDep.depend();
    return lesson;
  },
  lastViewed: function() {
    return 'seen ' + moment(this.lastViewed).fromNow();
  },
  mostRecent: function() {
    lessonDep.depend();
    if (!lesson) return false;
    return lesson.sections.status.lastIndex === this.index;
  }
});

Template.lessonProgress_part.helpers({
  index: function() {
    return this.index + 1;
  },
  lastViewed: function() {
    return 'seen ' + moment(this.lastViewed).fromNow();
  }
});