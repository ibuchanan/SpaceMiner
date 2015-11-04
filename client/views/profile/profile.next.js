let followingUpdated = new Tracker.Dependency();

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
  },
  following: function() {
    followingUpdated.depend();
    return Followers.following(Template.instance().data.userId);
  }
});

Template.profile.events({
  'click .follow': function() {
    Followers.follow(Template.instance().data.userId);
    followingUpdated.changed();
  },
  'click .unfollow': function() {
    Followers.unfollow(Template.instance().data.userId);
    followingUpdated.changed();
  }
});