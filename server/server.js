Meteor.startup(function () {
    if (Levels.find().count() === 0) {
      Levels.insert({name: "Level 1"});
    }
    API = new CollectionAPI({});
    API.addCollection(Levels, 'levels');
    API.start();    
});
