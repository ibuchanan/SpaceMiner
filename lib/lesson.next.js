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
            "format": "markdown"
          },
          "expectation": {
            "type": "object",
            "title": "Expected result",
            "properties": {
              "value": {
                "type": "string",
                "title": "Specify the expected result that the learner should see",
                "format": "markdown"
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
          "format": "markdown"                
        },
        "completion": {
          "type": "string",
          "title": "Specify a return statement that delivers a single output result.",
          "format": "markdown"
        },
        "assertion": {
          "type": "string",
          "title": "Assertion code which evaluates to a boolean result by comparings the result from the return statement to an expected result",
          "format": "markdown"
        }
      }
    }    
  }
};

(function() {  
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
  
  that.Lesson.defaultLesson = {
    _id: lessonId,
    title: 'Make your game remember things with variables',
    sections: [
      sec('Types of memory', 
        "In order to fix the browser's malfunctioning memory, you need to learn a little bit about how computers remember things. Just like your brain, your computer, and by extension your web browser, has <b>memory</b>. Computers use two major types of memory, one for short-term needs, and one for long-term needs. For short-term memory, computers use a type of memory called <b>Random Access Memory (RAM)</b>. Computers store information in RAM that they need to know right now. This usually includes everything that is currently running on your computer or device, and the operating system itself. So, the web browser you are using right now is running in your computer's RAM", 
        "Another type of memory is long-term storage. This is typically in the form of a hard drive, memory stick or card, or cloud-based system that lets you save information on a computer running somewhere on the internet. When you download a file, such as pictures, videos, or documents, from the internet, your computer or other device usually saves the file into long-term storage. We refer to it as <i>long-term</i> because once you save information in a device's long-term stroage, you can safely turn the device off completely, then turn it back on and still have the information right where you left it. Normally it doesn't matter how long the device is turned off before you turn it back on again, so long as nobody else deleted it or the device doesn't otherwise stop working."),
      sec('How long-term storage and RAM relate', 
        "To understand how long-term storage and RAM are related, here is something to think about. Popular games like Minecraft use a combination of RAM and long-term storage. When you play Minecraft, everything you see on the screen is loaded into your computer's RAM. But, since Minecraft is so big, all the information cannot possibly fit into your computer's RAM at one time. Instead, the Minecraft game servers keep lots of information in their own long-term storage until they detect that you or someone else needs to use it. Then they will load that information from long-term storage into their own RAM and send it over the internet to you, where your computer will copy it into it's own RAM. This is a simplification of what happens.", 
        "Another example is that all the photos that people take and share with Instagram or Facebook tend to hang around for years unless you delete them. But, unless someone is looking at pictures taken years ago, then no computers in the world will have that information in RAM right now. However, if you browse to one of those old photos, Facebook will locate it in long-term storage, load it into its own RAM, then send the information to you over the internet where your own device can copy it into its own RAM. Facebook will likely forget about it after that for years to come.")
    ],    
    questions: [
      question('What type of memory do you think your browser uses when it asks you your name in order to display it back to you immediately?',
        choice('Long-term storage', 'Probably not. Here\'s why: if the browser wanted to remember your name forever and ever, this would be correct! But, since the browser is simply remembering your name long enough to display it back to you immediately, it only needs to store your name in RAM. However, in a later lesson, we will show you have to make your browser remember your name with drive space forever.'),
        choice('RAM', 'That\'s right! Since the browser is only remembering your name long enough to display it back to you immediately, it only needs to keep it in Random Access Memory, or RAM, for a short period of time. However, in a later lesson, we will show you have to make your browser remember your name with drive space forever.', true)
      )
    ],
    steps: [
      step('faveColor', 'Your first line of code, I do declare', 'undeclared-variable', expect(null,'ReferenceError: faveColor is not defined'), 'You get this error because you first need to tell your computer to recognize <code>faveColor</code> as a <b>variable</b>. A variable lets you store information in the computer\'s RAM. This is easy to do. To learn how, click next...'),
      step('var faveColor', 'Use the var keyword to declare a variable in memory', 'declare-variable', expect(undefined), 'You just used your first JavaScript language keyword, <code>var</code> to tell the computer to reserve a place in memory named <code>faveColor</code>, but right now it is like an emoty brain cell waiting to be filled with information. The response <code>undefined</code> is a type of <b>value</b> that represents a variable that does not have any other assigned value. To get the computer to remember your favorite color, you have to learn about another type of value, and then about <b>variable assignment</b>. Keep going...'),
      step('red', 'Another undeclared variable error message from the interpreter', 'undeclared-variable-red', expect(null,'ReferenceError: red is not defined'), 'An error again? The reason is the same as before. The computer does not recognize <b>red</b> as defined variable. But, there is a simple way to use that color name, and any other, in a way that the computer recognizes as a <b>string</b> type...'),
      step('"red\"', 'Type a string value using double-quotes around text', 'string-variable', expect('"red"'), 'Now you\'re getting somewhere! When the console simply echoes <b>"red"</b> back to you it is telling you that you sent it a value that it could process. In this case, because we surrounded the three characters <b>red</b> with a pair of <b>"</b> characters, the computer recognizes it as a <b>string</b> type. There are several other types of values you can type in that you will learn about later, but try typing each of the following, but do not surroundi them by " charactersjust to get a preview:  <p><ul><li>44</li><li>1.5</li><li>true</li><li>false</li></ul></p>.<p>Let\'s keep going for now...</p>'),
      step('faveColor = "red"', 'Assign a string value into the faveColor variable to make it remember', 'assign-string-value', expect('"red"'), 'Now you have <i>assigned</i> the <b>value</b> of <i>"red"</i> into the <b>variable</b> named <i>faveColor</i>! This is a big step in learning how to code. You really cannot do anything else without mastering this step, so good job! At this point, your computer will forever remember "red" inside of the variable faveColor until you reassign the value, close this page, or leave your computer on long enough that it runs out of power and shuts down! TODO more info')
    ],
    finish: finish('fix-broken-congrats', 'Fix the broken congrats message!', 'var winnerName;\nprompt("Congratulations! What is your name?");\nalert("Great job, " + winnerName + "!");', 'Now that you have learned about variables, try to fix the broken code that asked for your name when you beat the level before:', "return winnerName", "_.isString(val)")
  };
})();