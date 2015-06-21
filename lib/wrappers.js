/*!
**  bauer-dom -- Wrapper for Cheerio.
**  Copyright (c) 2014 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/node-bauer-dom>
*/
// - -------------------------------------------------------------------- - //

"use strict";

var cheerio = require("cheerio");
var factory = require("bauer-factory");

// - -------------------------------------------------------------------- - //

var map = cheerio.prototype.map;

cheerio.prototype.map = factory.createMethod({
  
  f: function(callback) {
    return map.call(this,function() {
      return callback.apply(cheerio(this),arguments);
    }).get();
  },
  
  _: function() {
      return map.apply(this,arguments).get();
  }
  
});

// - -------------------------------------------------------------------- - //

var each = cheerio.prototype.each;

cheerio.prototype.each = factory.createMethod({
  
  f: function(callback) {
    return each.call(this,function() {
      return callback.apply(cheerio(this),arguments);
    });
  },
  
  _: function() {
      return each.apply(this,arguments);
  }
  
});

// - -------------------------------------------------------------------- - //

var filter = cheerio.prototype.filter;

cheerio.prototype.filter = factory.createMethod({
  
  f: function(callback) {
    return filter.call(this,function() {
      return callback.apply(cheerio(this),arguments);
    });
  },
  
  _: function() {
      return filter.apply(this,arguments);
  }
  
});

// - -------------------------------------------------------------------- - //
