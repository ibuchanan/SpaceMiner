var lesson;
var lessonDep = new Deps.Dependency;

var currentSecIndex = new ReactiveVar(0);
var secPartRevealedDep = new Deps.Dependency;
var currentPartIndex = new ReactiveVar(0);

Template.lesson.rendered = function() {
  var id = Router.current().params._id;      
  Lessons.update({_id: id}, {$set: {lastViewed: new Date()}}, function(err, count) {
    lesson = Router.current().data();
    var secIndex = Router.current().params.query.sec;
    var partIndex = Router.current().params.query.part;
        
    if (secIndex) {
      secIndex = parseInt(secIndex) - 1;
      var notSeens = _.filter(lesson.sections, (sec) => {
        return sec.index < secIndex;
      });
      if (notSeens && notSeens.length > 0) {
        _.each(notSeens, (notSeen)=> {
          notSeen.seen = true;
        });
      }      
      currentSecIndex.set(secIndex);
    } else {
      secIndex = 0;
    }
    if (partIndex)  {
      partIndex = parseInt(partIndex) - 1;
      var parts = lesson.sections[secIndex].parts;
      var partFinder = (part)=> {
        return part.index < partIndex;
      };
      var notSeens = _.filter(parts, partFinder);
      if (notSeens && notSeens.length > 0) {
        _.each(notSeens, (notSeen) => { 
          notSeen.seen = true;
          notSeen.revealed = true;
        });
      }
      parts[partIndex].revealed = true;
      currentPartIndex.set(partIndex);
      secPartRevealedDep.changed();
    }    
    
    lessonDep.changed();    
  });  
}

function getLesson() {
  lessonDep.depend();
  return lesson;
}

var answeredDep = new Deps.Dependency;

Template.lesson.helpers({
  lesson: getLesson,
  challengeReady: function() {
    answeredDep.depend();
    var lesson = getLesson();
    if (!lesson) return;
    var questions = lesson.questions;    
    var ready = _.every(questions, (question)=> {
      return question.correct;
    });
    if (ready) {
      $('.collapse').collapse('hide');
    }
    return ready;
  }
});

Template.popquiz.helpers({
  lesson: getLesson
});

Template.section.helpers({
  current: function() {
    var index = currentSecIndex.get();    
    return this.index === index;
  },
  'prevEnabled': function() {
    var lesson =  getLesson();
    return this.index > 0;
  }/*,
  'nextEnabled': function() {
    var lesson = getLesson();
    return this.index < lesson.sections[currentSecIndex.get()].parts[this.index].length - 1;
  }*/  
});

Template.sectionNav.helpers({
  current: function() {
    return this.index === currentSecIndex.get() ? 'active' : '';
  },
  seenStar: function() {
    currentSecIndex.get();
    return this.seen ? 'fa-star' : 'fa-star-o';
  },
  seenBadge: function() {
    currentSecIndex.get();
    return this.seen ? 'alert-success' : '';
  }
});

Template.sectionNav.events({
  'click .sectionNav': function(evt, template) {
    if (template.data.seen) {
      currentSecIndex.set(template.data.index);
    }
  }
});

Template.lesson.events({  
  'click .prev': function() {
    var index = currentSecIndex.get(); 
    currentSecIndex.set(index-1);
  }
});

Template.partNav.helpers({
  isSeen: function() {
    secPartRevealedDep.depend();
    return this.seen;    
  },
  isRevealed: function() {
    secPartRevealedDep.depend();
    return this.revealed;
  },
  current: function() {
    var partIndex = currentPartIndex.get();
    return partIndex === this.index;
  },
  partIndex: function() {
    return this.index + 1;
  }
});

Template.partNav.events({
  'click .partNav': function(evt, template) {
    currentPartIndex.set(template.data.index);
    $('.collapse').collapse('hide');
    $('#part' + template.data.index).collapse('show');
  }
});

var sharedHelpers = {
  isRevealed: function() {
    secPartRevealedDep.depend();
    console.log(this.revealed);
    return this.revealed;
  },
  isSeen: function() {
    secPartRevealedDep.depend();
    return this.seen;    
  },
  partIndex: function() {
    return this.index + 1;
  }  
};

_.each(['paragraph', 'quickCheck', 'popquiz'], function(item) {
  Template[item].helpers(sharedHelpers);
});

var sharedEvents = {
  'click .continue': function(evt, template) {
    var index = currentSecIndex.get(); 
    var lesson = getLesson();
    var parts = lesson.sections[index].parts;
    var needsDepChange = false;
    var notSeen = _.find(parts, (part) => { return !part.seen; });
    if (notSeen) {
      notSeen.seen = true;
      lesson.sections[index].seen = true;
      needsDepChange = true;
    }
    var notRevealed = _.find(parts, (part) => { return !part.revealed; });
    if (notRevealed) {
      needsDepChange = true;
      notRevealed.revealed = true;
      var partIndex = currentPartIndex.get();
      currentPartIndex.set(partIndex + 1);
    }
    if (needsDepChange) secPartRevealedDep.changed();
    if (template.data.index === parts.length -1) {
      currentSecIndex.set(index+1);
      currentPartIndex.set(0);
    }
  },
  'click .quickCheckSubmit': (evt, template)=> {
    var input = $(template.find('.quickCheckInput')).val();
    var index = currentSecIndex.get();
    var part = template.data;
    try {
      var evaluator = eval(part.evaluator);
      var correct = evaluator(input);
      if (correct) {
        bootbox.alert("<h2>Correct!</h2> <p>Press OK to continue...</p>", ()=> {
          currentSecIndex.set(index+1);
          currentPartIndex.set(0);        
        });
      } else {
        bootbox.alert("<h2>Nope!</h2><p>Try again...</p>");
      }
    } catch(ex) {
      bootbox.alert("<h2>There was a problem with the system!</h2>");
    }
  }
};

_.each(['paragraph', 'quickCheck', 'popquiz'], function(item) {
  Template[item].events(sharedEvents);
});

Template.question.rendered = function() {
  $('.choice').button();
}

Template.question.events({
  'click .check': function(evt, template) {
    var val = $(template.find('.question .btn-group .btn[class*="active"] input')).val();    
    if (val) {
      var index = parseInt(val);
      var correct = this.correctIndex == parseInt(index);
      var icon = correct ? 'fa fa-check' : 'fa fa-ban';
      var bg = correct ? 'seagreen' : 'indianred';
      $(template.find('.feedback')).html(`<div style='padding: 4px; color: white; background-color: ${bg}'><span class='${icon}'></span>&nbsp;` + this.choices[index].feedback + '</div>');
      $(template.find('.feedback')).hide();
      $(template.find('.feedback')).fadeIn('slow');
  
      this.correct = correct;
      answeredDep.changed();
    }
  }
});

