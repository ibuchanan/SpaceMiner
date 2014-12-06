var gm = Meteor.npmRequire('gm');

function createLevelRecord(levelDto, callback) {
  var base = '/home/action/Towerman/public/images/';
  var root = base + 'spriteParts/';
  var sprite = _.reduce(_.rest(levelDto.selections, 1), function(sprite, selection) { 
    return sprite.append(root + selection);
  }, gm(root + levelDto.selections[0]).options({imageMagick:true}));

  sprite.toBuffer('PNG', Meteor.bindEnvironment(function (err, buffer) {
    levelDto.spritesData = buffer.toString('base64');
    var tiles = gm(base + 'DoNotEraseTileLeft.png').options({imageMagick:true})
    .append(root + levelDto.tile, base + 'DoNotEraseTileRight.png', true);
    tiles.toBuffer('PNG', Meteor.bindEnvironment(function(err2, buffer2) {
      levelDto.tilesData = buffer2.toString('base64');
      callback(levelDto);
    }));
  }));
}

function createLevelDefault() {
  var board = 
`tttttttttttttttttttt
t-EG------------G--t
t-ttttt------ttttt-t
t-tG------------Gt-t
t-ttttt------ttttt-t
t-----t--tt--t-----t
t--t--t--tt--t--t--t
t-----t------t-----t
t-t--------------t-t
t-t-tt-tttttt-tt-t-t
t--G------P-----G--t
t-t-tt-t-tt-t-tt-t-t
t--G------------G--t
tttttttttttttttttttt`;
  var level = {
    _id: 'starter',
    userId: 'admin',
    board,
    name: 'Space Miner',
    onEnemyHit: 'game.reset();',
    onGemHit: "player.scoreInc(player.scoreGet());\ngame.soundPlay('gem1.wav');\nplayer.ammoInc(1);",
    onCoinHit: "player.scoreInc(100);\ngame.soundPlay('coin1.wav');",
    onWon: "controls.alert('You won!');",
    published: true,
    selections: [
      'player/dark.png',
      'enemy/brainBlue.png',
      'gem/pinkGem.png',
      'coin/blue.png',
      'shot/basicShot.png'
    ],
    tile: 'tile/plasma.png',
    phase: 'inception',
    buildStepCurrent: 0,
    buildStepUpdateCounts: {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7': 0,
      '8': 0
    },
    version: 1
  };
  
  createLevelRecord(level, function(levelDto) {
    Levels.insert(levelDto);          
  });    
}

function createLessonsDefault() {
  Lessons.insert(Lesson.defaultLesson);
}

function cleanDbAndCreateDefaultRecords() {
  Levels.remove({phase: { $in: ['inception', 'build'] } });
  if (Levels.find({_id:'starter'}).count() === 0) {
    createLevelDefault();
  }
  
  Lessons.remove({});
  if (Lessons.find().count() === 0) {
    createLessonsDefault();
  }  

  SpriteParts.remove({});
  if (SpriteParts.find().count() === 0) {
    var spritePartSort = {
      player: 1,
      enemy: 2,
      gem: 3,
      coin: 4,
      tile: 5,
      shot: 6
    };
    var glob = Meteor.npmRequire("glob");      
    glob("/home/action/Towerman/public/images/spriteParts/**/*.png", Meteor.bindEnvironment((er, files)=> {
      var spriteParts = _.chain(files)
      .map((file)=> { 
        return file.replace("/home/action/Towerman/public/images/spriteParts/", "");
      })
      .groupBy((file)=> {
        return file.substring(0, file.indexOf("/"));          
      })
      .value();        
      _.each(spriteParts, (parts, category)=> {
        SpriteParts.insert({
          part: category,
          choices: parts,
          sort: spritePartSort[category],
          selected: parts[0]
        });
      });
    }));  
  }
}

function configureCORS() {
  WebApp.connectHandlers.use(function (req, res, next) {
    res.setHeader('access-control-allow-origin', '*');      
    return next();
  });
}

function configureCollectionAPI() {      
  var API = new CollectionAPI({});
  API.addCollection(Levels, 'levels');
  API.addCollection(Lessons, 'lessons');
  API.addCollection(SpriteParts, 'spriteParts');  
  API.start();
}

Meteor.startup(function() {
    Router.map(function() {
      this.route('levelSprites/:id', {
        where: 'server',
        action: function() {
          var id = this.params.id.split('.')[0];
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
          var id = this.params.id.split('.')[0];
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
      'levelSave': (id, levelDto)=> {
        createLevelRecord(levelDto, (levelDtoPoweredUp)=> {
            Levels.upsert(id, {$set: levelDtoPoweredUp});          
        });
      }
    });
  
    cleanDbAndCreateDefaultRecords();
    configureCORS();
    configureCollectionAPI();
});