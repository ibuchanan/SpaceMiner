_.extend(Template.sprites, {
  spriteParts: function() {
    return SpriteParts.find({}, {sort: {sort: 1}});  
  }  
});

function getLevelDto() {
  // Grab all the code snippets first
  var board = ace.edit("levelBoard").getSession().getValue();
  var onEnemyHit = ace.edit("codeEnemyEditor").getSession().getValue();
  var onCoinHit = ace.edit("codeCoinEditor").getSession().getValue();
  var onGemHit = ace.edit("codeGemEditor").getSession().getValue();
  
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
  
  var level = {  
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
    Session.set("hasBoardJson", false);
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
    
    var id = Levels.insert(level);
    var levelDoc = Levels.findOne(id);
    Session.set("level", levelDoc);
    
    _.each(["levelBoard", "codeEnemyEditor", 
           "codeCoinEditor", "codeGemEditor"], function(editorSelector) {
      var editor = ace.edit(editorSelector);
      editor.setTheme("ace/theme/monokai");
      editor.getSession().setMode("ace/mode/javascript");
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
    
    Session.set("hasBoardJson", true);
  },
  level: function() {
    return Session.get("level");
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
    console.log("In hasBoardJson helper");
    return Session.get("hasBoardJson");
  },
  boardMappedToSprites: function() {
    console.log("In boardMappedToSprites helper");
    //dep.depend();
    var level = getLevelDto();
    var board = [];
    try {
      board = JSON.parse(level.board);
    } catch (ex) {
      Session.set("hasBoardJson", false);
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
    Session.set("hasBoardJson", true);    
    return sprites;
  }  
});

function updateLevelPreviews() {
  var level = getLevelDto();
  var board = [];
  try {
    board = JSON.parse(level.board);
  } catch (ex) {
    $(".previewContainer").html("Oops, we couldn't render your preview! Is your map array correct?");
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
    $(".previewContainer").append(div)
  });
}