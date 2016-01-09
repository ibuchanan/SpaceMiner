let followingUpdated = new Tracker.Dependency();

const feedbackMap = {
  understand: { description: 'Helped me understand',  icon: 'lightbulb-o' },
  eyeball:    { description: 'Spotted an error',      icon: 'eye' },
  tried:      { description: 'Tried their best',      icon: 'thumbs-up' },
  didit:      { description: 'Did it for me',         icon: 'laptop' }
};

Template.profile.helpers({
  nickName() {
    return Template.instance().data.user.profile.nickName;
  },
  ownerName() {
    if (Template.instance().data.isNotSelf) return Template.instance().data.user.profile.nickName;
    return 'you';
  },
  levels() {
    return Template.instance().data.levels;
  },
  mostRecentLesson() {
    return LessonsProgress.mostRecentLesson().title;
  },
  mostRecentLessonLink(){
    return LessonsProgress.mostRecentLessonLink();
  },
  dynamos() {
    return Template.instance().data.dynamos;
  },
  userId() {
    return Template.instance().data.userId;
  },
  following() {
    followingUpdated.depend();
    return Followers.following(Template.instance().data.userId);
  },
  feedback() {
    const userFeedback = UserFeedback.findByUserId(Template.instance().data.userId).fetch().map(f => {
      f.description = feedbackMap[f.data].description;
      f.icon = feedbackMap[f.data].icon;
      return f;
    });
    const totalCredit = userFeedback.reduce((currentVal, feedback) => currentVal + feedback.credit, 0);
    return {
      totalCredit,
      userFeedback
    };
  },
  link() {
    let [lessonRoute, lessonId, secIndex, partIndex] = this.resourcePath.split('/');
    secIndex = parseInt(secIndex);
    partIndex = parseInt(partIndex);
    return Lessons.secStepLink(lessonId, secIndex, partIndex);
  },
  options() {
    const userId = Template.instance().data.userId;
    return { filterToUserId: userId, showLinks: true, displayMode: 'vertical' };
  }
});

Template.profile.events({
  'click .follow'() {
    Followers.follow(Template.instance().data.userId);
    followingUpdated.changed();
  },
  'click .unfollow'() {
    Followers.unfollow(Template.instance().data.userId);
    followingUpdated.changed();
  }
});