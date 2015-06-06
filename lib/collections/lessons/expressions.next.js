Lessons.add({
  _id: 'expressions',
  title: 'Use expressions to make programs understand you',
  description: 'Learn how computers and devices respond to programming language expressions to carry out your will.',
  topics_main: ['numeric expressions', 'mathematical expressions', 'operator precedence', 'PEMDAS', 'reducing expressions'],
  topics_sub: ['functions', 'strings'],
  sections: [
    sec('Computers need you', {description:'Code breathes life into computers and devices, but humans must develop and craft the code.'},
        ['Human input', `Computers, phones, tablets, and other devices that run programs and scripts may be powerful, but by themselves they don't know what you want them to do. Even the most powerful computers in the world still need <b>input</b> from human beings or other computers that human beings have programmed before they do or produce anything useful.`],
        ['Programs and code', `Before a computer or device can do anything at all, someone has to write a <b>program</b>. Programs consist of <b>code</b> that <b>runs</b> (or "executes") on the computer or device.`],
        ['Hello, World: A tiny, complete program', `Here's a very brief computer program written in the <b>JavaScript</b> programming language. JavaScript is built-in to all web modern web browsers that run on desktops, laptops, phones, and tablet devices: ${dbr}
Study this code for a moment before continuing. What do you think it's going to do just by looking at it?
${dbr} <pre><code>print("Hello, world!")</code></pre>`],
        ['Executing a tiny program', `Here's the same program again. Do you have an hypothesis about what it will do yet? You don't have to know exactly what it will do, just a rough idea. Once you've thought of something, test your hypothesis by pressing the <b>Execute</b> button to run it:
${dbr}` + program('print', 'print("Hello, world!")')],
        ['Evaluate your hypothesis', `What did the program do? How did that compare to what you expected it to do?`],
        ['Another tiny program', `Here's another brief program. Study this one and form another hypothesis about what this one will do before pressing the continue button.
${dbr}
<pre><code>print(1 + 1)</code></pre>
`],
        ['Execute the program', `Once again, here's the program you just saw. Once you have your hypothesis about what it's going to do, press the <b>Execute</b> button to test your hypothesis:
${dbr}` + program('add', 'print(1 + 1)', true)],
        ['Evaluate your hypothesis', `What did the program do this time? How did it compare to what you expected?`],
        ['Review', `In the first program, the program printed the text <b>Hello, world!</b>. In the second example, the program first performed a simple <b>addition operation</b> and then printed the resulting number <b>2</b>. In both of these examples, <code>print</code> is a <b>function</b>. A <b>function</b> is a reusable peice of code that you can <b>pass values</b>, known as parameters, into and have it carry out some work for you or give you back a different value based on what you gave it. The <b>print</b> function simply takes whatever value you send it and then displays it below the program for you to inspect. Handy, right?
${dbr}
Functions are an important topic, but many programs can be even simpler than this. In fact, <code>"Hello, world!"</code>, even without the surrounding <code>print()</code> function is a program all by itself. So is <code>1 + 1</code>. Keep reading to see many more tiny programs.`]),
    sec('Programs start tiny', {description: 'Just like some complete sentences are only one or a few words, so too can complete programs be very small, and studying small programs helps you learn how to build bigger ones!'},
        ['Short math expressions as programs', `Here are several more small programs. Look at each one and try to form an hypothesis about what it will do before you execute it. Don't worry if some of them are difficult. You will learn all about these soon enough!
<br />
<br />
<i>Try these one by one first as explained above, but you can come back later and execute or reset all of them at once with these buttons:</i> ` + sampleProgramExecAll() + `${dbr}` +
        program('subtract', '4 - 2')
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
        + program('modulus101', '102 % 3')]
        ,
        ['Modulus magic',`You've just executed lots and lots of programs! As you probably learned, all of them involved numbers and basic mathematical operations that you probably know already. But, what was happening with that <code>%</code> one that you had to execute so many times? What does that do?`],

        ['Number comparison programs', `Here are a bunch of other small programs for you to execute:
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
        + program('gte7', '55 >= 56')],
        ['Equality and inequality programs', `You are doing great, so let's try some more small programs. Think about what each of the following might produce and then try them to test your hypotheses:
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
        + `OK, maybe it is a bit of a trick...but, try it anyway!`],
        ['String functions preview', `Now, we're going to get into more complex code. Don't worry if these don't make sense at first. Just try to get the hang of it.`
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
greeting;`)]
       ),
    sec('Express yourself', {description:'Programing language code consists of expressions, which are like words and phrases that make up sentences and pargraphs in written language.'},
       ['What are your forms of expression?', `What does the word <b>expression</b> mean to you in an everyday context? What about in the world of mathematics?
<br/>
<br/>
Think about these questions for a moment and then press the <b>Continue</b> button below to keep going.`],
        ['Expressions abounding', `You might think of the word <b>expression</b> as something you speak or write, as in the phrase "Express your opinion". Your ability to express ideas, feelings, goals, plans, and more in spoken or written language is limited only by the words and grammar of the language you use. There are, of course, many other ways to express yourself like play, art, music, dance, photography, and more. What other forms of expression can you think of?`],
        ['Mathematical expressions', `In the world of mathematics, the word <b>expression</b> is limited by the symbols and <b>operations</b> related to numbers. For example, the text <code>2 + 2</code> is a mathematical expression. What does the expression mean?`],
        ['Quick check: Simple math expression', quickCheck('What is <code>2 + 2</code>?', 
                   'Type your answer into the textbox below and click the <b>Check answer</b> button when finished.',
                   numericEvaluator(4))]
       ),

    sec('Expressing math', {description:'Programming languages make solving math problems super easy because all the expressions you\'re used to work.'},
        ['Evaluating simple math expressions', `Great! By early elementary school, we learn that <code>2 + 2</code> means to add the number 2 to the number 2 to produce the number 4. But, instead of asking, "What does the expression mean", we will now start to ask, "What does the expression <b>evaluate</b> to?". This question prompts us to look at the mathematical symbols and numbers and try to figure out an answer by following the rules we learned in elementary school.`],
        ['Evaluating compound math expressions in the correct order', `How about this mathematical expression: <code>2 + 2 * 5</code>? Note that <code>*</code> means <b>multiply</b>. Here, to be rather exact, we have to remember something called the <b>order of operations</b>. This is something that humans (mathematicians are humans after all) have agreed upon to make it clear for everyone in the world to know what to do when trying to <b>evaluate the expression</b>. What do you think the answer is? How did you figure it out?`],
        ['Quick check: Compound math expression', quickCheck('What is <code>2 + 2 * 5</code>?',
                   'In this mathematical expression we use the <b>order of operations</b> to make sure to get the correct answer.',
                   numericEvaluator(12)
                  )]
       ),
    sec('PEMDAS in math expressions', {description:'The order of math expressions that you use on paper or in your head is exactly the same order that programming languages use.'},
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

Try typing the following mathematical expressions into the console below one by one. Hit the enter (or return) key to make the console evaluate the expression and display the result.

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

<iframe src='/lessonSmall.html' style='width:100%;height:560px' id='lessonConsole'></iframe>

<br/>
<br/>

There are many other types of mathematical operations that you can do in JavaScript and other programming languages, but they normally don't have their own special symbols like + - * / or %.

<br/>
<br/>

As a quick preview of one of these operations, type <code>Math.pow(2, 4)</code> into the console. Now, without typing it in, what do you think <code>Math.pow(2, 3)</code> would produce?`
       )

  ]
});