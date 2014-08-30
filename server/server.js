Meteor.startup(function () {
    if (Levels.find().count() === 0) {
      Levels.insert({name: "Level 1"});
    }
    if (SpriteParts.find().count() === 0) {
      SpriteParts.insert({part: 'Player', choices:["playerLight.png", "playerDark.png"]});
      SpriteParts.insert({part: 'Enemy', choices:["enemyLight.png", "enemyDark.png"]});
      SpriteParts.insert({part: 'Treasure', choices:["treasureLight.png", "treasureDark.png"]});
      SpriteParts.insert({part: 'Coin', choices:["coinLight.png", "coinDark.png"]});
    }
    API = new CollectionAPI({});
    API.addCollection(Levels, 'levels');
    API.start();    
});
