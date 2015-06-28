var boardFromText = function(board) {
  return _.map(board.split('\n'), function(row) {
    return row.split('');
  });
};

function defineProperties(target, source, props) {
  props.forEach(function(prop) {
    Object.defineProperty(target, prop, {
      get: function() {
        return source[prop];
      },
      set: function(val) {
        source[prop] = val;
      }
    });
  });
}

this.Game = class {
  constructor(q, world) {
    this.timeOuts = [];
    this.q = q;
    this.levelId = "";
    this.world = world;
    if (_.isString(world)) this.levelId = world;
    if (_.isObject(world)) {
      this.levelId = world._id;
      this.resetState();
    } else {
      this.world = Game.getDefaults();
    }
    this.paused = false;
  }
  get player() {
    var qPlayer = this.q('Player').items[0];
    var player = new Player(this.q, qPlayer);
    defineProperties(player, qPlayer.p, ['x', 'y', 'speed', 'direction']);
    return player;
  }
  get enemies() {
    var qEnemies = this.q('Enemy');
    var that = this;
    var enemies = _.map(qEnemies.items, (qEnemy) => {
      var enemy = new Enemy(that.q, qEnemy);
      defineProperties(enemy, qEnemy.p, ['x', 'y', 'speed', 'direction']);
      return enemy;
    });
    return enemies;
  }
  setTimeout(delay, func) {
    this.timeOuts.push(Meteor.setTimeout(func, delay));
  }
  cancelTimeouts() {
    for(var i = 0; i < this.timeOuts.length; i++) {
      Meteor.clearTimeout(this.timeOuts[i]);
    }
  }
  static getDefaults() {
    var worldSprites = boardFromText(
`cegccccccccccccgcc
ctttttcccccctttttc
ctgccccccccccccgtc
ctttttcccccctttttc
ccccctccttcctccccc
cctcctccttcctcctcc
ccccctcccccctccccc
ctcccccccccccccctc
ctcttcttttttcttctc
ccgccccccpcccccgcc
ctcttctcttctcttctc
ccgccccccccccccgcc`);
    return {
      worldName : "Space Miner",
      explorerName : "Ninja Coder",
      numberOfLives : 1,
      enableEnemyRespawn : true,
      sprites: {
        tile: "plasma.png",
        enemy: "brainBlue.png",
        coin: "blue.png",
        gem: "pinkGem.png",
        player: "dark.png",
        shot: "basicShot.png"
      },
      world: worldSprites,
      worldRows: [],
      worldCoords: {},
      worldBuild: {},
      enemy: {
        respawnDelay: 5000,
        increaseSpeedBy: 50
      },
      collisions: {
        coin: {
          scoreInc: 100,
          soundPlay: 'coin1.wav'
        },
        gem: {
          scoreInc: 500,
          ammoInc: 1,
          soundPlay: 'gem1.wav'
        }
      }
    };
  }
  get worldName() {
    // TODO decouple Levels ?
    if (!this.world) return "No world loaded...";
    return this.world.worldName;
  }
  get enableEnemyRespawn() {
    return this.world.enableEnemyRespawn;
  }
  enemy() {
    return this.world.enemy;
  }
  collisions() {
    return this.world.collisions;
  }
  get explorerName() {
    return this.world.explorerName;
  }
  get numberOfLives() {
    return this.world.numberOfLives;
  }
  livesRemaining() {
    return this.q.state.get('lives') > 0;
  }
  livesDec() {
    this.q.state.dec('lives', 1);
  }
  reset() {
    this.resetState();
    this.q.stageScene(this.levelId);
  }
  resetState() {
    this.cancelTimeouts();
    this.q.state.reset({ score: 0, ammo: 0, lives: this.numberOfLives });
  }
  pause() {
    this.q.pauseGame();
    this.paused = true;
  }
  unpause() {
    this.q.unpauseGame();
    this.paused = false;
  }
  isPaused() {
    return this.paused;
  }
  soundPlay(soundName) {
    if (this.q.options.audioSupported.length > 0) {
      this.q.audio.play(soundName);
    }
  }
  onCoinCollision() {
    // todo HACK
    this.player.scoreInc(this.collisions().coin.scoreInc);
    this.soundPlay(this.collisions().coin.soundPlay);
  }
  onGemCollision() {
    this.player.scoreInc(this.collisions().gem.scoreInc);
    this.player.ammoInc(this.collisions().gem.ammoInc);
    this.soundPlay(this.collisions().gem.soundPlay);
  }
  onEnemyCollision(hitPlayer) {
    this.livesDec();
    hitPlayer.destroy();
    if (this.livesRemaining()) {
      console.log("Resurrecting player:");
      var resurrectedPlayer = new this.q.Player(this.q.tilePos(10,7));
      this.q.stage().insert(resurrectedPlayer);
    } else {
      this.reset();
    }
  }
  onScan() {
  }
}

