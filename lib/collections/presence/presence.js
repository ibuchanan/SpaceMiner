Presence = new Meteor.Collection('presence');

Presence.presenceUpdate = function(resourcePath, category, extraData) {
  if (Meteor.userId()) {
    resourcePath = resourcePath || 'app';
    category = category || null;
    extraData = extraData || null;
    var id = Meteor.userId();
    if (category !== null) id = category + '-' + id;
    Presence.upsert(
      id,
      {
        $set: {
          resourcePath: resourcePath,
          userName: userName(),
          userId: Meteor.userId(),
          date: new Date(),
          data: extraData
        }
      }
    );
  }
};

Presence.presenceFromMinutes = function(minutesAgo, resourcePath) {
  minutesAgo = minutesAgo || 5;
  resourcePath = resourcePath || 'app';
  var dateOffset = minutesAgo * 1000 * 60;
  var nowMinusOffset = new Date() - dateOffset;
  var all = Presence.find({date: {$gte: new Date(nowMinusOffset) }, resourcePath: { $regex: resourcePath}}).fetch();
  return all;
  //var grouped = _.groupBy(all, 'userId');
  //return grouped;
};