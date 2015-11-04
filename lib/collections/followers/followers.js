Followers = new Meteor.Collection('followers');

Followers.follow = function(followedId, followerId) {
  followerId = followerId || Meteor.userId();
  Followers.upsert(
    followerId + '_' + followedId,
    {
      $set: {
        active: true,
        date: new Date(),
        followerId: followerId,
        followedId: followedId
      }
    }
  );
};

Followers.unfollow = function(followedId, followerId) {
  followerId = followerId || Meteor.userId();
  Followers.upsert(
    followerId + '_' + followedId,
    {
      $set: {
        active: false,
        date: new Date(),
        followerId: followerId,
        followedId: followedId
      }
    }
  );
};

Followers.findFollowers = function(userId) {
    userId = userId || Meteor.userId();
    return Followers.find({followedId:userId});
};

Followers.following = function(followedId, followerId) {
    followerId = followerId || Meteor.userId();
    var followingRecord = Followers.findOne(followerId + '_' + followedId);
    return followingRecord !== undefined && followingRecord.active === true;
};