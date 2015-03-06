window.sampleProgramExec = function() {
  var el = $(this);
  var program = el.parents('.program');
  var useStringify = program.attr("data-usestringify");
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
  dispContainer.effect('highlight');

  el.find('.unexecuted')
    .removeClass('unexecuted fa-square-o')
    .addClass('executed fa-check-square-o');

  el.removeClass('btn-success').addClass('btn-primary');
  el.find('.command').text('Re-execute');
};

window.sampleProgramReset = function() {
  var el = $(this);
  var disp = el.parents('.program').find('.display');

  disp.parent().fadeOut('fast', function() { disp.empty(); });

  var execute = el.parents('.program').find('.execute');

  execute.find('.executed')
    .removeClass('executed fa-check-square-o')
    .addClass('unexecuted fa-square-o');

  execute.removeClass('btn-primary').addClass('btn-success');
  execute.find('.command').text('Execute');

  el.parents('.program').effect('shake');
};

window.sampleProgramWireupAll = function() {  
  $('script[type="text/spaceminer"]').each(function() {
    var el = $(this);
    var script = JSON.parse(el.text());
    var html = `<div class='well well-sm program' data-usestringify='${script.useStringify}'>
<pre><code class='code'>${script.code}</code><div style="float:right"><button class="execute btn btn-success btn-sm"><span class="command">Execute</span> <i class="fa fa-square-o unexecuted" style="margin-top: 2px"></i></button>&nbsp;<button class="reset btn btn-info btn-sm">Reset <i class="fa fa-undo"></i></button></div></pre>
  <pre style='background: black; color: #fefefe; display:none;' class='displayContainer'><code class='display' style='font-weight:bold;'></code></pre>
</div>`;
    var program = $(html);
    program.find('.execute').click(sampleProgramExec);
    program.find('.reset').click(sampleProgramReset);
    el.after(program);
    el.remove();
  });
};