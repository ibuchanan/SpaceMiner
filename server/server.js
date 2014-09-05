var gm = Meteor.npmRequire('gm');

Meteor.startup(function () {
    Router.map(function() {
      this.route('levelSprites/:id', {
        where: 'server',
        action: function() {
          id = this.params.id.split('.')[0];
          var level = Levels.findOne(id);
          var img = new Buffer(level.spritesData, 'base64');         
          this.response.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length
          });
          this.response.end(img);
        }
      });
      this.route('levelTiles/:id', {
        where: 'server',
        action: function() {
          id = this.params.id.split('.')[0];
          var level = Levels.findOne(id);
          var img = new Buffer(level.tilesData, 'base64');         
          this.response.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length
          });
          this.response.end(img);
        }
      });      
    });
  
    Meteor.methods({
      'levelSave': function(id, level) {
        var base = '/home/action/Towerman/public/images/';
        var root = base + 'spriteParts/';
        var sprite = _.reduce(_.rest(level.selections, 1), function(sprite, selection) { 
          return sprite.append(root + selection);
        }, gm(root + level.selections[0]).options({imageMagick:true}));
        sprite.toBuffer('PNG', Meteor.bindEnvironment(function (err, buffer) {
          level.spritesData = buffer.toString('base64');
          var tiles = gm(base + 'tileLeft.png').options({imageMagick:true})
            .append(root + level.tile, base + 'tileRight.png', true);
          tiles.toBuffer('PNG', Meteor.bindEnvironment(function(err2, buffer2) {
            level.tilesData = buffer2.toString('base64');
            Levels.upsert(id, {$set: level});
          }));
        }));
      }
    });
  
    if (Levels.find().count() === 0) {
      createDefaultLevel();
    }
  
    SpriteParts.remove({});
    if (SpriteParts.find().count() === 0) {
      var spritePartSort = {
        Player: 1,
        Enemy: 2,
        Treasure: 3,
        Coin: 4,
        Tiles: 5
      };
      var glob = Meteor.npmRequire("glob");      
      glob("/home/action/Towerman/public/images/spriteParts/**/*.png", Meteor.bindEnvironment(function (er, files) {
        spriteParts = _.chain(files)
          .map(function(file){ 
            return file.replace("/home/action/Towerman/public/images/spriteParts/", "");
          })
          .groupBy(function(file) {
            return file.substring(0, file.indexOf("/"));          
          })
          .value();        
          _.each(spriteParts, function(parts, category) {
              SpriteParts.insert({
                part: category,
                choices: parts,
                sort: spritePartSort[category],
                selected: parts[0]
              });
          });
      }));
    }
  
    API = new CollectionAPI({});
    API.addCollection(Levels, 'levels');
    API.start();    
});

function createDefaultLevel() {
  var level = { 
    userId: 'admin',
    modified: new Date(),
    board: "[ [ 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1 ], [ 1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,1 ], [ 1,0,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,0,1 ], [ 1,0,1,2,0,0,0,0,0,0,0,0,0,0,0,0,2,1,0,1 ], [ 1,0,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,0,1 ], [ 1,0,0,0,0,0,1,0,0,1,1,0,0,1,2,0,0,0,0,1 ], [ 1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1 ], [ 1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1 ], [ 1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1 ], [ 1,0,1,0,1,1,0,1,1,1,1,1,1,0,1,1,0,1,0,1 ], [ 1,0,0,2,0,0,0,1,0,2,0,0,1,0,0,0,0,0,0,1 ], [ 1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1 ], [ 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1 ], [ 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1 ] ]",
  name: "Space Miner",
  onCoinHit: "player.incScore(100); game.playSound('coin1.wav');",
  onEnemyHit: "game.reset();",
  onGemHit: "player.incScore(1000);",
  published: true,
  selections: [
  "Player/dark.png",
  "Enemy/brainBlue.png",
  "Treasure/dark.png",
  "Coin/blue.png"
  ],
  spritesData: "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",
  tile: "Tiles/tileAsteroidFull.png",
  tilesData: "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"
  };
  Levels.insert(level);
}