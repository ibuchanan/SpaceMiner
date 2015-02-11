var bsBackgrounds = [
  'primary', 'success', 'info', 'warning', 'danger'
];

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

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
    
    /*
    var userGroups = _.groupBy(events, (item)=> { return item.userName; });   
    // reduce by date
    var mostRecents = _.map(userGroups, (item)=> { return item[0]; });
    // group by mission id   
    var missionGroups = _.groupBy(mostRecents, (item)=> { return item.missionId; });
    _.each(missionGroups, (events, missionId)=> {
      var byStepIndex = _.groupBy(events, (event)=> { return event.stepIndex; } );
      missionGroups[missionId] = byStepIndex;
    });
    return _.pairs(missionGroups);
    */
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
  }
});