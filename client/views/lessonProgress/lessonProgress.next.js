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
var lessonId;
var lessonDep = new Deps.Dependency;

Template.lessonProgress.created = function() {
  var data = Router.current().data();
  lesson = data[0];
  lessonId = lesson._id;
  console.log(lesson);
  var lessonProgress = data[1];
  LessonsProgress.overlayOnLesson(lesson, lessonProgress);
  console.log(lesson);

  lessonDep.changed();
};

Template.lessonProgress.helpers({
  lesson: function() {
    lessonDep.depend();
    return lesson;
  },
  description: function() {
    lessonDep.depend();
    // TODO: fix hack
    return lesson.description || '';
  }
});

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
  },
  lessonSecLink: function() {
    lessonDep.depend();
    console.log(lesson._id);
    return '/lesson?id=' + lessonId + '&sec=' + (this.index + 1);
  }
});

Template.lessonProgress_part.helpers({
  index: function() {
    return this.index + 1;
  },
  lastViewed: function() {
    return 'seen ' + moment(this.lastViewed).fromNow();
  },
  lessonSecStepLink: function() {
    lessonDep.depend();
    return '/lesson?id=' + lessonId + '&sec=' + (Template.parentData().index + 1) +
     '&part=' + (this.index + 1);
  }
});