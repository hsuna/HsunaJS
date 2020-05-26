# HsunaJS

HsunaJS is a javascript interpreter, which can run JS code in JS.


## Install

```
git clone https://github.com/hsuna/HsunaJS.git
```

## Usage

```javascript
const acorn = require("acorn")
const HsunaJS = require("../lib/HsunaJS.common")

let code = `
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.SDK = factory());
}(this, (function () { 'use strict';
    return function(a, b, c) {
        return a + b + c;
    }
})));
`

let ast = acorn.parse(code)
console.log(ast)
HsunaJS.parse(ast, { this: global, define: { amd: undefined }, self: undefined })

const SDK = global.SDK
console.log(SDK(1, 2, 3))

```

## License

MIT