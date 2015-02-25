You are already very familiar with mathematical operations like addition, subtraction, multiplication and division. 

And, as you've just seen, you can make JavaScript perform these operations for you by typing expressions that use familiar symbols to represent these operations like:

<ul>
  <li>addition: <code>1 + 1</code></li>
  <li>subtraction: <code>99 - 55</code></li>
  <li>multiplication: <code>2 * 8</code></li>
  <li>division: <code>16 / 2</code></li>
</ul>  

As you also saw, there is a special type of mathematical operation that you can express with the <code>%</code> character, usually called the percentage sign character. When used in programming language expressions, the <code>%</code> is called the <b>modulo</b> operator. It's also sometimes called <b>modulus</b>. 

This operation gives you the remainder when dividing one number by another. For example, if you want to know the remainder of trying to divide 10 by the number 4, then use the expression: <code>10 % 4</code>. In this case, the result is <code>2</code>, because 4 goes into 10 twice, producing 8, with a remainder of 2.

To see more examples of this in action, try typing in each of the following expressions to see what they evaluate to:

<ul>
  <li><code>5 % 1</code></li>
  <li><code>5 % 2</code></li>
  <li><code>5 % 3</code></li>
  <li><code>5 % 4</code></li>
  <li><code>5 % 5</code></li>
</ul>

What did you notice?

Now try some more:

<ul>
  <li><code>8 % 1</code></li>
  <li><code>8 % 2</code></li>
  <li><code>8 % 3</code></li>
  <li><code>8 % 5</code></li>
  <li><code>8 % 6</code></li>
  <li><code>8 % 7</code></li>
  <li><code>8 % 8</code></li>    
</ul>

Even more:


<ul>
  <li><code>100 % 1</code></li>
  <li><code>100 % 33</code></li>
  <li><code>100 % 11</code></li>
  <li><code>100 % 9</code></li>  
  <li><code>100 % 4</code></li>
  <li><code>100 % 5</code></li>
  <li><code>100 % 50</code></li>
  <li><code>100 % 75</code></li>
</ul>

Before moving on, think about what you've observed. How come the answers for some of them are identical, even though we're using such different numbers on the right side of the expression? What else do you notice?

---
OK, let's understand a little bit more about modulus expressions before taking the next coding challenge.

As you just saw, each of the following expressions evaluates to an identical value:

<ul>
  <li><code>100 % 33</code></li>
  <li><code>100 % 11</code></li>
  <li><code>100 % 9</code></li>   
</ul>

The value is <code>1</code>.

Similarly, each of these expressions evaluates to an identical value:

<ul>
  <li><code>100 % 4</code></li>
  <li><code>100 % 5</code></li>
  <li><code>100 % 50</code></li>
</ul>

The value for these is 0.

To understand why, we ask the same two questions questions for each expression. In each case, the first answer is different, but the second answer is identical!

<ul>
  <li><code>100 % 33</code>: How many times does 33 fit inside of 100? How much is left over? Answers: 3, 1</li>
  <li><code>100 % 11</code>: How many times does 11 fit inside of 100? How much is left over? Answers: 9, 1</li>
  <li><code>100 % 9</code>: How many times does 9 fit inside of 100? How much is left over? Answers: 11, 1</li>
</ul>

Similarly, here is what we observe for the others:

<ul>
  <li><code>100 % 4</code>: How many times does 4 fit inside of 100? How much is left over? Answers: 25, 0</li>
  <li><code>100 % 5</code>: How many times does 5 fit inside of 100? How much is left over? Answers: 20, 0</li></li>
  <li><code>100 % 50</code>: How many times does 50 fit inside of 100? How much is left over? Answers: 2, 0</li></li>
</ul>

Now that you have had some practice using mathematical expressions to perform familiar operations, you're going to use this knowledge in a coding challenge.
