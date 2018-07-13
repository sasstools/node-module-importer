[![Build Status](https://travis-ci.org/sasstools/node-module-importer.svg?branch=master)](https://travis-ci.org/sasstools/node-module-importer)

# node-module-importer

>Node Sass importer for npm packages

## Support

- Node >= 6
- node-sass >= 4.9.0

## Install

This package has a peer dependency on Node Sass for ensure import API compatibility.

```sh
npm install @node-sass/node-module-importer node-sass
```

## Usage

Install an npm package with the Sass files you want to import.
```js
npm install foundation
```

When Node Sass parses an `@import` in will try to match the first part of the URL with an installed npm package. The rest of the URL will be resolved relative to the where the package is installed.

```css
@import "foundation/scss/foundation.scss";
```

### Node Sass API

```js
var sass = require('node-sass');
var nodeModuleImport = require('@node-sass/node-module-importer');

sass.render({
  file: 'index.scss',
  importer: [nodeModuleImport],
}, function (err, result) {
  if (err) throw err;
  console.log(result.css.toString());
});
```

### Node Sass CLI

```sh
$ node-sass index.scss --importer node_modules/@node-sass/node-module-importer/index.js
```

## FAQ

### Why is this different from adding `node_modules` to `includePaths`?

npm can install packages in nested `node_modules` folders i.e. `node_modules/package_1/node_modules/package_2`.
