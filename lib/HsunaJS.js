/*!
 * HsunaJS.js v1.0.0
 * (c) 2020-2020 Evan You
 * Released under the MIT License.
 */
;(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory())
    : typeof define === "function" && define.amd
    ? define(factory)
    : ((global = global || self), (global.HsunaJS = factory()))
})(this, function () {
  "use strict"

  var commonjsGlobal =
    typeof globalThis !== "undefined"
      ? globalThis
      : typeof window !== "undefined"
      ? window
      : typeof global !== "undefined"
      ? global
      : typeof self !== "undefined"
      ? self
      : {}

  function createCommonjsModule(fn, basedir, module) {
    return (
      (module = {
        path: basedir,
        exports: {},
        require: function (path, base) {
          return commonjsRequire(path, base === undefined || base === null ? module.path : base)
        },
      }),
      fn(module, module.exports),
      module.exports
    )
  }

  function commonjsRequire() {
    throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")
  }

  var check = function (it) {
    return it && it.Math == Math && it
  }

  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global_1 =
    // eslint-disable-next-line no-undef
    check(typeof globalThis == "object" && globalThis) ||
    check(typeof window == "object" && window) ||
    check(typeof self == "object" && self) ||
    check(typeof commonjsGlobal == "object" && commonjsGlobal) ||
    // eslint-disable-next-line no-new-func
    Function("return this")()

  var fails = function (exec) {
    try {
      return !!exec()
    } catch (error) {
      return true
    }
  }

  // Thank's IE8 for his funny defineProperty
  var descriptors = !fails(function () {
    return (
      Object.defineProperty({}, 1, {
        get: function () {
          return 7
        },
      })[1] != 7
    )
  })

  var nativePropertyIsEnumerable = {}.propertyIsEnumerable
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor

  // Nashorn ~ JDK8 bug
  var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1)

  // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
  var f = NASHORN_BUG
    ? function propertyIsEnumerable(V) {
        var descriptor = getOwnPropertyDescriptor(this, V)
        return !!descriptor && descriptor.enumerable
      }
    : nativePropertyIsEnumerable

  var objectPropertyIsEnumerable = {
    f: f,
  }

  var createPropertyDescriptor = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value,
    }
  }

  var toString = {}.toString

  var classofRaw = function (it) {
    return toString.call(it).slice(8, -1)
  }

  var split = "".split

  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  var indexedObject = fails(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins
    return !Object("z").propertyIsEnumerable(0)
  })
    ? function (it) {
        return classofRaw(it) == "String" ? split.call(it, "") : Object(it)
      }
    : Object

  // `RequireObjectCoercible` abstract operation
  // https://tc39.github.io/ecma262/#sec-requireobjectcoercible
  var requireObjectCoercible = function (it) {
    if (it == undefined) throw TypeError("Can't call method on " + it)
    return it
  }

  // toObject with fallback for non-array-like ES3 strings

  var toIndexedObject = function (it) {
    return indexedObject(requireObjectCoercible(it))
  }

  var isObject = function (it) {
    return typeof it === "object" ? it !== null : typeof it === "function"
  }

  // `ToPrimitive` abstract operation
  // https://tc39.github.io/ecma262/#sec-toprimitive
  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  var toPrimitive = function (input, PREFERRED_STRING) {
    if (!isObject(input)) return input
    var fn, val
    if (
      PREFERRED_STRING &&
      typeof (fn = input.toString) == "function" &&
      !isObject((val = fn.call(input)))
    )
      return val
    if (typeof (fn = input.valueOf) == "function" && !isObject((val = fn.call(input)))) return val
    if (
      !PREFERRED_STRING &&
      typeof (fn = input.toString) == "function" &&
      !isObject((val = fn.call(input)))
    )
      return val
    throw TypeError("Can't convert object to primitive value")
  }

  var hasOwnProperty = {}.hasOwnProperty

  var has = function (it, key) {
    return hasOwnProperty.call(it, key)
  }

  var document$1 = global_1.document
  // typeof document.createElement is 'object' in old IE
  var EXISTS = isObject(document$1) && isObject(document$1.createElement)

  var documentCreateElement = function (it) {
    return EXISTS ? document$1.createElement(it) : {}
  }

  // Thank's IE8 for his funny defineProperty
  var ie8DomDefine =
    !descriptors &&
    !fails(function () {
      return (
        Object.defineProperty(documentCreateElement("div"), "a", {
          get: function () {
            return 7
          },
        }).a != 7
      )
    })

  var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
  var f$1 = descriptors
    ? nativeGetOwnPropertyDescriptor
    : function getOwnPropertyDescriptor(O, P) {
        O = toIndexedObject(O)
        P = toPrimitive(P, true)
        if (ie8DomDefine)
          try {
            return nativeGetOwnPropertyDescriptor(O, P)
          } catch (error) {
            /* empty */
          }
        if (has(O, P))
          return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P])
      }

  var objectGetOwnPropertyDescriptor = {
    f: f$1,
  }

  var anObject = function (it) {
    if (!isObject(it)) {
      throw TypeError(String(it) + " is not an object")
    }
    return it
  }

  var nativeDefineProperty = Object.defineProperty

  // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty
  var f$2 = descriptors
    ? nativeDefineProperty
    : function defineProperty(O, P, Attributes) {
        anObject(O)
        P = toPrimitive(P, true)
        anObject(Attributes)
        if (ie8DomDefine)
          try {
            return nativeDefineProperty(O, P, Attributes)
          } catch (error) {
            /* empty */
          }
        if ("get" in Attributes || "set" in Attributes) throw TypeError("Accessors not supported")
        if ("value" in Attributes) O[P] = Attributes.value
        return O
      }

  var objectDefineProperty = {
    f: f$2,
  }

  var createNonEnumerableProperty = descriptors
    ? function (object, key, value) {
        return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value))
      }
    : function (object, key, value) {
        object[key] = value
        return object
      }

  var setGlobal = function (key, value) {
    try {
      createNonEnumerableProperty(global_1, key, value)
    } catch (error) {
      global_1[key] = value
    }
    return value
  }

  var SHARED = "__core-js_shared__"
  var store = global_1[SHARED] || setGlobal(SHARED, {})

  var sharedStore = store

  var functionToString = Function.toString

  // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
  if (typeof sharedStore.inspectSource != "function") {
    sharedStore.inspectSource = function (it) {
      return functionToString.call(it)
    }
  }

  var inspectSource = sharedStore.inspectSource

  var WeakMap = global_1.WeakMap

  var nativeWeakMap = typeof WeakMap === "function" && /native code/.test(inspectSource(WeakMap))

  var shared = createCommonjsModule(function (module) {
    ;(module.exports = function (key, value) {
      return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {})
    })("versions", []).push({
      version: "3.6.5",
      mode: "global",
      copyright: "© 2020 Denis Pushkarev (zloirock.ru)",
    })
  })

  var id = 0
  var postfix = Math.random()

  var uid = function (key) {
    return "Symbol(" + String(key === undefined ? "" : key) + ")_" + (++id + postfix).toString(36)
  }

  var keys = shared("keys")

  var sharedKey = function (key) {
    return keys[key] || (keys[key] = uid(key))
  }

  var hiddenKeys = {}

  var WeakMap$1 = global_1.WeakMap
  var set, get, has$1

  var enforce = function (it) {
    return has$1(it) ? get(it) : set(it, {})
  }

  var getterFor = function (TYPE) {
    return function (it) {
      var state
      if (!isObject(it) || (state = get(it)).type !== TYPE) {
        throw TypeError("Incompatible receiver, " + TYPE + " required")
      }
      return state
    }
  }

  if (nativeWeakMap) {
    var store$1 = new WeakMap$1()
    var wmget = store$1.get
    var wmhas = store$1.has
    var wmset = store$1.set
    set = function (it, metadata) {
      wmset.call(store$1, it, metadata)
      return metadata
    }
    get = function (it) {
      return wmget.call(store$1, it) || {}
    }
    has$1 = function (it) {
      return wmhas.call(store$1, it)
    }
  } else {
    var STATE = sharedKey("state")
    hiddenKeys[STATE] = true
    set = function (it, metadata) {
      createNonEnumerableProperty(it, STATE, metadata)
      return metadata
    }
    get = function (it) {
      return has(it, STATE) ? it[STATE] : {}
    }
    has$1 = function (it) {
      return has(it, STATE)
    }
  }

  var internalState = {
    set: set,
    get: get,
    has: has$1,
    enforce: enforce,
    getterFor: getterFor,
  }

  var redefine = createCommonjsModule(function (module) {
    var getInternalState = internalState.get
    var enforceInternalState = internalState.enforce
    var TEMPLATE = String(String).split("String")

    ;(module.exports = function (O, key, value, options) {
      var unsafe = options ? !!options.unsafe : false
      var simple = options ? !!options.enumerable : false
      var noTargetGet = options ? !!options.noTargetGet : false
      if (typeof value == "function") {
        if (typeof key == "string" && !has(value, "name"))
          createNonEnumerableProperty(value, "name", key)
        enforceInternalState(value).source = TEMPLATE.join(typeof key == "string" ? key : "")
      }
      if (O === global_1) {
        if (simple) O[key] = value
        else setGlobal(key, value)
        return
      } else if (!unsafe) {
        delete O[key]
      } else if (!noTargetGet && O[key]) {
        simple = true
      }
      if (simple) O[key] = value
      else createNonEnumerableProperty(O, key, value)
      // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
    })(Function.prototype, "toString", function toString() {
      return (typeof this == "function" && getInternalState(this).source) || inspectSource(this)
    })
  })

  var path = global_1

  var aFunction = function (variable) {
    return typeof variable == "function" ? variable : undefined
  }

  var getBuiltIn = function (namespace, method) {
    return arguments.length < 2
      ? aFunction(path[namespace]) || aFunction(global_1[namespace])
      : (path[namespace] && path[namespace][method]) ||
          (global_1[namespace] && global_1[namespace][method])
  }

  var ceil = Math.ceil
  var floor = Math.floor

  // `ToInteger` abstract operation
  // https://tc39.github.io/ecma262/#sec-tointeger
  var toInteger = function (argument) {
    return isNaN((argument = +argument)) ? 0 : (argument > 0 ? floor : ceil)(argument)
  }

  var min = Math.min

  // `ToLength` abstract operation
  // https://tc39.github.io/ecma262/#sec-tolength
  var toLength = function (argument) {
    return argument > 0 ? min(toInteger(argument), 0x1fffffffffffff) : 0 // 2 ** 53 - 1 == 9007199254740991
  }

  var max = Math.max
  var min$1 = Math.min

  // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
  var toAbsoluteIndex = function (index, length) {
    var integer = toInteger(index)
    return integer < 0 ? max(integer + length, 0) : min$1(integer, length)
  }

  // `Array.prototype.{ indexOf, includes }` methods implementation
  var createMethod = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject($this)
      var length = toLength(O.length)
      var index = toAbsoluteIndex(fromIndex, length)
      var value
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare
      if (IS_INCLUDES && el != el)
        while (length > index) {
          value = O[index++]
          // eslint-disable-next-line no-self-compare
          if (value != value) return true
          // Array#indexOf ignores holes, Array#includes - not
        }
      else
        for (; length > index; index++) {
          if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0
        }
      return !IS_INCLUDES && -1
    }
  }

  var arrayIncludes = {
    // `Array.prototype.includes` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.includes
    includes: createMethod(true),
    // `Array.prototype.indexOf` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod(false),
  }

  var indexOf = arrayIncludes.indexOf

  var objectKeysInternal = function (object, names) {
    var O = toIndexedObject(object)
    var i = 0
    var result = []
    var key
    for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key)
    // Don't enum bug & hidden keys
    while (names.length > i)
      if (has(O, (key = names[i++]))) {
        ~indexOf(result, key) || result.push(key)
      }
    return result
  }

  // IE8- don't enum bug keys
  var enumBugKeys = [
    "constructor",
    "hasOwnProperty",
    "isPrototypeOf",
    "propertyIsEnumerable",
    "toLocaleString",
    "toString",
    "valueOf",
  ]

  var hiddenKeys$1 = enumBugKeys.concat("length", "prototype")

  // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
  var f$3 =
    Object.getOwnPropertyNames ||
    function getOwnPropertyNames(O) {
      return objectKeysInternal(O, hiddenKeys$1)
    }

  var objectGetOwnPropertyNames = {
    f: f$3,
  }

  var f$4 = Object.getOwnPropertySymbols

  var objectGetOwnPropertySymbols = {
    f: f$4,
  }

  // all object keys, includes non-enumerable and symbols
  var ownKeys =
    getBuiltIn("Reflect", "ownKeys") ||
    function ownKeys(it) {
      var keys = objectGetOwnPropertyNames.f(anObject(it))
      var getOwnPropertySymbols = objectGetOwnPropertySymbols.f
      return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys
    }

  var copyConstructorProperties = function (target, source) {
    var keys = ownKeys(source)
    var defineProperty = objectDefineProperty.f
    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key))
    }
  }

  var replacement = /#|\.prototype\./

  var isForced = function (feature, detection) {
    var value = data[normalize(feature)]
    return value == POLYFILL
      ? true
      : value == NATIVE
      ? false
      : typeof detection == "function"
      ? fails(detection)
      : !!detection
  }

  var normalize = (isForced.normalize = function (string) {
    return String(string).replace(replacement, ".").toLowerCase()
  })

  var data = (isForced.data = {})
  var NATIVE = (isForced.NATIVE = "N")
  var POLYFILL = (isForced.POLYFILL = "P")

  var isForced_1 = isForced

  var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f

  /*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/
  var _export = function (options, source) {
    var TARGET = options.target
    var GLOBAL = options.global
    var STATIC = options.stat
    var FORCED, target, key, targetProperty, sourceProperty, descriptor
    if (GLOBAL) {
      target = global_1
    } else if (STATIC) {
      target = global_1[TARGET] || setGlobal(TARGET, {})
    } else {
      target = (global_1[TARGET] || {}).prototype
    }
    if (target)
      for (key in source) {
        sourceProperty = source[key]
        if (options.noTargetGet) {
          descriptor = getOwnPropertyDescriptor$1(target, key)
          targetProperty = descriptor && descriptor.value
        } else targetProperty = target[key]
        FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? "." : "#") + key, options.forced)
        // contained in target
        if (!FORCED && targetProperty !== undefined) {
          if (typeof sourceProperty === typeof targetProperty) continue
          copyConstructorProperties(sourceProperty, targetProperty)
        }
        // add a flag to not completely full polyfills
        if (options.sham || (targetProperty && targetProperty.sham)) {
          createNonEnumerableProperty(sourceProperty, "sham", true)
        }
        // extend global
        redefine(target, key, sourceProperty, options)
      }
  }

  var aFunction$1 = function (it) {
    if (typeof it != "function") {
      throw TypeError(String(it) + " is not a function")
    }
    return it
  }

  // optional / simple context binding
  var functionBindContext = function (fn, that, length) {
    aFunction$1(fn)
    if (that === undefined) return fn
    switch (length) {
      case 0:
        return function () {
          return fn.call(that)
        }
      case 1:
        return function (a) {
          return fn.call(that, a)
        }
      case 2:
        return function (a, b) {
          return fn.call(that, a, b)
        }
      case 3:
        return function (a, b, c) {
          return fn.call(that, a, b, c)
        }
    }
    return function (/* ...args */) {
      return fn.apply(that, arguments)
    }
  }

  // `ToObject` abstract operation
  // https://tc39.github.io/ecma262/#sec-toobject
  var toObject = function (argument) {
    return Object(requireObjectCoercible(argument))
  }

  // `IsArray` abstract operation
  // https://tc39.github.io/ecma262/#sec-isarray
  var isArray =
    Array.isArray ||
    function isArray(arg) {
      return classofRaw(arg) == "Array"
    }

  var nativeSymbol =
    !!Object.getOwnPropertySymbols &&
    !fails(function () {
      // Chrome 38 Symbol has incorrect toString conversion
      // eslint-disable-next-line no-undef
      return !String(Symbol())
    })

  var useSymbolAsUid =
    nativeSymbol &&
    // eslint-disable-next-line no-undef
    !Symbol.sham &&
    // eslint-disable-next-line no-undef
    typeof Symbol.iterator == "symbol"

  var WellKnownSymbolsStore = shared("wks")
  var Symbol$1 = global_1.Symbol
  var createWellKnownSymbol = useSymbolAsUid
    ? Symbol$1
    : (Symbol$1 && Symbol$1.withoutSetter) || uid

  var wellKnownSymbol = function (name) {
    if (!has(WellKnownSymbolsStore, name)) {
      if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name]
      else WellKnownSymbolsStore[name] = createWellKnownSymbol("Symbol." + name)
    }
    return WellKnownSymbolsStore[name]
  }

  var SPECIES = wellKnownSymbol("species")

  // `ArraySpeciesCreate` abstract operation
  // https://tc39.github.io/ecma262/#sec-arrayspeciescreate
  var arraySpeciesCreate = function (originalArray, length) {
    var C
    if (isArray(originalArray)) {
      C = originalArray.constructor
      // cross-realm fallback
      if (typeof C == "function" && (C === Array || isArray(C.prototype))) C = undefined
      else if (isObject(C)) {
        C = C[SPECIES]
        if (C === null) C = undefined
      }
    }
    return new (C === undefined ? Array : C)(length === 0 ? 0 : length)
  }

  var push = [].push

  // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
  var createMethod$1 = function (TYPE) {
    var IS_MAP = TYPE == 1
    var IS_FILTER = TYPE == 2
    var IS_SOME = TYPE == 3
    var IS_EVERY = TYPE == 4
    var IS_FIND_INDEX = TYPE == 6
    var NO_HOLES = TYPE == 5 || IS_FIND_INDEX
    return function ($this, callbackfn, that, specificCreate) {
      var O = toObject($this)
      var self = indexedObject(O)
      var boundFunction = functionBindContext(callbackfn, that, 3)
      var length = toLength(self.length)
      var index = 0
      var create = specificCreate || arraySpeciesCreate
      var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
      var value, result
      for (; length > index; index++)
        if (NO_HOLES || index in self) {
          value = self[index]
          result = boundFunction(value, index, O)
          if (TYPE) {
            if (IS_MAP) target[index] = result
            // map
            else if (result)
              switch (TYPE) {
                case 3:
                  return true // some
                case 5:
                  return value // find
                case 6:
                  return index // findIndex
                case 2:
                  push.call(target, value) // filter
              }
            else if (IS_EVERY) return false // every
          }
        }
      return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target
    }
  }

  var arrayIteration = {
    // `Array.prototype.forEach` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
    forEach: createMethod$1(0),
    // `Array.prototype.map` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.map
    map: createMethod$1(1),
    // `Array.prototype.filter` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.filter
    filter: createMethod$1(2),
    // `Array.prototype.some` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.some
    some: createMethod$1(3),
    // `Array.prototype.every` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.every
    every: createMethod$1(4),
    // `Array.prototype.find` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.find
    find: createMethod$1(5),
    // `Array.prototype.findIndex` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
    findIndex: createMethod$1(6),
  }

  var arrayMethodIsStrict = function (METHOD_NAME, argument) {
    var method = [][METHOD_NAME]
    return (
      !!method &&
      fails(function () {
        // eslint-disable-next-line no-useless-call,no-throw-literal
        method.call(
          null,
          argument ||
            function () {
              throw 1
            },
          1
        )
      })
    )
  }

  var defineProperty = Object.defineProperty
  var cache = {}

  var thrower = function (it) {
    throw it
  }

  var arrayMethodUsesToLength = function (METHOD_NAME, options) {
    if (has(cache, METHOD_NAME)) return cache[METHOD_NAME]
    if (!options) options = {}
    var method = [][METHOD_NAME]
    var ACCESSORS = has(options, "ACCESSORS") ? options.ACCESSORS : false
    var argument0 = has(options, 0) ? options[0] : thrower
    var argument1 = has(options, 1) ? options[1] : undefined

    return (cache[METHOD_NAME] =
      !!method &&
      !fails(function () {
        if (ACCESSORS && !descriptors) return true
        var O = { length: -1 }

        if (ACCESSORS) defineProperty(O, 1, { enumerable: true, get: thrower })
        else O[1] = 1

        method.call(O, argument0, argument1)
      }))
  }

  var $forEach = arrayIteration.forEach

  var STRICT_METHOD = arrayMethodIsStrict("forEach")
  var USES_TO_LENGTH = arrayMethodUsesToLength("forEach")

  // `Array.prototype.forEach` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  var arrayForEach =
    !STRICT_METHOD || !USES_TO_LENGTH
      ? function forEach(callbackfn /* , thisArg */) {
          return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined)
        }
      : [].forEach

  // `Array.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  _export(
    { target: "Array", proto: true, forced: [].forEach != arrayForEach },
    {
      forEach: arrayForEach,
    }
  )

  // `Object.keys` method
  // https://tc39.github.io/ecma262/#sec-object.keys
  var objectKeys =
    Object.keys ||
    function keys(O) {
      return objectKeysInternal(O, enumBugKeys)
    }

  var FAILS_ON_PRIMITIVES = fails(function () {
    objectKeys(1)
  })

  // `Object.keys` method
  // https://tc39.github.io/ecma262/#sec-object.keys
  _export(
    { target: "Object", stat: true, forced: FAILS_ON_PRIMITIVES },
    {
      keys: function keys(it) {
        return objectKeys(toObject(it))
      },
    }
  )

  // iterable DOM collections
  // flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
  var domIterables = {
    CSSRuleList: 0,
    CSSStyleDeclaration: 0,
    CSSValueList: 0,
    ClientRectList: 0,
    DOMRectList: 0,
    DOMStringList: 0,
    DOMTokenList: 1,
    DataTransferItemList: 0,
    FileList: 0,
    HTMLAllCollection: 0,
    HTMLCollection: 0,
    HTMLFormElement: 0,
    HTMLSelectElement: 0,
    MediaList: 0,
    MimeTypeArray: 0,
    NamedNodeMap: 0,
    NodeList: 1,
    PaintRequestList: 0,
    Plugin: 0,
    PluginArray: 0,
    SVGLengthList: 0,
    SVGNumberList: 0,
    SVGPathSegList: 0,
    SVGPointList: 0,
    SVGStringList: 0,
    SVGTransformList: 0,
    SourceBufferList: 0,
    StyleSheetList: 0,
    TextTrackCueList: 0,
    TextTrackList: 0,
    TouchList: 0,
  }

  for (var COLLECTION_NAME in domIterables) {
    var Collection = global_1[COLLECTION_NAME]
    var CollectionPrototype = Collection && Collection.prototype
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach)
      try {
        createNonEnumerableProperty(CollectionPrototype, "forEach", arrayForEach)
      } catch (error) {
        CollectionPrototype.forEach = arrayForEach
      }
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function")
    }
  }

  var classCallCheck = _classCallCheck

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i]
      descriptor.enumerable = descriptor.enumerable || false
      descriptor.configurable = true
      if ("value" in descriptor) descriptor.writable = true
      Object.defineProperty(target, descriptor.key, descriptor)
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps)
    if (staticProps) _defineProperties(Constructor, staticProps)
    return Constructor
  }

  var createClass = _createClass

  // `Object.defineProperties` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperties
  var objectDefineProperties = descriptors
    ? Object.defineProperties
    : function defineProperties(O, Properties) {
        anObject(O)
        var keys = objectKeys(Properties)
        var length = keys.length
        var index = 0
        var key
        while (length > index) objectDefineProperty.f(O, (key = keys[index++]), Properties[key])
        return O
      }

  var html = getBuiltIn("document", "documentElement")

  var GT = ">"
  var LT = "<"
  var PROTOTYPE = "prototype"
  var SCRIPT = "script"
  var IE_PROTO = sharedKey("IE_PROTO")

  var EmptyConstructor = function () {
    /* empty */
  }

  var scriptTag = function (content) {
    return LT + SCRIPT + GT + content + LT + "/" + SCRIPT + GT
  }

  // Create object with fake `null` prototype: use ActiveX Object with cleared prototype
  var NullProtoObjectViaActiveX = function (activeXDocument) {
    activeXDocument.write(scriptTag(""))
    activeXDocument.close()
    var temp = activeXDocument.parentWindow.Object
    activeXDocument = null // avoid memory leak
    return temp
  }

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var NullProtoObjectViaIFrame = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = documentCreateElement("iframe")
    var JS = "java" + SCRIPT + ":"
    var iframeDocument
    iframe.style.display = "none"
    html.appendChild(iframe)
    // https://github.com/zloirock/core-js/issues/475
    iframe.src = String(JS)
    iframeDocument = iframe.contentWindow.document
    iframeDocument.open()
    iframeDocument.write(scriptTag("document.F=Object"))
    iframeDocument.close()
    return iframeDocument.F
  }

  // Check for document.domain and active x support
  // No need to use active x approach when document.domain is not set
  // see https://github.com/es-shims/es5-shim/issues/150
  // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
  // avoid IE GC bug
  var activeXDocument
  var NullProtoObject = function () {
    try {
      /* global ActiveXObject */
      activeXDocument = document.domain && new ActiveXObject("htmlfile")
    } catch (error) {
      /* ignore */
    }
    NullProtoObject = activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument)
      : NullProtoObjectViaIFrame()
    var length = enumBugKeys.length
    while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]]
    return NullProtoObject()
  }

  hiddenKeys[IE_PROTO] = true

  // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create
  var objectCreate =
    Object.create ||
    function create(O, Properties) {
      var result
      if (O !== null) {
        EmptyConstructor[PROTOTYPE] = anObject(O)
        result = new EmptyConstructor()
        EmptyConstructor[PROTOTYPE] = null
        // add "__proto__" for Object.getPrototypeOf polyfill
        result[IE_PROTO] = O
      } else result = NullProtoObject()
      return Properties === undefined ? result : objectDefineProperties(result, Properties)
    }

  // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create
  _export(
    { target: "Object", stat: true, sham: !descriptors },
    {
      create: objectCreate,
    }
  )

  /**
   * 创建一个普通变量值
   *
   * @class
   * @param any value 值
   * @param string kind 变量定义符（var, let, const）
   * @method set 设置值
   * @method get 获取值
   */
  var SimpleValue = /*#__PURE__*/ (function () {
    function SimpleValue(value) {
      var kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ""

      classCallCheck(this, SimpleValue)

      this.value = value
      this.kind = kind
    }

    createClass(SimpleValue, [
      {
        key: "set",
        value: function set(value) {
          // 禁止重新对const类型变量赋值
          if (this.kind === "const") {
            throw new TypeError("Assignment to constant variable")
          } else {
            this.value = value
          }
        },
      },
      {
        key: "get",
        value: function get() {
          return this.value
        },
      },
    ])

    return SimpleValue
  })()
  /**
   * 创建一个类变量
   *
   * @class
   * @param any obj 类
   * @param prop any 属性
   * @method set 设置类的属性的值
   * @method get 获取类的属性的值
   */

  var MemberValue = /*#__PURE__*/ (function () {
    function MemberValue(obj, prop) {
      classCallCheck(this, MemberValue)

      this.obj = obj
      this.prop = prop
    }

    createClass(MemberValue, [
      {
        key: "set",
        value: function set(value) {
          this.obj[this.prop] = value
        },
      },
      {
        key: "get",
        value: function get() {
          return this.obj[this.prop]
        },
      },
    ])

    return MemberValue
  })()

  var nativeGetOwnPropertyNames = objectGetOwnPropertyNames.f

  var toString$1 = {}.toString

  var windowNames =
    typeof window == "object" && window && Object.getOwnPropertyNames
      ? Object.getOwnPropertyNames(window)
      : []

  var getWindowNames = function (it) {
    try {
      return nativeGetOwnPropertyNames(it)
    } catch (error) {
      return windowNames.slice()
    }
  }

  // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
  var f$5 = function getOwnPropertyNames(it) {
    return windowNames && toString$1.call(it) == "[object Window]"
      ? getWindowNames(it)
      : nativeGetOwnPropertyNames(toIndexedObject(it))
  }

  var objectGetOwnPropertyNamesExternal = {
    f: f$5,
  }

  var f$6 = wellKnownSymbol

  var wellKnownSymbolWrapped = {
    f: f$6,
  }

  var defineProperty$1 = objectDefineProperty.f

  var defineWellKnownSymbol = function (NAME) {
    var Symbol = path.Symbol || (path.Symbol = {})
    if (!has(Symbol, NAME))
      defineProperty$1(Symbol, NAME, {
        value: wellKnownSymbolWrapped.f(NAME),
      })
  }

  var defineProperty$2 = objectDefineProperty.f

  var TO_STRING_TAG = wellKnownSymbol("toStringTag")

  var setToStringTag = function (it, TAG, STATIC) {
    if (it && !has((it = STATIC ? it : it.prototype), TO_STRING_TAG)) {
      defineProperty$2(it, TO_STRING_TAG, { configurable: true, value: TAG })
    }
  }

  var $forEach$1 = arrayIteration.forEach

  var HIDDEN = sharedKey("hidden")
  var SYMBOL = "Symbol"
  var PROTOTYPE$1 = "prototype"
  var TO_PRIMITIVE = wellKnownSymbol("toPrimitive")
  var setInternalState = internalState.set
  var getInternalState = internalState.getterFor(SYMBOL)
  var ObjectPrototype = Object[PROTOTYPE$1]
  var $Symbol = global_1.Symbol
  var $stringify = getBuiltIn("JSON", "stringify")
  var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f
  var nativeDefineProperty$1 = objectDefineProperty.f
  var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f
  var nativePropertyIsEnumerable$1 = objectPropertyIsEnumerable.f
  var AllSymbols = shared("symbols")
  var ObjectPrototypeSymbols = shared("op-symbols")
  var StringToSymbolRegistry = shared("string-to-symbol-registry")
  var SymbolToStringRegistry = shared("symbol-to-string-registry")
  var WellKnownSymbolsStore$1 = shared("wks")
  var QObject = global_1.QObject
  // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
  var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild

  // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
  var setSymbolDescriptor =
    descriptors &&
    fails(function () {
      return (
        objectCreate(
          nativeDefineProperty$1({}, "a", {
            get: function () {
              return nativeDefineProperty$1(this, "a", { value: 7 }).a
            },
          })
        ).a != 7
      )
    })
      ? function (O, P, Attributes) {
          var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype, P)
          if (ObjectPrototypeDescriptor) delete ObjectPrototype[P]
          nativeDefineProperty$1(O, P, Attributes)
          if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
            nativeDefineProperty$1(ObjectPrototype, P, ObjectPrototypeDescriptor)
          }
        }
      : nativeDefineProperty$1

  var wrap = function (tag, description) {
    var symbol = (AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]))
    setInternalState(symbol, {
      type: SYMBOL,
      tag: tag,
      description: description,
    })
    if (!descriptors) symbol.description = description
    return symbol
  }

  var isSymbol = useSymbolAsUid
    ? function (it) {
        return typeof it == "symbol"
      }
    : function (it) {
        return Object(it) instanceof $Symbol
      }

  var $defineProperty = function defineProperty(O, P, Attributes) {
    if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes)
    anObject(O)
    var key = toPrimitive(P, true)
    anObject(Attributes)
    if (has(AllSymbols, key)) {
      if (!Attributes.enumerable) {
        if (!has(O, HIDDEN)) nativeDefineProperty$1(O, HIDDEN, createPropertyDescriptor(1, {}))
        O[HIDDEN][key] = true
      } else {
        if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false
        Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) })
      }
      return setSymbolDescriptor(O, key, Attributes)
    }
    return nativeDefineProperty$1(O, key, Attributes)
  }

  var $defineProperties = function defineProperties(O, Properties) {
    anObject(O)
    var properties = toIndexedObject(Properties)
    var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties))
    $forEach$1(keys, function (key) {
      if (!descriptors || $propertyIsEnumerable.call(properties, key))
        $defineProperty(O, key, properties[key])
    })
    return O
  }

  var $create = function create(O, Properties) {
    return Properties === undefined
      ? objectCreate(O)
      : $defineProperties(objectCreate(O), Properties)
  }

  var $propertyIsEnumerable = function propertyIsEnumerable(V) {
    var P = toPrimitive(V, true)
    var enumerable = nativePropertyIsEnumerable$1.call(this, P)
    if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P))
      return false
    return enumerable ||
      !has(this, P) ||
      !has(AllSymbols, P) ||
      (has(this, HIDDEN) && this[HIDDEN][P])
      ? enumerable
      : true
  }

  var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
    var it = toIndexedObject(O)
    var key = toPrimitive(P, true)
    if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return
    var descriptor = nativeGetOwnPropertyDescriptor$1(it, key)
    if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
      descriptor.enumerable = true
    }
    return descriptor
  }

  var $getOwnPropertyNames = function getOwnPropertyNames(O) {
    var names = nativeGetOwnPropertyNames$1(toIndexedObject(O))
    var result = []
    $forEach$1(names, function (key) {
      if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key)
    })
    return result
  }

  var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
    var IS_OBJECT_PROTOTYPE = O === ObjectPrototype
    var names = nativeGetOwnPropertyNames$1(
      IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O)
    )
    var result = []
    $forEach$1(names, function (key) {
      if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
        result.push(AllSymbols[key])
      }
    })
    return result
  }

  // `Symbol` constructor
  // https://tc39.github.io/ecma262/#sec-symbol-constructor
  if (!nativeSymbol) {
    $Symbol = function Symbol() {
      if (this instanceof $Symbol) throw TypeError("Symbol is not a constructor")
      var description =
        !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0])
      var tag = uid(description)
      var setter = function (value) {
        if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value)
        if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false
        setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value))
      }
      if (descriptors && USE_SETTER)
        setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter })
      return wrap(tag, description)
    }

    redefine($Symbol[PROTOTYPE$1], "toString", function toString() {
      return getInternalState(this).tag
    })

    redefine($Symbol, "withoutSetter", function (description) {
      return wrap(uid(description), description)
    })

    objectPropertyIsEnumerable.f = $propertyIsEnumerable
    objectDefineProperty.f = $defineProperty
    objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor
    objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames
    objectGetOwnPropertySymbols.f = $getOwnPropertySymbols

    wellKnownSymbolWrapped.f = function (name) {
      return wrap(wellKnownSymbol(name), name)
    }

    if (descriptors) {
      // https://github.com/tc39/proposal-Symbol-description
      nativeDefineProperty$1($Symbol[PROTOTYPE$1], "description", {
        configurable: true,
        get: function description() {
          return getInternalState(this).description
        },
      })
      {
        redefine(ObjectPrototype, "propertyIsEnumerable", $propertyIsEnumerable, { unsafe: true })
      }
    }
  }

  _export(
    { global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol },
    {
      Symbol: $Symbol,
    }
  )

  $forEach$1(objectKeys(WellKnownSymbolsStore$1), function (name) {
    defineWellKnownSymbol(name)
  })

  _export(
    { target: SYMBOL, stat: true, forced: !nativeSymbol },
    {
      // `Symbol.for` method
      // https://tc39.github.io/ecma262/#sec-symbol.for
      for: function (key) {
        var string = String(key)
        if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string]
        var symbol = $Symbol(string)
        StringToSymbolRegistry[string] = symbol
        SymbolToStringRegistry[symbol] = string
        return symbol
      },
      // `Symbol.keyFor` method
      // https://tc39.github.io/ecma262/#sec-symbol.keyfor
      keyFor: function keyFor(sym) {
        if (!isSymbol(sym)) throw TypeError(sym + " is not a symbol")
        if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym]
      },
      useSetter: function () {
        USE_SETTER = true
      },
      useSimple: function () {
        USE_SETTER = false
      },
    }
  )

  _export(
    { target: "Object", stat: true, forced: !nativeSymbol, sham: !descriptors },
    {
      // `Object.create` method
      // https://tc39.github.io/ecma262/#sec-object.create
      create: $create,
      // `Object.defineProperty` method
      // https://tc39.github.io/ecma262/#sec-object.defineproperty
      defineProperty: $defineProperty,
      // `Object.defineProperties` method
      // https://tc39.github.io/ecma262/#sec-object.defineproperties
      defineProperties: $defineProperties,
      // `Object.getOwnPropertyDescriptor` method
      // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
      getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
    }
  )

  _export(
    { target: "Object", stat: true, forced: !nativeSymbol },
    {
      // `Object.getOwnPropertyNames` method
      // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
      getOwnPropertyNames: $getOwnPropertyNames,
      // `Object.getOwnPropertySymbols` method
      // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
      getOwnPropertySymbols: $getOwnPropertySymbols,
    }
  )

  // Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
  // https://bugs.chromium.org/p/v8/issues/detail?id=3443
  _export(
    {
      target: "Object",
      stat: true,
      forced: fails(function () {
        objectGetOwnPropertySymbols.f(1)
      }),
    },
    {
      getOwnPropertySymbols: function getOwnPropertySymbols(it) {
        return objectGetOwnPropertySymbols.f(toObject(it))
      },
    }
  )

  // `JSON.stringify` method behavior with symbols
  // https://tc39.github.io/ecma262/#sec-json.stringify
  if ($stringify) {
    var FORCED_JSON_STRINGIFY =
      !nativeSymbol ||
      fails(function () {
        var symbol = $Symbol()
        // MS Edge converts symbol values to JSON as {}
        return (
          $stringify([symbol]) != "[null]" ||
          // WebKit converts symbol values to JSON as null
          $stringify({ a: symbol }) != "{}" ||
          // V8 throws on boxed symbols
          $stringify(Object(symbol)) != "{}"
        )
      })

    _export(
      { target: "JSON", stat: true, forced: FORCED_JSON_STRINGIFY },
      {
        // eslint-disable-next-line no-unused-vars
        stringify: function stringify(it, replacer, space) {
          var args = [it]
          var index = 1
          var $replacer
          while (arguments.length > index) args.push(arguments[index++])
          $replacer = replacer
          if ((!isObject(replacer) && it === undefined) || isSymbol(it)) return // IE8 returns string on undefined
          if (!isArray(replacer))
            replacer = function (key, value) {
              if (typeof $replacer == "function") value = $replacer.call(this, key, value)
              if (!isSymbol(value)) return value
            }
          args[1] = replacer
          return $stringify.apply(null, args)
        },
      }
    )
  }

  // `Symbol.prototype[@@toPrimitive]` method
  // https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
  if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE]) {
    createNonEnumerableProperty($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf)
  }
  // `Symbol.prototype[@@toStringTag]` property
  // https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
  setToStringTag($Symbol, SYMBOL)

  hiddenKeys[HIDDEN] = true

  var defineProperty$3 = objectDefineProperty.f

  var NativeSymbol = global_1.Symbol

  if (
    descriptors &&
    typeof NativeSymbol == "function" &&
    (!("description" in NativeSymbol.prototype) ||
      // Safari 12 bug
      NativeSymbol().description !== undefined)
  ) {
    var EmptyStringDescriptionStore = {}
    // wrap Symbol constructor for correct work with undefined description
    var SymbolWrapper = function Symbol() {
      var description =
        arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0])
      var result =
        this instanceof SymbolWrapper
          ? new NativeSymbol(description)
          : // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
          description === undefined
          ? NativeSymbol()
          : NativeSymbol(description)
      if (description === "") EmptyStringDescriptionStore[result] = true
      return result
    }
    copyConstructorProperties(SymbolWrapper, NativeSymbol)
    var symbolPrototype = (SymbolWrapper.prototype = NativeSymbol.prototype)
    symbolPrototype.constructor = SymbolWrapper

    var symbolToString = symbolPrototype.toString
    var native = String(NativeSymbol("test")) == "Symbol(test)"
    var regexp = /^Symbol\((.*)\)[^)]+$/
    defineProperty$3(symbolPrototype, "description", {
      configurable: true,
      get: function description() {
        var symbol = isObject(this) ? this.valueOf() : this
        var string = symbolToString.call(symbol)
        if (has(EmptyStringDescriptionStore, symbol)) return ""
        var desc = native ? string.slice(7, -1) : string.replace(regexp, "$1")
        return desc === "" ? undefined : desc
      },
    })

    _export(
      { global: true, forced: true },
      {
        Symbol: SymbolWrapper,
      }
    )
  }

  var UNSCOPABLES = wellKnownSymbol("unscopables")
  var ArrayPrototype = Array.prototype

  // Array.prototype[@@unscopables]
  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  if (ArrayPrototype[UNSCOPABLES] == undefined) {
    objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
      configurable: true,
      value: objectCreate(null),
    })
  }

  // add a key to Array.prototype[@@unscopables]
  var addToUnscopables = function (key) {
    ArrayPrototype[UNSCOPABLES][key] = true
  }

  var iterators = {}

  var correctPrototypeGetter = !fails(function () {
    function F() {
      /* empty */
    }
    F.prototype.constructor = null
    return Object.getPrototypeOf(new F()) !== F.prototype
  })

  var IE_PROTO$1 = sharedKey("IE_PROTO")
  var ObjectPrototype$1 = Object.prototype

  // `Object.getPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-object.getprototypeof
  var objectGetPrototypeOf = correctPrototypeGetter
    ? Object.getPrototypeOf
    : function (O) {
        O = toObject(O)
        if (has(O, IE_PROTO$1)) return O[IE_PROTO$1]
        if (typeof O.constructor == "function" && O instanceof O.constructor) {
          return O.constructor.prototype
        }
        return O instanceof Object ? ObjectPrototype$1 : null
      }

  var ITERATOR = wellKnownSymbol("iterator")
  var BUGGY_SAFARI_ITERATORS = false

  var returnThis = function () {
    return this
  }

  // `%IteratorPrototype%` object
  // https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
  var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator

  if ([].keys) {
    arrayIterator = [].keys()
    // Safari 8 has buggy iterators w/o `next`
    if (!("next" in arrayIterator)) BUGGY_SAFARI_ITERATORS = true
    else {
      PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator))
      if (PrototypeOfArrayIteratorPrototype !== Object.prototype)
        IteratorPrototype = PrototypeOfArrayIteratorPrototype
    }
  }

  if (IteratorPrototype == undefined) IteratorPrototype = {}

  // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
  if (!has(IteratorPrototype, ITERATOR)) {
    createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis)
  }

  var iteratorsCore = {
    IteratorPrototype: IteratorPrototype,
    BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS,
  }

  var IteratorPrototype$1 = iteratorsCore.IteratorPrototype

  var returnThis$1 = function () {
    return this
  }

  var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
    var TO_STRING_TAG = NAME + " Iterator"
    IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, {
      next: createPropertyDescriptor(1, next),
    })
    setToStringTag(IteratorConstructor, TO_STRING_TAG, false)
    iterators[TO_STRING_TAG] = returnThis$1
    return IteratorConstructor
  }

  var aPossiblePrototype = function (it) {
    if (!isObject(it) && it !== null) {
      throw TypeError("Can't set " + String(it) + " as a prototype")
    }
    return it
  }

  // `Object.setPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-object.setprototypeof
  // Works with __proto__ only. Old v8 can't work with null proto objects.
  /* eslint-disable no-proto */
  var objectSetPrototypeOf =
    Object.setPrototypeOf ||
    ("__proto__" in {}
      ? (function () {
          var CORRECT_SETTER = false
          var test = {}
          var setter
          try {
            setter = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set
            setter.call(test, [])
            CORRECT_SETTER = test instanceof Array
          } catch (error) {
            /* empty */
          }
          return function setPrototypeOf(O, proto) {
            anObject(O)
            aPossiblePrototype(proto)
            if (CORRECT_SETTER) setter.call(O, proto)
            else O.__proto__ = proto
            return O
          }
        })()
      : undefined)

  var IteratorPrototype$2 = iteratorsCore.IteratorPrototype
  var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS
  var ITERATOR$1 = wellKnownSymbol("iterator")
  var KEYS = "keys"
  var VALUES = "values"
  var ENTRIES = "entries"

  var returnThis$2 = function () {
    return this
  }

  var defineIterator = function (
    Iterable,
    NAME,
    IteratorConstructor,
    next,
    DEFAULT,
    IS_SET,
    FORCED
  ) {
    createIteratorConstructor(IteratorConstructor, NAME, next)

    var getIterationMethod = function (KIND) {
      if (KIND === DEFAULT && defaultIterator) return defaultIterator
      if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND]
      switch (KIND) {
        case KEYS:
          return function keys() {
            return new IteratorConstructor(this, KIND)
          }
        case VALUES:
          return function values() {
            return new IteratorConstructor(this, KIND)
          }
        case ENTRIES:
          return function entries() {
            return new IteratorConstructor(this, KIND)
          }
      }
      return function () {
        return new IteratorConstructor(this)
      }
    }

    var TO_STRING_TAG = NAME + " Iterator"
    var INCORRECT_VALUES_NAME = false
    var IterablePrototype = Iterable.prototype
    var nativeIterator =
      IterablePrototype[ITERATOR$1] ||
      IterablePrototype["@@iterator"] ||
      (DEFAULT && IterablePrototype[DEFAULT])
    var defaultIterator =
      (!BUGGY_SAFARI_ITERATORS$1 && nativeIterator) || getIterationMethod(DEFAULT)
    var anyNativeIterator =
      NAME == "Array" ? IterablePrototype.entries || nativeIterator : nativeIterator
    var CurrentIteratorPrototype, methods, KEY

    // fix native
    if (anyNativeIterator) {
      CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()))
      if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
        if (objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
          if (objectSetPrototypeOf) {
            objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2)
          } else if (typeof CurrentIteratorPrototype[ITERATOR$1] != "function") {
            createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$1, returnThis$2)
          }
        }
        // Set @@toStringTag to native iterators
        setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true)
      }
    }

    // fix Array#{values, @@iterator}.name in V8 / FF
    if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
      INCORRECT_VALUES_NAME = true
      defaultIterator = function values() {
        return nativeIterator.call(this)
      }
    }

    // define iterator
    if (IterablePrototype[ITERATOR$1] !== defaultIterator) {
      createNonEnumerableProperty(IterablePrototype, ITERATOR$1, defaultIterator)
    }
    iterators[NAME] = defaultIterator

    // export additional methods
    if (DEFAULT) {
      methods = {
        values: getIterationMethod(VALUES),
        keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
        entries: getIterationMethod(ENTRIES),
      }
      if (FORCED)
        for (KEY in methods) {
          if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
            redefine(IterablePrototype, KEY, methods[KEY])
          }
        }
      else
        _export(
          { target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME },
          methods
        )
    }

    return methods
  }

  var ARRAY_ITERATOR = "Array Iterator"
  var setInternalState$1 = internalState.set
  var getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR)

  // `Array.prototype.entries` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.entries
  // `Array.prototype.keys` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.keys
  // `Array.prototype.values` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.values
  // `Array.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
  // `CreateArrayIterator` internal method
  // https://tc39.github.io/ecma262/#sec-createarrayiterator
  var es_array_iterator = defineIterator(
    Array,
    "Array",
    function (iterated, kind) {
      setInternalState$1(this, {
        type: ARRAY_ITERATOR,
        target: toIndexedObject(iterated), // target
        index: 0, // next index
        kind: kind, // kind
      })
      // `%ArrayIteratorPrototype%.next` method
      // https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
    },
    function () {
      var state = getInternalState$1(this)
      var target = state.target
      var kind = state.kind
      var index = state.index++
      if (!target || index >= target.length) {
        state.target = undefined
        return { value: undefined, done: true }
      }
      if (kind == "keys") return { value: index, done: false }
      if (kind == "values") return { value: target[index], done: false }
      return { value: [index, target[index]], done: false }
    },
    "values"
  )

  // argumentsList[@@iterator] is %ArrayProto_values%
  // https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
  // https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
  iterators.Arguments = iterators.Array

  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables("keys")
  addToUnscopables("values")
  addToUnscopables("entries")

  var arrayBufferNative = typeof ArrayBuffer !== "undefined" && typeof DataView !== "undefined"

  var redefineAll = function (target, src, options) {
    for (var key in src) redefine(target, key, src[key], options)
    return target
  }

  var anInstance = function (it, Constructor, name) {
    if (!(it instanceof Constructor)) {
      throw TypeError("Incorrect " + (name ? name + " " : "") + "invocation")
    }
    return it
  }

  // `ToIndex` abstract operation
  // https://tc39.github.io/ecma262/#sec-toindex
  var toIndex = function (it) {
    if (it === undefined) return 0
    var number = toInteger(it)
    var length = toLength(number)
    if (number !== length) throw RangeError("Wrong length or index")
    return length
  }

  // IEEE754 conversions based on https://github.com/feross/ieee754
  // eslint-disable-next-line no-shadow-restricted-names
  var Infinity$1 = 1 / 0
  var abs = Math.abs
  var pow = Math.pow
  var floor$1 = Math.floor
  var log = Math.log
  var LN2 = Math.LN2

  var pack = function (number, mantissaLength, bytes) {
    var buffer = new Array(bytes)
    var exponentLength = bytes * 8 - mantissaLength - 1
    var eMax = (1 << exponentLength) - 1
    var eBias = eMax >> 1
    var rt = mantissaLength === 23 ? pow(2, -24) - pow(2, -77) : 0
    var sign = number < 0 || (number === 0 && 1 / number < 0) ? 1 : 0
    var index = 0
    var exponent, mantissa, c
    number = abs(number)
    // eslint-disable-next-line no-self-compare
    if (number != number || number === Infinity$1) {
      // eslint-disable-next-line no-self-compare
      mantissa = number != number ? 1 : 0
      exponent = eMax
    } else {
      exponent = floor$1(log(number) / LN2)
      if (number * (c = pow(2, -exponent)) < 1) {
        exponent--
        c *= 2
      }
      if (exponent + eBias >= 1) {
        number += rt / c
      } else {
        number += rt * pow(2, 1 - eBias)
      }
      if (number * c >= 2) {
        exponent++
        c /= 2
      }
      if (exponent + eBias >= eMax) {
        mantissa = 0
        exponent = eMax
      } else if (exponent + eBias >= 1) {
        mantissa = (number * c - 1) * pow(2, mantissaLength)
        exponent = exponent + eBias
      } else {
        mantissa = number * pow(2, eBias - 1) * pow(2, mantissaLength)
        exponent = 0
      }
    }
    for (
      ;
      mantissaLength >= 8;
      buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8
    );
    exponent = (exponent << mantissaLength) | mantissa
    exponentLength += mantissaLength
    for (
      ;
      exponentLength > 0;
      buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8
    );
    buffer[--index] |= sign * 128
    return buffer
  }

  var unpack = function (buffer, mantissaLength) {
    var bytes = buffer.length
    var exponentLength = bytes * 8 - mantissaLength - 1
    var eMax = (1 << exponentLength) - 1
    var eBias = eMax >> 1
    var nBits = exponentLength - 7
    var index = bytes - 1
    var sign = buffer[index--]
    var exponent = sign & 127
    var mantissa
    sign >>= 7
    for (; nBits > 0; exponent = exponent * 256 + buffer[index], index--, nBits -= 8);
    mantissa = exponent & ((1 << -nBits) - 1)
    exponent >>= -nBits
    nBits += mantissaLength
    for (; nBits > 0; mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8);
    if (exponent === 0) {
      exponent = 1 - eBias
    } else if (exponent === eMax) {
      return mantissa ? NaN : sign ? -Infinity$1 : Infinity$1
    } else {
      mantissa = mantissa + pow(2, mantissaLength)
      exponent = exponent - eBias
    }
    return (sign ? -1 : 1) * mantissa * pow(2, exponent - mantissaLength)
  }

  var ieee754 = {
    pack: pack,
    unpack: unpack,
  }

  // `Array.prototype.fill` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.fill
  var arrayFill = function fill(value /* , start = 0, end = @length */) {
    var O = toObject(this)
    var length = toLength(O.length)
    var argumentsLength = arguments.length
    var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length)
    var end = argumentsLength > 2 ? arguments[2] : undefined
    var endPos = end === undefined ? length : toAbsoluteIndex(end, length)
    while (endPos > index) O[index++] = value
    return O
  }

  var getOwnPropertyNames = objectGetOwnPropertyNames.f
  var defineProperty$4 = objectDefineProperty.f

  var getInternalState$2 = internalState.get
  var setInternalState$2 = internalState.set
  var ARRAY_BUFFER = "ArrayBuffer"
  var DATA_VIEW = "DataView"
  var PROTOTYPE$2 = "prototype"
  var WRONG_LENGTH = "Wrong length"
  var WRONG_INDEX = "Wrong index"
  var NativeArrayBuffer = global_1[ARRAY_BUFFER]
  var $ArrayBuffer = NativeArrayBuffer
  var $DataView = global_1[DATA_VIEW]
  var $DataViewPrototype = $DataView && $DataView[PROTOTYPE$2]
  var ObjectPrototype$2 = Object.prototype
  var RangeError$1 = global_1.RangeError

  var packIEEE754 = ieee754.pack
  var unpackIEEE754 = ieee754.unpack

  var packInt8 = function (number) {
    return [number & 0xff]
  }

  var packInt16 = function (number) {
    return [number & 0xff, (number >> 8) & 0xff]
  }

  var packInt32 = function (number) {
    return [number & 0xff, (number >> 8) & 0xff, (number >> 16) & 0xff, (number >> 24) & 0xff]
  }

  var unpackInt32 = function (buffer) {
    return (buffer[3] << 24) | (buffer[2] << 16) | (buffer[1] << 8) | buffer[0]
  }

  var packFloat32 = function (number) {
    return packIEEE754(number, 23, 4)
  }

  var packFloat64 = function (number) {
    return packIEEE754(number, 52, 8)
  }

  var addGetter = function (Constructor, key) {
    defineProperty$4(Constructor[PROTOTYPE$2], key, {
      get: function () {
        return getInternalState$2(this)[key]
      },
    })
  }

  var get$1 = function (view, count, index, isLittleEndian) {
    var intIndex = toIndex(index)
    var store = getInternalState$2(view)
    if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX)
    var bytes = getInternalState$2(store.buffer).bytes
    var start = intIndex + store.byteOffset
    var pack = bytes.slice(start, start + count)
    return isLittleEndian ? pack : pack.reverse()
  }

  var set$1 = function (view, count, index, conversion, value, isLittleEndian) {
    var intIndex = toIndex(index)
    var store = getInternalState$2(view)
    if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX)
    var bytes = getInternalState$2(store.buffer).bytes
    var start = intIndex + store.byteOffset
    var pack = conversion(+value)
    for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1]
  }

  if (!arrayBufferNative) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer, ARRAY_BUFFER)
      var byteLength = toIndex(length)
      setInternalState$2(this, {
        bytes: arrayFill.call(new Array(byteLength), 0),
        byteLength: byteLength,
      })
      if (!descriptors) this.byteLength = byteLength
    }

    $DataView = function DataView(buffer, byteOffset, byteLength) {
      anInstance(this, $DataView, DATA_VIEW)
      anInstance(buffer, $ArrayBuffer, DATA_VIEW)
      var bufferLength = getInternalState$2(buffer).byteLength
      var offset = toInteger(byteOffset)
      if (offset < 0 || offset > bufferLength) throw RangeError$1("Wrong offset")
      byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength)
      if (offset + byteLength > bufferLength) throw RangeError$1(WRONG_LENGTH)
      setInternalState$2(this, {
        buffer: buffer,
        byteLength: byteLength,
        byteOffset: offset,
      })
      if (!descriptors) {
        this.buffer = buffer
        this.byteLength = byteLength
        this.byteOffset = offset
      }
    }

    if (descriptors) {
      addGetter($ArrayBuffer, "byteLength")
      addGetter($DataView, "buffer")
      addGetter($DataView, "byteLength")
      addGetter($DataView, "byteOffset")
    }

    redefineAll($DataView[PROTOTYPE$2], {
      getInt8: function getInt8(byteOffset) {
        return (get$1(this, 1, byteOffset)[0] << 24) >> 24
      },
      getUint8: function getUint8(byteOffset) {
        return get$1(this, 1, byteOffset)[0]
      },
      getInt16: function getInt16(byteOffset /* , littleEndian */) {
        var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined)
        return (((bytes[1] << 8) | bytes[0]) << 16) >> 16
      },
      getUint16: function getUint16(byteOffset /* , littleEndian */) {
        var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined)
        return (bytes[1] << 8) | bytes[0]
      },
      getInt32: function getInt32(byteOffset /* , littleEndian */) {
        return unpackInt32(
          get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)
        )
      },
      getUint32: function getUint32(byteOffset /* , littleEndian */) {
        return (
          unpackInt32(
            get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)
          ) >>> 0
        )
      },
      getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
        return unpackIEEE754(
          get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined),
          23
        )
      },
      getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
        return unpackIEEE754(
          get$1(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined),
          52
        )
      },
      setInt8: function setInt8(byteOffset, value) {
        set$1(this, 1, byteOffset, packInt8, value)
      },
      setUint8: function setUint8(byteOffset, value) {
        set$1(this, 1, byteOffset, packInt8, value)
      },
      setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
        set$1(
          this,
          2,
          byteOffset,
          packInt16,
          value,
          arguments.length > 2 ? arguments[2] : undefined
        )
      },
      setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
        set$1(
          this,
          2,
          byteOffset,
          packInt16,
          value,
          arguments.length > 2 ? arguments[2] : undefined
        )
      },
      setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
        set$1(
          this,
          4,
          byteOffset,
          packInt32,
          value,
          arguments.length > 2 ? arguments[2] : undefined
        )
      },
      setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
        set$1(
          this,
          4,
          byteOffset,
          packInt32,
          value,
          arguments.length > 2 ? arguments[2] : undefined
        )
      },
      setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
        set$1(
          this,
          4,
          byteOffset,
          packFloat32,
          value,
          arguments.length > 2 ? arguments[2] : undefined
        )
      },
      setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
        set$1(
          this,
          8,
          byteOffset,
          packFloat64,
          value,
          arguments.length > 2 ? arguments[2] : undefined
        )
      },
    })
  } else {
    if (
      !fails(function () {
        NativeArrayBuffer(1)
      }) ||
      !fails(function () {
        new NativeArrayBuffer(-1) // eslint-disable-line no-new
      }) ||
      fails(function () {
        new NativeArrayBuffer() // eslint-disable-line no-new
        new NativeArrayBuffer(1.5) // eslint-disable-line no-new
        new NativeArrayBuffer(NaN) // eslint-disable-line no-new
        return NativeArrayBuffer.name != ARRAY_BUFFER
      })
    ) {
      $ArrayBuffer = function ArrayBuffer(length) {
        anInstance(this, $ArrayBuffer)
        return new NativeArrayBuffer(toIndex(length))
      }
      var ArrayBufferPrototype = ($ArrayBuffer[PROTOTYPE$2] = NativeArrayBuffer[PROTOTYPE$2])
      for (var keys$1 = getOwnPropertyNames(NativeArrayBuffer), j = 0, key; keys$1.length > j; ) {
        if (!((key = keys$1[j++]) in $ArrayBuffer)) {
          createNonEnumerableProperty($ArrayBuffer, key, NativeArrayBuffer[key])
        }
      }
      ArrayBufferPrototype.constructor = $ArrayBuffer
    }

    // WebKit bug - the same parent prototype for typed arrays and data view
    if (objectSetPrototypeOf && objectGetPrototypeOf($DataViewPrototype) !== ObjectPrototype$2) {
      objectSetPrototypeOf($DataViewPrototype, ObjectPrototype$2)
    }

    // iOS Safari 7.x bug
    var testView = new $DataView(new $ArrayBuffer(2))
    var nativeSetInt8 = $DataViewPrototype.setInt8
    testView.setInt8(0, 2147483648)
    testView.setInt8(1, 2147483649)
    if (testView.getInt8(0) || !testView.getInt8(1))
      redefineAll(
        $DataViewPrototype,
        {
          setInt8: function setInt8(byteOffset, value) {
            nativeSetInt8.call(this, byteOffset, (value << 24) >> 24)
          },
          setUint8: function setUint8(byteOffset, value) {
            nativeSetInt8.call(this, byteOffset, (value << 24) >> 24)
          },
        },
        { unsafe: true }
      )
  }

  setToStringTag($ArrayBuffer, ARRAY_BUFFER)
  setToStringTag($DataView, DATA_VIEW)

  var arrayBuffer = {
    ArrayBuffer: $ArrayBuffer,
    DataView: $DataView,
  }

  var SPECIES$1 = wellKnownSymbol("species")

  var setSpecies = function (CONSTRUCTOR_NAME) {
    var Constructor = getBuiltIn(CONSTRUCTOR_NAME)
    var defineProperty = objectDefineProperty.f

    if (descriptors && Constructor && !Constructor[SPECIES$1]) {
      defineProperty(Constructor, SPECIES$1, {
        configurable: true,
        get: function () {
          return this
        },
      })
    }
  }

  var ARRAY_BUFFER$1 = "ArrayBuffer"
  var ArrayBuffer$1 = arrayBuffer[ARRAY_BUFFER$1]
  var NativeArrayBuffer$1 = global_1[ARRAY_BUFFER$1]

  // `ArrayBuffer` constructor
  // https://tc39.github.io/ecma262/#sec-arraybuffer-constructor
  _export(
    { global: true, forced: NativeArrayBuffer$1 !== ArrayBuffer$1 },
    {
      ArrayBuffer: ArrayBuffer$1,
    }
  )

  setSpecies(ARRAY_BUFFER$1)

  var SPECIES$2 = wellKnownSymbol("species")

  // `SpeciesConstructor` abstract operation
  // https://tc39.github.io/ecma262/#sec-speciesconstructor
  var speciesConstructor = function (O, defaultConstructor) {
    var C = anObject(O).constructor
    var S
    return C === undefined || (S = anObject(C)[SPECIES$2]) == undefined
      ? defaultConstructor
      : aFunction$1(S)
  }

  var ArrayBuffer$2 = arrayBuffer.ArrayBuffer
  var DataView$1 = arrayBuffer.DataView
  var nativeArrayBufferSlice = ArrayBuffer$2.prototype.slice

  var INCORRECT_SLICE = fails(function () {
    return !new ArrayBuffer$2(2).slice(1, undefined).byteLength
  })

  // `ArrayBuffer.prototype.slice` method
  // https://tc39.github.io/ecma262/#sec-arraybuffer.prototype.slice
  _export(
    { target: "ArrayBuffer", proto: true, unsafe: true, forced: INCORRECT_SLICE },
    {
      slice: function slice(start, end) {
        if (nativeArrayBufferSlice !== undefined && end === undefined) {
          return nativeArrayBufferSlice.call(anObject(this), start) // FF fix
        }
        var length = anObject(this).byteLength
        var first = toAbsoluteIndex(start, length)
        var fin = toAbsoluteIndex(end === undefined ? length : end, length)
        var result = new (speciesConstructor(this, ArrayBuffer$2))(toLength(fin - first))
        var viewSource = new DataView$1(this)
        var viewTarget = new DataView$1(result)
        var index = 0
        while (first < fin) {
          viewTarget.setUint8(index++, viewSource.getUint8(first++))
        }
        return result
      },
    }
  )

  // `DataView` constructor
  // https://tc39.github.io/ecma262/#sec-dataview-constructor
  _export(
    { global: true, forced: !arrayBufferNative },
    {
      DataView: arrayBuffer.DataView,
    }
  )

  var DatePrototype = Date.prototype
  var INVALID_DATE = "Invalid Date"
  var TO_STRING = "toString"
  var nativeDateToString = DatePrototype[TO_STRING]
  var getTime = DatePrototype.getTime

  // `Date.prototype.toString` method
  // https://tc39.github.io/ecma262/#sec-date.prototype.tostring
  if (new Date(NaN) + "" != INVALID_DATE) {
    redefine(DatePrototype, TO_STRING, function toString() {
      var value = getTime.call(this)
      // eslint-disable-next-line no-self-compare
      return value === value ? nativeDateToString.call(this) : INVALID_DATE
    })
  }

  // makes subclassing work correct for wrapped built-ins
  var inheritIfRequired = function ($this, dummy, Wrapper) {
    var NewTarget, NewTargetPrototype
    if (
      // it can work only with native `setPrototypeOf`
      objectSetPrototypeOf &&
      // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
      typeof (NewTarget = dummy.constructor) == "function" &&
      NewTarget !== Wrapper &&
      isObject((NewTargetPrototype = NewTarget.prototype)) &&
      NewTargetPrototype !== Wrapper.prototype
    )
      objectSetPrototypeOf($this, NewTargetPrototype)
    return $this
  }

  // a string of all valid unicode whitespaces
  // eslint-disable-next-line max-len
  var whitespaces =
    "\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF"

  var whitespace = "[" + whitespaces + "]"
  var ltrim = RegExp("^" + whitespace + whitespace + "*")
  var rtrim = RegExp(whitespace + whitespace + "*$")

  // `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
  var createMethod$2 = function (TYPE) {
    return function ($this) {
      var string = String(requireObjectCoercible($this))
      if (TYPE & 1) string = string.replace(ltrim, "")
      if (TYPE & 2) string = string.replace(rtrim, "")
      return string
    }
  }

  var stringTrim = {
    // `String.prototype.{ trimLeft, trimStart }` methods
    // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
    start: createMethod$2(1),
    // `String.prototype.{ trimRight, trimEnd }` methods
    // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
    end: createMethod$2(2),
    // `String.prototype.trim` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.trim
    trim: createMethod$2(3),
  }

  var getOwnPropertyNames$1 = objectGetOwnPropertyNames.f
  var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f
  var defineProperty$5 = objectDefineProperty.f
  var trim = stringTrim.trim

  var NUMBER = "Number"
  var NativeNumber = global_1[NUMBER]
  var NumberPrototype = NativeNumber.prototype

  // Opera ~12 has broken Object#toString
  var BROKEN_CLASSOF = classofRaw(objectCreate(NumberPrototype)) == NUMBER

  // `ToNumber` abstract operation
  // https://tc39.github.io/ecma262/#sec-tonumber
  var toNumber = function (argument) {
    var it = toPrimitive(argument, false)
    var first, third, radix, maxCode, digits, length, index, code
    if (typeof it == "string" && it.length > 2) {
      it = trim(it)
      first = it.charCodeAt(0)
      if (first === 43 || first === 45) {
        third = it.charCodeAt(2)
        if (third === 88 || third === 120) return NaN // Number('+0x1') should be NaN, old V8 fix
      } else if (first === 48) {
        switch (it.charCodeAt(1)) {
          case 66:
          case 98:
            radix = 2
            maxCode = 49
            break // fast equal of /^0b[01]+$/i
          case 79:
          case 111:
            radix = 8
            maxCode = 55
            break // fast equal of /^0o[0-7]+$/i
          default:
            return +it
        }
        digits = it.slice(2)
        length = digits.length
        for (index = 0; index < length; index++) {
          code = digits.charCodeAt(index)
          // parseInt parses a string to a first unavailable symbol
          // but ToNumber should return NaN if a string contains unavailable symbols
          if (code < 48 || code > maxCode) return NaN
        }
        return parseInt(digits, radix)
      }
    }
    return +it
  }

  // `Number` constructor
  // https://tc39.github.io/ecma262/#sec-number-constructor
  if (isForced_1(NUMBER, !NativeNumber(" 0o1") || !NativeNumber("0b1") || NativeNumber("+0x1"))) {
    var NumberWrapper = function Number(value) {
      var it = arguments.length < 1 ? 0 : value
      var dummy = this
      return dummy instanceof NumberWrapper &&
        // check on 1..constructor(foo) case
        (BROKEN_CLASSOF
          ? fails(function () {
              NumberPrototype.valueOf.call(dummy)
            })
          : classofRaw(dummy) != NUMBER)
        ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper)
        : toNumber(it)
    }
    for (
      var keys$2 = descriptors
          ? getOwnPropertyNames$1(NativeNumber)
          : // ES3:
            (
              "MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY," +
              // ES2015 (in case, if modules with ES2015 Number statics required before):
              "EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER," +
              "MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger"
            ).split(","),
        j$1 = 0,
        key$1;
      keys$2.length > j$1;
      j$1++
    ) {
      if (has(NativeNumber, (key$1 = keys$2[j$1])) && !has(NumberWrapper, key$1)) {
        defineProperty$5(NumberWrapper, key$1, getOwnPropertyDescriptor$2(NativeNumber, key$1))
      }
    }
    NumberWrapper.prototype = NumberPrototype
    NumberPrototype.constructor = NumberWrapper
    redefine(global_1, NUMBER, NumberWrapper)
  }

  var TO_STRING_TAG$1 = wellKnownSymbol("toStringTag")
  var test = {}

  test[TO_STRING_TAG$1] = "z"

  var toStringTagSupport = String(test) === "[object z]"

  var TO_STRING_TAG$2 = wellKnownSymbol("toStringTag")
  // ES3 wrong here
  var CORRECT_ARGUMENTS =
    classofRaw(
      (function () {
        return arguments
      })()
    ) == "Arguments"

  // fallback for IE11 Script Access Denied error
  var tryGet = function (it, key) {
    try {
      return it[key]
    } catch (error) {
      /* empty */
    }
  }

  // getting tag from ES6+ `Object.prototype.toString`
  var classof = toStringTagSupport
    ? classofRaw
    : function (it) {
        var O, tag, result
        return it === undefined
          ? "Undefined"
          : it === null
          ? "Null"
          : // @@toStringTag case
          typeof (tag = tryGet((O = Object(it)), TO_STRING_TAG$2)) == "string"
          ? tag
          : // builtinTag case
          CORRECT_ARGUMENTS
          ? classofRaw(O)
          : // ES3 arguments fallback
          (result = classofRaw(O)) == "Object" && typeof O.callee == "function"
          ? "Arguments"
          : result
      }

  // `Object.prototype.toString` method implementation
  // https://tc39.github.io/ecma262/#sec-object.prototype.tostring
  var objectToString = toStringTagSupport
    ? {}.toString
    : function toString() {
        return "[object " + classof(this) + "]"
      }

  // `Object.prototype.toString` method
  // https://tc39.github.io/ecma262/#sec-object.prototype.tostring
  if (!toStringTagSupport) {
    redefine(Object.prototype, "toString", objectToString, { unsafe: true })
  }

  var trim$1 = stringTrim.trim

  var $parseFloat = global_1.parseFloat
  var FORCED = 1 / $parseFloat(whitespaces + "-0") !== -Infinity

  // `parseFloat` method
  // https://tc39.github.io/ecma262/#sec-parsefloat-string
  var numberParseFloat = FORCED
    ? function parseFloat(string) {
        var trimmedString = trim$1(String(string))
        var result = $parseFloat(trimmedString)
        return result === 0 && trimmedString.charAt(0) == "-" ? -0 : result
      }
    : $parseFloat

  // `parseFloat` method
  // https://tc39.github.io/ecma262/#sec-parsefloat-string
  _export(
    { global: true, forced: parseFloat != numberParseFloat },
    {
      parseFloat: numberParseFloat,
    }
  )

  var trim$2 = stringTrim.trim

  var $parseInt = global_1.parseInt
  var hex = /^[+-]?0[Xx]/
  var FORCED$1 = $parseInt(whitespaces + "08") !== 8 || $parseInt(whitespaces + "0x16") !== 22

  // `parseInt` method
  // https://tc39.github.io/ecma262/#sec-parseint-string-radix
  var numberParseInt = FORCED$1
    ? function parseInt(string, radix) {
        var S = trim$2(String(string))
        return $parseInt(S, radix >>> 0 || (hex.test(S) ? 16 : 10))
      }
    : $parseInt

  // `parseInt` method
  // https://tc39.github.io/ecma262/#sec-parseint-string-radix
  _export(
    { global: true, forced: parseInt != numberParseInt },
    {
      parseInt: numberParseInt,
    }
  )

  var MATCH = wellKnownSymbol("match")

  // `IsRegExp` abstract operation
  // https://tc39.github.io/ecma262/#sec-isregexp
  var isRegexp = function (it) {
    var isRegExp
    return (
      isObject(it) &&
      ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == "RegExp")
    )
  }

  // `RegExp.prototype.flags` getter implementation
  // https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
  var regexpFlags = function () {
    var that = anObject(this)
    var result = ""
    if (that.global) result += "g"
    if (that.ignoreCase) result += "i"
    if (that.multiline) result += "m"
    if (that.dotAll) result += "s"
    if (that.unicode) result += "u"
    if (that.sticky) result += "y"
    return result
  }

  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
  // so we use an intermediate function.
  function RE(s, f) {
    return RegExp(s, f)
  }

  var UNSUPPORTED_Y = fails(function () {
    // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
    var re = RE("a", "y")
    re.lastIndex = 2
    return re.exec("abcd") != null
  })

  var BROKEN_CARET = fails(function () {
    // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
    var re = RE("^r", "gy")
    re.lastIndex = 2
    return re.exec("str") != null
  })

  var regexpStickyHelpers = {
    UNSUPPORTED_Y: UNSUPPORTED_Y,
    BROKEN_CARET: BROKEN_CARET,
  }

  var defineProperty$6 = objectDefineProperty.f
  var getOwnPropertyNames$2 = objectGetOwnPropertyNames.f

  var setInternalState$3 = internalState.set

  var MATCH$1 = wellKnownSymbol("match")
  var NativeRegExp = global_1.RegExp
  var RegExpPrototype = NativeRegExp.prototype
  var re1 = /a/g
  var re2 = /a/g

  // "new" should create a new object, old webkit bug
  var CORRECT_NEW = new NativeRegExp(re1) !== re1

  var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y

  var FORCED$2 =
    descriptors &&
    isForced_1(
      "RegExp",
      !CORRECT_NEW ||
        UNSUPPORTED_Y$1 ||
        fails(function () {
          re2[MATCH$1] = false
          // RegExp constructor can alter flags and IsRegExp works correct with @@match
          return (
            NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, "i") != "/a/i"
          )
        })
    )

  // `RegExp` constructor
  // https://tc39.github.io/ecma262/#sec-regexp-constructor
  if (FORCED$2) {
    var RegExpWrapper = function RegExp(pattern, flags) {
      var thisIsRegExp = this instanceof RegExpWrapper
      var patternIsRegExp = isRegexp(pattern)
      var flagsAreUndefined = flags === undefined
      var sticky

      if (
        !thisIsRegExp &&
        patternIsRegExp &&
        pattern.constructor === RegExpWrapper &&
        flagsAreUndefined
      ) {
        return pattern
      }

      if (CORRECT_NEW) {
        if (patternIsRegExp && !flagsAreUndefined) pattern = pattern.source
      } else if (pattern instanceof RegExpWrapper) {
        if (flagsAreUndefined) flags = regexpFlags.call(pattern)
        pattern = pattern.source
      }

      if (UNSUPPORTED_Y$1) {
        sticky = !!flags && flags.indexOf("y") > -1
        if (sticky) flags = flags.replace(/y/g, "")
      }

      var result = inheritIfRequired(
        CORRECT_NEW ? new NativeRegExp(pattern, flags) : NativeRegExp(pattern, flags),
        thisIsRegExp ? this : RegExpPrototype,
        RegExpWrapper
      )

      if (UNSUPPORTED_Y$1 && sticky) setInternalState$3(result, { sticky: sticky })

      return result
    }
    var proxy = function (key) {
      key in RegExpWrapper ||
        defineProperty$6(RegExpWrapper, key, {
          configurable: true,
          get: function () {
            return NativeRegExp[key]
          },
          set: function (it) {
            NativeRegExp[key] = it
          },
        })
    }
    var keys$3 = getOwnPropertyNames$2(NativeRegExp)
    var index = 0
    while (keys$3.length > index) proxy(keys$3[index++])
    RegExpPrototype.constructor = RegExpWrapper
    RegExpWrapper.prototype = RegExpPrototype
    redefine(global_1, "RegExp", RegExpWrapper)
  }

  // https://tc39.github.io/ecma262/#sec-get-regexp-@@species
  setSpecies("RegExp")

  var nativeExec = RegExp.prototype.exec
  // This always refers to the native implementation, because the
  // String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
  // which loads this file before patching the method.
  var nativeReplace = String.prototype.replace

  var patchedExec = nativeExec

  var UPDATES_LAST_INDEX_WRONG = (function () {
    var re1 = /a/
    var re2 = /b*/g
    nativeExec.call(re1, "a")
    nativeExec.call(re2, "a")
    return re1.lastIndex !== 0 || re2.lastIndex !== 0
  })()

  var UNSUPPORTED_Y$2 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET

  // nonparticipating capturing group, copied from es5-shim's String#split patch.
  var NPCG_INCLUDED = /()??/.exec("")[1] !== undefined

  var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$2

  if (PATCH) {
    patchedExec = function exec(str) {
      var re = this
      var lastIndex, reCopy, match, i
      var sticky = UNSUPPORTED_Y$2 && re.sticky
      var flags = regexpFlags.call(re)
      var source = re.source
      var charsAdded = 0
      var strCopy = str

      if (sticky) {
        flags = flags.replace("y", "")
        if (flags.indexOf("g") === -1) {
          flags += "g"
        }

        strCopy = String(str).slice(re.lastIndex)
        // Support anchored sticky behavior.
        if (
          re.lastIndex > 0 &&
          (!re.multiline || (re.multiline && str[re.lastIndex - 1] !== "\n"))
        ) {
          source = "(?: " + source + ")"
          strCopy = " " + strCopy
          charsAdded++
        }
        // ^(? + rx + ) is needed, in combination with some str slicing, to
        // simulate the 'y' flag.
        reCopy = new RegExp("^(?:" + source + ")", flags)
      }

      if (NPCG_INCLUDED) {
        reCopy = new RegExp("^" + source + "$(?!\\s)", flags)
      }
      if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex

      match = nativeExec.call(sticky ? reCopy : re, strCopy)

      if (sticky) {
        if (match) {
          match.input = match.input.slice(charsAdded)
          match[0] = match[0].slice(charsAdded)
          match.index = re.lastIndex
          re.lastIndex += match[0].length
        } else re.lastIndex = 0
      } else if (UPDATES_LAST_INDEX_WRONG && match) {
        re.lastIndex = re.global ? match.index + match[0].length : lastIndex
      }
      if (NPCG_INCLUDED && match && match.length > 1) {
        // Fix browsers whose `exec` methods don't consistently return `undefined`
        // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
        nativeReplace.call(match[0], reCopy, function () {
          for (i = 1; i < arguments.length - 2; i++) {
            if (arguments[i] === undefined) match[i] = undefined
          }
        })
      }

      return match
    }
  }

  var regexpExec = patchedExec

  _export(
    { target: "RegExp", proto: true, forced: /./.exec !== regexpExec },
    {
      exec: regexpExec,
    }
  )

  var TO_STRING$1 = "toString"
  var RegExpPrototype$1 = RegExp.prototype
  var nativeToString = RegExpPrototype$1[TO_STRING$1]

  var NOT_GENERIC = fails(function () {
    return nativeToString.call({ source: "a", flags: "b" }) != "/a/b"
  })
  // FF44- RegExp#toString has a wrong name
  var INCORRECT_NAME = nativeToString.name != TO_STRING$1

  // `RegExp.prototype.toString` method
  // https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
  if (NOT_GENERIC || INCORRECT_NAME) {
    redefine(
      RegExp.prototype,
      TO_STRING$1,
      function toString() {
        var R = anObject(this)
        var p = String(R.source)
        var rf = R.flags
        var f = String(
          rf === undefined && R instanceof RegExp && !("flags" in RegExpPrototype$1)
            ? regexpFlags.call(R)
            : rf
        )
        return "/" + p + "/" + f
      },
      { unsafe: true }
    )
  }

  var ITERATOR$2 = wellKnownSymbol("iterator")
  var SAFE_CLOSING = false

  try {
    var called = 0
    var iteratorWithReturn = {
      next: function () {
        return { done: !!called++ }
      },
      return: function () {
        SAFE_CLOSING = true
      },
    }
    iteratorWithReturn[ITERATOR$2] = function () {
      return this
    }
    // eslint-disable-next-line no-throw-literal
    Array.from(iteratorWithReturn, function () {
      throw 2
    })
  } catch (error) {
    /* empty */
  }

  var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
    if (!SKIP_CLOSING && !SAFE_CLOSING) return false
    var ITERATION_SUPPORT = false
    try {
      var object = {}
      object[ITERATOR$2] = function () {
        return {
          next: function () {
            return { done: (ITERATION_SUPPORT = true) }
          },
        }
      }
      exec(object)
    } catch (error) {
      /* empty */
    }
    return ITERATION_SUPPORT
  }

  var defineProperty$7 = objectDefineProperty.f

  var Int8Array$1 = global_1.Int8Array
  var Int8ArrayPrototype = Int8Array$1 && Int8Array$1.prototype
  var Uint8ClampedArray$1 = global_1.Uint8ClampedArray
  var Uint8ClampedArrayPrototype = Uint8ClampedArray$1 && Uint8ClampedArray$1.prototype
  var TypedArray = Int8Array$1 && objectGetPrototypeOf(Int8Array$1)
  var TypedArrayPrototype = Int8ArrayPrototype && objectGetPrototypeOf(Int8ArrayPrototype)
  var ObjectPrototype$3 = Object.prototype
  var isPrototypeOf = ObjectPrototype$3.isPrototypeOf

  var TO_STRING_TAG$3 = wellKnownSymbol("toStringTag")
  var TYPED_ARRAY_TAG = uid("TYPED_ARRAY_TAG")
  // Fixing native typed arrays in Opera Presto crashes the browser, see #595
  var NATIVE_ARRAY_BUFFER_VIEWS =
    arrayBufferNative && !!objectSetPrototypeOf && classof(global_1.opera) !== "Opera"
  var TYPED_ARRAY_TAG_REQIRED = false
  var NAME

  var TypedArrayConstructorsList = {
    Int8Array: 1,
    Uint8Array: 1,
    Uint8ClampedArray: 1,
    Int16Array: 2,
    Uint16Array: 2,
    Int32Array: 4,
    Uint32Array: 4,
    Float32Array: 4,
    Float64Array: 8,
  }

  var isView = function isView(it) {
    var klass = classof(it)
    return klass === "DataView" || has(TypedArrayConstructorsList, klass)
  }

  var isTypedArray = function (it) {
    return isObject(it) && has(TypedArrayConstructorsList, classof(it))
  }

  var aTypedArray = function (it) {
    if (isTypedArray(it)) return it
    throw TypeError("Target is not a typed array")
  }

  var aTypedArrayConstructor = function (C) {
    if (objectSetPrototypeOf) {
      if (isPrototypeOf.call(TypedArray, C)) return C
    } else
      for (var ARRAY in TypedArrayConstructorsList)
        if (has(TypedArrayConstructorsList, NAME)) {
          var TypedArrayConstructor = global_1[ARRAY]
          if (
            TypedArrayConstructor &&
            (C === TypedArrayConstructor || isPrototypeOf.call(TypedArrayConstructor, C))
          ) {
            return C
          }
        }
    throw TypeError("Target is not a typed array constructor")
  }

  var exportTypedArrayMethod = function (KEY, property, forced) {
    if (!descriptors) return
    if (forced)
      for (var ARRAY in TypedArrayConstructorsList) {
        var TypedArrayConstructor = global_1[ARRAY]
        if (TypedArrayConstructor && has(TypedArrayConstructor.prototype, KEY)) {
          delete TypedArrayConstructor.prototype[KEY]
        }
      }
    if (!TypedArrayPrototype[KEY] || forced) {
      redefine(
        TypedArrayPrototype,
        KEY,
        forced ? property : (NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY]) || property
      )
    }
  }

  var exportTypedArrayStaticMethod = function (KEY, property, forced) {
    var ARRAY, TypedArrayConstructor
    if (!descriptors) return
    if (objectSetPrototypeOf) {
      if (forced)
        for (ARRAY in TypedArrayConstructorsList) {
          TypedArrayConstructor = global_1[ARRAY]
          if (TypedArrayConstructor && has(TypedArrayConstructor, KEY)) {
            delete TypedArrayConstructor[KEY]
          }
        }
      if (!TypedArray[KEY] || forced) {
        // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
        try {
          return redefine(
            TypedArray,
            KEY,
            forced ? property : (NATIVE_ARRAY_BUFFER_VIEWS && Int8Array$1[KEY]) || property
          )
        } catch (error) {
          /* empty */
        }
      } else return
    }
    for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global_1[ARRAY]
      if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
        redefine(TypedArrayConstructor, KEY, property)
      }
    }
  }

  for (NAME in TypedArrayConstructorsList) {
    if (!global_1[NAME]) NATIVE_ARRAY_BUFFER_VIEWS = false
  }

  // WebKit bug - typed arrays constructors prototype is Object.prototype
  if (
    !NATIVE_ARRAY_BUFFER_VIEWS ||
    typeof TypedArray != "function" ||
    TypedArray === Function.prototype
  ) {
    // eslint-disable-next-line no-shadow
    TypedArray = function TypedArray() {
      throw TypeError("Incorrect invocation")
    }
    if (NATIVE_ARRAY_BUFFER_VIEWS)
      for (NAME in TypedArrayConstructorsList) {
        if (global_1[NAME]) objectSetPrototypeOf(global_1[NAME], TypedArray)
      }
  }

  if (
    !NATIVE_ARRAY_BUFFER_VIEWS ||
    !TypedArrayPrototype ||
    TypedArrayPrototype === ObjectPrototype$3
  ) {
    TypedArrayPrototype = TypedArray.prototype
    if (NATIVE_ARRAY_BUFFER_VIEWS)
      for (NAME in TypedArrayConstructorsList) {
        if (global_1[NAME]) objectSetPrototypeOf(global_1[NAME].prototype, TypedArrayPrototype)
      }
  }

  // WebKit bug - one more object in Uint8ClampedArray prototype chain
  if (
    NATIVE_ARRAY_BUFFER_VIEWS &&
    objectGetPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype
  ) {
    objectSetPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype)
  }

  if (descriptors && !has(TypedArrayPrototype, TO_STRING_TAG$3)) {
    TYPED_ARRAY_TAG_REQIRED = true
    defineProperty$7(TypedArrayPrototype, TO_STRING_TAG$3, {
      get: function () {
        return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined
      },
    })
    for (NAME in TypedArrayConstructorsList)
      if (global_1[NAME]) {
        createNonEnumerableProperty(global_1[NAME], TYPED_ARRAY_TAG, NAME)
      }
  }

  var arrayBufferViewCore = {
    NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
    TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
    aTypedArray: aTypedArray,
    aTypedArrayConstructor: aTypedArrayConstructor,
    exportTypedArrayMethod: exportTypedArrayMethod,
    exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
    isView: isView,
    isTypedArray: isTypedArray,
    TypedArray: TypedArray,
    TypedArrayPrototype: TypedArrayPrototype,
  }

  /* eslint-disable no-new */

  var NATIVE_ARRAY_BUFFER_VIEWS$1 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS

  var ArrayBuffer$3 = global_1.ArrayBuffer
  var Int8Array$2 = global_1.Int8Array

  var typedArrayConstructorsRequireWrappers =
    !NATIVE_ARRAY_BUFFER_VIEWS$1 ||
    !fails(function () {
      Int8Array$2(1)
    }) ||
    !fails(function () {
      new Int8Array$2(-1)
    }) ||
    !checkCorrectnessOfIteration(function (iterable) {
      new Int8Array$2()
      new Int8Array$2(null)
      new Int8Array$2(1.5)
      new Int8Array$2(iterable)
    }, true) ||
    fails(function () {
      // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
      return new Int8Array$2(new ArrayBuffer$3(2), 1, undefined).length !== 1
    })

  var toPositiveInteger = function (it) {
    var result = toInteger(it)
    if (result < 0) throw RangeError("The argument can't be less than 0")
    return result
  }

  var toOffset = function (it, BYTES) {
    var offset = toPositiveInteger(it)
    if (offset % BYTES) throw RangeError("Wrong offset")
    return offset
  }

  var ITERATOR$3 = wellKnownSymbol("iterator")

  var getIteratorMethod = function (it) {
    if (it != undefined) return it[ITERATOR$3] || it["@@iterator"] || iterators[classof(it)]
  }

  var ITERATOR$4 = wellKnownSymbol("iterator")
  var ArrayPrototype$1 = Array.prototype

  // check on default Array iterator
  var isArrayIteratorMethod = function (it) {
    return it !== undefined && (iterators.Array === it || ArrayPrototype$1[ITERATOR$4] === it)
  }

  var aTypedArrayConstructor$1 = arrayBufferViewCore.aTypedArrayConstructor

  var typedArrayFrom = function from(source /* , mapfn, thisArg */) {
    var O = toObject(source)
    var argumentsLength = arguments.length
    var mapfn = argumentsLength > 1 ? arguments[1] : undefined
    var mapping = mapfn !== undefined
    var iteratorMethod = getIteratorMethod(O)
    var i, length, result, step, iterator, next
    if (iteratorMethod != undefined && !isArrayIteratorMethod(iteratorMethod)) {
      iterator = iteratorMethod.call(O)
      next = iterator.next
      O = []
      while (!(step = next.call(iterator)).done) {
        O.push(step.value)
      }
    }
    if (mapping && argumentsLength > 2) {
      mapfn = functionBindContext(mapfn, arguments[2], 2)
    }
    length = toLength(O.length)
    result = new (aTypedArrayConstructor$1(this))(length)
    for (i = 0; length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i]
    }
    return result
  }

  var typedArrayConstructor = createCommonjsModule(function (module) {
    var getOwnPropertyNames = objectGetOwnPropertyNames.f

    var forEach = arrayIteration.forEach

    var getInternalState = internalState.get
    var setInternalState = internalState.set
    var nativeDefineProperty = objectDefineProperty.f
    var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f
    var round = Math.round
    var RangeError = global_1.RangeError
    var ArrayBuffer = arrayBuffer.ArrayBuffer
    var DataView = arrayBuffer.DataView
    var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS
    var TYPED_ARRAY_TAG = arrayBufferViewCore.TYPED_ARRAY_TAG
    var TypedArray = arrayBufferViewCore.TypedArray
    var TypedArrayPrototype = arrayBufferViewCore.TypedArrayPrototype
    var aTypedArrayConstructor = arrayBufferViewCore.aTypedArrayConstructor
    var isTypedArray = arrayBufferViewCore.isTypedArray
    var BYTES_PER_ELEMENT = "BYTES_PER_ELEMENT"
    var WRONG_LENGTH = "Wrong length"

    var fromList = function (C, list) {
      var index = 0
      var length = list.length
      var result = new (aTypedArrayConstructor(C))(length)
      while (length > index) result[index] = list[index++]
      return result
    }

    var addGetter = function (it, key) {
      nativeDefineProperty(it, key, {
        get: function () {
          return getInternalState(this)[key]
        },
      })
    }

    var isArrayBuffer = function (it) {
      var klass
      return (
        it instanceof ArrayBuffer ||
        (klass = classof(it)) == "ArrayBuffer" ||
        klass == "SharedArrayBuffer"
      )
    }

    var isTypedArrayIndex = function (target, key) {
      return (
        isTypedArray(target) &&
        typeof key != "symbol" &&
        key in target &&
        String(+key) == String(key)
      )
    }

    var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
      return isTypedArrayIndex(target, (key = toPrimitive(key, true)))
        ? createPropertyDescriptor(2, target[key])
        : nativeGetOwnPropertyDescriptor(target, key)
    }

    var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
      if (
        isTypedArrayIndex(target, (key = toPrimitive(key, true))) &&
        isObject(descriptor) &&
        has(descriptor, "value") &&
        !has(descriptor, "get") &&
        !has(descriptor, "set") &&
        // TODO: add validation descriptor w/o calling accessors
        !descriptor.configurable &&
        (!has(descriptor, "writable") || descriptor.writable) &&
        (!has(descriptor, "enumerable") || descriptor.enumerable)
      ) {
        target[key] = descriptor.value
        return target
      }
      return nativeDefineProperty(target, key, descriptor)
    }

    if (descriptors) {
      if (!NATIVE_ARRAY_BUFFER_VIEWS) {
        objectGetOwnPropertyDescriptor.f = wrappedGetOwnPropertyDescriptor
        objectDefineProperty.f = wrappedDefineProperty
        addGetter(TypedArrayPrototype, "buffer")
        addGetter(TypedArrayPrototype, "byteOffset")
        addGetter(TypedArrayPrototype, "byteLength")
        addGetter(TypedArrayPrototype, "length")
      }

      _export(
        { target: "Object", stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS },
        {
          getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
          defineProperty: wrappedDefineProperty,
        }
      )

      module.exports = function (TYPE, wrapper, CLAMPED) {
        var BYTES = TYPE.match(/\d+$/)[0] / 8
        var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? "Clamped" : "") + "Array"
        var GETTER = "get" + TYPE
        var SETTER = "set" + TYPE
        var NativeTypedArrayConstructor = global_1[CONSTRUCTOR_NAME]
        var TypedArrayConstructor = NativeTypedArrayConstructor
        var TypedArrayConstructorPrototype =
          TypedArrayConstructor && TypedArrayConstructor.prototype
        var exported = {}

        var getter = function (that, index) {
          var data = getInternalState(that)
          return data.view[GETTER](index * BYTES + data.byteOffset, true)
        }

        var setter = function (that, index, value) {
          var data = getInternalState(that)
          if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff
          data.view[SETTER](index * BYTES + data.byteOffset, value, true)
        }

        var addElement = function (that, index) {
          nativeDefineProperty(that, index, {
            get: function () {
              return getter(this, index)
            },
            set: function (value) {
              return setter(this, index, value)
            },
            enumerable: true,
          })
        }

        if (!NATIVE_ARRAY_BUFFER_VIEWS) {
          TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
            anInstance(that, TypedArrayConstructor, CONSTRUCTOR_NAME)
            var index = 0
            var byteOffset = 0
            var buffer, byteLength, length
            if (!isObject(data)) {
              length = toIndex(data)
              byteLength = length * BYTES
              buffer = new ArrayBuffer(byteLength)
            } else if (isArrayBuffer(data)) {
              buffer = data
              byteOffset = toOffset(offset, BYTES)
              var $len = data.byteLength
              if ($length === undefined) {
                if ($len % BYTES) throw RangeError(WRONG_LENGTH)
                byteLength = $len - byteOffset
                if (byteLength < 0) throw RangeError(WRONG_LENGTH)
              } else {
                byteLength = toLength($length) * BYTES
                if (byteLength + byteOffset > $len) throw RangeError(WRONG_LENGTH)
              }
              length = byteLength / BYTES
            } else if (isTypedArray(data)) {
              return fromList(TypedArrayConstructor, data)
            } else {
              return typedArrayFrom.call(TypedArrayConstructor, data)
            }
            setInternalState(that, {
              buffer: buffer,
              byteOffset: byteOffset,
              byteLength: byteLength,
              length: length,
              view: new DataView(buffer),
            })
            while (index < length) addElement(that, index++)
          })

          if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray)
          TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = objectCreate(
            TypedArrayPrototype
          )
        } else if (typedArrayConstructorsRequireWrappers) {
          TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
            anInstance(dummy, TypedArrayConstructor, CONSTRUCTOR_NAME)
            return inheritIfRequired(
              (function () {
                if (!isObject(data)) return new NativeTypedArrayConstructor(toIndex(data))
                if (isArrayBuffer(data))
                  return $length !== undefined
                    ? new NativeTypedArrayConstructor(
                        data,
                        toOffset(typedArrayOffset, BYTES),
                        $length
                      )
                    : typedArrayOffset !== undefined
                    ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES))
                    : new NativeTypedArrayConstructor(data)
                if (isTypedArray(data)) return fromList(TypedArrayConstructor, data)
                return typedArrayFrom.call(TypedArrayConstructor, data)
              })(),
              dummy,
              TypedArrayConstructor
            )
          })

          if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray)
          forEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
            if (!(key in TypedArrayConstructor)) {
              createNonEnumerableProperty(
                TypedArrayConstructor,
                key,
                NativeTypedArrayConstructor[key]
              )
            }
          })
          TypedArrayConstructor.prototype = TypedArrayConstructorPrototype
        }

        if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
          createNonEnumerableProperty(
            TypedArrayConstructorPrototype,
            "constructor",
            TypedArrayConstructor
          )
        }

        if (TYPED_ARRAY_TAG) {
          createNonEnumerableProperty(
            TypedArrayConstructorPrototype,
            TYPED_ARRAY_TAG,
            CONSTRUCTOR_NAME
          )
        }

        exported[CONSTRUCTOR_NAME] = TypedArrayConstructor

        _export(
          {
            global: true,
            forced: TypedArrayConstructor != NativeTypedArrayConstructor,
            sham: !NATIVE_ARRAY_BUFFER_VIEWS,
          },
          exported
        )

        if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
          createNonEnumerableProperty(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES)
        }

        if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
          createNonEnumerableProperty(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES)
        }

        setSpecies(CONSTRUCTOR_NAME)
      }
    } else
      module.exports = function () {
        /* empty */
      }
  })

  // `Float32Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor("Float32", function (init) {
    return function Float32Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length)
    }
  })

  // `Float64Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor("Float64", function (init) {
    return function Float64Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length)
    }
  })

  // `Int8Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor("Int8", function (init) {
    return function Int8Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length)
    }
  })

  // `Int16Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor("Int16", function (init) {
    return function Int16Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length)
    }
  })

  // `Int32Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor("Int32", function (init) {
    return function Int32Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length)
    }
  })

  // `Uint8Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor("Uint8", function (init) {
    return function Uint8Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length)
    }
  })

  // `Uint8ClampedArray` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor(
    "Uint8",
    function (init) {
      return function Uint8ClampedArray(data, byteOffset, length) {
        return init(this, data, byteOffset, length)
      }
    },
    true
  )

  // `Uint16Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor("Uint16", function (init) {
    return function Uint16Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length)
    }
  })

  // `Uint32Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor("Uint32", function (init) {
    return function Uint32Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length)
    }
  })

  var min$2 = Math.min

  // `Array.prototype.copyWithin` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.copywithin
  var arrayCopyWithin =
    [].copyWithin ||
    function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
      var O = toObject(this)
      var len = toLength(O.length)
      var to = toAbsoluteIndex(target, len)
      var from = toAbsoluteIndex(start, len)
      var end = arguments.length > 2 ? arguments[2] : undefined
      var count = min$2((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to)
      var inc = 1
      if (from < to && to < from + count) {
        inc = -1
        from += count - 1
        to += count - 1
      }
      while (count-- > 0) {
        if (from in O) O[to] = O[from]
        else delete O[to]
        to += inc
        from += inc
      }
      return O
    }

  var aTypedArray$1 = arrayBufferViewCore.aTypedArray
  var exportTypedArrayMethod$1 = arrayBufferViewCore.exportTypedArrayMethod

  // `%TypedArray%.prototype.copyWithin` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.copywithin
  exportTypedArrayMethod$1("copyWithin", function copyWithin(target, start /* , end */) {
    return arrayCopyWithin.call(
      aTypedArray$1(this),
      target,
      start,
      arguments.length > 2 ? arguments[2] : undefined
    )
  })

  var $every = arrayIteration.every

  var aTypedArray$2 = arrayBufferViewCore.aTypedArray
  var exportTypedArrayMethod$2 = arrayBufferViewCore.exportTypedArrayMethod

  // `%TypedArray%.prototype.every` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.every
  exportTypedArrayMethod$2("every", function every(callbackfn /* , thisArg */) {
    return $every(aTypedArray$2(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined)
  })

  var aTypedArray$3 = arrayBufferViewCore.aTypedArray
  var exportTypedArrayMethod$3 = arrayBufferViewCore.exportTypedArrayMethod

  // `%TypedArray%.prototype.fill` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.fill
  // eslint-disable-next-line no-unused-vars
  exportTypedArrayMethod$3("fill", function fill(value /* , start, end */) {
    return arrayFill.apply(aTypedArray$3(this), arguments)
  })

  var $filter = arrayIteration.filter

  var aTypedArray$4 = arrayBufferViewCore.aTypedArray
  var aTypedArrayConstructor$2 = arrayBufferViewCore.aTypedArrayConstructor
  var exportTypedArrayMethod$4 = arrayBufferViewCore.exportTypedArrayMethod

  // `%TypedArray%.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.filter
  exportTypedArrayMethod$4("filter", function filter(callbackfn /* , thisArg */) {
    var list = $filter(
      aTypedArray$4(this),
      callbackfn,
      arguments.length > 1 ? arguments[1] : undefined
    )
    var C = speciesConstructor(this, this.constructor)
    var index = 0
    var length = list.length
    var result = new (aTypedArrayConstructor$2(C))(length)
    while (length > index) result[index] = list[index++]
    return result
  })

  var $find = arrayIteration.find

  var aTypedArray$5 = arrayBufferViewCore.aTypedArray
  var exportTypedArrayMethod$5 = arrayBufferViewCore.exportTypedArrayMethod

  // `%TypedArray%.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.find
  exportTypedArrayMethod$5("find", function find(predicate /* , thisArg */) {
    return $find(aTypedArray$5(this), predicate, arguments.length > 1 ? arguments[1] : undefined)
  })

  var $findIndex = arrayIteration.findIndex

  var aTypedArray$6 = arrayBufferViewCore.aTypedArray
  var exportTypedArrayMethod$6 = arrayBufferViewCore.exportTypedArrayMethod

  // `%TypedArray%.prototype.findIndex` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.findindex
  exportTypedArrayMethod$6("findIndex", function findIndex(predicate /* , thisArg */) {
    return $findIndex(
      aTypedArray$6(this),
      predicate,
      arguments.length > 1 ? arguments[1] : undefined
    )
  })

  var $forEach$2 = arrayIteration.forEach

  var aTypedArray$7 = arrayBufferViewCore.aTypedArray
  var exportTypedArrayMethod$7 = arrayBufferViewCore.exportTypedArrayMethod

  // `%TypedArray%.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.foreach
  exportTypedArrayMethod$7("forEach", function forEach(callbackfn /* , thisArg */) {
    $forEach$2(aTypedArray$7(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined)
  })

  var $includes = arrayIncludes.includes

  var aTypedArray$8 = arrayBufferViewCore.aTypedArray
  var exportTypedArrayMethod$8 = arrayBufferViewCore.exportTypedArrayMethod

  // `%TypedArray%.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.includes
  exportTypedArrayMethod$8("includes", function includes(searchElement /* , fromIndex */) {
    return $includes(
      aTypedArray$8(this),
      searchElement,
      arguments.length > 1 ? arguments[1] : undefined
    )
  })

  var $indexOf = arrayIncludes.indexOf

  var aTypedArray$9 = arrayBufferViewCore.aTypedArray
  var exportTypedArrayMethod$9 = arrayBufferViewCore.exportTypedArrayMethod

  // `%TypedArray%.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.indexof
  exportTypedArrayMethod$9("indexOf", function indexOf(searchElement /* , fromIndex */) {
    return $indexOf(
      aTypedArray$9(this),
      searchElement,
      arguments.length > 1 ? arguments[1] : undefined
    )
  })

  var ITERATOR$5 = wellKnownSymbol("iterator")
  var Uint8Array$1 = global_1.Uint8Array
  var arrayValues = es_array_iterator.values
  var arrayKeys = es_array_iterator.keys
  var arrayEntries = es_array_iterator.entries
  var aTypedArray$a = arrayBufferViewCore.aTypedArray
  var exportTypedArrayMethod$a = arrayBufferViewCore.exportTypedArrayMethod
  var nativeTypedArrayIterator = Uint8Array$1 && Uint8Array$1.prototype[ITERATOR$5]

  var CORRECT_ITER_NAME =
    !!nativeTypedArrayIterator &&
    (nativeTypedArrayIterator.name == "values" || nativeTypedArrayIterator.name == undefined)

  var typedArrayValues = function values() {
    return arrayValues.call(aTypedArray$a(this))
  }

  // `%TypedArray%.prototype.entries` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.entries
  exportTypedArrayMethod$a("entries", function entries() {
    return arrayEntries.call(aTypedArray$a(this))
  })
  // `%TypedArray%.prototype.keys` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.keys
  exportTypedArrayMethod$a("keys", function keys() {
    return arrayKeys.call(aTypedArray$a(this))
  })
  // `%TypedArray%.prototype.values` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.values
  exportTypedArrayMethod$a("values", typedArrayValues, !CORRECT_ITER_NAME)
  // `%TypedArray%.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype-@@iterator
  exportTypedArrayMethod$a(ITERATOR$5, typedArrayValues, !CORRECT_ITER_NAME)

  var aTypedArray$b = arrayBufferViewCore.aTypedArray
  var exportTypedArrayMethod$b = arrayBufferViewCore.exportTypedArrayMethod
  var $join = [].join

  // `%TypedArray%.prototype.join` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.join
  // eslint-disable-next-line no-unused-vars
  exportTypedArrayMethod$b("join", function join(separator) {
    return $join.apply(aTypedArray$b(this), arguments)
  })

  var min$3 = Math.min
  var nativeLastIndexOf = [].lastIndexOf
  var NEGATIVE_ZERO = !!nativeLastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0
  var STRICT_METHOD$1 = arrayMethodIsStrict("lastIndexOf")
  // For preventing possible almost infinite loop in non-standard implementations, test the forward version of the method
  var USES_TO_LENGTH$1 = arrayMethodUsesToLength("indexOf", { ACCESSORS: true, 1: 0 })
  var FORCED$3 = NEGATIVE_ZERO || !STRICT_METHOD$1 || !USES_TO_LENGTH$1

  // `Array.prototype.lastIndexOf` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof
  var arrayLastIndexOf = FORCED$3
    ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
        // convert -0 to +0
        if (NEGATIVE_ZERO) return nativeLastIndexOf.apply(this, arguments) || 0
        var O = toIndexedObject(this)
        var length = toLength(O.length)
        var index = length - 1
        if (arguments.length > 1) index = min$3(index, toInteger(arguments[1]))
        if (index < 0) index = length + index
        for (; index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0
        return -1
      }
    : nativeLastIndexOf

  var aTypedArray$c = arrayBufferViewCore.aTypedArray
  var exportTypedArrayMethod$c = arrayBufferViewCore.exportTypedArrayMethod

  // `%TypedArray%.prototype.lastIndexOf` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.lastindexof
  // eslint-disable-next-line no-unused-vars
  exportTypedArrayMethod$c("lastIndexOf", function lastIndexOf(searchElement /* , fromIndex */) {
    return arrayLastIndexOf.apply(aTypedArray$c(this), arguments)
  })

  var $map = arrayIteration.map

  var aTypedArray$d = arrayBufferViewCore.aTypedArray
  var aTypedArrayConstructor$3 = arrayBufferViewCore.aTypedArrayConstructor
  var exportTypedArrayMethod$d = arrayBufferViewCore.exportTypedArrayMethod

  // `%TypedArray%.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.map
  exportTypedArrayMethod$d("map", function map(mapfn /* , thisArg */) {
    return $map(
      aTypedArray$d(this),
      mapfn,
      arguments.length > 1 ? arguments[1] : undefined,
      function (O, length) {
        return new (aTypedArrayConstructor$3(speciesConstructor(O, O.constructor)))(length)
      }
    )
  })

  // `Array.prototype.{ reduce, reduceRight }` methods implementation
  var createMethod$3 = function (IS_RIGHT) {
    return function (that, callbackfn, argumentsLength, memo) {
      aFunction$1(callbackfn)
      var O = toObject(that)
      var self = indexedObject(O)
      var length = toLength(O.length)
      var index = IS_RIGHT ? length - 1 : 0
      var i = IS_RIGHT ? -1 : 1
      if (argumentsLength < 2)
        while (true) {
          if (index in self) {
            memo = self[index]
            index += i
            break
          }
          index += i
          if (IS_RIGHT ? index < 0 : length <= index) {
            throw TypeError("Reduce of empty array with no initial value")
          }
        }
      for (; IS_RIGHT ? index >= 0 : length > index; index += i)
        if (index in self) {
          memo = callbackfn(memo, self[index], index, O)
        }
      return memo
    }
  }

  var arrayReduce = {
    // `Array.prototype.reduce` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
    left: createMethod$3(false),
    // `Array.prototype.reduceRight` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
    right: createMethod$3(true),
  }

  var $reduce = arrayReduce.left

  var aTypedArray$e = arrayBufferViewCore.aTypedArray
  var exportTypedArrayMethod$e = arrayBufferViewCore.exportTypedArrayMethod

  // `%TypedArray%.prototype.reduce` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduce
  exportTypedArrayMethod$e("reduce", function reduce(callbackfn /* , initialValue */) {
    return $reduce(
      aTypedArray$e(this),
      callbackfn,
      arguments.length,
      arguments.length > 1 ? arguments[1] : undefined
    )
  })

  var $reduceRight = arrayReduce.right

  var aTypedArray$f = arrayBufferViewCore.aTypedArray
  var exportTypedArrayMethod$f = arrayBufferViewCore.exportTypedArrayMethod

  // `%TypedArray%.prototype.reduceRicht` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduceright
  exportTypedArrayMethod$f("reduceRight", function reduceRight(callbackfn /* , initialValue */) {
    return $reduceRight(
      aTypedArray$f(this),
      callbackfn,
      arguments.length,
      arguments.length > 1 ? arguments[1] : undefined
    )
  })

  var aTypedArray$g = arrayBufferViewCore.aTypedArray
  var exportTypedArrayMethod$g = arrayBufferViewCore.exportTypedArrayMethod
  var floor$2 = Math.floor

  // `%TypedArray%.prototype.reverse` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reverse
  exportTypedArrayMethod$g("reverse", function reverse() {
    var that = this
    var length = aTypedArray$g(that).length
    var middle = floor$2(length / 2)
    var index = 0
    var value
    while (index < middle) {
      value = that[index]
      that[index++] = that[--length]
      that[length] = value
    }
    return that
  })

  var aTypedArray$h = arrayBufferViewCore.aTypedArray
  var exportTypedArrayMethod$h = arrayBufferViewCore.exportTypedArrayMethod

  var FORCED$4 = fails(function () {
    // eslint-disable-next-line no-undef
    new Int8Array(1).set({})
  })

  // `%TypedArray%.prototype.set` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.set
  exportTypedArrayMethod$h(
    "set",
    function set(arrayLike /* , offset */) {
      aTypedArray$h(this)
      var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1)
      var length = this.length
      var src = toObject(arrayLike)
      var len = toLength(src.length)
      var index = 0
      if (len + offset > length) throw RangeError("Wrong length")
      while (index < len) this[offset + index] = src[index++]
    },
    FORCED$4
  )

  var aTypedArray$i = arrayBufferViewCore.aTypedArray
  var aTypedArrayConstructor$4 = arrayBufferViewCore.aTypedArrayConstructor
  var exportTypedArrayMethod$i = arrayBufferViewCore.exportTypedArrayMethod
  var $slice = [].slice

  var FORCED$5 = fails(function () {
    // eslint-disable-next-line no-undef
    new Int8Array(1).slice()
  })

  // `%TypedArray%.prototype.slice` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.slice
  exportTypedArrayMethod$i(
    "slice",
    function slice(start, end) {
      var list = $slice.call(aTypedArray$i(this), start, end)
      var C = speciesConstructor(this, this.constructor)
      var index = 0
      var length = list.length
      var result = new (aTypedArrayConstructor$4(C))(length)
      while (length > index) result[index] = list[index++]
      return result
    },
    FORCED$5
  )

  var $some = arrayIteration.some

  var aTypedArray$j = arrayBufferViewCore.aTypedArray
  var exportTypedArrayMethod$j = arrayBufferViewCore.exportTypedArrayMethod

  // `%TypedArray%.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.some
  exportTypedArrayMethod$j("some", function some(callbackfn /* , thisArg */) {
    return $some(aTypedArray$j(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined)
  })

  var aTypedArray$k = arrayBufferViewCore.aTypedArray
  var exportTypedArrayMethod$k = arrayBufferViewCore.exportTypedArrayMethod
  var $sort = [].sort

  // `%TypedArray%.prototype.sort` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.sort
  exportTypedArrayMethod$k("sort", function sort(comparefn) {
    return $sort.call(aTypedArray$k(this), comparefn)
  })

  var aTypedArray$l = arrayBufferViewCore.aTypedArray
  var exportTypedArrayMethod$l = arrayBufferViewCore.exportTypedArrayMethod

  // `%TypedArray%.prototype.subarray` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.subarray
  exportTypedArrayMethod$l("subarray", function subarray(begin, end) {
    var O = aTypedArray$l(this)
    var length = O.length
    var beginIndex = toAbsoluteIndex(begin, length)
    return new (speciesConstructor(O, O.constructor))(
      O.buffer,
      O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
      toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - beginIndex)
    )
  })

  var Int8Array$3 = global_1.Int8Array
  var aTypedArray$m = arrayBufferViewCore.aTypedArray
  var exportTypedArrayMethod$m = arrayBufferViewCore.exportTypedArrayMethod
  var $toLocaleString = [].toLocaleString
  var $slice$1 = [].slice

  // iOS Safari 6.x fails here
  var TO_LOCALE_STRING_BUG =
    !!Int8Array$3 &&
    fails(function () {
      $toLocaleString.call(new Int8Array$3(1))
    })

  var FORCED$6 =
    fails(function () {
      return [1, 2].toLocaleString() != new Int8Array$3([1, 2]).toLocaleString()
    }) ||
    !fails(function () {
      Int8Array$3.prototype.toLocaleString.call([1, 2])
    })

  // `%TypedArray%.prototype.toLocaleString` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tolocalestring
  exportTypedArrayMethod$m(
    "toLocaleString",
    function toLocaleString() {
      return $toLocaleString.apply(
        TO_LOCALE_STRING_BUG ? $slice$1.call(aTypedArray$m(this)) : aTypedArray$m(this),
        arguments
      )
    },
    FORCED$6
  )

  var exportTypedArrayMethod$n = arrayBufferViewCore.exportTypedArrayMethod

  var Uint8Array$2 = global_1.Uint8Array
  var Uint8ArrayPrototype = (Uint8Array$2 && Uint8Array$2.prototype) || {}
  var arrayToString = [].toString
  var arrayJoin = [].join

  if (
    fails(function () {
      arrayToString.call({})
    })
  ) {
    arrayToString = function toString() {
      return arrayJoin.call(this)
    }
  }

  var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString

  // `%TypedArray%.prototype.toString` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tostring
  exportTypedArrayMethod$n("toString", arrayToString, IS_NOT_ARRAY_METHOD)

  var engineUserAgent = getBuiltIn("navigator", "userAgent") || ""

  var slice = [].slice
  var MSIE = /MSIE .\./.test(engineUserAgent) // <- dirty ie9- check

  var wrap$1 = function (scheduler) {
    return function (handler, timeout /* , ...arguments */) {
      var boundArgs = arguments.length > 2
      var args = boundArgs ? slice.call(arguments, 2) : undefined
      return scheduler(
        boundArgs
          ? function () {
              // eslint-disable-next-line no-new-func
              ;(typeof handler == "function" ? handler : Function(handler)).apply(this, args)
            }
          : handler,
        timeout
      )
    }
  }

  // ie9- setTimeout & setInterval additional parameters fix
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
  _export(
    { global: true, bind: true, forced: MSIE },
    {
      // `setTimeout` method
      // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
      setTimeout: wrap$1(global_1.setTimeout),
      // `setInterval` method
      // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
      setInterval: wrap$1(global_1.setInterval),
    }
  )

  var windowObj = null
  var globalObj = null

  try {
    windowObj = window
  } catch (e) {}

  try {
    globalObj = global
  } catch (e) {}

  var standardMap = {
    // Function properties
    isFinite: new SimpleValue(isFinite),
    isNaN: new SimpleValue(isNaN),
    parseFloat: new SimpleValue(parseFloat),
    parseInt: new SimpleValue(parseInt),
    decodeURI: new SimpleValue(decodeURI),
    decodeURIComponent: new SimpleValue(decodeURIComponent),
    encodeURI: new SimpleValue(encodeURI),
    encodeURIComponent: new SimpleValue(encodeURIComponent),
    // Fundamental objects
    Object: new SimpleValue(Object),
    Function: new SimpleValue(Function),
    Boolean: new SimpleValue(Boolean),
    Symbol: new SimpleValue(Symbol),
    Error: new SimpleValue(Error),
    EvalError: new SimpleValue(EvalError),
    RangeError: new SimpleValue(RangeError),
    ReferenceError: new SimpleValue(ReferenceError),
    SyntaxError: new SimpleValue(SyntaxError),
    TypeError: new SimpleValue(TypeError),
    URIError: new SimpleValue(URIError),
    // Numbers and dates
    Number: new SimpleValue(Number),
    Math: new SimpleValue(Math),
    Date: new SimpleValue(Date),
    // Text processing
    String: new SimpleValue(String),
    RegExp: new SimpleValue(RegExp),
    // Indexed collections
    Array: new SimpleValue(Array),
    Int8Array: new SimpleValue(Int8Array),
    Uint8Array: new SimpleValue(Uint8Array),
    Uint8ClampedArray: new SimpleValue(Uint8ClampedArray),
    Int16Array: new SimpleValue(Int16Array),
    Uint16Array: new SimpleValue(Uint16Array),
    Int32Array: new SimpleValue(Int32Array),
    Uint32Array: new SimpleValue(Uint32Array),
    Float32Array: new SimpleValue(Float32Array),
    Float64Array: new SimpleValue(Float64Array),
    // Structured data
    ArrayBuffer: new SimpleValue(ArrayBuffer),
    DataView: new SimpleValue(DataView),
    JSON: new SimpleValue(JSON),
    // Other
    window: new SimpleValue(windowObj),
    global: new SimpleValue(globalObj),
    console: new SimpleValue(console),
    setTimeout: new SimpleValue(setTimeout),
    clearTimeout: new SimpleValue(clearTimeout),
    setInterval: new SimpleValue(setInterval),
    clearInterval: new SimpleValue(clearInterval),
  }

  var Scope = /*#__PURE__*/ (function () {
    function Scope(type, parentScope) {
      classCallCheck(this, Scope)

      // 作用域类型，区分函数作用域function和块级作用域block
      this.type = type // 父级作用域

      this.parentScope = parentScope // 全局作用域

      this.globalDeclaration = standardMap // 当前作用域的变量空间

      this.declaration = Object.create(null)
    }
    /*
	   * get/set方法用于获取/设置当前作用域中对应name的变量值
	     符合JS语法规则，优先从当前作用域去找，若找不到则到父级作用域去找，然后到全局作用域找。
	     如果都没有，就报错
	   */

    createClass(Scope, [
      {
        key: "get",
        value: function get(name) {
          if (this.declaration[name]) {
            return this.declaration[name]
          } else if (this.parentScope) {
            return this.parentScope.get(name)
          } else if (this.globalDeclaration[name]) {
            return this.globalDeclaration[name]
          }

          throw new ReferenceError("".concat(name, " is not defined"))
        },
      },
      {
        key: "set",
        value: function set(name, value) {
          if (this.declaration[name]) {
            this.declaration[name] = value
          } else if (this.parentScope) {
            this.parentScope.set(name, value)
          } else {
            throw new ReferenceError("".concat(name, " is not defined"))
          }
        },
        /**
         * 根据变量的kind调用不同的变量定义方法
         */
      },
      {
        key: "declare",
        value: function declare(name, value) {
          var kind = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "var"

          if (kind === "var") {
            return this.varDeclare(name, value)
          } else if (kind === "let") {
            return this.letDeclare(name, value)
          } else if (kind === "const") {
            return this.constDeclare(name, value)
          } else {
            throw new Error('canjs: Invalid Variable Declaration Kind of "'.concat(kind, '"'))
          }
        },
      },
      {
        key: "varDeclare",
        value: function varDeclare(name, value) {
          var scope = this // 若当前作用域存在非函数类型的父级作用域时，就把变量定义到父级作用域

          while (scope && scope.type !== "function") {
            scope = scope.parentScope
          }

          if (!scope) {
            return (this.declaration[name] = new SimpleValue(value, "var"))
          }

          return (scope.declaration[name] = new SimpleValue(value, "var"))
        },
      },
      {
        key: "letDeclare",
        value: function letDeclare(name, value) {
          // 不允许重复定义
          if (this.declaration[name]) {
            throw new SyntaxError("Identifier ".concat(name, " has already been declared"))
          }

          return (this.declaration[name] = new SimpleValue(value, "let"))
        },
      },
      {
        key: "constDeclare",
        value: function constDeclare(name, value) {
          // 不允许重复定义
          if (this.declaration[name]) {
            throw new SyntaxError("Identifier ".concat(name, " has already been declared"))
          }

          return (this.declaration[name] = new SimpleValue(value, "const"))
        },
      },
      {
        key: "addDeclaration",
        value: function addDeclaration(name, value) {
          this.globalDeclaration[name] = new SimpleValue(value)
        },
      },
    ])

    return Scope
  })()

  // `Symbol.iterator` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.iterator
  defineWellKnownSymbol("iterator")

  var createProperty = function (object, key, value) {
    var propertyKey = toPrimitive(key)
    if (propertyKey in object)
      objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value))
    else object[propertyKey] = value
  }

  var process = global_1.process
  var versions = process && process.versions
  var v8 = versions && versions.v8
  var match, version

  if (v8) {
    match = v8.split(".")
    version = match[0] + match[1]
  } else if (engineUserAgent) {
    match = engineUserAgent.match(/Edge\/(\d+)/)
    if (!match || match[1] >= 74) {
      match = engineUserAgent.match(/Chrome\/(\d+)/)
      if (match) version = match[1]
    }
  }

  var engineV8Version = version && +version

  var SPECIES$3 = wellKnownSymbol("species")

  var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
    // We can't use this feature detection in V8 since it causes
    // deoptimization and serious performance degradation
    // https://github.com/zloirock/core-js/issues/677
    return (
      engineV8Version >= 51 ||
      !fails(function () {
        var array = []
        var constructor = (array.constructor = {})
        constructor[SPECIES$3] = function () {
          return { foo: 1 }
        }
        return array[METHOD_NAME](Boolean).foo !== 1
      })
    )
  }

  var IS_CONCAT_SPREADABLE = wellKnownSymbol("isConcatSpreadable")
  var MAX_SAFE_INTEGER = 0x1fffffffffffff
  var MAXIMUM_ALLOWED_INDEX_EXCEEDED = "Maximum allowed index exceeded"

  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/679
  var IS_CONCAT_SPREADABLE_SUPPORT =
    engineV8Version >= 51 ||
    !fails(function () {
      var array = []
      array[IS_CONCAT_SPREADABLE] = false
      return array.concat()[0] !== array
    })

  var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("concat")

  var isConcatSpreadable = function (O) {
    if (!isObject(O)) return false
    var spreadable = O[IS_CONCAT_SPREADABLE]
    return spreadable !== undefined ? !!spreadable : isArray(O)
  }

  var FORCED$7 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT

  // `Array.prototype.concat` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.concat
  // with adding support of @@isConcatSpreadable and @@species
  _export(
    { target: "Array", proto: true, forced: FORCED$7 },
    {
      concat: function concat(arg) {
        // eslint-disable-line no-unused-vars
        var O = toObject(this)
        var A = arraySpeciesCreate(O, 0)
        var n = 0
        var i, k, length, len, E
        for (i = -1, length = arguments.length; i < length; i++) {
          E = i === -1 ? O : arguments[i]
          if (isConcatSpreadable(E)) {
            len = toLength(E.length)
            if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED)
            for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k])
          } else {
            if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED)
            createProperty(A, n++, E)
          }
        }
        A.length = n
        return A
      },
    }
  )

  // call something on iterator step with safe closing on error
  var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
    try {
      return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value)
      // 7.4.6 IteratorClose(iterator, completion)
    } catch (error) {
      var returnMethod = iterator["return"]
      if (returnMethod !== undefined) anObject(returnMethod.call(iterator))
      throw error
    }
  }

  // `Array.from` method implementation
  // https://tc39.github.io/ecma262/#sec-array.from
  var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike)
    var C = typeof this == "function" ? this : Array
    var argumentsLength = arguments.length
    var mapfn = argumentsLength > 1 ? arguments[1] : undefined
    var mapping = mapfn !== undefined
    var iteratorMethod = getIteratorMethod(O)
    var index = 0
    var length, result, step, iterator, next, value
    if (mapping)
      mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2)
    // if the target is not iterable or it's an array with the default iterator - use a simple case
    if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
      iterator = iteratorMethod.call(O)
      next = iterator.next
      result = new C()
      for (; !(step = next.call(iterator)).done; index++) {
        value = mapping
          ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true)
          : step.value
        createProperty(result, index, value)
      }
    } else {
      length = toLength(O.length)
      result = new C(length)
      for (; length > index; index++) {
        value = mapping ? mapfn(O[index], index) : O[index]
        createProperty(result, index, value)
      }
    }
    result.length = index
    return result
  }

  var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
    Array.from(iterable)
  })

  // `Array.from` method
  // https://tc39.github.io/ecma262/#sec-array.from
  _export(
    { target: "Array", stat: true, forced: INCORRECT_ITERATION },
    {
      from: arrayFrom,
    }
  )

  // `Array.isArray` method
  // https://tc39.github.io/ecma262/#sec-array.isarray
  _export(
    { target: "Array", stat: true },
    {
      isArray: isArray,
    }
  )

  var $map$1 = arrayIteration.map

  var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("map")
  // FF49- issue
  var USES_TO_LENGTH$2 = arrayMethodUsesToLength("map")

  // `Array.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  // with adding support of @@species
  _export(
    { target: "Array", proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH$2 },
    {
      map: function map(callbackfn /* , thisArg */) {
        return $map$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined)
      },
    }
  )

  var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport("slice")
  var USES_TO_LENGTH$3 = arrayMethodUsesToLength("slice", { ACCESSORS: true, 0: 0, 1: 2 })

  var SPECIES$4 = wellKnownSymbol("species")
  var nativeSlice = [].slice
  var max$1 = Math.max

  // `Array.prototype.slice` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.slice
  // fallback for not array-like ES3 strings and DOM objects
  _export(
    { target: "Array", proto: true, forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$3 },
    {
      slice: function slice(start, end) {
        var O = toIndexedObject(this)
        var length = toLength(O.length)
        var k = toAbsoluteIndex(start, length)
        var fin = toAbsoluteIndex(end === undefined ? length : end, length)
        // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
        var Constructor, result, n
        if (isArray(O)) {
          Constructor = O.constructor
          // cross-realm fallback
          if (
            typeof Constructor == "function" &&
            (Constructor === Array || isArray(Constructor.prototype))
          ) {
            Constructor = undefined
          } else if (isObject(Constructor)) {
            Constructor = Constructor[SPECIES$4]
            if (Constructor === null) Constructor = undefined
          }
          if (Constructor === Array || Constructor === undefined) {
            return nativeSlice.call(O, k, fin)
          }
        }
        result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0))
        for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k])
        result.length = n
        return result
      },
    }
  )

  var slice$1 = [].slice
  var factories = {}

  var construct = function (C, argsLength, args) {
    if (!(argsLength in factories)) {
      for (var list = [], i = 0; i < argsLength; i++) list[i] = "a[" + i + "]"
      // eslint-disable-next-line no-new-func
      factories[argsLength] = Function("C,a", "return new C(" + list.join(",") + ")")
    }
    return factories[argsLength](C, args)
  }

  // `Function.prototype.bind` method implementation
  // https://tc39.github.io/ecma262/#sec-function.prototype.bind
  var functionBind =
    Function.bind ||
    function bind(that /* , ...args */) {
      var fn = aFunction$1(this)
      var partArgs = slice$1.call(arguments, 1)
      var boundFunction = function bound(/* args... */) {
        var args = partArgs.concat(slice$1.call(arguments))
        return this instanceof boundFunction
          ? construct(fn, args.length, args)
          : fn.apply(that, args)
      }
      if (isObject(fn.prototype)) boundFunction.prototype = fn.prototype
      return boundFunction
    }

  // `Function.prototype.bind` method
  // https://tc39.github.io/ecma262/#sec-function.prototype.bind
  _export(
    { target: "Function", proto: true },
    {
      bind: functionBind,
    }
  )

  var defineProperty$8 = objectDefineProperty.f

  var FunctionPrototype = Function.prototype
  var FunctionPrototypeToString = FunctionPrototype.toString
  var nameRE = /^\s*function ([^ (]*)/
  var NAME$1 = "name"

  // Function instances `.name` property
  // https://tc39.github.io/ecma262/#sec-function-instances-name
  if (descriptors && !(NAME$1 in FunctionPrototype)) {
    defineProperty$8(FunctionPrototype, NAME$1, {
      configurable: true,
      get: function () {
        try {
          return FunctionPrototypeToString.call(this).match(nameRE)[1]
        } catch (error) {
          return ""
        }
      },
    })
  }

  // `Object.defineProperties` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperties
  _export(
    { target: "Object", stat: true, forced: !descriptors, sham: !descriptors },
    {
      defineProperties: objectDefineProperties,
    }
  )

  // `String.prototype.{ codePointAt, at }` methods implementation
  var createMethod$4 = function (CONVERT_TO_STRING) {
    return function ($this, pos) {
      var S = String(requireObjectCoercible($this))
      var position = toInteger(pos)
      var size = S.length
      var first, second
      if (position < 0 || position >= size) return CONVERT_TO_STRING ? "" : undefined
      first = S.charCodeAt(position)
      return first < 0xd800 ||
        first > 0xdbff ||
        position + 1 === size ||
        (second = S.charCodeAt(position + 1)) < 0xdc00 ||
        second > 0xdfff
        ? CONVERT_TO_STRING
          ? S.charAt(position)
          : first
        : CONVERT_TO_STRING
        ? S.slice(position, position + 2)
        : ((first - 0xd800) << 10) + (second - 0xdc00) + 0x10000
    }
  }

  var stringMultibyte = {
    // `String.prototype.codePointAt` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
    codeAt: createMethod$4(false),
    // `String.prototype.at` method
    // https://github.com/mathiasbynens/String.prototype.at
    charAt: createMethod$4(true),
  }

  var charAt = stringMultibyte.charAt

  var STRING_ITERATOR = "String Iterator"
  var setInternalState$4 = internalState.set
  var getInternalState$3 = internalState.getterFor(STRING_ITERATOR)

  // `String.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
  defineIterator(
    String,
    "String",
    function (iterated) {
      setInternalState$4(this, {
        type: STRING_ITERATOR,
        string: String(iterated),
        index: 0,
      })
      // `%StringIteratorPrototype%.next` method
      // https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
    },
    function next() {
      var state = getInternalState$3(this)
      var string = state.string
      var index = state.index
      var point
      if (index >= string.length) return { value: undefined, done: true }
      point = charAt(string, index)
      state.index += point.length
      return { value: point, done: false }
    }
  )

  var ITERATOR$6 = wellKnownSymbol("iterator")
  var TO_STRING_TAG$4 = wellKnownSymbol("toStringTag")
  var ArrayValues = es_array_iterator.values

  for (var COLLECTION_NAME$1 in domIterables) {
    var Collection$1 = global_1[COLLECTION_NAME$1]
    var CollectionPrototype$1 = Collection$1 && Collection$1.prototype
    if (CollectionPrototype$1) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype$1[ITERATOR$6] !== ArrayValues)
        try {
          createNonEnumerableProperty(CollectionPrototype$1, ITERATOR$6, ArrayValues)
        } catch (error) {
          CollectionPrototype$1[ITERATOR$6] = ArrayValues
        }
      if (!CollectionPrototype$1[TO_STRING_TAG$4]) {
        createNonEnumerableProperty(CollectionPrototype$1, TO_STRING_TAG$4, COLLECTION_NAME$1)
      }
      if (domIterables[COLLECTION_NAME$1])
        for (var METHOD_NAME in es_array_iterator) {
          // some Chrome versions have non-configurable methods on DOMTokenList
          if (CollectionPrototype$1[METHOD_NAME] !== es_array_iterator[METHOD_NAME])
            try {
              createNonEnumerableProperty(
                CollectionPrototype$1,
                METHOD_NAME,
                es_array_iterator[METHOD_NAME]
              )
            } catch (error) {
              CollectionPrototype$1[METHOD_NAME] = es_array_iterator[METHOD_NAME]
            }
        }
    }
  }

  var _typeof_1 = createCommonjsModule(function (module) {
    function _typeof(obj) {
      "@babel/helpers - typeof"

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        module.exports = _typeof = function _typeof(obj) {
          return typeof obj
        }
      } else {
        module.exports = _typeof = function _typeof(obj) {
          return obj &&
            typeof Symbol === "function" &&
            obj.constructor === Symbol &&
            obj !== Symbol.prototype
            ? "symbol"
            : typeof obj
        }
      }

      return _typeof(obj)
    }

    module.exports = _typeof
  })

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i]
    }

    return arr2
  }

  var arrayLikeToArray = _arrayLikeToArray

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return arrayLikeToArray(arr)
  }

  var arrayWithoutHoles = _arrayWithoutHoles

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter)
  }

  var iterableToArray = _iterableToArray

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return
    if (typeof o === "string") return arrayLikeToArray(o, minLen)
    var n = Object.prototype.toString.call(o).slice(8, -1)
    if (n === "Object" && o.constructor) n = o.constructor.name
    if (n === "Map" || n === "Set") return Array.from(o)
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return arrayLikeToArray(o, minLen)
  }

  var unsupportedIterableToArray = _unsupportedIterableToArray

  function _nonIterableSpread() {
    throw new TypeError(
      "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    )
  }

  var nonIterableSpread = _nonIterableSpread

  function _toConsumableArray(arr) {
    return (
      arrayWithoutHoles(arr) ||
      iterableToArray(arr) ||
      unsupportedIterableToArray(arr) ||
      nonIterableSpread()
    )
  }

  var toConsumableArray = _toConsumableArray

  var Signal = /*#__PURE__*/ (function () {
    function Signal(type, value) {
      classCallCheck(this, Signal)

      this.type = type
      this.value = value
    }

    createClass(Signal, null, [
      {
        key: "Return",
        value: function Return(value) {
          return new Signal("return", value)
        },
      },
      {
        key: "Break",
        value: function Break() {
          var label = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null
          return new Signal("break", label)
        },
      },
      {
        key: "Continue",
        value: function Continue(label) {
          return new Signal("continue", label)
        },
      },
      {
        key: "isReturn",
        value: function isReturn(signal) {
          return signal instanceof Signal && signal.type === "return"
        },
      },
      {
        key: "isContinue",
        value: function isContinue(signal) {
          return signal instanceof Signal && signal.type === "continue"
        },
      },
      {
        key: "isBreak",
        value: function isBreak(signal) {
          return signal instanceof Signal && signal.type === "break"
        },
      },
      {
        key: "isSignal",
        value: function isSignal(signal) {
          return signal instanceof Signal
        },
      },
    ])

    return Signal
  })()

  function _createForOfIteratorHelper(o) {
    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (o = _unsupportedIterableToArray$1(o))) {
        var i = 0
        var F = function F() {}
        return {
          s: F,
          n: function n() {
            if (i >= o.length) return { done: true }
            return { done: false, value: o[i++] }
          },
          e: function e(_e) {
            throw _e
          },
          f: F,
        }
      }
      throw new TypeError(
        "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
      )
    }
    var it,
      normalCompletion = true,
      didErr = false,
      err
    return {
      s: function s() {
        it = o[Symbol.iterator]()
      },
      n: function n() {
        var step = it.next()
        normalCompletion = step.done
        return step
      },
      e: function e(_e2) {
        didErr = true
        err = _e2
      },
      f: function f() {
        try {
          if (!normalCompletion && it["return"] != null) it["return"]()
        } finally {
          if (didErr) throw err
        }
      },
    }
  }

  function _unsupportedIterableToArray$1(o, minLen) {
    if (!o) return
    if (typeof o === "string") return _arrayLikeToArray$1(o, minLen)
    var n = Object.prototype.toString.call(o).slice(8, -1)
    if (n === "Object" && o.constructor) n = o.constructor.name
    if (n === "Map" || n === "Set") return Array.from(o)
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray$1(o, minLen)
  }

  function _arrayLikeToArray$1(arr, len) {
    if (len == null || len > arr.length) len = arr.length
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i]
    }
    return arr2
  }
  var NodeHandler = {
    Program: function Program(nodeIterator) {
      var _iterator = _createForOfIteratorHelper(nodeIterator.node.body),
        _step

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done; ) {
          var node = _step.value
          nodeIterator.traverse(node)
        }
      } catch (err) {
        _iterator.e(err)
      } finally {
        _iterator.f()
      }
    },
    VariableDeclaration: function VariableDeclaration(nodeIterator) {
      var kind = nodeIterator.node.kind

      var _iterator2 = _createForOfIteratorHelper(nodeIterator.node.declarations),
        _step2

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
          var declaration = _step2.value
          var name = declaration.id.name
          var value = declaration.init ? nodeIterator.traverse(declaration.init) : undefined // 在作用域当中定义变量

          if (nodeIterator.scope.type === "block" && kind !== "var") {
            nodeIterator.scope.parentScope.declare(name, value, kind)
          } else {
            nodeIterator.scope.declare(name, value, kind)
          }
        }
      } catch (err) {
        _iterator2.e(err)
      } finally {
        _iterator2.f()
      }
    },
    Identifier: function Identifier(nodeIterator) {
      if (nodeIterator.node.name === "undefined") {
        return undefined
      }

      return nodeIterator.scope.get(nodeIterator.node.name).value
    },
    Literal: function Literal(nodeIterator) {
      return nodeIterator.node.value
    },
    ExpressionStatement: function ExpressionStatement(nodeIterator) {
      return nodeIterator.traverse(nodeIterator.node.expression)
    },
    CallExpression: function CallExpression(nodeIterator) {
      var func = nodeIterator.traverse(nodeIterator.node.callee)
      var args = nodeIterator.node.arguments.map(function (arg) {
        return nodeIterator.traverse(arg)
      })
      var value

      if (nodeIterator.node.callee.type === "MemberExpression") {
        value = nodeIterator.traverse(nodeIterator.node.callee.object)
      }

      return func.apply(value, args)
    },
    SequenceExpression: function SequenceExpression(nodeIterator) {
      var result

      var _iterator3 = _createForOfIteratorHelper(nodeIterator.node.expressions),
        _step3

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done; ) {
          var expression = _step3.value
          result = nodeIterator.traverse(expression)
        }
      } catch (err) {
        _iterator3.e(err)
      } finally {
        _iterator3.f()
      }

      return result
    },
    MemberExpression: function MemberExpression(nodeIterator) {
      var obj = nodeIterator.traverse(nodeIterator.node.object)
      var name = nodeIterator.node.property.name
      return obj[name]
    },
    ObjectExpression: function ObjectExpression(nodeIterator) {
      var obj = {}

      var _iterator4 = _createForOfIteratorHelper(nodeIterator.node.properties),
        _step4

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done; ) {
          var prop = _step4.value
          var key = void 0

          if (prop.key.type === "Literal") {
            key = "".concat(prop.key.value)
          } else if (prop.key.type === "Identifier") {
            key = prop.key.name
          } else {
            throw new Error(
              'canjs: [ObjectExpression] Unsupported property key type "'.concat(prop.key.type, '"')
            )
          }

          obj[key] = nodeIterator.traverse(prop.value)
        }
      } catch (err) {
        _iterator4.e(err)
      } finally {
        _iterator4.f()
      }

      return obj
    },
    ArrayExpression: function ArrayExpression(nodeIterator) {
      return nodeIterator.node.elements.map(function (ele) {
        return nodeIterator.traverse(ele)
      })
    },
    BlockStatement: function BlockStatement(nodeIterator) {
      var scope = nodeIterator.createScope("block") // 处理块级节点内的每一个节点

      var _iterator5 = _createForOfIteratorHelper(nodeIterator.node.body),
        _step5

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done; ) {
          var node = _step5.value

          if (node.type === "VariableDeclaration" && node.kind === "var") {
            var _iterator7 = _createForOfIteratorHelper(node.declarations),
              _step7

            try {
              for (_iterator7.s(); !(_step7 = _iterator7.n()).done; ) {
                var declaration = _step7.value

                if (declaration.init) {
                  scope.declare(
                    declaration.id.name,
                    nodeIterator.traverse(declaration.init, {
                      scope: scope,
                    }),
                    node.kind
                  )
                } else {
                  scope.declare(declaration.id.name, undefined, node.kind)
                }
              }
            } catch (err) {
              _iterator7.e(err)
            } finally {
              _iterator7.f()
            }
          } else if (node.type === "FunctionDeclaration") {
            nodeIterator.traverse(node, {
              scope: scope,
            })
          }
        } // 提取关键字（return, break, continue）
      } catch (err) {
        _iterator5.e(err)
      } finally {
        _iterator5.f()
      }

      var _iterator6 = _createForOfIteratorHelper(nodeIterator.node.body),
        _step6

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done; ) {
          var _node = _step6.value

          if (_node.type === "FunctionDeclaration") {
            continue
          }

          var signal = nodeIterator.traverse(_node, {
            scope: scope,
          })

          if (Signal.isSignal(signal)) {
            return signal
          }
        }
      } catch (err) {
        _iterator6.e(err)
      } finally {
        _iterator6.f()
      }
    },
    FunctionDeclaration: function FunctionDeclaration(nodeIterator) {
      var fn = NodeHandler.FunctionExpression(nodeIterator)
      nodeIterator.scope.varDeclare(nodeIterator.node.id.name, fn)
      return fn
    },
    FunctionExpression: function FunctionExpression(nodeIterator) {
      var node = nodeIterator.node
      /**
       * 1、定义函数需要先为其定义一个函数作用域，且允许继承父级作用域
       * 2、注册`this`, `arguments`和形参到作用域的变量空间
       * 3、检查return关键字
       * 4、定义函数名和长度
       */

      var fn = function fn() {
        var _arguments = arguments
        var scope = nodeIterator.createScope("function")
        scope.constDeclare("this", this)
        scope.constDeclare("arguments", arguments)
        node.params.forEach(function (param, index) {
          var name = param.name
          scope.varDeclare(name, _arguments[index])
        })
        var signal = nodeIterator.traverse(node.body, {
          scope: scope,
        })

        if (Signal.isReturn(signal)) {
          return signal.value
        }
      }

      Object.defineProperties(fn, {
        name: {
          value: node.id ? node.id.name : "",
        },
        length: {
          value: node.params.length,
        },
      })
      return fn
    },
    ThisExpression: function ThisExpression(nodeIterator) {
      var value = nodeIterator.scope.get("this")
      return value ? value.value : null
    },
    NewExpression: function NewExpression(nodeIterator) {
      var func = nodeIterator.traverse(nodeIterator.node.callee)
      var args = nodeIterator.node.arguments.map(function (arg) {
        return nodeIterator.traverse(arg)
      })
      return new (func.bind.apply(func, [null].concat(toConsumableArray(args))))()
    },
    UpdateExpression: function UpdateExpression(nodeIterator) {
      var _nodeIterator$scope$g = nodeIterator.scope.get(nodeIterator.node.argument.name),
        value = _nodeIterator$scope$g.value

      if (nodeIterator.node.operator === "++") {
        nodeIterator.node.prefix ? ++value : value++
      } else {
        nodeIterator.node.prefix ? --value : value--
      }

      nodeIterator.scope.set(nodeIterator.node.argument.name, value)
      return value
    },
    AssignmentExpressionOperatortraverseMap: {
      "=": function _(value, v) {
        return value instanceof MemberValue ? (value.obj[value.prop] = v) : (value.value = v)
      },
      "+=": function _(value, v) {
        return value instanceof MemberValue ? (value.obj[value.prop] += v) : (value.value += v)
      },
      "-=": function _(value, v) {
        return value instanceof MemberValue ? (value.obj[value.prop] -= v) : (value.value -= v)
      },
      "*=": function _(value, v) {
        return value instanceof MemberValue ? (value.obj[value.prop] *= v) : (value.value *= v)
      },
      "/=": function _(value, v) {
        return value instanceof MemberValue ? (value.obj[value.prop] /= v) : (value.value /= v)
      },
      "%=": function _(value, v) {
        return value instanceof MemberValue ? (value.obj[value.prop] %= v) : (value.value %= v)
      },
      "**=": function _() {
        throw new Error("canjs: es5 doen't supports operator \"**=")
      },
      "<<=": function _(value, v) {
        return value instanceof MemberValue ? (value.obj[value.prop] <<= v) : (value.value <<= v)
      },
      ">>=": function _(value, v) {
        return value instanceof MemberValue ? (value.obj[value.prop] >>= v) : (value.value >>= v)
      },
      ">>>=": function _(value, v) {
        return value instanceof MemberValue ? (value.obj[value.prop] >>>= v) : (value.value >>>= v)
      },
      "|=": function _(value, v) {
        return value instanceof MemberValue ? (value.obj[value.prop] |= v) : (value.value |= v)
      },
      "^=": function _(value, v) {
        return value instanceof MemberValue ? (value.obj[value.prop] ^= v) : (value.value ^= v)
      },
      "&=": function _(value, v) {
        return value instanceof MemberValue ? (value.obj[value.prop] &= v) : (value.value &= v)
      },
    },
    AssignmentExpression: function AssignmentExpression(nodeIterator) {
      var node = nodeIterator.node
      var value = getIdentifierOrMemberExpressionValue(node.left, nodeIterator)
      return NodeHandler.AssignmentExpressionOperatortraverseMap[node.operator](
        value,
        nodeIterator.traverse(node.right)
      )
    },
    UnaryExpressionOperatortraverseMap: {
      "-": function _(nodeIterator) {
        return -nodeIterator.traverse(nodeIterator.node.argument)
      },
      "+": function _(nodeIterator) {
        return +nodeIterator.traverse(nodeIterator.node.argument)
      },
      "!": function _(nodeIterator) {
        return !nodeIterator.traverse(nodeIterator.node.argument)
      },
      "~": function _(nodeIterator) {
        return ~nodeIterator.traverse(nodeIterator.node.argument)
      },
      typeof: function _typeof(nodeIterator) {
        if (nodeIterator.node.argument.type === "Identifier") {
          try {
            var value = nodeIterator.scope.get(nodeIterator.node.argument.name)
            return value ? _typeof_1(value.value) : "undefined"
          } catch (err) {
            if (err.message === "".concat(nodeIterator.node.argument.name, " is not defined")) {
              return "undefined"
            } else {
              throw err
            }
          }
        } else {
          return _typeof_1(nodeIterator.traverse(nodeIterator.node.argument))
        }
      },
      void: function _void(nodeIterator) {
        return void nodeIterator.traverse(nodeIterator.node.argument)
      },
      delete: function _delete(nodeIterator) {
        var argument = nodeIterator.node.argument

        if (argument.type === "MemberExpression") {
          var obj = nodeIterator.traverse(argument.object)
          var name = getPropertyName(argument, nodeIterator)
          return delete obj[name]
        } else if (argument.type === "Identifier") {
          return false
        } else if (argument.type === "Literal") {
          return true
        }
      },
    },
    UnaryExpression: function UnaryExpression(nodeIterator) {
      return NodeHandler.UnaryExpressionOperatortraverseMap[nodeIterator.node.operator](
        nodeIterator
      )
    },
    BinaryExpressionOperatortraverseMap: {
      "==": function _(a, b) {
        return a == b
      },
      "!=": function _(a, b) {
        return a != b
      },
      "===": function _(a, b) {
        return a === b
      },
      "!==": function _(a, b) {
        return a !== b
      },
      "<": function _(a, b) {
        return a < b
      },
      "<=": function _(a, b) {
        return a <= b
      },
      ">": function _(a, b) {
        return a > b
      },
      ">=": function _(a, b) {
        return a >= b
      },
      "<<": function _(a, b) {
        return a << b
      },
      ">>": function _(a, b) {
        return a >> b
      },
      ">>>": function _(a, b) {
        return a >>> b
      },
      "+": function _(a, b) {
        return a + b
      },
      "-": function _(a, b) {
        return a - b
      },
      "*": function _(a, b) {
        return a * b
      },
      "/": function _(a, b) {
        return a / b
      },
      "%": function _(a, b) {
        return a % b
      },
      "**": function _(a, b) {
        throw new Error('canjs: es5 doesn\'t supports operator "**"')
      },
      "|": function _(a, b) {
        return a | b
      },
      "^": function _(a, b) {
        return a ^ b
      },
      "&": function _(a, b) {
        return a & b
      },
      in: function _in(a, b) {
        return a in b
      },
      instanceof: function _instanceof(a, b) {
        return a instanceof b
      },
    },
    BinaryExpression: function BinaryExpression(nodeIterator) {
      var a = nodeIterator.traverse(nodeIterator.node.left)
      var b = nodeIterator.traverse(nodeIterator.node.right)
      return NodeHandler.BinaryExpressionOperatortraverseMap[nodeIterator.node.operator](a, b)
    },
    LogicalExpressionOperatortraverseMap: {
      "||": function _(a, b) {
        return a || b
      },
      "&&": function _(a, b) {
        return a && b
      },
    },
    LogicalExpression: function LogicalExpression(nodeIterator) {
      var a = nodeIterator.traverse(nodeIterator.node.left)
      var b = nodeIterator.traverse(nodeIterator.node.right)
      return NodeHandler.LogicalExpressionOperatortraverseMap[nodeIterator.node.operator](a, b)
    },
    ForStatement: function ForStatement(nodeIterator) {
      var node = nodeIterator.node
      var scope = nodeIterator.scope

      if (node.init && node.init.type === "VariableDeclaration" && node.init.kind !== "var") {
        scope = nodeIterator.createScope("block")
      }

      for (
        node.init &&
        nodeIterator.traverse(node.init, {
          scope: scope,
        });
        node.test
          ? nodeIterator.traverse(node.test, {
              scope: scope,
            })
          : true;
        node.update &&
        nodeIterator.traverse(node.update, {
          scope: scope,
        })
      ) {
        var signal = nodeIterator.traverse(node.body, {
          scope: scope,
        })

        if (Signal.isBreak(signal)) {
          break
        } else if (Signal.isContinue(signal)) {
          continue
        } else if (Signal.isReturn(signal)) {
          return signal
        }
      }
    },
    ForInStatement: function ForInStatement(nodeIterator) {
      var _nodeIterator$node = nodeIterator.node,
        left = _nodeIterator$node.left,
        right = _nodeIterator$node.right,
        body = _nodeIterator$node.body
      var scope = nodeIterator.scope
      var value

      if (left.type === "VariableDeclaration") {
        var id = left.declarations[0].id
        value = scope.declare(id.name, undefined, left.kind)
      } else if (left.type === "Identifier") {
        value = scope.get(left.name, true)
      } else {
        throw new Error('canjs: [ForInStatement] Unsupported left type "'.concat(left.type, '"'))
      }

      for (var key in nodeIterator.traverse(right)) {
        value.value = key
        var signal = nodeIterator.traverse(body, {
          scope: scope,
        })

        if (Signal.isBreak(signal)) {
          break
        } else if (Signal.isContinue(signal)) {
          continue
        } else if (Signal.isReturn(signal)) {
          return signal
        }
      }
    },
    WhileStatement: function WhileStatement(nodeIterator) {
      while (nodeIterator.traverse(nodeIterator.node.test)) {
        var signal = nodeIterator.traverse(nodeIterator.node.body)

        if (Signal.isBreak(signal)) {
          break
        } else if (Signal.isContinue(signal)) {
          continue
        } else if (Signal.isReturn(signal)) {
          return signal
        }
      }
    },
    DoWhileStatement: function DoWhileStatement(nodeIterator) {
      do {
        var signal = nodeIterator.traverse(nodeIterator.node.body)

        if (Signal.isBreak(signal)) {
          break
        } else if (Signal.isContinue(signal)) {
          continue
        } else if (Signal.isReturn(signal)) {
          return signal
        }
      } while (nodeIterator.traverse(nodeIterator.node.test))
    },
    ReturnStatement: function ReturnStatement(nodeIterator) {
      var value

      if (nodeIterator.node.argument) {
        value = nodeIterator.traverse(nodeIterator.node.argument)
      }

      return Signal.Return(value)
    },
    BreakStatement: function BreakStatement(nodeIterator) {
      var label

      if (nodeIterator.node.label) {
        label = nodeIterator.node.label.name
      }

      return Signal.Break(label)
    },
    ContinueStatement: function ContinueStatement(nodeIterator) {
      var label

      if (nodeIterator.node.label) {
        label = nodeIterator.node.label.name
      }

      return Signal.Continue(label)
    },
    IfStatement: function IfStatement(nodeIterator) {
      if (nodeIterator.traverse(nodeIterator.node.test)) {
        return nodeIterator.traverse(nodeIterator.node.consequent)
      } else if (nodeIterator.node.alternate) {
        return nodeIterator.traverse(nodeIterator.node.alternate)
      }
    },
    SwitchStatement: function SwitchStatement(nodeIterator) {
      var discriminant = nodeIterator.traverse(nodeIterator.node.discriminant)

      var _iterator8 = _createForOfIteratorHelper(nodeIterator.node.cases),
        _step8

      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done; ) {
          var theCase = _step8.value

          if (!theCase.test || discriminant === nodeIterator.traverse(theCase.test)) {
            var signal = nodeIterator.traverse(theCase)

            if (Signal.isBreak(signal)) {
              break
            } else if (Signal.isContinue(signal)) {
              continue
            } else if (Signal.isReturn(signal)) {
              return signal
            }
          }
        }
      } catch (err) {
        _iterator8.e(err)
      } finally {
        _iterator8.f()
      }
    },
    SwitchCase: function SwitchCase(nodeIterator) {
      var _iterator9 = _createForOfIteratorHelper(nodeIterator.node.consequent),
        _step9

      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done; ) {
          var node = _step9.value
          var signal = nodeIterator.traverse(node)

          if (Signal.isSignal(signal)) {
            return signal
          }
        }
      } catch (err) {
        _iterator9.e(err)
      } finally {
        _iterator9.f()
      }
    },
    ConditionalExpression: function ConditionalExpression(nodeIterator) {
      return nodeIterator.traverse(nodeIterator.node.test)
        ? nodeIterator.traverse(nodeIterator.node.consequent)
        : nodeIterator.traverse(nodeIterator.node.alternate)
    },
    ThrowStatement: function ThrowStatement(nodeIterator) {
      throw nodeIterator.traverse(nodeIterator.node.argument)
    },
    TryStatement: function TryStatement(nodeIterator) {
      var _nodeIterator$node2 = nodeIterator.node,
        block = _nodeIterator$node2.block,
        handler = _nodeIterator$node2.handler,
        finalizer = _nodeIterator$node2.finalizer

      try {
        return nodeIterator.traverse(block)
      } catch (err) {
        if (handler) {
          var param = handler.param
          var scope = nodeIterator.createScope("block")
          scope.letDeclare(param.name, err)
          return nodeIterator.traverse(handler, {
            scope: scope,
          })
        }

        throw err
      } finally {
        if (finalizer) {
          return nodeIterator.traverse(finalizer)
        }
      }
    },
    CatchClause: function CatchClause(nodeIterator) {
      return nodeIterator.traverse(nodeIterator.node.body)
    },
  }

  function getPropertyName(node, nodeIterator) {
    if (node.computed) {
      return nodeIterator.traverse(node.property)
    } else {
      return node.property.name
    }
  }

  function getIdentifierOrMemberExpressionValue(node, nodeIterator) {
    if (node.type === "Identifier") {
      return nodeIterator.scope.get(node.name)
    } else if (node.type === "MemberExpression") {
      var obj = nodeIterator.traverse(node.object)
      var name = getPropertyName(node, nodeIterator)
      return new MemberValue(obj, name)
    } else {
      throw new Error('canjs: Not support to get value of node type "'.concat(node.type, '"'))
    }
  }

  var NodeIterator = /*#__PURE__*/ (function () {
    function NodeIterator(node, scope) {
      classCallCheck(this, NodeIterator)

      this.node = node
      this.scope = scope
      this.nodeHandler = NodeHandler
    }

    createClass(NodeIterator, [
      {
        key: "traverse",
        value: function traverse(node) {
          var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
          var scope = options.scope || this.scope
          var nodeIterator = new NodeIterator(node, scope)
          var _eval = this.nodeHandler[node.type]

          if (!_eval) {
            throw new Error('canjs: Unknown node type "'.concat(node.type, '".'))
          }

          return _eval(nodeIterator)
        },
      },
      {
        key: "createScope",
        value: function createScope() {
          var blockType =
            arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "block"
          return new Scope(blockType, this.scope)
        },
      },
    ])

    return NodeIterator
  })()

  var HsunaJS = {
    // 解析方法
    parse: function parse(ast) {
      var extraDeclaration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
      var globalScope = new Scope("function")
      Object.keys(extraDeclaration).forEach(function (key) {
        globalScope.addDeclaration(key, extraDeclaration[key])
      })
      var nodeIterator = new NodeIterator(null, globalScope)
      return nodeIterator.traverse(ast)
    },
    // 版本
    verison: "1.0.0",
  }

  return HsunaJS
})
