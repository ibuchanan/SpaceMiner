var messagesDep = new Deps.Dependency();
var messagesDepInterval;
var membersDep = new Deps.Dependency();
var membersDepInterval;

Template.intergalactiChat.created = function() {
  membersDepInterval = Meteor.setInterval(function() {
    membersDep.changed();
  }, 15000);
  messagesDepInterval = Meteor.setInterval(function() {
    messagesDep.changed();
  }, 30000);
};

Template.intergalactiChat.destroyed = function() {
  Meteor.clearInterval(membersDepInterval);
  Meteor.clearInterval(messagesDepInterval);
};

Template.intergalactiChat.helpers({
  messages: function(){
    messagesDep.depend();
    return Messages.find({}, { sort: { date: -1 }});
  },
  members: function() {
    membersDep.depend();
    return Presence.presenceFromMinutes(5);
  }
});

Template.intergalactiChat_message.helpers({
  dateStamp: function() {
    return moment(this.date).fromNow();
  }
});