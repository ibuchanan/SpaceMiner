var g = this['window'] !== undefined ? window : global;

var lessonSchema = {
  "title": "Lesson",
  "type": "object",
  "properties": {
    "sections": {
      "type": "array",
      "format": "tabs",
      "title": "Sections",
      "uniqueItems": true,
      "items": {
        "type": "object",
        "title": "Section",
        "properties": {
          "title": {
            "type": "string",
            "title": "Section title"
          },
          "paragraphs": {
            "type": "array",
            "title": "Paragraphs",
            "uniqueItems": true,
            "items": {
              "type": "string",
              "title": "Paragraph",
              "format": "markdown"
            }
          },
        }
      }
    },
    "questions": {
      "type": "array",
      "title": "Questions",
      "uniqueItems": true,
      "items": {
        "type": "object",
        "title": "Question",
        "properties": {
          "title": {
            "type": "string",
            "format": "markdown",
            "title": "Question text"
          },
          "choices": {
            "type": "array",
            "title": "Answer choices",
            "uniqueItems": true,
            "items": {
              "type": "object",
              "title": "Choice",
              "properties": {
                "text": {
                  "type": "string",
                  "title": "Title"
                },
                "feedback": {
                  "type": "string",
                  "format": "markdown",
                  "title": "Feedback"
                },
                "correct": {
                  "type": "boolean",
                  "title": "Is correct?"
                }
              }
            }
          }
        }
      }
    },
    "steps": {
      "type": "array",
      "title": "Practice Steps",
      "uniqueItems": true,
      "items": {
        "type": "object",
        "title": "Step",
        "properties": {
          "name": {
            "type": "string",
            "title": "Step name"
          },
          "title": {
            "type": "string",
            "title": "Title"
          },
          "description": {
            "type": "string",
            "title": "Description and instructions",
            "format": "markdown"
          },
          "code": {
            "type": "string",
            "title": "Code to type",
            "format": "javascript"
          },
          "expectation": {
            "type": "object",
            "title": "Expected result",
            "properties": {
              "value": {
                "type": "string",
                "title": "Specify the expected result that the learner should see",
                "format": "javascript"
              },
              "type": {
                "type": "string",
                "title": "Data type",
                "enum": ["String", "Number", "Boolean", "Object", "Array", "Function", "undefined", "error"]
              },
              "error": {
                "type": "string",
                "title": "If an error is expected, specify the exact string",
                "format": "markdown"
              }
            }
          }
        }
      }
    },
    "challenge": {
      "type": "object",
      "title": "Code Challenge",
      "properties": {
        "name": {
          "type": "string",
          "title": "Short title"
        },
        "title": {
          "type": "string",
          "title": "Full title"
        },
        "instruction": {
          "type": "string",
          "title": "Instructions",
          "format": "markdown"
        },
        "code": {
          "type": "string",
          "title": "Code snippet",
          "format": "javascript"
        },
        "completion": {
          "type": "string",
          "title": "Specify a return statement that delivers a single output result.",
          "format": "javascript"
        },
        "assertion": {
          "type": "string",
          "title": "Assertion code which evaluates to a boolean result by comparings the result from the return statement to an expected result",
          "format": "javascript"
        }
      }
    }
  }
};

function expect(val, error) {
  if (error) {
    return {
      value: error,
      error: error,
      type: 'error'
    };
  }
  if (val === undefined) {
    return {
      value: 'undefined',
      type: 'undefined',
      error: false
    };
  } else {
    return {
      value: val,
      type: (val).constructor.name,
      error: false
    };
  }
}

function step(lessonId, code, title, id, expectation, description) {
  step.index++;
  return {
    name: lessonId + '-' + id,
    code,
    title,
    expectation,
    description,
    current: step.index === 0,
    attempted: false,
    index: step.index
  };
}
step.index = -1;

function secParts(parts) {
  return _.map(parts, (_part, index)=> {
    var title = '';
    var part;
    if (_.isArray(_part)) {
      title = _part[0];
      part = _part[1];
    } else {
      part = _part;
    }
    return typeof part === 'string' ? {
      text: part,
      title,
      seen: false,
      revealed: index === 0,
      index,
      type: 'paragraph'
    } : _.extend(part, { title, index : index, revealed: index === 0 });
  });
}

