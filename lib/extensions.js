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
var extend = require("lodash/object/extend");

// - -------------------------------------------------------------------- - //

factory.extendClass(cheerio,{
  
  values: {

    // .values(values Object) :Cheerio
    o: function(values) {
      for (var name in values) {
        this.find("[name='"+name+"']").each(function() {
          if (this.is("textarea")) {
            this.text(values[name]);
          } else if (this.is("select")) {
            this.find("option[value='"+values[name]+"']")
              .attr("selected","selected");
          } else {
            this.attr("value",values[name]);
          }
        })
      }
      return this;
    },

    // .values() :Object
    0: function() {
      var values = {};
      this.find("[name]"),each(function() {
        values[this.attr("name")] = this.val();
      });
      return values;
    },

  },

  scrape: {

    // .scrape(selectors Object) :Object
    o: function(selectors) {
      var data = {};
      Object.keys(selectors).forEach(function(selector) {
        extend(data,this.scrape(selector,selectors[selector]));
      }.bind(this));
      return data;
    },
    
    // .scrape(selector String, options Object) :Object
    so: function(selector,options) {
      var data = {};
      var elm = this.find(selector);
      if (elm.length) {
        Object.keys(options).forEach(function(key) {
          if (factory.isString(options[key])) {
            data[key] = elm.scrape(options[key]);
          } else {
            data[key] = elm.map(function() {
              return this.scrape(options[key]);
            }).filter(function(item) {
              return Object.keys(item).length;
            });
          }
        });
      }
      return data;
    },
    
    // .scrape(value String) :String
    s: function(value) {
      
      if (value === "text") {
        value = this.text().trim();
        
      } else if (value === "html") {
        value = this.html().trim();
        
      } else if (value === "val") {
        value = this.val();
      
      } else if (value.indexOf("attr:") === 0) {
        value = this.attr(value.substr(5));
      }
      
      return value;
    }

  }
  
});

// - -------------------------------------------------------------------- - //
