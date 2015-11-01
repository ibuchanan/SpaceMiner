let g = this['window'] !== undefined ? window : global;

let getSpriteNameFromUrl = url => {
    url = url.substring(Meteor.settings.public.CustomSpritesBaseUrl.length);
    let [userId, customSpriteType, fileName] = url.split('/');
    fileName = fileName.replace('.png', '.cspr');
    const encodedName = `${userId}|${customSpriteType}|${fileName}`;
    return encodedName;
};
g.getSpriteNameFromUrl = getSpriteNameFromUrl;

let getSpritePathFromName = name => {
    let spriteUrl = name.replace('.cspr', '.png');
    spriteUrl = spriteUrl.replace(/\|/g, '/');
    return spriteUrl;
};
g.getSpritePathFromName = getSpritePathFromName;

let getSpriteUrlFromName = name => Meteor.settings.public.CustomSpritesBaseUrl + getSpritePathFromName(name);
g.getSpriteUrlFromName = getSpriteUrlFromName;

let getSpriteUrlFromPath = path => Meteor.settings.public.CustomSpritesBaseUrl + path;
g.getSpriteUrlFromPath = getSpriteUrlFromPath;