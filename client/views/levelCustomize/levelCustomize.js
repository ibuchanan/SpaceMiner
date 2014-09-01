_.extend(Template.levelCustomize, {
  spriteParts: function() {
    return SpriteParts.find({}, {sort: {sort: 1}});  
  },
  events: {
    'click img' : function(evt, template) {
      var parentDocId = $(evt.currentTarget).attr("data-parent");
      SpriteParts._collection.update({_id: parentDocId}, {$set: {selected: String(this)}});
    }, 
    'click button.save': function(evt,template){
      var board = JSON.parse($('#levelBoard').val());
      var name = $('#levelName').val() || 'nameo';
      var selections = [];
      SpriteParts.find({}, {sort: {sort: 1}}).forEach(function(part) {
        selections.push(part.selected);
      });
      var level = {
        board: board,
        name: name,
        selections: selections
      };      
      Meteor.call('levelSave', level);
    }
  }
});m