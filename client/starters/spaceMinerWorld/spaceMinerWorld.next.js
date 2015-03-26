(function() {

  var defaults = {
    sprites: {
      tile: "plasma.png",
      enemy: "brainBlue.png",
      coin: "blue.png",
      gem: "pinkGem.png",
      player: "dark.png"
    },
    board: [
      ["g", "c", "e", "t", "p"]
    ],
    worldOneRow: [
      ["g", "c", "e", "t", "p"]
    ],
    wolrdTwoRows: [
      ["g", "c", "e", "t", "p"],
      ["t", "c", "c", "c", "c"]
    ],
    worldRows: [
      ["g", "c", "e", "t", "p"],
      ["t", "c", "c", "c", "c"],
      ["t", "t", "t", "g", "t"],
      ["t", "g", "g", "c", "c"],
      ["t", "g", "t", "g", "t"],
      ["g", "c", "t", "c", "g"]
    ]
  };

  Template.spaceMinerWorld.created = function() {
    var board = this.data.board;
    this.defaults = JSON.parse(JSON.stringify(defaults));
    if (board) this.defaults.board = board;
    this.game = new ReactiveVar(this.defaults);    
  };
  
  Template.spaceMinerWorld.rendered = function() {
    // Yay, global
    window.smw = this.game;
    window.onConsoleLoaded = function(sandbox) {
      var init = `Object.defineProperty(this, 'smw', {
    get: function() {
      return {
        get game() { return top.smw.get(); },
        update: function() {
          top.smw.set(this.game);
        }
      }
    }
  })`;
      sandbox.model.iframeEval(init);
    };
  };  

  Template.spaceMinerWorld.helpers({
    rows: function() {
      var template = Template.instance();
      var game = template.game.get();
      console.log("theeeeeeeeeee game");
      console.log(game);
      if (!game) return [];
      var board = game.board;

      if (!_.isArray(board)) throw "board must be a valid array";
      if (board.length === 0) {
        board = game.worldOneRow;
      }
      var boardCopy = JSON.parse(JSON.stringify(game.board));
            
      function copyRow(rowSource, rowTarget) {
        rowSource.forEach(function(cell, index) {
          rowTarget[index] = cell;
        });
      }
      
      if (_.isArray(board[0])) {
        board.forEach(function(row, rowIndex) {
          copyRow(row, boardCopy[rowIndex]);
        });
      } else {
        copyRow(board, boardCopy[0]);
      }

      return boardCopy;
    },
    cells: function() {
      var template = Template.instance();
      var defaults = template.defaults;

      var spritesMap = {
        t : 'tile',
        p : 'player',
        e : 'enemy',
        g : 'gem',
        c : 'coin'
      };
      
      var mapped = _.map(this.value, function(cell) {
        var spriteName = defaults.sprites[spritesMap[cell]];
        if (!spriteName) {
          spriteName = defaults.sprites[spritesMap[cell]];
        }
        var fileName = spritesMap[cell] + '/' + spriteName;
        return fileName;        
      });
      
      return mapped;
    }
  });
  
  Template.spaceMinerWorld.events({
    'click .smw-showBorders': function(evt, template) {      
      template.findAll('.smw-cell').forEach(function(item) {
        $(item).toggleClass('smw-cellBorder');
      });
      $(template.find('.smw-container')).toggleClass('smw-containerBorder');
    },
    'click .smw-showCoords': function(evt, template) {
      template.findAll('.smw-cell').forEach(function(item) {
        $(item).toggleClass('smw-cellCoords');
      });
    }
  });
}())

