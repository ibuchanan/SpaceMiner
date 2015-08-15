var level = new ReactiveVar('starter');

var gameUpdated = false;
var gameUpdatedDep = new Deps.Dependency;

var currentStepIndex = 0;
var currentStep = new ReactiveVar(trainingMission.steps[currentStepIndex]);

function assessmentInsert(missionId, step, stepIndex, sense) {
    var assessment = {
      missionId: missionId,
      stepTitle: (stepIndex + 1) + ': ' + step.title,
      stepIndex: stepIndex,
      userId: Meteor.userId(),
      userName: userName(),
      date: new Date(),
      sense: sense
    };
    MissionStepSelfAssessments.insert(assessment);
}

Template.build.helpers({
  mission: function() {
    return trainingMission;
  },
  currentStep: function() {
    return currentStep.get();
  },
  currentStepIndex: function() {
    currentStep.get();
    return currentStepIndex + 1;
  },
  gameUpdated: function() {
    gameUpdatedDep.depend();
    return gameUpdated;
  },
  level: function() {
    return level.get();
  },
  buttons: function() {
    return ['gamePause', 'gamePlay', 'gameReset'];
  },
  stepPreviousDisabled: function() {
    currentStep.get();
    return currentStepIndex > 0 ? '' : 'disabled';
  },
  stepNextDisabled: function() {
    currentStep.get();    
    return currentStepIndex < trainingMission.steps.length - 1 ? '' : 'disabled';
  },
  steps: function() {
    var steps = new Array(trainingMission.steps.length);
    for(var i = 0; i < steps.length; i++) steps[i] = i+1;    
    return steps;
  },
  stepCurrentActive: function() {
    currentStep.get();
    return this - 1 === currentStepIndex ? 'active' : '';
  },
  stepCount: function() {
    return trainingMission.steps.length;
  },
  stepIndex: function() {
    currentStep.get();
    return currentStepIndex + 1;
  },
  stepLoaded: function() {
    var onload = this.onload;
    if (onload) {
      // OOO dangerous
      try {
        var callback = eval(onload.script);
        callback(onload.data);
      } catch (ex) {
        console.log("Error in stepLoaded:");
        console.log(ex);
      }
    }
  }
});

function missionStepViewed(stepIndex){
  var user = userName();

  MissionStepViews.insert({
    userId : Meteor.user()._id,
    missionId : trainingMission._id,
    userName : user,
    stepIndex : stepIndex,
    date: new Date()
  });
}

function codeEditorShow() {
  $('#gameTabsNav a[href="#codeEditorTab"]').tab('show');
  ace.edit("codeInput").focus();
}

Template.build.events({
  'click .stepNext': function() {
    if (currentStepIndex < trainingMission.steps.length - 1) currentStepIndex++;
    missionStepViewed(currentStepIndex);
    var step = trainingMission.steps[currentStepIndex];
    currentStep.set(step);
    codeEditorShow();
  },
  'click .stepPrev': function() {
    if (currentStepIndex > 0) currentStepIndex--;
    missionStepViewed(currentStepIndex);
    var step = trainingMission.steps[currentStepIndex];
    currentStep.set(step);
    codeEditorShow();
  },
  'click .stepJump': function() {
    var stepIndex = this - 1;
    if (stepIndex >= 0 && stepIndex < trainingMission.steps.length && stepIndex !== currentStepIndex) {      
      currentStepIndex = stepIndex;
      missionStepViewed(currentStepIndex);
      var step = trainingMission.steps[stepIndex];
      currentStep.set(step);
      codeEditorShow();
    }
  },
  // TODO remove hard code
  'click .not': function() {
    assessmentInsert(trainingMission._id, currentStep.get(), currentStepIndex, 'not');
  },
  'click .almost': function() {
    assessmentInsert(trainingMission._id, currentStep.get(), currentStepIndex, 'almost');
  },
  'click .yes': function() {
    assessmentInsert(trainingMission._id, currentStep.get(), currentStepIndex, 'yes');
  }  
});

