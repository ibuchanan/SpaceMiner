LessonsProgress = new Meteor.Collection('lessonsProgress');

LessonsProgress.findOneForUser = function(lesson, userId) {
  var lessonProgress = LessonsProgress.findOne({
    userId: userId,
    lessonId: lesson._id
  });
  if (lessonProgress === undefined) {
    lessonProgress = LessonsProgress.new(lesson, userId);
    LessonsProgress.insert(lessonProgress);
  }
  return lessonProgress;
};

LessonsProgress.new = function(lesson, userId) {
  var lessonProgress = {
    lessonId: lesson._id,
    userId: userId,
    lastViewed: new Date(),
    lastCompleted: null,
    sections: {
      started: true,
      completed: false,
      lastIndex: 0,
      items: []
    }
  };

  _.each(lesson.sections, function(section, index) {
    var secProgress = {
      index: index,
      lastViewed: index === 0 ? new Date() : null,
      lastCompleted: null,
      parts: {
        lastIndex: 0,
        items: []
      }
    };

    _.each(section.parts, function(part, partIndex) {
      var partProgress = {
        index: partIndex,
        lastViewed: partIndex === 0 ? new Date() : null,
        completed: null,
        data: null
      }
      secProgress.parts.items[partIndex] = partProgress;
    });

    lessonProgress.sections.items[index] = secProgress;
  });

  return lessonProgress;
};

LessonsProgress.overlayOnLesson = function(lesson, lessonProgress) {
  try {
    console.log('lesson:');
    console.log(lesson);
    console.log('lessonProgress');
    console.log(lessonProgress);
  _.extend(lesson, _.omit(lessonProgress, 'sections'));
  // TODO: update last viewed
  lesson.sections.status = _.omit(lessonProgress.sections, 'items');
  _.each(lesson.sections, function(section, index) {
    var secProgress = lessonProgress.sections.items[index];
    section.parts.status = _.omit(secProgress.parts, 'items');
    _.extend(section, _.omit(secProgress, 'parts'));
    _.each(section.parts, function(part, partIndex) {
      var partProgress = secProgress.parts.items[partIndex];
      _.extend(part, partProgress);
    });
  });
  } catch (ex) {
    console.log("Exception in overlayOnLesson:");
    console.log(ex);
  }
};