/*

Example of a dynamic template to try:

{{> message title="My Chatroom" author="Josh" style="* {background-color: red; color: yellow; border: 10px inset purple; text-align: center;} * .message-send { background: orange }"}}


*/
function getUserDynamoForCurrentUser(dynamo) {
  return UserDynamos.findOneForUser(dynamo, Meteor.userId(), true);
}

function makeCss(rules) {
  var css = '';
  _.each(rules, function(value, key) {
    css += key + ': ' + value + ';\n';
  });
  return ' {\n' + css + '}';
}

function updateTemplate(tmpl, style, templateId) {
  var compiled = SpacebarsCompiler.compile("<section class='{{id}}'><style>{{styles}}</style>" + tmpl + "</section>",
    { isTemplate: true });
  var renderer = eval(compiled);
  if (Template[templateId]) delete Template[templateId];
  Template.__define__(templateId, renderer);
  var dynamo_template = Template[templateId];

  dynamo_template.created = function() {
    this.id = templateId;
    this.tmpl = tmpl;
    this.style = style;
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

var tmplDefault = "<div>\n" +
" <div class='name'>Name is: {{name}}</div>\n" +
" <div class='age'>Age: {{age}}</div>\n" +
" {{#each board}}\n" +
"  <div>\n" +
"   {{#each this}}\n" +
"    {{this}}\n" +
"   {{/each}}\n" +
"  </div>\n" +
" {{/each}}\n" +
"</div>";

var styleDefault = "* {\n" +
"  color: blue;\n" +
"  background: green;\n" +
"}\n" +
"* .name {\n" +
" color: yellow;\n" +
"}\n" +
"* .age {\n" +
" color: orange;\n" +
"}\n";

var dataDefault = [
  {
    "name": "Jogo",
    "age": 11,
    "board": [
      ["o", "x", "x"],
      ["x", "o", "o"],
      ["o", "x", "o"]
    ]
  },
  {
    "name": "Ceth",
    "age": 12,
    "board": [
      ["x", "x", "x"],
      ["o", "x", "o"],
      ["o", "o", "o"]
    ]
  }
];

function getId(instance) {
  return instance._instanceId;
}

Template.dynamo.created = function() {
  this._instanceId = 's' + Meteor.uuid();
  this._templateId = 's' + Meteor.uuid();
  this.tmplData = new ReactiveVar(JSON.stringify(dataDefault));
  this.tmplDep = new Deps.Dependency();
  var userDynamo = getUserDynamoForCurrentUser(this.data);
  this.data.dynamo = userDynamo;
};

Template.dynamo.rendered = function() {
  render(this);
};

function getDynamoVal(instance, prop, defVal) {
  var dynamo = instance.data.dynamo;
  return dynamo ? dynamo[prop] : defVal;
}

Template.dynamo.helpers({
  instanceId: function() { return getId(Template.instance()); },
  styleDefault: function() { return getDynamoVal(Template.instance(), 'style', styleDefault); },
  tmplDefault: function() { return getDynamoVal(Template.instance(), 'template', tmplDefault); },
  dataDefault: function() {
    var data = getDynamoVal(Template.instance(), 'data', dataDefault);
    if (_.isString(data)) data = JSON.parse(data);
    return JSON.stringify(data, 2, ' ');
  },
  items: function() {
    Template.instance().tmplDep.depend();
    var data = Template.instance().tmplData.get();
    var obj = JSON.parse(data);
    var templateId = Template.instance()._templateId;
    if(_.isArray(obj)) {
      _.each(obj, function(item) {
        item._templateId = templateId;
      })
    } else {
      obj._templateId = templateId;
    }
    return obj;
  }
});

function render(template) {
  var instance = $(template.firstNode);
  var val = instance.find('.tmpl').val();
  var style = instance.find('.style').val();
  updateTemplate(val, style, template._templateId);
  var data = instance.find('.data').val();
  template.tmplData.set(data);
  template.tmplDep.changed();
}

Template.dynamo.events({
  'click .update': function(evt, template) {
    render(template);
  },
  'click .save': function(evt, template) {
    console.log("temp data:");
    console.log(template.data);
    var instance = $(template.firstNode);
    var tmpl = instance.find('.tmpl').val();
    var style = instance.find('.style').val();
    var data = instance.find('.data').val();
    template.data.dynamo.template = tmpl
    template.data.dynamo.style = style;
    template.data.dynamo.data = data;
    UserDynamos.updateUserDynamo(template.data.dynamo);
  }
});