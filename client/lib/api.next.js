let spritePathFromShortName = (type, shortName) => {
  let map = {
    enemy: {
      blue: 'branBlue',
      pink: 'brainPink',
      red: 'cyclopsRed',
      yellow: 'cyclopsYellow',
      green: 'goonGreen',
      purple: 'goonPurple'
    },
    gem: {
      bright: 'brightGem',
      dark: 'diamondDark',
      light: 'diamondLight',
      emerald: 'emerald',
      pink: 'pinkGem',
      ruby: 'ruby'
    }
  };

  let filePath;
  if (map[type] && map[type][shortName]) filePath = type + '/' + map[type][shortName] + '.png'
  else filePath = type + '/' + shortName + '.png';
  return 'spriteParts/' + filePath;
};

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

let getDropSpot = (forward) => {
  var direction = game.player.direction;
  var pos = { x: game.player.x, y: game.player.y };
  var offset = forward ? 32 : -32;
  if (direction === 'down') { pos.y += offset; }
  if (direction === 'up') { pos.y -= offset; }
  if (direction === 'left') { pos.x -= offset; }
  if (direction === 'right') { pos.x += offset; }
  var gridPos = Q.gridPos(pos.x, pos.y);
  return gridPos;
};

function GameWorld(defaults, q) {
  defaults.q = q;

  // TODO add an "add" method that would allow actual addition, not just replacement
  defaults.setSprite = function(sprite, x=false, y, asset) {
    let gridPos;
    if (_.isBoolean(x)) {
      gridPos = getDropSpot(x);
      x = gridPos.x;
      y = gridPos.y;
    } else {
      if (x < 1) x = 1;
      if (y < 1) y = 1;
      if (x > 18) x = 18;
      if (y > 13) y = 13;
    }
    const spritesMap = {
      '-': 'blank',
      '': 'blank',
      ' ': 'blank',
      't': 'Tile',
      'tile': 'Tile',
      'g': 'Tower',
      'gem': 'Tower',
      'c': 'Dot',
      'coin': 'Dot',
      'e': 'Enemy',
      'enemy': 'Enemy',
      'p': 'Player',
      'player': 'Player'
    };
    const spriteFilePathMap = {
      Tile: 'tile',
      Tower: 'gem',
      Dot: 'coin',
      Enemy: 'enemy',
      Player: 'player'
    };
    const tilesMap = {
      'blank': 0,
      'plasma': 1,
      'plasma.png': 1,
      'fiery': 2,
      'fiery.png': 2,
      'golden': 3,
      'golden.png': 3,
      'rockSmooth': 4,
      'rockSmooth.png': 4,
      'rockSpeckled': 5,
      'rockSpeckled.png': 5,
      'rockSwirly': 6,
      'rockSwirly.png': 6
    };
    sprite = sprite || '-';
    sprite = sprite.toLowerCase();
    let spriteClass = spritesMap[sprite];

    var levelName;
    for (var p in this.q) {
      if (p.indexOf('Level') === 0) {
        levelName = p;
        break;
      }
    }

    if (!levelName) return;

    let lvl = this.q(levelName).items[0];
    let targetPos = this.q.tilePos(x, y);
    let currentSprite = this.q.stage().locate(targetPos.x, targetPos.y);
    if (currentSprite) {
      currentSprite.destroy();
    }
    else {
      lvl.setTile(x, y, 0);
    }

    if (spriteClass === 'Tile' || spriteClass === 'blank') {
      let spriteNum;
      if (spriteClass === 'Tile') {
        if (asset) {
          spriteNum = tilesMap[asset];
        } else {
          let selectedTile = defaults.sprites.tile;
          spriteNum = tilesMap[selectedTile];
          if (!_.isNumber(spriteNum)) spriteNum = 1;
        }
      } else {
        spriteNum = 0;
      }
      lvl.setTile(x, y, spriteNum);
    } else {
      let spr;
      if (asset) {
        let assetKey = spritePathFromShortName(spriteFilePathMap[spriteClass], asset);
        spr = new this.q[spriteClass](this.q.tilePos(x, y), assetKey);
      }
      else {
        spr = new this.q[spriteClass](this.q.tilePos(x, y));
      }
      this.q.stage().insert(spr);
    }
  };

  return defaults;
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
      this.world = GameWorld(this.world, q);
      this.resetState();
    } else {
      this.world = GameWorld(Game.getDefaults(), q);
    }
    this.paused = false;
    this._realizedRules = [];
  }
  get player() {
    const qPlayer = this.q('Player').items[0];
    const player = new Player(this.q, qPlayer);
    defineProperties(player, qPlayer.p, ['x', 'y', 'speed', 'direction']);
    return player;
  }
  get enemies() {
    const qEnemies = this.q('Enemy');
    const that = this;
    const enemies = qEnemies.items.map(qEnemy => {
      let enemy = new Enemy(that.q, qEnemy);
      defineProperties(enemy, qEnemy.p, ['x', 'y', 'speed', 'direction']);
      return enemy;
    });
    return enemies;
  }
  _select(selector) {
    return Array.from(this.q(selector).items);
  }
  get gems() {
    return this._select('Tower');
  }
  get coins() {
    return this._select('Dot');
  }
  /*
  let count = 1;
  for (let t of game.treasures) { 
    console.write(`Moving to #${count++} at ${t.pos}! `);
    await move(t.pos);
  }
  */
  get treasures() {
    return this._select('.treasure');
  }
  get foreigns() {
    return this._select('.foreign');
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
      },
      scoreChanged: '(function(score) {})',
      startTasks: [],
      worldRules: [],
      worldRepeat: 1
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
  enemyKill(enemy) {
    enemy.destroy();
    if (this.enableEnemyRespawn) {
      this.setTimeout(this.enemy().respawnDelay, () => {
        let newEnemy = new this.q.Enemy(this.q.tilePos(10,7));
        let speedUp = enemy.p.speed;
        newEnemy.p.speed = speedUp + this.enemy().increaseSpeedBy;
        this.q.stage().insert(newEnemy);
      });
    }
  }
  collisions() {
    return this.world.collisions;
  }
  get rules() {
    if (this._realizedRules.length === 0 && this.world.worldRules && _.isArray(this.world.worldRules)) {
      this._realizedRules = this.world.worldRules.map(rule);
    }
    return this._realizedRules;
  }
  get startTasks() {
    if (_.isArray(this.world.startTasks)) return this.world.startTasks;
    return [];
  }
  scoreChanged(score) {
    if (_.isFunction(this.world.scoreChanged)) this.world.scoreChanged(score);
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
  start() {
    this.q.stageScene(this.levelId);
    this.onStart();
  }
  onStart() {
    for (let fun of this.startTasks) {
      if (typeof fun === 'function') {
        let result = fun();
        if (typeof result === 'function') result();
      }
    }
  }
  reset() {
    this.resetState();
    this.start();
  }
  resetState() {
    this.cancelTimeouts();
    this.q.inputs.up = this.q.inputs.down = this.q.inputs.left = this.q.inputs.right = false;
    this.q.state.reset({ score: 0, ammo: 0, lives: this.numberOfLives });
    this._realizedRules = [];
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
  evaluateRules() {
    for (let rule of this.rules) {
      rule.evaluate(this);
    }
  }
  onCoinCollision() {
    // todo HACK
    this.player.scoreInc(this.collisions().coin.scoreInc);
    this.soundPlay(this.collisions().coin.soundPlay);
  }
  onGemPickup() {

  }
  onGemCollision() {
    this.player.scoreInc(this.collisions().gem.scoreInc);
    this.player.ammoInc(this.collisions().gem.ammoInc);
    this.soundPlay(this.collisions().gem.soundPlay);
  }
  afterGemCollision() {
    this.onGemPickup();
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
  onScoreChanged(score) {
    this.scoreChanged(score);
  }
  _componentsDestroy(selector) {
    Array.from(this.q(selector).items).forEach(i => i.destroy());
  }
  gridShow(opacity=.75) {
    this.gridHide();
    const q = this.q,
      width = q.width,
      height = q.height,
      lineW = width - 64,
      lineH = height - 64,
      centerW = width / 2,
      centerH = height / 2,
      items = this._stageItems(),
      rows = items.rows,
      cols = items.cols,
      radius = 0,
      border = 1,
      stroke = 'white',
      drawLine = (x, y, w, h) => {
        let line = q.stage().insert(new q.UI.Container({
          x, y, w, h,
          radius, border, stroke, opacity
        }));
        line.add('gridShow');
        return line;
      };
    for (let row of range(rows + 1)) drawLine(centerW, row * 32 + 32, lineW, 1);
    for (let col of range(cols + 1)) drawLine(col * 32 + 32, centerH, 1, lineH);
  }
  gridHide() {
    this._componentsDestroy('.gridShow');
  }
  posShow() {
    let all = this._stageItems();
    for(let item of all.items) {
      let x, y;
      x = (item.p.x - 16) / 32 - 1;
      y = (item.p.y - 16) / 32 - 1;
      let button = this.q.stage().insert(new this.q.UI.Button(
        {
          y: item.p.y,
          x: item.p.x,
          fill: 'black',
          label: ' ',
          border: 1,
          opacity:.75
        })
      );
      this.q.stage().insert(new this.q.UI.Text({
        label:`${x}, ${y}`,
        color:'white',
        align:'center',
        x:0,
        y:0,
        size:8}
      ), button);
      button.fit(3,3);
      button.add('posShow');
    }
  }
  posHide() {
    this._componentsDestroy('.posShow');
  }
  _stageItems() {
    if (!this._stageItems.cached) {
      let all = Array.from(this.q.stage().items);
      const root = all.shift();
      this._stageItems.cached = {
        rows: root.p.rows - 2,
        cols: root.p.cols - 2,
        items: all
      }
    }
    return this._stageItems.cached;
  }
  row(rowNum=0) {
    const items = this._stageItems();
    if (rowNum < 0) rowNum = 0;
    if (rowNum > items.rows - 1) rowNum = items.rows - 1;
    const startAt = rowNum * items.cols;
    const finishAt = startAt + items.cols;
    return Array.from(items.items.slice(startAt, finishAt));
  }
  col(colNum=0) {
    const items = this._stageItems();
    if (colNum < 0) colNum = 0;
    if (colNum > items.cols - 1) colNum = items.cols - 1;
    let colItems = [];
    for(let i = 0; i < items.rows; i++) {
      let row = this.row(i);
      colItems.push(row[colNum]);
    }
    return colItems;
  }
  infoShow() {
    this.gridShow();
    this.posShow();
  }
  infoHide() {
    this.gridHide();
    this.posHide();
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
  die() {
    game.enemyKill(this.qobj);
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
<h2>move('count direction', ...)</h2>

<p>Call this function to move the player <b>count</b> number of cells for the given <b>direction</b>. The <b>direction</b> may be <b>left, up, right, or down</b>. You can also use <b>l, u, r, or d</b> as shortcuts. This function will take any number of arguments and will keep moving the player until it has evaluated each argument.</p>

<h3>Usage examples</h3>

<div>
<p>To move the player 4 spaces to the left, followed by 2 up, 7 to the right and then 5 down, type this code:</p>
<p>
<code>move('4 left', '2 up', '7 right', '5 down');</code>
</p>
<p>
You can also use the shortcut form like this:
<p>
<p>
<code>move('4 l', '2 u', '7 r', '5 d');</code>
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
      obj.stop(); // TODO this does not seem to solve the entire problem
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
      obj.stop();
      obj.q.inputs[direction] = true;
    };
    obj.stop = function() {
      obj.q.inputs.up = obj.q.inputs.down = obj.q.inputs.left = obj.q.inputs.right = false;
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
          var item = obj.q.stage().locate(x, y, collisionMask);
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
