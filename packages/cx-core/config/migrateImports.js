//Please backup (commit) files before running this tool

var fs = require('fs'),
   path = require('path'),
   globby = require('globby');


const files = [
   path.resolve(__dirname, '../../../litmus/**/*.js')
];

var replacements = {
   'cx/data/': 'cx/data',
   'cx/util/': 'cx/util',
   'cx/app/': 'cx/ui',
   'cx/ui/svg/': 'cx/charts',
   'cx/ui/form/': 'cx/widgets',
   'cx/ui/grid/': 'cx/widgets',
   'cx/ui/nav/': 'cx/widgets',
   'cx/ui/overlay/': 'cx/widgets',
   'cx/ui/Button': 'cx/widgets',
   'cx/ui/Container': 'cx/widgets',
   'cx/ui/Cx': 'cx/widgets',
   'cx/ui/CxCredit': 'cx/widgets',
   'cx/ui/DocumentTitle': 'cx/widgets',
   'cx/ui/HtmlElement': 'cx/widgets',
   'cx/ui/List': 'cx/widgets',
   'cx/ui/Sandbox': 'cx/widgets',
   'cx/ui/PureContainer': 'cx/widgets',
   'cx/ui/StaticText': 'cx/widgets',
   'cx/ui/Text': 'cx/widgets',
   'cx/ui/': 'cx/ui',
};

var importPattern = /import {(.*)} from ["'](cx.*)["']/g;
var group = true;
var test = false;


globby(files)
   .then(x => {
      x.forEach(f=> {
         console.log(' ');
         console.log(f);
         var contents = fs.readFileSync(f, { encoding: 'utf8' });
         //console.log(contents);
         var importPaths = {};
         var result = contents.replace(importPattern, (match, imports, path) => {
            for (var rep in replacements) {
               if (path.indexOf(rep) == 0) {
                  console.log(path, '=>', replacements[rep]);
                  if (group) {
                     let im = importPaths[replacements[rep]];
                     if (!im)
                        im = importPaths[replacements[rep]] = {};
                     imports.split(',').forEach(name=>{
                        im[name.trim()] = true
                     });
                     return '';
                  }
                  return `import ${imports} from '${replacements[rep]}'`;
               }
            }
            console.warn('Unmatched import: ', match);
            return match;
         });

         if (group) {
            var h = '';
            for (var path in importPaths) {
               h += `import \{ ${importPaths[path].join(', ')} \} from '${path}'`;
            }
            result = h + result;
         }

         if (!test && result != contents)
            fs.writeFileSync(f, result);
      })
   })
   .catch(e => {
      console.log(e);
   });
