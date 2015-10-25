let path = Npm.require('path');
let root = path.resolve('.');
let glob = Meteor.npmRequire("glob");     

var IMAGES_BASE = '';
if (process.env.IMAGES_BASE) {
  IMAGES_BASE = process.env.IMAGES_BASE;
  console.log("IMAGES_BASE manually set to:");
  console.log(IMAGES_BASE);
} else {
  IMAGES_BASE = path.resolve('../web.browser/app/images/') + '/';
  console.log("IMAGES_BASE auto-resolved to:");
  console.log(IMAGES_BASE);
}
console.log("Root: ", root);

var gm = Meteor.npmRequire('gm');
var babel = Meteor.npmRequire('babel-core');

function createLevelRecord(levelDto, callback) {  
  var root = IMAGES_BASE + 'spriteParts/';
  var sprite = _.reduce(_.rest(levelDto.selections, 1), function(sprite, selection) { 
    return sprite.append(root + selection);
  }, gm(root + levelDto.selections[0]).options({imageMagick:true}));

  sprite.toBuffer('PNG', Meteor.bindEnvironment(function (err, buffer) {
    levelDto.spritesData = buffer.toString('base64');
    var tiles = gm(IMAGES_BASE + 'DoNotEraseTileLeft.png').options({imageMagick:true})
    .append(root + levelDto.tile, IMAGES_BASE + 'DoNotEraseTileRight.png', true);
    tiles.toBuffer('PNG', Meteor.bindEnvironment(function(err2, buffer2) {
      levelDto.tilesData = buffer2.toString('base64');
      callback(levelDto);
    }));
  }));
}

