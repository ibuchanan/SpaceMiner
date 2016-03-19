Lessons.add({
  _id: 'expressionsOld',
  title: 'Use expressions to send greetings from deep space',
  description: 'Reverse the galaxy\'s fate using the basics of programming language expressions.',
  topics_main: ['numeric expressions', 'mathematical expressions', 'operator precedence', 'PEMDAS', 'reducing expressions'],
  topics_sub: ['functions', 'strings'],
  sections: [
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
                  ),
        ['Distant survivors', `How about an equation that you can use to locate the source of the distress call? Try to calculate this in your head: <code>numf(186282 * 60 * 60 * 24 * 365)</code>`],
        ['The speed of light', `Figure it out? If not, that's just fine. That's what programming languages make easier! Execute it below to see the result:`
         + program('speedOfLight', 'numf(186282 * 60 * 60 * 24 * 365)', true)]
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