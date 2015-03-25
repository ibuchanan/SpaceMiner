function updateUserProgram(userProgram) {
  userProgram.lastSaved = new Date();
  var obj = _.omit(userProgram, '_id', 'version');
  UserPrograms.update(userProgram._id,
    {
      $set: obj,
      $inc: {'version': 1}
    },
    {
      removeEmptyStrings: false
    }
  );
}

function getUserProgramForCurrentUser(program) {
  return UserPrograms.findOneForUser(program, Meteor.userId());
}

Template.editorProgram.created = function() {
  this._instanceId = Meteor.uuid();
};

function getEditor(template) {
  var id = getId(template);
  var editor = ace.edit(id);
  return editor;
}

Template.editorProgram.rendered = function() {
  var userProgram = getUserProgramForCurrentUser(this.data.program);
  this.data.program = userProgram;
  var editor = getEditor(this);
  editor.setTheme("ace/theme/chrome");
  var session = editor.getSession();
  session.setMode("ace/mode/javascript");
  var code = this.data.program.code;
  editor.setOptions({
    maxLines: 18,
    minLines: 18,
    fontSize: 20,
    showPrintMargin: false,
    readOnly: false,
    highlightActiveLine: true,
    highlightGutterLine: true
  });

  session.setOptions({useWorker: false});
  session.setTabSize(2);
  session.setValue(code);

  editor.renderer.setPadding(20);
}

function getId(instance) {
  return instance._instanceId;
}

Template.editorProgram.helpers({
  getId: function() {
    return getId(Template.instance());
  },
  contentEditable: function() {
    return this.contentEditable ? 'contentEditable' : '';
  },
  contentEditableClass: function() {
    return this.contentEditable ? 'editable' : '';
  }
});

Template.editorProgram.events({
  'click .changesSave': function(evt, template) {
    var editor = getEditor(template);
    var code = editor.getSession().getValue();
    template.data.program.code = code;
    updateUserProgram(template.data.program);
  },
  'click .execute': function(evt, template) {
    var editor = getEditor(template);
    var program = $(template.firstNode);
    var useStringify = this.useStringify;
    var output = program.find('.ePrg-output');
    var code = editor.getSession().getValue();
    output.text('').hide();
    var printed = false;
    var console = {
      log : function(val) {
        printed = true;
        output.append(val + "\n");
      }
    };
    var print = console.log;
    var printb = function(val) {
      printed = true;
      output.append(val);
    }

    var printArray = function(array) {
      array.forEach(print);
    }

    var printbArray = function(array) {
      array.forEach(printb);
    }

    var ttt = {
      get game() {
        return window.tttGame.get();
      },
      update: function() { window.tttGame.set(this.game); }
    };

    var result;
    try {
      result = eval(code);
    } catch(ex) {
      result = "*Error executing program*";
      window.console.error(ex);
    }
    output.parents().show();
    if(!printed) {
      if (useStringify === 'true') {
        result = JSON.stringify(result, ' ', 2);
      }
      output.text(result).fadeIn();
    } else {
      output.fadeIn();
    }
    var outputContainer = program.find('.ePrg-outputContainer');
    outputContainer.effect('highlight', {color:'green'});
  },
  'click .clear': function(evt, template) {
    var program = $(template.firstNode);
    var output = program.find('.ePrg-output');
    var outputContainer = program.find('.ePrg-outputContainer');
    output.empty();
    outputContainer.effect('highlight', {color:'blue'});
  }
});