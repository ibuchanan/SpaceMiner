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
      var tile = '';
      SpriteParts.find({}, {sort: {sort: 1}}).forEach(function(part) {
        if (part.selected.indexOf('tile') > -1) {
          tile = part.selected;
        } else {
          selections.push(part.selected);
        }
      });
      var level = {
        board: board,
        name: name,
        selections: selections,
        tile: tile
      };
      Meteor.call('levelSave', level);
    }
  }
});m