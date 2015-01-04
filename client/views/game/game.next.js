// Default handlers for game events
this.OnWon = function() {  
}

this.game = new Game();
this.player = new Player();

var gamePaused = new ReactiveVar(false);
var gameReactive = new ReactiveVar(this.game);

var gameCompleted = Bus.signal('gameCompleted'); // todo clean this up...
var gameLoading = new ReactiveVar(false);

var gameOpen = new ReactiveVar(false);

var chatEnabled = new ReactiveVar(false);

var signals = AutoSignal.register('game', {
  gameOpened: function() {
    gameOpen.set(true);
  },
  gameHidden: function() {
    gameOpen.set(false);
    game.pause();
    gamePaused.set(true);
  },
  gameLoadStarted: function() {
    gameLoading.set(true);
  },
  gameLoadCompleted: function() {
    gameLoading.set(false);
  }
});

var buttons = ['levelsShow', 'gamePause', 'gamePlay', 'gameReset', 'customize', 'fork'];

function argify(args) {
  if (_.isString(args)) args = { level : args };
  return args;
}
var levelId = 'starter';

Template.game.created = function() {
  var args = argify(this.data);
  levelId = args.level;
  if (args.buttons && _.isArray(args.buttons)) {
    buttons = args.buttons;
  }
  if (args.chatEnabled) {
    chatEnabled.set(true);
  }
};

Template.game.rendered = function() {    
  var args = argify(this.data);
  signals.gameLoadStarted.dispatch(args.level);
  gameOpen.set(true); // Manual since we could not hear the event published from the home module
  configureQuintus(function(q) {
    levelPlay(q, args.level, function(q, world) {
      game = new Game(q, world);
      gameReactive.set(game);
      gamePaused.set(false);
      gameShow();
      signals.gameLoadCompleted.dispatch(args.level);
      q.stageScene(args.level);
      gameFocus();      
    });
  });
};

Template.game.helpers({
  name: function() {
    if (gameLoading.get() === true) return 'Teleporting...';
    return gameReactive.get().worldName();
  },
  explorerName: function() {
    if (gameLoading.get() === true) return '...';
    return gameReactive.get().explorerName();
  },
  enemiesRespawn: function() {
    if (gameLoading.get() === true) return '...';
    return gameReactive.get().enableEnemyRespawn() ? 'true' : 'false';
  },
  allowed: function(button) {
    var allowButton = _.indexOf(buttons, button);
    return showIfTrue(allowButton > -1);
  },
  userOwnsCurrentLevel: function() {
    var level = Levels.findOne({_id: levelId});
    return Meteor.userId() !== null && level.userId === Meteor.userId();
  },
  showIfGameOpen: showIfTrue(gameOpen),
  hideIfGameComplete: function() {
    return hideIfTrue(Session.get('gameComplete'));
  },
  showIfGameComplete: function() {
    return showIfTrue(Session.get('gameComplete'));
  },
  hideIfGameLoading: hideIfTrue(gameLoading),
  showIfGameLoading: showIfTrue(gameLoading),
  hideIfPaused: function() {
    return hideIfTrue(gamePaused.get());
  },
  hideIfPlaying: function() {
    return hideIfTrue(!gamePaused.get());
  },
  showIfChatEnabled: showIfTrue(chatEnabled),
  messages: function() {
    var sort = { sort : { date : -1 } };
    return LevelsChat.find({level:levelId}, sort);
  }
});

Template.game.events({
  'click .levelsShow': function() {
    signals.gameHidden.dispatch();    
  },
  'click .gamePause': function() {    
    game.pause();
    gamePaused.set(true);
  },
  'click .gamePlay': function() {
    game.unpause();
    gamePaused.set(false);
    gameShow();
    gameFocus();
  },
  'click .gameReset': function() {
    game.unpause();
    gamePaused.set(false);    
    game.reset();
    gameShow();
    gameFocus();
  },
  'click button.customize': function(evt, template) {
    evt.preventDefault();
    window.open('/levelCustomize/' + levelId, '_blank');
  },
  'click button.fork': function(evt, template) {
    evt.preventDefault();
    var levelDoc = Levels.findOne({_id: levelId});
    delete levelDoc._id;
    levelDoc.published = false;
    levelDoc.phase = 'forked';
    Levels.insert(levelDoc, function(err, forkedLevelId) {
      window.open('/levelCustomize/' + forkedLevelId, '_blank');      
    });
  },
  'click .chatSend': function() {
    var message = $('#chatEditor').val();
    var user = Meteor.user().profile.nickName;
    var level = levelId;
    LevelsChat.insert({ message, user, level });
  }
  
});

