Template.profile.helpers({
  nickname: function() {
    return userName();
  },
  levels: function() {
    return Router.current().data();        
  },
  mostRecentLesson : function() {
    return LessonsProgress.mostRecentLesson().title;
  },
  mostRecentLessonLink : function(){
  return LessonsProgress.mostRecentLessonLink();
  }

});