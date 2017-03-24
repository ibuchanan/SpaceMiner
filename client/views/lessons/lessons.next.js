Template.lessons.helpers({
  zero: function() {
    return this[0];
  },
  one: function() {
    return this[1];
  },
  two: function() {
    return this[2];
  },
  lessons: function() {
    /*
        ['Code 101', 'Learn what programming languages and code are all about'],
        ['The JavaScript Language with Cheatsheets', 'See all the fundamentals about the most popular programming language in the world'],
    */
    return [
        ['Mission', 'Introduction to SpaceMiner and coding', 'mission'],
        ['Expressions', 'Express yourself in code!', 'expressions'],
        // ['Values', 'Tell JavaScript stuff it can understand', 'values'],
        // ['Statements', 'Specify what a program does', 'statements'],
        ['Operators', 'Compare, question, calculate, combine, and remember stuff', 'operators'],
        ["Decisions with if and else", "Make decisions about which path to take in the code with if and else statements", 'if-else'],
        //['Conditionals and Arrays', 'Test values and decide whether or not to run statements', 'conditionals'],
        ['Variables', 'Store basic values in memory', 'variables'],
        ['Functions', 'Group useful code into reusable chunks', 'functions'],
        //['Arrays', 'Group multiple values in a specific numeric order inside a single variable', 'arrays'],
        //['Objects', 'Group multiple values by name (like a dictionary for your stuff) inside a single variable', 'objects'],
        ['Training', 'Go on a training mission to use your new skills', 'training'],
        ['ES2015', 'Advanced: Learn ES2015 and beyond in SpaceMiner!', 'ES2015'],
        //['Games', 'Make more games with what you\'ve leanred so far!', 'games']
    ];
  }
  
})
