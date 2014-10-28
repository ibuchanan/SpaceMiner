Template.dash.helpers({
  stepFeedback: ()=> { 
    var all = StepFeedback.find().fetch();
    var byStep = _.groupBy(all, 'lessonStepName');
    _.each(byStep, (observations, stepName) => {
      var counts = _.countBy(observations, 'sense');
      var keyName = (key) => {
        var map = {
          'not': 'Not exactly',
          'yes': 'Got it',
          'almost': 'Almost there'
        };
        return map[key];
      };
      counts = _.map(counts, (value, key)=> {return {key : keyName(key), value}});
      byStep[stepName] = counts;
    });
    return _.map(byStep, (value, key)=> {return {key, value}});
  }
});