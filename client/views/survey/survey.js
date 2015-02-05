Template.survey.events({
  'click .answerSubmit': function() {
    var answer = $('#answerEditor').val();
    var profile = Meteor.user().profile;
    var user = profile.nickName || profile.name;
    
    SurveyAnswers.insert( { survey: Router.current().params._id, user: user, answer : answer } );    
  }
});

Template.survey.helpers({
  answers: function() {
    return SurveyAnswers.find({ survey: Router.current().params._id });
  },
  survey: function() {    
    return Surveys.findOne({ _id:Router.current().params._id });
  }
});