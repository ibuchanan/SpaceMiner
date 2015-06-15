/*

Example of a dynamic template to try:

{{> message title="My Chatroom" author="Josh" style="* {background-color: red; color: yellow; border: 10px inset purple; text-align: center;} * .message-send { background: orange }"}}


*/
function getUserDynamoForCurrentUser(dynamo) {
  return UserDynamos.findOneForUser(dynamo, Meteor.userId(), true);
}

function createId() {
  return 's' +  Meteor.uuid();
}

function makeIdProperties(instance, props) {
  _.each(props, function(prop) {
    instance[prop] = createId();
    var helper  = {};
    helper[prop] = function() {
      return Template.instance()[prop];
    };
    instance.view.template.helpers(helper);
  });
}

function makeCss(rules) {
  var css = '';
  _.each(rules, function(value, key) {
    css += key + ': ' + value + ';\n';
  });
  return ' {\n' + css + '}';
}

function updateTemplate(dynamo, templateId) {
  var compiled = SpacebarsCompiler.compile("<section class='{{id}}'><style>{{styles}}</style>" + dynamo.template + "</section>",
    { isTemplate: true });
  var renderer = eval(compiled);
  if (Template[templateId]) delete Template[templateId];
  Template.__define__(templateId, renderer);
  var dynamo_template = Template[templateId];

  dynamo_template.created = function() {
    this.id = templateId;
    this.tmpl = dynamo.template;
    this.style = dynamo.style;
  };

  dynamo_template.helpers({
    id: function() { return Template.instance().id; },
    styles: function() {
      var style = Template.instance().style;
      style = style.replace(/\*/g, '.' + Template.instance().id);
      return style;
    }
  });
}

function updateDynamoFromUI(template) {
  var dynamo = template.data.dynamo;
  var tmpl = getEditor(template, 'template').getSession().getValue();
  var style = getEditor(template, 'style').getSession().getValue();
  var data = getEditor(template, 'data').getSession().getValue();
  dynamo.template = tmpl;
  dynamo.style = style;
  dynamo.data = data;
}

function getId(instance) {
  return instance._instanceId;
}

function getEditor(template, editorName) {
  var editorId = template[editorName + 'EditorId'];
  var editor = ace.edit(editorId);
  return editor;
}

function configureEditor(editor, lang, code) {
  editor.setTheme("ace/theme/chrome");
  var session = editor.getSession();
  session.setMode('ace/mode/' + lang);
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

Template.dynamo.created = function() {
  this._instanceId = createId();
  this._templateId = createId();
  makeIdProperties(this, [
    'templateTabId', 'templateEditorId',
    'styleTabId', 'styleEditorId',
    'dataTabId', 'dataEditorId',
    'tabsNavId',
    'resultTabId'
    ]);
  this.tmplData = new ReactiveVar({});
  this.tmplDep = new Deps.Dependency();
  this.tabSelected = this.data.tabSelected;
  var userDynamo = getUserDynamoForCurrentUser(this.data);
  if (this.data.options) {
    this.options = this.data.options;
    if (_.isString(this.options)) this.options = JSON.parse(this.options);
  } else {
    this.options = {
      mode: 'edit',
      editors: ['all']
    }
  }
  this.data.dynamo = userDynamo;
};

Template.dynamo.rendered = function() {
  render(this);
  configureEditor(getEditor(this, 'template'), 'html', this.data.dynamo.template);
  configureEditor(getEditor(this, 'style'), 'css', this.data.dynamo.style);
  configureEditor(getEditor(this, 'data'), 'json', this.data.dynamo.data);

  if (this.tabSelected) {
    tabSelect(this, this.tabSelected);
  }
};

function getDynamoVal(instance, prop) {
  var dynamo = instance.data.dynamo;
  return dynamo ? dynamo[prop] : '';
}

Template.dynamo.helpers({
  instanceId: function() { return getId(Template.instance()); },
  styleDefault: function() { return getDynamoVal(Template.instance(), 'style'); },
  tmplDefault: function() { return getDynamoVal(Template.instance(), 'template'); },
  dataDefault: function() {
    var data = getDynamoVal(Template.instance(), 'data');
    if (_.isString(data)) {
      try {
        data = JSON.parse(data);
      }
      catch (ex) {
        return '';
      }
    }
    return JSON.stringify(data, 2, ' ');
  },
  isEdit: function() {
    var options = Template.instance().options;
    var isEdit = options.mode === 'edit';
    return isEdit;
  },
  items: function() {
    Template.instance().tmplDep.depend();
    var data = Template.instance().tmplData.get();
    var obj = {};
    try {
      obj = JSON.parse(data);
    } catch (ex) {
      // do nothing...
    }
    var templateId = Template.instance()._templateId;
    if(_.isArray(obj)) {
      _.each(obj, function(item) {
        item._templateId = templateId;
      })
    } else {
      obj._templateId = templateId;
      obj = [obj]; // Arrayify this lonely solo object into a lonely, solo array.
    }
    return obj;
  }
});

function render(template) {
  var dynamo = template.data.dynamo;
  updateTemplate(dynamo, template._templateId);
  template.tmplData.set(template.data.dynamo.data);
  template.tmplDep.changed();
}

function tabSelect(template, tabName) {
  $('#' + template.tabsNavId + ' a[href="#' + template[tabName + 'TabId'] + '"]').tab('show');
}

Template.dynamo.events({
  'click .update': function(evt, template) {
    updateDynamoFromUI(template);
    render(template);
    tabSelect(template, 'result');
  },
  'click .save': function(evt, template) {
    updateDynamoFromUI(template);
    UserDynamos.updateUserDynamo(template.data.dynamo);
  }
});