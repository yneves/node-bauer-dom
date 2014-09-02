node-bauer-dom
===============

This is a simple wrapper for Cheerio [Cheerio](http://cheeriojs.github.io/cheerio/). It just provides a simplified constructor and changes the behavior of callbacks. As Cheerio tries to mimic jQuery's API,  `this` refers to the raw element instead of a Cheerio object. With `bauer-dom`, `this` refers to a Cheerio object.

## Installation

```
npm install bauer-dom
```

## Usage

```js
var dom = require("bauer-dom");

// extract all urls in the document
var urls = dom("<html>...</html>")
  .find("a[href]")
  .map(function() {
    return this.attr("href");
  });
```

## License

MIT
