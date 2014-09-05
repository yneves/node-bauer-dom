/*!
**  bauer-dom -- Wrapper for Cheerio.
**  Copyright (c) 2014 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/node-bauer-dom>
*/
// - -------------------------------------------------------------------- - //
// - libs

var lib = {
	url: require("url"),
	cheerio: require("cheerio"),
	factory: require("bauer-factory"),
};

// - -------------------------------------------------------------------- - //
// - wraps callback methods

var map = lib.cheerio.prototype.map;
lib.cheerio.prototype.map = function(callback) {
	if (lib.factory.isFunction(callback)) {
		return map.call(this,function() {
			return callback.apply(lib.cheerio(this),arguments);
		}).get();
	} else {
		return map.apply(this,arguments);
	}
};

var each = lib.cheerio.prototype.each;
lib.cheerio.prototype.each = function(callback) {
	if (lib.factory.isFunction(callback)) {
		return each.call(this,function() {
			return callback.apply(lib.cheerio(this),arguments);
		});
	} else {
		return each.apply(this,arguments);
	}
};

var filter = lib.cheerio.prototype.filter;
lib.cheerio.prototype.filter = function(callback) {
	if (lib.factory.isFunction(callback)) {
		return filter.call(this,function() {
			return callback.apply(lib.cheerio(this),arguments);
		});
	} else {
		return filter.apply(this,arguments);
	}
};

// - -------------------------------------------------------------------- - //
// - add some features

lib.factory.extend(lib.cheerio,{

	values: {

		// .values(values)
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

		// .values()
		0: function() {
			var values = {};
			this.find("[name]"),each(function() {
				values[this.attr("name")] = this.val();
			});
			return values;
		},

	},

	scrape: {

		// .scrape(attr)
		s: function(attr) {
			if (attr === "text") {
				return this.text();
			} else if (attr === "html") {
				return this.html();
			} else if (attr === "url") {
				if (this.is("a, link")) {
					return this.attr("href");
				} else if (this.is("img, script, iframe")) {
					return this.attr("src");
				}
			} else {
				return this.attr(attr);
			}
		},

		// .scrape(selector,attr)
		ss: function(selector,attr) {
			return this.find(selector).scrape(attr);
		},

		// .scrape(order)
		o: "return this.scrape(o,{})",

		// .scrape(order,output)
		oo: function(order,output) {
			var keys = Object.keys(order);
			var len = keys.length;
			for (var i = 0; i < len; i++) {
				var key = keys[i];
				lib.factory.extend(output,this.scrape(key,order[key]));
			}
			return output;
		},

		// .scrape(selector,order)
		so: function(selector,order) {
			var output = {};
			var element = selector === "" ? this : this.find(selector);
			if (element.length > 0) {
				var name = order.name;
				var scraper = makeScraper(order);
				if (order.each) {
					var list = element.map(scraper);
					if (order.grep) {
						output[name] = list.filter(grep);
					} else {
						output[name] = list;
					}
				} else {
					var data = scraper.call(element);
					if (order.grep) {
						if (grep(data)) {
							output[name] = data;
						}
					} else {
						output[name] = data;
					}
				}
			}
			return output;
		},

	}

});

// - -------------------------------------------------------------------- - //

function makeScraper(order) {
	var data = order.data;
	var type = lib.factory.type(data);
	if (type === "string") {
		return function() {
			var ret = this.scrape(data);
			if (data === "url" && order.base) {
				return lib.url.resolve(order.base,ret);
			} else {
				return ret;
			}
		};

	} else if (type === "object") {
		var keys = Object.keys(data);
		var len = keys.length;
		return function() {
			var ret = {};
			for (var i = 0; i < len; i++) {
				var key = keys[i];
				lib.factory.extend(ret,this.scrape(key,data[key]));
			}
			return ret;
		};

	} else if (type === "array") {
		var len = data.length;
		return function() {
			var ret = {};
			for (var i = 0; i < len; i++) {
				lib.factory.extend(ret,this.scrape("",data[i]));
			}
			return ret;
		};

	}
}

function grep(item) {
	var type = lib.factory.type(item);
	if (type === "object") {
		if (Object.keys(item).length > 0) {
			return true;
		}
	} else if (type === "string") {
		if (item.length > 0) {
			return true;
		}
	} else if (type === "array") {
		if (item.length > 0) {
			return true;
		}
	}
}

// - -------------------------------------------------------------------- - //
// - exports

exports = function(html) { return lib.cheerio.load(html).root() };

exports.cls = {};
exports.cls.Cheerio = lib.cheerio;

module.exports = exports;

// - -------------------------------------------------------------------- - //
