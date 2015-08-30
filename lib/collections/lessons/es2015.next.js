if (Meteor.isServer) {
  let fm = Meteor.npmRequire('front-matter');
  let md = Meteor.npmRequire('markdown').markdown;
  let unescape = Meteor.npmRequire('unescape-html');
  let fs = Npm.require('fs');
  let babel = Meteor.npmRequire('babel-core');

  let training = (trainingId, programId) => {
    programId = programId || trainingId;
    return editor('game', {
      _id: programId,
      code: '',
      context: {
        level: trainingId,
        enableSound: false,
        buttons: ['gamePause', 'gamePlay', 'gameReset']
      }
    });
  };

  let run = code => {
    let newCode = babel.transform(code, {stage:1, ast:false}).code;
    return eval(newCode);
  }

  let dump = obj => console.log(JSON.stringify(obj, null, 2));

  fs.readFile(Lessons.lessonPath('es2015.md'), 'utf8', (err, data) => {
    if (err) {
      console.log("ERROR PARSING LESSON");
      console.log(err);
    }
    let content = fm(data);
    let p;
    let body = content.body.trim();
    let attrs = content.attributes;

    let lesson = {
      _id: attrs.id,
      title: '',
      description: '',
      sections: []  
    };

    let states = {
      none: Symbol('none'),
      needLessonDescription: Symbol('needLessonDescription'),
      needSectionDescription: Symbol('needSectionDescription'),
      //needStepDescription: Symbol('needStepDescription'),
      needStepData: Symbol('needStepData')
    };

    let state = {
      token: null,
      headingCount: 0,
      headingDepth: 0,
      current: states.none
    };

    let stateSet = newState => {
      state.current = newState;
    };  

    let stateIs = match => state.current === match; 

    let typeIs = type => state.token[0] === type;

    let html = () => {
      if (state.token[0] === 'para' && state.token[1].indexOf('${') === 0) {
        let code = state.token[1].substring(2);
        code = code.substring(0, code.length-1);      
        let result = run(code);
        return result;
      }
      return md.renderJsonML(md.toHTMLTree(state.token));
    };

    let pos = (position, val) => val === position;
    let gt = (position, val) => val > position;
    let level = levelNum => state.token && state.token[1] && state.token[1].level === levelNum;
    let is = match => state.token && state.token[2] && state.token[2] === match;

    let headingPos = position => pos(position, state.headingCount);
    let headingGt = position => gt(position, state.headingCount);

    let lessonTitleSet = () => {
      lesson.title = html();
      stateSet(states.needLessonDescription);
    }

    let lessonDescriptionSet = () => lesson.description += html();

    let sectionAdd = () => {
      let section = {
        title: state.token[2],
        description: '',
        steps: []
      };
      lesson.sections.push(section);
      stateSet(states.needSectionDescription);    
      return section;
    };

    let sectionGet = () => lesson.sections[lesson.sections.length - 1];

    let sectionDescriptionSet = () => {
      let section = sectionGet().description += html();
    };  

    let stepAdd = () => {
      let step = {
        title: state.token[2],
        description: '', // TODO?
        paras: []
      };
      sectionGet().steps.push(step);
      // stateSet(states.needStepDescription) // TODO?
      stateSet(states.needStepData)
      return step;
    }

    let stepGet = () => {
      let section = sectionGet();
      let step = section.steps[section.steps.length - 1];
      return step;
    };

    let stepParaAdd = () => {
      let para = html();
      stepGet().paras.push(para);
    };

    let headingNum = 0;
    p = md.parse(body);
    //dump(p);

    for(let token of p) {
      state.token = token;
      if (typeIs('header')) {
        state.headingCount++;
        if (headingPos(1)) lessonTitleSet();
        else if (headingGt(1) && level(1)) sectionAdd();
        else if (headingGt(2) && level(2)) stepAdd();
      }
      else if (typeIs('para') && stateIs(states.needLessonDescription)) lessonDescriptionSet();
      else if (typeIs('para') && stateIs(states.needSectionDescription)) sectionDescriptionSet();
      else if (typeIs('para') && stateIs(states.needStepData)) stepParaAdd();
      else if (typeIs('bulletlist')) stepParaAdd();
    }
    
    let lessonSpec = {
      _id: lesson._id,
      title: unescape(lesson.title),
      description: unescape(lesson.description),
      sections: []
    };

    for(let _sec of lesson.sections) {
      let secArgs = [unescape(_sec.title), {description:unescape(_sec.description)}];
      for (let _step of _sec.steps) {
        let text = '';
        for (let _para of _step.paras) {
          text += '<p>' + unescape(_para) + '</p>';
        }
        secArgs.push(text);
      }
      lessonSpec.sections.push(sec(...secArgs));
    }

    Lessons.add(lessonSpec);
  });
}


