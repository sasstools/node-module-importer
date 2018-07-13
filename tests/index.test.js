const sass = require('node-sass');
const importer = require('../');

const compile = function(data) {
  return new Promise((yeah, nah) => {
    return sass.render(
      { data, importer: importer },
      (err, results) => err ? nah(err) : yeah(results),
    );
  });
}

describe('node-module-importer', () => {
  it('should resolve Sass @import from npm packages', () => (
    compile('@import "foundation/scss/foundation.scss"')
      .then(results => expect(results.css.toString()).toMatchSnapshot())
  ));
  it('should resolve Sass @import without extension from npm packages', () => (
    compile('@import "foundation/scss/foundation.scss"')
      .then(results => expect(results.css.toString()).toMatchSnapshot())
  ));
  it('should resolve Sass @import for partials from npm packages', () => (
    compile('@import "foundation/scss/foundation/_variables.scss"')
      .then(results => expect(results.css.toString()).toMatchSnapshot())
  ));
  it('should resolve Sass @import for partials without extension from npm packages', () => (
    compile('@import "foundation/scss/foundation/_variables"')
      .then(results => expect(results.css.toString()).toMatchSnapshot())
  ));
  it('should resolve Sass @import for partials without underscore from npm packages', () => (
    compile('@import "foundation/scss/foundation/variables.scss"')
      .then(results => expect(results.css.toString()).toMatchSnapshot())
  ));
  it('should resolve Sass @import for partials without underscore and extension from npm packages', () => (
    compile('@import "foundation/scss/foundation/variables"')
      .then(results => expect(results.css.toString()).toMatchSnapshot())
  ));
});
