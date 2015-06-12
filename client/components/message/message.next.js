Template.message.events({
  'click .message-send': function(evt, template) {
    var text =  $(template.find('.message-input')).val();
    if (text) message(text);
    else alert('No message to send. Please type a message first.');
  }
})