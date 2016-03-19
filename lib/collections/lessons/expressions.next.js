const env = {
  quickCheck2plus2() {
    return quickCheckDyn('What does the expression <code>2 + 2</code> reduce to?',
      'Type your answer into the textbox below and click the <b>Check answer</b> button when finished.',
      numericEvaluator(4));
  },

  quickCheckLongerExpression() {
    return quickCheckDyn('What is <code>1 + 3 \* 9 / 3 \* 10 - 10 \* 2</code>?', 'This time you have to work a lot harder to apply the order of operations to get the right answer!', numericEvaluator(71));
  },

  speedOfLightProgram() {
    return program('speedOfLight', 'numf(186282 * 60 * 60 * 24 * 365)', true);
  }  
};

markdownLesson('expressions.md', 'expressions', env);