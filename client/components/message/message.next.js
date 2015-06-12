Template.message.created = function() {
  if (!_.has(this.data, 'backgroundColor')) this.data.backgroundColor = 'black';
  if (!_.has(this.data, 'title')) this.data.title = 'IntergalactiChat';
  if (!_.has(this.data, 'author')) this.data.author = 'SpaceMiner, Inc.';
};

Template.message.events({
  'click .message-send': function(evt, template) {
    var text =  $(template.find('.message-input')).val();
    if (text) message(text);
    else alert('No message to send. Please type a message first.');
  }
})