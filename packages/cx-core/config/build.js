var rollup = require('rollup'),
   path = require('path'),
   fs = require('fs'),
   babel = require('rollup-plugin-babel'),
   babelConfig = require('./babel.config'),
   importAlias = require('./importAlias');



function getPath(basePath) {
   return function (x) {
      if (!x)
         return basePath;
      return path.join(basePath, x);
   }
}

var src = getPath(path.join(__dirname, '../src'));
var dist = getPath(path.join(__dirname, '../dist'));

const endsWith = (x, y) => x.lastIndexOf(y) === x.length - y.length;

var entries = [{
   name: 'app.js',
   options: {
      entry: src('app/index.js')
   },
   output: {

   }
}, {
   name: 'util.js',
   options: {
      entry: src('util/index.js')
   },
   output: {

   }
}, {
   name: 'data.js',
   options: {
      entry: src('data/index-export.js')
   },
   output: {

   }
}, {
   name: 'forms.js',
   options: {
      entry: src('ui/form/index.js'),
   },
   output: {

   }
}];

entries.forEach(function(e) {
   var options = Object.assign({
      treeshake: false,
      external: function (id) {
         switch (id) {
            case 'intl-io':
               return true;

            default:
               return id[0] == '@'
         }
      },
      plugins: [
         importAlias({
            [src('./util/')]: '@/util.js',
            [src('./data/')]: '@/data.js',
            [src('./ui/')]: '@/ui.js',
            [src('./app/')]: '@/app.js',
            [src('./ui/form/')]: '@/forms.js',
            [src('./ui/grid/')]: '@/grid.js',
            [src('./ui/nav/')]: '@/nav.js',
         }),
         babel(babelConfig)
      ]
   }, e.options);
   rollup.rollup(options).then(function (bundle) {
      var result = bundle.generate(Object.assign({
         format: 'es'
      }, e.output));

      if (e.name) {
         fs.writeFileSync(dist(e.name), result.code.replace(/from '@\//g, "from './"));
      }
   });
});
