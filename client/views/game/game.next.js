// General helpers
let range = (min, max=null) => {
 let cur = 0;
 if (max === null) max = min;
 else {
  cur = min;
 }
 return {
   [Symbol.iterator]: function*() {
     while (cur < max) yield cur++;
   }
 }
};
window.range = range;

// Code generation and level customization helpers
let _spr = type => val => () => ({sprite:type, asset: val});

let _spriteCollection = customSpriteType => customSpriteName => () => {
  let obj = {
    sprite: customSpriteType
  };
  let [userId, spriteName] = customSpriteName.split('/');
  obj.asset = `${userId}|${customSpriteType}|${spriteName}.cspr`;
  return obj;
};

let _e = _spr('enemy');
let enemies = _spriteCollection('enemy');
enemies.blue = _e('brainBlue');
enemies.pink = _e('brainPink');
enemies.red = _e('cyclopsRed');
enemies.yellow = _e('cyclopsYellow');
enemies.green = _e('goonGreen');
enemies.purple = _e('goonPurple');
window.enemies = enemies;

let _p = _spr('player');
let players = _spriteCollection('player');
players.dark =_p('dark');
players.light = _p('light');
window.players = players;

let _c = _spr('coin');
let coins = _spriteCollection('coin');
coins.blue = _c('blue');
coins.brown = _c('brown');
coins.gold = _c('gold');
coins.green = _c('green');
coins.light = _c('light');
coins.pink = _c('pink');
window.coins = coins;

let _g = _spr('gem');
let gems = _spriteCollection('gem');
gems.bright = _g('brightGem');
gems.dark = _g('diamondDark');
gems.light = _g('diamondLight');
gems.emerald = _g('emerald');
gems.pink = _g('pinkGem');
gems.ruby = _g('ruby');
window.gems = gems;

let _t = _spr('tile');
let tiles = _spriteCollection('tile');
tiles.fiery = _t('fiery');
tiles.golden = _t('golden');
tiles.plasma = _t('plasma');
tiles.smooth = _t('rockSmooth');
tiles.speckled = _t('rockSpeckled');
tiles.swirly = _t('rockSwirly');
tiles.space = _t('-');
window.tiles = tiles;

let spritesAll = [];
for (let group of [enemies, players, coins, gems, tiles]) {
  for (let name of Object.keys(group)) {
    let data = group[name]();
    spritesAll.push('spriteParts/' + data.sprite + '/' + data.asset + '.png');
  }
}
window.spritesAll = spritesAll;

let babelize = code => babel.transform(code, {stage:1, ast:false}).code;
window.babelize = babelize;

let babelRun = code => babel.run(code, {stage:1});
window.babelRun = babelRun;

let spriteFuncs = babelize(`
let sprites = {};

let setup = (...tasks) => {
  for (let fun of tasks) {
    let data;
    if (typeof fun === 'function') {
      let result = fun();
      if (typeof result === 'function') {
        data = result();
      } else {
        data = result;
      }
      sprites[data.sprite] = data.asset + '.png';
    }
  }
};

let startTasks = [];

let start = (...tasks) => { 
  startTasks.length = 0;
  startTasks = startTasks.concat(tasks);
};
`);

let windowFuncsFromES = babelize(`
let invokeDeferSimpleAsync = func => (...opts) => async () => { return await func(...opts) };
window.invokeDeferSimpleAsync = invokeDeferSimpleAsync;

let repeatAsyncn = async (times, func) => {
  for (let i of range(times)) {
    await func(i);
  }
  return;
};
window.repeatAsyncn = repeatAsyncn;

let repeatAsync = invokeDeferSimpleAsync(repeatAsyncn);
window.repeatAsync = repeatAsync;
`);
eval(windowFuncsFromES);

// Default handlers for game events
this.OnWon = function() {
}

// TODO: do we really need this?
if (this.game) this.game.resetState();

this.game = new Game();

var gamePaused = new ReactiveVar(false);
var gameReactive = new ReactiveVar(this.game);

var gameCompleted = Bus.signal('gameCompleted'); // todo clean this up...
var gameLoading = new ReactiveVar(false);

var gameOpen = new ReactiveVar(false);

var chatEnabled = new ReactiveVar(false);

let linkEnabled = new ReactiveVar(false);

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

var buttons = ['gamePause', 'gamePlay', 'gameReset']; //, 'customize', 'fork'];

function argify(args) {
  if (_.isString(args)) args = { level : args };
  if (!args.hasOwnProperty('enableSound')) args.enableSound = true;
  return args;
}
var levelId = 'starter';

function toggleGrid() {
  $('.worldCell').toggleClass('worldCellBorder');
}

function toggleCoords() {
  $('.worldCell').toggleClass('worldCellCoords');
}

Template.game.created = function() {
  var args = argify(this.data);
  levelId = args.level;
  if (args.buttons && _.isArray(args.buttons)) {
    buttons = args.buttons;
  }
  if (args.chatEnabled) {
    chatEnabled.set(true);
  }
  if (args.linkEnabled) {
    linkEnabled.set(true);
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
      game.start();
      gameFocus();
    });
  }, { enableSound: args.enableSound } );
  $('.play-link-href').val(window.location.href).click(function() {
    this.select();
  })
};

