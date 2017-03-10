---
id: operators
author: Josh Gough
topics:
 - arithmetic operators
 - relational operators
 - comparison operators
sub-topics:
 - boolean values
 - logical operators
---

# Math Operators

JavaScript gives you plenty of mathematical operators, most of which you already use in school and daily life.

# Arithmetic operators

Review the arithmetic operators that you learned in the Expressions lesson, and learn about operands -- the numeric values that operators reduce to a single value.

## Arithmetic expressions

${ask('Do you know what <code>2 \* 2</code> or <code>10 % 3</code> means to the JavaScript language?')}

If not, complete the **Expressions in deep space** lesson. There you will learn that each of these bits of code are called **expressions**.

The first one is an expression that tells JavaScript to perform the mathematical **multiplication operation** of `2` times `2`. And, the second one means to find the **remainder** of **dividing** `10` by `3`.

## Familiar arithmetic operators

Here are several editable examples that demonstrate the previous two expressions and other arithmetic expressions:

${program('', '4 + 6', true)}

${program('', '6 - 4', true)}

${program('', '2 \* 2', true)}

${program('', '8 / 2', true)}

${program('', '10 % 3', true)}

Each of the mathematical symbols in the mathematical expressions above is known as an **operator** to the JavaScript language.

${key('Arithmetic Operators', 'The symbols <code>+</code>, <code>-</code>, <code>\*</code>, <code>/</code>, and <code>%</code> are called <i>arithmetic operators</i> in the JavaScript language.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions\_and\_Operators#Arithmetic\_operators')}

## Operators operate on operands

Here's one simple arithmetic expression with the addition operator:

${program('', '2 + 4', true)}

As you already know, the `+` symbol is the **addition operator** within the expression above.

Here's a new term: each of the numeric values in the expression above are known as **operands**.

