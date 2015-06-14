Template.message.created = function() {
  this._instanceId = 's' + Meteor.uuid();
  if (!_.has(this.data, 'style')) this.data.style = {'background-color': 'black'};
  if (!_.has(this.data, 'title')) this.data.title = 'IntergalactiChat';
  if (!_.has(this.data, 'author')) this.data.author = 'SpaceMiner, Inc.';
  var style = this.data.style;
  if (_.isObject(style)) {
    this.data.style = css(this._instanceId, style);
  } else {
    if (style.indexOf('*') === 0) {
      this.data.style = style.replace(/\*/g, '.' + this._instanceId + ' ');
    }
    else {
      this.data.style = '.' + this._instanceId + '{ ' + style + ' }';
    }
  }
};

Template.message.helpers({
  instanceId: function() {
    return Template.instance()._instanceId;
  }
});

Template.message.events({
  'click .message-send': function(evt, template) {
    var text =  $(template.find('.message-input')).val();
    if (text) message(text);
    else alert('No message to send. Please type a message first.');
  },
  'keypress .message-input': function(evt, template) {
    if (event.charCode == 13) {
      var text =  $(template.find('.message-input')).val();
      if (text) message(text);
      else alert('No message to send. Please type a message first.');
    }
  }
});