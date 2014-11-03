var SPRITE_PLAYER = 1;
var SPRITE_TILES = 2;
var SPRITE_ENEMY = 4;
var SPRITE_DOT = 8;
var SPRITE_SHOT = 16;

// Default handlers for game events
OnEnemyHit = function() {      
}

OnGemHit = function() {
}

OnCoinHit = function() {
}

OnPause = function() {
  game.pause();
}

OnUnpause = function() {
  game.unpause();
}

onLevelComplete = function() {
//function onLevelComplete() {
  try {
    $('#gameContainer').hide();
    if (!challengeAlreadySolved('variables')) challenge('variables');
    else OnWon();
  } catch(ex) {
    console.log(ex);  
  }
  Q.stageScene('');
}

OnWon = function() {  
}

challenges = {
  variables : function() {
    levelClone(function(err, newLevelId) {
      // TODO handle err
      var name;
      controls.prompt("<h1><span class='fa fa-smile-o'></span> Congratulations, you win!</h1>What is your name?", function(result) {
        // Do nothing with result
        if (name === undefined) {
          controls.prompt("<h1><span class='fa fa-meh-o'></span> Sorry</h1>I do not think your name was stored in memory. What is your name?", 
            function(result) {
              // Do nothing with result
              if (name === undefined) {
                controls.confirm("<h1><span class='fa fa-frown-o'></span> Ooops!</h1> Your name is still undefined in memory! Will you <i><b>please fix</b></i> my buggy code so I can store your name in memory to congratulate you properly?", function(result) {
                  if (result) window.location = '/lesson/variables/' + newLevelId;
                });
              }
          });
        }
      });
    });
  }
};

function challengeAlreadySolved(challengeName) {
  return Challenges.findOne({userId: Meteor.userId(), challenge: challengeName}) !== undefined;
}

function challenge(challengeName) {
  challenges.variables();
}

// Default instances for API objects
game = new Game();
player = new Player();
controls = new Controls();

function playInit(levelMapId) {
  Session.set('levelId', levelMapId);
  game = new Game(Q, levelMapId);
  $('.currentGameName').text(game.name());
  player = new Player(Q);
}

function levelsPanelUpdate() {
  $('#gameReturn').show();
}

function levelMapCreate(levelMapId) {
  playInit(levelMapId);
  Q.TileLayer.extend("Level" + levelMapId,{
    init: function() {
      this._super({
        type: SPRITE_TILES,
        dataAsset: levelMapId + ".lvl",
        sheet:     'tiles',
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
            this.stage.insert(new Q[className](Q.tilePos(x,y)));
            if (tile === 'E' || tile === 'P') {
              this.stage.insert(new Q.Dot(Q.tilePos(x,y)));
            }
            row[x] = 0;
          }
        }
      }
    }
  });

  Q.scene(levelMapId,function(stage) {
    var map = stage.collisionLayer(new Q["Level" + levelMapId]());
    map.setup();
    var score = new Q.Score();
    var box = stage.insert(new Q.UI.Container({
      //x: score.p.w/2 + 5, y: score.p.h/2 + 5, fill: 'rgba(0,0,0,0.5)'
      x: 25, y: 5, fill: 'rgba(0,0,0,0.5)'      
    }));
    box.insert(score);
    box.fit();
  });
}

function levelClone(callback) {
  var levelId = Session.get('levelId');
  var doc = Levels.findOne({_id: levelId});
  delete doc._id;
  doc.published = false;
  Levels.insert(doc, callback);
}

function levelsShow(hideGame) {
  if (hideGame) $('#gamePanel').fadeOut('slow');
  $('#levelsContainer').fadeIn('slow');  
}

function gameShow(hideLevels) {
  $('#gameContainer').show();
  if (hideLevels) $('#levelsContainer').fadeOut('slow');
  $('#gamePanel').fadeIn('slow');
}

function gameFocus() {
  $("#game").focus();
}

function levelPlay(levelId) {
  levelMapCreate(levelId);
  Q.load(levelId + ".spr, " + levelId + ".lvl, " + levelId + ".til", function() {
    Q.sheet("tiles", levelId + ".til", { tileW: 32, tileH: 32});        
    Q.compileSheets(levelId + ".spr","sprites.json");
    Q.compileSheets("basicShot.png","shot.json");        
    gameFocus();
    gameShow(true);
    Q.stageScene(levelId);
  }, {reload:true});  
}

Template.home.helpers({
  hideIfPaused: function() {    
    return game.isPaused() ? 'hideElement' : ''
  },
  hideIfPlaying: function() {
    return !game.isPaused() ? 'hideElement' : ''
  },
  levelLoaded: function() {
    return Session.get('levelId');
  },
  userSignedIn: function() {
    return Meteor.userId() !== null;
  },
  userOwnsCurrentLevel: function() {
    var level = Levels.findOne({_id: Session.get('levelId')});
    return Meteor.userId() !== null && level.userId === Meteor.userId();
  },
  tplCommand: function() {
    return "<% if (! _hidden) { %><span class=\"command\"><%= command %></span><%if (! resultHidden) {%><span class=\"prefix\"><%= this.resultPrefix %></span><span class=\"<%= _class %>\"><%= result %></span><% } } %>";
  }  
});

