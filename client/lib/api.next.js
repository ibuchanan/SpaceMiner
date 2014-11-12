this.Game = class {  
  constructor(q, levelId) {
    this.q = q;
    this.levelId = levelId;
    this.paused = false;
  }
  name() {
    // TODO decouple Levels ?
    var level = Levels.findOne({_id: this.levelId});
    if (level) return level.name;
    return 'No game loaded...';
  }
  reset() {
    this.q.state.reset({ score: 0, ammo: 0, lives: 2, stage: 1});
    this.q.stageScene(this.levelId);
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
  playSound(soundName) {
    this.q.audio.play(soundName);
  }
}

this.Player = class { 
  constructor(q) {
    this.q = q;
  }  
  incScore(amount) {
    this.q.state.inc('score', amount);
  }  
  getScore() {
    return this.q.state.get('score');
  }  
  decScore(amount) {
    this.q.state.dec('score', amount);
  }  
  incAmmo(amount) {
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

/*enemy = {
  incSpeed: function() {
     Q.Enemy.p.speed = this.p.speed + 10;
    
  }
};


/*
var paused = false;
var pausedDep = new Deps.Dependency; 

this.Game = class {  
  constructor(q, levelId) {
    this.q = q;
    this.levelId = levelId;
  }  
  name() {
    // TODO decouple Levels ?
    var level = Levels.findOne({_id: this.levelId});
    if (level) return level.name;
    return 'No game in progress';
  }
  reset() {
    this.q.state.reset({ score: 0, ammo: 0, lives: 2, stage: 1});
    console.log(this.levelId);
    this.q.stageScene(this.levelId);
    paused = false;
    pausedDep.changed();
  }
  pause() {
    this.q.pauseGame();
    paused = true;
    pausedDep.changed();
  }  
  static isPaused() {
    pausedDep.depend();
    return paused;
  }
  isPausedInst() {
    return 
  }
  unpause() {    
    this.q.unpauseGame();
    paused = false;
    pausedDep.changed();
  }  
  playSound(soundName) {
    this.q.audio.play(soundName);
  }
}
*/

this.Player = class { 
  constructor(q) {
    this.q = q;
  }  
  incScore(amount) {
    this.q.state.inc('score', amount);
  }  
  getScore() {
    return this.q.state.get('score');
  }  
  decScore(amount) {
    this.q.state.dec('score', amount);
  }  
  incAmmo(amount) {
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

/*enemy = {
  incSpeed: function() {
     Q.Enemy.p.speed = this.p.speed + 10;
    
  }
};