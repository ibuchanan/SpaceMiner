Presence = new Meteor.Collection('presence');

Presence.presenceUpdate = function(location, extraData) {
  if (Meteor.userId()) {
    location = location || 'app';
    extraData = extraData || null;
    Presence.upsert(
      Meteor.userId(),
      {
        $set: {
          location: location,
          userName: userName(),
          date: new Date(),
          data: extraData
        }
      }
    );
  }
};

Presence.presenceFromMinutes = function(minutesAgo, location) {
  minutesAgo = minutesAgo || 5;
  location = location || 'app';
  var dateOffset = minutesAgo * 1000 * 60;
  var nowMinusOffset = new Date() - dateOffset;
  var all = Presence.find({date: {$gte: new Date(nowMinusOffset) }}).fetch();
  var grouped = _.groupBy(all, 'userName');
  // TODO: might want to return more data than just names at some point...
  return _.keys(grouped);
};