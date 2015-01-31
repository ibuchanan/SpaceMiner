var boardFromText = function(board) {
  return _.map(board.split('\n'), function(row) {
    return row.split('');
  });
};

this.Game = class {  
  constructor(q, world) {
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
      worldName : "Nemesis",
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
  worldName() {
    // TODO decouple Levels ?
    if (!this.world) return "No world loaded...";
    return this.world.worldName;
  }  
  enableEnemyRespawn() {
    return this.world.enableEnemyRespawn;
  }
  enemy() {
    return this.world.enemy;
  }
  collisions() {
    return this.world.collisions;
  }
  explorerName() {
    return this.world.explorerName;
  }
  numberOfLives() {
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
    this.q.state.reset({ score: 0, ammo: 0, lives: this.numberOfLives() });
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
    player.scoreInc(this.collisions().coin.scoreInc);
    this.soundPlay(this.collisions().coin.soundPlay);
  }
  onGemCollision() {
    player.scoreInc(this.collisions().gem.scoreInc);
    player.ammoInc(this.collisions().gem.ammoInc);
    this.soundPlay(this.collisions().gem.soundPlay);
  }  
  onEnemyCollision(hitPlayer) {
    this.livesDec();
    hitPlayer.destroy();
    if (this.livesRemaining()) {
      var resurrectedPlayer = new this.q.Player(this.q.tilePos(10,7));
      this.q.stage().insert(resurrectedPlayer);
    } else {
      this.reset();
    }
  }
}

this.Player = class { 
  constructor(q) {
    this.q = q;
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