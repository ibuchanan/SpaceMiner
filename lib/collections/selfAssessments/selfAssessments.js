SelfAssessments = new Meteor.Collection('selfAssessments');

var defaults = function(obj) {
    obj = obj || {};
    obj.helpRequested = false;
    obj.helpRequestedDate = null;
    obj.helpRequestedByUserId = null;
    obj.helpRequestedByUserName = null;
    obj.helpRequestedByUserDate = null;
    obj.helpMadeAvailable = false;
    obj.helpMadeAvailableDate = null;
    obj.helpOfferredByUserId = null;
    obj.helpOfferredByUserName = null;
    obj.helpOfferredByDate = null;
    obj.helpGivenByUserId = null;
    obj.helpGivenEvaluation = null;
    obj.helpGivenEvaluationDate = null;
    return obj;
};

SelfAssessments.save = function(resourcePath, sense, data, userId, uName) {
  resourcePath = resourcePath || null;
  sense = sense || null;
  userId = userId || Meteor.userId();
  uName = uName || userName();
  var id = userId + '-' + resourcePath;
  var assessment = {
    resourcePath: resourcePath,
    data: data,
    userId: Meteor.userId(),
    userName: uName,
    date: new Date(),
    sense: sense
  };
  defaults(assessment);
  var record = SelfAssessments.findOne(id);
  if (!record) SelfAssessments.upsert(id, { $set: assessment });
  else {
    var updates = {
      date: new Date(),
      userName: uName,
      sense: sense
    };    
    if (sense === 'not' || sense === 'almost') {
      updates.helpMadeAvailable = false;
      updates.helpMadeAvailableDate = null;
      updates.helpOfferredByUserId = null;
      updates.helpOfferredByUserName = null;
      updates.helpOfferredByDate = null;
      updates.helpRequestedByUserId = null;
      updates.helpRequestedByUserName = null;
      updates.helpRequestedByUserDate = null;      
      updates.helpGivenByUserId = null;
      updates.helpGivenEvaluation = null;
      updates.helpGivenEvaluationDate = null;      
    }
    else if (sense === 'yes') {
      updates.helpRequested = false;
      updates.helpRequestedDate = null;
    }
    SelfAssessments.update(id, { $set: updates });
  }
};

var sort = {sort: {date: -1, limit: 1}};

var findByUserIdAndResourcePath = function(userId, resourcePath) {
  return SelfAssessments.findOne({
    userId: userId,
    resourcePath: resourcePath
  }, sort);
};

SelfAssessments.findByResourcePath = function(resourcePath, criteria, options) {
  criteria = criteria || {};
  options = options || {};
  criteria.resourcePath = {$regex: resourcePath};
  return SelfAssessments.find(criteria, options);
};

var handleError = function(err, count) {
  if (err) console.error('Error updating selfAssessment: ', err);
};

SelfAssessments.helpRequest = function(resourcePath, userId) {
  // TODO update only most recent
  userId = userId || Meteor.userId();
  var assessment = findByUserIdAndResourcePath(userId, resourcePath);
  if (assessment) {
    var updates = defaults();
    updates.helpRequested = true;
    updates.helpRequestedDate = new Date();
    SelfAssessments.update(assessment._id,  { $set: updates }, handleError);
  }
};

SelfAssessments.helpRequestFromUser = function(resourcePath, helperUserId, helpeeUserId, helpeeUserName) {
  helpeeUserId = helpeeUserId || Meteor.userId();
  helpeeUserName = helpeeUserName || userName();
  var assessment = findByUserIdAndResourcePath(helperUserId, resourcePath);
  if (assessment && assessment.helpRequestedByUserId === null) {
    var updates = {
      helpRequestedByUserId: helpeeUserId,
      helpRequestedByUserName: helpeeUserName,
      helpRequestedByUserDate: new Date()
    };
    SelfAssessments.update(assessment._id,  { $set: updates }, handleError);
  }
};

SelfAssessments.helpRequestFromUserCancel = function(resourcePath, helperUserId, helpeeUserId) {
  helpeeUserId = helpeeUserId || Meteor.userId();
  var updates;
  // Cancel requests made from helpee to helper
  var assessment = findByUserIdAndResourcePath(helperUserId, resourcePath);
  if (assessment && assessment.helpRequestedByUserId === helpeeUserId) {
    updates = {
      helpRequestedByUserId: null,
      helpRequestedByUserName: null,
      helpRequestedByUserDate: null
    };
    SelfAssessments.update(assessment._id,  { $set: updates }, handleError);
  }
  // Cancel offers made from helper to helpee
  assessment = findByUserIdAndResourcePath(helpeeUserId, resourcePath);
  if (assessment && assessment.helpOfferredByUserId === helperUserId) {
    updates = {
      helpOfferredByUserId: null,
      helpOfferredByUserName: null,
      helpOfferredByDate: null
    };
    SelfAssessments.update(assessment._id, { $set: updates }, handleError);
  }
};

