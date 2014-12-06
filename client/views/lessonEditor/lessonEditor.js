Template.lessonEditor.rendered = function() {
  Lesson.schema.format = 'grid';
  JSONEditor.plugins.epiceditor.basePath = '//cdnjs.cloudflare.com/ajax/libs/epiceditor/0.2.2';
  JSONEditor.defaults.theme = 'bootstrap3';
  JSONEditor.defaults.iconlib = 'fontawesome4';
  JSONEditor.plugins.ace.basePath = '//cdnjs.cloudflare.com/ajax/libs/ace/1.1.3';
  var editor = new JSONEditor(document.getElementById('lessonEditor'), {
    // The schema for the editor
    schema: Lesson.schema,
    disable_edit_json: true,
    disable_properties: true,
    no_additional_properties: true
  });  
  window.myEditor = editor;
};