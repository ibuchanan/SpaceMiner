const g = this['window'] !== undefined ? window : global;

const lessonSchema = {
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
    let title = '';
    let part;
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
  let description = '';
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
  if (questions && questions.length) {
    questions[0].current = true;
    questions[questions.length-1].last = true;
  }
  _.each(questions, (v, index) => v.index = index);
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

function quickCheckDyn(title, text, evaluator) {
  const data = JSON.stringify(quickCheck(title, text, evaluator));
  return dynamicTemplate('quickCheck', data);
}

function question(title, ...choices) {
  const correctAnswer = _.findWhere(choices, {correct:true});
  const correctIndex = _.indexOf(choices, correctAnswer);
  // TODO:
  //_.each(choices, (v, index) => v.index = index);
  return {
    title,
    choices,
    correctIndex,
    current : false,
    attempts : []
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
  const data = JSON.stringify({
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
  let markup = dynamicTemplate('game', JSON.stringify({level:trainingId, enableSound:false}));
  if (includeConsole) markup += '\n' + smconsole();
  return markup;
}

const ticTacToe = () => dynamicTemplate('ticTacToe', {});

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

function dynamo(dynamo) {
  return dynamicTemplate('dynamo', JSON.stringify(dynamo));
}

const dbr = `<br/>
<br/>
`;

let v1TeamRoom = (url='https://www14.v1host.com/v1sdktesting/TeamRoom.mvc/Show/58142') => {
  return `<iframe src='${url}' style='width:100%;height:400px' id='v1TeamRoom'></iframe>`;
};

let script = (code, type='text/javascript') => `<xmp type='${type}'>${code}</xmp>`;

const key = (name, text, hrefs) => {
  return dynamicTemplate('key', JSON.stringify({
    name,
    text,
    hrefs
  }));
};

const ask = text => dynamicTemplate('ask', JSON.stringify({text}));

const create = (levelLessonId, customSpritesEnabled=true, buttons=['update', 'test', 'release']) => dynamicTemplate('create', JSON.stringify({levelLessonId, customSpritesEnabled, buttons}));

const createSimple = levelLessonId => create(levelLessonId, false, ['update']);

const createWithTest = levelLessonId => create(levelLessonId, false, ['update', 'test']);

const lessonsHelpers = {
  lessonSchema,
  numericEvaluator,
  expect,
  step,
  secParts,
  sec,
  popquiz,
  quickCheck,
  quickCheckDyn,
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
  dynamo,
  v1TeamRoom,
  script,
  key,
  ask,
  create,
  createSimple,
  createWithTest
};

g.Lessons = new Meteor.Collection("lessons");
g.Lessons.schema = lessonSchema;
g.Lessons.defaultLessons = [];
g.Lessons.defaultLessonsParams = {};
g.Lessons.add = function(lesson, params=null) {
  g.Lessons.defaultLessons.push(lesson);
  if (params !== null) g.Lessons.defaultLessonsParams[params[1]] = params;
  sec.index=-1;
  step.index=-1;
}
g.Lessons.repopulate = function(lessonId='') {
  g.Lessons.defaultLessons.length = 0;
  for(let key of Object.keys(g.Lessons.defaultLessonsParams)) {
    const param = g.Lessons.defaultLessonsParams[key];    
    const currentLessonId = param[1];
    if (lessonId === '' || currentLessonId === lessonId) {
      console.log('Refreshing lesson: ', currentLessonId);
      g.markdownLesson(...param);
    }
  }
};
g.Lessons.lessonPath = lessonName => {
  // TODO ridiculous
  if (Meteor.isServer) {
    let path = Npm.require('path');
    return path.resolve(`../web.browser/app/lessons/${lessonName}`);
  } else {
    return '';
  }
}
g.Lessons.secStepLink = (lessonId, secIndex, partIndex) => `/lesson?id=${lessonId}&sec=${secIndex+1}&part=${partIndex+1}`;
g.Lessons.resourcePath = (lessonId, secIndex, partIndex) => `lesson/${lessonId}/${secIndex}/${partIndex}`;

_.extend(g, lessonsHelpers);