UserFeedback = new Meteor.Collection('userFeedback');

UserFeedback.create = function(feedbackOnUserId, feedbackOnUserName, data, feedbackFromUserId, feedbackFromUserName) {
	feedbackFromUserId = feedbackFromUserId || Meteor.userId();
	feedbackFromUserName = feedbackFromUserName || userName();
	
	var creditMap = {
		understand: 200,
		eyeball: 65,
		tried: 40,
		didit: 10
	};
	
	UserFeedback.insert({
		feedbackFromUserId: feedbackFromUserId,
		feedbackFromUserName: feedbackFromUserName,
		feedbackOnUserId: feedbackOnUserId,
		feedbackOnUserName: feedbackOnUserName,
		data: data,
		credit: creditMap[data],
		date: new Date()
	});
};