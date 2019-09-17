'use strict';

const moment = require('moment');
module.exports = function customiseNunjucks(nunjucksEnv) {
  nunjucksEnv.addFilter('date', function(date, format) {
    if (!date) {
      return null;
    }
    
    let s = moment(date).format(format);
    return s;
  });

  nunjucksEnv.addExtension('MarkedExtension', new MarkedExtension());
}

let marked = require('marked');

function MarkedExtension() {
  
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
  });

  this.tags = ['marked'];
  this.autoescape = false;
  this.parse = function(parser, nodes, lexer) {
      // get the tag token
      let tok = parser.nextToken();

      // parse the args and move after the block end. passing true
      // as the second arg is required if there are no parentheses
      //let args = parser.parseSignature(null, true);
      parser.advanceAfterBlockEnd(tok.value);
      let args = null;
      // parse the body and possibly the error block, which is optional
      let body = parser.parseUntilBlocks('endmarked');
     
      parser.advanceAfterBlockEnd();

      // See above for notes about CallExtension
      return new nodes.CallExtension(this, 'run', args, [body]);
  };

  this.run = function(context, body) {

      if (!body) {
        return "";
      }
      let ret = marked(body());

      return ret;
  };
}
