---
id: expressions
author: Josh Gough
topics:
 - numeric expressions
 - mathematical expressions
 - operator precedence
 - PEMDAS
 - reducing expressions
sub-topics:
 - functions
 - strings
---

# Expressions in deep space

Reverse the galaxy's fate using the basics of programming language expressions.

# Express yourself

Programing language code consists of expressions, which are like words and phrases that make up sentences and pargraphs in written language.

## What are your forms of expression?

${ask('What does the word <b>expression</b> mean to you in an everyday context? What about in the world of mathematics?')}

Think about these questions for a moment and then press the **Continue** button below to keep going.

## Expressions abounding

You might think of the word **expression** as something you speak or write, as in the phrase "Express your opinion". Your ability to express ideas, feelings, goals, plans, and more in spoken or written language is limited only by the words, grammar, and special symbols of the language you use.

As you learn a written language, you learn the special meaning of symbols like `.`, `,`, `"..."`, `'`, `;`, and more. You learn how to combine words with symbols to express complete thoughts as sentences, and then into larger collections called paragraphs. You can then go on to create poems, essays, articles, web site blogs, and yes even printed books.

## Other types of expression

There are, of course, many other ways to express yourself like play, art, music, dance, photography, and more.

${ask('What other forms of expression can you think of?')}

## Code expressions

Like spoken and written language, programing language code consists of **expressions**. Since you are already used to using words and phrases to form sentences in spoken and written language to communicate a *complete thought*, you can use this understanding to start grasping how programming code works.

Simply stated, a code expression communicates a *complete instruction* to a computer.

Here's a more formal, yet still simple, definition:

${key('Expression', 'An <em>expression</em> is any valid unit of code that reduces to a single value.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions\_and\_Operators#Expressions')}

## Mathematical expressions

Actually, you probably know more about how programming code works than you might realize. This is because you've already encountered the world of mathematics and mathematical expressions.

In the world of mathematics, the word **expression** also has a specific meaning.

At its simplest, when you read a mathematical expression, you recognize numbers and familiar symbols, like `+`, `-`, `/`, or `*`, and then perform an operation in your head (or on paper) to reduce the epxression to a single value.

${ask('What happens in your head when you read the mathematical expression <code>2 + 2</code>?')}

## Quick Check

${env.quickCheck2plus2()}

# Expressing math

Programming languages make solving math problems super easy because they can process all the expressions you are used to working with, and a lot more than that!

## Reducing simple math expressions

Great! Let's keep going.

By early elementary school, we learn that `2 + 2` means to add the number `2` to the number `2` to produce the number `4`. But, instead of asking, "What does the expression mean", we will now start to ask, "What does the expression **reduce** to?". This question prompts us to look at the mathematical symbols and numbers and try to figure out an answer by following the rules we learned in elementary school.

## Reducing compound math expressions

How about this mathematical expression: `2 + 2 * 5`? Note that `*` means **multiply**. Here, to be rather exact, we have to remember something called the **order of operations**. This is something that humans (mathematicians are humans after all) have agreed upon so it's clear to everyone in the world what to do when trying to **reduce the expression**.

${ask('What do you think the answer is, and how did you figure it out?')}

## Quick Check

${quickCheckDyn('What does <code>2 + 2 \* 5</code> reduce to?', 'To get the right answer, make sure to use the correct <b>order of operations rules</b>.', numericEvaluator(12))}

# PEMDAS in math expressions

The order of math expressions that you use on paper or in your head is exactly the same order that programming languages use.

## Reducing rules

Even for the last two-part expression, `2 + 2 * 5`, we can normally figure out the answer in our heads too. But, to be exact, we do this:

* Remember the order of operations as **"PEMDAS"**, or Parentheses first, Exponents second, Multiplication or Division third -- _from left to right_, and Addition or Subtraction last -- also _from left to right_.
* Notice that we have `*`, multiplication, in the expression.
* Multiply `2` by `5` to reduce this part to the value of `10`.
* Replace the `2 * 5` in the expression with the value `10` to arrive at the simpler expression `2 + 10`.
* Add `2` to `10` to a final value of `12`!

