UserDynamos = new Meteor.Collection('userDynamos');

function ensureProps(dynamo) {
  if (!_.has(dynamo, 'js')) dynamo.js = '';
}
UserDynamos.findOneForUser = function(dynamo, userId, createIfNone) {
  if (!userId) userId = Meteor.userId();
  var userDynamo = UserDynamos.findOne({
    userId: userId,
    name: dynamo.name
  });
  if (userDynamo === undefined && createIfNone) {
    userDynamo = UserDynamos.new(dynamo, userId);
    var id = UserDynamos.insert(userDynamo);
    userDynamo._id = id;
    return userDynamo;
  }
  if (userDynamo) ensureProps(dynamo);
  return userDynamo ? userDynamo : null;
};

UserDynamos.new = function(dynamo, userId) {
  var userDynamo = {
    name: dynamo.name,
    userId: userId,
    created: new Date(),
    lastSaved: new Date(),
    version: 1,
    template: dynamo.template || '',
    style: dynamo.style || '',
    js: dynamo.js || '',
    data: dynamo.data || ''
  };

  return userDynamo;
};

UserDynamos.updateUserDynamo = function(userDynamo) {
  userDynamo.lastSaved = new Date();
  var obj = _.omit(userDynamo, '_id', 'version');
  UserDynamos.update(userDynamo._id,
    {
      $set: obj,
      $inc: {'version': 1}
    },
    {
      removeEmptyStrings: false
    }
  );
};