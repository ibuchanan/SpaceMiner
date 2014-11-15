var that = this;
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
                  "title": "Choices",
                  "uniqueItems": true,
                  "items": {
                    "type": "object",
                    "title": "Choice",
                    "properties": {
                      "title": {
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
          }
        }
      }
    }
  }
};
       
(function() {  
  function value(val) {
      return {
        value: val === undefined ? 'undefined' : val,
        type: typeof val
      };
    }
  
  function error(message) {
    return {
      error: message
    };
  }
  
  var lessonId = 'variables';
  
  function step(code, title, id, expectation, description) {
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
  
  function sec(title, ...paragraphs) {
    return {
      title,
      paragraphs
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
  
  that.Lesson = { schema : lessonSchema };
  //Lessons.insert(lesson);
})();