SelfAssessments.helpRequestFromUserAccept = function(resourcePath, helpeeUserId, helperUserId, helperUserName) {
  helperUserId = helperUserId || Meteor.userId();
  helperUserName = helperUserName|| userName();
  var updates;
  var assessment = findByUserIdAndResourcePath(helpeeUserId, resourcePath);
  if (assessment && assessment.helpOfferredByUserId === null) {
    updates = {
      helpOfferredByUserId: helperUserId,
      helpOfferredByUserName: helperUserName,
      helpOfferredByDate: new Date()
    };
    SelfAssessments.update(assessment._id, { $set: updates }, handleError);
  }
};

SelfAssessments.helpRequestFromUserDecline = function(resourcePath, helpeeUserId, helperUserId, helperUserName) {
  helperUserId = helperUserId || Meteor.userId();
  helperUserName = helperUserName|| userName();  
  var updates;
  // Cancel requests made from helpee to helper
  var assessment = findByUserIdAndResourcePath(helperUserId, resourcePath);
  if (assessment && assessment.helpRequestedByUserId === helpeeUserId) {
    updates = {
      helpRequestedByUserId: null,
      helpRequestedByUserName: null,
      helpRequestedByUserDate: null
    };
    SelfAssessments.update(assessment._id,  { $set: updates }, handleError);
  }
  // Cancel offers made from helper to helpee
  assessment = findByUserIdAndResourcePath(helpeeUserId, resourcePath);
  if (assessment && assessment.helpOfferredByUserId === helperUserId) {
    updates = {
      helpOfferredByUserId: null,
      helpOfferredByUserName: null,
      helpOfferredByDate: null
    };
    SelfAssessments.update(assessment._id, { $set: updates }, handleError);
  }
};

SelfAssessments.helpAvailable = function(resourcePath, userId) {
  // TODO update only most recent
  userId = userId || Meteor.userId();
  var assessment = findByUserIdAndResourcePath(userId, resourcePath);
  if (assessment) {
    var updates = defaults();
    updates.helpMadeAvailable = true;
    updates.helpMadeAvailableDate = new Date();
    // TODO not sure about this one:
    updates.helpRequestedByUserId = assessment.helpRequestedByUserId;
    SelfAssessments.update(assessment._id, { $set: updates }, handleError);
  }
};

SelfAssessments.helpOffer = function(resourcePath, helpeeUserId, helperUserId, helperUserName) {
  helperUserId = helperUserId || Meteor.userId();
  helperUserName = helperUserName|| userName();
  var assessment = findByUserIdAndResourcePath(helpeeUserId, resourcePath);
  if (assessment && assessment.helpOfferredByUserId === null) {
    var updates = {
      helpOfferredByUserId: helperUserId,
      helpOfferredByUserName: helperUserName,
      helpOfferredByDate: new Date()
    };
    SelfAssessments.update(assessment._id, { $set: updates }, handleError);      
  }
};

SelfAssessments.helpOfferAccept = function(resourcePath, helperUserId, helpeeUserId, helpeeUserName) {
  helpeeUserId = helpeeUserId || Meteor.userId();
  helpeeUserName = helpeeUserName|| userName();
  var assessment = findByUserIdAndResourcePath(helperUserId, resourcePath);
  if (assessment && assessment.helpRequestedByUserId === null) {
    var updates = {
      helpRequestedByUserId: helpeeUserId,
      helpRequestedByUserName: helpeeUserName,
      helpRequestedByUserDate: new Date()
    };
    SelfAssessments.update(assessment._id, { $set: updates }, handleError);      
  }
};

SelfAssessments.helpOfferCancel = function(resourcePath, helpeeUserId, helperUserId, helperUserName) {
  helperUserId = helperUserId || Meteor.userId();
  helperUserName = helperUserName|| userName();
  var updates;
  var assessment = findByUserIdAndResourcePath(helpeeUserId, resourcePath);
  // Cancel from helper to helpee
  if (assessment && assessment.helpOfferredByUserId === helperUserId) {
    updates = {
      helpOfferredByUserId: null,
      helpOfferredByUserName: null,
      helpOfferredByDate: null
    };
    SelfAssessments.update(assessment._id, { $set: updates }, handleError);      
  }
  // Cancel from helpee to helper
  assessment = findByUserIdAndResourcePath(helperUserId, resourcePath);
  if (assessment && assessment.helpRequestedByUserId === helpeeUserId) {
    updates = {
      helpRequestedByUserId: null,
      helpRequestedByUserName: null,
      helpRequestedByUserDate: null
    }
    SelfAssessments.update(assessment._id, { $set: updates }, handleError);
  }
};

SelfAssessments.findByUserIdAndResourcePath = function(userId, resourcePath) {
  return findByUserIdAndResourcePath(userId, resourcePath);
};