${key('Operands', 'In a mathematical expression, the numeric values that an operator reduces to a single value are called <b>operands</b>. Example: In <code>2 + 4</code>, the <code>2</code> and the <code>4</code> are the <b>operands</b>', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions\_and\_Operators#Operators')}

## Operands for breakfast?

To reinforce the point about operators and operands, think about eating toast for breakfast with butter.

${ask('In order to transform your raw ingredients, a slice of toast and a pat of butter, into something you\'d actually want to eat, what else do you need?')}

## Operators to the rescue

If you said a **knife** to spread the butter, then think of the knife as the **operator** and the toast and butter as the operands.

You use the knife to *operate* on both of the *operands* in order to reduce them to a single value: **breakfast**.

# Binary operators

All the operators you've seen so far operate on two operands. These are called binary operators. Learn more about them in this section.

## Binary operators

The arithmetic operators we just saw are examples of **binary** operators. The word **binary** in this case means something involving two parts.

Thus, a binary operator operates upon **two operands**.

${key('Binary Operators', 'A binary operator operates on two operands and sits right in the middle of them. Example: In <code>10 / 5</code>, the <code>/</code> is the division operator and sits between the operands <code>10</code> and <code>5</code>', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions\_and\_Operators#Operators')}

When JavaScript reduces the binary operator expression to a single value, it does the same thing that you do in your head or on paper!

## LHS and RHS operands

Since binary operators sit between two operands, we refer to the operand on the left as the left-hand-side operand, or **LHS operand**. And, we refer to the operand on the right as the right-hand-side operand, or **RHS operand**

${key('LHS and RHS operands', 'The first half of a binary expression is called the left-hand-side (LHS) operand, and the second half is called the right-hand-side (RHS) operand. Example: In <code>80 - 5</code>, the LHS operand is <code>80</code> and the RHS operand is <code>5</code>.', 'http://programmers.stackexchange.com/questions/209922/formal-name-for-left-right-hand-side-of-an-expression')}

## Example binary operator

${ask('For the following program, what is the operator, the LHS operand, and the RHS operand?')}

${program('op1', '19 % 6', true)}

## Arithmetic operators and operands

${ask('For each of the following, ask yourself: What is the operator, the LHS operand, and the RHS operand?')}

${program('op2', '4 - 2', true)}

${program('op3', '7 * 5', true)}

${program('op4', '24 / 3', true)}

${program('op5', '100 % 3', true)}

# Numeric values

All rational numbers in JavaScript are called numeric values. This includes all integers and decimals, and all positive and negative numbers.

## Rational numbers

So far, you've seen all the expressions in this lesson reduce down to rational numbers like `2`, `4`, or `71`. 

These numbers and, and any other integers or decimals you can think of like `1000`, `-0.001`, `-500`, `50000000`, `3.14159265359`, and more are called **numeric values** in JavaScript.

${key('Numeric Values', 'All rational numbers like integers and decimals are called numeric values in JavaScript. These numbers can be positive or negative. Examples: <code>50</code> represents positive 50, and <code>-50</code> represents negative 50.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Numbers\_and\_dates')}

## Numeric arithmetic

${ask('Why do you think all the expressions in this lesson so far reduced to numeric values?')}

## Special numeric values

In addition to representing rational numbers, there are a few very special numeric values in JavaScript that you will sometimes come across:

* `NaN`
* `Infinity`
* `-Infinity`

## Hey, that's not a number!

The special value `NaN` means *Not-a-Number*. JavaScript reduces expressions to `NaN` when you attempt to use a non-numeric value where you *should haved used a numeric value* and it cannot make sense of what you typed!

Here are some examples of arithmetic expressions that reduce to `NaN`:

${program('', "10 - 'awesome'", true)}

${program('', "'will this be nan?' * 2", true)}

${program('', "'cool!' / 50", true)}

${program('', "'this is not a number' % 'nor is this'", true)}

${ask('Wait a second! What happens when you use the one <i>missing</i> arithmetic operator in any of the examples above?')}

For the rest of this lesson, you will learn about operators that reduce an expression down to a different type of value: a **boolean** value.

# Booleans are great: true or false?

A boolean value can be one of two values: `true` or `false`. They are extremely important in JavaScript and many other programming languages.

## The great boolean

${key('Boolean Values', 'A boolean value can be one of two values: <code>true</code> or <code>false</code>.')}

This is a very important type of value in JavaScript and all programming languages.

## What's so great about booleans?

As you just saw, a **boolean** value can only be one of two values: `true` or `false`.

We also said this is a very important type of value in programming.

${ask('Why do you think boolean values would be so important for programming?')}

## George Boole

You'll learn much more about boolean values soon!

But, if you're curious why that have such a funny name, check <a href='http://en.m.wikipedia.org/wiki/George\_\_Boole' target='_blank'>this article about logician George Boole.</a> It's all his doing.

## More boolean questions to ask

There are many operators that, when JavaScript reduces their operands to a single value, produce the boolean values `true` or `false`.

Besides asking questions like *Is 9 equal to 3?* or *Is 9 **not equal** to 3?*, what other kinds of comparisons or questions could we ask about the relationship between `9` and `3`?

# Equality and inequality operators

Using comparison operators, you can compare two numeric values to each other. Among other things, this lets you answer questions like determining whether one number is bigger or smaller than another.

## Equality and inequality examples

Here are some more binary operators that you have seen before and have had lots of practice with in a previous lesson. Can you figure out what these expressions will produce before clicking the Execute button?

${env.equalityAndInequalityPrograms()}

## The equality operator: <code>===</code>

As you have just seen, an expression like that following that contains the equality operator, `===`, tells JavaScript to compare the operand on the LHS with the operand on the RHS and ask the question: *Is the LHS operand equal to the RHS operand?*.

JavaScript reduces this expression down to a single value, just like it does when using the plus operator, `+`, in the expression `2 + 2`. But, instead of a numeric value, it produces either the value `true` or the value `false`.

Here are all the examples from the last step again. You can modify them to try out different numbers:

${env.equalityPrograms()}

## The inequality operator: <code>!==</code>

If `LHS === RHS` tells JavaScript to ask the question *Is the LHS operand equal to the RHS operand?*, then what do you suppose it asks for an expression like: `LHS !== RHS`?

Before executing the following examples, predict what you think the results will be:

${program('', '2 === 4', true)}

${program('', '2 !== 4', true)}

${program('', '2 === 2', true)}

${program('', '2 !== 2', true)}

Getting the hang of it?

## More inquality examples

If you have the expression `2 !== 4`, JavaScript asks a slightly different question than for the expression `2 === 2`. It asks: *Is the LHS operand **not equal** to the RHS operand?*

Here are all the inequality programs you saw a few steps ago:

${env.inequalityPrograms()}

What happens if you manually modify the expression by replacing the `!==` operator with the `===` operator?

# Comparison operators



## TODO items

* Separate out lt, gt, lte, gte from compound logical operators






