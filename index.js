var fs = require('fs');
var path = require('path');
var exts = ['.sass', '.scss'];

const exists = (file) => {
  try {
    fs.accessSync(file, fs.constants.F_OK);
    return true;
  } catch (e) {
    return false;
  }
}

const addPartialUnderscore = (file, ext) => {
  const basename = path.basename(file, ext);
  const partial = file.split(path.sep);
  partial.splice(-1, 1, '_' + basename + ext);
  return partial.join(path.sep);
}

const resolveImportPath = (file, ext) => {
  const basename = path.basename(file);
  const fullFile = file;
  const isPartial = basename[0] === '_';

  if (exists(file)) {
    return file;
  } else if (!isPartial) {
    const partial = addPartialUnderscore(file, ext);
    if (exists(partial)) return partial;
  }
  return '';
}

const end = (done) => (value) => {
  return done ? done(value) : value;
}

module.exports = function(url, prev, done) {
  done = end(done);
  if (!url) return done(null);

  const urlParts = url.split('/');
  const packageName = urlParts[0];
  const cwd = process.cwd();

  try {
    var packagePath = require.resolve(packageName, { paths: [cwd] });
  } catch (e) {
    return done(null);
  }

  const parts = packagePath.split(path.sep);

  for (let i = parts.length; i >= 0; i--) {
    if (parts[i] !== packageName || parts[i - 1] === packageName) continue;

    const before = parts.splice(0, i + 1);
    const after = urlParts.splice(1);
    const resolved = [...before, ...after].join(path.sep);
    const relative = path.relative(cwd, resolved);
    const ext = path.extname(relative);

    if (ext) {
      const importPath = resolveImportPath(relative, ext);
      if (importPath) return done({ file: importPath });
    } else {
      for (let j = 0; j < exts.length; j++) {
        const importPath = resolveImportPath(relative + exts[j], exts[j]);
        if (importPath) return done({ file: importPath });
      }
    }
    break;
  }

  return done(null);
};
