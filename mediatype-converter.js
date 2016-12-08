var pandocToMediaType = require('./mediatype-mapping.json');

var mediaTypeToPandoc = {};
for(var key in pandocToMediaType) {
  if(pandocToMediaType[key]) {
    mediaTypeToPandoc[pandocToMediaType[key]] = key;
  }
}

function convertType (type) {
  if(mediaTypeToPandoc[type]) {
    return mediaTypeToPandoc[type];
  } else if(type.match(/^application\/x\./)) {
    return type.substr(type.indexOf('.')+1);
  } else {
    return type;
  }
}

module.exports = convertType;