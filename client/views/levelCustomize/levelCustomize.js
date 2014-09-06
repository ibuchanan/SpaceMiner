_.extend(Template.sprites, {
  spriteParts: function() {
    return SpriteParts.find({}, {sort: {sort: 1}});  
  }  
});

function getLevelDto() {
  // Grab all the code snippets first
  var board = ace.edit("levelBoard").getSession().getValue();
  var onEnemyHit = ace.edit("onEnemyHit").getSession().getValue();
  var onCoinHit = ace.edit("onCoinHit").getSession().getValue();
  var onGemHit = ace.edit("onGemHit").getSession().getValue();
  
  var name = $('#levelName').val() || 'nameo';
  var selections = [];
  var tile = '';
  SpriteParts.find({}, {sort: {sort: 1}}).forEach(function(part) {
    if (part.selected.indexOf('tile') > -1) {
      tile = part.selected;
    } else {
      selections.push(part.selected);
    }        
  });
  
  var userId = Meteor.userId();
  
  var level = {  
    userId: userId,
    board: board,
    name: name,
    selections: selections,
    tile: tile,
    onEnemyHit: onEnemyHit,
    onCoinHit: onCoinHit,
    onGemHit: onGemHit
  };
  
  return level;
}

/*
var dep = new Deps.Dependency();
Session.set("hasBoardJson", false);
*/

_.extend(Template.levelCustomize, {
  rendered: function() {
    var board =
      "[\n"
    + " [ 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1 ],\n"
    + " [ 1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,1 ],\n"
    + " [ 1,0,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,0,1 ],\n"
    + " [ 1,0,1,2,0,0,0,0,0,0,0,0,0,0,0,0,2,1,0,1 ],\n"
    + " [ 1,0,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,0,1 ],\n"
    + " [ 1,0,0,0,0,0,1,0,0,1,1,0,0,1,2,0,0,0,0,1 ],\n"
    + " [ 1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1 ],\n"
    + " [ 1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1 ],\n"
    + " [ 1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1 ],\n"
    + " [ 1,0,1,0,1,1,0,1,1,1,1,1,1,0,1,1,0,1,0,1 ],\n"
    + " [ 1,0,0,2,0,0,0,1,0,2,0,0,1,0,0,0,0,0,0,1 ],\n"
    + " [ 1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1 ],\n"
    + " [ 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1 ],\n"
    + " [ 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1 ]\n"
    + "]";    
    
    var level = {
      userId: Meteor.userId(),
      board: board,
      name: 'N',
      selections: [
        'Player/dark.png',
        'Enemy/brainBlue.png',
        'Coin/blue.png',
        'Treasure/dark.png',
        'Tiles/tileAsteroidFull.png'
      ],
      tile: 'Tiles/tileAsteroidFull.png',
      onEnemyHit: 'game.reset();',
      onCoinHit:"player.incScore(100);\ngame.playSound('coin1.wav');",
      onGemHit:'player.incScore(1000);',
      spritesData: '',
      tilesData: '',
      published: false
    };
    
    Levels.insert(level, function(err, id) {
      if (err) {
        console.log("Error inserting the Level:");
        console.log(err);
      } 
      else {
        var levelDoc = Levels.findOne(id);
        Session.set("level", levelDoc);

        _.each(["levelBoard", "onEnemyHit", 
             "onCoinHit", "onGemHit"], function(editorSelector) {
          var editor = ace.edit(editorSelector);
          editor.setTheme("ace/theme/monokai");
          var session = editor.getSession();
          session.setMode("ace/mode/javascript");
          if (editorSelector !== "levelBoard") {
            var val = levelDoc[editorSelector];
            session.setValue(levelDoc[editorSelector]);
          } else {
            session.setValue(levelDoc.board);
          }
          editor.setHighlightActiveLine(true);
        });

        var timeoutId = null;
        ace.edit("levelBoard").on('change', function() {
          if (timeoutId !== null) clearTimeout(timeoutId);
          timeoutId = setTimeout(function() {
            /*
            Session.set("hasBoardJson", true);
            dep.changed();
            */
            updateLevelPreviews();
          }, 1000);
        });
        //Session.set("hasBoardJson", true);
      }
    });
  },
  level: function() {
    var lev = Session.get("level");
  },
  events: {
    'click img' : function(evt, template) {
      //dep.depend();
      var parentDocId = $(evt.currentTarget).attr("data-parent");
      SpriteParts._collection.update({_id: parentDocId}, {$set: {selected: String(this)}});
      /*
      Session.set("hasBoardJson", true);
      */
      updateLevelPreviews();
    }, 
    'click button.save': function(evt,template){    
      var level = getLevelDto();
      var id = Session.get("level")._id;
      level.published = true;
      Meteor.call('levelSave', id, level);
    }
  }
});

_.extend(Template.boardPreview, {
  hasBoardJson: function() {
    return Session.get("hasBoardJson");
  },
  boardMappedToSprites: function() {
    //dep.depend();
    var level = getLevelDto();
    var board = [];
    try {
      board = JSON.parse(level.board);
    } catch (ex) {
      //Session.set("hasBoardJson", false);
      return [];
    }
    var sprites = _.map(board, function(row){
        return _.map(row, function(column){
          if (column === 0) {
            return level.selections[3];
          }
          if (column === 1){
            return level.tile;
          }
          if (column === 2){
            return level.selections[2];
          }
      });
    });
    //Session.set("hasBoardJson", true);    
    return sprites;
  }  
});

function updateLevelPreviews() {
  try {
    var level = getLevelDto();
    var board = [];
    try {
      board = JSON.parse(level.board);
    } catch (ex) {
      console.log("Error trying to parse board:");
      console.log(ex);
      $(".previewContainer").html("Oops, we couldn't render your preview! Is your map array correct?");
      return;
    }
    var sprites = _.map(board, function(row){
      return _.map(row, function(column){
        if (column === 0) {
          return level.selections[3];
        }
        if (column === 1){
          return level.tile;
        }
        if (column === 2){
          return level.selections[2];
        }
      });
    });
    
    $(".previewContainer").empty();  
    _.each(sprites, function(row) {
      var div = $("<div class='preview'></div>");      
      _.each(row, function(column) {
        div.append($("<img src='images/spriteParts/" + column + "' />"));
      });
      $(".previewContainer").append(div);
    });
  } catch (ex) {    
    console.log("error in updateLevelPreviews");
    console.log(ex);
  }
}