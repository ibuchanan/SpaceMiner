Template.selfAssessment.onCreated(function(){
	if (!this.data.resourcePath) this.data.resourcePath = null;
	if (!this.data.data) this.data.data = {};
	if (!this.data.selected) this.data.selected = () => {};
});

const insert = (instance, sense) => {
	const data = instance.data;
	SelfAssessments.save(data.resourcePath, sense, data.data);
};

const advance = (instance, sense) => {
	const data = instance.data;
	data.selected(sense);
};

const insertAndAdvance = (instance, sense) => {
	insert(instance, sense);
	advance(instance, sense);
};

const getMySense = instance => {
  const assessment = SelfAssessments.findByUserIdAndResourcePath(Meteor.userId(), instance.resourcePath);
  if (assessment) return assessment.sense;
  return undefined;
};

Template.selfAssessment.helpers({
  not() {
    return getMySense(Template.instance().data) === 'not';
  },
  almost() {
    return getMySense(Template.instance().data) === 'almost';
  } , 
  yes() {
    return getMySense(Template.instance().data) === 'yes';
  }
});

Template.selfAssessment.events({
  'click .not'() {
  	insertAndAdvance(Template.instance(), 'not');
  },
  'click .almost'() {
  	insertAndAdvance(Template.instance(), 'almost');
  },
  'click .yes'() {
  	insertAndAdvance(Template.instance(), 'yes');
  },
  'click .not-help'() {
  	SelfAssessments.helpRequest(Template.instance().data.resourcePath);
  },
  'click .almost-help'() {
	SelfAssessments.helpRequest(Template.instance().data.resourcePath);
  },
  'click .i-can-help'() {
  	SelfAssessments.helpAvailable(Template.instance().data.resourcePath);
  }
});