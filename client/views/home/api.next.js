class Game {
  constructor(q, levelId) {
    this.q = q;
    this.levelId = levelId;
    this._paused = false;
    this._pausedDep = new Deps.Dependency;    
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
    this._paused = false;
    this._pausedDep.changed();
  }
  pause() {
    this.q.pauseGame();
    this._paused = true;
    this._pausedDep.changed();
  }  
  isPaused() {
    this._pausedDep.depend();
    return this._paused;
  }
  unpause() {    
    this.q.unpauseGame();
    this._paused = false;
    this._pausedDep.changed();
  }  
  playSound(soundName) {
    this.q.audio.play(soundName);
  }
}

class Player { 
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

class Controls {
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
}; */
window.Game = Game;
window.Player = Player
window.Controls = Controls;