var SPRITE_PLAYER = 1;
var SPRITE_TILES = 2;
var SPRITE_ENEMY = 4;
var SPRITE_DOT = 8;

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
    console.log("The map");    
    var map = stage.collisionLayer(new Q["Level" + levelMapId]());
    console.log(map);
    map.setup();
    stage.insert(new Q.Score());
    stage.insert(new Q.Player(Q.tilePos(10,7)));

    stage.insert(new Q.Enemy(Q.tilePos(10,4)));
    stage.insert(new Q.Enemy(Q.tilePos(15,10)));
    stage.insert(new Q.Enemy(Q.tilePos(5,10)));
  });
}

Template.levels.levels = function () {
  return Levels.find();
};

Template.spriteParts.spriteParts = function() {
  return SpriteParts.find({}, {sort: {sort: 1}});
};

Template.levelEditor.events({
  'click button.test': function(evt, template) {
      Q.load("sprites.png", function() {
        Q.compileSheets("sprites.png","sprites.json");
      });    
  },
  'click button.levelSaveNew': function(evt, template) {
    var val = JSON.parse($("#levelEditor").val());
    var name = $("#levelEditorName").val();
    var level = {
      board: val,
      name: name
    };
    Levels.insert(level);
  } 
});

Template.spriteParts.events({
  'click img' : function(evt, template) {
    var parentDocId = $(evt.currentTarget).attr("data-parent");
    SpriteParts._collection.update({_id: parentDocId}, {$set: {selected: String(this)}});
  }, 
  'click button.save': function(evt,template){
    var selections = [];
    SpriteParts.find({}, {sort: {sort: 1}}).forEach(function(part) {
      selections.push(part.selected);
    });
    Meteor.call('getSpritePreview', selections);
  }
});

Template.levels.events({
  'click button.levelPlay': function(evt, template) {
      var levelId = this._id;
      levelMapCreate(levelId);
      Q.load(levelId + ".lvl", function() {
        Q.stageScene(levelId);
      });
  }
});

window.addEventListener("load",function() { 
      // Set up a basic Quintus object
      // with the necessary modules and controls
      Q = window.Q = Quintus({ development: true })
        .include("Sprites, Scenes, Input, 2D, UI")
        .setup("towermanGame", { width: 640, height: 480 })
        .controls(true);
      
      // Add in the default keyboard controls
      // along with joypad controls for touch
      Q.input.keyboardControls();
      Q.input.joypadControls();
      Q.state.reset({ score: 0, lives: 2, stage: 1});
      console.log(Q.state.get("score"));

      Q.gravityX = 0;
      Q.gravityY = 0;
  
      Q.loadAssetLevel = function(key,src,callback,errorCallback) {
          var fileParts = src.split("."),
              fileName = fileParts[0];
          Q.loadAssetOther(key, Meteor.absoluteUrl("collectionapi/levels/" + fileName), function(key, val) {
            Q.assets[key] = JSON.parse(val)[0].board;
            callback(Q.assets[key]);
          }, errorCallback);
      };
      Q.assetTypes.lvl = 'Level';  
  
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
        x:100,
        y:20
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
          Q.state.inc("score",100);
          // If there are no more dots left, just restart the game
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
            Q.state.reset({ score: 0, lives: 2, stage: 1});
            Q.stageScene("level1");
          }
        }
      });

      Q.scene("level1",function(stage) {
        var map = stage.collisionLayer(new Q.TowerManMap());
        map.setup();
        /**
        var container = stage.insert(new Q.UI.Container({
         
          y: 48,
          x: Q.width/2 
        }));

        stage.insert(new Q.UI.Text({ 
        label: "Score: " + Q.state.get("score"),
        color: "white",
        x: -207,
        y: -30
        }),container);
        container.fit(2,2);
        **/
        stage.insert(new Q.Score());
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

      Q.load("sprites.png, sprites.json, level.json, level2.json, tiles.png", function() {
        Q.sheet("tiles","tiles.png", { tileW: 32, tileH: 32 });

        Q.compileSheets("sprites.png","sprites.json");

        Q.stageScene("level1");
       
      });
});