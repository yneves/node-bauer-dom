# bauer-dom

Wrapper for [Cheerio](http://cheeriojs.github.io/cheerio/) that provides a simplified constructor and changes the context of callbacks to a `Cheerio` object instead of raw element.

## Installation

```
npm install bauer-dom
```

## Usage

```js
var dom = require("bauer-dom");

// extract all link urls in the document
var urls = dom("<html>...</html>")
  .find("a[href]")
  .map(function() {
    return this.attr("href");
  });
```

## License

[MIT](./LICENSE)
