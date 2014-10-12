var gm = Meteor.npmRequire('gm');

function createLevelRecord(levelDto, callback) {
  var base = '/home/action/Towerman/public/images/';
  var root = base + 'spriteParts/';
  var sprite = _.reduce(_.rest(levelDto.selections, 1), function(sprite, selection) { 
    return sprite.append(root + selection);
  }, gm(root + levelDto.selections[0]).options({imageMagick:true}));

  sprite.toBuffer('PNG', Meteor.bindEnvironment(function (err, buffer) {
    levelDto.spritesData = buffer.toString('base64');
    var tiles = gm(base + 'tileLeft.png').options({imageMagick:true})
    .append(root + levelDto.tile, base + 'tileRight.png', true);
    tiles.toBuffer('PNG', Meteor.bindEnvironment(function(err2, buffer2) {
      levelDto.tilesData = buffer2.toString('base64');
      callback(levelDto);
    }));
  }));
}

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
      'levelSave': function(id, levelDto) {
        createLevelRecord(levelDto, function(levelDtoPoweredUp) {
            Levels.upsert(id, {$set: levelDtoPoweredUp});          
        });
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
        Tiles: 5,
        Shots: 6
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
  var board = 
      'tttttttttttttttttttt\n' + 
      't---------------G--t\n' + 
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
      'tttttttttttttttttttt\n'; 
  var level = {
    userId: 'admin',
    board: board,
    name: 'Space Miner',
    onCoinHit: '',
    onEnemyHit: '',
    onGemHit: '',
    published: true,
    selections: [
      'Player/dark.png',
      'Enemy/brainBlue.png',
      'Treasure/dark.png',
      'Coin/blue.png',
      'Shots/basicShot.png'
    ],
    'tile': 'Tiles/tileAsteroidFull.png'    
  };
  
  createLevelRecord(level, function(levelDto) {
    Levels.insert(levelDto);          
  });    
}