var SPRITE_PLAYER = 1;
var SPRITE_TILES = 2;
var SPRITE_ENEMY = 4;
var SPRITE_DOT = 8;
var SPRITE_SHOT = 16;

function levelPlay(q, levelId, callback) {
  levelMapCreate(q, levelId);
  q.load(levelId + ".spr, " + levelId + ".lvl, " + levelId + ".til", function() {
    q.sheet("tiles", levelId + ".til", { tileW: 32, tileH: 32});
    q.compileSheets(levelId + ".spr","sprites.json");
    q.compileSheets("basicShot.png","shot.json");
    // TODO remove hack
    var world = q.assets[levelId + 'World'];
    callback(q, world);    
  }, {reload:true});  
}

function levelMapCreate(q, levelMapId) {
  player = new Player(q);
  q.TileLayer.extend("Level" + levelMapId,{
    init: function() {
      this._super({
        type: SPRITE_TILES,
        dataAsset: levelMapId + ".lvl",
        sheet: 'tiles'
      });
    },        
    setup: function() {      
      // Clone the top level array
      var tiles = this.p.tiles = this.p.tiles.concat();
      var size = this.p.tileW;
      
      var map = {
        '-': 'Dot',
        'G': 'Tower',
        'E': 'Enemy',
        'P': 'Player'
      };
      for(var y=0;y<tiles.length;y++) {
        var row = tiles[y] = tiles[y].concat();
        for(var x =0;x<row.length;x++) {
          var tile = row[x];
          if (tile === 't') row[x] = 1;
          if (tile !== 't' && tile !== 1) {
            var className = map[String(tile)];
            this.stage.insert(new q[className](q.tilePos(x,y)));
            if (tile === 'E' || tile === 'P') {
              this.stage.insert(new q.Dot(q.tilePos(x,y)));
            }
            row[x] = 0;
          }
        }
      }
    }
  });
  
  q.scene(levelMapId, function(stage) {
    var map = stage.collisionLayer(new q["Level" + levelMapId]());
    map.setup();
    var score = new q.Score();
    var box = stage.insert(new q.UI.Container({
      //x: score.p.w/2 + 5, y: score.p.h/2 + 5, fill: 'rgba(0,0,0,0.5)'
      x: 25, y: 5, fill: 'rgba(0,0,0,0.5)'      
    }));
    box.insert(score);
    box.fit();
  });      
}

function getDefaults() {
  return Game.getDefaults();
}
      
function parseWorldDefinitionFromScript(worldScript, defaults) {
  try {
    var funcCode = createOverrideFuncCode(worldScript, defaults);
    var func = eval('(' + funcCode + ')'); // yep, "eval can be harmful"
    var obj = {};
    if (_.isFunction(func)) {
      obj = func(defaults);
      return obj;      
    } else {
      throw "parseWorldDefinitionFromScript could not parse function from code: " + funcScript;
    }
  } catch (ex) {
    console.log('parseWorldDefinitionFromScript:');
    console.log(ex);
  }
  return {};
}

function __merge__(obj1, obj2) {
  for (var p in obj2) {
    try {
      // Property in destination object set; update its value.
      if (obj2[p].constructor === Object) {
        obj1[p] = __merge__(obj1[p], obj2[p]);
      } else {
        obj1[p] = obj2[p];
      }
    } catch(e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];
    }
  }
  return obj1;
}

