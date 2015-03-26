Lessons.add({
  _id: 'functions',
  title: 'Functions',
  sections: [
    sec('Review',
        `OK, we've seen two ways to store all the colors of a rainbow in a program. For review, here they are again:
${dbr}Approach #1: Declare 7 separate variables and assign the color values to them:`
        + code(`var color1 = "Red"
var color2 = "Orange"
var color3 = "Yellow"
var color4 = "Green"
var color5 = "Blue"
var color6 = "Indigo"
var color7 = "Violet"
`) +
        `${dbr}Printing the separate variables:`

        + code(`print(color1)
print(color2)
print(color3)
print(color4)
print(color5)
print(color6)
print(color7)`) +

        `${dbr}Approach #2: Declare an Array variable and populate it with all the color values:`

        + code(`var rainbow = ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"]`) +
        `${dbr}`,

        `Printing the colors by referencing their positions within the rainbow Array:`

        +code(`print(rainbow[0])
print(rainbow[1])
print(rainbow[2])
print(rainbow[3])
print(rainbow[4])
print(rainbow[5])
print(rainbow[6])`) +

        `${dbr}Is Approach #1 or Approach #2 easier to type? Which took longer to type?
${dbr}
What about when it comes to printing the colors?`,

        `What if you wanted to store and print many more color names than just those of a rainbow?
${dbr}Here's a block of code that declares an Array and fills it with all the colors that web browsers understand:`

        + code(`var browserColors = ["AliceBlue", "AntiqueWhite", "Aqua",
"Aquamarine", "Azure", "Beige", "Bisque", "Black",
"BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood",
"CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue",
"Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan",
"DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki",
"DarkMagenta", "DarkOliveGreen", "Darkorange", "DarkOrchid",
"DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue",
"DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet",
"DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue",
"FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro",
"GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green",
"GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo",
"Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen",
"LemonChiffon", "LightBlue", "LightCoral", "LightCyan",
"LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen",
"LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue",
"LightSlateGray", "LightSlateGrey", "LightSteelBlue",
"LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon",
"MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple",
"MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen",
"MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream",
"MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace",
"Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid",
"PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed",
"PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue",
"Purple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown",
"Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna",
"Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey",
"Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle",
"Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke",
"Yellow", "YellowGreen"
]`) +

        `We could start trying to print these the same old way:`

        + code(`print(browserColors[0])
print(browserColors[1])
print(browserColors[2])
print(browserColors[3])
print(browserColors[4])
// etc...
print(browserColors[99])`) +

        `${dbr}But, there has to be a better way, right? Try this one out:`

        + program('lotOColor', 
                  `var browserColors = ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige",
"Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown",
"BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral",
"CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue",
"DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen",
"DarkKhaki", "DarkMagenta", "DarkOliveGreen", "Darkorange",
"DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen",
"DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise",
"DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey",
"DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia",
"Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey",
"Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed",
"Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush",
"LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan",
"LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen",
"LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue",
"LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow",
"Lime", "LimeGreen", "Linen", "Magenta", "Maroon",
"MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple",
"MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen",
"MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream",
"MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive",
"OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod",
"PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip",
"PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red",
"RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown",
"SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue",
"SlateGray", "SlateGrey", "Snow", "SpringGreen", "SteelBlue", "Tan",
"Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat",
"White", "WhiteSmoke", "Yellow", "YellowGreen"
]

printArray(browserColors)`, true) +

        `Here is an even better example:` 
        + program('lotsOColors', `var browserColors = ["AliceBlue", "AntiqueWhite", "Aqua",
"Aquamarine", "Azure", "Beige", "Bisque", "Black",
"BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood",
"CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue",
"Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan",
"DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki",
"DarkMagenta", "DarkOliveGreen", "Darkorange", "DarkOrchid",
"DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue",
"DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet",
"DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue",
"FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro",
"GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green",
"GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo",
"Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen",
"LemonChiffon", "LightBlue", "LightCoral", "LightCyan",
"LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen",
"LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue",
"LightSlateGray", "LightSlateGrey", "LightSteelBlue",
"LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon",
"MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple",
"MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen",
"MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream",
"MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace",
"Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid",
"PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed",
"PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue",
"Purple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown",
"Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna",
"Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey",
"Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle",
"Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke",
"Yellow", "YellowGreen"
]

function printInColor(array) {
array.forEach(function(colorName) {
print("<div style='padding: 2px; background: " + colorName + "'>" + colorName + "</div>");
});
}

printInColor(browserColors);
`, true) +
        `${dbr} Pretty cool, right? The code <code>print</code>, <code>printArray</code> and <code>printInColor</code> are all <i>functions</i>, and <i>functions</i> make life a lot easier and less repetitive!`),
    sec('Functions',
        `A JavaScript <i>function</i> is a block of code designed to perform a particular task. A function is executed when "something" calls it.
${dbr}`

        + code(`function nameOfFunction(parameter1, parameter2, parameter3) {
// code to be executed
}`) +

        `${dbr} This is the basic format for a <i>function</i>. You setup the <i>function</i> with the keyword <i>function</i> followed by a word you choose to represent the name for the <i>function</i>. A keyword is a word that is reserved for a specific purpose and cannot be changed. That is, the word <i>function</i> can only be used to create a <i>function</i>.`,

        `You call a <i>function</i>, named franky, and demand that franky add 1 + 1 and tell you the answer. franky the <i>function<i> executes by adding 1 + 1 only when we call him. Another way to call franky is to say as we are invoking him.
${dbr}`
        + code(`function franky(){
var num = 1+1;
print(num);
return num;
}`) +

        `${dbr}When a function reaches a return statement it stops. Franky is smart enough to execute more complicated problems so let's have him help us out with something more substantial.`, 

        `This time, we call up Franky and demand he use a number we will specify in the future, so Franky had best be on the look-out. When we give him the number he will add one just like before, write it down, and shout, shout let it all out.
${dbr}`

        + code(`function franky(number1){
var num = number1 + 1
print(num);
return num;
}`) +

        `${dbr}In this example, the word number inside the parentheses is what we call a parameter. A parameter is just a variable we give the function to use when we make a demand. Keep in mind, in an alternate timeline Franky still exists without any parameters, so we can pick and choose which Franky we call. Say for example we want Franky to add five to the number one. We would:
${dbr}`

        + code(`print(franky(5));`) +

        `${dbr}What do you think the answer would be? Try creating an example below using multiple parameters:
${dbr}`

        + program('parameter', `function franky(number1){
var num = number1 + 1
print(num);
return num;
}`, true),

        `Franky has mutated from his time travels and can now make use of multiple parameters. To add additional parameters to Franky make a comma-separated list inside the parentheses.
${dbr}`

        + code(`franky(number1, number2){
var num = number1 * number2 + 1
print(num);
return num;
}`) +

        `${dbr} You could demand that Franky do any sort of math you could think up by calling franky(num1, num2,

num3...) as long as you modify the code inside function.`)
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