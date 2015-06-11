var membersDep = new Deps.Dependency();
var membersDepInterval;

Template.missionCommand.rendered = function() {
  membersDepInterval = Meteor.setInterval(function() {
    membersDep.changed();
  }, 15000);
};

Template.missionCommand.destroyed = function() {
  Meteor.clearInterval(membersDepInterval);
};

Template.missionCommand.helpers({
  messages: function(){
    return Messages.find({}, { sort: { date: -1 }});
  },
  members: function() {
    membersDep.depend();
    return Presence.presenceFromMinutes(5);
  }
});