function createOverrideFuncCode(worldScript, defaults) {
  var script = 'function(defaults) {\n' +
      '  var __obj__ = {};\n';
  
  script += '\n  /* Begin user code */\n\n  ' + worldScript +'\n\n  /* End user code */\n'; 
  
  _.each(defaults, function(value, key) {
    if (value.constructor === Object) {
      script += `\n  try { __obj__.${key} = __merge__(defaults.${key}, ${key}); }\n`
    } else {
      script += `\n  try { __obj__.${key} = ${key}; }\n`
    }
    script += `  catch(e) { __obj__.${key} = defaults.${key}; }\n`;
  });
  
  script += '\n  return __obj__;\n}';
  
  return script;
}

function worldOverride(overrides, world) {
  if (!_.isArray(overrides) || overrides.length === 0) {
    return world;
  }
  var worldCopy = JSON.parse(JSON.stringify(world));
  
  function copyRow(rowSource, rowTarget) {
    rowSource.forEach(function(cell, index) {
      rowTarget[index] = cell;
    });
  }
  
  if (_.isArray(overrides[0])) {
    overrides.forEach(function(row, rowIndex) {
      copyRow(row, worldCopy[rowIndex]);
    });
  } else {
    copyRow(overrides, worldCopy[0]);
  }
  
  return worldCopy;
}

function createBoardFromWorld(world, worldDefault) {
  var worldCopy = worldOverride(world, worldDefault);
  
  // Now assure left and right borders are all tiles
  worldCopy.forEach(function(row) {
    row.push('t');
    row.unshift('t');
  });
  
  // And, the top and bottom rows are all tiles
  var borderRow = 'tttttttttttttttttttt'.split('');
  worldCopy.push(borderRow);
  worldCopy.unshift(borderRow);

  return worldCopy;
}

function makeFunc(rawCode) {
  var funcCode = "(function() {\n" + rawCode + "\n})";
  var func = eval(funcCode);
  if (_.isFunction(func)) {
    return func;
  }
  return null;
}

