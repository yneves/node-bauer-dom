/*!
**  bauer-dom -- Wrapper for Cheerio.
**  Copyright (c) 2014 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/node-bauer-dom>
*/
// - -------------------------------------------------------------------- - //

"use strict";

var cheerio = require("cheerio");

require("./wrappers.js");
require("./extensions.js");

// - -------------------------------------------------------------------- - //

module.exports = function(html) {
  return cheerio.load(html).root();
};

// - -------------------------------------------------------------------- - //
