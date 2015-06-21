// - -------------------------------------------------------------------- - //
// - libs

var fs = require("fs");
var dom = require("../");
var assert = require("assert");

// - -------------------------------------------------------------------- - //
// - DOM

describe("DOM",function() {

  it("each",function() {
    var elm = dom("<div class=one><div class=two><div class=three><div></div></div></div></div>");
    var cls = [];
    elm.find("div").each(function() {
      cls.push(this.attr("class"));
    });
    assert.deepEqual(cls,["one","two","three",undefined]);
  });

  it("map",function() {
    var elm = dom("<div class=one><div class=two><div class=three><div></div></div></div></div>");
    var cls = elm.find("div").map(function() {
      return this.attr("class");
    });
    assert.deepEqual(cls,["one","two","three"]);
  });

  it("filter",function() {
    var elm = dom("<div class=one><div class=two><div class=three><div></div></div></div></div>");
    var len = elm.find("div").filter(function() {
      return this.attr("class") == "three";
    }).length;
    assert.equal(len,1);
  });

  it("scrape",function() {
    var html = fs.readFileSync(__dirname + "/sample.html");
    var elm = dom(html);
    var output = elm.scrape({
      "head > title": {
        title: "text",
      },
      "[id]": {
        ids: {
          "a[href][title]": {
            url: "attr:href",
            title: "attr:title"
          }
        }
      }
    });
    var sample = JSON.parse(fs.readFileSync(__dirname + "/sample.json","utf8"));
    assert.deepEqual(output,sample);
  });

});

// - -------------------------------------------------------------------- - //