function configureQuintus(callback) {  
  function configureCanvas(q) {
    q.setup('game', {
      width: 640, height: 448, scaleToFit: true
    })
    .enableSound()
    .controls(true);
    q.input.keyboardControls();
    q.input.joypadControls();
  }
  
  Q = window.Q = Quintus({
    development: true,
    audioSupported: ['wav'] })
  .include("Audio, Sprites, Scenes, Input, 2D, UI");
  configureCanvas(Q);
  
  QuintusOverrides.override(Q);

  Q.gravityX = 0;
  Q.gravityY = 0;
  
  function getRows(rowStrings) {
    var rows = _.map(rowStrings, function(row) {
      if (_.isString(row)) return row.split('');
      return [];
    });
    return rows;
  }
  
  Q.loadAssetLevel = function(key,src,callback,errorCallback) {
    var fileParts = src.split("."), worldName = fileParts[0];
    Q.loadAssetOther(key, "/collectionapi/levels/" + worldName, function(key, val) {
      var obj = JSON.parse(val)[0];
      var board = obj.board;
      board = boardFromText(board);
      
      /* Now check if this is a level that has a 'script' instead */
      
      var defaults = getDefaults();
      if (_.has(obj, 'script') && _.isString(obj.script)) {
        var world = parseWorldDefinitionFromScript(obj.script, defaults);        
        // TODO remove hack
        world._id = worldName;
        Q.assets[worldName + 'World'] = world;
        
        // First, if a world property was set, layer it over the defaults
        var worldSprites = worldOverride(world.world, defaults.world);
        console.info(worldSprites);
        
        // Second, if a worldRows property was set, layer that over the world
        if (_.isArray(world.worldRows) && world.worldRows.length > 0 && _.isString(world.worldRows[0])) {
          var overrides = getRows(world.worldRows);
          worldSprites = worldOverride(overrides, worldSprites);
        }
        
        // Third, if worldCoords was set, layer that on top of the world
        if (_.isObject(world.worldCoords) && _.keys(world.worldCoords).length > 0) {
          _.each(world.worldCoords, function(value, key) {
            var coords = key.split(',');
            if (coords.length < 2) {
              console.log('The key: ' + key + ', must be in the format of r,c where r specifies a row number and c specifies a column within that row. For example: 0,0 is the first row and first column, and 3,4 would be the fourth row andd fifth column.');
            }
            var row = parseInt(coords[0]);
            var col = parseInt(coords[1]);
            worldSprites[row][col] = value;
          });
        }
        
        // Fourth, process the worldBuild directions
        if(_.isObject(world.worldBuild) && _.keys(world.worldBuild).length > 0) {
          var group = function(g) {
            var start = g.start || '0,0';
            var sprites = g.sprites || [];
            var repeat = g.repeat || 'x 1'; // '[full|[count[ x|y]]
            
            sprites = getRows(sprites);
            
            return {
              start,
              repeat,
              sprites
            };
          };
          
          var groups = function(gs) {
            if (!_.isArray(gs)) return [];
            else {
              return _.map(gs, group);
            }
          };
          
          var worldBuild = world.worldBuild;
          
          var gs = [];
          if (_.isObject(worldBuild) && _.isArray(worldBuild.groups)) {
            gs = groups(worldBuild.groups); 
          } else if (_.isObject(worldBuild)) {
            gs = [ group(worldBuild) ];
          }
          
          // Now let's iterate...
          _.each(gs, function(g) {
            var start = g.start;
            var sprites = g.sprites;
            var repeat = g.repeat;
            var coords = start.split(',');
            if (coords.length < 2) coords = [0,0];
            var startingRow = parseInt(coords[0]);
            var startingCol = parseInt(coords[1]);

            var worldWidth = worldSprites[0].length;
            var worldHeight = worldSprites.length;
                        
            var iterations = 1;
            var repeatDirection = 'x';
            var repeatParts = repeat.split(' ');
            if (repeatParts[0] === 'full') {
              // TODO calculate iterations or something...
            } else {
              iterations = parseInt(repeatParts[0]);
            }
            if (repeatParts.length > 1) {
              repeatDirection = repeatParts[1];
            }
            
            // Find max length of the spriteparts
            var width = sprites[0].length;
            _.each(sprites, function(row) {
              if (row.length > width) width = row.length;
            });
            var height = sprites.length;
            
            // Adapt to bounds           
            if (startingRow > worldHeight) startingRow = worldHeight - height;
            if (startingCol > worldWidth) startingCol = worldWidth - width;
            if (startingRow + height > worldHeight) startingRow = worldHeight - height;
            if (startingCol + width > worldWidth) startingCol = worldWidth - width;
                      
            var wrappedYCount = 0;
            
            var vertGroupsNoWrap = 0;
            var horGroupsNoWrap = 0;
            
            var wrappedAtRow = 0;
            var wrappedAtCol = 0;
            
            console.log("World height: " + worldHeight);
            console.log("World width: " + worldWidth);
            console.log("startingRow: " + startingRow);
            console.log("startingCol: " + startingCol);
            
            for(var i = 0; i < iterations; i++) {
              var currentStartingRow = startingRow;
              var currentStartingCol = startingCol;
              
              var rowString = "";
              /*
              if (repeatDirection === 'y') {
                sprites.forEach(function(cells, rowIndex) {
                  var thisRow = currentStartingRow + rowIndex - wrappedAtRow;
                  if (thisRow >= worldHeight) {
                    console.log("Uh oh, exceding height");
                    console.log(thisRow);                  
                    wrappedAtRow = rowIndex;
                    currentStartingRow = thisRow = vertGroupsNoWrap = startingRow = 0;
                    wrappedYCount++;
                  }
                  currentStartingCol = startingCol + (wrappedYCount * width);                
                  rowString = thisRow + ": ";
                  var colString = "";
                  cells.forEach(function(cell, colIndex) {
                    var thisCol = currentStartingCol + colIndex - wrappedAtCol;
                    if (thisCol >= worldWidth) {
                      console.log('Uh oh, exceding width');
                      console.log(thisCol);
                      wrappedAtCol = colIndex;
                      startingRow = currentStartingRow = thisRow = startingRow += height;
                      currentStartingCol = thisCol = horGroupsNoWrap = startingCol = 0;
                      wrappedXCount++;
                    }
                    rowString += (thisCol) + ",";
                    worldSprites[thisRow][thisCol] = cell;
                    if (colIndex >= (cells.length - 1)) {
                      horGroupsNoWrap++;
                      console.log("horGroups: " + horGroupsNoWrap);
                    }
                  });
                  console.log(rowString);
                  if (rowIndex >= (sprites.length - 1)) {
                    vertGroupsNoWrap++;
                    console.log("vertGroups: " + vertGroupsNoWrap);
                  }
                });
                startingRow += height;
              }
              */
              if (repeatDirection === 'y') {
                sprites.forEach(function(cells, rowIndex) {
                  var thisRow = currentStartingRow + rowIndex - wrappedAtRow;
                  if (thisRow >= worldHeight) {
                    wrappedAtRow = rowIndex;
                    currentStartingCol = startingCol + width;
                    startingCol += width;
                    currentStartingRow = startingRow = thisRow = 0;
                  }
                  cells.forEach(function(cell, colIndex) {
                    var thisCol = currentStartingCol + colIndex;
                    if (thisCol < worldWidth) {
                      worldSprites[thisRow][thisCol] = cell;                      
                    }                   
                  });                  
                });
                startingRow += height;                
              }
              else if (repeatDirection === 'x') {
                for(var colIndex = 0; colIndex < width; colIndex++) {
                  var thisCol = currentStartingCol + colIndex - wrappedAtCol;
                  if (thisCol >= worldWidth) {
                    wrappedAtCol = colIndex;
                    currentStartingRow = startingRow + height;
                    startingRow += height;
                    currentStartingCol = startingCol = thisCol = 0;
                  }
                  sprites.forEach(function(cells, rowIndex) {
                   if (cells.length >= (colIndex+1)) {
                     var cell = cells[colIndex];
                     var thisRow = currentStartingRow + rowIndex;
                     worldSprites[thisRow][thisCol] = cell;
                   } 
                  });
                }                
                startingCol += (width);
              }
            }
          });
        }        
/*

var worldName = "Space Miner";
''
var worldBuild = {
    groups : [ 
        {
        start: '2,2',
        repeat: '4 y',
        sprites: [ 'gg', 'ggg', 'gggg', 'ggggg']
        }
    ]
};
    
    

*/
        
        // TODO: is the second param necessary any more?
        board = boardFromNewToOld(createBoardFromWorld(worldSprites, defaults.world));
      } else {
        defaults._id = worldName;
        defaults.worldName = obj.name;
        Q.assets[worldName + 'World'] = defaults;
      }
      
      Q.assets[key] = board;

      // TODO fix hack
      try {
        var func4 = makeFunc(obj.onWon);
        if (func4) {
          OnWon = func4;
        }
      } catch (ex) {
        console.log("Error getting level functions:");
        console.log(ex);
      }
      callback(key, Q.assets[key]);
    }, errorCallback);
  };
  Q.assetTypes.lvl = 'Level'; 

  Q.loadAssetSprite = function(key,src,callback,errorCallback) {
    var img = new Image();
    img.onload = function() { callback(key,img); };
    img.onerror = errorCallback;
    img.src = Q.assetUrl("levelSprites/", src);
  };
  Q.assetTypes.spr = 'Sprite';

  Q.loadAssetTile = function(key,src,callback,errorCallback) {
    var img = new Image();
    img.onload = function() { callback(key,img); };
    img.onerror = errorCallback;
    img.src = Q.assetUrl("levelTiles/", src);
  };
  Q.assetTypes.til = 'Tile';

  Q.component("towerManControls", {
    // default properties to add onto our entity
    defaults: { speed:200, /*direction: 'up' */ },

    // called when the component is added to
    // an entity
    added: function() {
      var p = this.entity.p;

      // add in our default properties
      Q._defaults(p,this.defaults);

      // every time our entity steps
      // call our step method
      this.entity.on("step",this,"step");
    },

    step: function(dt) {
      // grab the entity's properties
      // for easy reference
      var p = this.entity.p;

      // rotate the player
      // based on our velocity
      if(p.vx > 0) {
        p.angle = 90;
      } else if(p.vx < 0) {
        p.angle = -90;
      } else if(p.vy > 0) {
        p.angle = 180;
      } else if(p.vy < 0) {
        p.angle = 0;
      }

      // grab a direction from the input
      p.direction = Q.inputs['left']  ? 'left' :
      Q.inputs['right'] ? 'right' :
      Q.inputs['up']    ? 'up' :
      Q.inputs['down']  ? 'down' : p.direction;

      // based on our direction, try to add velocity
      // in that direction
      switch(p.direction) {
        case "left": p.vx = -p.speed; break;
        case "right":p.vx = p.speed; break;
        case "up":   p.vy = -p.speed; break;
        case "down": p.vy = p.speed; break;
      }
    }
  });

  Q.UI.Button.extend("Score", {
    init: function(p) {
      this._super({
        label: "000000",
        fontColor: "yellow",
        x:50,
        y:10
      });
      Q.state.on("change.score", this, "scoreChange");
    },
    scoreChange: function(score) {
      if (score <= 99999) { 
        score = ("" + score); 
      }
      this.p.label = score;
    }
  });

  Q.Sprite.extend("Player", {
    init: function(p) {
      this._super(p,{
        sheet:"player",
        type: SPRITE_PLAYER,
        collisionMask: SPRITE_TILES | SPRITE_ENEMY | SPRITE_DOT
      });
      this.add("2d, towerManControls, laser");
    },
  });
  Q.Sprite.extend("Shot", {
    init: function(p) {
      this._super(p,{
        sheet:"shot",
        type: SPRITE_SHOT,
        collisionMask: SPRITE_TILES | SPRITE_ENEMY,
        speed : 300,
      });
      this.on('hit','erase');
    },
    step: function(dt){
      this.stage.collide(this);
      if(this.p.angle == 0){
        this.p.x += this.p.speed * dt;
      } 
      else if(this.p.angle == 180){
        this.p.x -= this.p.speed * dt;
      }
      else if(this.p.angle == -90){
        this.p.y -= this.p.speed * dt;
      }
      else{
        this.p.y += this.p.speed * dt;
      }

      if(this.p.y > Q.el.height || this.p.y < 0){
        this.destroy();
      }
    }, sensor: function() {
      this.destroy();
    },
    erase: function(collision) {
      //console.log('collision');
      this.destroy();
    }  
  });
  Q.component("laser",{
    added : function(){
      this.entity.p.shots = [];
      this.entity.p.canFire = true;
      this.entity.on("step",'handleFiring');
    },
    extend:{
      handleFiring: function(dt){
        for(var i = this.p.shots.length-1;i > 0;i--){
          if(this.p.shots[i].isDestroyed){
            this.p.shots.splice(i,1);
          }
        }
        if(Q.inputs['fire']){
          this.fire();
        }  
      },
      fire: function(){
        var shot;
        var entity = this;
        if(!this.p.canFire||Q.state.get("ammo")<=0){
          return;
        }
        if(this.p.direction == 'left'){
          shot = Q.stage().insert(new Q.Shot({x:this.p.x-4,y:this.p.y,angle:180,speed:400}));
        }
        else if(this.p.direction == 'up'){
          shot = Q.stage().insert(new Q.Shot({x:this.p.x,y:this.p.y-2,angle:-90,speed:400}));
        }
        else if(this.p.direction == 'down'){
          shot = Q.stage().insert(new Q.Shot({x:this.p.x,y:this.p.y+2,angle:90,speed:400}));
        }
        else{
          shot = Q.stage().insert(new Q.Shot({x:this.p.x+2,y:this.p.y,speed:400}));
        }
        this.p.shots.push(shot);
        entity.p.canFire = false;
        Q.state.dec("ammo", 1) ;
        setTimeout(function(){
          entity.p.canFire = true; 
        },1000);
      }
    } 
  });
  // Create the Dot sprite
  Q.Sprite.extend("Dot", {
    init: function(p) {
      this._super(p,{
        sheet: 'dot',
        type: SPRITE_DOT,
        // Set sensor to true so that it gets notified when it's
        // hit, but doesn't trigger collisions itself that cause
        // the player to stop or change direction
        sensor: true
      });

      this.on("sensor");
      this.on("inserted");
    },

    // When a dot is hit..
    sensor: function() {
      // Destroy it and keep track of how many dots are left
      this.destroy();
      this.stage.dotCount--;
      game.onCoinCollision();
      // If there are no more dots left, just restart the game
      // TODO move to next level from page
      if(this.stage.dotCount === 0) {
        onLevelComplete();
      }
    },

    // When a dot is inserted, use it's parent (the stage)
    // to keep track of the total number of dots on the stage
    inserted: function() {
      this.stage.dotCount = this.stage.dotCount || 0
      this.stage.dotCount++;
    }
  });

  // Tower is just a dot with a different sheet - use the same
  // sensor and counting functionality
  Q.Dot.extend("Tower", {
    init: function(p) {
      this._super(Q._defaults(p,{
        sheet: 'tower'
      }));
    },
    sensor: function() {
      // Destroy it and keep track of how many dots are left
      this.destroy();
      this.stage.dotCount--;
      game.onGemCollision();      
      // If there are no more dots left, just restart the game
      // TODO move to next level from page
      if(this.stage.dotCount == 0) {
        Q.stageScene("level2");
      }
    }  
  });

  // Return a x and y location from a row and column
  // in our tile map
  Q.tilePos = function(col,row) {
    return { x: col*32 + 16, y: row*32 + 16 };
  }

  Q.component("enemyControls", {
    defaults: {direction: 'left', switchPercent: 2 },

    added: function() {
      var p = this.entity.p;

      Q._defaults(p,this.defaults);

      this.entity.on("step",this,"step");
      this.entity.on('hit',this,"changeDirection");
    },

    step: function(dt) {
      var p = this.entity.p;

      if(Math.random() < p.switchPercent / 100) {
        this.tryDirection();
      }

      switch(p.direction) {
        case "left": p.vx = -p.speed; break;
        case "right":p.vx = p.speed; break;
        case "up":   p.vy = -p.speed; break;
        case "down": p.vy = p.speed; break;
      }
    },

    tryDirection: function() {
      var p = this.entity.p; 
      var from = p.direction;
      if(p.vy != 0 && p.vx == 0) {
        p.direction = Math.random() < 0.5 ? 'left' : 'right';
      } else if(p.vx != 0 && p.vy == 0) {
        p.direction = Math.random() < 0.5 ? 'up' : 'down';
      }
    },

    changeDirection: function(collision) {
      var p = this.entity.p;
      if(p.vx == 0 && p.vy == 0) {
        if(collision.normalY) {
          p.direction = Math.random() < 0.5 ? 'left' : 'right';
        } else if(collision.normalX) {
          p.direction = Math.random() < 0.5 ? 'up' : 'down';
        }
      }
    }
  });

  Q.Sprite.extend("Enemy", {
    init: function(p) {
      this._super(p,{
        sheet:"enemy",
        speed: 150,
        type: SPRITE_ENEMY,
        collisionMask: SPRITE_PLAYER | SPRITE_TILES | SPRITE_SHOT
      });

      this.add("2d,enemyControls");
      this.on("hit.sprite",this,"hit");
    },

    hit: function(col) {
      function die(self) {
        self.destroy();
        if (game.enableEnemyRespawn()) {
          setTimeout(function(){
            var newEnemy = new Q.Enemy(Q.tilePos(10,7));
            var speedUp = self.p.speed;
            newEnemy.p.speed = speedUp + game.enemy().increaseSpeedBy;
            Q.stage().insert(newEnemy);
          },game.enemy().respawnDelay);
        }
      }      
      if(col.obj.isA("Player")) {
        die(this);
        game.onEnemyCollision(col.obj);
      }
      else if(col.obj.isA("Shot")){
        player.scoreInc(1000);
        die(this);
      }
    }
  });
 
  Q.load("sprites.json, gem1.wav, coin1.wav, victory1.wav, shot.json, basicShot.png",  function() {
    /* var levelId = Router.current().params.levelId;
    if (levelId) levelPlay(levelId);  
    */
    callback(Q);
  });
  
  return Q;
}

this.gameFocus = function() {
  Meteor.setTimeout(function() {
    $("#game").focus();  
  }, 125);
}

this.gameShow = function() {
  Session.set('gameVisible', true);
  Session.set('gameComplete', false);
}