Template.build.rendered = function() { 
  
  function finishWork() {
    Handlebars.registerHelper('toString', function returnToString(x){
      return ( x === void 0 ) ? 'undefined' : x.toString();
    });

    Handlebars.registerHelper('spriteFile', function returnToString(sprite){
      var split = sprite.split('/');
      return split[1];
    });
    
    var step = 0;

    function next() {
      step++
      var scriptText = trainingMission.steps[step].code;
      var userScript = ace.edit("codeInput").getSession().getValue();
      userScript += scriptText;
      //ace.edit('codeInput').getSession().setValue(userScript);      
      update(false);
      missionStepViewed(currentStepIndex);
      
      /*
      var scriptText = $('#script-' + step).text();
      var stepHtml = $('#step-' + step).html();
      var userScript = ace.edit("codeInput").getSession().getValue();
      userScript += scriptText;
      ace.edit("codeInput").getSession().setValue(userScript);
      $#step').html(stepHtml);
      */
    }

    function test() {
      controls.confirm('Are you sure? When in test, players can give feedback about your world, but they cannot rank it.', function(result) {
        if (!result) return;
        Levels.update({_id:level.get()}, { 
          $set: { phase: 'test', published: true, lastUpdated: new Date(), updatedBy: userName() }
        }, function(err, count) {
          if (!err) {
            controls.alert('Your world is available for testing by everyone! You can keep working...');
          } else {
            console.log(err);
            controls.alert('There was an error setting your world ready for testing. Please check the browser console for details...');
          }
        });
      });
    }

    function release() {
      controls.confirm('Are you sure? When released, players can rank and comment on your world.', function(result) {
        if (!result) return;
        Levels.update({_id:level.get()}, { 
          $set: { phase: 'released', published: true, lastUpdated: new Date(), updatedBy: userName() },
          $inc: { version : 1 }
        }, function(err, count) {
          if (!err) {
            controls.alert('Your world is released for all! You can keep working...');
          } else {
            console.log(err);
            controls.alert('There was an error releasing your world. Please check the browser console for details...');
          }
        });
      });
    }

    function parseWorldDefinitionFromScript(script) {
      var defaults = Game.getDefaults();
      return window.ParseWorldDefinitionFromScript(script, defaults);
    }

    var updateRun = false;
    function update(updateLevel) {
      updateLevel = updateLevel || false;
      var userScript = ace.edit("codeInput").getSession().getValue();

      if (updateRun && updateLevel) {
        var obj = parseWorldDefinitionFromScript(userScript);
        var worldName = obj.worldName;
        gameUpdated = false;
        gameUpdatedDep.changed();
        var buildStepUpdateCounts = {};
        buildStepUpdateCounts['buildStepUpdateCounts.' + String(step)] = 1;

        // Get the updated tile and sprites
        var selections = [
          'player/' + obj.sprites.player,
          'enemy/' + obj.sprites.enemy,
          'gem/' + obj.sprites.gem,
          'coin/' + obj.sprites.coin,
          'shot/' + obj.sprites.shot
        ];

        // Specify the exact properties to update
        var props = {
          name: worldName,
          script: userScript,
          selections: selections,
          tile: 'tile/' + obj.sprites.tile,
          buildStepCurrent: step,
          lastUpdated: new Date(),
          updatedBy: userName()
        };

        $('#gameTabsNav a[href="#gamePreviewTab"]').tab('show');
        Meteor.call('levelUpdate', level.get(), props, buildStepUpdateCounts, function(err) {
          Meteor.setTimeout(function(){
            gameUpdated = true;
            gameUpdatedDep.changed();
            // TODO: this is weird. It's not entirely helping prevent the phantom player and double enemies spawning
            game.reset();
          }, 350);
        });
      }
      updateRun = true;
    }

    var aceEditorPathSet = false;

    function aceConfigure() {
      if (!aceEditorPathSet) {
        var paths = ['modePath', 'themePath', 'workerPath', 'basePath'];
        _.each(paths, function(path) {
          ace.config.set(path, '/packages/mrt_ace-embed/ace');
        });
        aceEditorPathSet = true;
      }
      var editor = ace.edit("codeInput");
      editor.setTheme("ace/theme/chrome");
      editor.getSession().setMode("ace/mode/javascript");
    }

    aceConfigure();
    next();
    $('#update').click(update);
    $('#next').click(next);
    $('#test').click(test);
    $('#release').click(release);
  }

  Levels.update({_id: 'starter'}, {$set: {lastViewed: new Date()}}, function(err, count) {
    var levelDoc = Router.current().data();
    if (levelDoc._id === 'starter') {
      delete levelDoc._id;
      levelDoc.published = false;
      levelDoc.phase = 'build';
      levelDoc.updatedBy = userName();
      levelDoc.userId = Meteor.userId();
      Levels.insert(levelDoc, function(err, buildLevelId) {
        level.set(buildLevelId);
        gameUpdated = true;
        gameUpdatedDep.changed();
        finishWork();
      });
    } else {
      Levels.update({_id: Router.current().params._id}, {$set: {lastViewed: new Date()}}, function(err, count) {
        var levelDoc = Router.current().data();
        level.set(levelDoc._id);
        gameUpdated = true;
        gameUpdatedDep.changed();
        finishWork();
        // TODO remove hack
        console.log("The script is:");
        console.log(levelDoc.script);
        ace.edit("codeInput").getSession().setValue(levelDoc.script);
      });
    }
  });
};