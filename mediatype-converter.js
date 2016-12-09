const pandocToMediaType = require('./mediatype-mapping.json');

let mediaTypeToPandoc = {};
for (let key in pandocToMediaType) {
    if (pandocToMediaType[key]) {
        mediaTypeToPandoc[pandocToMediaType[key]] = key;
    }
}

/**
 * Converts a media type into a pandoc type identifier.
 *
 * @param {String} mediaType Media type to be converted into pandoc type identifier
 * @return {String} Pandoc type identifier
 */
function convertType(mediaType) {
    if (mediaTypeToPandoc[mediaType]) {
        return mediaTypeToPandoc[mediaType];
    } else if (mediaType.match(/^application\/x\./)) {
        return mediaType.substr(mediaType.indexOf('.') + 1);
    } else {
        return mediaType;
    }
}

module.exports = convertType;
