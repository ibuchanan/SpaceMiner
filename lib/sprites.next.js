let g = this['window'] !== undefined ? window : global;

let CUSTOM_SPRITE_BASE_URL = 'https://openagile-testing.s3.amazonaws.com/';

let getSpriteNameFromUrl = url => {
    url = url.substring(CUSTOM_SPRITE_BASE_URL.length);
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

let getSpriteUrlFromName = name => CUSTOM_SPRITE_BASE_URL + getSpritePathFromName(name);
g.getSpriteUrlFromName = getSpriteUrlFromName;

let getSpriteUrlFromPath = path => CUSTOM_SPRITE_BASE_URL + path;
g.getSpriteUrlFromPath = getSpriteUrlFromPath;
