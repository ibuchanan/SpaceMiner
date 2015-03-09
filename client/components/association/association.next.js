//Template.associationItem.rendered = function() {  
Template.association.rendered = function() {    
  var el = $(this.firstNode);
  el.sortable();
  el.disableSelection(); 
};

Template.association.helpers({
  items: function() {
    var pairs = _.map(_.pairs(this),
      function(pair) {
      var topic =  { type: 'asc-topic', label: pair[0] + ":", match: null };
      var item = { type: 'asc-item', label: "&nbsp;&nbsp;" + pair[1], match: topic };
      topic.match = item;
      return [ topic, item ];    
    });
    
    return _.shuffle(_.flatten(pairs));
  }
});

Template.association.events({
  'click .checkAnswers': function(evt, template) {
    var correctCount = 0;
    var incorrectCount = 0;
    var totalCount = 0;
    
    template.findAll('.asc-topic').forEach(function(topic) {  
      totalCount++;
      var topicData = Blaze.getView(topic).templateInstance().data;
      var itemEl = $(topic).next('.asc-item')[0];
      var itemData =  Blaze.getView(itemEl).templateInstance().data;
      var item = $(itemEl);
      if (topicData.match === itemData && itemData.match === topicData) {
        item.addClass('asc-correct');
        item.removeClass('asc-incorrect');
        correctCount++;
      }
      else {
        item.addClass('asc-incorrect');
        item.removeClass('asc-correct');
        incorrectCount++;
      }
    });
    
    template.findAll('.asc-item').forEach(function(itemEl) {  
      var item = $(itemEl);
      if (!item.hasClass('asc-correct') && !item.hasClass('asc-incorrect')) {
        item.addClass('asc-incorrect');
        incorrectCount++;
      }
    });
    
    var tally = correctCount + " / " + totalCount;
    $(template.find('.asc-tally')).text(tally);
  }  
});

Template.associationItem.events({
  'click .moveUp': function(evt) {
    var $el = $(evt.target).parent();
    $el.fadeOut(250, function(){
        $el.insertBefore($el.prev());
        $el.fadeIn(250);
    });  
  },
  'click .moveDown': function(evt) {
    var $el = $(evt.target).parent();
    $el.fadeOut(250, function(){
      $el.insertAfter($el.next());
      $el.fadeIn(250);
    });
  } 
  
})