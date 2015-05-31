Lessons.add({
  _id: 'operators',
  title: 'Operators',
  sections: [
    sec('Arithmetic operators',
        `Remember when you figured out what <code>2 * 2</code> or <code>10 % 3</code> means to the JavaScript language? Generally speaking, each of these bits of code are called <b>expressions</b>. More specifically, the first one is an expression that tells JavaScript to perform the mathematical <b>multiplication operation</b> of <b>2 times 2</b>, while the second one meant to find the <b>remainder</b> of <b>dividing 10 by 3</b>. Here is an editable example that prints the result of evaluating those and other mathematical expressions:
${dbr}`
        + program('ops1',
                  `print( 2 * 2 )
print( 10 % 3 )
print( 4 + 6 )
print( 6 - 4 )
print( 32 / 2 )`, true)
        + `${dbr}
Each of the mathematical symbols above is known as an <b>operator</b> to the JavaScript language. And, each of the numeric values are known as <b>operands</b>. Head to the next step to learn more about <b>operators</b> and <b>operands</b>.`,
        `The arithmetic operators we just saw are examples of a a certain kind of operator called <i>binary</i> operators. The word <b>binary</b> in this case means something involving two parts. Thus, a binary operator is an operator that requires two operands, one to its left, and one to its right. A binary operator looks at the operand on its left-hand-side and the operand on its right-hand-side and evaluates the expression to reduce it to a single value.
${dbr}
Take a look at this small program:`
        + program('op1', '2 + 2') +
        `${dbr}
What is the operator? What are the operands?
${dbr}
And, what about in the rest of these examples?`
        + program('op2', '2 - 2')
        + program('op3', '7 * 5')
        + program('op4', '24 / 3')
        + program('op5', '100 % 3')
       ),
    sec('Comparison operators',
        `Here are some more binary operators that you have seen before and have had lots of practice with. Can you figure out what these expressions will produce before clicking the Execute button?
${dbr}`
        + program('comp1', '1 === 0')
        + program('comp2', '4 === 4')
        + program('comp3', '2 + 2 === 4')
        + program('comp4', '1 !== 0')
        + program('comp5', '4 !== 40')
        + program('comp6', '50 / 2 !== 25')
        + `${dbr}TODO add more`
       ),
    sec('Logical operators',
        `Here a few more binary operators in sample programs. Just like before with the expressions containing arithmetic operators and comparison operators, each of these expressions will evaluate to a single value. Try to figure out what they will evaluate to before you executing each one:
${dbr}`
        + program('log1', 'true && true')
        + program('log7', 'true && false')
        + program('log8', 'false && true')
        + program('log8', 'false && true')
        + program('log2', 'true && 1 > 0')
        + program('log5', '6 < 2 && true')
        + program('log3', '5 > 3 && 55 >= 54')
        + program('log4', '5 < 2 * 3 && 4 > 3')
        + program('log6', '5 < 2 * 3 && 4 <= 3')
        + program('log9', '21 === 7 * 3 && 50 === 100 / 2')
        + 'Based on what you just saw, how you think the <code>&&</code> operator is doing?',
        `The <code>&&</code> is called the <b>logical AND</b> operator and it produces a <b>true</b> value if-and-only-if <b>both</b> of its operands independently evaluate to <b>true</b>. Thus, if either operand evaluates to <b>false</b>, then the expression as a whole will evaluate to <b>false</b>.
${dbr}
The values <b>true</b> and <b>false</b> are the only two possible values in the Boolean data type. Thus, the logical AND operator always works with Boolean operands and evaluates to a Boolean value.
${dbr}
Here are the same expressions from before, but in a single sample program where the result of each expression is printed in the Output section. Play around with these by modifying them to see what you can do:
` + program('log1', `print( true && true )
print( true && false )
print( false && true )
print( false && true )
print( true && 1 > 0 )
print( 6 < 2 && true )
print( 5 > 3 && 55 >= 54 )
print( 5 < 2 * 3 && 4 > 3 )
print( 6 < 2 && true )
print( 5 < 2 * 3 && 4 <= 3 )
print( 21 === 7 * 3 && 50 === 100 / 2 )`, true)
        + `For the first four expressions, where the operands are simply literal <b>true</b> and <b>false</b>, it should be pretty obvious, given the rule we just read above, why the whole expression evaluates to what it does.
${dbr}
But, what about after that, when the expressions <i>also contain arithmetic operators</i> on the left and right sides of the <code>&&</code> operator? While these expressions are more complex, each still evaluates down to a single <b>true</b> or <b>false</b> value. Why do you think this is so?`,
        `Let's examine more closely just the expressions that <i>also</i> contained arithmetic operators, not just the logical AND operator. Here they are again:
${dbr}`
        + program('log1', `print( true && 1 > 0 )
print( 6 < 2 && true )
print( 5 > 3 && 55 >= 54 )
print( 5 < 2 * 3 && 4 > 3 )
print( 5 < 2 * 3 && 4 <= 3 )
print( 21 === 7 * 3 && 50 === 100 / 2 )`)
        + `JavaScript relies upon a specific <b>order of operations</b> to figure out how to evaluate these expressions. It first performs arithmetic operations, then it evaluates <code>===</code>, or equality, operators against their operands, and finally it evaluates <code>&&</code> operators against their operands.
${dbr}
Let's look at each one by itself to really understand what's going on here.
${dbr}
Try executing the code first. Then, remove the <code>//</code> from the second line and re-execute.`
        + program('exp1', `print( true && 1 > 0 )
// print( true && true ) // Step 1: JavaScript evaluates 1 > 0 to produce true
// print( true ) // Step 2: Evaluate true && true to reduce to true`)
        + `JavaScript first evaluates the sub-expression <code>1 > 0</code> to produce <b>true</b>, which results in the simpler expression of <code>true && true</code>. Make sense?
${dbr}
Here's the next one, which is very similar, except the sub-expression with the arithmetic operator is on the left-hand-side of the <code>&&</code> operator.` 
        + program('exp2',  `print( 6 < 2 && true )
// print( false && true ) // Step 1: Evaluate 6 < 2 to produce false
// print( false ) // Step 2: Evaluate false && true to reduce to false`)
        + `In this case, the sub-expression <code>6 < 2</code> evaluates to <b>false</b>, so JavaScript then evaluates the simpler expression of <code>print( false && true )</code>.
${dbr}
This next one contains a sub-expression with comparison operators on both the left and right sides of the <code>&&</code> operator, but the process is still the same:`
        + program('exp3', `print( 5 > 3 && 55 >= 54 )
// print( true && 55 >= 54 ) // Step 1: Evaluate 5 > 3 to produce true
// print( true && true ) // Step 2: Evaluate 55 >= 54 to produce true
// print( true ) // Step 3: Evaluate true && true to reduce to true`) +
        `As you can see by reading the commented code, the first step replaces <code>5 > 3</code> on the left-hand-side of the oeprator with <b>true</b>. The second step evaluates the right-hand-side of the operator to reduce <code>55 >= 54</code> with <b>true</b>. In the final step, because of the rules for the <b>&&</b> operator, the remaining expression <code>true && true</code>  evaluates to the single value of <b>true</b>. Easy, right?`,
        `Now, the samples are similar, but the <code>&&</code> has been replaced with <code>||</code>. Try these exmamples and try to figure out the purpose of the <code>||</code> operator.
${dbr}`
        + program('log1', 'true || true')
        + program('log20', 'false || false')
        + program('log7', 'true || false')
        + program('log8', 'false || true')
        + program('log8', 'false || true')
        + program('log2', 'true || 1 > 0')
        + program('log5', '6 < 2 || true')
        + program('log50', '6 < 2 || 50 > 100')
        + program('log6', '5 < 2 * 3 || 4 <= 3')
        + program('log9', '21 === 7 * 2.5 || 49 === 100 / 2')
        + 'Figure it out yet? Continue to see whether you are correct...',
        `The <code>||</code> is called the <b>logical OR</b> operator. It's a lot less picky than the logical AND! If either of its operands is <b>true</b>, then  the expression as a whole evaluates to <b>true</b>. It's that simple.
${dbr}
You can try as hard as you like, but these rules won't change:` +
        program('log10', 'true && true && true && true && true && true && false', true)
        + program('log11', 'false || false || false || false || false || false || true', true)
       )
  ]
})