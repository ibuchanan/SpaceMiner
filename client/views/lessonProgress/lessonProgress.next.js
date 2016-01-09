const lastSeenText = date => {
  const dateText = moment(date).fromNow();
  if (dateText === 'Invalid date') return 'never seen';
  return `seen ${dateText}`;
};

const indicatorMap = {
  'yes': {
    icon: 'fa-smile-o',
    klass: 'label label-success'
  },
  'almost': {
    icon: 'fa-meh-o',
    klass: 'label label-warning'
  },
  'not': {
    icon: 'fa-frown-o',
    klass: 'label label-danger'
  }
};

let lesson;
let lessonId;
let lessonDep = new Deps.Dependency();
let lessonSelfAssessments;

const countPercentages = counts => {
  const keys = Object.keys(counts);
  let total = 0;
  for(let key of keys) total += counts[key];
  for(let key of keys) {
    counts[`${key}count`] = counts[key];
    if (total > 0) counts[key] = parseInt((counts[key] / total) * 100);
    else counts[key] = '&nbsp;-&nbsp;';
    if (counts[key] === 0) counts[key] = 0;
    const numVal = String(counts[key]);
    if (numVal.length < 3) counts[key] = numVal.length === 2 ? `&nbsp;${counts[key]}%` : `&nbsp;&nbsp;${counts[key]}%`;
    else counts[key] = `${counts[key]}%`;
  }
  return counts;
};

const findSelfAssessments = lessonId => {
  const all = SelfAssessments.findByResourcePath(`lesson/${lessonId}`).fetch();
  const byStep = _.groupBy(all, item => {
    const [lessonRoute, lessonId, secId, partId] = item.resourcePath.split('/');
    return `${secId}/${partId}`;
  });
  _.each(byStep, (items, path) => {
    const byUser = _.groupBy(items, 'userId');
    _.each(byUser, (items, userId) => byUser[userId] = items.reverse()[0]);
    let counts = _.countBy(byUser, 'sense');
    byStep[path] = counts;
  });
  return byStep;
};

const findPresentUsers = (lessonId, secIndex, partIndex) => {
  const users = Presence.presenceFromMinutes(5, `lesson/${lessonId}/${secIndex}/${partIndex}`);
  return users;
};

Template.lessonProgress.onCreated(() => {
  const _lessonId = Router.current().params.lessonId;
  lesson = Lessons.findOne({_id: _lessonId});
  if (!lesson) return;
  let lessonProgress = LessonsProgress.findOne({
    userId: Meteor.userId(),
    lessonId: _lessonId
  });
  lessonId = lesson._id;
  LessonsProgress.overlayOnLesson(lesson, lessonProgress);
  lessonDep.changed();
});

Template.lessonProgress.helpers({
  lesson() {
    lessonDep.depend();
    if (lesson) return lesson;
    return {};
  },
  description() {
    lessonDep.depend();
    if (!lesson) return '';
    return lesson.description || '';
  }
});

Template.lessonProgress_section.helpers({
  lesson() {
    lessonDep.depend();
    return lesson;
  },
  lastViewed() {
    return lastSeenText(this.lastViewed);
  },
  mostRecent() {
    lessonDep.depend();
    if (!lesson) return false;
    return lesson.sections.status.lastIndex === this.index;
  },
  lessonSecLink() {
    lessonDep.depend();
    return '/lesson?id=' + lessonId + '&sec=' + (this.index + 1);
  }
});

Template.lessonProgress_part.helpers({
  index() {
    return this.index + 1;
  },
  lastViewed() {
    return lastSeenText(this.lastViewed);
  },
  lessonSecStepLink() {
    lessonDep.depend();
    return Lessons.secStepLink(lessonId, (Template.parentData().index + 1), (this.index + 1));
  },
  seenStatusLabel() {
    const seenText = lastSeenText(this.lastViewed);
    return seenText === 'never seen' ? 'danger' : 'success';
  },
  seenStatusColor() {
    const seenText = lastSeenText(this.lastViewed);
    return seenText === 'never seen' ? 'primary' : 'success';
  },
  seenStatusStar() {
    const seenText = lastSeenText(this.lastViewed);
    return seenText === 'never seen' ? 'fa-star-o' : 'fa-star';
  },
  selfAssessments() {
    const _lessonId = Router.current().params.lessonId;
    lessonSelfAssessments = findSelfAssessments(_lessonId);
    if (!lessonSelfAssessments) return [];
    let items = lessonSelfAssessments[`${Template.parentData().index}/${this.index}`];
    if (items === undefined) items = {};
    if (!items.yes) items.yes = 0;
    if (!items.almost) items.almost = 0;
    if (!items.not) items.not = 0;
    items = countPercentages(items);

    const sortedItems = {
      yes: { percent: items.yes, count: items.yescount },
      almost: { percent: items.almost, count: items.almostcount },
      not: { percent: items.not, count: items.notcount }
    };
    items = _.map(sortedItems, (value, key) => ({key, value}));
    return items;
  },
  presentUsers() {
    const _lessonId = Router.current().params.lessonId;
    const users = findPresentUsers(_lessonId, Template.parentData().index, this.index);
    return users;
  },
  options() {
    return { resourcePath: Lessons.resourcePath(Router.current().params.lessonId, Template.parentData().index, this.index) };
  }
});

Template.lessonProgress_part_assessments.helpers({
  klass(key) {
    return indicatorMap[key].klass;
  },
  icon(key) {
    return indicatorMap[key].icon;
  }
});