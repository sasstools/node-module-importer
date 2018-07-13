var fs = require('fs');
var path = require('path');
var exts = ['.sass', '.scss'];

function exists(file) {
  try {
    fs.accessSync(file, fs.constants.F_OK);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = function(url, prev, done) {
  if (!url) return done(null);

  var urlParts = url.split('/');
  var packageName = urlParts[0];
  var cwd = process.cwd();

  try {
    var packagePath = require.resolve(packageName, { paths: [cwd] });
  } catch (e) {
    return done(null);
  }

  if (!packagePath) return done(null);

  var parts = packagePath.split(path.sep);

  for (var i = parts.length; i >= 0; i--) {
    if (parts[i] !== packageName || parts[i - 1] === packageName) continue;

    var before = parts.splice(0, i + 1);
    var after = urlParts.splice(1);

    var resolved = [].concat(before, after).join(path.sep);
    var relative = path.relative(cwd, resolved);
    var ext = path.extname(relative);
    var basename = path.basename(relative, ext);

    if (ext) {
      if (basename[0] === '_') {
        if (exists(relative)) return done({ file: relative });
      } else {
        if (exists(relative)) return done({ file: relative });
        var partial = relative.split(path.sep);
        partial.splice(-1, 1, '_' + basename + ext);
        partial = partial.join(path.sep);
        if (exists(partial)) return done({ file: partial });
      }
    } else {
      for (var j = 0; j < exts.length; j++) {
        if (basename[0] === '_') {
          if (exists(relative + exts[j])) return done({ file: relative + exts[j] });
        } else {
          if (exists(relative + exts[j])) return done({ file: relative + exts[j] });
          var partial = relative.split(path.sep);
          partial.splice(-1, 1, '_' + basename);
          partial = partial.join(path.sep);
          if (exists(partial + exts[j])) return done({ file: partial + exts[j] });
        }
      }
    }
  }

  return done(null);
};
