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

Template.missionControl.helpers({
  randomBackgroundColor: function() {
    return randomElement(bsBackgrounds);
  },  
  currentViewers : function() {
    // find all the events from the last 60 minutes
    var now = new Date();
    var hourago = new Date(now.getTime() - (1000*60*60));
    var events = MissionStepViews.find({ 
      missionId: Router.current().params.missionId,
      date: { $gt: hourago } 
    }, { sort: { date: -1 } }).fetch();
    var groupedEvents = 
    _.chain(events)
    .groupBy((event)=> { return event.userName; })
    .map((userGroup)=> { return userGroup[0]; })
    .groupBy((mostRecentUserEvent)=> { return mostRecentUserEvent.missionId; })
    .value();
    
    _.each(groupedEvents, (events, missionId)=> { 
      groupedEvents[missionId] = _.groupBy(events, (event) => { return event.stepIndex + 1; } );
    });
    
    var result = _.pairs(groupedEvents[Router.current().params.missionId]);        
    return result;    
  },
  missionProjectTitle: function() {
    return trainingMission.project;
  },
  missionStepIndex: function() {
    return this[0];
  },
  missionStepTitle: function() {
    return trainingMission.steps[parseInt(this[0])].title;
  },
  missionStepViewers: function() {
    return this[1];
  },
  klass: (key)=> {
    return indicatorMap[key].klass;
  },
  icon: (key)=> {
    return indicatorMap[key].icon;
  },
  stepAssessments: ()=> { 
    var all = MissionStepSelfAssessments.find().fetch();
    var byStep = _.groupBy(all, 'stepTitle');
    _.each(byStep, (observations, stepTitle) => {
      var byUser = _.groupBy(observations, 'userId');
      _.each(byUser, (observations, userId) => {
        var sorted = _.sortBy(observations, (obs) => {
          return obs.stepTitle;
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
    return _.map(byStep, (value, key)=> {
      console.log(value);
      console.log(key);
      return {key, value}});
  }  
});