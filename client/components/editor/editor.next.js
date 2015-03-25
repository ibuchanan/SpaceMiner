Template.editor.created = function() {
  this.editorTabId = Meteor.uuid();  
  this.consoleTabId = Meteor.uuid();
};

Template.editor.helpers({
  editorTabId: function() { return Template.instance().editorTabId; },
  consoleTabId: function() { return Template.instance().consoleTabId; },
  templateName: function() { return this.name; },
  templateData: function() { return this.data ? this.data : {}; }
});