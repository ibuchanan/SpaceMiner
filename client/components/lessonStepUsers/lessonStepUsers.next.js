const findOptions = {sort: {date: -1}}; // OLD: , limit: 5}};

const removeSelf = users => users.filter(u => u.userId !== Meteor.userId());

const findPresentUsers = resourcePath => Presence.presenceFromMinutes(5, resourcePath);

const findAssessments = (options, criteria) => SelfAssessments.findByResourcePath(options.resourcePath, criteria, findOptions).fetch();

const findHelpOffers = users => users.filter(u => u.userId === Meteor.userId() && u.helpOfferredByUserId !== null);

const findRequestForMe = (helpeeUserId, helperId=Meteor.userId()) => {
	const item = SelfAssessments.findOne({
		userId: helperId,
		helpRequestedByUserId: helpeeUserId
	});
	return item;
};

const findRequestForMeByResourcePath = (helpeeUserId, resourcePath, helperId=Meteor.userId()) => {
	const item = SelfAssessments.findOne({
		userId: helperId,
		helpRequestedByUserId: helpeeUserId,
		resourcePath
	});
	return item;
};

const filterAssessmentsByUserId = (filterToUserId, assessments, isHelpee) => {
	const filteredAssessments = assessments.filter(a => {
		// Determine if someone wants my help for this resourcePath
		const needsMyHelp = findRequestForMeByResourcePath(a.userId, a.resourcePath, filterToUserId) !== undefined;
		// If so, then signal that someone has asked for my help
		if (a.helpOfferredByUserId === filterToUserId && needsMyHelp) {
			a.helpRequestedFromMe = true;
		}
		// TODO: I'm not sure why this is here, honestly:
		if (needsMyHelp) {
			a.helpRequestedFromMe = true;
		}
		if (isHelpee) {
			const iHaveBeenAskedForHelp = a.userId === filterToUserId && a.helpRequestedByUserId !== null;
			const iHaveOfferredHelpToSomeone = a.userId !== filterToUserId && a.helpOfferredByUserId === filterToUserId;			
			return a.helpRequestedFromMe || iHaveOfferredHelpToSomeone;
		} else {
			const iHaveRequestedHelp = a.userId !== filterToUserId && a.helpRequestedByUserId === filterToUserId;
			const iHaveBeenOfferredHelp = a.userId !== filterToUserId && a.helpOfferredToMe === true;
			return iHaveRequestedHelp || iHaveBeenOfferredHelp;
		}
	});
	return filteredAssessments;
};

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

const pending = item => item.helpOfferredByUserId !== null && item.helpOfferredByUserId !== Meteor.userId();
const pendingMyHelp = item => item.helpOfferredByUserId === Meteor.userId();
const wantsMyHelp = item => findRequestForMe(item.userId) !== undefined && item.helpOfferredByUserId !== Meteor.userId();
const helpAcceptedByMe = item => item.helpOfferredToMe === true && item.helpRequestedByUserId === Meteor.userId();
const iAmWillingToHelp = item => SelfAssessments.findOne({resourcePath:item.resourcePath, userId:Meteor.userId(), sense:'yes', helpMadeAvailable:true}) !== undefined;
const iAmWillingToBeHelped = item => SelfAssessments.findOne({resourcePath:item.resourcePath, userId:Meteor.userId(), helpRequested: true}) !== undefined;

Template.lessonStepUsers.onCreated(function(template) {
	if (this.data.options && _.isString(this.data.options)) this.options = JSON.parse(this.data.options)
	else if (this.data.options && _.isObject(this.data.options)) this.options = this.data.options;
	else this.options = { resourcePath: undefined, filterToUserId: undefined, showLinks: false, displayMode: 'horizontal' };
});

Template.lesson_step_users_info.onRendered(function() {
	const that = this.find('.lesson-step-users-info');
	$(that).popover({
		content: () => {
			const [lessonRoute, lessonId, secIndex, partIndex] = $(that).data('resource-path').split('/');
			const lesson = Lessons.findOne(lessonId);
			const content = `<div style='text-align:left'><h5><span class='label label-danger'><span class='fa fa-graduation-cap'></span></span>&nbsp;${lesson.title}</h5>
<h6><span class='label label-warning'><span class='fa fa-folder'></span></span>&nbsp;${lesson.sections[secIndex].title}</h6>
<b><span class='label label-primary'><span class='fa fa-bookmark'></span></span>&nbsp;${lesson.sections[secIndex].parts[partIndex].title}</b>
</div>`;
			return content;
		},
		placement: 'bottom',
		title: 'Help Details',
		trigger: 'click',
		html: true,
	});
});

Template.lessonStepUsers.helpers({
	showUsersCurrent() {
		const options = Template.instance().options;
		return options.resourcePath !== undefined;
	},
	users() {
		const resourcePath = Template.instance().data.options.resourcePath;
		let users = findPresentUsers(resourcePath);
		users = removeSelf(users);
		addHelpRequestInfo(users);
		return users;
	},
	helpeeUsers() {
		const options = Template.instance().options;
		const helpeeUsers = findAssessments(options, {helpGivenEvaluationDate:null});
		if (!options.filterToUserId) return removeSelf(helpeeUsers).filter(a => a.helpRequested === true);
		const filteredHelpeeUsers = filterAssessmentsByUserId(options.filterToUserId, helpeeUsers, true);
		return filteredHelpeeUsers;
	},	
	helperUsers() {
		const options = Template.instance().options;
		const assessments = findAssessments(options);
		const helpOffers = findHelpOffers(assessments);
		const helperUsers = (!options.filterToUserId ? removeSelf(assessments).filter(u => u.helpMadeAvailable === true) : assessments);
		for(let helpOffer of helpOffers) {
			for (let helperUser of helperUsers) {
				if (helperUser.userId === helpOffer.helpOfferredByUserId && helperUser.resourcePath === helpOffer.resourcePath) {
					helperUser.helpOfferredToMe = true;
				}
			}
		}
		if (options.filterToUserId) {
			const helperUsersFiltered = filterAssessmentsByUserId(options.filterToUserId, helperUsers, false);
			return helperUsersFiltered;
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
	},
	showLinks() {
		return Template.instance().options.showLinks;
	},
  	link() {
    	let [lessonRoute, lessonId, secIndex, partIndex] = this.resourcePath.split('/');
    	secIndex = parseInt(secIndex);
    	partIndex = parseInt(partIndex);
    	return Lessons.secStepLink(lessonId, secIndex, partIndex);
  	},
  	displayVertically() {
  		return Template.instance().options.displayMode === 'vertical';
  	},
  	displayMode() {
  		return Template.instance().options.displayMode;
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
		UserFeedback.create(this.resourcePath, this.userId, this.userName, 'understand');
		SelfAssessments.helpRequestFromUserCancel(this.resourcePath, this.userId);		
	},
	'click .help-request-eyeball'() {
		UserFeedback.create(this.resourcePath, this.userId, this.userName, 'eyeball');
		SelfAssessments.helpRequestFromUserCancel(this.resourcePath, this.userId);		
	},
	'click .help-request-didit'() {
		UserFeedback.create(this.resourcePath, this.userId, this.userName, 'didit');
		SelfAssessments.helpRequestFromUserCancel(this.resourcePath, this.userId);		
	},
	'click .help-request-tried'() {
		UserFeedback.create(this.resourcePath, this.userId, this.userName, 'tried');
		SelfAssessments.helpRequestFromUserCancel(this.resourcePath, this.userId);		
	}
});