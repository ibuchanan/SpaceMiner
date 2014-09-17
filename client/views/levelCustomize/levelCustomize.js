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

_.extend(Template.levelCustomize, {
  rendered: function() {
    var board =
   'tttttttttttttttttttt\n' +
   't--G------------G--t\n' +
   't-ttttt------ttttt-t\n' +
   't-tG-E--------E-Gt-t\n' +
   't-ttttt------ttttt-t\n' +
   't-----t--tt--t-----t\n' +
   't--t--t--tt--t--t--t\n' +
   't-----t------t-----t\n' +
   't-t--------------t-t\n' +
   't-t-tt-tttttt-tt-t-t\n' +
   't--G---t-G-------P-t\n' +
   't-t-tt-t-tt-t-tt-t-t\n' +
   't-----------------Gt\n' +
   'tttttttttttttttttttt';    
    var level = {
      userId: Meteor.userId(),
      board: board,
      name: 'N',
      selections: [
        'Player/dark.png',
        'Enemy/brainBlue.png',
        'Treasure/dark.png',
        'Coin/blue.png',        
        'Tiles/tileAsteroidFull.png',
        'Shorts/basicShot.png'        
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
          editor.setFontSize(16);
          editor.setTheme("ace/theme/monokai");
          var session = editor.getSession();
          if (editorSelector !== "levelBoard") {
            var val = levelDoc[editorSelector];
            session.setValue(levelDoc[editorSelector]);
            session.setMode("ace/mode/javascript");            
          } else {
            session.setMode("ace/mode/text");            
            session.setValue(levelDoc.board);
          }
          editor.setHighlightActiveLine(true);
        });

        var timeoutId = null;
        function onChange() {
          if (timeoutId !== null) clearTimeout(timeoutId);
          timeoutId = setTimeout(function() {
            updateLevelPreviews();
          });
        }
        ace.edit("levelBoard").on('change', onChange, 1000);
        onChange();
      }
    });
  },
  level: function() {
    var lev = Session.get("level");
  },
  events: {
    'click .tilesRow2': function() {
      var editor = ace.edit('levelBoard');
      var doc = editor.getSession().getDocument();
      var AceRange = require('ace/range').Range;
      var rng = new AceRange(1,0,1,20);
      doc.replace(rng, "tttttttttttttttttttt");      
    },
    'click .spriteChoice' : function(evt, template) {
      var parentDocId = $(evt.currentTarget).attr("data-parent");
      SpriteParts._collection.update({_id: parentDocId}, {$set: {selected: String(this)}});
      updateLevelPreviews();
    }, 
    'click button.save': function(evt,template) {
      var level = getLevelDto();
      var id = Session.get("level")._id;
      level.published = true;
      Meteor.call('levelSave', id, level);
    }
  }
});

function updateLevelPreviews() {
  try {
    var level = getLevelDto();
    var board = [];
    try {
      board = parseBoard(level.board);
    } catch (ex) {
      console.log("Error trying to parse board:");
      console.log(ex);
      $(".previewContainer").html("Oops, we couldn't render your preview! Is your map array correct?");
      return;
    }
    var sprites = _.map(board, function(row){
      return _.map(row, function(column){
        var mapped;
        /*
      selections: [
        'Player/dark.png',
        'Enemy/brainBlue.png',
        'Treasure/dark.png',
        'Coin/blue.png',        
        'Tiles/tileAsteroidFull.png',
        'Shorts/basicShot.png'        
      ],
        */        
        if (column === '-') {
          mapped = level.selections[3];
        } else if (column === 'T' || column === 't'){
          mapped = level.tile;
        } else if (column === 'G' || column === 'g'){
          mapped = level.selections[2];
        } else if (column === 'E' || column === 'e') {
          mapped = level.selections[1];
        } else if (column === 'P' || column === 'p') {
          mapped = level.selections[0];
        }
        return mapped;
      });
    });
    
    $(".previewContainer").empty();
    var imgIndex = 0;
    _.each(sprites, function(row, rowIndex) {
      var div = $("<div class='preview'></div>");      
      _.each(row, function(column, colIndex) {        
        var img = $("<img src='images/spriteParts/" + column + "' class='tilePreview' data-pos='" +
          rowIndex + "," + colIndex + "' id='tileSelect" + imgIndex + "'/>");
        div.append(img);
        imgIndex++;
      });      
      $(".previewContainer").append(div);
    });
    
    var spriteSrc = 'images/spriteParts/';
    $("#tileTile").attr('src', spriteSrc + level.tile);
    $("#tileCoin").attr('src', spriteSrc + level.selections[3]);
    $("#tileGem").attr('src', spriteSrc + level.selections[2]);
    $("#tileEnemy").attr('src', spriteSrc + level.selections[1]);    
    $("#tilePlayer").attr('src', spriteSrc + level.selections[0]);    
    
    $('[class=tilePreview]').on('click', function() {
      updateLevelPreviews.tileSelected = this;
      $('#tileDialog').modal('show');
    });
    
    $('[class=tileSelector]').off('click');
    $('[class=tileSelector]').on('click', function() {
      var pos = $(updateLevelPreviews.tileSelected).attr('data-pos').split(',');
      var row = Number(pos[0]),
          col = Number(pos[1]);
      var spriteNum = Number($(this).attr('data-spriteNum'));
      board[row][col] = spriteNum;
      var json = JSON.stringify(board);
      json = json.replace(/\[\[/g, "[\n [");
      json = json.replace(/\],\[/g, "],\n [");
      json = json.replace(/\]\]/g, "]\n]");
      // We need to make this:
      /*      
      [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,2,3,0,0,0,0,0,0,0,0,0,0,3,2,0,0,1],[1,0,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,0,1],[1,0,1,2,3,0,0,0,0,0,0,0,0,0,0,3,2,1,0,1],[1,0,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,0,1],[1,0,0,0,0,0,1,0,0,1,1,0,0,1,2,0,0,0,0,1],[1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1],[1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],[1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],[1,0,1,0,1,1,0,1,1,1,1,1,1,0,1,1,0,1,0,1],[1,0,0,2,0,0,0,1,0,2,4,0,1,0,0,0,0,0,0,1],[1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]    
      */
      // into more like this:
      /*
      [
       [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1 ],
       [1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,1 ],
      ]
      */
      var editor = ace.edit('levelBoard');
      editor.getSession().setValue(json);
      editor.resize();
      updateLevelPreviews();
      $('#tileDialog').modal('hide');
    });
  } catch (ex) {
    console.log("error in updateLevelPreviews");
    console.log(ex);
  }
}
updateLevelPreviews.tileSelected = null;