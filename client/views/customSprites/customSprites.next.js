Template.customSprites.onCreated(function() {
  const reactiveAssetGroups = new ReactiveVar([]);
  this.reactiveAssetGroups = reactiveAssetGroups;
  let customSpriteTypeFilter = 'all';
  this.applySelectionEnabled = false;
  this.applySelectionCallback = () => {};
  if (this.data) {
    if (this.data.customSpriteType) customSpriteTypeFilter = this.data.customSpriteType;
    if (this.data.onSelected) {
      this.applySelectionEnabled = true;
      this.onSelected = this.data.onSelected;
    }
  }
  const customSpriteTypeToSpriteCollectionNameMap = {
    tile: 'tiles',
    enemy: 'enemies',
    coin: 'coins',
    gem: 'gems',
    player: 'players'
  };
  Meteor.call('getCustomSpriteGroups', customSpriteTypeFilter, (err, assetGroups) => {
    let assetGroupsMapped = [];
    for(let key of Object.keys(assetGroups)) {
      let group = assetGroups[key];
      let assets = group.map(i => {
        const assetName = i.fileName.replace('.png', '');
        let obj = {
          src: `${Meteor.settings.public.CustomSpritesBaseUrl}${i.userId}/${i.customSpriteType}/${i.fileName}`,
          assetKey: `${i.userId}/${assetName}`,
          customSpriteCollectionName: customSpriteTypeToSpriteCollectionNameMap[i.customSpriteType]
        };
        return obj;
      });
      assetGroupsMapped.push({group:key, assets});
    }

    reactiveAssetGroups.set(assetGroupsMapped);
  });
});

Template.customSprites.helpers({
  assetGroups: function() {
    return Template.instance().reactiveAssetGroups.get();
  }
});

Template.customSprites.events({
  'click .customSprites-sprite': function() {
    if (Template.instance().applySelectionEnabled) Template.instance().onSelected(this);
  },
  'click .customSprites-details': function() {
    bootbox.prompt({
      className: 'customSprites-details-dialog',
      title: 
`<h3>Sprite Details</h3>
<center>  
  <div class='customSprites-sprite'>
    <img src='${this.src}' />
  </div>
</center>
`,  
      value: `${this.customSpriteCollectionName}('${this.assetKey}')`,
      callback: function(result) {}
    });
    Meteor.setTimeout(function() {
      let input = $('.bootbox-input-text');
      input.select().focus();
      input.attr('readonly', 'readonly');
      let copyLabel = $('<h4>Code snippet</h4>');
      copyLabel.insertBefore(input);
      let copyMessage = $(`<div class='customSprites-details-copy-message'><small>Ctrl+C or Cmd+C to copy</small></div>`);
      copyMessage.insertAfter(input);
    }, 375)
  }
});