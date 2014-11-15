var level = new ReactiveVar('starter');

var gameUpdated = false;
var gameUpdatedDep = new Deps.Dependency;

Template.build.helpers({
  gameUpdated: function() {
    gameUpdatedDep.depend();
    return gameUpdated;
  },
  level: function() {
    console.log(level.get());
    return level.get(); 
  },
  buttons: function() {
    return ['gamePause', 'gamePlay', 'gameReset'];
  }
})

function nickName() {
  return Meteor.user().profile.nickName;
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
      worldName : "Nemesis",
      explorerName : "Ninja Coder",
      numberOfLives : 3,
      enableEnemyRespawn : true,
      sprites: {
        tile: "fiery.png",
        enemy: "brainBlue.png",
        coin: "gold.png",
        gem: "emerald.png",
        player: "light.png"
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
          $set: { phase: 'test', published: true, lastUpdated: new Date(), updatedBy: nickName() }
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
          $set: { phase: 'released', published: true, lastUpdated: new Date(), updatedBy: nickName() },
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

    var updateRun = false;
    function update(updateLevel) {
      updateLevel = updateLevel || false;
      var configureTemplate = $('#configureTemplate').text();
      var userScript = ace.edit("codeInput").getSession().getValue();
      if (updateRun && updateLevel) {  
        var funcText = '(function(){\n' + userScript + '\n' + configureTemplate + '\n})';
        var func = eval(funcText);
        var obj = func();
        
        var worldName = obj.worldName;        
        
        gameUpdated = false;
        gameUpdatedDep.changed();
        var buildStepUpdateCounts = {};
        buildStepUpdateCounts['buildStepUpdateCounts.' + String(step)] = 1;
        console.log(buildStepUpdateCounts);
        Levels.update({_id:level.get()}, { 
          $set: { name: worldName, script : userScript, buildStepCurrent: step, 
                lastUpdated: new Date(), updatedBy: nickName()},
          $inc : buildStepUpdateCounts
        }, function() {
          Meteor.setTimeout(function(){
            gameUpdated = true;
            gameUpdatedDep.changed();
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

    function renderSpriteChoices(sprites) {
      var container;
      var templateText = $("#spritesTemplate").html();
      var template = Handlebars.compile(templateText);
      var output = template(sprites);
      $('#sprites').html(output);
    }  

    $.get('http://supersonic-box-14-130414.use1.nitrousbox.com/collectionapi/spriteParts', function(data) {
      data = _.reject(data, function(item) { return item.part === 'Shots'});
      data.forEach(function(item) {
        if (item.part === 'Treasure') item.part = 'Gem';
      });
      renderSpriteChoices(data);
    }).fail(function(err) {
      console.log(err);
    });
    aceConfigure();
    next();
    $('#update').click(update);
    $('#next').click(next);
    $('#test').click(test);
    $('#release').click(release);
  }
  
  Levels.update({_id: 'starter'}, {$set: {lastViewed: new Date()}}, function(err, count) {
    var levelDoc = Router.current().data();
    console.log(levelDoc);
    delete levelDoc._id;
    levelDoc.published = false;
    levelDoc.phase = 'build';
    levelDoc.updatedBy = nickName();
    Levels.insert(levelDoc, function(err, buildLevelId) {
      level.set(buildLevelId);
      gameUpdated = true;
      gameUpdatedDep.changed();
      finishWork();
    });
  });  
};