Template.program.created = function() {
  this._instanceId = Meteor.uuid();
};

let aceEditorPathSet = false;

function getEditor(template) {
  var id = getId(template);
  if (!aceEditorPathSet) {
    for (let path of ['modePath', 'themePath', 'workerPath', 'basePath']) {
      ace.config.set(path, '/packages/mrt_ace-embed/ace');
    }
    aceEditorPathSet = true;
  }
  var editor = ace.edit(id);
  return editor;
}

Template.program.rendered = function() {
  if (!_.has(this.data, 'contentEditable')) this.data = {
    contentEditable : true,
    script: '',
    useStringify: true
  };
  var editor = getEditor(this);
  editor.setTheme("ace/theme/chrome");
  var session = editor.getSession();
  session.setMode("ace/mode/javascript");
  var script = this.data.script;
  editor.setOptions({
    maxLines: 50,
    fontSize: 20,
    showPrintMargin: false,
    readOnly: !this.data.contentEditable,
    highlightActiveLine: this.data.contentEditable,
    highlightGutterLine: this.data.contentEditable
  });

  session.setOptions({useWorker: false});
  session.setTabSize(2);
  session.setValue(script);

  editor.renderer.setPadding(20);
  if (!this.data.contentEditable) {
    editor.renderer.$cursorLayer.element.style.opacity = 0;
  }
}

function getId(instance) {
  return instance._instanceId;
}

Template.program.helpers({
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

Template.program.events({
  'click .execute': function(evt, template) {
    var editor = getEditor(template);
    var program = $(template.firstNode);
    var useStringify = this.useStringify;
    var disp = program.find('.display');
    var code = editor.getSession().getValue();
    disp.text('').hide();
    var printed = false;
    var realConsole = console;
    var console = {
      log : function(val) {
        printed = true;
        disp.append(val + "\n");
      }
    };
    var print = console.log;
    
    var printb = function(val) {
      printed = true;
      disp.append(val);
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
    disp.parents().show();
    if(!printed) {
      if (useStringify === 'true') {
        result = JSON.stringify(result, ' ', 2);
      }
      disp.text(result).fadeIn();
    } else {
      disp.fadeIn();
    }
    var dispContainer = program.find('.displayContainer');
    dispContainer.effect('highlight', {color:'green'});

    program.find('.unexecuted')
      .removeClass('unexecuted fa-square-o')
      .addClass('executed fa-check-square-o');

    var execute = program.find('.execute');
    execute.removeClass('btn-success').addClass('btn-primary');
    execute.find('.command').text('Re-execute');
  },
  'click .reset': function(evt, template) {
    var program = $(template.firstNode);
    var disp = program.find('.display');

    disp.parent().fadeOut('fast', function() { disp.empty(); });
    
    var execute = program.find('.execute');

    execute.find('.executed')
      .removeClass('executed fa-check-square-o')
      .addClass('unexecuted fa-square-o');

    execute.removeClass('btn-primary').addClass('btn-success');
    execute.find('.command').text('Execute');    

    program.effect('highlight', {color:'blue'});    
    
    program.find('.displayContainer').hide();
  }
});