function sec(title, ...parts) {
  sec.index++;
  // TODO fix hack
  var description = '';
  if (_.isObject(parts[0])) {
    description = parts[0] .description;
    parts = parts.slice(1);
  }
  return {
    title,
    description,
    parts: secParts(parts),
    seen: false,
    index: sec.index
  };
}
sec.index = -1;

function popquiz(...questions) {
  return {
    questions,
    type: 'popquiz'
  };
}

function quickCheck(title, text, evaluator) {
  return {
    title,
    text,
    evaluator,
    type: 'quickCheck'
  };
}

function question(title, ...choices) {
  var correctAnswer = _.findWhere(choices, {correct:true});
  var correctIndex = _.indexOf(choices, correctAnswer);
  return {
    title,
    choices,
    correctIndex
  };
}

function choice(text, feedback, correct=false) {
  return {
    text,
    feedback,
    correct
  };
}

function finish(name, title, code, instruction, completion, assertion) {
  return {
    name,
    title,
    code,
    instruction,
    completion,
    assertion
  };
}

function numericEvaluator(correctValue) {
  return `(function(val) {
try {
val = parseInt(val);
return val === ${correctValue};
} catch (ex) {
bootbox.alert('There was an error with your response...');
}
})`;
}

function dynamicTemplate(name, data) {
  return `<script type='text/spaceminer+dynamic' data-name='${name}'>${data}</script>`;
}

function program(id, script, contentEditable, useStringify) {
  if (contentEditable === undefined) contentEditable = false;
  if (useStringify === undefined) useStringify = true;
  var data = JSON.stringify({
    useStringify,
    script,
    contentEditable
  });
  return dynamicTemplate('program', data);
}

function code(code) {
  return `<pre><code>${code}</code></pre>`;
}

function programSort(program) {
  return dynamicTemplate('programSort', program);
}

function editor(templateName, program) {
  return dynamicTemplate('editor', JSON.stringify({
      name: templateName,
      program: program
    })
  );
}

function association(items) {
  return dynamicTemplate('association', JSON.stringify(items));
}

function smconsole() {
  return `<iframe src='/lessonSmall.html' style='width:100%;height:560px' id='lessonConsole'></iframe>`;
}

function training(trainingId, includeConsole) {
  var markup = dynamicTemplate('game', JSON.stringify({level:trainingId, enableSound:false}));
  if (includeConsole) markup += '\n' + smconsole();
  return markup;
}

function ticTacToe() {
  return dynamicTemplate('ticTacToe', {});
}

function spaceMinerWorld(world) {
  world = world || {};
  return dynamicTemplate('spaceMinerWorld', JSON.stringify(world));
}

function sampleProgramExecAll() {
 return `<button class="executeAll btn btn-success btn-xs" onclick="$('.execute').click();"><span class="command">Execute All</span> <i class="fa fa-check-square-o" style="margin-top: 2px"></i></button>&nbsp;<button class="resetAll btn btn-info btn-xs" onclick="$('.reset').click();">Reset All <i class="fa fa-undo"></i></button>`;
};

function messageInput(data) {
  data = data || {};
  data = JSON.stringify(data);
  return dynamicTemplate('message', data);
}

function dynamo(dynamoName) {
  return dynamicTemplate('dynamo', JSON.stringify({name: dynamoName}));
}

var dbr = `<br/>
<br/>
`;

var lessonsHelpers = {
  lessonSchema,
  numericEvaluator,
  expect,
  step,
  secParts,
  sec,
  popquiz,
  quickCheck,
  question,
  choice,
  finish,
  dynamicTemplate,
  program,
  code,
  programSort,
  editor,
  association,
  smconsole,
  training,
  ticTacToe,
  spaceMinerWorld,
  sampleProgramExecAll,
  dbr,
  messageInput,
  dynamo
};

g.Lessons = new Meteor.Collection("lessons");
g.Lessons.schema = lessonSchema;
g.Lessons.defaultLessons = [];
g.Lessons.add = function(lesson) {
  g.Lessons.defaultLessons.push(lesson);
  sec.index=-1;
  step.index=-1;
}

_.extend(g, lessonsHelpers);