_.extend(Template.home, {
  events: {
    'click .levelsShow': function() {
      levelsPanelUpdate();
      game.pause();
      levelsShow(true);
    },
    'click .gameShow': function() {
      gameFocus();
      gameShow(true);
    },
    'click .gamePause': function() {
      game.pause();
    },
    'click .gamePlay': function() {
      game.unpause();
      gameFocus();
    },
    'click .gameReset': function() {
      game.reset();
      gameShow(true);
      gameFocus();
    },
    'click button.customize': function(evt, template) {
      evt.preventDefault();
      var levelId = Session.get('levelId');
      window.open('/levelCustomize/' + levelId, '_blank');
    },
    'click button.fork': function(evt, template) {
      evt.preventDefault();
      var levelId = Session.get('levelId');
      var levelDoc = Levels.findOne({_id: levelId});
      delete levelDoc._id;
      levelDoc.published = false;
      Levels.insert(levelDoc, function(err, forkedLevelId) {
        window.open('/levelCustomize/' + forkedLevelId, '_blank');      
      });
    }    
  },
  rendered: function() {
      // Set up a basic Quintus object
      // with the necessary modules and controls
      delete Session.keys.levelId;
    
      Q = window.Q = Quintus({
        development: true,
        audioSupported: ['wav'] })
        .include("Audio, Sprites, Scenes, Input, 2D, UI")
        .setup('game', {
          width: 640, height: 480, scaleToFit: true
         })
        .enableSound()
        .controls(true);
    
      QuintusOverrides.override(Q);
      
      // Add in the default keyboard controls
      // along with joypad controls for touch
      Q.input.keyboardControls();
      Q.input.joypadControls();
      Q.state.reset({ score: 0, ammo: 0, lives: 2, stage: 1});

      Q.gravityX = 0;
      Q.gravityY = 0;
    
      Q.loadAssetLevel = function(key,src,callback,errorCallback) {
          var fileParts = src.split("."), fileName = fileParts[0];
          Q.loadAssetOther(key, "/collectionapi/levels/" + fileName, function(key, val) {
            var obj = JSON.parse(val)[0];
            var board = obj.board;
            board = boardFromText(board);
            Q.assets[key] = board;
            
            function makeFunc(rawCode) {
              var funcCode = "(function() {\n" + rawCode + "\n})";
              var func = eval(funcCode);
              if (_.isFunction(func)) {
                return func;
              }
              return null;
            }
            
            // TODO fix hack
            try {
              var func = makeFunc(obj.onCoinHit);
              if (func) {
                OnCoinHit = func;
              }
              
              var func2 = makeFunc(obj.onEnemyHit);
              if (func2) {
                OnEnemyHit = func2;
              }
              
              var func3 = makeFunc(obj.onGemHit);
              if (func3) {
                OnGemHit = func3;
              }
              
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
          OnCoinHit();
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
          OnGemHit();
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
          if(col.obj.isA("Player")) {
            OnEnemyHit();
          }
          else if(col.obj.isA("Shot")){
            player.incScore(1000);
            //Q.Enemy.p.speed = this.p.speed + 10;
            var speedUp = this.p.speed;
            this.destroy();
            setTimeout(function(){
              var newEnemy = new Q.Enemy(Q.tilePos(10,7));
              newEnemy.p.speed = speedUp + 50;
              Q.stage().insert(newEnemy);
            },5000);
          }
        }
      });
      
      Q.load("sprites.json, tiles.png, gem1.wav, coin1.wav, victory1.wav, shot.json, basicShot.png",  function() {
        var levelId = Router.current().params.levelId;
        if (levelId) levelPlay(levelId);        
      });
  }
});

Template.levels.helpers({
  levels: function() {
    return Levels.find({published:true});
  }
});  

Template.level.events({
  'click button.levelPlay': function(evt, template) {
    levelPlay(this._id);
  }
});

var bsBackgrounds = [
  'primary', 'success', 'info', 'warning', 'danger'
];

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

Template.level.helpers({
  randomBackgroundColor: function() {
    return randomElement(bsBackgrounds);
  },
  preview: function() {
    var images = '';
    for(var i = 0; i < this.selections.length-1; i++) {
      images += "<img src='/images/spriteParts/" + this.selections[i] + "' height='32' width='32' alt='' />&nbsp;";
      if (i==1) images += "<img src='/images/spriteParts/" + this.tile + "' height='32' width='32' alt='' />&nbsp;";
    }
    return images;
  }
});

Template.game.helpers({
  name: function() {
    return game.name();
  }
});