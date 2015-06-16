var progDep = new Deps.Dependency();

Template.profile.created = function() {
  this.data = Router.current().data();
};

Template.profile.helpers({
  nickName: function() {
    return Template.instance().data.user.profile.nickName;
  },
  ownerName: function() {
    if (Template.instance().data.isNotSelf) return Template.instance().data.user.profile.nickName;
    return 'you';
  },
  levels: function() {
    return Template.instance().data.levels;
  },
  mostRecentLesson : function() {
    return LessonsProgress.mostRecentLesson().title;
  },
  mostRecentLessonLink : function(){
    return LessonsProgress.mostRecentLessonLink();
  },
  dynamos: function() {
    return Template.instance().data.dynamos;
  },
  userId: function() {
    return Template.instance().data.userId;
  }
});