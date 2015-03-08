Template.program.events({
  'click .execute': function(evt, template) {
    var program = $(template.firstNode);
    var useStringify = this.useStringify;
    var disp = program.find('.display');
    var code = program.find('.code').text();
    disp.text('').hide();
    var printed = false;
    var console = {
      log : function(val) {
        printed = true;
        disp.append(val + "\n");
      }
    };
    var print = console.log;
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
  }
});