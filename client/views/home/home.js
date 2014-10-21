var SPRITE_PLAYER = 1;
var SPRITE_TILES = 2;
var SPRITE_ENEMY = 4;
var SPRITE_DOT = 8;
var SPRITE_SHOT = 16;

// Default handlers for game events
function OnEnemyHit() {      
}

function OnGemHit() {
}

function OnCoinHit() {
}

function OnPause() {
  game.pause();
}

function OnUnpause() {
  game.unpause();
}

// Global facades on top of the Quintus API
// for students to program against in their code 
// sections.
game = {
  reset: function() {
    Q.state.reset({ score: 0, ammo: 0, lives: 2, stage: 1});
    Q.stageScene("level1");
  },
  pause: function() {
    Q.pauseGame();
  },
  unpause: function() {
    Q.unpauseGame();
  },
  playSound: function(soundName) {
    Q.audio.play(soundName);
  },
  showMessage: function(message) {

  }
};

player = {
  incScore: function(amount) {
    Q.state.inc('score', amount);
  },
  getScore: function() {
    return Q.state.get('score');
  },
  decScore: function(amount) {
    Q.state.dec('score', amount);
  },
  incAmmo: function(amount) {
    Q.state.inc('ammo', amount);
    console.log('Ammo count:' + Q.state.get('ammo'));    
  }  
};

function levelMapCreate(levelMapId) {
  Session.set('levelId', levelMapId);
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
      x: 25, y: 400, fill: 'rgba(0,0,0,0.5)'      
    }));
    box.insert(score);
    box.fit();
  });
}

