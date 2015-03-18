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
   return _.map(parts, (part, index)=> {
     return typeof part === 'string' ? {
       text: part,
       seen: false,
       revealed: index === 0,
       index,
       type: 'paragraph'
     } : _.extend(part, { index : index, revealed: index === 0 });
   });
  }
  
  function sec(title, ...parts) {
    sec.index++;
    return {
      title,
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
  
  that.Lesson = { schema : lessonSchema };
  
  that.Lesson.defaultLessons = [];
  that.Lesson.defaultLessons.push(
    {
    _id: 'variables',
    title: 'Make your game remember things with variables',
    sections: [
      sec('Types of memory', 
        "To understand how to build programs with code, you need to learn a little bit about how computers remember things. Just like your brain, your computer has <b>memory</b>. Computers use two major types of memory, one for short-term needs, and one for long-term needs. For short-term memory, computers use a type of memory called <b>Random Access Memory (RAM)</b>.",
        "Computers store information, or data, in RAM that they need to know right now or in the very near future. This usually includes everything that is currently running on your computer or device, and the operating system itself. So, the web browser you are using right now is running in your computer's RAM.",
         "Other types of information, like files or images that you save by downloading them get stored in a different type of memory called <b>long-term storage</b>. You will learn more about this type of memory in later lessons.")
    ],    
    questions: [
      question('What type of memory do you think your computer uses for a game when you are currently playing the game?',
        choice('Long-term storage', 'Probably not. Here\'s why: if the browser wanted to remember your name forever and ever, this would be correct! But, since the browser is simply remembering your name long enough to display it back to you immediately, it only needs to store your name in RAM. However, in a later lesson, we will show you have to make your browser remember your name with drive space forever.'),
        choice('RAM', 'That\'s right! Since the computer needs to access all the data for a game when you are actively playing it, the computer needs to load the game into <b>Random Access Memory (RAM)</b>.', true)
      ),
      question('What type of memory do you think your computer uses for a game that you have downloaded from the internet and saved, but have not yet played?',
        choice('Long-term storage', 'Good job! When your computer transfers data across the internet and saves it for you, it is using <b>long-term storage</b>, typically a <b>hard drive</b> for desktop or laptop computers. or a <b>memory card</b> for phones or other smaller devices. By saving the game there, the computer remembers it for you so that you can play it later.', true),
        choice('RAM', 'This is probably not right. Some games that you access on the internet get loaded immediately into your web browser or device, but typically these do not get <b>saved</b> into the computer\'s <b>long-term storage</b>. Games that you can download and save to play later normally get saved into <b>long-term storage</b>, such a <b>hard drive</b> or <b>memory card</b>.')
      )
    ],
    steps: [
      step('faveColor', 'Your first line of code, I do declare', 'undeclared-variable', expect(null,'ReferenceError: faveColor is not defined'), 'You get this error because you first need to tell your computer to recognize <code>faveColor</code> as a <b>variable</b>. A variable lets you store information in the computer\'s RAM. This is easy to do. To learn how, click next...'),
      step('var faveColor', 'Use the var keyword to declare a variable in memory', 'declare-variable', expect(undefined), 'You just used your first JavaScript language keyword, <code>var</code> to tell the computer to reserve a place in memory named <code>faveColor</code>, but right now it is like an empty brain cell waiting to be filled with information. The response <code>undefined</code> is a type of <b>value</b> that represents a variable that does not have any other assigned value. To get the computer to remember your favorite color, you have to learn about another type of value, and then about <b>variable assignment</b>. Keep going...'),
      step('red', 'Another undeclared variable error message from the interpreter', 'undeclared-variable-red', expect(null,'ReferenceError: red is not defined'), 'An error again? The reason is the same as before. The computer does not recognize <b>red</b> as defined variable. But, there is a simple way to use that color name, and any other, in a way that the computer recognizes as a <b>string</b> type...'),
      step('"red\"', 'Type a string value using double-quotes around text', 'string-variable', expect('"red"'), 'Now you\'re getting somewhere! When the console simply echoes <b>"red"</b> back to you it is telling you that you sent it a value that it could process. In this case, because we surrounded the three characters <b>red</b> with a pair of <b>"</b> characters, the computer recognizes it as a <b>string</b> type. There are several other types of values you can type in that you will learn about later, but try typing each of the following, but do not surround them by <code>"</code> characters just to get a preview:  <p><ul><li>44</li><li>1.5</li><li>true</li><li>false</li></ul></p><p>Let\'s keep going for now...</p>'),
      step('faveColor = "red"', 'Assign a string value into the faveColor variable to make it remember', 'assign-string-value', expect('"red"'), 'Now you have <i>assigned</i> the <b>value</b> of <i>"red"</i> into the <b>variable</b> named <i>faveColor</i>! This is a big step in learning how to code. You really cannot do anything else without mastering this step, so good job! At this point, your computer will forever remember "red" inside of the variable faveColor until you reassign the value, close this page, or leave your computer on long enough that it runs out of power and shuts down! TODO more info')
    ],
    finish: finish('fix-broken-congrats', 'Fix the broken congrats message!', 'var winnerName;\nprompt("Congratulations! What is your name?");\nalert("Great job, " + winnerName + "!");', 'Now that you have learned about variables, try to fix the broken code that asked for your name when you beat the level before:', "return winnerName", "_.isString(val)")
  });
  
  sec.index=-1;
  step.index=-1;

/*

           `Here's a very brief computer program written in the <b>JavaScript</b> programming language. JavaScript is built-in to all web modern web browsers that run on desktops, laptops, phones, and tablet devices:
<br/>
<br/>
<pre><code>var userName = prompt("What is your name?");
say("Hello there, " + userName + ". Welcome to your first programming mission! By the way, I noticed that your name is " + userName.length + " letters long and is " + userName.split("").reverse().join("") + " backwards!");</code></pre>
<br/>
<br/>
Study this code for a moment before continuing. What do you think it's going to do just by looking at it?
<br/>
`,
          `Here's the same program again. Do you have an hypothesis about what it will do yet? If so, press this button to run it: <button class='btn btn-primary' onclick="window.say=bootbox.alert;var code = $('#program').text();eval(code);">Execute program</button>
<br/>
<br/>
<pre><code id='program'>var userName = prompt("What is your name?");
var letterCount,
    nameBackwards,
    isPalindrome;
if (userName !== null) {
  letterCount = userName.length;
  nameBackwards = userName.split("").reverse().join("");
  if (userName === nameBackwards) {
    isPalindrome = true;
  } else {
    isPalindrome = false;
  }
}
say("Hello there, " + userName + ". Welcome to your first programming mission! By the way, I noticed that your name is " + letterCount + " letters long and is \\"" + nameBackwards + "\\" backwards! And it is " + isPalindrome + " that your name is spelled the same forwards and backwards, just in case you didn't already know that.");</code></pre>
`

*/

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
  
function editor() {
  return dynamicTemplate('editor', {});
}
  
function association(items) {
  return dynamicTemplate('association', JSON.stringify(items));  
}
  
function console() {
  return `<iframe src='/lessonSmall.html' style='width:100%;height:212px' id='lessonConsole'></iframe>`;
}
  
function training(trainingId, includeConsole) {
  var markup = dynamicTemplate('game', JSON.stringify({level:trainingId, enableSound:false}));
  if (includeConsole) markup += '\n' + console();
  return markup;
}  
  
function sampleProgramExecAll() {
 return `<button class="executeAll btn btn-success btn-xs" onclick="$('.execute').click();"><span class="command">Execute All</span> <i class="fa fa-check-square-o" style="margin-top: 2px"></i></button>&nbsp;<button class="resetAll btn btn-info btn-xs" onclick="$('.reset').click();">Reset All <i class="fa fa-undo"></i></button>`; 
};
  
var dbr = `<br/>
<br/>
`;
  sec.index=-1;
  step.index=-1;  
  
    that.Lesson.defaultLessons.push(
    {
    _id: 'operators',
    title: 'Operators',
    sections: [
      sec('Mathematical operators',
          `Remember when you figured out what <code>2 * 2</code> or <code>10 % 3</code> means to the JavaScript language? Generally speaking, each of these bits of code are called <b>expressions</b>. More specifically, the first one is an expression that tells JavaScript to perform the mathematical <b>multiplication operation</b> of <b>2 times 2</b>, while the second one meant to find the <b>remainder</b> of <b>dividing 10 by 3</b>. Here is an editable example that prints the result of evaluating those and other mathematical expressions:
${dbr}`
          + program('ops1', 
`print(2 * 2)
print(10 % 3)
print(4 + 6)
print(6 - 4)
print(32 / 2)`) 
+ `${dbr}
Each of the mathematical symbols above is known as an <b>operator</b> to the JavaScript language. And, each of the numeric values are known as <b>operands</b>. Head to the next step to learn more about <b>operators</b> and <b>operands</b>.`,
	        `The mathematical operators we just saw are a special type of operator called <b>infix operators</b>. All this means is that the operator symbol appears <b>between</b> its operands.
${dbr}
Take a look at this small program:`
+ code('2 + 2') +
          `${dbr}
What is the operator? What are the operands?
${dbr}
And, what about in the rest of these examples?`
            + code('2 + 2')
            + code('7 / 5')
            + code('8 % 3')
            + code('100 * 3')
          )          
        ]
      });
  
  sec.index=-1;
  step.index=-1;  
  
  that.Lesson.defaultLessons.push(
    {
    _id: 'conditionalStatements',
    title: 'Conditionals and Arrays',
    sections: [
      sec('if statements',
           `An <b>if</b> statement allows you to control if a program enters a section of code or not based on whether a given condition is true or false. Basically, we set rules for the computer to follow, and if it does not follow the rules, it will skip the code inside the if statement. In other words, depending on if something is true or not we make the computer do something.
${dbr}`
          + code(`if (rule) {
  // code to be executed if the rule is true
}`) +
 `${dbr}This is the basic format for an <b>if</b> statement. We set a rule for the computer, and code for the computer to run if the rule is followed.`,
          
          `This is a basic example of an <b>if</b> statement. We set a rule for the computer to check how many lives the player has. If the number is greater than zero the player will respawn.
${dbr}`
          + code(`if(lives > 0) {
  respawn = true
}`) +
`${dbr}What do you think will happen if the player runs out of lives?`),
      sec('else statements',
          `You can add an <b>else</b> statement to an <b>if</b> statement. When the <b>if</b> statement's rule is not true the computer follows the <b>else</b> statement's rule instead. Like you saw above, an <b>if</b> statement does not need an else; however, it is nice to cover all your bases.`

          + code(`if (rule) {
  // code to be executed if the rule is true
} else { 
  // code to be executed if the rule is false
}`) +
      `${dbr}This is the basic format for an <b>if else</b> statement. We set a rule for the computer, and code for the computer to run if the rule is true. If the rule is not true it will instead run code inside the else rule.`,
      `${dbr}Here is the same <b>if</b> statement from before modified with an else statement:
${dbr}`
          + code(`if(lives > 0) { 
  respawn = true 
} else {
  start over 
}`) +
      `${dbr} What do you think will happen when the player runs out of lives now?`
        ),
      sec('Arrays',
      `Arrays are used to store multiples of the same type in a single variable (e.g. Names of your classmates, Odd numbered years since 1917,). You can create a list of colors by setting each color equal to a seperate variable:
      ${dbr}`
      + code(`var color1 = "Red"
var color2 = "Green"
var color3 = "Blue"`) +
      `${dbr}This is a quick and easy way to create a list, but what if we wanted to list all the colors of the rainbow? Edit the code below:
${dbr}`
          //+ console() +
      + program('colors', `var color1 = "Red"
var color2 = "Green"
var color3 = "Blue"

print(color1)
print(color2)
print(color3)
`, true) +
          `${dbr}Takes a lot longer to type out individually, right? This is where an array comes in handy.`,    
      `We are going to create a list with all the colors of the rainbow again. Only this time we will use an array. Creating an array is simple. Use the same format as before when creating a variable, but add in square brackets around what you want to list.
      ${dbr}`
      + code('var rainbow = ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"]') +
      `${dbr}To pull a color from the array you would use the format, rainbow[number], where number stands for an integer between zero and six. Try editing the code below to pull out the color Green:
${dbr}`
          +program('rainbow', `var rainbow = ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"]

print(rainbow[number])`, true) +
          ` ${dbr}`
         ),
      sec('while statements',
      `A while statement is the same as an if statement...with one major difference. A while statement will loop until the rule we set is met. This means that the code inside will keep running until it completes what we tell it to do.
      ${dbr}`
      + code(`var rainbow = ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"]
var i = 0; 
while (i < 6) { 
  if(rainbow[i] === "Red") { 
    var found = rainbow[i];
    print('Found ' + found);
  }
  i++;
}`) +
      `${dbr}In this example the code will search through the array as long as i is less than six, or until it finds the color Red. When it finds Red in the array it will display "Found Red".`,
         `Here's a slight variation on the last program. You can try this one now, or edit it all you like: 
${dbr}`
      + program('loopy', `var rainbow = ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"]
var i = 0; 
while (i < 6) { 
  if(rainbow[i] === "Red") { 
    var found = rainbow[i];
    print('Found ' + found);
  } else {
    print('Did not find Red, but instead found: ' + rainbow[i]);
  }
  i++;
}`, true))
     ],
    steps: [
      step('faveColor', 'Your first line of code, I do declare', 'undeclared-variable', expect(null,'ReferenceError: faveColor is not defined'), 'You get this error because you first need to tell your computer to recognize <code>faveColor</code> as a <b>variable</b>. A variable lets you store information in the computer\'s RAM. This is easy to do. To learn how, click next...'),
      step('var faveColor', 'Use the var keyword to declare a variable in memory', 'declare-variable', expect(undefined), 'You just used your first JavaScript language keyword, <code>var</code> to tell the computer to reserve a place in memory named <code>faveColor</code>, but right now it is like an empty brain cell waiting to be filled with information. The response <code>undefined</code> is a type of <b>value</b> that represents a variable that does not have any other assigned value. To get the computer to remember your favorite color, you have to learn about another type of value, and then about <b>variable assignment</b>. Keep going...'),
      step('red', 'Another undeclared variable error message from the interpreter', 'undeclared-variable-red', expect(null,'ReferenceError: red is not defined'), 'An error again? The reason is the same as before. The computer does not recognize <b>red</b> as defined variable. But, there is a simple way to use that color name, and any other, in a way that the computer recognizes as a <b>string</b> type...'),
      step('"red\"', 'Type a string value using double-quotes around text', 'string-variable', expect('"red"'), 'Now you\'re getting somewhere! When the console simply echoes <b>"red"</b> back to you it is telling you that you sent it a value that it could process. In this case, because we surrounded the three characters <b>red</b> with a pair of <b>"</b> characters, the computer recognizes it as a <b>string</b> type. There are several other types of values you can type in that you will learn about later, but try typing each of the following, but do not surround them by <code>"</code> characters just to get a preview:  <p><ul><li>44</li><li>1.5</li><li>true</li><li>false</li></ul></p><p>Let\'s keep going for now...</p>'),
      step('faveColor = "red"', 'Assign a string value into the faveColor variable to make it remember', 'assign-string-value', expect('"red"'), 'Now you have <i>assigned</i> the <b>value</b> of <i>"red"</i> into the <b>variable</b> named <i>faveColor</i>! This is a big step in learning how to code. You really cannot do anything else without mastering this step, so good job! At this point, your computer will forever remember "red" inside of the variable faveColor until you reassign the value, close this page, or leave your computer on long enough that it runs out of power and shuts down! TODO more info')
    ],
    finish: finish('fix-broken-congrats', 'Fix the broken congrats message!', 'var winnerName;\nprompt("Congratulations! What is your name?");\nalert("Great job, " + winnerName + "!");', 'Now that you have learned about variables, try to fix the broken code that asked for your name when you beat the level before:', "return winnerName", "_.isString(val)")
  });
  
  that.Lesson.defaultLessons.push(
    {
    _id: 'functions',
    title: 'Functions',
    sections: [
      sec('Functions',
`A JavaScript function is a block of code designed to perform a particular task. A function is executed when "something" invokes it (calls it).
${dbr}`

 + code(`function nameOfFunction(parameter1, parameter2, parameter3) {
    // code to be executed
}`) +

`${dbr} This is the basic format for a function. You setup the function with the keyword <i>function</i> followed by a word that represents the name for the fucniton/ name for your funciton. A keyword is a word that is reserved for a specific purpose and cannot be changed. That is, the word function can only be used to create a function.`,

`You call a function, named Franky, and demand that Franky add 1 + 1 and tell you the answer. Franky executes by adding 1 + 1 only when we call him, or we can say we are invoking him.
${dbr}`
+ code(`function franky(){
 var num = 1+1;
 print(num);
 return num;
}`) +

`${dbr}When a function reaches a return statement it stops. Franky is smart enough to execute more complicated problems so let's have him help us out with something more substantial.`, 

`This time, we call up Franky and demand he use a number we will specify in the future, so Franky had best be on the look-out. When we give him the number he will add one just like before, write it down, and shout, shout let it all out.
${dbr}`

+ code(`franky(number1){
 var num = number1 + 1
 print(num);
 return num;
}`) +

`${dbr}In this example, the word number inside the parenthese is what we call a parameter. A parameter is just a variable we give the function to use when we make a demand. Keep in mind, in an alternate timeline Franky still exists without any parameters, so we can pick and choose which Franky we call. Say for example we want Franky to add five to the number one. We would:
${dbr}`

+ code(`print(franky(5));`) +

`${dbr}What do you think the answer would be? Try creating an example below using multiple parameters:
${dbr}`

+ program('parameter', `franky(number1){
 var num = number1 + 1
 print(num);
 return num;
}`, true),

`Franky has mutated from his time travels and can now make use of multiple parameters. To add additional parameters to Franky make a comma-sepperated list inside the parenthese.
${dbr}`

+ code(`franky(number1, number2){
 var num = number1 * number2 + 1
 print(num);
 return num;
}`) +

`${dbr} You could demand that Franky do any sort of math you could think up by calling franky(num1, num2, 

num3...) as long as you modify the code inside function.`),
       ],
    steps: [
      step('faveColor', 'Your first line of code, I do declare', 'undeclared-variable', expect(null,'ReferenceError: faveColor is not defined'), 'You get this error because you first need to tell your computer to recognize <code>faveColor</code> as a <b>variable</b>. A variable lets you store information in the computer\'s RAM. This is easy to do. To learn how, click next...'),
      step('var faveColor', 'Use the var keyword to declare a variable in memory', 'declare-variable', expect(undefined), 'You just used your first JavaScript language keyword, <code>var</code> to tell the computer to reserve a place in memory named <code>faveColor</code>, but right now it is like an empty brain cell waiting to be filled with information. The response <code>undefined</code> is a type of <b>value</b> that represents a variable that does not have any other assigned value. To get the computer to remember your favorite color, you have to learn about another type of value, and then about <b>variable assignment</b>. Keep going...'),
      step('red', 'Another undeclared variable error message from the interpreter', 'undeclared-variable-red', expect(null,'ReferenceError: red is not defined'), 'An error again? The reason is the same as before. The computer does not recognize <b>red</b> as defined variable. But, there is a simple way to use that color name, and any other, in a way that the computer recognizes as a <b>string</b> type...'),
      step('"red\"', 'Type a string value using double-quotes around text', 'string-variable', expect('"red"'), 'Now you\'re getting somewhere! When the console simply echoes <b>"red"</b> back to you it is telling you that you sent it a value that it could process. In this case, because we surrounded the three characters <b>red</b> with a pair of <b>"</b> characters, the computer recognizes it as a <b>string</b> type. There are several other types of values you can type in that you will learn about later, but try typing each of the following, but do not surround them by <code>"</code> characters just to get a preview:  <p><ul><li>44</li><li>1.5</li><li>true</li><li>false</li></ul></p><p>Let\'s keep going for now...</p>'),
      step('faveColor = "red"', 'Assign a string value into the faveColor variable to make it remember', 'assign-string-value', expect('"red"'), 'Now you have <i>assigned</i> the <b>value</b> of <i>"red"</i> into the <b>variable</b> named <i>faveColor</i>! This is a big step in learning how to code. You really cannot do anything else without mastering this step, so good job! At this point, your computer will forever remember "red" inside of the variable faveColor until you reassign the value, close this page, or leave your computer on long enough that it runs out of power and shuts down! TODO more info')
    ],
    finish: finish('fix-broken-congrats', 'Fix the broken congrats message!', 'var winnerName;\nprompt("Congratulations! What is your name?");\nalert("Great job, " + winnerName + "!");', 'Now that you have learned about variables, try to fix the broken code that asked for your name when you beat the level before:', "return winnerName", "_.isString(val)")
  });
  
// VALUES lesson:  
  sec.index=-1;
  step.index=-1;  
  
  that.Lesson.defaultLessons.push(
    {
    _id: 'values',
    title: 'Use expressions and values to make programs understand you',
    sections: [
      sec('Computers need you',
         `Computers, phones, tablets, and other devices that run programs and scripts may be powerful, but by themselves they don't know what you want them to do. Even the most powerful computers in the world still need <b>input</b> from human beings or other computers that human beings have programmed before they do anything useful.`,
          `Before a computer or device can do anything at all, someone has to write a <b>program</b>. Programs consist of <b>code</b> that <b>runs</b> (or "executes") on the computer or device.`,
           `Here's a very brief computer program written in the <b>JavaScript</b> programming language. JavaScript is built-in to all web modern web browsers that run on desktops, laptops, phones, and tablet devices:
<br/>
<br/>
<pre><code>display("Hello, world!")</code></pre>
<br/>
<br/>
Study this code for a moment before continuing. What do you think it's going to do just by looking at it?
<br/>
`,
          `Here's the same program again. Do you have an hypothesis about what it will do yet? You don't have to know exactly what it will do, just a rough idea. Once you've thought of something, test your hypothesis by pressing the <b>Execute program</b> button to run it:
<br/>
<br/>
<pre><code id='program'>display("Hello, world!")</code></pre>
<button class="btn btn-danger btn-sm" style="display:block" onclick="window.display=function(expr){ bootbox.alert(String(expr)); };var code = $('#program').text();eval(code);">Execute program</button>
`,
          `What did the program do? How did that compare to what you expected it to do?`,
          `Here's another brief program. Study this one and form another hypothesis about what this one will do before pressing the continue button.
<br/>
<br/>
<pre><code>display(1 + 1)</code></pre>
`,
          `Once again, here's the program you just saw. Once you have your hypothesis about what it's going to do, press the <b>Execute program</b> button to test your hypothesis:  
<br/>
<br/>
<pre><code id='program'>display(1 + 1)</code></pre>
<button class="btn btn-danger btn-sm" style="display:block" onclick="window.display=function(expr){ bootbox.alert(String(expr)); };var code = $('#program').text();eval(code);">Execute program</button>
`,
          `What did the program do this time? How did it compare to what you expected?
<br/>
<br/>
In the first program, the program popped up a little screen and displayed the text <b>Hello, world!</b>. In the second example, the program first performed a simple <b>addition operation</b> and then displayed the resulting number <b>2</b>. In both of these examples, <code>display</code> is a <b>function</b>. A <b>function</b> is a reusable peice of code that you can <b>pass values</b> into and have it carry out some work for you or give you back a different value based on what you gave it. The <b>display</b> function simply takes whatever value you send it and then pops up a little screen with that value inside of it. Handy, right?
<br/>
<br/>
Functions are an important topic, but many programs can be even simpler than this. Keep reading to see how.`
          ),
          sec('Programs start tiny',
          `Here are several more small programs. Look at each one and try to form an hypothesis about what it will do before you execute it. Don't worry if some of them are difficult. You will learn all about these soon enough!
<br />
<br />
<i>Try these one by one first as explained above, but you can come back later and execute or reset all of them at once with these buttons:</i> ` + sampleProgramExecAll() +
`<br />
<br />
`
          + editor()
          + training('boxStep', true)
          + association({
            '1 + 1': '2',
            '9 / 3': '3',
          })              
          + association({
            'var': 'Used to declare a variable',
            '[1, 2, 3]': 'An Array that contains only Number values',
            '[1, "2", 3]': 'An Array that contains a mixture of Number and String values',
            '[]': 'An empty Array',
            '"Hello!"': 'A String value',
            '100': 'A Number value',
            'Boolean': 'A type of value that has just two veru specific values',
            'false': 'A Boolean value'
          })
          + console()              
          + programSort(`var x;
x = 1;
alert(x);
alert("Hello! x is now: " + x);
x = 10;`)
          + program('subtract', '4 - 2', true)
          + program('divide1', '8 / 4')
          + program('divide2', '16 / 4')
          + program('multiply1', '4 * 2')
          + program('multiply2', '8 * 4')
          + program('modulus1', '1 % 3')
          + program('modulus2', '2 % 3')
          + program('modulus3', '3 % 3')
          + program('modulus5', '4 % 3')
          + program('modulus6', '5 % 3')
          + program('modulus7', '6 % 3')
          + program('modulus8', '9 % 3')
          + program('modulus9', '10 % 3')
          + program('modulus10', '12 % 3')
          + program('modulus100', '100 % 3')
          + program('modulus101', '102 % 3')
      ,
      `You've just executed lots and lots of programs! As you probably learned, all of them involved numbers and basic mathematical operations that you probably know already. But, what was happening with that <code>%</code> one that you had to execute so many times? What does that do?`,
              
      `Here are a bunch of other small programs for you to execute:
<br/>
<br/>
` 
      + program('lt1', '0 < 1')
      + program('lt2', '1 < 0')
      + program('gt1', '1 > 0')
      + program('gt2', '0 > 1')
      + program('lt3', '55 < 56')
      + program('lt4', '900 < 1000')      
      + program('gt3', '56 > 55')            
      + program('gt4', '900 > 1000')
+ `<br/>
</br>
Stumped yet? How about these:
<br/>
<br/>
`   
      + program('lte1', '-5 <= 55')
      + program('lte2', '5 <= 55')
      + program('lte3', '45 <= 55')      
      + program('lte4', '55 <= 55')      
      + program('lte5', '-565 <= 55')      
      + program('lte6', '56 <= 55')            
      + program('lte7', '56 <= 55')
+ `<br/>
</br>
You are on a roll. Keep going:
<br/>
<br/>
`   
      + program('gte1', '55 >= -5')
      + program('gte2', '55 >= 5')
      + program('gte3', '55 >= 45')      
      + program('gte4', '55 >= 55')      
      + program('gte5', '55 >= -565')      
      + program('gte6', '55 >= 56')            
      + program('gte7', '55 >= 56'),
              `You are doing great, so let's try some more small programs. Think about what each of the following might produce and then try them to test your hypotheses:
<br/>
<br/>
`
              + program('eq1', '1 === 1')
              + program('eq2', '1 === 2')
              + program('eq3', '2 === 2')
              + program('eq4', '2 === 4')
              + program('eq5', '3 === 4')
              + program('eq6', '4 === 4')
              + program('eq7', '4 === 5')
              + program('eq8', '5 === 5')              
              + `Got it? Try these:
<br/>
<br/>`
              + program('eq9', '2 + 2 === 4')
              + program('eq10', '2 * 2 === 4')
              + program('eq11', '1 + 1 + 1 + 1 === 4')
              + program('eq12', '1 + 1 + 2 === 4')
              + program('eq13', '1 + 2 + 1 !== 4')
              + program('eq14', '16 / 4 === 4')
              + `Still more? Yep, still more:
<br/>
<br/>`
              + program('eq15', '9 % 3 === 0')
              + program('eq16', '4 % 3 === 1')
              + program('eq17', '100 % 3 === 1')
              + program('eq18', '5 % 3 !== 1')
              + `And one more that is not a trick question:
<br/>
<br/>`
              + program('eq19', '0 / (8 * 9 - 77 % 6 + 4 * 22 ) === 0')
              + `OK, maybe it is a bit of a trick...but, try it anyway!`,
              `Now, we're going to get into more complex code. Don't worry if these don't make sense at first. Just try to get the hang of it.`
              + program('', `"Space Miner".length`)
              + program('', `"ASTEROID".toLowerCase()`)
              + program('', `"pebble".toUpperCase()`)
              + program('', `"             taking up space             ".trim()`)              
              + program('', `"Vacation is in ".concat("the summer!")`)
              + program('', `"Vacation is in " + "the summer!"`)
              + program('', `"cccgggtcccgggeccgt".indexOf("e")`)
              + program('', `"cccgggtcccgggeccgt".indexOf("t")`)
              + program('', `"cccgggtcccgggeccgt".lastIndexOf("t")`)
              + program('', `"abcde".charAt(0)`)
              + program('', `"abcde".charAt(1)`)
              + program('', `"abcde".charAt(4)`)
              + program('', `"abcde".substr(1, 4)`)
              + program('', `"abcde".substring(1, 4)`)
              + program('', `"Vacation is in the summer!".slice(0, 8)`)
              + program('', `"Vacation is in the summer!".slice(-7)`)
              + program('', `"Vacation is in the summer!".slice(5, 12)`)
              + program('', `"Vacation is in the summer!".slice(9, -2)`)
              + program('', `"Mi?i?ippi".replace("?", "ss")`)
              + program('', `"Mi?i?ippi".replace(/\\?/g, "ss")`)
              + program('',
`var x = [];
x.push("one");
x.push("two");
x;`)
              + program('', `var me = {
  "name": "Josh",
  "likesCandy": true,
  "birthDate": new Date("July 20 1977"),
  "numberOfPets": 0,
  "favoriteFoods": ["Burritos", "Cookies", "Spinach"]
};
me;`)
              + program('',
`console.log("Hello!");
console.log("Hello!");
console.log("Hello!");
console.log("Hello!");
console.log("Hello!");
console.log("Hello!");
console.log("Hello!");
console.log("Hello!");
console.log("Hello!");
console.log("Hello!");`)
              + program('',
`var count = 1;
while (count < 11) {
  console.log("Hello!");
  count = count + 1;
}`)
              + program('',
`var count = 1;
while (count++ < 11) console.log("Hello!");`)
              + program('',
`console.log("Hello for the first time!");
var count = 1;
while (++count < 11) console.log("Hello times " + count + "!");`)
              + program('', `var greeting = "Hello!";
var count = 1;
while(count < 11) greeting = greeting + "Hello times " + count++;
greeting;`)
              + program('', `var greeting = "Hello!";
var count = 1;
while(count < 11) greeting = greeting + "\\nHello times " + count++;
greeting;`)
  ),
      sec('Express yourself', 
          `What does the word <b>expression</b> mean to you in an everyday context? What about in the world of mathematics?
          <br/>
          <br/>
           Think about these questions for a moment and then press the <b>Continue</b> button below to keep going.`,

          `You might think of the word <b>expression</b> as something you speak or write, as in the phrase "Express your opinion". Your ability to express ideas, feelings, goals, plans, and more in spoken or written language is limited only by the words and grammar of the language you use. There are, of course, many other ways to express yourself like play, art, music, dance, photography, and more. What other forms of expression can you think of?`,

          `In the world of mathematics, the word <b>expression</b> is limited by the symbols and <b>operations</b> related to numbers. For example, the text <code>2 + 2</code> is a mathematical expression. What does the expression mean?`,

          quickCheck('What is <code>2 + 2</code>?', 
                     'Type your answer into the textbox below and click the <b>Check answer</b> button when finished.',
                     numericEvaluator(4))
	),
      
      sec('Expressing math', 
          `Great! By early elementary school, we learn that <code>2 + 2</code> means to add the number 2 to the number 2 to produce the number 4. But, instead of asking, "What does the expression mean", we will now start to ask, "What does the expression <b>evaluate</b> to?". This question prompts us to look at the mathematical symbols and numbers and try to figure out an answer by following the rules we learned in elementary school.`,
          `How about this mathematical expression: <code>2 + 2 * 5</code>? Note that <code>*</code> means <b>multiply</b>. Here, to be rather exact, we have to remember something called the <b>order of operations</b>. This is something that humans (mathematicians are humans after all) have agreed upon to make it clear for everyone in the world to know what to do when trying to <b>evaluate the expression</b>. What do you think the answer is? How did you figure it out?`,
          quickCheck('What is <code>2 + 2 * 5</code>?', 
                    'In this mathematical expression we use the <b>order of operations</b> to make sure to get the correct answer.',
                     numericEvaluator(12)
                    )
      ),
      sec('PEMDAS in math expressions',
          `Even for the last two-part expression, we can normally figure out the answer in our heads too. But, to be exact, we do this:
  <ul>
    <li>Remember the order of operations as <b>"PEMDAS"</b>, or Parentheses first, Exponents second, Multiplication or Division third -- from left to right, and Addition or Subtraction last -- also from left to right.</li>
    <li>Notice that we have <code>*</code>, multiplication, in the expression.</li>
    <li>Multiply 2 5 times to reduce this part of the expression to the value of <i>10</i>.</li>
    <li>Replace the <code>2 * 5</code> in the expression with the value <i>10</i> to arrive at the simpler expression <code>2 + 10</code>.</li>
    <li>Evaluate 2 plus 10 to a final value of <i>12</i>!</li>
  </ul>`,
          `That was pretty easy, right? So, how can programming languages help? Try doing this mathematical expression in your head: <code>1 + 3 * 9 / 3 * 10 - 10 * 2</code>.`,
          quickCheck('What is <code>1 + 3 * 9 / 3 * 10 - 10 * 2</code>?', 
                    'This time you have to work a lot harder to apply the order of operations to get the right answer!',
                    numericEvaluator(71)
                    )
          ),
      sec('Reducing expressions',
          `Not quite as easy is it? If we apply the order of operations to this, we would normally start by wrapping the things we know must happen first within parentheses, the <code>(</code> and <code>)</code> characters. Doing that produces: <code>1 + (((3 * 9) / 3) * 10) - (10 * 2)</code>. The expression is still complicated to do in our heads, but we can plod through it by evaluating the innermost groupings first to work toward simpler and simpler expressions.

  <ul>
    <li>Replace <code>(3 * 9)</code> with <i>27</i> to produce <code>1 + ((27 / 3) * 10) - (10 * 2)</code>.</li>
    <li>Replace <code>(27 / 3)</code> with <i>9</code> to produce <code>1 + (9 * 10) - (10 * 2)</code>.</li>
    <li>Replace <code>(9 * 10)</code> with <i>90</code> to prduce <code>1 + 90 - (10 * 2).</code></li>
    <li>We only have one part inside parentheses now, so replace <code>(10 * 2)</code> with <code>20</code> to produce <code>1 + 90 - 20</code>.</li>
    <li>We now have just 3 numbers left, so we can reduce <code>1 + 90</code> to <code>91</code> to produce <code>91 - 20</code>.</li>
    <li>Finally, we simply reduce <code>91 - 20</code> to the final value of <code>71</code>!</li>
  </ul>`,
      `Your computer can do this process in less than <b><i>1 millisecond</i></b>. In fact, my computer can evaluate the expression <code>1 + (((3 * 9) / 3) * 10) - (10 * 2)</code> <i>1,000,000</i> times in roughly <i>2.5 seconds</i>. What are some things that <b>you</b> can do in less than <b><i>1 millionth</i></b> of a second? Anything?

<br/>
<br/>

JavaScript supports all the basic mathematical operations like add, subtract, multiply, and divide that you are used to from your math classes. It also supports a special one for figuring out the remainder of a division operation.

<br/>
<br/>

Try typing the following mathematical expressions into the console below. Hit the enter (or return) key to make the console evaluate the expression and display the result.

<br />
<br />

<ul>
  <li><code>1 + 1</code></li>
  <li><code>77 - 49</code></li>
  <li><code>55 * 3</code></li>
  <li><code>88 / 4</code></li>
  <li><code>22.44 / 2.2</code></li>  
  <li><code>15 % 6</code> (This one divides 15 by 6 and then gives you the remainder)</li>
  <li><code>1 + (((3 * 9) / 3) * 10) - (10 * 2)</code></li>
  <li><code>1 + 3 * 9 / 3 * 10 - 10 * 2</code> (Same as above, but JavaScript is smart enough to apply PEMDAS without any parentheses)</li>
</ul>

<br/>
<br/>

<iframe src='/lessonSmall.html' style='width:100%;height:212px' id='lessonConsole'></iframe>

<br/>
<br/>

There are many other types of mathematical operations that you can do in JavaScript and other programming languages, but they normally don't have their own special symbols like + - * / or %.

<br/>
<br/>

As a quick preview of one of these operations, type <code>Math.pow(2, 4)</code> into the console. Now, without typing it in, what do you think <code>Math.pow(2, 3)</code> would produce?`
    ), 
      
    sec('JavaScript values',          

        `OK, but what is a <b>value</b>? You've already seen many examples of values. When you typed <code>var worldName = "My Awesome World!"</code> you were telling the program to put the <b>value</b> of <i>"My Awesome World!"</i> into the variable named <code>worldName</code> so that it could display it on the screen when you or others play your game. In this case the value's <b>type</b> is called a <b>string</b>, because it is a a series of letters or other characters contained inside of two <code>"</code> (double-quote> characters. Can you think of other places where you have already encountered <b>values</b>?`,

         `If you said that when you wrote <code>var numberOfLives = 50</code> and <code>var enableEnemyRespawn = false</code>, you are correct. In these cases, the value <i>50</i> has a type of <b>number</b>, and the value <b>false</b> has a type of <b>boolean</b> -- remember that a <b>boolean</b> value can only ever be one of two possible values: <b>true</b> or <b>false</b>.`,

          `Actually, everything in your world is made of some type of <b>value</b> already, even the more complicated ones. For example, imagine that you decided to make the <code>worldRows</code> variable contain dozens of gems and just a few coins, like this:
<br>

<pre><code>var worldRows = [
  "gggggggggggggggggg",
  "gggggggggggggggggg",
  "gggggggggggggggggg",
  "gggggggggggggggggg",
  "ggggggccccccgggggg",
  "ggggggccccccgggggg",
  "ggggggccccccgggggg",
  "ggggggccccccgggggg",
  "ggggggccccccgggggg",
  "gggggggggggggggggg",
  "gggggggggggggggggg",
  "gggggggggggggggggg"
]</code></pre>

In this case, you have used multiple <b>string</b> values grouped together as a special kind of single value called an <b>Array</b>. An Array is a value that lets you combine multiple other values into a single place and in a specific order. Each of the individual items in the array is normally called an <b>element</b>.`,

          `There are lots of things that occur in the real world that computer programs would normally store in <b>Array<b> values. Here are some examples that I can think of:
<ul>
  <li>A grocery shopping list, where each item to purcahse is a single element</li>
  <li>The names of all the capital cities of each country on planet Earth, or on your own worlds!</li>
  <li>Directions to the nearest bathroom from where you are currently sitting, where each element is the number of feet to walk and in what direction</li>
</ul>`,

          `Think for a moment about some other things in the room you're in now or in the world that a computer program might store in an <b>Array</b>. What did you come up with?`,

      popquiz(
        question('Wat type of memory do you think your computer uses for a game when you are currently playing the game?',
          choice('Long-term storage', 'Probably not. Here\'s why: if the browser wanted to remember your name forever and ever, this would be correct! But, since the browser is simply remembering your name long enough to display it back to you immediately, it only needs to store your name in RAM. However, in a later lesson, we will show you have to make your browser remember your name with drive space forever.'),
          choice('RAM', 'That\'s right! Since the computer needs to access all the data for a game when you are actively playing it, the computer needs to load the game into <b>Random Access Memory (RAM)</b>.', true)
        ),
        question('What type of memory do you think your computer uses for a game that you have downloaded from the internet and saved, but have not yet played?',
          choice('Long-term storage', 'Good job! When your computer transfers data across the internet and saves it for you, it is using <b>long-term storage</b>, typically a <b>hard drive</b> for desktop or laptop computers. or a <b>memory card</b> for phones or other smaller devices. By saving the game there, the computer remembers it for you so that you can play it later.', true),
          choice('RAM', 'This is probably not right. Some games that you access on the internet get loaded immediately into your web browser or device, but typically these do not get <b>saved</b> into the computer\'s <b>long-term storage</b>. Games that you can download and save to play later normally get saved into <b>long-term storage</b>, such a <b>hard drive</b> or <b>memory card</b>.')
        )
      )
  )      
      

      
      
      
      
      
    ],    
    steps: [
      step('faveColor', 'Your first line of code, I do declare', 'undeclared-variable', expect(null,'ReferenceError: faveColor is not defined'), 'You get this error because you first need to tell your computer to recognize <code>faveColor</code> as a <b>variable</b>. A variable lets you store information in the computer\'s RAM. This is easy to do. To learn how, click next...'),
      step('var faveColor', 'Use the var keyword to declare a variable in memory', 'declare-variable', expect(undefined), 'You just used your first JavaScript language keyword, <code>var</code> to tell the computer to reserve a place in memory named <code>faveColor</code>, but right now it is like an empty brain cell waiting to be filled with information. The response <code>undefined</code> is a type of <b>value</b> that represents a variable that does not have any other assigned value. To get the computer to remember your favorite color, you have to learn about another type of value, and then about <b>variable assignment</b>. Keep going...'),
      step('red', 'Another undeclared variable error message from the interpreter', 'undeclared-variable-red', expect(null,'ReferenceError: red is not defined'), 'An error again? The reason is the same as before. The computer does not recognize <b>red</b> as defined variable. But, there is a simple way to use that color name, and any other, in a way that the computer recognizes as a <b>string</b> type...'),
      step('"red\"', 'Type a string value using double-quotes around text', 'string-variable', expect('"red"'), 'Now you\'re getting somewhere! When the console simply echoes <b>"red"</b> back to you it is telling you that you sent it a value that it could process. In this case, because we surrounded the three characters <b>red</b> with a pair of <b>"</b> characters, the computer recognizes it as a <b>string</b> type. There are several other types of values you can type in that you will learn about later, but try typing each of the following, but do not surround them by <code>"</code> characters just to get a preview:  <p><ul><li>44</li><li>1.5</li><li>true</li><li>false</li></ul></p><p>Let\'s keep going for now...</p>'),
      step('faveColor = "red"', 'Assign a string value into the faveColor variable to make it remember', 'assign-string-value', expect('"red"'), 'Now you have <i>assigned</i> the <b>value</b> of <i>"red"</i> into the <b>variable</b> named <i>faveColor</i>! This is a big step in learning how to code. You really cannot do anything else without mastering this step, so good job! At this point, your computer will forever remember "red" inside of the variable faveColor until you reassign the value, close this page, or leave your computer on long enough that it runs out of power and shuts down! TODO more info')
    ],
    finish: finish('fix-broken-congrats', 'Fix the broken congrats message!', 'var winnerName;\nprompt("Congratulations! What is your name?");\nalert("Great job, " + winnerName + "!");', 'Now that you have learned about variables, try to fix the broken code that asked for your name when you beat the level before:', "return winnerName", "_.isString(val)")
  });    
                               
})();