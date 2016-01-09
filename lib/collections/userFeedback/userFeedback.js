UserFeedback = new Meteor.Collection('userFeedback');

UserFeedback.create = function(resourcePath, feedbackOnUserId, feedbackOnUserName, data, feedbackFromUserId, feedbackFromUserName) {
	resourcePath = resourcePath || 'app';
	feedbackFromUserId = feedbackFromUserId || Meteor.userId();
	feedbackFromUserName = feedbackFromUserName || userName();
	
	var creditMap = {
		understand: 200,
		eyeball: 65,
		tried: 40,
		didit: 10
	};
	
	UserFeedback.insert({
		resourcePath: resourcePath,
		feedbackFromUserId: feedbackFromUserId,
		feedbackFromUserName: feedbackFromUserName,
		feedbackOnUserId: feedbackOnUserId,
		feedbackOnUserName: feedbackOnUserName,
		data: data,
		credit: creditMap[data],
		date: new Date()
	});
};

var options = {sort: {date: -1, limit: 25}};

UserFeedback.findByUserId = function(userId) {
	return UserFeedback.find({feedbackOnUserId: userId}, options);
};