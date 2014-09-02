// - -------------------------------------------------------------------- - //
// - libs

var lib = {
	fs: require("fs"),
	dom: require("../"),
};

var assert = require("assert");

// - -------------------------------------------------------------------- - //
// - DOM

describe("DOM",function() {

	it("each",function() {
		var dom = lib.dom("<div class=one><div class=two><div class=three><div></div></div></div></div>");
		var cls = [];
		dom.find("div").each(function() {
			cls.push(this.attr("class"));
		});
		assert.deepEqual(cls,["one","two","three",undefined]);
	});

	it("map",function() {
		var dom = lib.dom("<div class=one><div class=two><div class=three><div></div></div></div></div>");
		var cls = dom.find("div").map(function() {
			return this.attr("class");
		});
		assert.deepEqual(cls,["one","two","three"]);
	});

	it("filter",function() {
		var dom = lib.dom("<div class=one><div class=two><div class=three><div></div></div></div></div>");
		var len = dom.find("div").filter(function() {
			return this.attr("class") == "three";
		}).length;
		assert.equal(len,1);
	});

	it("scrape",function() {
		var html = lib.fs.readFileSync(__dirname + "/sample.html");
		var dom = lib.dom(html);
		var output = dom.scrape({
			"head > title": {
				name: "title",
				data: "text",
			},
			"[id]": {
				name: "ids",
				each: true,
				grep: true,
				data: {
					"p": {
						name: "paragraphs",
						each: true,
						grep: true,
						data: {
							"a[href]": {
								name: "urls",
								data: "href",
								each: true,
							}
						},
					},
				},
			},
		});
		var sample = JSON.parse(lib.fs.readFileSync(__dirname + "/sample.json","utf8"));
		assert.deepEqual(output,sample);
	});

});

// - -------------------------------------------------------------------- - //
