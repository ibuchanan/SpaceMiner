var gm = Meteor.npmRequire('gm');

Meteor.startup(function () {
    Router.map(function() {
      this.route('levelSpriteSheet/:name', {
        where: 'server',
        action: function() {
          var sheet = SpriteSheets.findOne({name: this.params.name})
          var img = new Buffer(sheet.data, 'base64');         
          this.response.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length
          });
          this.response.end(img);
        }
      });
    });
  
    Meteor.methods({
      'getSpritePreview': function(name, selections) {        
        var root = '/home/action/Towerman/public/images/spriteParts/';
        var sprite = _.reduce(_.rest(selections, 1), function(sprite, selection) { 
          return sprite.append(root + selection);
        }, gm(root + selections[0]).options({imageMagick:true}));
        sprite.toBuffer('PNG', Meteor.bindEnvironment(function (err, buffer) {
          var data = buffer.toString('base64');
          SpriteSheets.upsert({name:name}, {$set: {data:data}});
        }));
        //sprite.write("/home/action/Towerman/sprite.png", function(err){
          // console.log(err);
        //});        
      }
    });
  
    if (Levels.find().count() === 0) {
      Levels.insert({name: "Level 1"});
    }
  
    SpriteParts.remove({});
    if (SpriteParts.find().count() === 0) {
      var spritePartSort = {
        Player: 1,
        Enemy: 2,
        Treasure: 3,
        Coin: 4
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
                sort: spritePartSort[category]
              });
          });
      }));
    }
  
    API = new CollectionAPI({});
    API.addCollection(Levels, 'levels');
    API.start();    
});