Template.game.helpers({
  name: function() {
    if (gameLoading.get() === true) return 'Teleporting...';
    return gameReactive.get().worldName;
  },
  explorerName: function() {
    if (gameLoading.get() === true) return '...';
    return gameReactive.get().explorerName;
  },
  enemiesRespawn: function() {
    if (gameLoading.get() === true) return '...';
    return gameReactive.get().enableEnemyRespawn ? 'true' : 'false';
  },
  allowed: function(button) {
    var allowButton = _.indexOf(buttons, button);
    return showIfTrue(allowButton > -1);
  },
  userOwnsCurrentLevel: function() {
    var level = Levels.findOne({_id: levelId});
    if (level) return Meteor.userId() !== null && level.userId === Meteor.userId();
    return false;
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
  },
  worldRows: function() {
    var rows = 14;
    var cols = 21;    
    var worldRows = [];
    for(var rowNum = 0; rowNum < rows; rowNum++) {
      var row = [];
      for(var colNum = 0; colNum < cols; colNum++) {
        row.push({row:rowNum, col:colNum});
      }
      worldRows.push(row);
    }
    return worldRows;
  },
  linkEnabled: function() {
    return linkEnabled.get();
  }
});

Template.game.events({
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
  // Lets load all the sprites now. We can adapt this later, but for now this is fine:
  let allSprites = window.spritesAll.join(',');
  q.load(allSprites, () => {
    q.load(`${levelId}.spr, ${levelId}.lvl, ${levelId}.til`, () => {
      q.sheet("tiles", levelId + ".til", { tileW: 32, tileH: 32});
      q.sheet('tilesAll', 'tiles.png', {tileW: 32, tileH: 32});
      q.compileSheets(levelId + ".spr","sprites.json");
      q.compileSheets("basicShot.png","shot.json");
      // TODO remove hack
      var world = q.assets[levelId + 'World'];
      callback(q, world);
    }, {reload:true});
  });
}

function levelMapCreate(q, leveld) {
  let world = {worldRepeat : 1};
  q.TileLayer.extend("Level" + levelId,{
    init: function() {
      this._super({
        type: SPRITE_TILES,
        dataAsset: levelId + ".lvl",
        sheet: 'tilesAll'
      });
    },
    setup: function() {
      // Clone the top level array
      let tiles = this.p.tiles = this.p.tiles.concat();
      let size = this.p.tileW;

      const map = {
        'S': 'S',
        '-': 'Dot',
        'G': 'Tower',
        'E': 'Enemy',
        'P': 'Player'
      };

      world = q.assets[levelId + 'World'];

      const tilesMap = {
        'plasma.png': 1,
        'fiery.png': 2,
        'golden.png': 3,
        'rockSmooth.png': 4,
        'rockSpeckled.png': 5,
        'rockSwirly.png': 6
      };

      const tileNum = tilesMap[world.sprites.tile];
      const customTile = game.customSprite('tile');

      for(let y=0;y<tiles.length;y++) {
        let row = tiles[y] = tiles[y].concat();
        for(let x =0;x<row.length;x++) {
          var tile = row[x];
          if (tile === 'S') {
            continue;
          }
          if (tile === 't') {
            if (customTile !== '') row[x] = customTile;
            else row[x] = tileNum;
          }
          if (tile !== 't' && tile !== 1) {
            var className = map[String(tile)];
            var sprite = new q[className](q.tilePos(x,y));
            this.stage.insert(sprite);
            if (tile === 'E' || tile === 'P') {
              this.stage.insert(new q.Dot(q.tilePos(x,y)));
            }
            row[x] = 0;
          }
        }
      }
    }
  });

  q.scene(levelId, function(stage) {
    var map = stage.collisionLayer(new q["Level" + levelId]());
    map.setup();
    var score = new q.Score();
    var box = stage.insert(new q.UI.Container({
      //x: score.p.w/2 + 5, y: score.p.h/2 + 5, fill: 'rgba(0,0,0,0.5)'
      x: 25, y: 15, fill: 'rgba(0,0,0,0.5)'
    }));
    box.insert(score);
    box.fit();
    if (world.worldRepeat > 1) stage.add("viewport").follow(q('Player').first());
  });
}

function getDefaults() {
  return Game.getDefaults();
}

function parseWorldDefinitionFromScript(worldScript, defaults) {
  try {
    let funcCode = createOverrideFuncCode(worldScript, defaults);
    funcCode = funcCode.replace('(function (defaults', 'return (function (defaults');
    funcCode = funcCode = `(function(defaults) {
var worldRules = [];
var rules = function() {
  for (var _i = 0; _i < arguments.length; _i++) {
    worldRules.push(arguments[_i]);
  }
}

${spriteFuncs}

${funcCode}`;
    funcCode = funcCode.replace('return __obj__;\n})', 'return __obj__;\n})(defaults)\n});');
    let func = eval(funcCode); // yep, "eval can be harmful"
    var obj = {};
    if (_.isFunction(func)) {
      obj = func(defaults);
      return obj;
    } else {
      throw "parseWorldDefinitionFromScript could not parse function from code: " + funcScript;
    }
  } catch(err) {
    console.log(err);
  }
  return {};
}
// TODO remove this hack
window.ParseWorldDefinitionFromScript = parseWorldDefinitionFromScript;

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
  var script = 'var __obj__ = {};\n';
  script += '\n  /* Begin user code */\n\n  ' + worldScript +'\n\n  /* End user code */\n'; 

  _.each(defaults, function(value, key) {
    if (value.constructor === Object) {
      script += `\n  try { __obj__.${key} = __merge__(defaults.${key}, ${key}); }\n`
    } else {
      script += `\n  try { __obj__.${key} = ${key}; }\n`
    }
    script += `  catch(e) { __obj__.${key} = defaults.${key}; }\n`;
  });

  script += '\n  return __obj__;\n';

  let scriptCode =
`(defaults) => {
${script}
};`;
  let result = babel.transform(scriptCode, {stage:1, ast:false});
  return result.code;
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

function Qloaded() {
  return window.Q !== undefined;
}

function playerStop() {
  Q.inputs.up = Q.inputs.down = Q.inputs.left = Q.inputs.right = false;
}

function _move(props, cells, direction, next) {
  var distance = cells * 32;
  var destination = 0;

  direction = direction || 'left';
  direction = direction.toLowerCase();

  var directionMap = {
    'left': 'left',
    'l': 'left',
    'right': 'right',
    'r': 'right',
    'up': 'up',
    'u': 'up',
    'down': 'down',
    'd': 'down'
  };

  direction = directionMap[direction];
  direction = direction || 'left';

  if (direction === 'left' || direction === 'up') {
    distance = -distance;
  }
  if (direction === 'left' || direction === 'right') {
    destination = props.x + distance;
    //destination = props.destX + distance;
  } else {
    destination = props.y + distance;
    //destination = props.destY + distance;
  }

  props.travel = {
    direction: direction,
    destination: destination,
    next: next,
    step: function(p) {
      Q.inputs[this.direction] = true;

      if ((this.direction === 'right' || this.direction === 'left') &&
          p.x === this.destination)
      {
        playerStop();
        delete p.travel;
        if (this.next) this.next();
      }
      else if  ((this.direction === 'up' || this.direction === 'down') &&
               p.y === this.destination)
      {
        playerStop();
        delete p.travel;
        if (this.next) this.next();
      }
    }
  };

  if (props.speed === 0) props.speed = props.speedDefault;
}
window._move = _move;

let r, right, l, left, u, up, d, down, pt, point, teleport, tp;

r = right = r => { return {r} };
l = left = l => { return {l} };
d = down = d => { return {d} };
u = up = u => { return {u} };
pt = point = teleport = tp = (x, y) => `${x} ${y}`;

window.r = window.right = r;
window.u = window.up = u;
window.l = window.left = l;
window.d = window.down = d;
window.pt = window.point = window.tp = window.teleport = pt;

let moveString = m => {
  let direction = Object.keys(m)[0]
  return m[direction] + ' ' + direction;
}

let moveNeedsPlayerProps = arg => {
  if (!_.isObject(arg)) return true;
  if (_.isObject(arg) && !_.has(arg, 'spriteProperties')) return true;
};

let makeMoves = moves => moves.map(move => {
  if (_.isObject(move) && !_.isFunction(move)) return moveString(move);
  return move;
});

let move = (...args) => {
 let [props, ...moveArgs] = args;
 if (moveNeedsPlayerProps(props)) {
  props = game.player.qobj.p;
  if (moveArgs.length > 0) {
    moveArgs.unshift(args[0]);
  } else {
    moveArgs = [args[0]];
  }
 }

  let execute = (resolve) => {
   let moves = makeMoves(moveArgs);
   let firstStep = true;
   let runStep = index => {
     var nextIndex = index+1;
     if (index < moves.length) {
       var move = moves[index];
       if (_.isString(move) && move.indexOf(' ') === -1) {
         var cmd = move.toLowerCase();
         var map = {
           'cloak': game.player.cloak,
           'fire' : game.player.fire,
         };
         if (_.has(map, cmd))  {
           map[cmd]();
         }
         runStep(nextIndex);
       } else  if (_.isFunction(moves[index])) {
         moves[index]();
         runStep(nextIndex);
       } else {
        var step = moves[index].split(' ');
        var num = parseInt(step[0]);
        var y = parseInt(step[1]);
        if (!_.isNaN(y)) {
          num++;
          y++;
          props.speed = 0;
          props.directionOld = props.direction;
          props.direction = '';
          props.x = (num * 32) + 16;
          props.y = (y * 32 + 16);
          game.setTimeout(100, function() {
            runStep(nextIndex);
          });
        } else {
          _move(props, num, step[1], function() {
             runStep(nextIndex);
          });
        }
      }
     }
     else {
       resolve();
     }
   }
   runStep(0);
 };
 return new Promise(execute);
}
window.move = move;

function command(cmd, ...args) {
  if (cmd === 'move') {
    let [x, y, ...moves] = args;
    return {
      x,
      y,
      moves
    };
  }
  return {};
};
window.command = command;

function run(name, ...args) {
  let moves = makeMoves(args);
  var execute = function(resolve) {
    game.player[name](...moves, resolve);
  };
  return new Promise(execute);
}
window.run = run;

let Rule = class {
  constructor({
    score = -1,
    enemyCount = -1,
    when = game => false,
    once = true,
    continuous = false,
    then = game => {}
  }) {
    this.score = score;
    this.enemyCount = enemyCount;
    this.when = when;
    this.once = once;
    this.executed = false;
    this.continuous = continuous && once == false;
    this.then = then;
  }

  evaluate(game) {
    if (this.continuous || (this.once && !this.executed)) {
      let shouldExecute = false;

      if (this.score > -1) {
        let score = game.q.state.get('score');
        shouldExecute = score >= this.score;
      } else if (this.enemyCount > -1) {
        let enemyCount = game.enemies.length;
        shouldExecute = enemyCount === this.enemyCount;
      }

      let execute = () => {
        if (_.isFunction(this.then)) this.then(game);
        this.executed = true; // TODO: shoudl we run this even if the then is busted?
      };

      if (shouldExecute) execute();

      if (this.executed) return;

      if (_.isFunction(this.when)) shouldExecute = this.when(game);

      if (shouldExecute) execute();
    }
  }
};
window.rule = definition => new Rule(definition);

let spriten = ({
  sprite = 't',
  start = {
    x: 1,
    y: 1
  },
  asset
} = {}) => {
  game.world.setSprite(sprite, start.x, start.y, asset);
};
window.spriten = spriten;

let walln = ({
  start = {
    x : 1,
    y : 1
  },
  size = 18,
  dir = 'r',
  sprite = 't',
  l = null,
  r = null,
  u = null,
  d = null,
  asset
  } = {}) => {
  if (l !== null) dir = 'l';
  if (r !== null) dir = 'r';
  if (u !== null) dir = 'u';
  if (d !== null) dir = 'd';
  if (dir === 'r' || dir === 'right') {
    if (size > 18) size = 18;
    if (start.x > 1 && (start.x + size > 18)) {
      size -= start.x;
      size++;
    }
    for(let x = start.x; x < start.x + (size); x++) {
      game.world.setSprite(sprite, x, start.y, asset);
    }
  }
  if (dir === 'l' || dir === 'left') {
    if (size > 18) size = 18;
    if (start.x < 18 && (start.x - size < 0)) {
      size -= (18 - start.x);
    }
    for(let x = start.x; x > start.x - (size); x--) {
      game.world.setSprite(sprite, x, start.y, asset);
    }
  }
  if (dir === 'd' || dir === 'down') {
    if (size > 12) size = 12;
    if (start.y > 1 && (start.y + size > 12)) {
      size -= start.y;
    }
    for(let y = start.y; y < start.y + (size); y++) {
      game.world.setSprite(sprite, start.x, y, asset);
    }
  }
  if (dir === 'u' || dir === 'up') {
    if (size > 12) size = 12;
    if (start.y < 12 && (start.y - size < 0)) {
      size -= (12 - start.y);
    }
    for(let y = start.y; y > start.y - (size); y--) {
      game.world.setSprite(sprite, start.x, y, asset);
    }
  }
};
window.walln = walln;
// Examples:
//wall();
//wall({size:16, dir:'l', start:{x:16,y:1}});
//wall({size:10, dir:'u', start:{x:1,y:10}});

let minen = ({
  start = {
    x : 1,
    y : 1
  },
  size = 1,
  dir = 'r',
  sprite = 'c',
  l = null,
  r = null,
  u = null,
  d = null,
  asset
  } = {}) => {
  if (l !== null) dir = 'l';
  if (r !== null) dir = 'r';
  if (u !== null) dir = 'u';
  if (d !== null) dir = 'd';  
  walln({start, size, sprite, dir, asset});
};
window.minen = minen;

let landn = ({
  start = {
    x: 1,
    y: 1
  },
  asset
} = {}) => {
  const sprite = 'p';
  game.world.setSprite(sprite, start.x, start.y, asset);
};
window.landn = landn;

let manualPilotn = () => {
  window.gameSetup.controls(true);
  Q.input.keyboardControls();
  Q.input.joypadControls();
};
window.manualPilotn = manualPilotn;

let boxn = ({
  start = {
    x : 1,
    y : 1
  },
  size = 4,
  sprite = 't',
  asset
  } = {}) => {
  walln({start, size, sprite, dir:'r', asset});
  walln({start: { x : start.x + size - 1, y: start.y }, size, sprite, dir : 'd', asset});
  walln({start: { x : start.x + size - 1, y: start.y + size - 1}, size, sprite, dir : 'l', asset});
  walln({start: { x : start.x, y: start.y + size - 1}, size, sprite, dir : 'u', asset});
};
window.boxn = boxn;

// Examples:
//box();
//box({sprite:'t', size:8});
//box({start:{x:1,y:1}, size: 4, sprite: 't'});
//box({start:{x:7,y:7}, size: 4, sprite: 't'});
//box({start:{x:5,y:5}, size: 5, sprite: 't'});

let blockn = ({
  start = {
    x : 1,
    y : 1
  },
  size = 4,
  sprite = 't',
  asset
  } = {}) => {
  for(let y = start.y; y < start.y + size; y++) {
    walln({start: {x:start.x, y:y}, size, sprite, dir: 'r', asset});
  }
};
window.blockn = blockn;
// Examples:
//block({start:{x:1,y:1}, size: 5, sprite:'g'});

let filln = ({
  sprite = 't',
  asset
  } = {}) =>
{
  for(let y = 1; y < 13; y++) {
    walln({start: {x:1, y:y}, size:18, sprite, dir: 'r', asset});
  }
};
window.filln = filln;

let duplicaten = (count, 
  start = {
    start: {
      x : 1,
      y : 1
    }
  },
  ...assets) => {
  let x = start.start.x;
  let y = start.start.y;
  for(let i of range(count)) {
    // TODO: handle moe than just hard-coded right direction
    for (let asset of assets) {
      if (typeof asset === 'function') asset = asset();
      spriten({start:{x:x, y:y}, sprite:asset.sprite, asset:asset.asset});
      x++;
    }
  }
};
window.duplicaten = window.dupn = duplicaten;

let invoke = (list, funcName, ...args) => {
  let array = Array.from(list);
  for(let item of array) {
    if (_.isFunction(item[funcName])) item[funcName](...args);
  }
};

Array.prototype.invoke = function(funcName, ...args) {
  invoke(this, funcName, ...args);
};

let at = (x=1, y=1) => ({start:{x:x, y:y}});
let _sprite = (type='t') => ({sprite:type});
let dir = (direction='d') => ({dir:direction});
window.at = at;
window._sprite = _sprite;
window.dir = dir;

let makeFuncs = (factoryFunc, funcLongNames) => {
  funcLongNames.map(funcLongName => {
    let initial = funcLongName[0];
    window[funcLongName] = window[initial] = () => factoryFunc(initial);
  });
};
makeFuncs(_sprite, ['gem', 'enemy', 'coin', 'tile', 'player']);

window.len = window.size = window.height = window.width = dimension => ({size:dimension});

let directionObjectAdjust = val => {
  ['l', 'r', 'u', 'd'].map(dir => {
    if (val.hasOwnProperty(dir)) val[dir] = true;
  });
};

let invokeDefer = funcName => (...opts) => {
  let props = {};
  for (let opt of opts) {
    let val = opt;
    if (typeof opt === 'function') val = opt();
    directionObjectAdjust(val);
    Object.assign(props, val);
  }
  return () => window[funcName + 'n'](props);
};
window.invokeDefer = invokeDefer;

let invokeDeferOnWindow = funcName => (...args) => {
  return () => window[funcName + 'n'](...args);
};
window.invokeDeferOnWindow = invokeDeferOnWindow;

let invokeDeferSimple = func => (...opts) => () => func(...opts);
window.invokeDeferSimple = invokeDeferSimple;

let repeatn = (times, func) => {
  for (let i of range(times)) func(i);
};
window.repeatn = repeatn;

let repeat = invokeDeferSimple(repeatn);
window.repeat = repeat;

['sprite', 'wall', 'mine', 'fill', 'box', 'block', 'land', 'manualPilot'].map(funcName =>
 window[funcName] = invokeDefer(funcName));

['duplicate', 'dup'].map(funcName => 
  window[funcName] = invokeDeferOnWindow(funcName));

let funcCombine = opts => {
  let runAllFuncs = () => {};
  if (opts.length > 0) {
    runAllFuncs = () => {
      for(let fun of opts) {
        if (typeof fun === 'function') {
          let result = fun();
          if (typeof result === 'function') result();
        }
      }
    };
  }
  return runAllFuncs;
};

let wait = (milliseconds, ...opts) => {
  let waiter = () => {
    game.setTimeout(milliseconds, funcCombine(opts));
  }
  return waiter;
};
window.wait = wait;

let recur = (milliseconds, state, func) => {
  let intervalId = null;
  let wrappedFunc = () => {
    func(game.iterationForInterval(intervalId), state);
  };
  let interval = () => {
    intervalId = game.setInterval(milliseconds, wrappedFunc);
  }
  return interval;
};
window.recur = recur;

let score = (...opts) => {
  let props = {};
  if (opts.length < 2) throw 'Must pass at least two arguments to score(...) function';
  // Assume number here:
  let scoreMin = parseInt(opts.shift());
  props.score = scoreMin;
  props.then = funcCombine(opts);
  return props;
};
window.score = score;

let collision = (at, func) => {
    let targetPos = Q.tilePos(at.start.x, at.start.y);
    let targetSprite = Q.stage().locate(targetPos.x, targetPos.y);
    if (targetSprite && targetSprite.sensor) {
        targetSprite.on('sensor', func);
    }
};
window.collision = collision;

let warpn = (id = 'starter') => {
    game.pause();
    window.location = `/play?id=${id}`;
};
window.warpn = warpn;

// Example:
/*
game.world.rules = rules(
  score(400, box(gem, size(5), at(2,2))),
  score(1000, wait(3000,
    wall(enemy, at(4,1)),
    wall(tile, left, at(4,4))
    )
  )
);
*/

let navigate = invokeDeferSimple(move);
window.navigate = navigate;
window.nv = navigate;

function configureQuintus(callback, options) {
  /*
  if (Qloaded()) {
    callback(window.Q);
    return window.Q;
  }
  */

  if (!options) options = { enableSound: true };

  function configureCanvas(q) {
    var setup = q.setup('game', {
      width: 640, height: 448
      //scaleToFit: true,
      //maximize: 'touch'
    });
    if (options.enableSound) setup.enableSound();
    window.gameSetup = setup;
    // Automatically enable the keyboard if we are on the /play route
    const pathname = window.location.pathname;
    const search = window.location.search;
    if (pathname.indexOf('/play') === 0 && search.indexOf('mode=preview') === -1) {
      window.gameSetup.controls(true);
      q.input.keyboardControls();
      q.input.joypadControls();      
    }
  };

  var modules = ["Sprites", "Scenes", "Input", "2D", "UI", "Anim"];
  var audioSupported = [];
  if (options.enableSound) {
    modules.push("Audio");
    audioSupported.push("wav");
  }
  var includes = modules.join(", ");

  Q = window.Q = Quintus({
    development: true,
    audioSupported: audioSupported });
  Q.include(includes);
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

  /*
    // Sample with groups:

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

  Q.loadAssetLevel = function(key,src,callback,errorCallback) {
    let fileParts = src.split("."), worldName = fileParts[0];
    Q.loadAssetOther(key, "/collectionapi/levels/" + worldName, function(key, val) {
      let obj = JSON.parse(val)[0];
      let board = obj.board;
      board = boardFromText(board);

      let customSprites = obj.customSprites;
      if (customSprites && _.isObject(customSprites)) {
        let customSpritesPaths = [];
        for(let key in customSprites) {
          customSpritesPaths.push(customSprites[key]);
        }
        Q.load(customSpritesPaths, function() {
          for(let key in customSprites) {
            var customSprite =  customSprites[key];
            if (customSprite !== '') {
              Q.sheet(`custom-${key}Sheet`, customSprite, {tileW:32, tileH: 32});
              let frames = Array.from(range(Q.sheets[`custom-${key}Sheet`].w/32));
              Q.animations(key, { move: { frames, rate: 1, loop: true } });
            }
          }
          finishLoadingLevel();
        });
      } else {
        finishLoadingLevel();
      }

      function finishLoadingLevel() {
        /* Now check if this is a level that has a 'script' instead */
        let defaults = getDefaults();
        let worldRepeat = defaults.worldRepeat;
        if (_.has(obj, 'script') && _.isString(obj.script)) {
          let world = parseWorldDefinitionFromScript(obj.script, defaults);
          if (customSprites) world.customSprites = customSprites;
          worldRepeat = world.worldRepeat;
          // TODO remove hack
          world._id = worldName;
          Q.assets[worldName + 'World'] = world;

          // First, if a world property was set, layer it over the defaults
          var worldSprites = worldOverride(world.world, defaults.world);

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
              var start = g.start || null;
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

            var startingRow = 0,
                startingCol = 0;

            // Now let's iterate...
            _.each(gs, function(g) {
              var start = g.start;
              var sprites = g.sprites;
              var repeat = g.repeat;
              if (start) {
                var coords = start.split(',');
                if (coords.length < 2) coords = [0,0];
                startingRow = parseInt(coords[0]);
                startingCol = parseInt(coords[1]);
              }

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

              var wrappedAtRow = 0;
              var wrappedAtCol = 0;

              for(var i = 0; i < iterations; i++) {
                var currentStartingRow = startingRow;
                var currentStartingCol = startingCol;

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
                      if (cell !== '.') {
                        var thisCol = currentStartingCol + colIndex;
                        if (thisCol < worldWidth) {
                          worldSprites[thisRow][thisCol] = cell;
                        }
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
                        if (cell !== '.') {
                          var thisRow = currentStartingRow + rowIndex;
                          worldSprites[thisRow][thisCol] = cell;
                        }
                      }
                    });
                  }
                  startingCol += (width);
                }
              }
            });
          }

          // TODO: is the second param necessary any more?
          board = boardFromNewToOld(createBoardFromWorld(worldSprites, defaults.world));

          if (_.has(world, 'scoreChanged')) {
            try {
              let fun = eval(world.scoreChanged);
              if (_.isFunction(fun)) world.scoreChanged = fun;
            } catch (excp) {
              console.error("Could not parse world.scoreChanged:");
              console.error(world.scoreChanged);
            }
          }
        } else {
          defaults._id = worldName;
          defaults.worldName = obj.name;
          Q.assets[worldName + 'World'] = defaults;
        }

        let newBoard = board;
        if (worldRepeat > 1) {
          let tilesToDuplicate = board.slice(1, board.length-1);
          let clonedTiles = JSON.parse(JSON.stringify(tilesToDuplicate));
          let lastRow = board.pop();
          newBoard = Array.concat(board, clonedTiles);
          newBoard.push(lastRow);

          if (worldRepeat > 2) {
            let newNewBoard = [];
            for(let row of newBoard) {
              let last = row.pop();
              let slice = row.slice(1, row.length-1);
              row = row.concat(slice);
              row.push(last);
              newNewBoard.push(row);
            }
            newBoard = newNewBoard;
          }
        }

        let seenPlayer = false;
        newBoard = newBoard.map(row => row.map(sprite => {
          let val = sprite;
          if ((sprite === 'P' || sprite === 'p')) {
            if (seenPlayer) val = '-';
            seenPlayer = true;
          }
          return val;
        }));

        Q.assets[key] = newBoard;

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
      } // /finishLoadingLevel
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

  Q.loadAssetCustomSprite = (key,src,callback,errorCallback) => {
    let img = new Image();
    img.onload = () => { callback(key, img); } ;
    img.onerror = errorCallback;
    let spriteUrl = getSpriteUrlFromName(src);
    img.src = spriteUrl;
  }
  Q.assetTypes.cspr = 'CustomSprite';

  Q.loadAssetTile = function(key,src,callback,errorCallback) {
    var img = new Image();
    img.onload = function() { callback(key,img); };
    img.onerror = errorCallback;
    img.src = Q.assetUrl("levelTiles/", src);
  };
  Q.assetTypes.til = 'Tile';

  function travelAdjust(direction, val) {
    var overage = val % 16;
    if (overage > 0)  {
      if (direction === 'right' || direction === 'down') {
        val -= overage;
        return val;
      }
      if (direction === 'left' || direction === 'up')  {
        val += overage;
        return val;
      }
    }
    return val;
  }

  Q.UI.Button.extend("Score", {
    init: function(p) {
      this._super({
        label: "000000",
        fontColor: "yellow",
        x:50,
        y:0
      });
      Q.state.on("change.score", this, "scoreChange");
    },
    scoreChange: function(score) {
      if (score <= 99999) {
        score = ("" + score);
      }
      this.p.label = score;
      game.onScoreChanged(parseInt(score));
    }
  });

  Q.component("playerControls", {
    // default properties to add onto our entity
    defaults: { speed:200 },

    added: function() {
      var p = this.entity.p;

      // add in our default properties
      Q._defaults(p,this.defaults);

      if(!p.stepDistance) { p.stepDistance = 32; }
      if(!p.stepDelay) { p.stepDelay = 0.2; }

      p.stepWait = 0;
      this.entity.on("step",this,"step");
      this.entity.on("hit", this, "hit");
    },

    hit: function(col) {
      if (game.onCollide) game.onCollide.call(this, col);

      var p = this.entity.p;

      if (col.tile) {
        if (col.collided && (col.obj.p.sheet === 'tiles' || col.obj.p.sheet === 'tilesAll')) {
          p.stepping = false; // TODO no idea why not working right...
          p.x = p.origX;
          p.y = p.origY;
        }
      }
    },

    step: function(dt) {
      // TODO remove hack
      game.evaluateRules();
      var p = this.entity.p;
      var doneWithTravel = false;

      var adjust_waiting_time_based_on_elapsed_time = function(elapsedTime) {
        p.stepWait -= elapsedTime;
      };

      var adjust_x_and_y_if_still_stepping = function() {
        if(p.stepping) {
          p.x += p.diffX * dt / p.stepDelay;
          var nextY = p.y + p.diffY * dt / p.stepDelay;
          p.y = nextY;
        }
      };

      var still_waiting = function() {
        return p.stepWait > 0;
      };

      var move_sprite_to_x_and_y_locations_if_still_stepping_and_apply_travel_if_needed = function() {
        if(p.stepping) {
          p.x = p.destX;
          p.y = p.destY;
          if (p.travel) {
            p.travel.step(p);
            doneWithTravel = true;
          }
        }
      };

      var adjust_diffX_and_diffY_based_on_direction = function() {
        p.diffX = 0;
        p.diffY = 0;

        if(Q.inputs.left) {
          p.diffX = -p.stepDistance;
          p.angle = -90;
          p.direction = 'left';
        } else if(Q.inputs.right) {
          p.diffX = p.stepDistance;
          p.angle = 90;
          p.direction = 'right';
        }

        if(Q.inputs.up) {
          p.diffY = -p.stepDistance;
          p.angle = 0;
          p.direction = 'up';
        } else if(Q.inputs.down) {
          p.diffY = p.stepDistance;
          p.angle = 180;
          p.direction = 'down';
        }
      };

      var apply_travel_if_needed_and_not_done_traveling_yet = function() {
        if (!doneWithTravel && p.travel) {
          p.travel.step(p);
        }
      };

      var stop_stepping = function() {
        p.stepping = false;
      };

      var adjust_origin_and_dest_positions_and_resume_waiting_and_stepping_when_any_diffY_or_diffX = function() {
        if(p.diffY || p.diffX ) {
          p.stepping = true;
          p.origX = p.x;
          p.origY = p.y;
          p.destX = p.x + p.diffX;
          p.destY = p.y + p.diffY;
          p.stepWait = p.stepDelay;
        }
      };

      game.onScan();

      adjust_waiting_time_based_on_elapsed_time(dt);

      adjust_x_and_y_if_still_stepping();

      if (still_waiting()) return;

      move_sprite_to_x_and_y_locations_if_still_stepping_and_apply_travel_if_needed();

      adjust_diffX_and_diffY_based_on_direction();

      apply_travel_if_needed_and_not_done_traveling_yet();

      stop_stepping();

      adjust_origin_and_dest_positions_and_resume_waiting_and_stepping_when_any_diffY_or_diffX();
    }
  });

  let applySpriteProps = (target, asset, sheetName, specialSheetName) => {
    if (asset) {
      target.asset = asset;
    } else {
      let sheetNameCompare = sheetName;
      if (specialSheetName) sheetNameCompare = specialSheetName;
      if(game.customSprite(sheetNameCompare) !== '') {
        target.sheet = `custom-${sheetNameCompare}Sheet`;
      } else {
        target.sheet = sheetName;
      }
    }
  };

  let defineSpriteProps = () => {
    ['Dot', 'Enemy', 'Player'].forEach(className => {
      Object.defineProperty(Q[className].prototype, 'pos', {
        get: function() {
          let pos = Q.gridPos(this.p.x, this.p.y);
          pos.x--;
          pos.y--;
          return point(pos.x, pos.y);
        }
      });
    });
  };

  Q.component('treasure', {});
  Q.component('foreign', {});
  Q.component('posShow', {});
  Q.component('gridShow', {});

  Q.Sprite.extend("Player", {
    init: function(p, asset) {
      let props = {
        type: SPRITE_PLAYER,
        sprite: 'player',
        collisionMask: SPRITE_TILES | SPRITE_ENEMY | SPRITE_DOT
      };
      applySpriteProps(props, asset, 'player');
      this._super(p,props);
      this.add("2d,playerControls,laser,animation");
      if(game.customSprite('player') !== '') {
        this.play('move');
      }
    }
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
      if(this.p.angle === 0){
        this.p.x += this.p.speed * dt;
      }
      else if(this.p.angle === 180){
        this.p.x -= this.p.speed * dt;
      }
      else if(this.p.angle === -90){
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
      this.debind();
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
        if(Q.inputs.fire){
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
        game.setTimeout(1000, function(){
          entity.p.canFire = true; 
        });
      }
    }
  });

  function centersWithinRange(obj1, obj2, range) {
    var obj1X = obj1.p.x;
    var obj1Y = obj1.p.y;
    var obj2X = obj2.p.x;
    var obj2Y = obj2.p.y;
    var distX = Math.abs(obj1X - obj2X);
    var distY = Math.abs(obj1Y - obj2Y);
    return distX < range && distY < range;
  }
  const COL_RANGE = 32;

  // Create the Dot sprite
  Q.Sprite.extend("Dot", {
    init: function(p, asset, sheetName='dot') {
      let props = {
        type: SPRITE_DOT,
        // Set sensor to true so that it gets notified when it's
        // hit, but doesn't trigger collisions itself that cause
        // the player to stop or change direction
        sensor: true
      };
      const sheetNameSpecial = sheetName === 'dot' ? 'coin' : 'gem';
      applySpriteProps(props, asset, sheetName, sheetNameSpecial);
      this.count = 1;
      this._super(p,props);
      this.on("sensor");
      this.on("inserted");
      this.on("destroyed");
      this.add('foreign,treasure');
      if(game.customSprite(sheetNameSpecial) !== '') {
        //this.play('move');
      }
    },

    // When a dot is hit..
    sensor: function() {
      var col = centersWithinRange(this, arguments[0], COL_RANGE);
      if (col) {
        game.onCoinCollision();
        this.destroy();
      }
    },

    // When a dot is inserted, use it's parent (the stage)
    // to keep track of the total number of dots on the stage
    inserted: function() {
      this.stage.dotCount = this.stage.dotCount || 0;
      this.stage.dotCount++;
    },

    destroyed: function() {
      let count = this.count;
      this.count--;
      this.stage.dotCount -= count;
      // If there are no more dots left, just restart the game
      // TODO move to next level from page
      if(this.stage.dotCount === 0) onLevelComplete();
      this.debind();
    }
  });

  // Tower is just a dot with a different sheet - use the same
  // sensor and counting functionality
  Q.Dot.extend("Tower", {
    init: function(p, asset) {
      this._super(Q._defaults(p,{}), asset, 'tower');
    },
    sensor: function() {
      var col = centersWithinRange(this, arguments[0], COL_RANGE);
      if (col) {
        game.onGemCollision();
        this.destroy();
        game.setTimeout(25, () => game.afterGemCollision());
      }
    }
  });

  // Return a x and y location from a row and column
  // in our tile map
  Q.tilePos = function(col,row) {
    return { x: col*32 + 16, y: row*32 + 16 };
  }

  Q.gridPos = function(x, y) {
    return { x: (x - 16)/32, y: (y - 16)/32 };
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

      switch(p.direction) {
        case "left": p.vx = -p.speed; break;
        case "right":p.vx = p.speed; break;
        case "up":   p.vy = -p.speed; break;
        case "down": p.vy = p.speed; break;
      }

      if (p.travel) handleTravel(p);

      else {
        if(Math.random() < p.switchPercent / 100) {
          this.tryDirection();
        }
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

    /*
      let customSprites = obj.customSprites;
      if (customSprites && _.isObject(customSprites)) {
        let customSpritesPaths = [];
        for(let key in customSprites) {
          customSpritesPaths.push(customSprites[key]);
        }
        Q.load(customSpritesPaths, function() {
          for(let key in customSprites) {
            var customSprite =  customSprites[key];
            if (customSprite !== '') {
              Q.sheet(`custom-${key}Sheet`, customSprite, {tileW:32, tileH: 32});
              let frames = Array.from(range(Q.sheets[`custom-${key}Sheet`].w/32));
              Q.animations(key, { move: { frames, rate: 1, loop: true } });
            }
          }
          finishLoadingLevel();
        });
      } else {
        finishLoadingLevel();
      }
    */

  Q.Sprite.extend("Enemy", {
    init: function(p, asset) {
      let props = {
        speed: 150,
        type: SPRITE_ENEMY,
        sprite: 'enemy',
        collisionMask: SPRITE_PLAYER | SPRITE_TILES | SPRITE_SHOT
      };
      applySpriteProps(props, asset, 'enemy');
      this._super(p, props);
      this.add("2d,enemyControls,foreign,animation");
      this.on("hit.sprite",this,"hit");
      this.on("destroyed");
      if(game.customSprite('enemy') !== '') {
        this.play('move');
      }
    },

    hit: function(col) {
      if(col.obj.isA("Player")) {
        if (col.obj.p.cloaked !== true) {
          game.enemyKill(this);
          game.onEnemyCollision(col.obj);
        }
      }
      else if(col.obj.isA("Shot")){
        game.player.scoreInc(1000);
        game.enemyKill(this);
      }
    },

    destroyed: function() {
      this.debind();
    }
  });

  defineSpriteProps();

  Q.load('sprites.json, gem1.wav, coin1.wav, victory1.wav, shot.json, basicShot.png, tiles.png',  function() {
    /* var levelId = Router.current().params.levelId;
    if (levelId) levelPlay(levelId);
    */
    callback(Q);
  });

  return Q;
}

this.gameFocus = function() {
  Meteor.setTimeout(function() {
    $('#game').focus();
  }, 125);
}

this.gameShow = function() {
  Session.set('gameVisible', true);
  Session.set('gameComplete', false);
}