var level = new ReactiveVar('starter');

var gameUpdated = false;
var gameUpdatedDep = new Deps.Dependency;

Template.build.helpers({
  mission: function() {
    return trainingMission;
  },
  currentStep: function() {
    return trainingMission.steps[0];
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
  }
})

function userName() {
  return Meteor.user().profile.name;
}

/*
  <script type="text/plain" id="script-5">
var sprites = {
  tile : "plasma.png"
};</script>
  <div id="step-5" class='step'>
      <h2>Transform your new world</h2>
      <p class="alert alert-info" role="alert">Worlds can be fiery, icey, rocky, dusty, watery, and more! How do you want yours to look?</p>
      <p>If you remember, the borders of your world used to be fiery, but now they are filled with plasma. To change this back to fiery tiles for a moment do this:</p>
      <ul>
        <li>Place these two identical characters <code>//</code> in front of the text <code>tile : "plasma.png"</code>
 so that it looks like           <code>//tile : "plasma.png"</code>
. These are comment characters, which tell the computer to ignore a single line of code.</li>
        <li>When done, press the           <b>Update world</b>
 button to see the change.</li>
       <li>Then change the last bit of code again so that it looks like this: <pre><code>var sprites = {
  tile : "plasma.png",
  enemy : "goonGreen.png"
}</code></pre></li>
      </ul>
      <h3>Objects let you use a single variable to group a bunch of other values by name</h3>
      <p>
      Before moving on to look at other sprites you can use to customize your world, let's break down this last chunk of code a bit more:
      </p>
      
      <p>
        <pre><code>var sprites = {
  tile : "plasma.png",
  enemy : "goonGreen.png"
}</code></pre>
      </p>
    
      <p>
        <ul>
          <li>The first line uses the familiar <code>var</code> keyword to begin a variable declaration, and the variable name is <code>sprites</code>.</li>
          <li>After the assignment operator <code>=</code>, we use a <b>left curly brace</b>, <code>{</code> to start the creation of a new <b>object</b> data type.</li>
          <li>The next line, <code>tile : "plasma.png",</code> places a <b>property</b> named <code>tile</code> inside this new object and assigns the value <code>"plasma.png"</code> to it. The colon character, <code>:</code>, serves a purpose like <code>=</code> does when assigning a value into a variable. Lastly, the comma, <code>,</code> tells JavaScript to expect another property to follow. </li>
          <li>The line right after that, <code>enemy : "goonGreen.png"</code> places another property, named <code>enemy</code>, inside this new object and assigns it the value <code>"goonGreen.png"</code>. There is no comma after this value because we are not yet adding any more properties into this object. </li>
          <li>The final line has just <code>}</code>, a <b>right curly brace</b> to finish the declaration and creation of the new object.</li> 
        </ul>
      </p>
      
      <p>There are a lot of other choices than just <code>"fiery.png"</code> <img src='http://supersonic-box-14-130414.use1.nitrousbox.com/images/spriteParts/tile/fiery.png' alt='fiery.png'/> and <code>"plasma.png"</code> <img src='http://supersonic-box-14-130414.use1.nitrousbox.com/images/spriteParts/tile/plasma.png' alt='plasma.png'/> for the <code>tile</code> property, and for the <code>enemy</code> property there are more choices than <code>"brainBlue.png"</code> <img src='http://supersonic-box-14-130414.use1.nitrousbox.com/images/spriteParts/enemy/brainBlue.png' alt='brainBlue.png'/> and <code>"goonGreen.png"</code> <img src='http://supersonic-box-14-130414.use1.nitrousbox.com/images/spriteParts/enemy/goonGreen.png' alt='goonGreen'/>.</p>
      
      <p>So, click next to try some new ones!</p>
  </div>
  <script type="text/plain" id="script-6"></script>
  <div id="step-6" class='step'>
      <h2>Pick your sprites!</h2>
      <p class="alert alert-info" role="alert">You're probably already thinking about creating your own sprites. Don't worry, in a future lesson you will learn to use graphics editors to make your own sprites. For now, pick your favorites from those below and plug them into the <code>sprites</code> variable to customize your world.</p>
      <p>No new code has been added in this step. That's your job this time. But, here's a sample of what the <code>sprites</code> variable would look like if all the possible properties had their original values: <pre><code>var sprites = {
  tile: "fiery.png",
  enemy: "brainBlue.png",
  coin: "gold.png",
  gem: "emerald.png",
  player: "light.png"
};</code></pre></p>
    <p>Your choices are in the menu of sprites below:</p>
      <div id="sprites"></div>      
      <ul>
        <li>Go ahead and add new properties for <code>coin</code>, <code>gem</code>, and <code>player</code> and type in the values for the sprites you like best from their categories to customize your world.</li>
        <li>When done, press the <b>Update world</b> button to see the change.</li>
      </ul>
  </div>
        
*/        





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

    function renderSpriteChoices(sprites) {
      var container;
      var templateText = $("#spritesTemplate").html();
      var template = Handlebars.compile(templateText);
      var output = template(sprites);
      $('#sprites').html(output);
    }  

    $.get('/collectionapi/spriteParts', function(data) {
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