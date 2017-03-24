---
id: conditionals
author: Josh Gough, Daniel Aldrich
topics:
 - conditional statements
 - if statements
 - else statements
 - arrays
sub-topics:
 - while statements
---

# Conditionals and Arrays

When you arrive at a fork in the code, you need a way to decide which way to travel. JavaScript provides conditional statements, like `if` and `else` to let your code make decisions.
# if statements

An **if** statement allows you to control whether a program enters a section of code or not based on whether a given condition is true or false. 

## if statements

An **if** statement allows you to control whether a program enters a section of code or not based on whether a given condition is true or false.

Another way to say this is that an **if** statement lets you create a rule for the computer to follow, and when the current state of the program matches the rule, it will jump into the section of code that follows the rule. Otherwise, it will skip over that section of code.

${program('', \`if (true) {
	alert('Hello!');
}\`, true)}

## Simple example explanation

Below is the same example you just saw. It shows the basic format for an **if** statement. We set a rule for the computer, and code for the computer to run when the rule evaluates to `true`.

In this simple example, it will **always** evaluate to true because it is hard-coded that way!

${ask('Before moving on, try to modify the code to make it <b>never</b> display the popup message. How did you do?')}

${program('', \`if (true) {
	alert('Hello!');
}\`, true)}

## Use variables in an if statement

Here is the same program, but this time with a *variable* named `showHello`, into which we have assigned an initial value of `true`. 

${ask('Can you modify the variable so that the message does not get displayed?')}

${program('', \`let showHello = true;
if (showHello) {
	alert('Hello!');
}\`, true)}

## Use else to say Goodbye

Again, here is a similar program. But, this time the message **Goodbye!** pops up when the expression inside the `if` statement evaluates to false. This time, we assign the initial value `false` to the variable.

${ask('Can you modify the variable so that the message <b>Hello!</b> gets displayed?')}

${program('', \`let showHello = false;
if (shouldShowHello) {
	alert('Hello!');
} else {
	alert('Goodbye!');
}\`, true)}

# else statements

An **else** statement allows you to specific an alternative section of code to run when the condition in a preceding **if** statement evaluates to `false`.

## else statements

In the last step of the previous section, you saw saw the basic format of an `else` statement. Simplified, it's like the program below.

${key('else', 'An <code>else</code> statement lets you specify code to execute when the condition of the preceding <code>if</code> statement evaluates to <code>false</code>', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else')}

${program('', \`if (false) {
	alert('Hello!');
} else {
	alert('Goodbye!');
}\`, true)}

## Another else example

In the following example, notice that you can use more complicated expressions inside the `if` statement. Now, because the expressions always reduce down to either `true` or `false`, they still just like the simpler examples you've just seen.

${program('', \`let doorNumber = 1;
if (doorNumber === 1) {
	alert('Nothing is behind door number 1! You lose!');
} else {
	alert('Congratulations! You picked any door other than door number 1! You win another lesson step. Keep going!');
}\`, true)}

## The if...else if construct

In the previous example, the expression `doorNumber === 1` reduced to `true`, because the initial value assigned to the variable `doorNumber` was indeed the value `1`. But, this made for a very boring guessing game, because there was just the single option.

In the following example, notice a new type of statement: the `else if` statement:

${program('', \`let doorNumber = 1;
if (doorNumber === 1) {
	alert('Nothing is behind door number 1! You lose!');
} else if (doorNumber === 2) {
	alert('Nope, nothing is behind door number 2! You lose!');
}\`, true)}

## if...else if explained

Below is a simplified version of the previous program without the variable. With the values of `false` and `true` hard-coded into the program like this, you should see the **Second if** message pop up.

${program('', \`if (false) {
	alert('First if');
} else if (true) {
	alert('Second if');
}\`, true)}

## Doing more with if...else if

You are not limited to just two conditions. Here's an example that performs four different conditional checks.

${ask('Do you understand why no message at all pops up in this program, and can you modify it to change that?')}

${program('', \`let dootNumber = 0;
if (doorNumber === 1) {
	alert('Door number 1 contains nothing! You lose!');
} else if (doorNumber === 2) {
	alert('Door number 2 contains a box of dog treats for the favorite canine in your life!');
} else if (doorNumber === 3) {
	alert('Door number 3 contains an all-expenses paid trip to the coffee shop down the road!');
} else if (doorNumber === 4) {
	alert('Door number 4 contains a box of candy for you!');
}\`, true)}

## if...else if conclusion

As you just saw, you can use `else if` multiple times following an initial `if` statement.

${key('if...else if', 'Using <code>if...else if</code> lets you check multiple conditions in sequence. Only the first one to evaluate to <code>true</code> will run the code following the initial <code>if</code> statement.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else')}
