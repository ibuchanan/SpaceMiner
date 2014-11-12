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

OnWon = function() {  
}

game = new Game();
player = new Player();

var gamePausedDep = new Deps.Dependency;
var gameDep = new Deps.Dependency;

var gameCompleted = Bus.signal('gameCompleted'); // todo clean this up...

var gameLoading = new ReactiveVar(false);

var signals = AutoSignal.register('game', {
  gameLoadStarted: function() {
    gameLoading.set(true);
  },
  gameLoadCompleted: function() {
    gameLoading.set(false);
  }
});

Template.game.rendered = function() {  
  var levelId = this.data;
  signals.gameLoadStarted.dispatch(levelId);
  configureQuintus(function(q) {
    game = new Game(q, levelId);
    gameDep.changed();
    gamePausedDep.changed();
    levelPlay(q, levelId);
  });
};

Template.game.helpers({
  name: function() {
    if (gameLoading.get() === true) return 'Loading...';
    gameDep.depend();
    return game.name();
  },
  userOwnsCurrentLevel: function() {
    var level = Levels.findOne({_id: Session.get('levelId')});
    return Meteor.userId() !== null && level.userId === Meteor.userId();
  },
  hideIfGameNotVisible: function() {
    return Session.get('gameVisible') !== true ? 'hideElement' : '';
  },
  hideIfGameComplete: function() {
    return Session.get('gameComplete') === true ? 'hideElement' : '';
  },
  showIfGameComplete: function() {
    return Session.get('gameComplete') === true ? '' : 'hideElement';
  },
  hideIfGameLoading: function() {
    return gameLoading.get() === true ? 'hideElement' : '';
  },
  showIfGameLoading: function() {
    return gameLoading.get() === true ? '' : 'hideElement';
  },
  hideIfPaused: function() {
    gamePausedDep.depend();
    return game.isPaused() ? 'hideElement' : '';
  },
  hideIfPlaying: function() {
    gamePausedDep.depend();
    return !game.isPaused() ? 'hideElement' : '';
  }
});

// TODO use Postal.js for this, or something...

function levelsShow() {
  Session.set('gameVisible', false);
}

Template.game.events({
  'click .levelsShow': function() {
    game.pause();
    gamePausedDep.changed();
    levelsShow();
  },
  'click .gamePause': function() {    
    game.pause();
    gamePausedDep.changed();
  },
  'click .gamePlay': function() {
    game.unpause();
    gamePausedDep.changed();
    gameShow();
    gameFocus();
  },
  'click .gameReset': function() {
    game.unpause();
    game.reset();
    gamePausedDep.changed();
    gameShow();
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
});

function levelPlay(q, levelId) {
  levelMapCreate(q, levelId);
  q.load(levelId + ".spr, " + levelId + ".lvl, " + levelId + ".til", function() {
    q.sheet("tiles", levelId + ".til", { tileW: 32, tileH: 32});
    q.compileSheets(levelId + ".spr","sprites.json");
    q.compileSheets("basicShot.png","shot.json");
    gameShow();
    signals.gameLoadCompleted.dispatch(levelId);
    q.stageScene(levelId);
    gameFocus();
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

function configureQuintus(callback) {
  function configureCanvas(q) {
    q.setup('game', {
      width: 640, height: 480, scaleToFit: true
    })
    .enableSound()
    .controls(true);
    q.input.keyboardControls();
    q.input.joypadControls();
    q.state.reset({ score: 0, ammo: 0, lives: 2, stage: 1});
  }
  // Set up a basic Quintus object
  // with the necessary modules and controls
  /*
  if (window.Q !== undefined) {
    configureCanvas(Q);
    callback(Q);
    return Q;
  }
  */
  
  Q = window.Q = Quintus({
    development: true,
    audioSupported: ['wav'] })
  .include("Audio, Sprites, Scenes, Input, 2D, UI");
  configureCanvas(Q);
  
  QuintusOverrides.override(Q);

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
 
  Q.load("sprites.json, gem1.wav, coin1.wav, victory1.wav, shot.json, basicShot.png",  function() {
    /* var levelId = Router.current().params.levelId;
    if (levelId) levelPlay(levelId);  
    */
    callback(Q);
  });
  
  return Q;
}

gameFocus = function() {
  $("#game").focus();
}

gameShow = function() {
  Session.set('gameVisible', true);
  Session.set('gameComplete', false);
}