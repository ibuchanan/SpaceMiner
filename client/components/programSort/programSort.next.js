Template.programSort.rendered = function() {
  var el = $(this.firstNode);
  el.sortable();
  el.disableSelection(); 
};

Template.programSort.helpers({
  lines: function() {
    var lines = this.split('\n');
    return lines;
  }
});

Template.programSort.events({
  'click .programSortExecute': function(evt, template) {
    try {
      var text = $(template.firstNode).text();
      eval(text);
    } catch(ex) {
      console.error(ex);
    }
  },
  'click .moveUp': function(evt) {
    var $el = $(evt.target).parent().parent();
    $el.fadeOut(250, function(){
        $el.insertBefore($el.prev());
        $el.fadeIn(250);
    });  
  },
  'click .moveDown': function(evt) {
    var $el = $(evt.target).parent().parent();
    $el.fadeOut(250, function(){
      $el.insertAfter($el.next());
      $el.fadeIn(250);
    });
  }
});