this.Enemy = class {
  constructor(q, enemy) {
    this.q = q;
    this.qobj = enemy;

    Enemy.defineWrappers(this);

    this.qobj.p.speedDefault = 150;
  }
  speedSet(speed) {
    this.qobj.p.speedDefault = speed;
    this.qobj.p.speed = speed;
  }
  speedGet() {
    return this.qobj.p.speed;    
  }
  freeze() {
    this.qobj.p.speed = 0;
  }
  unfreeze() {
    this.qobj.p.speed = this.qobj.p.speedDefault;
  }
  start() {
    this.qobj.p.speed = this.qobj.p.speedDefault;
  }

  static defineWrappers(obj) {
    // Thin facades on top of the quintus sprite. Not sure, but maybe we should just
    // move the quintus code into here and dispense with the facades
    obj.move = function() {
      var items = Array.prototype.slice.call(arguments);
      move(obj.qobj.p, ...items);
    };

    obj.teleport = function(x, y) {
      obj.x = x;
      obj.y = y;
    };

    obj.teleporter = function(x, y) {
      return function() {
        obj.teleport(x, y);
      }
    };

    obj.message = function(text) {
      return function() {
        message(text);
      }
    };
  }
}

this.Player = class {
  constructor(q, player) {
    var that = this;
    this.q = q;
    this.qobj = player;

    Player.defineWrappers(this);

    this.qobj.p.speedDefault = 200;

    var move = this.move;
    var moveHelp =
`
<h2>player.move('count direction', ...)</h2>

<p>Call this function to move the player <b>count</b> number of cells for the given <b>direction</b>. The <b>direction</b> may be <b>left, up, right, or down</b>. You can also use <b>l, u, r, or d</b> as shortcuts. This function will take any number of arguments and will keep moving the player until it has evaluated each argument.</p>

<h3>Usage examples</h3>

<div>
<p>To move the player 4 spaces to the left, followed by 2 up, 7 to the right and then 5 down, type this code:</p>
<p>
<code>game.player.move('4 left', '2 up', '7 right', '5 down');</code>
</p>
<p>
You can also use the shortcut form like this:
<p>
<p>
<code>game.player.move('4 l', '2 u', '7 r', '5 d');</code>
</p>
</div>
`;
    move.help = function() {
      bootbox.alert(moveHelp);
    };
    move.helpt = function() {
      var text = $(moveHelp).text();
      return text.replace(/\n\n\n+/g, "\n\n");
    }
  }

  static defineWrappers(obj) {
    // Thin facades on top of the quintus sprite. Not sure, but maybe we should just
    // move the quintus code into here and dispense with the facades
    obj.fire = function() {
      obj.qobj.fire();
    };
    obj.move = function() {
      var items = Array.prototype.slice.call(arguments);
      move(obj.qobj.p, ...items);
    };
    obj.cloak = function() {
      obj.qobj.p.cloaked = true;
      obj.qobj.p.sheet = 'enemy';
      // TODO: hard-coded reference to game should be encapsulated
      game.setTimeout(5000, function() {
        obj.qobj.p.cloaked = false;
        obj.qobj.p.sheet = 'player';
      });
    };
    obj.teleport = function(x, y) {
      obj.x = x;
      obj.y = y;
    };
    obj.teleporter = function(x, y) {
      return function() {
        obj.teleport(x, y);
      }
    };
    obj.message = function(text) {
      return function() {
        message(text);
      }
    };
    obj.turn = function(direction) {
      var adjust = function(val, subtract) {
        var posOrNeg = subtract ? -1 : 1;
        return val + ((val % 16) * posOrNeg);
      };

      var that = this;

      if (that.direction === 'up') that.y = adjust(that.y, true);
      else if (that.direction === 'down') that.y = adjust(that.y);
      else if (that.direction === 'left') that.x = adjust(that.x, true);
      else if (that.direction === 'right') that.x = adjust(that.x);

      that.speed = 200;
      that.direction = direction;
    };
    obj.scope = function(...directions) {
      var maxCount = 19;
      var scopes = {};

      const dist = 32;
      const distModifiers = {
        up: { x: 0, y: -dist },
        down: { x: 0, y: dist },
        left: { x: -dist, y: 0 },
        right: { x: dist, y: 0 }
      };

      distModifiers.u = distModifiers.up;
      distModifiers.d = distModifiers.down;
      distModifiers.l = distModifiers.left;
      distModifiers.r = distModifiers.right;

      const SPRITE_TILES = 2;
      const SPRITE_ENEMY = 4;
      const SPRITE_DOT = 8;

      const collisionMask = SPRITE_TILES | SPRITE_ENEMY | SPRITE_DOT;

      if (directions.length < 1) directions = ['left', 'right', 'up', 'down'];

      var adjust = function(val, subtract) {
        var posOrNeg = subtract ? -1 : 1;
        return val + ((val % 16) * posOrNeg);
      };

      for (var i = 0; i < directions.length; i++) {
        var x = obj.x;
        var y = obj.y;

        if (obj.direction === 'up') y = adjust(y, true);
        else if (obj.direction === 'down') y = adjust(y);
        else if (obj.direction === 'left') x = adjust(x, true);
        else if (obj.direction === 'right') x = adjust(x);

        var direction = directions[i];
        var items = [];

        if (window.DBUG) {
          console.log('looking in:' + direction);
          console.log('curr: ' + obj.x + ':' + obj.y);
          console.log('adjusted: ' + x + ':' + y)
        }

        for (var j = 0; j < maxCount; j++) {
          x = x + distModifiers[direction].x;
          y = y + distModifiers[direction].y;
          if (window.DBUG) {
            console.log('next direction shift: ' + x + ':' + y);
          }
          var item = Q.stage().locate(x, y, collisionMask);
          if (item) items.push(item.p.sheet);
          else items.push(null);
        }

        scopes[direction] = items;
      }

      var keys = _.keys(scopes);

      if (keys.length === 1) return _.pairs(scopes)[0][1];
      return scopes;
    }
  }

  scoreInc(amount) {
    this.q.state.inc('score', amount);
  }
  scoreDec(amount) {
    this.q.state.dec('score', amount);
  }
  scoreGet() {
    return this.q.state.get('score');
  }
  ammoInc(amount) {
    this.q.state.inc('ammo', amount);
  }
  ammoGet() {
    return this.q.state.get('ammo');
  }
  livesGet() {
    return this.q.state.get('lives');
  }
  start() {
    this.qobj.p.speed = this.qobj.p.speedDefault;
  }
}

this.Controls = class {
  alert(message, callback) {
    callback = callback || function() {};
    bootbox.alert(message, callback);
  }
  prompt(question, callback) {
    bootbox.prompt(question, callback);
  }
  confirm(question, callback) {
    bootbox.confirm(question, callback);
  }
}