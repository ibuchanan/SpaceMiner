onLevelComplete = function() {
  Session.set('gameComplete', true);
//function onLevelComplete() {
  try {
    if (!challengeAlreadySolved('variables')) challenge('variables');
    else OnWon();
  } catch(ex) {
    console.log(ex);  
  }
  Q.stageScene('');
}

challenges = {
  variables : function() {
    levelClone(function(err, newLevelId) {
      // TODO handle err
      var name;
      controls.prompt("<h1><span class='fa fa-smile-o'></span> Congratulations, you win!</h1>What is your name?", function(result) {
        // Do nothing with result
        if (name === undefined) {
          controls.prompt("<h1><span class='fa fa-meh-o'></span> Sorry</h1>I do not think your name was stored in memory. What is your name?", 
            function(result) {
              // Do nothing with result
              if (name === undefined) {
                controls.confirm("<h1><span class='fa fa-frown-o'></span> Ooops!</h1> Your name is still undefined in memory! Will you <i><b>please fix</b></i> my buggy code so I can store your name in memory to congratulate you properly?", function(result) {
                  if (result) window.location = '/lesson/variables/' + newLevelId;
                });
              }
          });
        }
      });
    });
  }
};

function challengeAlreadySolved(challengeName) {
  return Challenges.findOne({userId: Meteor.userId(), challenge: challengeName}) !== undefined;
}

function challenge(challengeName) {
  challenges.variables();
}

controls = new Controls();

function levelClone(callback) {
  var levelId = Session.get('levelId');
  var doc = Levels.findOne({_id: levelId});
  delete doc._id;
  doc.published = false;
  Levels.insert(doc, callback);
}

var gameOpen = new ReactiveVar(false);

var signals = AutoSignal.register('home', {
  gameOpened: function() {
    gameOpen.set(true);
  },
  gameHidden: function() {
    gameOpen.set(false);
  }
});

Template.home.created = function() {
  Session.set('levelId', '');
};

Template.home.helpers({
  levelId: function() {
    return Session.get('levelId');
  },
  hideIfGameVisible: hideIfTrue(gameOpen)
});

Template.home.events({
  'click .gameShow': function() {
    signals.gameOpened.dispatch();
  }  
});

var sort = { sort : { lastUpdated: -1 } };

Template.levelsForming.helpers({
  levels: function() {
    return Levels.find({published:false, phase: 'build'}, sort);
  },
  hideIfGameVisible: hideIfTrue(gameOpen)
});

Template.levelsExplore.helpers({
  levels: function() {
    return Levels.find({published:true, phase: 'test'}, sort);
  },
  hideIfGameVisible: hideIfTrue(gameOpen)
});

Template.levelsConquer.helpers({
  levels: function() {
    return Levels.find({published:true, phase: { $nin: ['test'] } }, sort);
  },
  hideIfGameVisible: hideIfTrue(gameOpen)  
});

Template.level.events({
  'click button.levelPlay': function(evt, template) {
    Session.set('levelId', null);
    var id = this._id;
    Meteor.setTimeout(function() {
      Session.set('levelId', id);
      signals.gameOpened.dispatch();
      //Session.set('gameVisible', true);      
    }, 1000);
  },
  'click button.levelEdit': function(evt, template) {
    Session.set('levelId', null);
    window.location = '/build?id=' + this._id;    
  }
});

var bsBackgrounds = [
  'primary', 'success', 'info', 'warning', 'danger'
];

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

Template.level.helpers({
  randomBackgroundColor: function() {
    return randomElement(bsBackgrounds);
  },
  version: function() {
    if (this.phase && this.phase !== 'build') {
      return '&nbsp;<span style="font-size:75%;color:eggshell;">v' + this.version + '</span>';
    }
    else if (this.phase && this.phase === 'build') return ''
    return '&nbsp;<span style="font-size:75%;color:eggshell;">v1</span>';
  },
  preview: function() {
    var images = '';
    for(var i = 0; i < this.selections.length-1; i++) {
      images += "<img src='/images/spriteParts/" + this.selections[i] + "' height='32' width='32' alt='' />&nbsp;";
      if (i==1) images += "<img src='/images/spriteParts/" + this.tile + "' height='32' width='32' alt='' />&nbsp;";
    }
    return images;
  },
  explorer: function() {
    if (this.updatedBy) return this.updatedBy;
    return '';
  },
  edit: function() {
    if (this.userId && this.userId === Meteor.userId())  {
      return "<div><button class='levelEdit btn btn-xs btn-danger'>Edit</button></div>";
    }
    return "";
  }
});