function createLevelDefault() {
  var board = 
`tttttttttttttttttttt
tttttttttttttttttttt
tttttttttttttttttttt
tttttttttttttttttttt
tttttttttttttttttttt
tttttttttttttttttttt
tttttttttttttttttttt
tttttttttttttttttttt
tttttttttttttttttttt
tttttttttttttttttttt
tttttttttttttttttttt
tttttttttttttttttttt
tttttttttttttttttttt
tttttttttttttttttttt`;
  var level = {
    _id: 'starter',
    userId: 'admin',
    board,
    name: 'Space Miner',
    numberOfLives : 1,
    enableEnemyRespawn : true,    
    onEnemyHit: 'game.reset();',
    onGemHit: "player.scoreInc(player.scoreGet());\ngame.soundPlay('gem1.wav');\nplayer.ammoInc(1);",
    onCoinHit: "player.scoreInc(100);\ngame.soundPlay('coin1.wav');",
    onWon: "game.onWon();",
    published: true,
    selections: [
      'player/dark.png',
      'enemy/brainBlue.png',
      'gem/pinkGem.png',
      'coin/blue.png',
      'shot/basicShot.png'
    ],
    tile: 'tile/rockSmooth.png',
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

function createTrainingLevels() {

  var easyTarget =  {
    "_id": "easyTarget",
    "userId": "admin",
    "board": "tttttttttttttttttttt\nt-EG------------G--t\nt-ttttt------ttttt-t\nt-tG------------Gt-t\nt-ttttt------ttttt-t\nt-----t--tt--t-----t\nt--t--t--tt--t--t--t\nt-----t------t-----t\nt-t--------------t-t\nt-t-tt-tttttt-tt-t-t\nt--G------P-----G--t\nt-t-tt-t-tt-t-tt-t-t\nt--G------------G--t\ntttttttttttttttttttt",
    "name": "Easy Target",
    "numberOfLives": 1,
    "enableEnemyRespawn": false,
    "onEnemyHit": "game.reset();",
    "onGemHit": "player.scoreInc(player.scoreGet());\ngame.soundPlay('gem1.wav');\nplayer.ammoInc(1);",
    "onCoinHit": "player.scoreInc(100);\ngame.soundPlay('coin1.wav');",
    "onWon": "controls.alert('You won!');",
    "published": false,
    "selections": [
        "player/light.png",
        "enemy/cyclopsYellow.png",
        "gem/ruby.png",
        "coin/gold.png",
        "shot/basicShot.png"
    ],
    "tile": "tile/rockSpeckled.png",
    "phase": "training",
    "buildStepCurrent": 0,
    "buildStepUpdateCounts": {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0
    },
    "version": 1,
    "script": "var worldName = 'Easy Target';\nvar enableEnemyRespawn = false;\nvar sprites = {\n  tile : \"rockSpeckled.png\",\n  enemy : \"cyclopsYellow.png\",\n  coin : \"gold.png\",\n  gem : \"ruby.png\",\n  player : \"light.png\"\n};\n\nvar worldRows = [\n'tttttttttttttttttt',\n'ccccccccccccccccet',\n'cttttttttttttttttt',\n'ctgggggggggggggggg',\n'ctcccccccccccccccc',\n'ctgggggggggggggggg',\n'ctcccccccccccccccc',\n'ctgggggggggggggggg',\n'ctcccccccccccccccc',\n'ctgggggggggggggggg',\n'ctttttttttttttttct',\n'cgcgcgcgcgcgcgcgcp'\n];\n"
  };  
  
  createLevelRecord(easyTarget, function(levelDto) {
    Levels.insert(levelDto);          
  });
  
  var boxStep =  {
    "_id":"boxStep",
    "board":"tttttttttttttttttttt\nt-EG------------G--t\nt-ttttt------ttttt-t\nt-tG------------Gt-t\nt-ttttt------ttttt-t\nt-----t--tt--t-----t\nt--t--t--tt--t--t--t\nt-----t------t-----t\nt-t--------------t-t\nt-t-tt-tttttt-tt-t-t\nt--G------P-----G--t\nt-t-tt-t-tt-t-tt-t-t\nt--G------------G--t\ntttttttttttttttttttt",
    "buildStepCurrent":1,
    "buildStepUpdateCounts":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0},
    "enableEnemyRespawn":false,
    "name":"Box Step",
    "numberOfLives":1,       
    "onCoinHit":"player.scoreInc(100);\ngame.soundPlay('coin1.wav');",
    "onEnemyHit":"game.reset();",
    "onGemHit":"player.scoreInc(player.scoreGet());\ngame.soundPlay('gem1.wav');\nplayer.ammoInc(1);",
    "onWon":"controls.alert('You won!');",
    "phase":"training",
    "published":false,
    "script":"var worldName = 'Box Step';\r\nvar enableEnemyRespawn = false;\r\nvar sprites = {\r\n    tile : \"fiery.png\",\r\n    enemy : \"cyclopsRed.png\",\r\n    coin : \"brown.png\",\r\n    gem : \"diamondLight.png\",\r\n    player : \"light.png\"\r\n};\r\n\r\nvar worldRows =  [\r\n'cccccccccccccccccc',\r\n'cpggcccgggcccgggcc',\r\n'cgcgcccgcgcccgcgcc',\r\n'cgggcccgggcccgggcc',\r\n'cccccccccccccccccc',\r\n'cgggcccgggcccgggcc',\r\n'cgcgcccgcgcccgcgcc',\r\n'cgggcccgggcccgggcc',\r\n'cccccccccccccccccc',\r\n'cgggcccgggcccgggcc',\r\n'cgcgcccgcgcccgcgcc',\r\n'cgggcccgggcccgggcc'\r\n];",
    "selections": [
      "player/light.png",
      "enemy/cyclopsRed.png",
      "gem/diamondLight.png",
      "coin/brown.png",
      "shot/basicShot.png"
    ],
    "tile":"tile/fiery.png",
    "updatedBy":"admin",
    "userId":"admin",
    "version":1
  };

  createTrainingLevel('boxStep', 'Box Step',
    {
      tile : "fiery.png",
      enemy : "cyclopsRed.png",
      coin : "brown.png",
      gem : "diamondLight.png",
      player : "light.png"
    },
    [
      'ggggcccggggcccgggg',
      'gccgcccgccgcccgccg',
      'gccgcccgccgcccgccg',
      'ggggcccggggcccgggg',
      'ggggcccggggcccgggg',
      'gccgcccgccgpccgccg',
      'gccgcccgccgcccgccg',
      'ggggcccggggcccgggg',
      'ggggcccggggcccgggg',
      'gccgcccgccgcccgccg',
      'gccgcccgccgcccgccg',
      'ggggcccggggcccgggg'
     ]
  );

  createTrainingLevel('mightySquare', 'Mighty Square',
    {
      tile : "plasma.png",
      enemy : "goonGreen.png",
      coin : "brown.png",
      gem : "diamondDark.png",
      player : "dark.png"
    },
    [
      'ccccpccccccccccccc',
      'ccccggggggggggcccc',
      'ccccgccccccccgcccc',
      'ccccgccccccccgcccc',
      'ccccgccccccccgcccc',
      'ccccgccccccccgcccc',
      'ccccgccccccccgcccc',
      'ccccgccccccccgcccc',
      'ccccgccccccccgcccc',
      'ccccgccccccccgcccc',
      'ccccggggggggggcccc',
      'cccccccccccccccccc',
     ]
  );

  createTrainingLevel('mightierSquares', 'Mightier Squares',
    {
      tile : "golden.png",
      enemy : "brainPink.png",
      coin : "blue.png",
      gem : "emerald.png",
      player : "light.png"
    },
    [
      'ccccpccccccccccccc',
      'ccccggggggggggcccc',
      'ccccgccccccccgcccc',
      'ccccgcggggggcgcccc',
      'ccccgcgccccgcgcccc',
      'ccccgcgcggcgcgcccc',
      'ccccgcgcggcgcgcccc',
      'ccccgcgccccgcgcccc',
      'ccccgcggggggcgcccc',
      'ccccgccccccccgcccc',
      'ccccggggggggggcccc',
      'cccccccccccccccccc',
     ]
  );

  createTrainingLevel('rectangles', 'Rectangles',
    {
      tile : "golden.png",
      enemy : "brainPink.png",
      coin : "pink.png",
      gem : "emerald.png",
      player : "light.png"
    },
    [
      'ggcggcggcggcggcggc',
      'ggcggcggcggcggcggc',
      'ggcggcggcggcggcggc',
      'ggcggcggcggcggcggc',
      'ggcggcggcggcggcggc',
      'ggpggcggcggcggcggc',
      'ggcggcggcggcggcggc',
      'ggcggcggcggcggcggc',
      'ggcggcggcggcggcggc',
      'ggcggcggcggcggcggc',
      'ggcggcggcggcggcggc',
      'ggcggcggcggcggcggc'
     ]
  );

  createTrainingLevel('columns', 'Columns',
    {
      tile : "golden.png",
      enemy : "brainPink.png",
      coin : "pink.png",
      gem : "emerald.png",
      player : "light.png"
    },
    [
      'gcgcgcgcgcgcgcgcgc',
      'gcgcgcgcgcgcgcgcgc',
      'gcgcgcgcgcgcgcgcgc',
      'gcgcgcgcgcgcgcgcgc',
      'gcgcgcgcgcgcgcgcgc',
      'gpgcgcgcgcgcgcgcgc',
      'gcgcgcgcgcgcgcgcgc',
      'gcgcgcgcgcgcgcgcgc',
      'gcgcgcgcgcgcgcgcgc',
      'gcgcgcgcgcgcgcgcgc',
      'gcgcgcgcgcgcgcgcgc',
      'gcgcgcgcgcgcgcgcgc'
    ]
  );

  createTrainingLevel('rows', 'Rows',
    {
      tile : "golden.png",
      enemy : "brainPink.png",
      coin : "pink.png",
      gem : "emerald.png",
      player : "light.png"
    },
    [
      'gggggggggggggggggg',
      'cccccccccccccccccc',
      'gggggggggggggggggg',
      'cccccccccccccccccc',
      'gggggggggggggggggg',
      'cccccccccpcccccccc',
      'gggggggggggggggggg',
      'cccccccccccccccccc',
      'gggggggggggggggggg',
      'cccccccccccccccccc',
      'gggggggggggggggggg',
      'cccccccccccccccccc'
    ]
  );

  createTrainingLevel('jumps', 'Jumps',
    {
      tile : "golden.png",
      enemy : "brainPink.png",
      coin : "pink.png",
      gem : "emerald.png",
      player : "light.png"
    },
    [
      'gggggcgggggcgggggc',
      'cccccccccccccccccc',
      'gggggcgggggcgggggc',
      'cccccccccccccccccc',
      'gggggcgggggcgggggc',
      'cccccccccpcccccccc',
      'gggggcgggggcgggggc',
      'cccccccccccccccccc',
      'gggggcgggggcgggggc',
      'cccccccccccccccccc',
      'gggggcgggggcgggggc',
      'cccccccccccccccccc'
    ]
  );

  createTrainingLevel('crazyBoxes', 'Crazy Boxes', 
    {
      tile : "rockSwirly.png",
      enemy : "cyclopsRed.png",
      coin : "pink.png",
      gem : "ruby.png",
      player : "dark.png"
    },
    [
      'pggcggcggcggcggcgg',
      'cggcggcggcggcggcgg',
      'cccccccccccccccccc',
      'cggcggcggcggcggcgg',
      'cggcggcggcggcggcgg',
      'cccccccccccccccccc',
      'cggcggcggcggcggcgg',
      'cggcggcggcggcggcgg',
      'cccccccccccccccccc',
      'cggcggcggcggcggcgg',
      'cggcggcggcggcggcgg',
      'cccccccccccccccccc'
     ]
  );

  createTrainingLevel('motion', 'Motion',
    {
      tile : "rockSwirly.png",
      enemy : "cyclopsRed.png",
      coin : "pink.png",
      gem : "ruby.png",
      player : "dark.png"
    },
    [
      'tttttttttctttttttt',
      'tttttttttctttttttt',
      'tttttttttctttttttt',
      'tttttttttctttttttt',
      'tttttttttgtttttttt',
      'pcccccccgggccccccc',
      'tttttttttgtttttttt',
      'tttttttttctttttttt',
      'tttttttttctttttttt',
      'tttttttttctttttttt',
      'tttttttttctttttttt',
      'tttttttttctttttttt'
     ]
  );

  createTrainingLevel('maze', 'Maze',
    {
      tile : "golden.png",
      enemy : "brainPink.png",
      coin : "pink.png",
      gem : "emerald.png",
      player : "light.png"
    },
    [
      'tttttttttctttttttt',
      'tttccccccctttttttt',
      'tttctttttctttttttt',
      'tttctttttctttttttt',
      'tttctttttgtttttttt',
      'pccctttttgggccccct',
      'ttttttttttttttttct',
      'tcccccccccttttttct',
      'tctttttttcttttttct',
      'tctttttttcttttttct',
      'tccccccctcccccccct',
      'tttttttttttttttttt'
     ]
  );
}

function createLessonsDefault() {
  Lessons.defaultLessons.forEach((lesson)=> {
    Lessons.insert(lesson);
  });
}

function createTrainingLevel(id, name, sprites, worldRows) {

  var spritesString = JSON.stringify(sprites);
  var worldRowsString = JSON.stringify(worldRows);

  var level =  {
    "_id": id,
    name,
    "phase":"training",
    "published":false,
    "script":
`var worldName = '${name}';
var enableEnemyRespawn = false;
var sprites = ${spritesString};
var worldRows = ${worldRowsString};
`,    
    "selections": [
      "player/" + sprites.player,
      "enemy/" + sprites.enemy,
      "gem/" + sprites.gem,
      "coin/" + sprites.coin,
      "shot/basicShot.png"
    ],
    "tile": "tile/" + sprites.tile,    
    "board":"tttttttttttttttttttt\nt-EG------------G--t\nt-ttttt------ttttt-t\nt-tG------------Gt-t\nt-ttttt------ttttt-t\nt-----t--tt--t-----t\nt--t--t--tt--t--t--t\nt-----t------t-----t\nt-t--------------t-t\nt-t-tt-tttttt-tt-t-t\nt--G------P-----G--t\nt-t-tt-t-tt-t-tt-t-t\nt--G------------G--t\ntttttttttttttttttttt",
    "buildStepCurrent":1,
    "buildStepUpdateCounts":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0},
    "enableEnemyRespawn":false,    
    "numberOfLives":1,       
    "onCoinHit":"player.scoreInc(100);\ngame.soundPlay('coin1.wav');",
    "onEnemyHit":"game.reset();",
    "onGemHit":"player.scoreInc(player.scoreGet());\ngame.soundPlay('gem1.wav');\nplayer.ammoInc(1);",
    "onWon":"controls.alert('You won!');",
    "updatedBy":"admin",
    "userId":"admin",
    "version":1
  };  
  
  createLevelRecord(level, function(levelDto) {
    Levels.insert(levelDto);          
  });
  
}

