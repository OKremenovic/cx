var path = require('path');

module.exports = function(options = {}) {

   var regex = /import (.*) from ["'](.*)["']/g;

   return {
      transform(source, filePath) {
         return source.replace(regex, function (content, match1, match2) {
            for (var name in options) {
               if (filePath.indexOf(name) != 0) {
                  var relativePath = path.resolve(path.dirname(filePath), match2);
                  if (relativePath.indexOf(name) == 0)
                     return `import ${match1} from "${options[name]}"`;
               }
            }
            return content;
         });
      }
   };
};
