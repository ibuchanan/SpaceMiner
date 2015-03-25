(function() {

  var defaults = {
    sprites: {
      tile: "plasma.png",
      enemy: "brainBlue.png",
      coin: "blue.png",
      gem: "pinkGem.png",
      player: "dark.png"
    },
    world: [
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
    var world = this.data.world;
    this.defaults = JSON.parse(JSON.stringify(defaults));
    if (world) this.defaults.world = world;
  };

  Template.spaceMinerWorld.helpers({
    rows: function() {
      var template = Template.instance();
      var defaults = template.defaults;
      var world = defaults.world;

      if (!_.isArray(world)) throw "world must be a valid array";
      if (world.length === 0) {
        world = defaults.worldOneRow;
      }
      var worldCopy = JSON.parse(JSON.stringify(defaults.world));
            
      function copyRow(rowSource, rowTarget) {
        rowSource.forEach(function(cell, index) {
          rowTarget[index] = cell;
        });
      }
      
      if (_.isArray(world[0])) {
        world.forEach(function(row, rowIndex) {
          copyRow(row, worldCopy[rowIndex]);
        });
      } else {
        copyRow(world, worldCopy[0]);
      }

      return worldCopy;
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

