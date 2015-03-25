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
      var index = $(topic).index();
      var itemEl = template.findAll('.asc-item')[index];
      var itemData =  Blaze.getView(itemEl).templateInstance().data;
      var item = $(itemEl);
      if (topicData.match.label === itemData.label && itemData.match.label === topicData.label) {
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
});