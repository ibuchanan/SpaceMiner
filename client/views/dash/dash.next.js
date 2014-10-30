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

Template.dash.helpers({
  klass: (key)=> {
    return indicatorMap[key].klass;
  },
  icon: (key)=> {
    return indicatorMap[key].icon;
  },
  stepFeedback: ()=> { 
    var all = StepFeedback.find().fetch();
    var byStep = _.groupBy(all, 'lessonStepTitle');
    _.each(byStep, (observations, stepTitle) => {
      var byUser = _.groupBy(observations, 'userId');
      _.each(byUser, (observations, userId) => {
        var sorted = _.sortBy(observations, (obs) => {
          return obs.date;
        });
        sorted = sorted.reverse();
        byUser[userId] = sorted[0];
      });  
      var counts = _.countBy(byUser, 'sense');
      var keyName = (key) => {
        var map = {
          'not': 'Not exactly',
          'yes': 'Got it',
          'almost': 'Almost there'
        };
        return map[key];
      };
      counts = _.map(counts, (value, key)=> {return {key : keyName(key), value}});
      byStep[stepTitle] = counts;
    });
    return _.map(byStep, (value, key)=> {return {key, value}});
  }
});