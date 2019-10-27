'use strict';

const rUuidFilename = /(.*)?(?:\s+|^)(\/*\S+)/;
const rOperations = /\s*operations:([\w\.\/\-;]+)/i;
const rSize = /\b\d*x\d*\b/g;

// {% uploadcareurl imageUuid [operations:size|operations] [filename] %}
// size can be WxH | Wx | xH
// operations are split by ';'. Eg: crop/200x200;quality/lightest;flip More info: https://uploadcare.com/docs/api_reference/cdn/
function generateUrl(args) {
    if (!args[0]) {
        // TODO: throw exception
        return "";
    }

    let arg = args.join(' ');
    let uriTransformations = "/-/preview";
    let cdnOperations = "";

    arg = arg.replace(rOperations, (match, _operations) => {
        cdnOperations = _operations;
        return '';
    });

    if (cdnOperations != "") {
        uriTransformations = "";

        cdnOperations.split(";").forEach(function(operation) {
            uriTransformations += "/-/"
                + (rSize.test(operation) ? "resize/" : "")
                + operation;
        });
    }
    
    const match = arg.match(rUuidFilename);

    // Exit if path is not defined
    if (!match) return;
  
    const imgUuid = match[1];
    const imgFilename = match[2] || "image.jpg";
 
    return (`https://ucarecdn.com/${imgUuid}${uriTransformations}/${imgFilename}`);
}

if (typeof module !== 'undefined' && module.exports != null) {
    exports.generateUrl = generateUrl;
}