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

Template.home.created = function() {
  Session.set('levelId', '');
  Session.set('gameVisible', false);
    
  Bus.signal('gameCompleted').add(function(game) {
    console.log('gameCompleted:');
    console.log(game);
  });

  Bus.signal('gameLoadStarted').add(function(game) {
    console.log('gameLoadStarted:');
    console.log(game);
  });

  Bus.signal('gameLoadCompleted').add(function(game) {
    console.log('gameLoadCompleted:');
    console.log(game);
  });  
};

Template.home.helpers({
  levelId: function() {
    return Session.get('levelId');
  }
});

Template.levels.helpers({
  levels: function() {
    return Levels.find({published:true}); //, _id:'starter'});
  },
  levelId: function() {
    return Session.get('levelId');
  },
  hideIfGameVisible: function() {
    return Session.get('gameVisible') === true ? 'hideElement' : '';
  }
});

Template.levels.events({
  'click .gameShow': function() {
    Session.set('gameVisible', true);
  }
});

Template.level.events({
  'click button.levelPlay': function(evt, template) {
    Session.set('levelId', null);
    var id = this._id;
    Meteor.setTimeout(function() {
      Session.set('levelId', id);
      Session.set('gameVisible', true);      
    }, 1000);
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
  preview: function() {
    var images = '';
    for(var i = 0; i < this.selections.length-1; i++) {
      images += "<img src='/images/spriteParts/" + this.selections[i] + "' height='32' width='32' alt='' />&nbsp;";
      if (i==1) images += "<img src='/images/spriteParts/" + this.tile + "' height='32' width='32' alt='' />&nbsp;";
    }
    return images;
  }
});