/*
Lessons.add({
  _id: 'es2015',
  title: 'ES2015',
  sections: [
    sec('ES2015 and Beyond',
        `SpaceMiner allows developers and students to start learning and using ES2015 and even proposed 2016 features today. This is done with the <a href='https://babeljs.io/' target='_blank'>Babel compiler</a>, loaded inside the web browser.
${dbr}
Here is a <a href='https://babeljs.io/docs/learn-es2015' target='_blank'>great list of features in ES2015</a>. In short, here are some features to look forward:
${dbr}
<ul>
  <li>arrows</li> 
  <li>classes</li>  
  <li>enhanced object literals</li> 
  <li>template strings</li> 
  <li>destructuring</li>  
  <li>default + rest + spread</li>  
  <li>let + const</li>  
  <li>iterators + for..of</li>  
  <li>generators</li> 
  <li>unicode</li>  
  <li>modules</li>  
  <li>module loaders</li> 
  <li>map + set + weakmap + weakset</li>  
  <li>proxies</li>  
  <li>symbols</li>  
  <li>subclassable built-ins</li> 
  <li>promises</li> 
  <li>math + number + string + array + object APIs</li> 
  <li>binary and octal literals</li>  
  <li>reflect api</li>  
  <li>tail calls</li> 
</ul>`,
`You can learn more about how the Meteor team is already making use of Babel internally and how you can too in this recent DevShop video by Ben Newman:
${dbr}
<iframe width="560" height="315" src="https://www.youtube.com/embed/05Z6YGiZKmE" frameborder="0" allowfullscreen></iframe>`,
`In addition to completed ES2015 spec features, Babel supports experimental features of ES2016. See the <a href='https://babeljs.io/docs/usage/experimental/' target='_blank'>list of those features here</a>. SpaceMiner utilize the <code>async / await</code> proposal to great effect, as you'll soon see!
${dbr}
Jafar Husain from the Netflix team has an excellent talk from JSConf 2015 on <code>async / await</code> that you don't want to miss:
${dbr}
<iframe width="560" height="315" src="https://www.youtube.com/embed/lil4YCCXRYc" frameborder="0" allowfullscreen></iframe>`,
`But first, let's start with ES5 callback hell and see why this is such a problem when beginning students approach programming for the first time.
${dbr}
<img src='http://i.imgur.com/DEg3cPZ.png' alt='Callbacks in your callbacks' />`),
    sec('ES5 and callback hell', 
        `The problem of making naturally asynchronous code, like code executing within a game loop or network access code, feel synchronous in JavaScript is often handled by callbacks. This is when you pass a reference to function to a function that you want the called function to call when its completed. It gets really complicated if you want to sequence a large number of steps together.${dbr}` +
        program('', `move(point(0,0), function() {
  move(r(3), function() {
    move(d(3), function() {
      move(l(3), function() {
        move(u(3));
      });
    });
  });
});`, true) + training('boxStep', 'es2015-es5-callbacks'),
        `ES2015 helps mitigate this problem by removing <code>function () {</code> boilerplate, but we still are wrapped in callback hell.${dbr}` +
        program('', `move(point(0,0), () => {
  move(r(3), () => {
    move(d(3), () => {
      move(l(3), () => {
        move(u(3));
      });
    });
  });
});`, true) + training('boxStep', 'es2015-es2015-arrows'),
        `ES2015 can take us further by removing the need for <code>{</code> and <code>}</code> because when you declare an arrow function that just executes a single expression, you can just leave them out. Note that this implicitly makes the function <code>return</code> the value of the single expression.${dbr}` + 
        program('', `move(point(0,0), () =>
  move(r(3), () => 
    move(d(3), () => 
      move(l(3), () => 
        move(u(3))
      )
    )
  )
);`, true) + training('boxStep', 'es2015-es2015-arrows-inline'),
        `Finally, we can condense this down to a single line if we want:${dbr}` + program('', 'move(point(0,0), () => move(r(3), () => move(d(3), () => move(l(3), () => move(u(3)))));', true) + training('boxStep', 'es2015-es2015-arrows-condensed'),
        `Yet, this still feels unsatisfying, as we are still in good old callback hell.${dbr}
        <img src='http://www.specialeducationadvisor.com/wp-content/uploads/2012/02/unsatisfied.jpg' alt='unsatisfied' />`
    ),
    sec('Promises, Promises', `Promises are built into ES2015, and even in ES5 we can utilize them with libraries. Here's a first step:${dbr}` + program('', `move(point(0,0))
.then(function() { return move(r(3)); })
.then(function() { return move(d(3)); })
.then(function() { return move(l(3)); })
.then(function() { return move(u(3)); })`, true) + training('boxStep'),
    `And, with ES6, the boilerplate disappears and we can write it this way:${dbr}` + program('', `move(point(0,0))
.then(() => move(r(3)))
.then(() => move(d(3)))
.then(() => move(l(3)))
.then(() => move(u(3)))`, true) + training('boxStep'),
    `Getting better, but there's more...${dbr}
<img src='http://www.35again.com/wp-content/uploads/2015/02/weight-loss-coffee.jpg' alt='More!' />`),
    sec('Picking up all the things in ES5!', 
      `This is code similar to what was written by a 10-year-old girl during here first time at a CoderDojo event. She had the right idea, right?${dbr}` + 
      program('', `for(var row = 0; row < 3; row++) {
  var x = row * 7;
  for(var box = 0; box < 3; box++) {
    var y = box * 4;
    console.log("Moving ship to X and Y coordinates: " + x + ":" + y);
    move(point(x, y));
    move(r(3));
    move(d(3));
    move(l(3));
    move(u(3));
  }
}`, true) + training('boxStep'),
      `To actually do this in ES5, we can use Promises, but it does not look good for a beginner!:${dbr}` + 
      program('', `var x = 0,
    y = 0,
    total = 9,
    done = 0,
    distX = 7,
    distY = 4;

var pickup = function() {
  if (done < total) {
    var nextX = x + (distX * (done % 3));
    var nextY = y + (distY * Math.floor(done / 3));
    move(point(nextX, nextY))
    .then(function() { return move(r(3)); })
    .then(function() { return move(d(3)); })
    .then(function() { return move(l(3)); })
    .then(function() { return move(u(3)); })    
    .then(function() {
      done++;
      pickup();
    });
  }
}

pickup();`, true) + training('boxStep'),
      `ES2015 helps us here slightly, but not much. I threw in one small improvement that I have in <code>move</code> that I didn't mention before.${dbr}` + 
      program('', `const x = 0,
      y = 0,
      total = 9,
      distX = 7,
      distY = 4;
let   done = 0;

let pickup = () => {
  if (done < total) {
    var nextX = x + (distX * (done % 3));
    var nextY = y + (distY * Math.floor(done / 3));
    move(point(nextX, nextY), r(3), d(3), l(3), u(3), pickup);
    done++;
  }
};

pickup();`, true) + training('boxStep'), 
    `But, this where the 2016 <code>async / await</code> proposal shines, as you'll see next...`),
    sec(`ES2016 async / await proposal`, 'We will paste some code in from gist to run this one...')
  ]
});
*/