function cleanDbAndCreateDefaultRecords() {
  if(Surveys.find().count() === 0) {
    Surveys.insert({ 
      _id : 'memory', 
      question : 'What kind of data and information do you think the code needs to keep in memory in order for the game to work?',
      open: true
    });
  }
  
  Levels.remove({phase: { $in: ['inception', 'training'] } });  
  if (Levels.find({_id:'starter'}).count() === 0) {
    createLevelDefault();
  }  
  if (Levels.find({_id:'easyTarget'}).count() === 0) {
    createTrainingLevels();
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
    var imageGlobPath = IMAGES_BASE + "spriteParts/**/*.png";
    
    glob(imageGlobPath, Meteor.bindEnvironment((er, files)=> {
      console.log("Sprite part images found:");
      console.log(files);
      var spriteParts = _.chain(files)
      .map((file)=> { 
        return file.replace(IMAGES_BASE + "spriteParts/", "");
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

let setupJobs = () => {
  let myJobs = JobCollection('myJobQueue');
  myJobs.allow({
    admin: (userId, method, params) => userId ? true : false
  });

  Meteor.startup(() => {
    Meteor.publish('allJobs', () => myJobs.find({}));
    return myJobs.startJobServer();
  });

  let job = new Job(myJobs, 'spriteUploadAssociateWithUser',
    {
      baseDir: '/.uploads/',
    }
  );
    
  job.priority('normal')
    .retry().repeat({
      repeats: myJobs.forever,
      wait: 10000
    })
    .save();

  let workers = Job.processJobs('myJobQueue', 'spriteUploadAssociateWithUser',
    (job, cb)  => {
      const data = job.data;

      glob('c:/.uploads/*', Meteor.bindEnvironment((er, files) => {
        console.log("Unprocessed images found:");
        console.log(files);
        job.done();
        cb();
      }));
    }
  );

};

Meteor.startup(function() {
    //setupJobs();
    UploadServer.init({
      tmpDir: root + '/.uploads/tmp',
      uploadDir: root + '/.uploads/',
      checkCreateDirectories: true, //create the directories for you
      getDirectory: (fileInfo, formData) => {
        return `/${formData.customSpriteType}`;
      }
    });

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
    
    var Future = Npm.require('fibers/future');
  
    Meteor.methods({
      'levelSave': (id, levelDto)=> {
        createLevelRecord(levelDto, (levelDtoPoweredUp)=> {
            Levels.upsert(id, {$set: levelDtoPoweredUp});
        });
      },
      'levelUpdate': (id, props, buildStepUpdateCounts)=> {
        let future = new Future();
        // TODO remove this code if we get it handled on client
        //let result = babel.transform(props.script, {stage:1, ast:false});
        //props.script = result.code;
        createLevelRecord(props, (propsPoweredUp)=> {
          Levels.update(id, {
            $set: propsPoweredUp,
            $inc : buildStepUpdateCounts
          }, function() {
            future.return(true);
          });
        });
        return future.wait();
      },
      'es6compile': source => {
        let code =
`(async (defaults) => {
${source}
}());`;
        let result = babel.transform(code, {stage:1, ast:false});
        return result.code;
      },
      'es6compileDeclaration': source => {
        let code =
`(defaults) => {
${source}
};`;
        let result = babel.transform(code, {stage:1, ast:false});
        return result.code;
      }
    });

    /*
    ServiceConfiguration.configurations.upsert(
      { service: "meetup" },
      { $set: { clientId: "frhtguo3lk9ngsr8kcm6hp7kai", secret: "pn37mhc8q0jmnb5423meaojd3g" } }
    );
    */
    /* dev:
    ServiceConfiguration.configurations.upsert(
      { service: "github" },
      { $set: { clientId: "e0dcb6c6b3c3c2c21f4e", secret: "45617166c064898848a38c6063a072350ffe4191" } }
    );
    */

    // spaceminer.mod.bz:
    /*
    ServiceConfiguration.configurations.upsert(
      { service: "github" },
      { $set: { clientId: "64c121033426202d78cc", secret: "c15a3093da1e2bc973ee63544f83172d1a490598" } }
    );
    */

    cleanDbAndCreateDefaultRecords();
    configureCORS();
    configureCollectionAPI();
});