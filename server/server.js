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

function createLevelDefault() {
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
    onEnemyHit: 'game.reset();',
    onGemHit: "player.incScore(player.getScore());\ngame.playSound('gem1.wav');\nplayer.incAmmo(1);",
    onCoinHit: "player.incScore(100);\ngame.playSound('coin1.wav');",    
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

function createLessonsDefault() {
  function value(val) {
    return {
      value: val === undefined ? 'undefined' : val,
      type: typeof val
    };
  }
  function error(message) {
    return {
      error: message
    };
  }
  function step(code, title, id, expectation, description) {
    step.index++;
    return {
      id: id,
      code: code,
      title: title,
      expectation: expectation,      
      description: description,
      current: step.index === 0,
      attempted: false,
      index: step.index
    };
  }
  step.index = -1;
  
  var lesson = {
    name: 'variables',
    title: 'Make your game remember things with variables',
    steps: [
      step('faveColor', 'Your first line of code, I do declare', 'undeclared-variable', error('ReferenceError: faveColor is not defined'), 'You get this error because you first need to tell your computer to recognize <code>faveColor</code> as a <b>variable</b>. A variable lets you store information in the computer\'s RAM. This is easy to do. To learn how, click next...'),
      step('var faveColor', 'Use the var keyword to declare a variable in memory', 'declare-variable', value(undefined), 'You just used your first JavaScript language keyword, <code>var</code> to tell the computer to reserve a place in memory named <code>faveColor</code>, but right now it is like an emoty brain cell waiting to be filled with information. The response <code>undefined</code> is a type of <b>value</b> that represents a variable that does not have any other assigned value. To get the computer to remember your favorite color, you have to learn about another type of value, and then about <b>variable assignment</b>. Keep going...'),
      step('red', 'Another undeclared variable error message from the interpreter', 'undeclared-variable-red', error('ReferenceError: red is not defined'), 'An error again? The reason is the same as before. The computer does not recognize <b>red</b> as defined variable. But, there is a simple way to use that color name, and any other, in a way that the computer recognizes as a <b>string</b> type...'),
      step('"red\"', 'Type a string value using double-quotes around text', 'string-variable', value('"red"'), 'Now you\'re getting somewhere! When the console simply echoes <b>"red"</b> back to you it is telling you that you sent it a value that it could process. In this case, because we surrounded the three characters <b>red</b> with a pair of <b>"</b> characters, the computer recognizes it as a <b>string</b> type. There are several other types of values you can type in that you will learn about later, but try typing each of the following, but do not surroundi them by " charactersjust to get a preview:  <p><ul><li>44</li><li>1.5</li><li>true</li><li>false</li></ul></p>.<p>Let\'s keep going for now...</p>'),
      step('faveColor = "red"', 'Assign a string value into the faveColor variable to make it remember', 'assign-string-value', value('"red"'), 'Now you have <i>assigned</i> the <b>value</b> of <i>"red"</i> into the <b>variable</b> named <i>faveColor</i>! This is a big step in learning how to code. You really cannot do anything else without mastering this step, so good job! At this point, your computer will forever remember "red" inside of the variable faveColor until you reassign the value, close this page, or leave your computer on long enough that it runs out of power and shuts down! TODO more info')
      /*
   Next: <code class='label label-primary'>faveColor</code>
    <br />
    Next: <code class='label label-primary'>prompt("What's your favorite color?")</code>
    <br />
    Next: <code class='label label-primary'>faveColor = prompt("What's your favorite color?")</code>
    <br />
      */
    ]
  };
  Lessons.insert(lesson);
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
      createLevelDefault();
    }
  
    Lessons.remove({});
    if (Lessons.find().count() === 0) {
      createLessonsDefault();
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
    API.addCollection(Lessons, 'lessons');
    API.start();    
});