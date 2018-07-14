const path = require('path');
const sass = require('node-sass');
const importer = require('../');

const foundation = sass.renderSync({
  file: path.join('node_modules', 'foundation', 'scss', 'foundation.scss'),
}).css.toString();

const normalize = `@import url(${path.join('node_modules' ,'normalize.css' ,'normalize.css')});\n`;

const compile = function(data) {
  return new Promise((yeah, nah) => {
    return sass.render(
      { data, importer: importer },
      (err, results) => err ? nah(err) : yeah(results.css.toString()),
    );
  });
}

const compileSync = function(data) {
  return new Promise((yeah, nah) => {
    try {
      const results = sass.renderSync({ data, importer: importer });
      yeah(results.css.toString());
    } catch (err) {
      nah(err);
    }
  });
}

describe('node-module-importer', () => {
  [[ 'async', compile ], [ 'sync', compileSync ]].forEach(([ label, func ]) => {
    describe(label, () => {
      it('should resolve Sass @import from npm packages', () => (
        func(`@import "${path.join('foundation', 'scss', 'foundation.scss')}"`)
          .then(result => expect(result === foundation).toBeTruthy())
      ));
      it('should resolve Sass @import without extension from npm packages', () => (
        func(`@import "${path.join('foundation', 'scss', 'foundation.scss')}"`)
          .then(result => expect(result === foundation).toBeTruthy())
      ));
      it('should resolve Sass @import for partials from npm packages', () => (
        func(`@import "${path.join('foundation', 'scss', 'foundation', '_variables.scss')}"`)
      ));
      it('should resolve Sass @import for partials without extension from npm packages', () => (
        func(`@import "${path.join('foundation', 'scss', 'foundation', '_variables')}"`)
      ));
      it('should resolve Sass @import for partials without underscore from npm packages', () => (
        func(`@import "${path.join('foundation', 'scss', 'foundation', 'variables.scss')}"`)
      ));
      it('should resolve Sass @import for partials without underscore and extension from npm packages', () => (
        func(`@import "${path.join('foundation', 'scss', 'foundation', 'variables')}"`)
      ));
      it('should resolve Sass @import for npm packages that look like Sass files', () => (
        func(`@import "${path.join('normalize.css', 'normalize.css')}"`)
          .then(result => expect(result === normalize).toBeTruthy())
      ));
    });
  });
});
