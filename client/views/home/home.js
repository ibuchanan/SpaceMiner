var SPRITE_PLAYER = 1;
var SPRITE_TILES = 2;
var SPRITE_ENEMY = 4;
var SPRITE_DOT = 8;

// Global facaces on top of the Quintus API
// for students to program against in their code 
// sections.
var game = {
  reset: function() {
    Q.state.reset({ score: 0, lives: 2, stage: 1});
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

var player = {
  incScore: function(amount) {
    Q.state.inc("score", amount);
  },
  decScore: function(amount) {
    Q.state.dec("score", amount);
  }
};

function levelMapCreate(levelMapId) {
  Q.TileLayer.extend("Level" + levelMapId,{
    init: function() {
      this._super({
        type: SPRITE_TILES,
        dataAsset: levelMapId + ".lvl",
        sheet:     'tiles',
      });
    },        
    setup: function() {
      // Clone the top level arriw
      var tiles = this.p.tiles = this.p.tiles.concat();
      var size = this.p.tileW;
      for(var y=0;y<tiles.length;y++) {
        var row = tiles[y] = tiles[y].concat();
        for(var x =0;x<row.length;x++) {
          var tile = row[x];

          if(tile == 0 || tile == 2) {
            var className = tile == 0 ? 'Dot' : 'Tower'
            this.stage.insert(new Q[className](Q.tilePos(x,y)));
            row[x] = 0;
          }
        }
      }
    }
  });

  Q.scene(levelMapId,function(stage) {
    var map = stage.collisionLayer(new Q["Level" + levelMapId]());
    var levelMap = Q.assets[levelMapId + ".lvl"];
    console.log(levelMap);
    map.setup();
    var container = stage.insert(new Q.UI.Container({
      fill: "gray",
      border: 5,
      shadow: 10,
      shadowColor: "rgba(0,0,0,0.5)",
      x:75,
      y:15
    }));    
    stage.insert(new Q.Score(), container);
    stage.insert(new Q.Player(Q.tilePos(10,7)));

    stage.insert(new Q.Enemy(Q.tilePos(10,4)));
    stage.insert(new Q.Enemy(Q.tilePos(15,10)));
    stage.insert(new Q.Enemy(Q.tilePos(5,10)));
  });
}

_.extend(Template.home, {
  events: {
    'click button.customize': function(evt, template) {
      evt.preventDefault();
      window.open('/levelCustomize', '_blank');      
    }
  },
  rendered: function() {
      // Set up a basic Quintus object
      // with the necessary modules and controls
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
      Q.state.reset({ score: 0, lives: 2, stage: 1});

      Q.gravityX = 0;
      Q.gravityY = 0;
  
      Q.loadAssetLevel = function(key,src,callback,errorCallback) {
          var fileParts = src.split("."), fileName = fileParts[0];
          Q.loadAssetOther(key, "/collectionapi/levels/" + fileName, function(key, val) {
            Q.assets[key] = JSON.parse(val)[0].board;
            // TODO fix hack
            try {
              var obj = JSON.parse(val)[0].onEnemyHit;
              var func = eval(obj);
              if (_.isFunction(func)) {
                OnEnemyHit = func;
              }

              var obj = JSON.parse(val)[0].onCoinHit;
              var func = eval(obj);
              if (_.isFunction(func)) {
                OnCoinHit = func;
              }
              
              var obj = JSON.parse(val)[0].onGemHit;
              var func = eval(obj);
              if (_.isFunction(func)) {
                OnGemHit = func;
              }              
            } catch (ex) {
              console.log("Error getting level functions:");
              console.log(ex);
            }
            callback(Q.assets[key]);
          }, errorCallback);
      };
      Q.assetTypes.lvl = 'Level';  
    
      Q.loadAssetSprite = function(key,src,callback,errorCallback) {
        var img = new Image();
        img.onload = function() {  callback(key,img); };
        img.onerror = errorCallback;
        img.src = Q.assetUrl("levelSprites/", src);
      };
      Q.assetTypes.spr = 'Sprite';
    
      Q.loadAssetTile = function(key,src,callback,errorCallback) {
        var img = new Image();
        img.onload = function() {  callback(key,img); };
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
        defaults: { speed: 100, direction: 'up' },

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

      Q.UI.Text.extend("Score", {
        init: function(p) {
        this._super({
          label: "Score: 0",
          color: "yellow"
        });
        Q.state.on("change.score",this,"scoreChange");
       },
      scoreChange: function(score) {
      this.p.label = "Score: " + score;
     }
    });  
      Q.Sprite.extend("Player", {
        init: function(p) {

          this._super(p,{
            sheet:"player",
            type: SPRITE_PLAYER,
            collisionMask: SPRITE_TILES | SPRITE_ENEMY | SPRITE_DOT
          });

          this.add("2d, towerManControls");
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
        }
      });

      // Return a x and y location from a row and column
      // in our tile map
      Q.tilePos = function(col,row) {
        return { x: col*32 + 16, y: row*32 + 16 };
      }

      Q.TileLayer.extend("TowerManMap",{
        init: function() {
          this._super({
            type: SPRITE_TILES,
            dataAsset: 'level.json',
            sheet:     'tiles',
          });

        },
        
        setup: function() {
          // Clone the top level arriw
          var tiles = this.p.tiles = this.p.tiles.concat();
          var size = this.p.tileW;
          for(var y=0;y<tiles.length;y++) {
            var row = tiles[y] = tiles[y].concat();
            for(var x =0;x<row.length;x++) {
              var tile = row[x];

              if(tile == 0 || tile == 2) {
                var className = tile == 0 ? 'Dot' : 'Tower'
                this.stage.insert(new Q[className](Q.tilePos(x,y)));
                row[x] = 0;
              }
            }
          }
        }

      });
      Q.TileLayer.extend("TowerManMap2",{
        init: function() {
          this._super({
            type: SPRITE_TILES,
            dataAsset: 'level2.json',
            sheet:     'tiles',
          });

        },
        
        setup: function() {
          // Clone the top level arriw
          var tiles = this.p.tiles = this.p.tiles.concat();
          var size = this.p.tileW;
          for(var y=0;y<tiles.length;y++) {
            var row = tiles[y] = tiles[y].concat();
            for(var x =0;x<row.length;x++) {
              var tile = row[x];

              if(tile == 0 || tile == 2) {
                var className = tile == 0 ? 'Dot' : 'Tower'
                this.stage.insert(new Q[className](Q.tilePos(x,y)));
                row[x] = 0;
              }
            }
          }
        }

      });
      Q.component("enemyControls", {
        defaults: { speed: 100, direction: 'left', switchPercent: 2 },

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
            collisionMask: SPRITE_PLAYER | SPRITE_TILES
          });

          this.add("2d,enemyControls");
          this.on("hit.sprite",this,"hit");
        },

        hit: function(col) {
          if(col.obj.isA("Player")) {
            OnEnemyHit();
          }
        }
      });

      Q.scene("level1",function(stage) {
        var map = stage.collisionLayer(new Q.TowerManMap());
    
        var levelMap = Q.assets["level.json"];
        console.log(levelMap);
        
        map.setup();
        
        var container = stage.insert(new Q.UI.Container({
          fill: "gray",
          border: 5,
          shadow: 10,
          shadowColor: "rgba(0,0,0,0.5)",
          x:75,
          y:15
        })); 
        
        stage.insert(new Q.Score(), container);
        stage.insert(new Q.Player(Q.tilePos(10,7)));

        stage.insert(new Q.Enemy(Q.tilePos(10,4)));
        stage.insert(new Q.Enemy(Q.tilePos(15,10)));
        stage.insert(new Q.Enemy(Q.tilePos(5,10)));
      });
      Q.scene("level2",function(stage) {
        var map = stage.collisionLayer(new Q.TowerManMap2());
        map.setup();
        /**
        var container = stage.insert(new Q.UI.Container({
         
          y: 48,
          x: Q.width/2 
        }));

       Q.state.on("change.score",this,"score");
        stage.insert(new Q.UI.Text({ 

         label: "Score: " + Q.state.get("score"),
         color: "white",
         x: -207,
         y: -30
        }),container);
        container.fit(2,2);**/
        stage.insert(new Q.Score());
        stage.insert(new Q.Player(Q.tilePos(10,7)));

        stage.insert(new Q.Enemy(Q.tilePos(10,4)));
        stage.insert(new Q.Enemy(Q.tilePos(15,10)));
        stage.insert(new Q.Enemy(Q.tilePos(5,10)));
      });

      Q.load("sprites.png, sprites.json, level.json, level2.json, tiles.png, coin1.wav", function() {
        Q.sheet("tiles","tiles.png", { tileW: 32, tileH: 32 });
        Q.compileSheets("sprites.png","sprites.json");
        Q.stageScene("level1");       
      });
    
      // Default handlers for events
      function OnEnemyHit() {
        game.reset();
      }
    
      function OnCoinHit() {
        player.incScore(100);
        game.playSound('coin1.wav');
      }
    
      function OnGemHit() {
        player.incScore(1000);
        game.playSound('coin1.wav');        
      }
    
      function OnPause() {
        game.pause();
      }
    
      function OnUnpause() {
        game.unpause();
      }
  }  
})

_.extend(Template.levels, {
  levels: function() {
    return Levels.find({published:true});
  },
  events: {
    'click button.levelPlay': function(evt, template) {
      var levelId = this._id;
      levelMapCreate(levelId);
      Q.load(levelId + ".spr, " + levelId + ".lvl, " + levelId + ".til", function() {
        Q.sheet("tiles", levelId + ".til", { tileW: 32, tileH: 32});
        Q.compileSheets(levelId + ".spr","sprites.json");
        Q.stageScene(levelId);
        $("#towermanGame").focus();
      });
    } 
  }
});