## Easy button!

That was pretty easy, right? So, how can programming languages help?

Try doing this mathematical expression in your head before moving on: `1 + 3 * 9 / 3 * 10 - 10 * 2`.

## Quick Check

${env.quickCheckLongerExpression()}

## Distant survivors

How about an equation that you can use to locate the source of the distress call? Try to calculate this in your head: `numf(186282 * 60 \ 60 * 24 * 365)``

## The speed of light

Figure it out? If not, that's just fine. That's what programming languages make easier! Execute it below to see the result:

${env.speedOfLightProgram()}

# Reducing expressions

Programming languages apply the same familiar PEMDAS order of operations, but they are much, much faster at it than human brains!

## Not so fast

Not quite as easy is it? 

If we apply the order of operations to this, we would normally start by wrapping the things we know must happen first within parentheses, the `(` and `)` characters. Doing that produces: `1 + (((3 * 9) / 3) * 10) - (10 * 2)`.

This expression is still complicated to do in our heads, but we can plod through it by reducing the innermost groupings first to work toward simpler and simpler expressions.

## Reducing manually

Here's how we can manually reduce the expression `1 + (((3 * 9) / 3) * 10) - (10 * 2)`:

* Reduce `(3 * 9)` to *27* to produce `1 + ((27 / 3) * 10) - (10 * 2)`.
* Reduce `(27 / 3)` to `9` to produce `1 + (9 * 10) - (10 * 2)`.
* Reduce `(9 * 10)` to `90` to prduce `1 + 90 - (10 * 2).`
* We only have one part inside parentheses now, so reudce `(10 * 2)` with `20` to produce `1 + 90 - 20`.
* We now have just 3 numbers left, so we can reduce `1 + 90` to `91` to produce `91 - 20`.
* Finally, we simply reduce `91 - 20` to the final value of `71`!

## Reducing in mere milliseconds

Your computer can do this process in less than ***1 millisecond***. In fact, my computer can evaluate the expression `1 + (((3 * 9) / 3) * 10) - (10 * 2)` *1,000,000* times in roughly *2.5 seconds*. 

${ask('What are some things that <b>you</b> can do in less than <b><i>1 millionth</i></b> of a second? Anything?')}

## Operations extravaganza!

JavaScript supports all the basic mathematical operations like add, subtract, multiply, and divide that you are used to from your math classes. It also supports a special one for figuring out the remainder of a division operation.

Each of the following mathematical expressions is a complete JavaScript program. Press **Execute** for each one to see the results. (You can also modify the expressions to create your own.)

${program('', '1 + 1', true)}

${program('', '77 - 49', true)}

${program('', '55 \* 3', true)}

${program('', '88 / 4', true)}

${program('', '22.44 / 2.2', true)}

${program('', '15 % 6', true)}

Do you understand what the one above just did? If not, modify the numbers and hit **Re-Execute** until you figure it out!

${program('', '1 + (((3 \* 9) / 3) \* 10) - (10 \* 2)')}

This next one is effectively the same as the one above, but JavaScript is smart enough to apply PEMDAS without any parentheses.

${program('', '1 + 3 \* 9 / 3 \* 10 - 10 \* 2', true)}

## The Math object

There are many other types of mathematical operations that you can do in JavaScript and other programming languages, but they normally don't have their own special symbols like `+`, `-`, `*`, `/`, or `%`. Instead, they are provided as **functions** that are attached to an **object** named `Math`. In JavaScript, we use the `.` operator to access functions that are part of an object.

As a quick preview of one of these operations, execute the following examples:

${program('', 'Math.pow(2, 4)', true)}

${program('', 'Math.pow(2, 3)', true)}

Now, before executing the next one, what do you think the next one will reduce to?

${program('', 'Math.pow(2, 2)', true)}

There are **dozens** of other functions attached to the `Math` object. Here's a <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Math' target='_blank'>great reference on the Mozilla Developer Network site</a> where you can learn all about them.