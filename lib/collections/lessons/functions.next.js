Lessons.add({
  _id: 'functions',
  title: 'Functions',
  sections: [
    sec('Review',
        `OK, we've seen two ways to store all the colors of a rainbow in a program. For review, here they are again:
${dbr}Approach #1: Declare 7 separate variables and assign the color values to them:` +
          code(`var color1 = "Red"
var color2 = "Orange"
var color3 = "Yellow"
var color4 = "Green"
var color5 = "Blue"
var color6 = "Indigo"
var color7 = "Violet"
`) +
        `${dbr}Printing the separate variables:` +
        code(`print(color1)
print(color2)
print(color3)
print(color4)
print(color5)
print(color6)
print(color7)`) +

        `${dbr}Approach #2: Declare an Array variable and populate it with all the color values:` +
        code(`var rainbow = ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"]`) +
        `${dbr}
Printing the colors by referencing their positions within the rainbow Array:` +
        code(`print(rainbow[0])
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
${dbr}Here's a block of code that declares an Array and fills it with all the colors that web browsers understand:` +
        code(`var browserColors = ["AliceBlue", "AntiqueWhite", "Aqua",
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

        `We could start trying to print these the same old way:` +
        code(`print(browserColors[0])
print(browserColors[1])
print(browserColors[2])
print(browserColors[3])
print(browserColors[4])
// etc...
print(browserColors[99])`) +
        `${dbr}But, there has to be a better way, right? Try this one out:` +
        program('lotOColor', 
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
        `Here is an even better example:` +
        program('lotsOColors', `var browserColors = ["AliceBlue", "AntiqueWhite", "Aqua",
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
    print("<div style='padding: 2px; background: " + colorName + "'>" + colorName + "</div>")
  })
}

printInColor(browserColors);
`, true) +
        `${dbr} Pretty cool, right? The code <code>print</code>, <code>printArray</code> and <code>printInColor</code> are all <i>functions</i>, and <i>functions</i> make life a lot easier and less repetitive!`),
    sec('Functions',
        `A JavaScript <i>function</i> is a block of code designed to perform a particular task. A function is executed when "something" calls it.
${dbr}` +
        code(`function nameOfFunction(parameter1, parameter2, parameter3) {
  // code to be executed
}`) +
        `${dbr} This is the basic format for a <i>function</i>. You setup a new <i>function</i> with the keyword <code>function</code> followed by a word you choose to represent the name for the <i>function</i>. A keyword is a word that is reserved for a specific purpose and cannot be changed. That is, the keyword <code>function</code> can only be used to create a <i>function</i>.`,

        `You call a <i>function</i>, we'll name it <code>franky</code> just because we can name functions anything we want, and demand that franky add <code>1 + 1</code> and tell you the answer. franky the <i>function<i> executes by adding 1 and 1 only when we call him. Another way to describe calling franky is to say we are "invoking" franky.
${dbr}` +
        code(`function franky(){
  var num = 1+1
  print(num)
  return num;
}`) +
        `${dbr}When a function reaches a return statement it stops and sends back the value to whatever other code called it. Think of it this way: suppose you are standing by your door and place a call to a pizza place and tell them "Make me a pizza!". They go off and whip up the pizza for you, and then deliver it straight to your door where you've been waiting.

We can make franky smart enough to execute more complicated problems so let's have him help us out with something more substantial.`,
        `This time, we call up franky and demand he use a number we will specify in the future, so Franky had best be on the look-out. When we give him the number he will add one just like before, write it down, and shout, shout let it all out -- well, he will <code>return</code> the value to us, and we can shout it out if we want to.
${dbr}` +
        code(`function franky(number1){
  var num = number1 + 1
  return num
}`) +
        `${dbr}In this example, the word number inside the parentheses is what we call a parameter. A parameter is just a variable we give the function to use when we make a demand. Keep in mind, in an alternate timeline Franky still exists without any parameters, so we can pick and choose which Franky we call. Say for example we want Franky to add five to the number one. We would:
${dbr}` +
        code(`print(franky(5))`) +
        `${dbr}What do you think the answer would be? Try creating an example below using multiple parameters:
${dbr}` +
        program('parameter', `function franky(number1){
  var num = number1 + 1
  return num
}`, true),

        `Franky has mutated from his time travels and can now make use of multiple parameters. To add additional parameters to Franky make a comma-separated list inside the parentheses.
${dbr}` +
        program('multiparams', `function franky(number1, number2) {
  var num = number1 * number2 + 1
  return num
}

print(franky(1, 2))
print(franky(3, 2))
print(franky(10, 4))`) +
        `${dbr} You could demand that Franky do any sort of math you could think up by calling franky(num1, num2, num3...) as long as you modify the code inside the function.`)
  ]
});