const metaContext = { customSpriteType: '' };
const uploader = new Slingshot.Upload('spriteUpload', metaContext);

const level = new ReactiveVar('starter');
const gallerySelected = new ReactiveVar(null);

let gameUpdated = false;
const gameUpdatedDep = new Tracker.Dependency;

let getLevelDoc;

function updateCustomSprite(customSpriteType, customSpriteFilename) {
  const props = {
    lastUpdated: new Date(),
    updatedBy: userName()
  };
  props['customSprites.' + customSpriteType] = customSpriteFilename;

  Levels.update({_id:level.get()}, {
    $set: props
  }, (err, count) => {
    if (!err) {
      controls.alert('Your world will now use the custom ' + customSpriteType + ' sprite!');
      gameUpdated = true;
      gameUpdatedDep.changed();
    } else {
      console.error(err);
      controls.alert('There was an error when attempting to update your world to use the custom sprite. Please try again...');
    }
  });
};

function updateDefaultSprite(customSpriteType) {
  const props = {
    lastUpdated: new Date(),
    updatedBy: userName()
  };
  props['customSprites.' + customSpriteType] = '';

  Levels.update({_id:level.get()}, {
    $set: props
  }, (err, count) => {
    if (!err) {
      controls.alert('Your world will now use the default ' + customSpriteType + ' sprite!');
    } else {
      console.error(err);
      controls.alert('There was an error when attempting to update your world to use the default sprite. Please try again...');
    }
  });
};

const customSpriteTypes = ['tile', 'enemy', 'coin', 'gem', 'player'];

const getEditor = () => ace.edit('codeInput');

let customSpritesEnabled = false;

Template.create.helpers({
  customSpritesEnabled() { 
    //const customSpritesEnabled = Template.instance().data.customSpritesEnabled;
    return customSpritesEnabled;
  },
  customSpriteTypes() { return customSpriteTypes; },
  fileSelect() { return 'data-file-select-' + this; },
  fileUpload() { return 'data-file-upload-' + this; },
  fileDefault() { return 'data-file-default-' + this; },
  galleryShow() { return 'data-gallery-show-' + this; },
  gameUpdated() {
    gameUpdatedDep.depend();
    return gameUpdated;
  },
  buttonEnabled(buttonId) {
    const buttons = Template.instance().data.buttons;
    return buttons.includes(buttonId);
  },
  spriteFor(spriteType) {
    const name = spriteType[0].toUpperCase() + spriteType.substring(1);
    const levelDoc = getLevelDoc(Template.instance());
    const customSprites = levelDoc.customSprites;
    if (customSprites && customSprites[spriteType] && customSprites[spriteType] !== '') {
        const spriteUrl = getSpriteUrlFromName(customSprites[spriteType]);
        return spriteUrl + '?_t=' + new Date().valueOf();
    } else if (levelDoc.sprites && levelDoc.sprites[spriteType]) {
      const imgName = levelDoc.sprites[spriteType];
      const imgPath = '/images/spriteParts/' + spriteType + '/' + imgName;
      return imgPath;
    } else {
      const sels = levelDoc.selections;
      sels.push(levelDoc.tile);
      const sprites = {};
      for(let i = 0; i < sels.length; i++) {
        const items = sels[i].split('/');
        sprites[items[0]] = items[1];
      }
      const imgName = sprites[spriteType];
      const imgPath = '/images/spriteParts/' + spriteType + '/' + imgName;
      return imgPath;
    }
  },
  spriteSelect() {
    const customSpriteType = this;
    return function(spriteInfo) {
      const parts = spriteInfo.assetKey.split('/');
      const spriteName = parts[0] + '/' + customSpriteType + '/' + parts[1] + '.cspr';
      updateCustomSprite(customSpriteType, spriteName);
    }
  },
  galleryEnabled() {
    const customSpriteType = this;
    const currentSelected = gallerySelected.get();
    const enabled = String(currentSelected) === String(customSpriteType);
    return enabled;
  }
});

const customSprites = () => {
  const levelDoc = Router.current().data();
  const sprites = [];
  for(let key in levelDoc.customSprites) {
    const spriteUrl = getSpritePathFromName(levelDoc.customSprites[key]);
    sprites.push({
      spriteName: key,
      src: spriteUrl
    });
  }
  return sprites;
}

function codeEditorShow() {
  $('#gameTabsNav a[href="#codeEditorTab"]').tab('show');
  getEditor().focus();
}

customSpriteTypes.forEach(function(customSpriteType) {
  const events = {};

  events['click [data-file-select-' + customSpriteType + ']'] = function() {
    $('#file-input-' + customSpriteType).click();
    $('#file-input-' + customSpriteType).change(function(){
      if ($(this).val()) {
          $('#file-selected-' + customSpriteType).text($(this).val());
          $('#file-selected-' + customSpriteType).removeClass('hide');
          $('button[data-file-upload-' + customSpriteType + ']').attr('disabled', false);
      } else {
          $('button[data-file-upload-' + customSpriteType + ']').attr('disabled', 'disabled');
      }
    });
  };

  events['click [data-file-upload-' + customSpriteType + ']'] = function() {
    metaContext.customSpriteType = customSpriteType;
    uploader.send(document.getElementById('file-input-' + customSpriteType).files[0], function (error, downloadUrl) {
      if (error) {
        console.error('Error uploading', uploader.xhr.response);
        alert (error);
      }
      else {
        const spriteName = getSpriteNameFromUrl(downloadUrl);
        updateCustomSprite(metaContext.customSpriteType, spriteName);
      }
    });
  };

  events['click [data-file-default-' + customSpriteType + ']'] = function() {
    updateDefaultSprite(customSpriteType);
  };

  events['click [data-gallery-show-' + customSpriteType + ']'] = function() {
    gallerySelected.set(customSpriteType);
  };

  Template.create.events(events);
});

