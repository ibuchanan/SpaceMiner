var g = this['window'] !== undefined ? window : global;

g.markdownLesson = function(lessonFile, lessonId) {
  if (Meteor.isServer) {
    let fm = Meteor.npmRequire('front-matter');
    let md = Meteor.npmRequire('markdown').markdown;
    let unescape = Meteor.npmRequire('unescape-html');
    let fs = Npm.require('fs');
    let hash = Meteor.npmRequire('string-hash');
    let babel = Meteor.npmRequire('babel-core');

    let training = (trainingId, programId, code) => {
      programId = programId || trainingId;
      return editor('game', {
        _id: programId,
        code,
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

    let hashCurrent;
    let doc = Lessons.findOne(lessonId);
    if (doc) hashCurrent = doc.hash;

    fs.readFile(Lessons.lessonPath(lessonFile), 'utf8', (err, data) => {
      if (err) {
        console.log("ERROR PARSING LESSON");
        console.log(err);
      }

      let hashNew = hash(data);

      let content = fm(data);
      let p;
      let body = content.body.trim();
      let attrs = content.attributes;
      /*
      if (hashNew === hashCurrent) {
        console.log(`No changes for ${lessonId} found, exiting...`);
        return;
      }
      */

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
        sections: [],
        hash: hashNew
      };

      for(let _sec of lesson.sections) {
        let secArgs = [unescape(_sec.title), {description:unescape(_sec.description)}];
        for (let _step of _sec.steps) {
          let text = '';
          // TODO this is goofy:
          for (let _para of _step.paras) {
            if (_.isObject(_para)) {
              if (text !== '') {
                secArgs.push(text);
                text = '';
              }              
              secArgs.push(_para);
            } else {
              text += '<p>' + unescape(_para) + '</p>';
            }
          }
          secArgs.push(text);
        }
        lessonSpec.sections.push(sec(...secArgs));
      }

      Lessons.add(lessonSpec);
    });
  }
};