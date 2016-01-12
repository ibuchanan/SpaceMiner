const options = {sort: {date: -1}, limit: 20};

const removeSelf = users => users.filter(u => u.userId !== Meteor.userId());

Template.helpRequests.helpers({
	help() {
		const helpRequests = 
			SelfAssessments.find({userId:Meteor.userId(), helpMadeAvailable: true, helpRequestedByUserId: {$ne: null}}).fetch();
		console.log('helpRequests:', helpRequests);

		const helpOffersByMe = 
			SelfAssessments.find({userId: {$ne: Meteor.userId()}, helpRequested: true, helpOfferredByUserId: Meteor.userId()}).fetch();
		console.log('helpOffersByMe:', helpOffersByMe);

		const helpOffersToMe = 
			SelfAssessments.find({userId: Meteor.userId(), helpRequested: true, helpOfferredByUserId: {$ne: Meteor.userId()} }).fetch();
		console.log('helpOffersToMe:', helpOffersToMe);

		const helpers =
			SelfAssessments.find({userId: {$ne: Meteor.userId()}, helpMadeAvailable: true, helpRequestedByUserId: Meteor.userId()}).fetch();
		console.log('helpers:', helpers);

		const all = helpRequests.concat(helpers).concat(helpOffersByMe).concat(helpOffersToMe);
		console.log('all:', all);

		return all;
	}
});