Template.create.onCreated(function() {
  if (!_.has(this.data, 'customSpritesEnabled')) {
    this.data.customSpritesEnabled = false;
  }
  if (!_.has(this.data, 'buttons')) this.data.buttons = ['update'];
  customSpritesEnabled = this.data.customSpritesEnabled;
});

Template.create.onRendered(function() { 
  
  function finishWork() {
    Handlebars.registerHelper('toString', function returnToString(x){
      return ( x === void 0 ) ? 'undefined' : x.toString();
    });

    Handlebars.registerHelper('spriteFile', function returnToString(sprite){
      const split = sprite.split('/');
      return split[1];
    });
 
    const test = () => {
      controls.confirm('Are you sure? When in test, players can give feedback about your world, but they cannot rank it.', function(result) {
        if (!result) return;
        Levels.update({_id:level.get()}, { 
          $set: { phase: 'test', published: true, lastUpdated: new Date(), updatedBy: userName() }
        }, function(err, count) {
          if (!err) {
            controls.alert('Your world is available for testing by everyone! You can keep working...');
          } else {
            console.error(err);
            controls.alert('There was an error setting your world ready for testing. Please check the browser console for details...');
          }
        });
      });
    };

    const release = () => {
      controls.confirm('Are you sure? When released, players can rank and comment on your world.', function(result) {
        if (!result) return;
        Meteor.call('levelRelease', level.get(), userName(), function(err, result) {
          if (!err) controls.alert('Your world is released for all! You can keep working...');
          else {
            console.error(err);
            controls.alert('There was an error releasing your world. Please check the browser console for details...');            
          }
        });
      });
    };

    const parseWorldDefinitionFromScript = script => {
      const defaults = Game.getDefaults();
      return window.ParseWorldDefinitionFromScript(script, defaults);
    }

    const update = () => {
      const userScript = getEditor().getSession().getValue();

      const obj = parseWorldDefinitionFromScript(userScript);
      const worldName = obj.worldName;
      gameUpdated = false;
      gameUpdatedDep.changed();
      // TODO clean up or remove
      const buildStepUpdateCounts = {};
      buildStepUpdateCounts['buildStepUpdateCounts.0'] = 1;

      // Get the updated tile and sprites
      const selections = [
        'player/' + obj.sprites.player,
        'enemy/' + obj.sprites.enemy,
        'gem/' + obj.sprites.gem,
        'coin/' + obj.sprites.coin,
        'shot/' + obj.sprites.shot
      ];

      // Specify the exact properties to update
      const props = {
        name: worldName,
        script: userScript,
        selections: selections,
        tile: 'tile/' + obj.sprites.tile,
        buildStepCurrent: step,
        lastUpdated: new Date(),
        updatedBy: userName()
      };

      Meteor.call('levelUpdate', level.get(), props, buildStepUpdateCounts, function(err) {
        const previewWin = window.open('/play?id=' + level.get() + '&mode=preview', 'gamePreview', 'modal=yes,width=1024,height=768');
        previewWin.focus();
        gameUpdated = true;
        gameUpdatedDep.changed();
      });
    };

    let aceEditorPathSet = false;

    const aceConfigure = () => {
      if (!aceEditorPathSet) {
        const paths = ['modePath', 'themePath', 'workerPath', 'basePath'];
        _.each(paths, function(path) {
          ace.config.set(path, '/packages/mrt_ace-embed/ace');
        });
        aceEditorPathSet = true;
      }
      const editor = getEditor();
      editor.setTheme('ace/theme/chrome');
      editor.getSession().setMode('ace/mode/javascript');
    };

    aceConfigure();
    $('#update').click(update);
    $('#test').click(test);
    $('#release').click(release);
  }

  getLevelDoc = (template=null) => {
    template = template !== null ? template : this;
    let levelDoc;    
    let levelLessonId = null;
    if (template.levelDoc) return template.levelDoc;

    if (_.has(template.data, 'levelLessonId')) levelLessonId = template.data.levelLessonId;
    if (levelLessonId !== null) {
      levelDoc = Levels.findByLessonIdAndUserId(levelLessonId);
    }
    else {
      levelDoc = Router.current().data();
    }

    Levels.update({_id: levelDoc._id}, {
      $set: {lastViewed: new Date()}}, (err, count) => {
      level.set(levelDoc._id);
      gameUpdated = true;
      gameUpdatedDep.changed();
      finishWork();
    });

    template.levelDoc = levelDoc;
    return levelDoc;
  };

  // TODO: this is stupid. Do we really need to update the starter to 
  // prime the real time sync?
  Levels.update({_id: 'starter'}, {$set: {lastViewed: new Date()}}, function(err, count) {
    const levelDoc = getLevelDoc();
    getEditor().getSession().setValue(levelDoc.script);    
  });
});