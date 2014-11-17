var nunjucks = require('nunjucks');
var path = require('path');

module.exports = function DefaultTemplateEngine(web, templatesPath) {
  var CustomFileSystemLoader = require('./filesystem.custom.js');
  //var env = nunjucks.configure(templatesPath, {autoescape: true, express: web.app});
  var env = new nunjucks.Environment(new CustomFileSystemLoader(templatesPath), {autoescape: true});
  env.express(web.app)

  //extend nunjucks
  require('./nunjucks.ext.js')(env);

  return env;
}

