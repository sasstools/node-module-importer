const sass = require('node-sass');
const importer = require('../');

const foundation = sass.renderSync({
  file: 'node_modules/foundation/scss/foundation.scss',
}).css.toString();

const compile = function(data) {
  return new Promise((yeah, nah) => {
    return sass.render(
      { data, importer: importer },
      (err, results) => err ? nah(err) : yeah(results.css.toString()),
    );
  });
}

describe('node-module-importer', () => {
  describe('async', () => {
    it('should resolve Sass @import from npm packages', () => (
      compile('@import "foundation/scss/foundation.scss"')
        .then(result => expect(result === foundation).toBeTruthy())
    ));
    it('should resolve Sass @import without extension from npm packages', () => (
      compile('@import "foundation/scss/foundation.scss"')
        .then(result => expect(result === foundation).toBeTruthy())
    ));
    it('should resolve Sass @import for partials from npm packages', () => (
      compile('@import "foundation/scss/foundation/_variables.scss"')
    ));
    it('should resolve Sass @import for partials without extension from npm packages', () => (
      compile('@import "foundation/scss/foundation/_variables"')
    ));
    it('should resolve Sass @import for partials without underscore from npm packages', () => (
      compile('@import "foundation/scss/foundation/variables.scss"')
    ));
    it('should resolve Sass @import for partials without underscore and extension from npm packages', () => (
      compile('@import "foundation/scss/foundation/variables"')
    ));
  });
});
