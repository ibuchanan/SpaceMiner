markdownLesson('conditionals.md', 'conditionals');

// And, when you need to collect several pieces of data into one place, JavaScript provides the Array datatype for this.

/*
Lessons.add({
  _id: 'conditionals',
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
*/