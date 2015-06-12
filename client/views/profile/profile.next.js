Template.profile.helpers({
  nickname: function(){
    return Meteor.user().profile.nickName;
  },
  levels: function() {
    return Router.current().data();        
  },
  mostRecentLesson : function(){
    return Template.lessonProgress.mostRecent();
  }
  
});