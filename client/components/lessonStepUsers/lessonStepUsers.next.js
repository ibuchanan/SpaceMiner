const options = {sort: {date: -1, limit: 5}};

const getResourcePath = (lessonId, secIndex, partIndex) => `lesson/${lessonId}/${secIndex}/${partIndex}`;

const removeSelf = users => users.filter(u => u.userId !== Meteor.userId());

const findPresentUsers = (lessonId, secIndex, partIndex) => Presence.presenceFromMinutes(5, getResourcePath(lessonId, secIndex, partIndex));

const findAssessments = (lessonId, secIndex, partIndex, criteria) => SelfAssessments.findByResourcePath(getResourcePath(lessonId, secIndex, partIndex), criteria, options);

const findHelpOffers = users => users.filter(u => u.userId === Meteor.userId() && u.helpOfferredByUserId !== null);

const addHelpRequestInfo = users => {
	users.forEach(user => {
		const assessment = SelfAssessments.findByUserIdAndResourcePath(user.userId, user.resourcePath);
		if (assessment) {
			user.sense = assessment.sense;
    	user.helpRequested = assessment.helpRequested;
    	user.helpMadeAvailable = assessment.helpMadeAvailable;
    	user.helpOfferredByUserId = assessment.helpOfferredByUserId;
    	user.helpOfferredByUserName = assessment.helpOfferredByUserName;
    	user.helpGivenEvaluation = assessment.helpGivenEvaluation;			
		}
	});
};

const findRequestForMe = helpeeUserId => {
	const item = SelfAssessments.findOne({
		userId: Meteor.userId(),
		helpRequestedByUserId: helpeeUserId
	});
	return item;
};

const pending = item => item.helpOfferredByUserId !== null && item.helpOfferredByUserId !== Meteor.userId();
const pendingMyHelp = item => item.helpOfferredByUserId === Meteor.userId();
const wantsMyHelp = item => findRequestForMe(item.userId) !== undefined && item.helpOfferredByUserId !== Meteor.userId();
const helpAcceptedByMe = item => item.helpOfferredToMe === true && item.helpRequestedByUserId === Meteor.userId();
const iAmWillingToHelp = item => SelfAssessments.findOne({resourcePath:item.resourcePath, userId:Meteor.userId(), sense:'yes', helpMadeAvailable:true}) !== undefined;
const iAmWillingToBeHelped = item => SelfAssessments.findOne({resourcePath:item.resourcePath, userId:Meteor.userId(), helpRequested: true}) !== undefined;

Template.lessonStepUsers.helpers({
	users() {
		const {lessonId, secIndex, partIndex} = Template.instance().data;
		const users = removeSelf(findPresentUsers(lessonId, secIndex, partIndex));
		addHelpRequestInfo(users);
		return users;
	},
	helpeeUsers() {
		const {lessonId, secIndex, partIndex} = Template.instance().data;
		const helpeeUsers = removeSelf(findAssessments(lessonId, secIndex, partIndex, {helpRequested:true, helpGivenEvaluationDate:null}).fetch());
		return helpeeUsers;
	},	
	helperUsers() {
		const {lessonId, secIndex, partIndex} = Template.instance().data;
		const assessments = findAssessments(lessonId, secIndex, partIndex).fetch();
		const helpOffers = findHelpOffers(assessments);
		const helperUsers = removeSelf(assessments).filter(u => u.helpMadeAvailable === true);
		for(let helpOffer of helpOffers) {
			for (let helperUser of helperUsers) {
				if (helperUser.userId === helpOffer.helpOfferredByUserId) {
					helperUser.helpOfferredToMe = true;
				}
			}
		}
		return helperUsers;
	},
	helpeeClass() {
		const needsMyHelp = findRequestForMe(this.userId) !== undefined;
		if (this.helpOfferredByUserId === Meteor.userId() && needsMyHelp) {
			this.helpRequestedFromMe = true;
			return 'lesson-step-users-helpees-from-me confirmed';
		}
		if (this.helpOfferredByUserId === Meteor.userId()) return 'lesson-step-users-helpees-from-me offerred';
		if (needsMyHelp) {
			this.helpRequestedFromMe = true;
			return 'lesson-step-users-helpees-from-me requested'			
		}
		return '';
	},
	pending() {
		return pending(this);
	},
	pendingMyHelp() {
		return pendingMyHelp(this);
	},
	wantsMyHelp() {
		return wantsMyHelp(this);
	},
	canOfferHelp() {
		return !pending(this) && !pendingMyHelp(this) && !wantsMyHelp(this) && iAmWillingToHelp(this);
	},
	helperClass() {
		if (helpAcceptedByMe(this)) return 'lesson-step-users-helpers-for-me confirmed';
		if (this.helpOfferredToMe === true) return 'lesson-step-users-helpers-for-me offerred';
		if (this.helpRequestedByUserId === Meteor.userId()) return 'lesson-step-users-helpers-for-me requested';
		return '';
	},
	helpOfferredToMe() {
		return this.helpOfferredToMe === true && this.helpRequestedByUserId !== Meteor.userId();
	},
	helpAcceptedByMe() {
		return helpAcceptedByMe(this);
	},
	someoneElseWantsHelp() {
		return this.helpRequestedByUserId !== null && this.helpRequestedByUserId !== Meteor.userId();
	},
	requestHelpVisible() {
		return this.helpRequestedByUserId === null && this.helpOfferredToMe !== true && iAmWillingToBeHelped(this);
	},
	requestHelpCancelVisible() {
		return this.helpRequestedByUserId === Meteor.userId() && this.helpOfferredToMe !== true;
	}
});

Template.lessonStepUsers.events({
	'click .help-offer'() {
		SelfAssessments.helpOffer(this.resourcePath, this.userId);
	},
	'click .help-request'() {
		SelfAssessments.helpRequestFromUser(this.resourcePath, this.userId);
	},
	'click .help-request-cancel'() {
		SelfAssessments.helpRequestFromUserCancel(this.resourcePath, this.userId);
	},
	'click .help-offer-decline'() {
		SelfAssessments.helpRequestFromUserCancel(this.resourcePath, this.userId);
	},
	'click .help-offer-accept'() {
		SelfAssessments.helpOfferAccept(this.resourcePath, this.userId);
	},	
	'click .help-request-accept'() {
		SelfAssessments.helpRequestFromUserAccept(this.resourcePath, this.userId);
	},
	'click .help-request-decline'() {
		SelfAssessments.helpRequestFromUserDecline(this.resourcePath, this.userId);
	},
	'click .help-offer-cancel'() {
		SelfAssessments.helpOfferCancel(this.resourcePath, this.userId);
	},
	'click .help-request-understand'() {
		UserFeedback.create(this.userId, this.userName, 'understand');
		SelfAssessments.helpRequestFromUserCancel(this.resourcePath, this.userId);		
	},
	'click .help-request-eyeball'() {
		UserFeedback.create(this.userId, this.userName, 'eyeball');
		SelfAssessments.helpRequestFromUserCancel(this.resourcePath, this.userId);		
	},
	'click .help-request-didit'() {
		UserFeedback.create(this.userId, this.userName, 'didit');
		SelfAssessments.helpRequestFromUserCancel(this.resourcePath, this.userId);		
	},
	'click .help-request-tried'() {
		UserFeedback.create(this.userId, this.userName, 'tried');
		SelfAssessments.helpRequestFromUserCancel(this.resourcePath, this.userId);		
	}
});