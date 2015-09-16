---
id: quiz
author: Josh Gough
topics:
 - function calls
 - PEMDAS
 - String
 - Booleanc
 - Number
 - Arrays
 - Objects
---

# Test Your JavaScript Knowledge

It's time to test your knowledge to see how much you have learned so far!

# JavaScript Pop Quiz

Distinguish between different value types in the JavaScript language.

## Pop Quiz!

It's time for a pop quiz! Click **Continue** to start!

${popquiz(question("Which code properly moves the ship around the Motion training level to collect all the visible gems?",
choice("<code>game.player.move('9 right' '5 up' '11 down' '6 up' '8 right');</code>", 'Nope! When calling functions, you cannot separate arguments with just blank spaces. You have to use something else. Try again!'),
choice("<code>game.player.move('9 right', '5 up', '11 down', '6 up', '8 right');</code>", 'Correct! When calling functions and passing multiple arguments, you must separate each argument with a comma!', true),
choice("<code>game.player.move('9 right'; '5 up'; '11 down'; '6 up'; '8 right');</code>", 'Nope! You use a semi-colon at the very end of a line of code, but you do not use one to separate arguments in a function call. Try again!')),
// 1
question("The values <code>\"true\"</code>&nbsp; <code>\"False\"</code>&nbsp; <code>'Hello!'</code>&nbsp; <code>'1.5'</code>&nbsp; <code>\"Planet Doom\"</code> are all what type of JavaScript value?",
choice('Number', 'Nope! Number values are not surrounded by single-quotes or double-quotes, they just stand alone like <code>1.5</code>&nbsp; <code>2</code>&nbsp; or <code>1000000</code>.'),
choice('Boolean', 'Nope! Boolean values are never surrounded by single-quotes or double-quotes, and also are always lower-case: <code>true</code>&nbsp; <code>false</code>.'),
choice('String', 'Correct! Because the letters, no matter what they are, are surrounded by matching single-quotes or double-quotes, they are interpreted as String values by the JavaScript engine.', true)),
// 2
question("Three of the these five values are valid Boolean values: <code>true</code>&nbsp; <code>False</code>&nbsp; <code>'false'</code>&nbsp; <code>false</code>&nbsp; <code>yes</code>.",
choice('Correct', 'Nope! Look carefully at them again. Remember that Boolean values always are lowercase, meaning the only two valid values for a Boolean type are <code>true</code> and <code>false</code>. If you thought <code>\'false\'</code> was valid, note that Booleans are never surrounded by quotes.'),
choice('Incorrect', 'You are correct! Actually, the only two valid Boolean values above are the first and fourth, <code>true</code> and <code>false</code>. The second choice, <code>False</code> is incorrect because Booleans are always entirely lower-case. The third choice, <code>\'false\'</code> is incorrect because Boolean values are never surrounded by quotes. Finally, the last choice, <code>yes</code> is not valid because Booleans only have two valid values: <code>true</code> and <code>false</code>.', true)
),
// 3
question("Select the only group that has three correctly written Number values:",
choice("<code>1000000</code>&nbsp; <code>150.05</code>&nbsp; <code>'-0.559'</code>", "Nope! Remember that Number values are never surrounded by quotes, so the last choice here, <code>'-0.559'</code> is actually a String value due to the quotes around it!"),
choice("<code>1,000,000</code>&nbsp; <code>150.05</code>&nbsp; <code>-0.559</code>", "This is wrong because Number values never include commas. Even though you would normally want to display a Number using a comma, you'll have to format it that way yourself. But when telling the JavaScript to interpret a value as a Number, you would just write <code>1000000</code> instead of <code>1,000,000</code>."),
choice("<code>1000000</code>&nbsp; <code>150.05</code>&nbsp; <code>-0.559</code>", "Correct! All of these values are written correctly for the JavaScript engine to understand as Number values!", true)
)
)}

# Coding Pickups

Now you're going to learn how to pickup the 9 groups of gems by writing a function, not just by manually calling <code>game.player.move()</code> with a mile-long list of coordinates.

## Writing Code to Pick Up Gems
Using <code>for</code> or <code>while</code> and <code>game.player.move()</code>, write the code to pickup all 9 groups of gems on the board.

${training('boxStep', 'quiz-gems-pickup', \`game.onGemPickup = function() {
  console.log('I just picked up a gem!');
};\`)}