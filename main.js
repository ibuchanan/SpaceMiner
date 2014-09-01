Levels = new Meteor.Collection("levels");
SpriteParts = new Meteor.Collection("spriteParts");
SpriteSheets = new Meteor.Collection("spriteSheets");

Router.map(function() {
  this.route('home', {path: '/'});
  this.route('about');  
});