_.extend(Template.home, {
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
  events: {
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
        .setup("towermanGame", {
          width: 640, height: 480, scaleToFit: true
         })
        .enableSound()
        .controls(true);
      
      // Add in the default keyboard controls
      // along with joypad controls for touch
      Q.input.keyboardControls();
      Q.input.joypadControls();
      Q.state.reset({ score: 0, ammo: 0, lives: 2, stage: 1});

      Q.gravityX = 0;
      Q.gravityY = 0;  
    
      // Override quintus load
      Q.load = function(assets,callback,options) {
          var assetObj = {};

          /* Make sure we have an options hash to work with */
          if(!options) { options = {}; }

          /* Get our progressCallback if we have one */
          var progressCallback = options.progressCallback;

          var errors = false,
              errorCallback = function(itm) {
                errors = true;
                (options.errorCallback  ||
                 function(itm) { throw("Error Loading: " + itm ); })(itm);
              };

          /* Convert to an array if it's a string */
          if(Q._isString(assets)) {
            assets = Q._normalizeArg(assets);
          }

          /* If the user passed in an array, convert it */
          /* to a hash with lookups by filename */
          if(Q._isArray(assets)) {
            Q._each(assets,function(itm) {
              if(Q._isObject(itm)) {
                Q._extend(assetObj,itm);
              } else {
                assetObj[itm] = itm;
              }
            });
          } else {
            /* Otherwise just use the assets as is */
            assetObj = assets;
          }

          /* Find the # of assets we're loading */
          var assetsTotal = Q._keys(assetObj).length,
              assetsRemaining = assetsTotal;

          /* Closure'd per-asset callback gets called */
          /* each time an asset is successfully loaded */
          var loadedCallback = function(key,obj,force) {
            if(errors) { return; }

            console.log('Key:' + key);
            console.log(Q.assets[key] != false);
            
            // Prevent double callbacks (I'm looking at you Firefox, canplaythrough
            if(!Q.assets[key]||force) {

              /* Add the object to our asset list */
              Q.assets[key] = obj;

              /* We've got one less asset to load */
              assetsRemaining--;
              
              /* Update our progress if we have it */
              if(progressCallback) {
                 progressCallback(assetsTotal - assetsRemaining,assetsTotal);
              }
            }

            /* If we're out of assets, call our full callback */
            /* if there is one */
            if(assetsRemaining === 0 && callback) {              
              /* if we haven't set up our canvas element yet, */
              /* assume we're using a canvas with id 'quintus' */
              callback.apply(Q);
            }
          };

          /* Now actually load each asset */
          Q._each(assetObj,function(itm,key) {
            /* Determine the type of the asset */
            var assetType = Q.assetType(itm);

            /* If we already have the asset loaded, */
            /* don't load it again */
            //if(Q.assets[key] && !options.reload) {
            if(Q.assets[key] && !options.reload) {
              loadedCallback(key,Q.assets[key],true);
            } else {
              /* Call the appropriate loader function */
              /* passing in our per-asset callback */
              /* Dropping our asset by name into Q.assets */
              console.log("calling again the asset load function for loadAsset" + assetType);
              Q["loadAsset" + assetType](key,itm,
                                         function(key,obj,force) {
                                           force = force || options.reload;
                                           loadedCallback(key, obj, force);     
                                         },
                                         function() { errorCallback(itm); });
            }
          });

        };    
    
    
      Q.loadAssetLevel = function(key,src,callback,errorCallback) {
          var fileParts = src.split("."), fileName = fileParts[0];
          Q.loadAssetOther(key, "/collectionapi/levels/" + fileName, function(key, val) {
            var obj = JSON.parse(val)[0];
            var board = obj.board;
            board = boardFromText(board);
            Q.assets[key] = board;
            
            function makeFunc(rawCode) {
              console.log(rawCode);
              var funcCode = "(function() {\n" + rawCode + "\n})";
              var func = eval(funcCode);
              console.log(func);
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
  
      Q.TileLayer.prototype.load = function (dataAsset) {
        var fileParts = dataAsset.split("."),
            fileExt = fileParts[fileParts.length-1].toLowerCase(),
            data;
        
        if (fileExt === "json" || fileExt == "lvl") {  
          data = Q._isString(dataAsset) ?  Q.asset(dataAsset) : dataAsset;
        }
        else {
          throw "file type not supported";
        }
        this.p.tiles = data;
      };
   
      Q.component("towerManControls", {
        // default properties to add onto our entity
        defaults: { speed: 200, direction: 'up' },

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
        var entity = this;
          if(!this.p.canFire||Q.state.get("ammo")<=0){
            console.log(Q.state.get('ammo'));
            return;
          }
          if(this.p.direction == 'left'){
            var shot = Q.stage().insert(new Q.Shot({x:this.p.x-4,y:this.p.y,angle:180,speed:400}));
          }
          else if(this.p.direction == 'up'){
            var shot = Q.stage().insert(new Q.Shot({x:this.p.x,y:this.p.y-2,angle:-90,speed:400}));
          }
          else if(this.p.direction == 'down'){
            var shot = Q.stage().insert(new Q.Shot({x:this.p.x,y:this.p.y+2,angle:90,speed:400}));
          }
          else{
            var shot = Q.stage().insert(new Q.Shot({x:this.p.x+2,y:this.p.y,speed:400}));
          }
          this.p.shots.push(shot);
          entity.p.canFire = false;
          Q.state.dec("ammo", 1) ;
          setTimeout(function(){
              entity.p.canFire = true; 
              console.log(Q.state.get('ammo'));
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
          if(this.stage.dotCount == 0) {
            Q.stageScene("level2");
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
        defaults: { speed: 210, direction: 'left', switchPercent: 2 },

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
            this.destroy();
            setTimeout(function(){
              Q.stage().insert(new Q.Enemy(Q.tilePos(10,7)));
            },5000);
          }
        }
      });
      
      //Q.load("sprites.json, tiles.png, shot.json, basicShot.png",  function() {
      Q.load("sprites.json, tiles.png, gem1.wav, coin1.wav, victory1.wav, shot.json, basicShot.png",  function() {
        console.log("Loaded basic resources...")
      });        
  }  
})

_.extend(Template.levels, {
  levels: function() {
    return Levels.find({published:true});
  }
});

_.extend(Template.level, {
  events: {
    'click button.levelPlay': function(evt, template) {
      var levelId = this._id;
      levelMapCreate(levelId);
      Q.load(levelId + ".spr, " + levelId + ".lvl, " + levelId + ".til", function() {
        console.log("Called after all loaded...");
        Q.sheet("tiles", levelId + ".til", { tileW: 32, tileH: 32});        
        Q.compileSheets(levelId + ".spr","sprites.json");
        Q.compileSheets("basicShot.png","shot.json");        
        Q.stageScene(levelId);
        $("#towermanGame").focus();
      }, {reload:true});        
    } 
  }
})
