//Template.associationItem.rendered = function() {  
Template.association.rendered = function() {    
  var el = $(this.firstNode);
  el.sortable({items:'.asc-item'});
  el.disableSelection(); 
};

Template.association.helpers({
  items: function() {

    var topics = [];
    var items = [];

    _.each(this, function(value, key) {
        var topic =  { type: 'asc-topic', label: key, match: null };
        var item = { type: 'asc-item', label: value, match: topic };
        topic.match = item;
        topics.push(topic);
        items.push(item);
    });

    items = _.shuffle(items);

    return {
      topics: topics,
      items: items
    }
    /*
    var pairs = _.zip(topics, items);
    //var flat = _.flatten(pairs);    
    
    //return flat;
    
    pairs = _.map(pairs, function(pair) {
      return {
        topic: pair[0],
        item: pair[1]
      };
    });
    
    return pairs;
    */
    
    /*
    var topics = _.keys(this);
    var items = _.values(this);
    var pairs = _.zip(topics, items);
    
    var pairs = _.map(_.pairs(this),
      function(pair) {
      var topic =  { type: 'asc-topic', label: '<span class="fa fa-question-circle"></span>&nbsp;' + pair[0] + "&nbsp;", match: null };
      var item = { type: 'asc-item', label: '<span class="fa fa-arrow-circle-right"></span>&nbsp;' + pair[1], match: topic };
      topic.match = item;
      return [ topic, item ];    
    });
    
    return _.shuffle(_.flatten(pairs));
    */
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