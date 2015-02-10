var level = new ReactiveVar('starter');

var gameUpdated = false;
var gameUpdatedDep = new Deps.Dependency;

var currentStepIndex = 0;
var currentStep = new ReactiveVar(trainingMission.steps[currentStepIndex]);

Template.build.helpers({
  mission: function() {
    return trainingMission;
  },
  currentStep: function() {
    return currentStep.get();
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

Template.build.events({
  'click .stepNext': function() {
    if (currentStepIndex < trainingMission.steps.length - 1) currentStepIndex++;
    var step = trainingMission.steps[currentStepIndex];
    currentStep.set(step);
  },
  'click .stepPrev': function() {
    if (currentStepIndex > 0) currentStepIndex--;
    var step = trainingMission.steps[currentStepIndex];
    currentStep.set(step);
  },
  'click .stepJump': function() {
    var stepIndex = this - 1;
    if (stepIndex >= 0 && stepIndex < trainingMission.steps.length && stepIndex !== currentStepIndex) {
      currentStepIndex = stepIndex;
      var step = trainingMission.steps[stepIndex];
      currentStep.set(step);
    }
  }
});

function userName() {
  return Meteor.user().profile.name;
}

function buildSteps() {
  
}

Template.build.rendered = function() { 
  
  function finishWork() {
    Handlebars.registerHelper('toString', function returnToString(x){
      return ( x === void 0 ) ? 'undefined' : x.toString();
    });

    Handlebars.registerHelper('spriteFile', function returnToString(sprite){
      var split = sprite.split('/');
      return split[1];
    });

    function render(obj) {
      var templateScript = $("#templateHeader").html();
      var template = Handlebars.compile(templateScript);
      var output = template(obj);
      $('#header').html(output);
      var world = obj.drawWorld(obj.world);
      $('#worldContainer').html(world);
    }

    var defaults = {
      worldName : "Space Miner",
      explorerName : "Ninja Coder",
      numberOfLives : 1,
      enableEnemyRespawn : true,
      sprites: {
        tile: "plasma.png",
        enemy: "brainBlue.png",
        coin: "blue.png",
        gem: "pinkGem.png",
        player: "dark.png"
      },
      world: [
        ['e', 'g', 'c', 'c', 'c', 'e', 'g', 'c', 'c', 'c', 'e', 'g', 'c', 'c', 'c', 'c', 'c', 'c', 'g'],
        ['c', 'c', 't', 't', 'c', 't', 'c', 'c', 'c', 'c', 't', 't', 'c', 't', 't', 't', 'c', 't', 'c'],
        ['c', 'c', 't', 't', 'c', 't', 'g', 't', 't', 't', 't', 't', 'c', 'c', 'c', 'c', 'c', 't', 'c'],
        ['c', 'c', 't', 't', 'c', 't', 'c', 'c', 'c', 'c', 't', 't', 'c', 'c', 'c', 'c', 'c', 't', 'c'],
        ['c', 'c', 't', 'c', 'c', 't', 'c', 'c', 'c', 'c', 't', 't', 'c', 'c', 'c', 'c', 'c', 't', 'c'],
        ['c', 'c', 'g', 't', 'c', 't', 'c', 'c', 'c', 'g', 't', 't', 'c', 'c', 't', 't', 't', 't', 'c'],
        ['c', 'c', 't', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 't', 'c', 'c', 'c', 'c', 'g', 't', 'c'],
        ['c', 'c', 't', 't', 'c', 'c', 'g', 'c', 'c', 'c', 't', 't', 'c', 't', 't', 't', 't', 't', 'c'],
        ['c', 'c', 'c', 't', 'c', 't', 't', 't', 'c', 'c', 'c', 't', 'c', 'c', 'c', 'c', 'c', 't', 'c'],
        ['c', 'c', 't', 'c', 'c', 't', 'c', 'c', 'c', 'c', 't', 't', 'c', 'c', 'c', 'c', 'c', 't', 'c'],
        ['c', 'c', 'c', 'c', 'c', 't', 'c', 'c', 'c', 'c', 't', 't', 'c', 'c', 'c', 't', 'c', 't', 'c'],
        ['c', 'c', 'p', 't', 'c', 'c', 'c', 'c', 'c', 'c', 'e', 't', 'c', 'c', 'c', 't', 'g', 't', 'g'],
      ],
      drawWorldCell: function(cell, rowNum, cellNum) {
        var spritesMap = {
          t : 'tile',
          p : 'player',
          e : 'enemy',
          g : 'gem',
          c : 'coin'
        };
        var spriteName = this.sprites[spritesMap[cell]];
        if (!spriteName) {
          spriteName = defaults.sprites[spritesMap[cell]];
        }
        var file = spritesMap[cell] + '/' + spriteName;
        return '<span class="worldCell" data-coords="' + rowNum + ':' + cellNum + '" style="background-image: url(http://supersonic-box-14-130414.use1.nitrousbox.com/images/spriteParts/' + file + ');"></span>';
      },
      drawWorldRow: function(row, rowNum) {
        var rowHtml = "<div class='worldRow'>";
        var that = this;
        row.forEach(function(cell, cellNum) {
          rowHtml += that.drawWorldCell(cell, rowNum, cellNum);
        });
        return rowHtml + '</div>\n';
      },
      drawWorld: function(world) {
        var worldHtml = '';
        var that = this;
        if (!_.isArray(world)) throw "world must be a valid array";
        if (world.length === 0) {
          world = defaults.world;
        }
        var worldCopy = JSON.parse(JSON.stringify(defaults.world));

        function copyRow(rowSource, rowTarget) {
          rowSource.forEach(function(cell, index) {
            rowTarget[index] = cell;
          });
        }
        if (_.isArray(world[0])) {
          world.forEach(function(row, rowIndex) {
            copyRow(row, worldCopy[rowIndex]);
          });
        } else {
          copyRow(world, worldCopy[0]);
        }
        // Now assure left and right borders are all tiles
        worldCopy.forEach(function(row) {
          row.push('t');
          row.unshift('t');
        });
        // And, the top and bottom rows are all tiles
        var borderRow = 'ttttttttttttttttttttt'.split('');
        worldCopy.push(borderRow);
        worldCopy.unshift(borderRow);

        worldCopy.forEach(function(row, rowNum) {
          worldHtml += that.drawWorldRow(row, rowNum);
        });
        return worldHtml;
      }
    };

    var step = 0;

    function next() {
      step++
      var scriptText = $('#script-' + step).text();
      var stepHtml = $('#step-' + step).html();
      var userScript = ace.edit("codeInput").getSession().getValue();
      userScript += scriptText;
      ace.edit("codeInput").getSession().setValue(userScript);
      $('#step').html(stepHtml);
      update(false);
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
      var obj = window.ParseWorldDefinitionFromScript(script, defaults);    
      return obj;
    }

    var updateRun = false;
    function update(updateLevel) {
      updateLevel = updateLevel || false;
      var configureTemplate = $('#configureTemplate').text();
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
        
        Meteor.call('levelUpdate', level.get(), props, buildStepUpdateCounts, function(err) {
          Meteor.setTimeout(function(){
            gameUpdated = true;
            gameUpdatedDep.changed();
            // TODO: this is weird. It's not entirely helping prevent the phantom player and double enemies spawning
            game.reset();
          }, 250);          
        });        
      }
      updateRun = true;

      //render(obj);
      //$('#toggleGrid').click(toggleGrid);
      //$('#toggleCoords').click(toggleCoords);    
    }

    function aceConfigure() {
      var editor = ace.edit("codeInput");
      editor.setTheme("ace/theme/monokai");
      editor.getSession().setMode("ace/mode/javascript");    
    }

    function toggleGrid() {
      $('.worldCell').toggleClass('worldCellBorder');
    }

    function toggleCoords() {
      $('.worldCell').toggleClass('worldCellCoords');
    }

    function renderWorldMap() {
      var rows = 14;
      var cols = 21;

      var world = '';

      for(var rowNum = 0; rowNum < 14; rowNum++) {
        world += "<div class='worldRow'>";
        for(var colNum = 0; colNum < cols; colNum++) {
          world += "<span class='worldCell' data-coords='" + rowNum + "," + colNum + "'>&nbsp;</span>";
        }
        world += "</div>";
      }

      $('#worldMap').html(world);
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
        ace.edit("codeInput").getSession().setValue(levelDoc.script);        
      });
    }
  });  
};