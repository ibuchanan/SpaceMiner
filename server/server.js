var glob = Meteor.npmRequire("glob");      

Meteor.startup(function () {
    if (Levels.find().count() === 0) {
      Levels.insert({name: "Level 1"});
    }
  
    if (SpriteParts.find().count() === 0) {
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
                choices: parts
              });
          });
      }));
    }
  
    API = new CollectionAPI({});
    API.addCollection(Levels, 'levels');
    API.start();    
});