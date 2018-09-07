(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
"use strict";

require("core-js/shim");

require("regenerator-runtime/runtime");

require("core-js/fn/regexp/escape");

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;

var DEFINE_PROPERTY = "defineProperty";
function define(O, key, value) {
  O[key] || Object[DEFINE_PROPERTY](O, key, {
    writable: true,
    configurable: true,
    value: value
  });
}

define(String.prototype, "padLeft", "".padStart);
define(String.prototype, "padRight", "".padEnd);

"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
  [][key] && define(Array, key, Function.call.bind([][key]));
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"core-js/fn/regexp/escape":7,"core-js/shim":330,"regenerator-runtime/runtime":2}],2:[function(require,module,exports){
(function (global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){
var document = require('global/document')
var hyperx = require('hyperx')
var onload = require('on-load')

var SVGNS = 'http://www.w3.org/2000/svg'
var XLINKNS = 'http://www.w3.org/1999/xlink'

var BOOL_PROPS = {
  autofocus: 1,
  checked: 1,
  defaultchecked: 1,
  disabled: 1,
  formnovalidate: 1,
  indeterminate: 1,
  readonly: 1,
  required: 1,
  selected: 1,
  willvalidate: 1
}
var COMMENT_TAG = '!--'
var SVG_TAGS = [
  'svg',
  'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
  'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile',
  'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
  'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting',
  'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB',
  'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode',
  'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting',
  'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face',
  'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri',
  'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line',
  'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath',
  'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect',
  'set', 'stop', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref',
  'tspan', 'use', 'view', 'vkern'
]

function belCreateElement (tag, props, children) {
  var el

  // If an svg tag, it needs a namespace
  if (SVG_TAGS.indexOf(tag) !== -1) {
    props.namespace = SVGNS
  }

  // If we are using a namespace
  var ns = false
  if (props.namespace) {
    ns = props.namespace
    delete props.namespace
  }

  // Create the element
  if (ns) {
    el = document.createElementNS(ns, tag)
  } else if (tag === COMMENT_TAG) {
    return document.createComment(props.comment)
  } else {
    el = document.createElement(tag)
  }

  // If adding onload events
  if (props.onload || props.onunload) {
    var load = props.onload || function () {}
    var unload = props.onunload || function () {}
    onload(el, function belOnload () {
      load(el)
    }, function belOnunload () {
      unload(el)
    },
    // We have to use non-standard `caller` to find who invokes `belCreateElement`
    belCreateElement.caller.caller.caller)
    delete props.onload
    delete props.onunload
  }

  // Create the properties
  for (var p in props) {
    if (props.hasOwnProperty(p)) {
      var key = p.toLowerCase()
      var val = props[p]
      // Normalize className
      if (key === 'classname') {
        key = 'class'
        p = 'class'
      }
      // The for attribute gets transformed to htmlFor, but we just set as for
      if (p === 'htmlFor') {
        p = 'for'
      }
      // If a property is boolean, set itself to the key
      if (BOOL_PROPS[key]) {
        if (val === 'true') val = key
        else if (val === 'false') continue
      }
      // If a property prefers being set directly vs setAttribute
      if (key.slice(0, 2) === 'on') {
        el[p] = val
      } else {
        if (ns) {
          if (p === 'xlink:href') {
            el.setAttributeNS(XLINKNS, p, val)
          } else if (/^xmlns($|:)/i.test(p)) {
            // skip xmlns definitions
          } else {
            el.setAttributeNS(null, p, val)
          }
        } else {
          el.setAttribute(p, val)
        }
      }
    }
  }

  function appendChild (childs) {
    if (!Array.isArray(childs)) return
    for (var i = 0; i < childs.length; i++) {
      var node = childs[i]
      if (Array.isArray(node)) {
        appendChild(node)
        continue
      }

      if (typeof node === 'number' ||
        typeof node === 'boolean' ||
        typeof node === 'function' ||
        node instanceof Date ||
        node instanceof RegExp) {
        node = node.toString()
      }

      if (typeof node === 'string') {
        if (el.lastChild && el.lastChild.nodeName === '#text') {
          el.lastChild.nodeValue += node
          continue
        }
        node = document.createTextNode(node)
      }

      if (node && node.nodeType) {
        el.appendChild(node)
      }
    }
  }
  appendChild(children)

  return el
}

module.exports = hyperx(belCreateElement, {comments: true})
module.exports.default = module.exports
module.exports.createElement = belCreateElement

},{"global/document":332,"hyperx":335,"on-load":338}],4:[function(require,module,exports){

},{}],5:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4}],6:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],7:[function(require,module,exports){
require('../../modules/core.regexp.escape');
module.exports = require('../../modules/_core').RegExp.escape;

},{"../../modules/_core":28,"../../modules/core.regexp.escape":133}],8:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],9:[function(require,module,exports){
var cof = require('./_cof');
module.exports = function (it, msg) {
  if (typeof it != 'number' && cof(it) != 'Number') throw TypeError(msg);
  return +it;
};

},{"./_cof":23}],10:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

},{"./_hide":47,"./_wks":131}],11:[function(require,module,exports){
module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

},{}],12:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":56}],13:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var toObject = require('./_to-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');

module.exports = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = toLength(O.length);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = Math.min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else delete O[to];
    to += inc;
    from += inc;
  } return O;
};

},{"./_to-absolute-index":116,"./_to-length":120,"./_to-object":121}],14:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = require('./_to-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var aLen = arguments.length;
  var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
  var end = aLen > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

},{"./_to-absolute-index":116,"./_to-length":120,"./_to-object":121}],15:[function(require,module,exports){
var forOf = require('./_for-of');

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

},{"./_for-of":44}],16:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":116,"./_to-iobject":119,"./_to-length":120}],17:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = require('./_ctx');
var IObject = require('./_iobject');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var asc = require('./_array-species-create');
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

},{"./_array-species-create":20,"./_ctx":30,"./_iobject":52,"./_to-length":120,"./_to-object":121}],18:[function(require,module,exports){
var aFunction = require('./_a-function');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var toLength = require('./_to-length');

module.exports = function (that, callbackfn, aLen, memo, isRight) {
  aFunction(callbackfn);
  var O = toObject(that);
  var self = IObject(O);
  var length = toLength(O.length);
  var index = isRight ? length - 1 : 0;
  var i = isRight ? -1 : 1;
  if (aLen < 2) for (;;) {
    if (index in self) {
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if (isRight ? index < 0 : length <= index) {
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for (;isRight ? index >= 0 : length > index; index += i) if (index in self) {
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};

},{"./_a-function":8,"./_iobject":52,"./_to-length":120,"./_to-object":121}],19:[function(require,module,exports){
var isObject = require('./_is-object');
var isArray = require('./_is-array');
var SPECIES = require('./_wks')('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

},{"./_is-array":54,"./_is-object":56,"./_wks":131}],20:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

},{"./_array-species-constructor":19}],21:[function(require,module,exports){
'use strict';
var aFunction = require('./_a-function');
var isObject = require('./_is-object');
var invoke = require('./_invoke');
var arraySlice = [].slice;
var factories = {};

var construct = function (F, len, args) {
  if (!(len in factories)) {
    for (var n = [], i = 0; i < len; i++) n[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = arraySlice.call(arguments, 1);
  var bound = function (/* args... */) {
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if (isObject(fn.prototype)) bound.prototype = fn.prototype;
  return bound;
};

},{"./_a-function":8,"./_invoke":51,"./_is-object":56}],22:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":23,"./_wks":131}],23:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],24:[function(require,module,exports){
'use strict';
var dP = require('./_object-dp').f;
var create = require('./_object-create');
var redefineAll = require('./_redefine-all');
var ctx = require('./_ctx');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var $iterDefine = require('./_iter-define');
var step = require('./_iter-step');
var setSpecies = require('./_set-species');
var DESCRIPTORS = require('./_descriptors');
var fastKey = require('./_meta').fastKey;
var validate = require('./_validate-collection');
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

},{"./_an-instance":11,"./_ctx":30,"./_descriptors":34,"./_for-of":44,"./_iter-define":60,"./_iter-step":62,"./_meta":70,"./_object-create":75,"./_object-dp":76,"./_redefine-all":95,"./_set-species":102,"./_validate-collection":128}],25:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = require('./_classof');
var from = require('./_array-from-iterable');
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

},{"./_array-from-iterable":15,"./_classof":22}],26:[function(require,module,exports){
'use strict';
var redefineAll = require('./_redefine-all');
var getWeak = require('./_meta').getWeak;
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var createArrayMethod = require('./_array-methods');
var $has = require('./_has');
var validate = require('./_validate-collection');
var arrayFind = createArrayMethod(5);
var arrayFindIndex = createArrayMethod(6);
var id = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (that) {
  return that._l || (that._l = new UncaughtFrozenStore());
};
var UncaughtFrozenStore = function () {
  this.a = [];
};
var findUncaughtFrozen = function (store, key) {
  return arrayFind(store.a, function (it) {
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function (key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function (key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function (key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function (key) {
    var index = arrayFindIndex(this.a, function (it) {
      return it[0] === key;
    });
    if (~index) this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;      // collection type
      that._i = id++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function (key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME))['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME)).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var data = getWeak(anObject(key), true);
    if (data === true) uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};

},{"./_an-instance":11,"./_an-object":12,"./_array-methods":17,"./_for-of":44,"./_has":46,"./_is-object":56,"./_meta":70,"./_redefine-all":95,"./_validate-collection":128}],27:[function(require,module,exports){
'use strict';
var global = require('./_global');
var $export = require('./_export');
var redefine = require('./_redefine');
var redefineAll = require('./_redefine-all');
var meta = require('./_meta');
var forOf = require('./_for-of');
var anInstance = require('./_an-instance');
var isObject = require('./_is-object');
var fails = require('./_fails');
var $iterDetect = require('./_iter-detect');
var setToStringTag = require('./_set-to-string-tag');
var inheritIfRequired = require('./_inherit-if-required');

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function (KEY) {
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function (a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a) {
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = $iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

},{"./_an-instance":11,"./_export":38,"./_fails":40,"./_for-of":44,"./_global":45,"./_inherit-if-required":50,"./_is-object":56,"./_iter-detect":61,"./_meta":70,"./_redefine":96,"./_redefine-all":95,"./_set-to-string-tag":103}],28:[function(require,module,exports){
var core = module.exports = { version: '2.5.5' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],29:[function(require,module,exports){
'use strict';
var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

},{"./_object-dp":76,"./_property-desc":94}],30:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":8}],31:[function(require,module,exports){
'use strict';
// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var fails = require('./_fails');
var getTime = Date.prototype.getTime;
var $toISOString = Date.prototype.toISOString;

var lz = function (num) {
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
module.exports = (fails(function () {
  return $toISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
}) || !fails(function () {
  $toISOString.call(new Date(NaN));
})) ? function toISOString() {
  if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
  var d = this;
  var y = d.getUTCFullYear();
  var m = d.getUTCMilliseconds();
  var s = y < 0 ? '-' : y > 9999 ? '+' : '';
  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
    '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
    'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
    ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
} : $toISOString;

},{"./_fails":40}],32:[function(require,module,exports){
'use strict';
var anObject = require('./_an-object');
var toPrimitive = require('./_to-primitive');
var NUMBER = 'number';

module.exports = function (hint) {
  if (hint !== 'string' && hint !== NUMBER && hint !== 'default') throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};

},{"./_an-object":12,"./_to-primitive":122}],33:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],34:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":40}],35:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":45,"./_is-object":56}],36:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],37:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

},{"./_object-gops":82,"./_object-keys":85,"./_object-pie":86}],38:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var hide = require('./_hide');
var redefine = require('./_redefine');
var ctx = require('./_ctx');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":28,"./_ctx":30,"./_global":45,"./_hide":47,"./_redefine":96}],39:[function(require,module,exports){
var MATCH = require('./_wks')('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};

},{"./_wks":131}],40:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],41:[function(require,module,exports){
'use strict';
var hide = require('./_hide');
var redefine = require('./_redefine');
var fails = require('./_fails');
var defined = require('./_defined');
var wks = require('./_wks');

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);
  var fns = exec(defined, SYMBOL, ''[KEY]);
  var strfn = fns[0];
  var rxfn = fns[1];
  if (fails(function () {
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  })) {
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};

},{"./_defined":33,"./_fails":40,"./_hide":47,"./_redefine":96,"./_wks":131}],42:[function(require,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = require('./_an-object');
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

},{"./_an-object":12}],43:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
var isArray = require('./_is-array');
var isObject = require('./_is-object');
var toLength = require('./_to-length');
var ctx = require('./_ctx');
var IS_CONCAT_SPREADABLE = require('./_wks')('isConcatSpreadable');

function flattenIntoArray(target, original, source, sourceLen, start, depth, mapper, thisArg) {
  var targetIndex = start;
  var sourceIndex = 0;
  var mapFn = mapper ? ctx(mapper, thisArg, 3) : false;
  var element, spreadable;

  while (sourceIndex < sourceLen) {
    if (sourceIndex in source) {
      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

      spreadable = false;
      if (isObject(element)) {
        spreadable = element[IS_CONCAT_SPREADABLE];
        spreadable = spreadable !== undefined ? !!spreadable : isArray(element);
      }

      if (spreadable && depth > 0) {
        targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
      } else {
        if (targetIndex >= 0x1fffffffffffff) throw TypeError();
        target[targetIndex] = element;
      }

      targetIndex++;
    }
    sourceIndex++;
  }
  return targetIndex;
}

module.exports = flattenIntoArray;

},{"./_ctx":30,"./_is-array":54,"./_is-object":56,"./_to-length":120,"./_wks":131}],44:[function(require,module,exports){
var ctx = require('./_ctx');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var anObject = require('./_an-object');
var toLength = require('./_to-length');
var getIterFn = require('./core.get-iterator-method');
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;

},{"./_an-object":12,"./_ctx":30,"./_is-array-iter":53,"./_iter-call":58,"./_to-length":120,"./core.get-iterator-method":132}],45:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],46:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],47:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":34,"./_object-dp":76,"./_property-desc":94}],48:[function(require,module,exports){
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":45}],49:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":34,"./_dom-create":35,"./_fails":40}],50:[function(require,module,exports){
var isObject = require('./_is-object');
var setPrototypeOf = require('./_set-proto').set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};

},{"./_is-object":56,"./_set-proto":101}],51:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

},{}],52:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":23}],53:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":63,"./_wks":131}],54:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":23}],55:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./_is-object');
var floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};

},{"./_is-object":56}],56:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],57:[function(require,module,exports){
// 7.2.8 IsRegExp(argument)
var isObject = require('./_is-object');
var cof = require('./_cof');
var MATCH = require('./_wks')('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};

},{"./_cof":23,"./_is-object":56,"./_wks":131}],58:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":12}],59:[function(require,module,exports){
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":47,"./_object-create":75,"./_property-desc":94,"./_set-to-string-tag":103,"./_wks":131}],60:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":38,"./_hide":47,"./_iter-create":59,"./_iterators":63,"./_library":64,"./_object-gpo":83,"./_redefine":96,"./_set-to-string-tag":103,"./_wks":131}],61:[function(require,module,exports){
var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

},{"./_wks":131}],62:[function(require,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],63:[function(require,module,exports){
module.exports = {};

},{}],64:[function(require,module,exports){
module.exports = false;

},{}],65:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x) {
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;

},{}],66:[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var sign = require('./_math-sign');
var pow = Math.pow;
var EPSILON = pow(2, -52);
var EPSILON32 = pow(2, -23);
var MAX32 = pow(2, 127) * (2 - EPSILON32);
var MIN32 = pow(2, -126);

var roundTiesToEven = function (n) {
  return n + 1 / EPSILON - 1 / EPSILON;
};

module.exports = Math.fround || function fround(x) {
  var $abs = Math.abs(x);
  var $sign = sign(x);
  var a, result;
  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
  a = (1 + EPSILON32 / EPSILON) * $abs;
  result = a - (a - $abs);
  // eslint-disable-next-line no-self-compare
  if (result > MAX32 || result != result) return $sign * Infinity;
  return $sign * result;
};

},{"./_math-sign":69}],67:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x) {
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};

},{}],68:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
module.exports = Math.scale || function scale(x, inLow, inHigh, outLow, outHigh) {
  if (
    arguments.length === 0
      // eslint-disable-next-line no-self-compare
      || x != x
      // eslint-disable-next-line no-self-compare
      || inLow != inLow
      // eslint-disable-next-line no-self-compare
      || inHigh != inHigh
      // eslint-disable-next-line no-self-compare
      || outLow != outLow
      // eslint-disable-next-line no-self-compare
      || outHigh != outHigh
  ) return NaN;
  if (x === Infinity || x === -Infinity) return x;
  return (x - inLow) * (outHigh - outLow) / (inHigh - inLow) + outLow;
};

},{}],69:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};

},{}],70:[function(require,module,exports){
var META = require('./_uid')('meta');
var isObject = require('./_is-object');
var has = require('./_has');
var setDesc = require('./_object-dp').f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !require('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

},{"./_fails":40,"./_has":46,"./_is-object":56,"./_object-dp":76,"./_uid":126}],71:[function(require,module,exports){
var Map = require('./es6.map');
var $export = require('./_export');
var shared = require('./_shared')('metadata');
var store = shared.store || (shared.store = new (require('./es6.weak-map'))());

var getOrCreateMetadataMap = function (target, targetKey, create) {
  var targetMetadata = store.get(target);
  if (!targetMetadata) {
    if (!create) return undefined;
    store.set(target, targetMetadata = new Map());
  }
  var keyMetadata = targetMetadata.get(targetKey);
  if (!keyMetadata) {
    if (!create) return undefined;
    targetMetadata.set(targetKey, keyMetadata = new Map());
  } return keyMetadata;
};
var ordinaryHasOwnMetadata = function (MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
};
var ordinaryGetOwnMetadata = function (MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
};
var ordinaryDefineOwnMetadata = function (MetadataKey, MetadataValue, O, P) {
  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
};
var ordinaryOwnMetadataKeys = function (target, targetKey) {
  var metadataMap = getOrCreateMetadataMap(target, targetKey, false);
  var keys = [];
  if (metadataMap) metadataMap.forEach(function (_, key) { keys.push(key); });
  return keys;
};
var toMetaKey = function (it) {
  return it === undefined || typeof it == 'symbol' ? it : String(it);
};
var exp = function (O) {
  $export($export.S, 'Reflect', O);
};

module.exports = {
  store: store,
  map: getOrCreateMetadataMap,
  has: ordinaryHasOwnMetadata,
  get: ordinaryGetOwnMetadata,
  set: ordinaryDefineOwnMetadata,
  keys: ordinaryOwnMetadataKeys,
  key: toMetaKey,
  exp: exp
};

},{"./_export":38,"./_shared":105,"./es6.map":163,"./es6.weak-map":269}],72:[function(require,module,exports){
var global = require('./_global');
var macrotask = require('./_task').set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = require('./_cof')(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

},{"./_cof":23,"./_global":45,"./_task":115}],73:[function(require,module,exports){
'use strict';
// 25.4.1.5 NewPromiseCapability(C)
var aFunction = require('./_a-function');

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"./_a-function":8}],74:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

},{"./_fails":40,"./_iobject":52,"./_object-gops":82,"./_object-keys":85,"./_object-pie":86,"./_to-object":121}],75:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":12,"./_dom-create":35,"./_enum-bug-keys":36,"./_html":48,"./_object-dps":77,"./_shared-key":104}],76:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":12,"./_descriptors":34,"./_ie8-dom-define":49,"./_to-primitive":122}],77:[function(require,module,exports){
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":12,"./_descriptors":34,"./_object-dp":76,"./_object-keys":85}],78:[function(require,module,exports){
'use strict';
// Forced replacement prototype accessors methods
module.exports = require('./_library') || !require('./_fails')(function () {
  var K = Math.random();
  // In FF throws only define methods
  // eslint-disable-next-line no-undef, no-useless-call
  __defineSetter__.call(null, K, function () { /* empty */ });
  delete require('./_global')[K];
});

},{"./_fails":40,"./_global":45,"./_library":64}],79:[function(require,module,exports){
var pIE = require('./_object-pie');
var createDesc = require('./_property-desc');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var has = require('./_has');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

},{"./_descriptors":34,"./_has":46,"./_ie8-dom-define":49,"./_object-pie":86,"./_property-desc":94,"./_to-iobject":119,"./_to-primitive":122}],80:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject');
var gOPN = require('./_object-gopn').f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":81,"./_to-iobject":119}],81:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = require('./_object-keys-internal');
var hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

},{"./_enum-bug-keys":36,"./_object-keys-internal":84}],82:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],83:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":46,"./_shared-key":104,"./_to-object":121}],84:[function(require,module,exports){
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":16,"./_has":46,"./_shared-key":104,"./_to-iobject":119}],85:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":36,"./_object-keys-internal":84}],86:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;

},{}],87:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export');
var core = require('./_core');
var fails = require('./_fails');
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};

},{"./_core":28,"./_export":38,"./_fails":40}],88:[function(require,module,exports){
var getKeys = require('./_object-keys');
var toIObject = require('./_to-iobject');
var isEnum = require('./_object-pie').f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) if (isEnum.call(O, key = keys[i++])) {
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};

},{"./_object-keys":85,"./_object-pie":86,"./_to-iobject":119}],89:[function(require,module,exports){
// all object keys, includes non-enumerable and symbols
var gOPN = require('./_object-gopn');
var gOPS = require('./_object-gops');
var anObject = require('./_an-object');
var Reflect = require('./_global').Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = gOPN.f(anObject(it));
  var getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};

},{"./_an-object":12,"./_global":45,"./_object-gopn":81,"./_object-gops":82}],90:[function(require,module,exports){
var $parseFloat = require('./_global').parseFloat;
var $trim = require('./_string-trim').trim;

module.exports = 1 / $parseFloat(require('./_string-ws') + '-0') !== -Infinity ? function parseFloat(str) {
  var string = $trim(String(str), 3);
  var result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;

},{"./_global":45,"./_string-trim":113,"./_string-ws":114}],91:[function(require,module,exports){
var $parseInt = require('./_global').parseInt;
var $trim = require('./_string-trim').trim;
var ws = require('./_string-ws');
var hex = /^[-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;

},{"./_global":45,"./_string-trim":113,"./_string-ws":114}],92:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

},{}],93:[function(require,module,exports){
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var newPromiseCapability = require('./_new-promise-capability');

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"./_an-object":12,"./_is-object":56,"./_new-promise-capability":73}],94:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],95:[function(require,module,exports){
var redefine = require('./_redefine');
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};

},{"./_redefine":96}],96:[function(require,module,exports){
var global = require('./_global');
var hide = require('./_hide');
var has = require('./_has');
var SRC = require('./_uid')('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_core":28,"./_global":45,"./_has":46,"./_hide":47,"./_uid":126}],97:[function(require,module,exports){
module.exports = function (regExp, replace) {
  var replacer = replace === Object(replace) ? function (part) {
    return replace[part];
  } : replace;
  return function (it) {
    return String(it).replace(regExp, replacer);
  };
};

},{}],98:[function(require,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

},{}],99:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-setmap-offrom/
var $export = require('./_export');
var aFunction = require('./_a-function');
var ctx = require('./_ctx');
var forOf = require('./_for-of');

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
    var mapFn = arguments[1];
    var mapping, A, n, cb;
    aFunction(this);
    mapping = mapFn !== undefined;
    if (mapping) aFunction(mapFn);
    if (source == undefined) return new this();
    A = [];
    if (mapping) {
      n = 0;
      cb = ctx(mapFn, arguments[2], 2);
      forOf(source, false, function (nextItem) {
        A.push(cb(nextItem, n++));
      });
    } else {
      forOf(source, false, A.push, A);
    }
    return new this(A);
  } });
};

},{"./_a-function":8,"./_ctx":30,"./_export":38,"./_for-of":44}],100:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-setmap-offrom/
var $export = require('./_export');

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { of: function of() {
    var length = arguments.length;
    var A = new Array(length);
    while (length--) A[length] = arguments[length];
    return new this(A);
  } });
};

},{"./_export":38}],101:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object');
var anObject = require('./_an-object');
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

},{"./_an-object":12,"./_ctx":30,"./_is-object":56,"./_object-gopd":79}],102:[function(require,module,exports){
'use strict';
var global = require('./_global');
var dP = require('./_object-dp');
var DESCRIPTORS = require('./_descriptors');
var SPECIES = require('./_wks')('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"./_descriptors":34,"./_global":45,"./_object-dp":76,"./_wks":131}],103:[function(require,module,exports){
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":46,"./_object-dp":76,"./_wks":131}],104:[function(require,module,exports){
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":105,"./_uid":126}],105:[function(require,module,exports){
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};

},{"./_global":45}],106:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var SPECIES = require('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_a-function":8,"./_an-object":12,"./_wks":131}],107:[function(require,module,exports){
'use strict';
var fails = require('./_fails');

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};

},{"./_fails":40}],108:[function(require,module,exports){
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":33,"./_to-integer":118}],109:[function(require,module,exports){
// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./_is-regexp');
var defined = require('./_defined');

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};

},{"./_defined":33,"./_is-regexp":57}],110:[function(require,module,exports){
var $export = require('./_export');
var fails = require('./_fails');
var defined = require('./_defined');
var quot = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function (string, tag, attribute, value) {
  var S = String(defined(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function (NAME, exec) {
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function () {
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};

},{"./_defined":33,"./_export":38,"./_fails":40}],111:[function(require,module,exports){
// https://github.com/tc39/proposal-string-pad-start-end
var toLength = require('./_to-length');
var repeat = require('./_string-repeat');
var defined = require('./_defined');

module.exports = function (that, maxLength, fillString, left) {
  var S = String(defined(that));
  var stringLength = S.length;
  var fillStr = fillString === undefined ? ' ' : String(fillString);
  var intMaxLength = toLength(maxLength);
  if (intMaxLength <= stringLength || fillStr == '') return S;
  var fillLen = intMaxLength - stringLength;
  var stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};

},{"./_defined":33,"./_string-repeat":112,"./_to-length":120}],112:[function(require,module,exports){
'use strict';
var toInteger = require('./_to-integer');
var defined = require('./_defined');

module.exports = function repeat(count) {
  var str = String(defined(this));
  var res = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
  return res;
};

},{"./_defined":33,"./_to-integer":118}],113:[function(require,module,exports){
var $export = require('./_export');
var defined = require('./_defined');
var fails = require('./_fails');
var spaces = require('./_string-ws');
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;

},{"./_defined":33,"./_export":38,"./_fails":40,"./_string-ws":114}],114:[function(require,module,exports){
module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

},{}],115:[function(require,module,exports){
var ctx = require('./_ctx');
var invoke = require('./_invoke');
var html = require('./_html');
var cel = require('./_dom-create');
var global = require('./_global');
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (require('./_cof')(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

},{"./_cof":23,"./_ctx":30,"./_dom-create":35,"./_global":45,"./_html":48,"./_invoke":51}],116:[function(require,module,exports){
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":118}],117:[function(require,module,exports){
// https://tc39.github.io/ecma262/#sec-toindex
var toInteger = require('./_to-integer');
var toLength = require('./_to-length');
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toInteger(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length!');
  return length;
};

},{"./_to-integer":118,"./_to-length":120}],118:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],119:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":33,"./_iobject":52}],120:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":118}],121:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":33}],122:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":56}],123:[function(require,module,exports){
'use strict';
if (require('./_descriptors')) {
  var LIBRARY = require('./_library');
  var global = require('./_global');
  var fails = require('./_fails');
  var $export = require('./_export');
  var $typed = require('./_typed');
  var $buffer = require('./_typed-buffer');
  var ctx = require('./_ctx');
  var anInstance = require('./_an-instance');
  var propertyDesc = require('./_property-desc');
  var hide = require('./_hide');
  var redefineAll = require('./_redefine-all');
  var toInteger = require('./_to-integer');
  var toLength = require('./_to-length');
  var toIndex = require('./_to-index');
  var toAbsoluteIndex = require('./_to-absolute-index');
  var toPrimitive = require('./_to-primitive');
  var has = require('./_has');
  var classof = require('./_classof');
  var isObject = require('./_is-object');
  var toObject = require('./_to-object');
  var isArrayIter = require('./_is-array-iter');
  var create = require('./_object-create');
  var getPrototypeOf = require('./_object-gpo');
  var gOPN = require('./_object-gopn').f;
  var getIterFn = require('./core.get-iterator-method');
  var uid = require('./_uid');
  var wks = require('./_wks');
  var createArrayMethod = require('./_array-methods');
  var createArrayIncludes = require('./_array-includes');
  var speciesConstructor = require('./_species-constructor');
  var ArrayIterators = require('./es6.array.iterator');
  var Iterators = require('./_iterators');
  var $iterDetect = require('./_iter-detect');
  var setSpecies = require('./_set-species');
  var arrayFill = require('./_array-fill');
  var arrayCopyWithin = require('./_array-copy-within');
  var $DP = require('./_object-dp');
  var $GOPD = require('./_object-gopd');
  var dP = $DP.f;
  var gOPD = $GOPD.f;
  var RangeError = global.RangeError;
  var TypeError = global.TypeError;
  var Uint8Array = global.Uint8Array;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var PROTOTYPE = 'prototype';
  var ArrayProto = Array[PROTOTYPE];
  var $ArrayBuffer = $buffer.ArrayBuffer;
  var $DataView = $buffer.DataView;
  var arrayForEach = createArrayMethod(0);
  var arrayFilter = createArrayMethod(2);
  var arraySome = createArrayMethod(3);
  var arrayEvery = createArrayMethod(4);
  var arrayFind = createArrayMethod(5);
  var arrayFindIndex = createArrayMethod(6);
  var arrayIncludes = createArrayIncludes(true);
  var arrayIndexOf = createArrayIncludes(false);
  var arrayValues = ArrayIterators.values;
  var arrayKeys = ArrayIterators.keys;
  var arrayEntries = ArrayIterators.entries;
  var arrayLastIndexOf = ArrayProto.lastIndexOf;
  var arrayReduce = ArrayProto.reduce;
  var arrayReduceRight = ArrayProto.reduceRight;
  var arrayJoin = ArrayProto.join;
  var arraySort = ArrayProto.sort;
  var arraySlice = ArrayProto.slice;
  var arrayToString = ArrayProto.toString;
  var arrayToLocaleString = ArrayProto.toLocaleString;
  var ITERATOR = wks('iterator');
  var TAG = wks('toStringTag');
  var TYPED_CONSTRUCTOR = uid('typed_constructor');
  var DEF_CONSTRUCTOR = uid('def_constructor');
  var ALL_CONSTRUCTORS = $typed.CONSTR;
  var TYPED_ARRAY = $typed.TYPED;
  var VIEW = $typed.VIEW;
  var WRONG_LENGTH = 'Wrong length!';

  var $map = createArrayMethod(1, function (O, length) {
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function () {
    // eslint-disable-next-line no-undef
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
    new Uint8Array(1).set({});
  });

  var toOffset = function (it, BYTES) {
    var offset = toInteger(it);
    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function (it) {
    if (isObject(it) && TYPED_ARRAY in it) return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function (C, length) {
    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function (O, list) {
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function (C, list) {
    var index = 0;
    var length = list.length;
    var result = allocate(C, length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var addGetter = function (it, key, internal) {
    dP(it, key, { get: function () { return this._d[internal]; } });
  };

  var $from = function from(source /* , mapfn, thisArg */) {
    var O = toObject(source);
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iterFn = getIterFn(O);
    var i, length, values, result, step, iterator;
    if (iterFn != undefined && !isArrayIter(iterFn)) {
      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
        values.push(step.value);
      } O = values;
    }
    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/* ...items */) {
    var index = 0;
    var length = arguments.length;
    var result = allocate(this, length);
    while (length > index) result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function () { arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString() {
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /* , end */) {
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /* , thisArg */) {
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /* , start, end */) { // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /* , thisArg */) {
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /* , thisArg */) {
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /* , thisArg */) {
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /* , thisArg */) {
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /* , fromIndex */) {
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /* , fromIndex */) {
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator) { // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /* , fromIndex */) { // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /* , thisArg */) {
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse() {
      var that = this;
      var length = validate(that).length;
      var middle = Math.floor(length / 2);
      var index = 0;
      var value;
      while (index < middle) {
        value = that[index];
        that[index++] = that[--length];
        that[length] = value;
      } return that;
    },
    some: function some(callbackfn /* , thisArg */) {
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn) {
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end) {
      var O = validate(this);
      var length = O.length;
      var $begin = toAbsoluteIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end) {
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /* , offset */) {
    validate(this);
    var offset = toOffset(arguments[1], 1);
    var length = this.length;
    var src = toObject(arrayLike);
    var len = toLength(src.length);
    var index = 0;
    if (len + offset > length) throw RangeError(WRONG_LENGTH);
    while (index < len) this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries() {
      return arrayEntries.call(validate(this));
    },
    keys: function keys() {
      return arrayKeys.call(validate(this));
    },
    values: function values() {
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function (target, key) {
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key) {
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc) {
    if (isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ) {
      target[key] = desc.value;
      return target;
    } return dP(target, key, desc);
  };

  if (!ALL_CONSTRUCTORS) {
    $GOPD.f = $getDesc;
    $DP.f = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty: $setDesc
  });

  if (fails(function () { arrayToString.call({}); })) {
    arrayToString = arrayToLocaleString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice: $slice,
    set: $set,
    constructor: function () { /* noop */ },
    toString: arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function () { return this[TYPED_ARRAY]; }
  });

  // eslint-disable-next-line max-statements
  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
    CLAMPED = !!CLAMPED;
    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + KEY;
    var SETTER = 'set' + KEY;
    var TypedArray = global[NAME];
    var Base = TypedArray || {};
    var TAC = TypedArray && getPrototypeOf(TypedArray);
    var FORCED = !TypedArray || !$typed.ABV;
    var O = {};
    var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function (that, index) {
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function (that, index, value) {
      var data = that._d;
      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function (that, index) {
      dP(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if (FORCED) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME, '_d');
        var index = 0;
        var offset = 0;
        var buffer, byteLength, length, klass;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new $ArrayBuffer(byteLength);
        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (TYPED_ARRAY in data) {
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if (!fails(function () {
      TypedArray(1);
    }) || !fails(function () {
      new TypedArray(-1); // eslint-disable-line no-new
    }) || !$iterDetect(function (iter) {
      new TypedArray(); // eslint-disable-line no-new
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(1.5); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if (!isObject(data)) return new Base(toIndex(data));
        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator = TypedArrayPrototype[ITERATOR];
    var CORRECT_ITER_NAME = !!$nativeIterator
      && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
    var $iterator = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
      dP(TypedArrayPrototype, TAG, {
        get: function () { return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES
    });

    $export($export.S + $export.F * fails(function () { Base.of.call(TypedArray, 1); }), NAME, {
      from: $from,
      of: $of
    });

    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    if (!LIBRARY && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;

    $export($export.P + $export.F * fails(function () {
      new TypedArray(1).slice();
    }), NAME, { slice: $slice });

    $export($export.P + $export.F * (fails(function () {
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
    }) || !fails(function () {
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, { toLocaleString: $toLocaleString });

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function () { /* empty */ };

},{"./_an-instance":11,"./_array-copy-within":13,"./_array-fill":14,"./_array-includes":16,"./_array-methods":17,"./_classof":22,"./_ctx":30,"./_descriptors":34,"./_export":38,"./_fails":40,"./_global":45,"./_has":46,"./_hide":47,"./_is-array-iter":53,"./_is-object":56,"./_iter-detect":61,"./_iterators":63,"./_library":64,"./_object-create":75,"./_object-dp":76,"./_object-gopd":79,"./_object-gopn":81,"./_object-gpo":83,"./_property-desc":94,"./_redefine-all":95,"./_set-species":102,"./_species-constructor":106,"./_to-absolute-index":116,"./_to-index":117,"./_to-integer":118,"./_to-length":120,"./_to-object":121,"./_to-primitive":122,"./_typed":125,"./_typed-buffer":124,"./_uid":126,"./_wks":131,"./core.get-iterator-method":132,"./es6.array.iterator":144}],124:[function(require,module,exports){
'use strict';
var global = require('./_global');
var DESCRIPTORS = require('./_descriptors');
var LIBRARY = require('./_library');
var $typed = require('./_typed');
var hide = require('./_hide');
var redefineAll = require('./_redefine-all');
var fails = require('./_fails');
var anInstance = require('./_an-instance');
var toInteger = require('./_to-integer');
var toLength = require('./_to-length');
var toIndex = require('./_to-index');
var gOPN = require('./_object-gopn').f;
var dP = require('./_object-dp').f;
var arrayFill = require('./_array-fill');
var setToStringTag = require('./_set-to-string-tag');
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length!';
var WRONG_INDEX = 'Wrong index!';
var $ArrayBuffer = global[ARRAY_BUFFER];
var $DataView = global[DATA_VIEW];
var Math = global.Math;
var RangeError = global.RangeError;
// eslint-disable-next-line no-shadow-restricted-names
var Infinity = global.Infinity;
var BaseBuffer = $ArrayBuffer;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;
var BUFFER = 'buffer';
var BYTE_LENGTH = 'byteLength';
var BYTE_OFFSET = 'byteOffset';
var $BUFFER = DESCRIPTORS ? '_b' : BUFFER;
var $LENGTH = DESCRIPTORS ? '_l' : BYTE_LENGTH;
var $OFFSET = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
function packIEEE754(value, mLen, nBytes) {
  var buffer = new Array(nBytes);
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var i = 0;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  var e, m, c;
  value = abs(value);
  // eslint-disable-next-line no-self-compare
  if (value != value || value === Infinity) {
    // eslint-disable-next-line no-self-compare
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if (value * (c = pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
}
function unpackIEEE754(buffer, mLen, nBytes) {
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = eLen - 7;
  var i = nBytes - 1;
  var s = buffer[i--];
  var e = s & 127;
  var m;
  s >>= 7;
  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
}

function unpackI32(bytes) {
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
}
function packI8(it) {
  return [it & 0xff];
}
function packI16(it) {
  return [it & 0xff, it >> 8 & 0xff];
}
function packI32(it) {
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
}
function packF64(it) {
  return packIEEE754(it, 52, 8);
}
function packF32(it) {
  return packIEEE754(it, 23, 4);
}

function addGetter(C, key, internal) {
  dP(C[PROTOTYPE], key, { get: function () { return this[internal]; } });
}

function get(view, bytes, index, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
}
function set(view, bytes, index, conversion, value, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = conversion(+value);
  for (var i = 0; i < bytes; i++) store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
}

if (!$typed.ABV) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    this._b = arrayFill.call(new Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH];
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if (!fails(function () {
    $ArrayBuffer(1);
  }) || !fails(function () {
    new $ArrayBuffer(-1); // eslint-disable-line no-new
  }) || fails(function () {
    new $ArrayBuffer(); // eslint-disable-line no-new
    new $ArrayBuffer(1.5); // eslint-disable-line no-new
    new $ArrayBuffer(NaN); // eslint-disable-line no-new
    return $ArrayBuffer.name != ARRAY_BUFFER;
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer);
      return new BaseBuffer(toIndex(length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, BaseBuffer[key]);
    }
    if (!LIBRARY) ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if (view.getInt8(0) || !view.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;

},{"./_an-instance":11,"./_array-fill":14,"./_descriptors":34,"./_fails":40,"./_global":45,"./_hide":47,"./_library":64,"./_object-dp":76,"./_object-gopn":81,"./_redefine-all":95,"./_set-to-string-tag":103,"./_to-index":117,"./_to-integer":118,"./_to-length":120,"./_typed":125}],125:[function(require,module,exports){
var global = require('./_global');
var hide = require('./_hide');
var uid = require('./_uid');
var TYPED = uid('typed_array');
var VIEW = uid('view');
var ABV = !!(global.ArrayBuffer && global.DataView);
var CONSTR = ABV;
var i = 0;
var l = 9;
var Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while (i < l) {
  if (Typed = global[TypedArrayConstructors[i++]]) {
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV: ABV,
  CONSTR: CONSTR,
  TYPED: TYPED,
  VIEW: VIEW
};

},{"./_global":45,"./_hide":47,"./_uid":126}],126:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],127:[function(require,module,exports){
var global = require('./_global');
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';

},{"./_global":45}],128:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

},{"./_is-object":56}],129:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var LIBRARY = require('./_library');
var wksExt = require('./_wks-ext');
var defineProperty = require('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

},{"./_core":28,"./_global":45,"./_library":64,"./_object-dp":76,"./_wks-ext":130}],130:[function(require,module,exports){
exports.f = require('./_wks');

},{"./_wks":131}],131:[function(require,module,exports){
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":45,"./_shared":105,"./_uid":126}],132:[function(require,module,exports){
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":22,"./_core":28,"./_iterators":63,"./_wks":131}],133:[function(require,module,exports){
// https://github.com/benjamingr/RexExp.escape
var $export = require('./_export');
var $re = require('./_replacer')(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', { escape: function escape(it) { return $re(it); } });

},{"./_export":38,"./_replacer":97}],134:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { copyWithin: require('./_array-copy-within') });

require('./_add-to-unscopables')('copyWithin');

},{"./_add-to-unscopables":10,"./_array-copy-within":13,"./_export":38}],135:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $every = require('./_array-methods')(4);

$export($export.P + $export.F * !require('./_strict-method')([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */) {
    return $every(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":17,"./_export":38,"./_strict-method":107}],136:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { fill: require('./_array-fill') });

require('./_add-to-unscopables')('fill');

},{"./_add-to-unscopables":10,"./_array-fill":14,"./_export":38}],137:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $filter = require('./_array-methods')(2);

$export($export.P + $export.F * !require('./_strict-method')([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":17,"./_export":38,"./_strict-method":107}],138:[function(require,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = require('./_export');
var $find = require('./_array-methods')(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);

},{"./_add-to-unscopables":10,"./_array-methods":17,"./_export":38}],139:[function(require,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = require('./_export');
var $find = require('./_array-methods')(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);

},{"./_add-to-unscopables":10,"./_array-methods":17,"./_export":38}],140:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $forEach = require('./_array-methods')(0);
var STRICT = require('./_strict-method')([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":17,"./_export":38,"./_strict-method":107}],141:[function(require,module,exports){
'use strict';
var ctx = require('./_ctx');
var $export = require('./_export');
var toObject = require('./_to-object');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var toLength = require('./_to-length');
var createProperty = require('./_create-property');
var getIterFn = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":29,"./_ctx":30,"./_export":38,"./_is-array-iter":53,"./_iter-call":58,"./_iter-detect":61,"./_to-length":120,"./_to-object":121,"./core.get-iterator-method":132}],142:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $indexOf = require('./_array-includes')(false);
var $native = [].indexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});

},{"./_array-includes":16,"./_export":38,"./_strict-method":107}],143:[function(require,module,exports){
// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = require('./_export');

$export($export.S, 'Array', { isArray: require('./_is-array') });

},{"./_export":38,"./_is-array":54}],144:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":10,"./_iter-define":60,"./_iter-step":62,"./_iterators":63,"./_to-iobject":119}],145:[function(require,module,exports){
'use strict';
// 22.1.3.13 Array.prototype.join(separator)
var $export = require('./_export');
var toIObject = require('./_to-iobject');
var arrayJoin = [].join;

// fallback for not array-like strings
$export($export.P + $export.F * (require('./_iobject') != Object || !require('./_strict-method')(arrayJoin)), 'Array', {
  join: function join(separator) {
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});

},{"./_export":38,"./_iobject":52,"./_strict-method":107,"./_to-iobject":119}],146:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toIObject = require('./_to-iobject');
var toInteger = require('./_to-integer');
var toLength = require('./_to-length');
var $native = [].lastIndexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
    // convert -0 to +0
    if (NEGATIVE_ZERO) return $native.apply(this, arguments) || 0;
    var O = toIObject(this);
    var length = toLength(O.length);
    var index = length - 1;
    if (arguments.length > 1) index = Math.min(index, toInteger(arguments[1]));
    if (index < 0) index = length + index;
    for (;index >= 0; index--) if (index in O) if (O[index] === searchElement) return index || 0;
    return -1;
  }
});

},{"./_export":38,"./_strict-method":107,"./_to-integer":118,"./_to-iobject":119,"./_to-length":120}],147:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $map = require('./_array-methods')(1);

$export($export.P + $export.F * !require('./_strict-method')([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":17,"./_export":38,"./_strict-method":107}],148:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var createProperty = require('./_create-property');

// WebKit Array.of isn't generic
$export($export.S + $export.F * require('./_fails')(function () {
  function F() { /* empty */ }
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */) {
    var index = 0;
    var aLen = arguments.length;
    var result = new (typeof this == 'function' ? this : Array)(aLen);
    while (aLen > index) createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});

},{"./_create-property":29,"./_export":38,"./_fails":40}],149:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});

},{"./_array-reduce":18,"./_export":38,"./_strict-method":107}],150:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});

},{"./_array-reduce":18,"./_export":38,"./_strict-method":107}],151:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var html = require('./_html');
var cof = require('./_cof');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');
var arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * require('./_fails')(function () {
  if (html) arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end) {
    var len = toLength(this.length);
    var klass = cof(this);
    end = end === undefined ? len : end;
    if (klass == 'Array') return arraySlice.call(this, begin, end);
    var start = toAbsoluteIndex(begin, len);
    var upTo = toAbsoluteIndex(end, len);
    var size = toLength(upTo - start);
    var cloned = new Array(size);
    var i = 0;
    for (; i < size; i++) cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});

},{"./_cof":23,"./_export":38,"./_fails":40,"./_html":48,"./_to-absolute-index":116,"./_to-length":120}],152:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $some = require('./_array-methods')(3);

$export($export.P + $export.F * !require('./_strict-method')([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":17,"./_export":38,"./_strict-method":107}],153:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var aFunction = require('./_a-function');
var toObject = require('./_to-object');
var fails = require('./_fails');
var $sort = [].sort;
var test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !require('./_strict-method')($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});

},{"./_a-function":8,"./_export":38,"./_fails":40,"./_strict-method":107,"./_to-object":121}],154:[function(require,module,exports){
require('./_set-species')('Array');

},{"./_set-species":102}],155:[function(require,module,exports){
// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = require('./_export');

$export($export.S, 'Date', { now: function () { return new Date().getTime(); } });

},{"./_export":38}],156:[function(require,module,exports){
// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export = require('./_export');
var toISOString = require('./_date-to-iso-string');

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (Date.prototype.toISOString !== toISOString), 'Date', {
  toISOString: toISOString
});

},{"./_date-to-iso-string":31,"./_export":38}],157:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var toPrimitive = require('./_to-primitive');

$export($export.P + $export.F * require('./_fails')(function () {
  return new Date(NaN).toJSON() !== null
    || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
}), 'Date', {
  // eslint-disable-next-line no-unused-vars
  toJSON: function toJSON(key) {
    var O = toObject(this);
    var pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});

},{"./_export":38,"./_fails":40,"./_to-object":121,"./_to-primitive":122}],158:[function(require,module,exports){
var TO_PRIMITIVE = require('./_wks')('toPrimitive');
var proto = Date.prototype;

if (!(TO_PRIMITIVE in proto)) require('./_hide')(proto, TO_PRIMITIVE, require('./_date-to-primitive'));

},{"./_date-to-primitive":32,"./_hide":47,"./_wks":131}],159:[function(require,module,exports){
var DateProto = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var $toString = DateProto[TO_STRING];
var getTime = DateProto.getTime;
if (new Date(NaN) + '' != INVALID_DATE) {
  require('./_redefine')(DateProto, TO_STRING, function toString() {
    var value = getTime.call(this);
    // eslint-disable-next-line no-self-compare
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}

},{"./_redefine":96}],160:[function(require,module,exports){
// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = require('./_export');

$export($export.P, 'Function', { bind: require('./_bind') });

},{"./_bind":21,"./_export":38}],161:[function(require,module,exports){
'use strict';
var isObject = require('./_is-object');
var getPrototypeOf = require('./_object-gpo');
var HAS_INSTANCE = require('./_wks')('hasInstance');
var FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if (!(HAS_INSTANCE in FunctionProto)) require('./_object-dp').f(FunctionProto, HAS_INSTANCE, { value: function (O) {
  if (typeof this != 'function' || !isObject(O)) return false;
  if (!isObject(this.prototype)) return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while (O = getPrototypeOf(O)) if (this.prototype === O) return true;
  return false;
} });

},{"./_is-object":56,"./_object-dp":76,"./_object-gpo":83,"./_wks":131}],162:[function(require,module,exports){
var dP = require('./_object-dp').f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || require('./_descriptors') && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});

},{"./_descriptors":34,"./_object-dp":76}],163:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var MAP = 'Map';

// 23.1 Map Objects
module.exports = require('./_collection')(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);

},{"./_collection":27,"./_collection-strong":24,"./_validate-collection":128}],164:[function(require,module,exports){
// 20.2.2.3 Math.acosh(x)
var $export = require('./_export');
var log1p = require('./_math-log1p');
var sqrt = Math.sqrt;
var $acosh = Math.acosh;

$export($export.S + $export.F * !($acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  && Math.floor($acosh(Number.MAX_VALUE)) == 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN
  && $acosh(Infinity) == Infinity
), 'Math', {
  acosh: function acosh(x) {
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});

},{"./_export":38,"./_math-log1p":67}],165:[function(require,module,exports){
// 20.2.2.5 Math.asinh(x)
var $export = require('./_export');
var $asinh = Math.asinh;

function asinh(x) {
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', { asinh: asinh });

},{"./_export":38}],166:[function(require,module,exports){
// 20.2.2.7 Math.atanh(x)
var $export = require('./_export');
var $atanh = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x) {
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});

},{"./_export":38}],167:[function(require,module,exports){
// 20.2.2.9 Math.cbrt(x)
var $export = require('./_export');
var sign = require('./_math-sign');

$export($export.S, 'Math', {
  cbrt: function cbrt(x) {
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});

},{"./_export":38,"./_math-sign":69}],168:[function(require,module,exports){
// 20.2.2.11 Math.clz32(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  clz32: function clz32(x) {
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});

},{"./_export":38}],169:[function(require,module,exports){
// 20.2.2.12 Math.cosh(x)
var $export = require('./_export');
var exp = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x) {
    return (exp(x = +x) + exp(-x)) / 2;
  }
});

},{"./_export":38}],170:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $export = require('./_export');
var $expm1 = require('./_math-expm1');

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', { expm1: $expm1 });

},{"./_export":38,"./_math-expm1":65}],171:[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var $export = require('./_export');

$export($export.S, 'Math', { fround: require('./_math-fround') });

},{"./_export":38,"./_math-fround":66}],172:[function(require,module,exports){
// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = require('./_export');
var abs = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
    var sum = 0;
    var i = 0;
    var aLen = arguments.length;
    var larg = 0;
    var arg, div;
    while (i < aLen) {
      arg = abs(arguments[i++]);
      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});

},{"./_export":38}],173:[function(require,module,exports){
// 20.2.2.18 Math.imul(x, y)
var $export = require('./_export');
var $imul = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * require('./_fails')(function () {
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y) {
    var UINT16 = 0xffff;
    var xn = +x;
    var yn = +y;
    var xl = UINT16 & xn;
    var yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});

},{"./_export":38,"./_fails":40}],174:[function(require,module,exports){
// 20.2.2.21 Math.log10(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log10: function log10(x) {
    return Math.log(x) * Math.LOG10E;
  }
});

},{"./_export":38}],175:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
var $export = require('./_export');

$export($export.S, 'Math', { log1p: require('./_math-log1p') });

},{"./_export":38,"./_math-log1p":67}],176:[function(require,module,exports){
// 20.2.2.22 Math.log2(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log2: function log2(x) {
    return Math.log(x) / Math.LN2;
  }
});

},{"./_export":38}],177:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
var $export = require('./_export');

$export($export.S, 'Math', { sign: require('./_math-sign') });

},{"./_export":38,"./_math-sign":69}],178:[function(require,module,exports){
// 20.2.2.30 Math.sinh(x)
var $export = require('./_export');
var expm1 = require('./_math-expm1');
var exp = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * require('./_fails')(function () {
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x) {
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});

},{"./_export":38,"./_fails":40,"./_math-expm1":65}],179:[function(require,module,exports){
// 20.2.2.33 Math.tanh(x)
var $export = require('./_export');
var expm1 = require('./_math-expm1');
var exp = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x) {
    var a = expm1(x = +x);
    var b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});

},{"./_export":38,"./_math-expm1":65}],180:[function(require,module,exports){
// 20.2.2.34 Math.trunc(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  trunc: function trunc(it) {
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});

},{"./_export":38}],181:[function(require,module,exports){
'use strict';
var global = require('./_global');
var has = require('./_has');
var cof = require('./_cof');
var inheritIfRequired = require('./_inherit-if-required');
var toPrimitive = require('./_to-primitive');
var fails = require('./_fails');
var gOPN = require('./_object-gopn').f;
var gOPD = require('./_object-gopd').f;
var dP = require('./_object-dp').f;
var $trim = require('./_string-trim').trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(require('./_object-create')(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = require('./_descriptors') ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  require('./_redefine')(global, NUMBER, $Number);
}

},{"./_cof":23,"./_descriptors":34,"./_fails":40,"./_global":45,"./_has":46,"./_inherit-if-required":50,"./_object-create":75,"./_object-dp":76,"./_object-gopd":79,"./_object-gopn":81,"./_redefine":96,"./_string-trim":113,"./_to-primitive":122}],182:[function(require,module,exports){
// 20.1.2.1 Number.EPSILON
var $export = require('./_export');

$export($export.S, 'Number', { EPSILON: Math.pow(2, -52) });

},{"./_export":38}],183:[function(require,module,exports){
// 20.1.2.2 Number.isFinite(number)
var $export = require('./_export');
var _isFinite = require('./_global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it) {
    return typeof it == 'number' && _isFinite(it);
  }
});

},{"./_export":38,"./_global":45}],184:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $export = require('./_export');

$export($export.S, 'Number', { isInteger: require('./_is-integer') });

},{"./_export":38,"./_is-integer":55}],185:[function(require,module,exports){
// 20.1.2.4 Number.isNaN(number)
var $export = require('./_export');

$export($export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});

},{"./_export":38}],186:[function(require,module,exports){
// 20.1.2.5 Number.isSafeInteger(number)
var $export = require('./_export');
var isInteger = require('./_is-integer');
var abs = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number) {
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});

},{"./_export":38,"./_is-integer":55}],187:[function(require,module,exports){
// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });

},{"./_export":38}],188:[function(require,module,exports){
// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });

},{"./_export":38}],189:[function(require,module,exports){
var $export = require('./_export');
var $parseFloat = require('./_parse-float');
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', { parseFloat: $parseFloat });

},{"./_export":38,"./_parse-float":90}],190:[function(require,module,exports){
var $export = require('./_export');
var $parseInt = require('./_parse-int');
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', { parseInt: $parseInt });

},{"./_export":38,"./_parse-int":91}],191:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toInteger = require('./_to-integer');
var aNumberValue = require('./_a-number-value');
var repeat = require('./_string-repeat');
var $toFixed = 1.0.toFixed;
var floor = Math.floor;
var data = [0, 0, 0, 0, 0, 0];
var ERROR = 'Number.toFixed: incorrect invocation!';
var ZERO = '0';

var multiply = function (n, c) {
  var i = -1;
  var c2 = c;
  while (++i < 6) {
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function (n) {
  var i = 6;
  var c = 0;
  while (--i >= 0) {
    c += data[i];
    data[i] = floor(c / n);
    c = (c % n) * 1e7;
  }
};
var numToString = function () {
  var i = 6;
  var s = '';
  while (--i >= 0) {
    if (s !== '' || i === 0 || data[i] !== 0) {
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  } return s;
};
var pow = function (x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function (x) {
  var n = 0;
  var x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  } return n;
};

$export($export.P + $export.F * (!!$toFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
) || !require('./_fails')(function () {
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits) {
    var x = aNumberValue(this, ERROR);
    var f = toInteger(fractionDigits);
    var s = '';
    var m = ZERO;
    var e, z, j, k;
    if (f < 0 || f > 20) throw RangeError(ERROR);
    // eslint-disable-next-line no-self-compare
    if (x != x) return 'NaN';
    if (x <= -1e21 || x >= 1e21) return String(x);
    if (x < 0) {
      s = '-';
      x = -x;
    }
    if (x > 1e-21) {
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(0, z);
        j = f;
        while (j >= 7) {
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }
    if (f > 0) {
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    } return m;
  }
});

},{"./_a-number-value":9,"./_export":38,"./_fails":40,"./_string-repeat":112,"./_to-integer":118}],192:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $fails = require('./_fails');
var aNumberValue = require('./_a-number-value');
var $toPrecision = 1.0.toPrecision;

$export($export.P + $export.F * ($fails(function () {
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function () {
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision) {
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision);
  }
});

},{"./_a-number-value":9,"./_export":38,"./_fails":40}],193:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', { assign: require('./_object-assign') });

},{"./_export":38,"./_object-assign":74}],194:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: require('./_object-create') });

},{"./_export":38,"./_object-create":75}],195:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperties: require('./_object-dps') });

},{"./_descriptors":34,"./_export":38,"./_object-dps":77}],196:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_descriptors":34,"./_export":38,"./_object-dp":76}],197:[function(require,module,exports){
// 19.1.2.5 Object.freeze(O)
var isObject = require('./_is-object');
var meta = require('./_meta').onFreeze;

require('./_object-sap')('freeze', function ($freeze) {
  return function freeze(it) {
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});

},{"./_is-object":56,"./_meta":70,"./_object-sap":87}],198:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./_to-iobject');
var $getOwnPropertyDescriptor = require('./_object-gopd').f;

require('./_object-sap')('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});

},{"./_object-gopd":79,"./_object-sap":87,"./_to-iobject":119}],199:[function(require,module,exports){
// 19.1.2.7 Object.getOwnPropertyNames(O)
require('./_object-sap')('getOwnPropertyNames', function () {
  return require('./_object-gopn-ext').f;
});

},{"./_object-gopn-ext":80,"./_object-sap":87}],200:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = require('./_to-object');
var $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});

},{"./_object-gpo":83,"./_object-sap":87,"./_to-object":121}],201:[function(require,module,exports){
// 19.1.2.11 Object.isExtensible(O)
var isObject = require('./_is-object');

require('./_object-sap')('isExtensible', function ($isExtensible) {
  return function isExtensible(it) {
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});

},{"./_is-object":56,"./_object-sap":87}],202:[function(require,module,exports){
// 19.1.2.12 Object.isFrozen(O)
var isObject = require('./_is-object');

require('./_object-sap')('isFrozen', function ($isFrozen) {
  return function isFrozen(it) {
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});

},{"./_is-object":56,"./_object-sap":87}],203:[function(require,module,exports){
// 19.1.2.13 Object.isSealed(O)
var isObject = require('./_is-object');

require('./_object-sap')('isSealed', function ($isSealed) {
  return function isSealed(it) {
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});

},{"./_is-object":56,"./_object-sap":87}],204:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $export = require('./_export');
$export($export.S, 'Object', { is: require('./_same-value') });

},{"./_export":38,"./_same-value":98}],205:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object');
var $keys = require('./_object-keys');

require('./_object-sap')('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

},{"./_object-keys":85,"./_object-sap":87,"./_to-object":121}],206:[function(require,module,exports){
// 19.1.2.15 Object.preventExtensions(O)
var isObject = require('./_is-object');
var meta = require('./_meta').onFreeze;

require('./_object-sap')('preventExtensions', function ($preventExtensions) {
  return function preventExtensions(it) {
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});

},{"./_is-object":56,"./_meta":70,"./_object-sap":87}],207:[function(require,module,exports){
// 19.1.2.17 Object.seal(O)
var isObject = require('./_is-object');
var meta = require('./_meta').onFreeze;

require('./_object-sap')('seal', function ($seal) {
  return function seal(it) {
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});

},{"./_is-object":56,"./_meta":70,"./_object-sap":87}],208:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', { setPrototypeOf: require('./_set-proto').set });

},{"./_export":38,"./_set-proto":101}],209:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = require('./_classof');
var test = {};
test[require('./_wks')('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  require('./_redefine')(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}

},{"./_classof":22,"./_redefine":96,"./_wks":131}],210:[function(require,module,exports){
var $export = require('./_export');
var $parseFloat = require('./_parse-float');
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), { parseFloat: $parseFloat });

},{"./_export":38,"./_parse-float":90}],211:[function(require,module,exports){
var $export = require('./_export');
var $parseInt = require('./_parse-int');
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), { parseInt: $parseInt });

},{"./_export":38,"./_parse-int":91}],212:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var global = require('./_global');
var ctx = require('./_ctx');
var classof = require('./_classof');
var $export = require('./_export');
var isObject = require('./_is-object');
var aFunction = require('./_a-function');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var speciesConstructor = require('./_species-constructor');
var task = require('./_task').set;
var microtask = require('./_microtask')();
var newPromiseCapabilityModule = require('./_new-promise-capability');
var perform = require('./_perform');
var promiseResolve = require('./_promise-resolve');
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

},{"./_a-function":8,"./_an-instance":11,"./_classof":22,"./_core":28,"./_ctx":30,"./_export":38,"./_for-of":44,"./_global":45,"./_is-object":56,"./_iter-detect":61,"./_library":64,"./_microtask":72,"./_new-promise-capability":73,"./_perform":92,"./_promise-resolve":93,"./_redefine-all":95,"./_set-species":102,"./_set-to-string-tag":103,"./_species-constructor":106,"./_task":115,"./_wks":131}],213:[function(require,module,exports){
// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export = require('./_export');
var aFunction = require('./_a-function');
var anObject = require('./_an-object');
var rApply = (require('./_global').Reflect || {}).apply;
var fApply = Function.apply;
// MS Edge argumentsList argument is optional
$export($export.S + $export.F * !require('./_fails')(function () {
  rApply(function () { /* empty */ });
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList) {
    var T = aFunction(target);
    var L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});

},{"./_a-function":8,"./_an-object":12,"./_export":38,"./_fails":40,"./_global":45}],214:[function(require,module,exports){
// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export = require('./_export');
var create = require('./_object-create');
var aFunction = require('./_a-function');
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var fails = require('./_fails');
var bind = require('./_bind');
var rConstruct = (require('./_global').Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(rConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  rConstruct(function () { /* empty */ });
});

$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /* , newTarget */) {
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return rConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});

},{"./_a-function":8,"./_an-object":12,"./_bind":21,"./_export":38,"./_fails":40,"./_global":45,"./_is-object":56,"./_object-create":75}],215:[function(require,module,exports){
// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP = require('./_object-dp');
var $export = require('./_export');
var anObject = require('./_an-object');
var toPrimitive = require('./_to-primitive');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * require('./_fails')(function () {
  // eslint-disable-next-line no-undef
  Reflect.defineProperty(dP.f({}, 1, { value: 1 }), 1, { value: 2 });
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_an-object":12,"./_export":38,"./_fails":40,"./_object-dp":76,"./_to-primitive":122}],216:[function(require,module,exports){
// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export = require('./_export');
var gOPD = require('./_object-gopd').f;
var anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey) {
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});

},{"./_an-object":12,"./_export":38,"./_object-gopd":79}],217:[function(require,module,exports){
'use strict';
// 26.1.5 Reflect.enumerate(target)
var $export = require('./_export');
var anObject = require('./_an-object');
var Enumerate = function (iterated) {
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = [];      // keys
  var key;
  for (key in iterated) keys.push(key);
};
require('./_iter-create')(Enumerate, 'Object', function () {
  var that = this;
  var keys = that._k;
  var key;
  do {
    if (that._i >= keys.length) return { value: undefined, done: true };
  } while (!((key = keys[that._i++]) in that._t));
  return { value: key, done: false };
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target) {
    return new Enumerate(target);
  }
});

},{"./_an-object":12,"./_export":38,"./_iter-create":59}],218:[function(require,module,exports){
// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD = require('./_object-gopd');
var $export = require('./_export');
var anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
    return gOPD.f(anObject(target), propertyKey);
  }
});

},{"./_an-object":12,"./_export":38,"./_object-gopd":79}],219:[function(require,module,exports){
// 26.1.8 Reflect.getPrototypeOf(target)
var $export = require('./_export');
var getProto = require('./_object-gpo');
var anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target) {
    return getProto(anObject(target));
  }
});

},{"./_an-object":12,"./_export":38,"./_object-gpo":83}],220:[function(require,module,exports){
// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD = require('./_object-gopd');
var getPrototypeOf = require('./_object-gpo');
var has = require('./_has');
var $export = require('./_export');
var isObject = require('./_is-object');
var anObject = require('./_an-object');

function get(target, propertyKey /* , receiver */) {
  var receiver = arguments.length < 3 ? target : arguments[2];
  var desc, proto;
  if (anObject(target) === receiver) return target[propertyKey];
  if (desc = gOPD.f(target, propertyKey)) return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if (isObject(proto = getPrototypeOf(target))) return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', { get: get });

},{"./_an-object":12,"./_export":38,"./_has":46,"./_is-object":56,"./_object-gopd":79,"./_object-gpo":83}],221:[function(require,module,exports){
// 26.1.9 Reflect.has(target, propertyKey)
var $export = require('./_export');

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey) {
    return propertyKey in target;
  }
});

},{"./_export":38}],222:[function(require,module,exports){
// 26.1.10 Reflect.isExtensible(target)
var $export = require('./_export');
var anObject = require('./_an-object');
var $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target) {
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});

},{"./_an-object":12,"./_export":38}],223:[function(require,module,exports){
// 26.1.11 Reflect.ownKeys(target)
var $export = require('./_export');

$export($export.S, 'Reflect', { ownKeys: require('./_own-keys') });

},{"./_export":38,"./_own-keys":89}],224:[function(require,module,exports){
// 26.1.12 Reflect.preventExtensions(target)
var $export = require('./_export');
var anObject = require('./_an-object');
var $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target) {
    anObject(target);
    try {
      if ($preventExtensions) $preventExtensions(target);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_an-object":12,"./_export":38}],225:[function(require,module,exports){
// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export = require('./_export');
var setProto = require('./_set-proto');

if (setProto) $export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto) {
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_export":38,"./_set-proto":101}],226:[function(require,module,exports){
// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP = require('./_object-dp');
var gOPD = require('./_object-gopd');
var getPrototypeOf = require('./_object-gpo');
var has = require('./_has');
var $export = require('./_export');
var createDesc = require('./_property-desc');
var anObject = require('./_an-object');
var isObject = require('./_is-object');

function set(target, propertyKey, V /* , receiver */) {
  var receiver = arguments.length < 4 ? target : arguments[3];
  var ownDesc = gOPD.f(anObject(target), propertyKey);
  var existingDescriptor, proto;
  if (!ownDesc) {
    if (isObject(proto = getPrototypeOf(target))) {
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if (has(ownDesc, 'value')) {
    if (ownDesc.writable === false || !isObject(receiver)) return false;
    if (existingDescriptor = gOPD.f(receiver, propertyKey)) {
      if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
      existingDescriptor.value = V;
      dP.f(receiver, propertyKey, existingDescriptor);
    } else dP.f(receiver, propertyKey, createDesc(0, V));
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', { set: set });

},{"./_an-object":12,"./_export":38,"./_has":46,"./_is-object":56,"./_object-dp":76,"./_object-gopd":79,"./_object-gpo":83,"./_property-desc":94}],227:[function(require,module,exports){
var global = require('./_global');
var inheritIfRequired = require('./_inherit-if-required');
var dP = require('./_object-dp').f;
var gOPN = require('./_object-gopn').f;
var isRegExp = require('./_is-regexp');
var $flags = require('./_flags');
var $RegExp = global.RegExp;
var Base = $RegExp;
var proto = $RegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;
// "new" creates a new object, old webkit buggy here
var CORRECT_NEW = new $RegExp(re1) !== re1;

if (require('./_descriptors') && (!CORRECT_NEW || require('./_fails')(function () {
  re2[require('./_wks')('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp;
    var piRE = isRegExp(p);
    var fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function (key) {
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function () { return Base[key]; },
      set: function (it) { Base[key] = it; }
    });
  };
  for (var keys = gOPN(Base), i = 0; keys.length > i;) proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  require('./_redefine')(global, 'RegExp', $RegExp);
}

require('./_set-species')('RegExp');

},{"./_descriptors":34,"./_fails":40,"./_flags":42,"./_global":45,"./_inherit-if-required":50,"./_is-regexp":57,"./_object-dp":76,"./_object-gopn":81,"./_redefine":96,"./_set-species":102,"./_wks":131}],228:[function(require,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
if (require('./_descriptors') && /./g.flags != 'g') require('./_object-dp').f(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./_flags')
});

},{"./_descriptors":34,"./_flags":42,"./_object-dp":76}],229:[function(require,module,exports){
// @@match logic
require('./_fix-re-wks')('match', 1, function (defined, MATCH, $match) {
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp) {
    'use strict';
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});

},{"./_fix-re-wks":41}],230:[function(require,module,exports){
// @@replace logic
require('./_fix-re-wks')('replace', 2, function (defined, REPLACE, $replace) {
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue) {
    'use strict';
    var O = defined(this);
    var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});

},{"./_fix-re-wks":41}],231:[function(require,module,exports){
// @@search logic
require('./_fix-re-wks')('search', 1, function (defined, SEARCH, $search) {
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp) {
    'use strict';
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});

},{"./_fix-re-wks":41}],232:[function(require,module,exports){
// @@split logic
require('./_fix-re-wks')('split', 2, function (defined, SPLIT, $split) {
  'use strict';
  var isRegExp = require('./_is-regexp');
  var _split = $split;
  var $push = [].push;
  var $SPLIT = 'split';
  var LENGTH = 'length';
  var LAST_INDEX = 'lastIndex';
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if (!NPCG) separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while (match = separatorCopy.exec(string)) {
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          // eslint-disable-next-line no-loop-func
          if (!NPCG && match[LENGTH] > 1) match[0].replace(separator2, function () {
            for (i = 1; i < arguments[LENGTH] - 2; i++) if (arguments[i] === undefined) match[i] = undefined;
          });
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    $split = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit) {
    var O = defined(this);
    var fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});

},{"./_fix-re-wks":41,"./_is-regexp":57}],233:[function(require,module,exports){
'use strict';
require('./es6.regexp.flags');
var anObject = require('./_an-object');
var $flags = require('./_flags');
var DESCRIPTORS = require('./_descriptors');
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  require('./_redefine')(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (require('./_fails')(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}

},{"./_an-object":12,"./_descriptors":34,"./_fails":40,"./_flags":42,"./_redefine":96,"./es6.regexp.flags":228}],234:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var SET = 'Set';

// 23.2 Set Objects
module.exports = require('./_collection')(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);

},{"./_collection":27,"./_collection-strong":24,"./_validate-collection":128}],235:[function(require,module,exports){
'use strict';
// B.2.3.2 String.prototype.anchor(name)
require('./_string-html')('anchor', function (createHTML) {
  return function anchor(name) {
    return createHTML(this, 'a', 'name', name);
  };
});

},{"./_string-html":110}],236:[function(require,module,exports){
'use strict';
// B.2.3.3 String.prototype.big()
require('./_string-html')('big', function (createHTML) {
  return function big() {
    return createHTML(this, 'big', '', '');
  };
});

},{"./_string-html":110}],237:[function(require,module,exports){
'use strict';
// B.2.3.4 String.prototype.blink()
require('./_string-html')('blink', function (createHTML) {
  return function blink() {
    return createHTML(this, 'blink', '', '');
  };
});

},{"./_string-html":110}],238:[function(require,module,exports){
'use strict';
// B.2.3.5 String.prototype.bold()
require('./_string-html')('bold', function (createHTML) {
  return function bold() {
    return createHTML(this, 'b', '', '');
  };
});

},{"./_string-html":110}],239:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $at = require('./_string-at')(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos) {
    return $at(this, pos);
  }
});

},{"./_export":38,"./_string-at":108}],240:[function(require,module,exports){
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';
var $export = require('./_export');
var toLength = require('./_to-length');
var context = require('./_string-context');
var ENDS_WITH = 'endsWith';
var $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /* , endPosition = @length */) {
    var that = context(this, searchString, ENDS_WITH);
    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
    var len = toLength(that.length);
    var end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
    var search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});

},{"./_export":38,"./_fails-is-regexp":39,"./_string-context":109,"./_to-length":120}],241:[function(require,module,exports){
'use strict';
// B.2.3.6 String.prototype.fixed()
require('./_string-html')('fixed', function (createHTML) {
  return function fixed() {
    return createHTML(this, 'tt', '', '');
  };
});

},{"./_string-html":110}],242:[function(require,module,exports){
'use strict';
// B.2.3.7 String.prototype.fontcolor(color)
require('./_string-html')('fontcolor', function (createHTML) {
  return function fontcolor(color) {
    return createHTML(this, 'font', 'color', color);
  };
});

},{"./_string-html":110}],243:[function(require,module,exports){
'use strict';
// B.2.3.8 String.prototype.fontsize(size)
require('./_string-html')('fontsize', function (createHTML) {
  return function fontsize(size) {
    return createHTML(this, 'font', 'size', size);
  };
});

},{"./_string-html":110}],244:[function(require,module,exports){
var $export = require('./_export');
var toAbsoluteIndex = require('./_to-absolute-index');
var fromCharCode = String.fromCharCode;
var $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x) { // eslint-disable-line no-unused-vars
    var res = [];
    var aLen = arguments.length;
    var i = 0;
    var code;
    while (aLen > i) {
      code = +arguments[i++];
      if (toAbsoluteIndex(code, 0x10ffff) !== code) throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});

},{"./_export":38,"./_to-absolute-index":116}],245:[function(require,module,exports){
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';
var $export = require('./_export');
var context = require('./_string-context');
var INCLUDES = 'includes';

$export($export.P + $export.F * require('./_fails-is-regexp')(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"./_export":38,"./_fails-is-regexp":39,"./_string-context":109}],246:[function(require,module,exports){
'use strict';
// B.2.3.9 String.prototype.italics()
require('./_string-html')('italics', function (createHTML) {
  return function italics() {
    return createHTML(this, 'i', '', '');
  };
});

},{"./_string-html":110}],247:[function(require,module,exports){
'use strict';
var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_iter-define":60,"./_string-at":108}],248:[function(require,module,exports){
'use strict';
// B.2.3.10 String.prototype.link(url)
require('./_string-html')('link', function (createHTML) {
  return function link(url) {
    return createHTML(this, 'a', 'href', url);
  };
});

},{"./_string-html":110}],249:[function(require,module,exports){
var $export = require('./_export');
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite) {
    var tpl = toIObject(callSite.raw);
    var len = toLength(tpl.length);
    var aLen = arguments.length;
    var res = [];
    var i = 0;
    while (len > i) {
      res.push(String(tpl[i++]));
      if (i < aLen) res.push(String(arguments[i]));
    } return res.join('');
  }
});

},{"./_export":38,"./_to-iobject":119,"./_to-length":120}],250:[function(require,module,exports){
var $export = require('./_export');

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./_string-repeat')
});

},{"./_export":38,"./_string-repeat":112}],251:[function(require,module,exports){
'use strict';
// B.2.3.11 String.prototype.small()
require('./_string-html')('small', function (createHTML) {
  return function small() {
    return createHTML(this, 'small', '', '');
  };
});

},{"./_string-html":110}],252:[function(require,module,exports){
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $export = require('./_export');
var toLength = require('./_to-length');
var context = require('./_string-context');
var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = context(this, searchString, STARTS_WITH);
    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});

},{"./_export":38,"./_fails-is-regexp":39,"./_string-context":109,"./_to-length":120}],253:[function(require,module,exports){
'use strict';
// B.2.3.12 String.prototype.strike()
require('./_string-html')('strike', function (createHTML) {
  return function strike() {
    return createHTML(this, 'strike', '', '');
  };
});

},{"./_string-html":110}],254:[function(require,module,exports){
'use strict';
// B.2.3.13 String.prototype.sub()
require('./_string-html')('sub', function (createHTML) {
  return function sub() {
    return createHTML(this, 'sub', '', '');
  };
});

},{"./_string-html":110}],255:[function(require,module,exports){
'use strict';
// B.2.3.14 String.prototype.sup()
require('./_string-html')('sup', function (createHTML) {
  return function sup() {
    return createHTML(this, 'sup', '', '');
  };
});

},{"./_string-html":110}],256:[function(require,module,exports){
'use strict';
// 21.1.3.25 String.prototype.trim()
require('./_string-trim')('trim', function ($trim) {
  return function trim() {
    return $trim(this, 3);
  };
});

},{"./_string-trim":113}],257:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global = require('./_global');
var has = require('./_has');
var DESCRIPTORS = require('./_descriptors');
var $export = require('./_export');
var redefine = require('./_redefine');
var META = require('./_meta').KEY;
var $fails = require('./_fails');
var shared = require('./_shared');
var setToStringTag = require('./_set-to-string-tag');
var uid = require('./_uid');
var wks = require('./_wks');
var wksExt = require('./_wks-ext');
var wksDefine = require('./_wks-define');
var enumKeys = require('./_enum-keys');
var isArray = require('./_is-array');
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var createDesc = require('./_property-desc');
var _create = require('./_object-create');
var gOPNExt = require('./_object-gopn-ext');
var $GOPD = require('./_object-gopd');
var $DP = require('./_object-dp');
var $keys = require('./_object-keys');
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !require('./_library')) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

},{"./_an-object":12,"./_descriptors":34,"./_enum-keys":37,"./_export":38,"./_fails":40,"./_global":45,"./_has":46,"./_hide":47,"./_is-array":54,"./_is-object":56,"./_library":64,"./_meta":70,"./_object-create":75,"./_object-dp":76,"./_object-gopd":79,"./_object-gopn":81,"./_object-gopn-ext":80,"./_object-gops":82,"./_object-keys":85,"./_object-pie":86,"./_property-desc":94,"./_redefine":96,"./_set-to-string-tag":103,"./_shared":105,"./_to-iobject":119,"./_to-primitive":122,"./_uid":126,"./_wks":131,"./_wks-define":129,"./_wks-ext":130}],258:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $typed = require('./_typed');
var buffer = require('./_typed-buffer');
var anObject = require('./_an-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');
var isObject = require('./_is-object');
var ArrayBuffer = require('./_global').ArrayBuffer;
var speciesConstructor = require('./_species-constructor');
var $ArrayBuffer = buffer.ArrayBuffer;
var $DataView = buffer.DataView;
var $isView = $typed.ABV && ArrayBuffer.isView;
var $slice = $ArrayBuffer.prototype.slice;
var VIEW = $typed.VIEW;
var ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), { ArrayBuffer: $ArrayBuffer });

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it) {
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * require('./_fails')(function () {
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end) {
    if ($slice !== undefined && end === undefined) return $slice.call(anObject(this), start); // FF fix
    var len = anObject(this).byteLength;
    var first = toAbsoluteIndex(start, len);
    var final = toAbsoluteIndex(end === undefined ? len : end, len);
    var result = new (speciesConstructor(this, $ArrayBuffer))(toLength(final - first));
    var viewS = new $DataView(this);
    var viewT = new $DataView(result);
    var index = 0;
    while (first < final) {
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

require('./_set-species')(ARRAY_BUFFER);

},{"./_an-object":12,"./_export":38,"./_fails":40,"./_global":45,"./_is-object":56,"./_set-species":102,"./_species-constructor":106,"./_to-absolute-index":116,"./_to-length":120,"./_typed":125,"./_typed-buffer":124}],259:[function(require,module,exports){
var $export = require('./_export');
$export($export.G + $export.W + $export.F * !require('./_typed').ABV, {
  DataView: require('./_typed-buffer').DataView
});

},{"./_export":38,"./_typed":125,"./_typed-buffer":124}],260:[function(require,module,exports){
require('./_typed-array')('Float32', 4, function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":123}],261:[function(require,module,exports){
require('./_typed-array')('Float64', 8, function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":123}],262:[function(require,module,exports){
require('./_typed-array')('Int16', 2, function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":123}],263:[function(require,module,exports){
require('./_typed-array')('Int32', 4, function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":123}],264:[function(require,module,exports){
require('./_typed-array')('Int8', 1, function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":123}],265:[function(require,module,exports){
require('./_typed-array')('Uint16', 2, function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":123}],266:[function(require,module,exports){
require('./_typed-array')('Uint32', 4, function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":123}],267:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":123}],268:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);

},{"./_typed-array":123}],269:[function(require,module,exports){
'use strict';
var each = require('./_array-methods')(0);
var redefine = require('./_redefine');
var meta = require('./_meta');
var assign = require('./_object-assign');
var weak = require('./_collection-weak');
var isObject = require('./_is-object');
var fails = require('./_fails');
var validate = require('./_validate-collection');
var WEAK_MAP = 'WeakMap';
var getWeak = meta.getWeak;
var isExtensible = Object.isExtensible;
var uncaughtFrozenStore = weak.ufstore;
var tmp = {};
var InternalMap;

var wrapper = function (get) {
  return function WeakMap() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key) {
    if (isObject(key)) {
      var data = getWeak(key);
      if (data === true) return uncaughtFrozenStore(validate(this, WEAK_MAP)).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value) {
    return weak.def(validate(this, WEAK_MAP), key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = require('./_collection')(WEAK_MAP, wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if (fails(function () { return new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7; })) {
  InternalMap = weak.getConstructor(wrapper, WEAK_MAP);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function (key) {
    var proto = $WeakMap.prototype;
    var method = proto[key];
    redefine(proto, key, function (a, b) {
      // store frozen objects on internal weakmap shim
      if (isObject(a) && !isExtensible(a)) {
        if (!this._f) this._f = new InternalMap();
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}

},{"./_array-methods":17,"./_collection":27,"./_collection-weak":26,"./_fails":40,"./_is-object":56,"./_meta":70,"./_object-assign":74,"./_redefine":96,"./_validate-collection":128}],270:[function(require,module,exports){
'use strict';
var weak = require('./_collection-weak');
var validate = require('./_validate-collection');
var WEAK_SET = 'WeakSet';

// 23.4 WeakSet Objects
require('./_collection')(WEAK_SET, function (get) {
  return function WeakSet() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value) {
    return weak.def(validate(this, WEAK_SET), value, true);
  }
}, weak, false, true);

},{"./_collection":27,"./_collection-weak":26,"./_validate-collection":128}],271:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatMap
var $export = require('./_export');
var flattenIntoArray = require('./_flatten-into-array');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var aFunction = require('./_a-function');
var arraySpeciesCreate = require('./_array-species-create');

$export($export.P, 'Array', {
  flatMap: function flatMap(callbackfn /* , thisArg */) {
    var O = toObject(this);
    var sourceLen, A;
    aFunction(callbackfn);
    sourceLen = toLength(O.length);
    A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments[1]);
    return A;
  }
});

require('./_add-to-unscopables')('flatMap');

},{"./_a-function":8,"./_add-to-unscopables":10,"./_array-species-create":20,"./_export":38,"./_flatten-into-array":43,"./_to-length":120,"./_to-object":121}],272:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatten
var $export = require('./_export');
var flattenIntoArray = require('./_flatten-into-array');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var toInteger = require('./_to-integer');
var arraySpeciesCreate = require('./_array-species-create');

$export($export.P, 'Array', {
  flatten: function flatten(/* depthArg = 1 */) {
    var depthArg = arguments[0];
    var O = toObject(this);
    var sourceLen = toLength(O.length);
    var A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger(depthArg));
    return A;
  }
});

require('./_add-to-unscopables')('flatten');

},{"./_add-to-unscopables":10,"./_array-species-create":20,"./_export":38,"./_flatten-into-array":43,"./_to-integer":118,"./_to-length":120,"./_to-object":121}],273:[function(require,module,exports){
'use strict';
// https://github.com/tc39/Array.prototype.includes
var $export = require('./_export');
var $includes = require('./_array-includes')(true);

$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

require('./_add-to-unscopables')('includes');

},{"./_add-to-unscopables":10,"./_array-includes":16,"./_export":38}],274:[function(require,module,exports){
// https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-09/sept-25.md#510-globalasap-for-enqueuing-a-microtask
var $export = require('./_export');
var microtask = require('./_microtask')();
var process = require('./_global').process;
var isNode = require('./_cof')(process) == 'process';

$export($export.G, {
  asap: function asap(fn) {
    var domain = isNode && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});

},{"./_cof":23,"./_export":38,"./_global":45,"./_microtask":72}],275:[function(require,module,exports){
// https://github.com/ljharb/proposal-is-error
var $export = require('./_export');
var cof = require('./_cof');

$export($export.S, 'Error', {
  isError: function isError(it) {
    return cof(it) === 'Error';
  }
});

},{"./_cof":23,"./_export":38}],276:[function(require,module,exports){
// https://github.com/tc39/proposal-global
var $export = require('./_export');

$export($export.G, { global: require('./_global') });

},{"./_export":38,"./_global":45}],277:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
require('./_set-collection-from')('Map');

},{"./_set-collection-from":99}],278:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
require('./_set-collection-of')('Map');

},{"./_set-collection-of":100}],279:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = require('./_export');

$export($export.P + $export.R, 'Map', { toJSON: require('./_collection-to-json')('Map') });

},{"./_collection-to-json":25,"./_export":38}],280:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');

$export($export.S, 'Math', {
  clamp: function clamp(x, lower, upper) {
    return Math.min(upper, Math.max(lower, x));
  }
});

},{"./_export":38}],281:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');

$export($export.S, 'Math', { DEG_PER_RAD: Math.PI / 180 });

},{"./_export":38}],282:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');
var RAD_PER_DEG = 180 / Math.PI;

$export($export.S, 'Math', {
  degrees: function degrees(radians) {
    return radians * RAD_PER_DEG;
  }
});

},{"./_export":38}],283:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');
var scale = require('./_math-scale');
var fround = require('./_math-fround');

$export($export.S, 'Math', {
  fscale: function fscale(x, inLow, inHigh, outLow, outHigh) {
    return fround(scale(x, inLow, inHigh, outLow, outHigh));
  }
});

},{"./_export":38,"./_math-fround":66,"./_math-scale":68}],284:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  iaddh: function iaddh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0;
    var $x1 = x1 >>> 0;
    var $y0 = y0 >>> 0;
    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
  }
});

},{"./_export":38}],285:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  imulh: function imulh(u, v) {
    var UINT16 = 0xffff;
    var $u = +u;
    var $v = +v;
    var u0 = $u & UINT16;
    var v0 = $v & UINT16;
    var u1 = $u >> 16;
    var v1 = $v >> 16;
    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
  }
});

},{"./_export":38}],286:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  isubh: function isubh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0;
    var $x1 = x1 >>> 0;
    var $y0 = y0 >>> 0;
    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
  }
});

},{"./_export":38}],287:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');

$export($export.S, 'Math', { RAD_PER_DEG: 180 / Math.PI });

},{"./_export":38}],288:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');
var DEG_PER_RAD = Math.PI / 180;

$export($export.S, 'Math', {
  radians: function radians(degrees) {
    return degrees * DEG_PER_RAD;
  }
});

},{"./_export":38}],289:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');

$export($export.S, 'Math', { scale: require('./_math-scale') });

},{"./_export":38,"./_math-scale":68}],290:[function(require,module,exports){
// http://jfbastien.github.io/papers/Math.signbit.html
var $export = require('./_export');

$export($export.S, 'Math', { signbit: function signbit(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) != x ? x : x == 0 ? 1 / x == Infinity : x > 0;
} });

},{"./_export":38}],291:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  umulh: function umulh(u, v) {
    var UINT16 = 0xffff;
    var $u = +u;
    var $v = +v;
    var u0 = $u & UINT16;
    var v0 = $v & UINT16;
    var u1 = $u >>> 16;
    var v1 = $v >>> 16;
    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
  }
});

},{"./_export":38}],292:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var aFunction = require('./_a-function');
var $defineProperty = require('./_object-dp');

// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __defineGetter__: function __defineGetter__(P, getter) {
    $defineProperty.f(toObject(this), P, { get: aFunction(getter), enumerable: true, configurable: true });
  }
});

},{"./_a-function":8,"./_descriptors":34,"./_export":38,"./_object-dp":76,"./_object-forced-pam":78,"./_to-object":121}],293:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var aFunction = require('./_a-function');
var $defineProperty = require('./_object-dp');

// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __defineSetter__: function __defineSetter__(P, setter) {
    $defineProperty.f(toObject(this), P, { set: aFunction(setter), enumerable: true, configurable: true });
  }
});

},{"./_a-function":8,"./_descriptors":34,"./_export":38,"./_object-dp":76,"./_object-forced-pam":78,"./_to-object":121}],294:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export');
var $entries = require('./_object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});

},{"./_export":38,"./_object-to-array":88}],295:[function(require,module,exports){
// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export = require('./_export');
var ownKeys = require('./_own-keys');
var toIObject = require('./_to-iobject');
var gOPD = require('./_object-gopd');
var createProperty = require('./_create-property');

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIObject(object);
    var getDesc = gOPD.f;
    var keys = ownKeys(O);
    var result = {};
    var i = 0;
    var key, desc;
    while (keys.length > i) {
      desc = getDesc(O, key = keys[i++]);
      if (desc !== undefined) createProperty(result, key, desc);
    }
    return result;
  }
});

},{"./_create-property":29,"./_export":38,"./_object-gopd":79,"./_own-keys":89,"./_to-iobject":119}],296:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var toPrimitive = require('./_to-primitive');
var getPrototypeOf = require('./_object-gpo');
var getOwnPropertyDescriptor = require('./_object-gopd').f;

// B.2.2.4 Object.prototype.__lookupGetter__(P)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __lookupGetter__: function __lookupGetter__(P) {
    var O = toObject(this);
    var K = toPrimitive(P, true);
    var D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.get;
    } while (O = getPrototypeOf(O));
  }
});

},{"./_descriptors":34,"./_export":38,"./_object-forced-pam":78,"./_object-gopd":79,"./_object-gpo":83,"./_to-object":121,"./_to-primitive":122}],297:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var toPrimitive = require('./_to-primitive');
var getPrototypeOf = require('./_object-gpo');
var getOwnPropertyDescriptor = require('./_object-gopd').f;

// B.2.2.5 Object.prototype.__lookupSetter__(P)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __lookupSetter__: function __lookupSetter__(P) {
    var O = toObject(this);
    var K = toPrimitive(P, true);
    var D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.set;
    } while (O = getPrototypeOf(O));
  }
});

},{"./_descriptors":34,"./_export":38,"./_object-forced-pam":78,"./_object-gopd":79,"./_object-gpo":83,"./_to-object":121,"./_to-primitive":122}],298:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export');
var $values = require('./_object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});

},{"./_export":38,"./_object-to-array":88}],299:[function(require,module,exports){
'use strict';
// https://github.com/zenparsing/es-observable
var $export = require('./_export');
var global = require('./_global');
var core = require('./_core');
var microtask = require('./_microtask')();
var OBSERVABLE = require('./_wks')('observable');
var aFunction = require('./_a-function');
var anObject = require('./_an-object');
var anInstance = require('./_an-instance');
var redefineAll = require('./_redefine-all');
var hide = require('./_hide');
var forOf = require('./_for-of');
var RETURN = forOf.RETURN;

var getMethod = function (fn) {
  return fn == null ? undefined : aFunction(fn);
};

var cleanupSubscription = function (subscription) {
  var cleanup = subscription._c;
  if (cleanup) {
    subscription._c = undefined;
    cleanup();
  }
};

var subscriptionClosed = function (subscription) {
  return subscription._o === undefined;
};

var closeSubscription = function (subscription) {
  if (!subscriptionClosed(subscription)) {
    subscription._o = undefined;
    cleanupSubscription(subscription);
  }
};

var Subscription = function (observer, subscriber) {
  anObject(observer);
  this._c = undefined;
  this._o = observer;
  observer = new SubscriptionObserver(this);
  try {
    var cleanup = subscriber(observer);
    var subscription = cleanup;
    if (cleanup != null) {
      if (typeof cleanup.unsubscribe === 'function') cleanup = function () { subscription.unsubscribe(); };
      else aFunction(cleanup);
      this._c = cleanup;
    }
  } catch (e) {
    observer.error(e);
    return;
  } if (subscriptionClosed(this)) cleanupSubscription(this);
};

Subscription.prototype = redefineAll({}, {
  unsubscribe: function unsubscribe() { closeSubscription(this); }
});

var SubscriptionObserver = function (subscription) {
  this._s = subscription;
};

SubscriptionObserver.prototype = redefineAll({}, {
  next: function next(value) {
    var subscription = this._s;
    if (!subscriptionClosed(subscription)) {
      var observer = subscription._o;
      try {
        var m = getMethod(observer.next);
        if (m) return m.call(observer, value);
      } catch (e) {
        try {
          closeSubscription(subscription);
        } finally {
          throw e;
        }
      }
    }
  },
  error: function error(value) {
    var subscription = this._s;
    if (subscriptionClosed(subscription)) throw value;
    var observer = subscription._o;
    subscription._o = undefined;
    try {
      var m = getMethod(observer.error);
      if (!m) throw value;
      value = m.call(observer, value);
    } catch (e) {
      try {
        cleanupSubscription(subscription);
      } finally {
        throw e;
      }
    } cleanupSubscription(subscription);
    return value;
  },
  complete: function complete(value) {
    var subscription = this._s;
    if (!subscriptionClosed(subscription)) {
      var observer = subscription._o;
      subscription._o = undefined;
      try {
        var m = getMethod(observer.complete);
        value = m ? m.call(observer, value) : undefined;
      } catch (e) {
        try {
          cleanupSubscription(subscription);
        } finally {
          throw e;
        }
      } cleanupSubscription(subscription);
      return value;
    }
  }
});

var $Observable = function Observable(subscriber) {
  anInstance(this, $Observable, 'Observable', '_f')._f = aFunction(subscriber);
};

redefineAll($Observable.prototype, {
  subscribe: function subscribe(observer) {
    return new Subscription(observer, this._f);
  },
  forEach: function forEach(fn) {
    var that = this;
    return new (core.Promise || global.Promise)(function (resolve, reject) {
      aFunction(fn);
      var subscription = that.subscribe({
        next: function (value) {
          try {
            return fn(value);
          } catch (e) {
            reject(e);
            subscription.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
    });
  }
});

redefineAll($Observable, {
  from: function from(x) {
    var C = typeof this === 'function' ? this : $Observable;
    var method = getMethod(anObject(x)[OBSERVABLE]);
    if (method) {
      var observable = anObject(method.call(x));
      return observable.constructor === C ? observable : new C(function (observer) {
        return observable.subscribe(observer);
      });
    }
    return new C(function (observer) {
      var done = false;
      microtask(function () {
        if (!done) {
          try {
            if (forOf(x, false, function (it) {
              observer.next(it);
              if (done) return RETURN;
            }) === RETURN) return;
          } catch (e) {
            if (done) throw e;
            observer.error(e);
            return;
          } observer.complete();
        }
      });
      return function () { done = true; };
    });
  },
  of: function of() {
    for (var i = 0, l = arguments.length, items = new Array(l); i < l;) items[i] = arguments[i++];
    return new (typeof this === 'function' ? this : $Observable)(function (observer) {
      var done = false;
      microtask(function () {
        if (!done) {
          for (var j = 0; j < items.length; ++j) {
            observer.next(items[j]);
            if (done) return;
          } observer.complete();
        }
      });
      return function () { done = true; };
    });
  }
});

hide($Observable.prototype, OBSERVABLE, function () { return this; });

$export($export.G, { Observable: $Observable });

require('./_set-species')('Observable');

},{"./_a-function":8,"./_an-instance":11,"./_an-object":12,"./_core":28,"./_export":38,"./_for-of":44,"./_global":45,"./_hide":47,"./_microtask":72,"./_redefine-all":95,"./_set-species":102,"./_wks":131}],300:[function(require,module,exports){
// https://github.com/tc39/proposal-promise-finally
'use strict';
var $export = require('./_export');
var core = require('./_core');
var global = require('./_global');
var speciesConstructor = require('./_species-constructor');
var promiseResolve = require('./_promise-resolve');

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });

},{"./_core":28,"./_export":38,"./_global":45,"./_promise-resolve":93,"./_species-constructor":106}],301:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-promise-try
var $export = require('./_export');
var newPromiseCapability = require('./_new-promise-capability');
var perform = require('./_perform');

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });

},{"./_export":38,"./_new-promise-capability":73,"./_perform":92}],302:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var toMetaKey = metadata.key;
var ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({ defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey) {
  ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
} });

},{"./_an-object":12,"./_metadata":71}],303:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var toMetaKey = metadata.key;
var getOrCreateMetadataMap = metadata.map;
var store = metadata.store;

metadata.exp({ deleteMetadata: function deleteMetadata(metadataKey, target /* , targetKey */) {
  var targetKey = arguments.length < 3 ? undefined : toMetaKey(arguments[2]);
  var metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
  if (metadataMap === undefined || !metadataMap['delete'](metadataKey)) return false;
  if (metadataMap.size) return true;
  var targetMetadata = store.get(target);
  targetMetadata['delete'](targetKey);
  return !!targetMetadata.size || store['delete'](target);
} });

},{"./_an-object":12,"./_metadata":71}],304:[function(require,module,exports){
var Set = require('./es6.set');
var from = require('./_array-from-iterable');
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var getPrototypeOf = require('./_object-gpo');
var ordinaryOwnMetadataKeys = metadata.keys;
var toMetaKey = metadata.key;

var ordinaryMetadataKeys = function (O, P) {
  var oKeys = ordinaryOwnMetadataKeys(O, P);
  var parent = getPrototypeOf(O);
  if (parent === null) return oKeys;
  var pKeys = ordinaryMetadataKeys(parent, P);
  return pKeys.length ? oKeys.length ? from(new Set(oKeys.concat(pKeys))) : pKeys : oKeys;
};

metadata.exp({ getMetadataKeys: function getMetadataKeys(target /* , targetKey */) {
  return ordinaryMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
} });

},{"./_an-object":12,"./_array-from-iterable":15,"./_metadata":71,"./_object-gpo":83,"./es6.set":234}],305:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var getPrototypeOf = require('./_object-gpo');
var ordinaryHasOwnMetadata = metadata.has;
var ordinaryGetOwnMetadata = metadata.get;
var toMetaKey = metadata.key;

var ordinaryGetMetadata = function (MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return ordinaryGetOwnMetadata(MetadataKey, O, P);
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
};

metadata.exp({ getMetadata: function getMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryGetMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });

},{"./_an-object":12,"./_metadata":71,"./_object-gpo":83}],306:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var ordinaryOwnMetadataKeys = metadata.keys;
var toMetaKey = metadata.key;

metadata.exp({ getOwnMetadataKeys: function getOwnMetadataKeys(target /* , targetKey */) {
  return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
} });

},{"./_an-object":12,"./_metadata":71}],307:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var ordinaryGetOwnMetadata = metadata.get;
var toMetaKey = metadata.key;

metadata.exp({ getOwnMetadata: function getOwnMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryGetOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });

},{"./_an-object":12,"./_metadata":71}],308:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var getPrototypeOf = require('./_object-gpo');
var ordinaryHasOwnMetadata = metadata.has;
var toMetaKey = metadata.key;

var ordinaryHasMetadata = function (MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return true;
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
};

metadata.exp({ hasMetadata: function hasMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryHasMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });

},{"./_an-object":12,"./_metadata":71,"./_object-gpo":83}],309:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var ordinaryHasOwnMetadata = metadata.has;
var toMetaKey = metadata.key;

metadata.exp({ hasOwnMetadata: function hasOwnMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryHasOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });

},{"./_an-object":12,"./_metadata":71}],310:[function(require,module,exports){
var $metadata = require('./_metadata');
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var toMetaKey = $metadata.key;
var ordinaryDefineOwnMetadata = $metadata.set;

$metadata.exp({ metadata: function metadata(metadataKey, metadataValue) {
  return function decorator(target, targetKey) {
    ordinaryDefineOwnMetadata(
      metadataKey, metadataValue,
      (targetKey !== undefined ? anObject : aFunction)(target),
      toMetaKey(targetKey)
    );
  };
} });

},{"./_a-function":8,"./_an-object":12,"./_metadata":71}],311:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
require('./_set-collection-from')('Set');

},{"./_set-collection-from":99}],312:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
require('./_set-collection-of')('Set');

},{"./_set-collection-of":100}],313:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = require('./_export');

$export($export.P + $export.R, 'Set', { toJSON: require('./_collection-to-json')('Set') });

},{"./_collection-to-json":25,"./_export":38}],314:[function(require,module,exports){
'use strict';
// https://github.com/mathiasbynens/String.prototype.at
var $export = require('./_export');
var $at = require('./_string-at')(true);

$export($export.P, 'String', {
  at: function at(pos) {
    return $at(this, pos);
  }
});

},{"./_export":38,"./_string-at":108}],315:[function(require,module,exports){
'use strict';
// https://tc39.github.io/String.prototype.matchAll/
var $export = require('./_export');
var defined = require('./_defined');
var toLength = require('./_to-length');
var isRegExp = require('./_is-regexp');
var getFlags = require('./_flags');
var RegExpProto = RegExp.prototype;

var $RegExpStringIterator = function (regexp, string) {
  this._r = regexp;
  this._s = string;
};

require('./_iter-create')($RegExpStringIterator, 'RegExp String', function next() {
  var match = this._r.exec(this._s);
  return { value: match, done: match === null };
});

$export($export.P, 'String', {
  matchAll: function matchAll(regexp) {
    defined(this);
    if (!isRegExp(regexp)) throw TypeError(regexp + ' is not a regexp!');
    var S = String(this);
    var flags = 'flags' in RegExpProto ? String(regexp.flags) : getFlags.call(regexp);
    var rx = new RegExp(regexp.source, ~flags.indexOf('g') ? flags : 'g' + flags);
    rx.lastIndex = toLength(regexp.lastIndex);
    return new $RegExpStringIterator(rx, S);
  }
});

},{"./_defined":33,"./_export":38,"./_flags":42,"./_is-regexp":57,"./_iter-create":59,"./_to-length":120}],316:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export');
var $pad = require('./_string-pad');
var userAgent = require('./_user-agent');

// https://github.com/zloirock/core-js/issues/280
$export($export.P + $export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(userAgent), 'String', {
  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});

},{"./_export":38,"./_string-pad":111,"./_user-agent":127}],317:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export');
var $pad = require('./_string-pad');
var userAgent = require('./_user-agent');

// https://github.com/zloirock/core-js/issues/280
$export($export.P + $export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(userAgent), 'String', {
  padStart: function padStart(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});

},{"./_export":38,"./_string-pad":111,"./_user-agent":127}],318:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./_string-trim')('trimLeft', function ($trim) {
  return function trimLeft() {
    return $trim(this, 1);
  };
}, 'trimStart');

},{"./_string-trim":113}],319:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./_string-trim')('trimRight', function ($trim) {
  return function trimRight() {
    return $trim(this, 2);
  };
}, 'trimEnd');

},{"./_string-trim":113}],320:[function(require,module,exports){
require('./_wks-define')('asyncIterator');

},{"./_wks-define":129}],321:[function(require,module,exports){
require('./_wks-define')('observable');

},{"./_wks-define":129}],322:[function(require,module,exports){
// https://github.com/tc39/proposal-global
var $export = require('./_export');

$export($export.S, 'System', { global: require('./_global') });

},{"./_export":38,"./_global":45}],323:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.from
require('./_set-collection-from')('WeakMap');

},{"./_set-collection-from":99}],324:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.of
require('./_set-collection-of')('WeakMap');

},{"./_set-collection-of":100}],325:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.from
require('./_set-collection-from')('WeakSet');

},{"./_set-collection-from":99}],326:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.of
require('./_set-collection-of')('WeakSet');

},{"./_set-collection-of":100}],327:[function(require,module,exports){
var $iterators = require('./es6.array.iterator');
var getKeys = require('./_object-keys');
var redefine = require('./_redefine');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var wks = require('./_wks');
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}

},{"./_global":45,"./_hide":47,"./_iterators":63,"./_object-keys":85,"./_redefine":96,"./_wks":131,"./es6.array.iterator":144}],328:[function(require,module,exports){
var $export = require('./_export');
var $task = require('./_task');
$export($export.G + $export.B, {
  setImmediate: $task.set,
  clearImmediate: $task.clear
});

},{"./_export":38,"./_task":115}],329:[function(require,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var global = require('./_global');
var $export = require('./_export');
var userAgent = require('./_user-agent');
var slice = [].slice;
var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check
var wrap = function (set) {
  return function (fn, time /* , ...args */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : false;
    return set(boundArgs ? function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(this, args);
    } : fn, time);
  };
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout: wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});

},{"./_export":38,"./_global":45,"./_user-agent":127}],330:[function(require,module,exports){
require('./modules/es6.symbol');
require('./modules/es6.object.create');
require('./modules/es6.object.define-property');
require('./modules/es6.object.define-properties');
require('./modules/es6.object.get-own-property-descriptor');
require('./modules/es6.object.get-prototype-of');
require('./modules/es6.object.keys');
require('./modules/es6.object.get-own-property-names');
require('./modules/es6.object.freeze');
require('./modules/es6.object.seal');
require('./modules/es6.object.prevent-extensions');
require('./modules/es6.object.is-frozen');
require('./modules/es6.object.is-sealed');
require('./modules/es6.object.is-extensible');
require('./modules/es6.object.assign');
require('./modules/es6.object.is');
require('./modules/es6.object.set-prototype-of');
require('./modules/es6.object.to-string');
require('./modules/es6.function.bind');
require('./modules/es6.function.name');
require('./modules/es6.function.has-instance');
require('./modules/es6.parse-int');
require('./modules/es6.parse-float');
require('./modules/es6.number.constructor');
require('./modules/es6.number.to-fixed');
require('./modules/es6.number.to-precision');
require('./modules/es6.number.epsilon');
require('./modules/es6.number.is-finite');
require('./modules/es6.number.is-integer');
require('./modules/es6.number.is-nan');
require('./modules/es6.number.is-safe-integer');
require('./modules/es6.number.max-safe-integer');
require('./modules/es6.number.min-safe-integer');
require('./modules/es6.number.parse-float');
require('./modules/es6.number.parse-int');
require('./modules/es6.math.acosh');
require('./modules/es6.math.asinh');
require('./modules/es6.math.atanh');
require('./modules/es6.math.cbrt');
require('./modules/es6.math.clz32');
require('./modules/es6.math.cosh');
require('./modules/es6.math.expm1');
require('./modules/es6.math.fround');
require('./modules/es6.math.hypot');
require('./modules/es6.math.imul');
require('./modules/es6.math.log10');
require('./modules/es6.math.log1p');
require('./modules/es6.math.log2');
require('./modules/es6.math.sign');
require('./modules/es6.math.sinh');
require('./modules/es6.math.tanh');
require('./modules/es6.math.trunc');
require('./modules/es6.string.from-code-point');
require('./modules/es6.string.raw');
require('./modules/es6.string.trim');
require('./modules/es6.string.iterator');
require('./modules/es6.string.code-point-at');
require('./modules/es6.string.ends-with');
require('./modules/es6.string.includes');
require('./modules/es6.string.repeat');
require('./modules/es6.string.starts-with');
require('./modules/es6.string.anchor');
require('./modules/es6.string.big');
require('./modules/es6.string.blink');
require('./modules/es6.string.bold');
require('./modules/es6.string.fixed');
require('./modules/es6.string.fontcolor');
require('./modules/es6.string.fontsize');
require('./modules/es6.string.italics');
require('./modules/es6.string.link');
require('./modules/es6.string.small');
require('./modules/es6.string.strike');
require('./modules/es6.string.sub');
require('./modules/es6.string.sup');
require('./modules/es6.date.now');
require('./modules/es6.date.to-json');
require('./modules/es6.date.to-iso-string');
require('./modules/es6.date.to-string');
require('./modules/es6.date.to-primitive');
require('./modules/es6.array.is-array');
require('./modules/es6.array.from');
require('./modules/es6.array.of');
require('./modules/es6.array.join');
require('./modules/es6.array.slice');
require('./modules/es6.array.sort');
require('./modules/es6.array.for-each');
require('./modules/es6.array.map');
require('./modules/es6.array.filter');
require('./modules/es6.array.some');
require('./modules/es6.array.every');
require('./modules/es6.array.reduce');
require('./modules/es6.array.reduce-right');
require('./modules/es6.array.index-of');
require('./modules/es6.array.last-index-of');
require('./modules/es6.array.copy-within');
require('./modules/es6.array.fill');
require('./modules/es6.array.find');
require('./modules/es6.array.find-index');
require('./modules/es6.array.species');
require('./modules/es6.array.iterator');
require('./modules/es6.regexp.constructor');
require('./modules/es6.regexp.to-string');
require('./modules/es6.regexp.flags');
require('./modules/es6.regexp.match');
require('./modules/es6.regexp.replace');
require('./modules/es6.regexp.search');
require('./modules/es6.regexp.split');
require('./modules/es6.promise');
require('./modules/es6.map');
require('./modules/es6.set');
require('./modules/es6.weak-map');
require('./modules/es6.weak-set');
require('./modules/es6.typed.array-buffer');
require('./modules/es6.typed.data-view');
require('./modules/es6.typed.int8-array');
require('./modules/es6.typed.uint8-array');
require('./modules/es6.typed.uint8-clamped-array');
require('./modules/es6.typed.int16-array');
require('./modules/es6.typed.uint16-array');
require('./modules/es6.typed.int32-array');
require('./modules/es6.typed.uint32-array');
require('./modules/es6.typed.float32-array');
require('./modules/es6.typed.float64-array');
require('./modules/es6.reflect.apply');
require('./modules/es6.reflect.construct');
require('./modules/es6.reflect.define-property');
require('./modules/es6.reflect.delete-property');
require('./modules/es6.reflect.enumerate');
require('./modules/es6.reflect.get');
require('./modules/es6.reflect.get-own-property-descriptor');
require('./modules/es6.reflect.get-prototype-of');
require('./modules/es6.reflect.has');
require('./modules/es6.reflect.is-extensible');
require('./modules/es6.reflect.own-keys');
require('./modules/es6.reflect.prevent-extensions');
require('./modules/es6.reflect.set');
require('./modules/es6.reflect.set-prototype-of');
require('./modules/es7.array.includes');
require('./modules/es7.array.flat-map');
require('./modules/es7.array.flatten');
require('./modules/es7.string.at');
require('./modules/es7.string.pad-start');
require('./modules/es7.string.pad-end');
require('./modules/es7.string.trim-left');
require('./modules/es7.string.trim-right');
require('./modules/es7.string.match-all');
require('./modules/es7.symbol.async-iterator');
require('./modules/es7.symbol.observable');
require('./modules/es7.object.get-own-property-descriptors');
require('./modules/es7.object.values');
require('./modules/es7.object.entries');
require('./modules/es7.object.define-getter');
require('./modules/es7.object.define-setter');
require('./modules/es7.object.lookup-getter');
require('./modules/es7.object.lookup-setter');
require('./modules/es7.map.to-json');
require('./modules/es7.set.to-json');
require('./modules/es7.map.of');
require('./modules/es7.set.of');
require('./modules/es7.weak-map.of');
require('./modules/es7.weak-set.of');
require('./modules/es7.map.from');
require('./modules/es7.set.from');
require('./modules/es7.weak-map.from');
require('./modules/es7.weak-set.from');
require('./modules/es7.global');
require('./modules/es7.system.global');
require('./modules/es7.error.is-error');
require('./modules/es7.math.clamp');
require('./modules/es7.math.deg-per-rad');
require('./modules/es7.math.degrees');
require('./modules/es7.math.fscale');
require('./modules/es7.math.iaddh');
require('./modules/es7.math.isubh');
require('./modules/es7.math.imulh');
require('./modules/es7.math.rad-per-deg');
require('./modules/es7.math.radians');
require('./modules/es7.math.scale');
require('./modules/es7.math.umulh');
require('./modules/es7.math.signbit');
require('./modules/es7.promise.finally');
require('./modules/es7.promise.try');
require('./modules/es7.reflect.define-metadata');
require('./modules/es7.reflect.delete-metadata');
require('./modules/es7.reflect.get-metadata');
require('./modules/es7.reflect.get-metadata-keys');
require('./modules/es7.reflect.get-own-metadata');
require('./modules/es7.reflect.get-own-metadata-keys');
require('./modules/es7.reflect.has-metadata');
require('./modules/es7.reflect.has-own-metadata');
require('./modules/es7.reflect.metadata');
require('./modules/es7.asap');
require('./modules/es7.observable');
require('./modules/web.timers');
require('./modules/web.immediate');
require('./modules/web.dom.iterable');
module.exports = require('./modules/_core');

},{"./modules/_core":28,"./modules/es6.array.copy-within":134,"./modules/es6.array.every":135,"./modules/es6.array.fill":136,"./modules/es6.array.filter":137,"./modules/es6.array.find":139,"./modules/es6.array.find-index":138,"./modules/es6.array.for-each":140,"./modules/es6.array.from":141,"./modules/es6.array.index-of":142,"./modules/es6.array.is-array":143,"./modules/es6.array.iterator":144,"./modules/es6.array.join":145,"./modules/es6.array.last-index-of":146,"./modules/es6.array.map":147,"./modules/es6.array.of":148,"./modules/es6.array.reduce":150,"./modules/es6.array.reduce-right":149,"./modules/es6.array.slice":151,"./modules/es6.array.some":152,"./modules/es6.array.sort":153,"./modules/es6.array.species":154,"./modules/es6.date.now":155,"./modules/es6.date.to-iso-string":156,"./modules/es6.date.to-json":157,"./modules/es6.date.to-primitive":158,"./modules/es6.date.to-string":159,"./modules/es6.function.bind":160,"./modules/es6.function.has-instance":161,"./modules/es6.function.name":162,"./modules/es6.map":163,"./modules/es6.math.acosh":164,"./modules/es6.math.asinh":165,"./modules/es6.math.atanh":166,"./modules/es6.math.cbrt":167,"./modules/es6.math.clz32":168,"./modules/es6.math.cosh":169,"./modules/es6.math.expm1":170,"./modules/es6.math.fround":171,"./modules/es6.math.hypot":172,"./modules/es6.math.imul":173,"./modules/es6.math.log10":174,"./modules/es6.math.log1p":175,"./modules/es6.math.log2":176,"./modules/es6.math.sign":177,"./modules/es6.math.sinh":178,"./modules/es6.math.tanh":179,"./modules/es6.math.trunc":180,"./modules/es6.number.constructor":181,"./modules/es6.number.epsilon":182,"./modules/es6.number.is-finite":183,"./modules/es6.number.is-integer":184,"./modules/es6.number.is-nan":185,"./modules/es6.number.is-safe-integer":186,"./modules/es6.number.max-safe-integer":187,"./modules/es6.number.min-safe-integer":188,"./modules/es6.number.parse-float":189,"./modules/es6.number.parse-int":190,"./modules/es6.number.to-fixed":191,"./modules/es6.number.to-precision":192,"./modules/es6.object.assign":193,"./modules/es6.object.create":194,"./modules/es6.object.define-properties":195,"./modules/es6.object.define-property":196,"./modules/es6.object.freeze":197,"./modules/es6.object.get-own-property-descriptor":198,"./modules/es6.object.get-own-property-names":199,"./modules/es6.object.get-prototype-of":200,"./modules/es6.object.is":204,"./modules/es6.object.is-extensible":201,"./modules/es6.object.is-frozen":202,"./modules/es6.object.is-sealed":203,"./modules/es6.object.keys":205,"./modules/es6.object.prevent-extensions":206,"./modules/es6.object.seal":207,"./modules/es6.object.set-prototype-of":208,"./modules/es6.object.to-string":209,"./modules/es6.parse-float":210,"./modules/es6.parse-int":211,"./modules/es6.promise":212,"./modules/es6.reflect.apply":213,"./modules/es6.reflect.construct":214,"./modules/es6.reflect.define-property":215,"./modules/es6.reflect.delete-property":216,"./modules/es6.reflect.enumerate":217,"./modules/es6.reflect.get":220,"./modules/es6.reflect.get-own-property-descriptor":218,"./modules/es6.reflect.get-prototype-of":219,"./modules/es6.reflect.has":221,"./modules/es6.reflect.is-extensible":222,"./modules/es6.reflect.own-keys":223,"./modules/es6.reflect.prevent-extensions":224,"./modules/es6.reflect.set":226,"./modules/es6.reflect.set-prototype-of":225,"./modules/es6.regexp.constructor":227,"./modules/es6.regexp.flags":228,"./modules/es6.regexp.match":229,"./modules/es6.regexp.replace":230,"./modules/es6.regexp.search":231,"./modules/es6.regexp.split":232,"./modules/es6.regexp.to-string":233,"./modules/es6.set":234,"./modules/es6.string.anchor":235,"./modules/es6.string.big":236,"./modules/es6.string.blink":237,"./modules/es6.string.bold":238,"./modules/es6.string.code-point-at":239,"./modules/es6.string.ends-with":240,"./modules/es6.string.fixed":241,"./modules/es6.string.fontcolor":242,"./modules/es6.string.fontsize":243,"./modules/es6.string.from-code-point":244,"./modules/es6.string.includes":245,"./modules/es6.string.italics":246,"./modules/es6.string.iterator":247,"./modules/es6.string.link":248,"./modules/es6.string.raw":249,"./modules/es6.string.repeat":250,"./modules/es6.string.small":251,"./modules/es6.string.starts-with":252,"./modules/es6.string.strike":253,"./modules/es6.string.sub":254,"./modules/es6.string.sup":255,"./modules/es6.string.trim":256,"./modules/es6.symbol":257,"./modules/es6.typed.array-buffer":258,"./modules/es6.typed.data-view":259,"./modules/es6.typed.float32-array":260,"./modules/es6.typed.float64-array":261,"./modules/es6.typed.int16-array":262,"./modules/es6.typed.int32-array":263,"./modules/es6.typed.int8-array":264,"./modules/es6.typed.uint16-array":265,"./modules/es6.typed.uint32-array":266,"./modules/es6.typed.uint8-array":267,"./modules/es6.typed.uint8-clamped-array":268,"./modules/es6.weak-map":269,"./modules/es6.weak-set":270,"./modules/es7.array.flat-map":271,"./modules/es7.array.flatten":272,"./modules/es7.array.includes":273,"./modules/es7.asap":274,"./modules/es7.error.is-error":275,"./modules/es7.global":276,"./modules/es7.map.from":277,"./modules/es7.map.of":278,"./modules/es7.map.to-json":279,"./modules/es7.math.clamp":280,"./modules/es7.math.deg-per-rad":281,"./modules/es7.math.degrees":282,"./modules/es7.math.fscale":283,"./modules/es7.math.iaddh":284,"./modules/es7.math.imulh":285,"./modules/es7.math.isubh":286,"./modules/es7.math.rad-per-deg":287,"./modules/es7.math.radians":288,"./modules/es7.math.scale":289,"./modules/es7.math.signbit":290,"./modules/es7.math.umulh":291,"./modules/es7.object.define-getter":292,"./modules/es7.object.define-setter":293,"./modules/es7.object.entries":294,"./modules/es7.object.get-own-property-descriptors":295,"./modules/es7.object.lookup-getter":296,"./modules/es7.object.lookup-setter":297,"./modules/es7.object.values":298,"./modules/es7.observable":299,"./modules/es7.promise.finally":300,"./modules/es7.promise.try":301,"./modules/es7.reflect.define-metadata":302,"./modules/es7.reflect.delete-metadata":303,"./modules/es7.reflect.get-metadata":305,"./modules/es7.reflect.get-metadata-keys":304,"./modules/es7.reflect.get-own-metadata":307,"./modules/es7.reflect.get-own-metadata-keys":306,"./modules/es7.reflect.has-metadata":308,"./modules/es7.reflect.has-own-metadata":309,"./modules/es7.reflect.metadata":310,"./modules/es7.set.from":311,"./modules/es7.set.of":312,"./modules/es7.set.to-json":313,"./modules/es7.string.at":314,"./modules/es7.string.match-all":315,"./modules/es7.string.pad-end":316,"./modules/es7.string.pad-start":317,"./modules/es7.string.trim-left":318,"./modules/es7.string.trim-right":319,"./modules/es7.symbol.async-iterator":320,"./modules/es7.symbol.observable":321,"./modules/es7.system.global":322,"./modules/es7.weak-map.from":323,"./modules/es7.weak-map.of":324,"./modules/es7.weak-set.from":325,"./modules/es7.weak-set.of":326,"./modules/web.dom.iterable":327,"./modules/web.immediate":328,"./modules/web.timers":329}],331:[function(require,module,exports){
/* global HTMLElement */

'use strict'

module.exports = function emptyElement (element) {
  if (!(element instanceof HTMLElement)) {
    throw new TypeError('Expected an element')
  }

  var node
  while ((node = element.lastChild)) element.removeChild(node)
  return element
}

},{}],332:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"min-document":4}],333:[function(require,module,exports){
(function (global){
var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],334:[function(require,module,exports){
module.exports = attributeToProperty

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function attributeToProperty (h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr]
        delete attrs[attr]
      }
    }
    return h(tagName, attrs, children)
  }
}

},{}],335:[function(require,module,exports){
var attrToProp = require('hyperscript-attribute-to-property')

var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
var ATTR_KEY = 5, ATTR_KEY_W = 6
var ATTR_VALUE_W = 7, ATTR_VALUE = 8
var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
var ATTR_EQ = 11, ATTR_BREAK = 12
var COMMENT = 13

module.exports = function (h, opts) {
  if (!opts) opts = {}
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b)
  }
  if (opts.attrToProp !== false) {
    h = attrToProp(h)
  }

  return function (strings) {
    var state = TEXT, reg = ''
    var arglen = arguments.length
    var parts = []

    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i+1]
        var p = parse(strings[i])
        var xstate = state
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
        if (xstate === ATTR) xstate = ATTR_KEY
        if (xstate === OPEN) {
          if (reg === '/') {
            p.push([ OPEN, '/', arg ])
            reg = ''
          } else {
            p.push([ OPEN, arg ])
          }
        } else {
          p.push([ VAR, xstate, arg ])
        }
        parts.push.apply(parts, p)
      } else parts.push.apply(parts, parse(strings[i]))
    }

    var tree = [null,{},[]]
    var stack = [[tree,-1]]
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length-1][0]
      var p = parts[i], s = p[0]
      if (s === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length-1][1]
        if (stack.length > 1) {
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === OPEN) {
        var c = [p[1],{},[]]
        cur[2].push(c)
        stack.push([c,cur[2].length-1])
      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
        var key = ''
        var copyKey
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1])
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey]
                }
              }
            } else {
              key = concat(key, parts[i][2])
            }
          } else break
        }
        if (parts[i][0] === ATTR_EQ) i++
        var j = i
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
            else parts[i][1]==="" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
          } else if (parts[i][0] === VAR
          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
            else parts[i][2]==="" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
          } else {
            if (key.length && !cur[1][key] && i === j
            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase()
            }
            if (parts[i][0] === CLOSE) {
              i--
            }
            break
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var ix = stack[stack.length-1][1]
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = ''
        else if (!p[2]) p[2] = concat('', p[2])
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2])
        } else {
          cur[2].push(p[2])
        }
      } else if (s === TEXT) {
        cur[2].push(p[1])
      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error('unhandled: ' + s)
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift()
    }

    if (tree[2].length > 2
    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      throw new Error(
        'multiple root elements must be wrapped in an enclosing tag'
      )
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
    && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
    }
    return tree[2][0]

    function parse (str) {
      var res = []
      if (state === ATTR_VALUE_W) state = ATTR
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i)
        if (state === TEXT && c === '<') {
          if (reg.length) res.push([TEXT, reg])
          reg = ''
          state = OPEN
        } else if (c === '>' && !quot(state) && state !== COMMENT) {
          if (state === OPEN && reg.length) {
            res.push([OPEN,reg])
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY,reg])
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE,reg])
          }
          res.push([CLOSE])
          reg = ''
          state = TEXT
        } else if (state === COMMENT && /-$/.test(reg) && c === '-') {
          if (opts.comments) {
            res.push([ATTR_VALUE,reg.substr(0, reg.length - 1)],[CLOSE])
          }
          reg = ''
          state = TEXT
        } else if (state === OPEN && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN, reg],[ATTR_KEY,'comment'],[ATTR_EQ])
          }
          reg = c
          state = COMMENT
        } else if (state === TEXT || state === COMMENT) {
          reg += c
        } else if (state === OPEN && c === '/' && reg.length) {
          // no-op, self closing tag without a space <br/>
        } else if (state === OPEN && /\s/.test(c)) {
          if (reg.length) {
            res.push([OPEN, reg])
          }
          reg = ''
          state = ATTR
        } else if (state === OPEN) {
          reg += c
        } else if (state === ATTR && /[^\s"'=/]/.test(c)) {
          state = ATTR_KEY
          reg = c
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length) res.push([ATTR_KEY,reg])
          res.push([ATTR_BREAK])
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY,reg])
          reg = ''
          state = ATTR_KEY_W
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY,reg],[ATTR_EQ])
          reg = ''
          state = ATTR_VALUE_W
        } else if (state === ATTR_KEY) {
          reg += c
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ])
          state = ATTR_VALUE_W
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK])
          if (/[\w-]/.test(c)) {
            reg += c
            state = ATTR_KEY
          } else state = ATTR
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE
          i--
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
        || state === ATTR_VALUE_DQ) {
          reg += c
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT,reg])
        reg = ''
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY,reg])
        reg = ''
      }
      return res
    }
  }

  function strfn (x) {
    if (typeof x === 'function') return x
    else if (typeof x === 'string') return x
    else if (x && typeof x === 'object') return x
    else return concat('', x)
  }
}

function quot (state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
}

var hasOwn = Object.prototype.hasOwnProperty
function has (obj, key) { return hasOwn.call(obj, key) }

var closeRE = RegExp('^(' + [
  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr', '!--',
  // SVG TAGS
  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
  'feBlend', 'feColorMatrix', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
  'vkern'
].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
function selfClosing (tag) { return closeRE.test(tag) }

},{"hyperscript-attribute-to-property":334}],336:[function(require,module,exports){
'use strict';

var range; // Create a range object for efficently rendering strings to elements.
var NS_XHTML = 'http://www.w3.org/1999/xhtml';

var doc = typeof document === 'undefined' ? undefined : document;

var testEl = doc ?
    doc.body || doc.createElement('div') :
    {};

// Fixes <https://github.com/patrick-steele-idem/morphdom/issues/32>
// (IE7+ support) <=IE7 does not support el.hasAttribute(name)
var actualHasAttributeNS;

if (testEl.hasAttributeNS) {
    actualHasAttributeNS = function(el, namespaceURI, name) {
        return el.hasAttributeNS(namespaceURI, name);
    };
} else if (testEl.hasAttribute) {
    actualHasAttributeNS = function(el, namespaceURI, name) {
        return el.hasAttribute(name);
    };
} else {
    actualHasAttributeNS = function(el, namespaceURI, name) {
        return el.getAttributeNode(namespaceURI, name) != null;
    };
}

var hasAttributeNS = actualHasAttributeNS;


function toElement(str) {
    if (!range && doc.createRange) {
        range = doc.createRange();
        range.selectNode(doc.body);
    }

    var fragment;
    if (range && range.createContextualFragment) {
        fragment = range.createContextualFragment(str);
    } else {
        fragment = doc.createElement('body');
        fragment.innerHTML = str;
    }
    return fragment.childNodes[0];
}

/**
 * Returns true if two node's names are the same.
 *
 * NOTE: We don't bother checking `namespaceURI` because you will never find two HTML elements with the same
 *       nodeName and different namespace URIs.
 *
 * @param {Element} a
 * @param {Element} b The target element
 * @return {boolean}
 */
function compareNodeNames(fromEl, toEl) {
    var fromNodeName = fromEl.nodeName;
    var toNodeName = toEl.nodeName;

    if (fromNodeName === toNodeName) {
        return true;
    }

    if (toEl.actualize &&
        fromNodeName.charCodeAt(0) < 91 && /* from tag name is upper case */
        toNodeName.charCodeAt(0) > 90 /* target tag name is lower case */) {
        // If the target element is a virtual DOM node then we may need to normalize the tag name
        // before comparing. Normal HTML elements that are in the "http://www.w3.org/1999/xhtml"
        // are converted to upper case
        return fromNodeName === toNodeName.toUpperCase();
    } else {
        return false;
    }
}

/**
 * Create an element, optionally with a known namespace URI.
 *
 * @param {string} name the element name, e.g. 'div' or 'svg'
 * @param {string} [namespaceURI] the element's namespace URI, i.e. the value of
 * its `xmlns` attribute or its inferred namespace.
 *
 * @return {Element}
 */
function createElementNS(name, namespaceURI) {
    return !namespaceURI || namespaceURI === NS_XHTML ?
        doc.createElement(name) :
        doc.createElementNS(namespaceURI, name);
}

/**
 * Copies the children of one DOM element to another DOM element
 */
function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while (curChild) {
        var nextChild = curChild.nextSibling;
        toEl.appendChild(curChild);
        curChild = nextChild;
    }
    return toEl;
}

function morphAttrs(fromNode, toNode) {
    var attrs = toNode.attributes;
    var i;
    var attr;
    var attrName;
    var attrNamespaceURI;
    var attrValue;
    var fromValue;

    for (i = attrs.length - 1; i >= 0; --i) {
        attr = attrs[i];
        attrName = attr.name;
        attrNamespaceURI = attr.namespaceURI;
        attrValue = attr.value;

        if (attrNamespaceURI) {
            attrName = attr.localName || attrName;
            fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);

            if (fromValue !== attrValue) {
                fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
            }
        } else {
            fromValue = fromNode.getAttribute(attrName);

            if (fromValue !== attrValue) {
                fromNode.setAttribute(attrName, attrValue);
            }
        }
    }

    // Remove any extra attributes found on the original DOM element that
    // weren't found on the target element.
    attrs = fromNode.attributes;

    for (i = attrs.length - 1; i >= 0; --i) {
        attr = attrs[i];
        if (attr.specified !== false) {
            attrName = attr.name;
            attrNamespaceURI = attr.namespaceURI;

            if (attrNamespaceURI) {
                attrName = attr.localName || attrName;

                if (!hasAttributeNS(toNode, attrNamespaceURI, attrName)) {
                    fromNode.removeAttributeNS(attrNamespaceURI, attrName);
                }
            } else {
                if (!hasAttributeNS(toNode, null, attrName)) {
                    fromNode.removeAttribute(attrName);
                }
            }
        }
    }
}

function syncBooleanAttrProp(fromEl, toEl, name) {
    if (fromEl[name] !== toEl[name]) {
        fromEl[name] = toEl[name];
        if (fromEl[name]) {
            fromEl.setAttribute(name, '');
        } else {
            fromEl.removeAttribute(name, '');
        }
    }
}

var specialElHandlers = {
    /**
     * Needed for IE. Apparently IE doesn't think that "selected" is an
     * attribute when reading over the attributes using selectEl.attributes
     */
    OPTION: function(fromEl, toEl) {
        syncBooleanAttrProp(fromEl, toEl, 'selected');
    },
    /**
     * The "value" attribute is special for the <input> element since it sets
     * the initial value. Changing the "value" attribute without changing the
     * "value" property will have no effect since it is only used to the set the
     * initial value.  Similar for the "checked" attribute, and "disabled".
     */
    INPUT: function(fromEl, toEl) {
        syncBooleanAttrProp(fromEl, toEl, 'checked');
        syncBooleanAttrProp(fromEl, toEl, 'disabled');

        if (fromEl.value !== toEl.value) {
            fromEl.value = toEl.value;
        }

        if (!hasAttributeNS(toEl, null, 'value')) {
            fromEl.removeAttribute('value');
        }
    },

    TEXTAREA: function(fromEl, toEl) {
        var newValue = toEl.value;
        if (fromEl.value !== newValue) {
            fromEl.value = newValue;
        }

        var firstChild = fromEl.firstChild;
        if (firstChild) {
            // Needed for IE. Apparently IE sets the placeholder as the
            // node value and vise versa. This ignores an empty update.
            var oldValue = firstChild.nodeValue;

            if (oldValue == newValue || (!newValue && oldValue == fromEl.placeholder)) {
                return;
            }

            firstChild.nodeValue = newValue;
        }
    },
    SELECT: function(fromEl, toEl) {
        if (!hasAttributeNS(toEl, null, 'multiple')) {
            var selectedIndex = -1;
            var i = 0;
            var curChild = toEl.firstChild;
            while(curChild) {
                var nodeName = curChild.nodeName;
                if (nodeName && nodeName.toUpperCase() === 'OPTION') {
                    if (hasAttributeNS(curChild, null, 'selected')) {
                        selectedIndex = i;
                        break;
                    }
                    i++;
                }
                curChild = curChild.nextSibling;
            }

            fromEl.selectedIndex = i;
        }
    }
};

var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;

function noop() {}

function defaultGetNodeKey(node) {
    return node.id;
}

function morphdomFactory(morphAttrs) {

    return function morphdom(fromNode, toNode, options) {
        if (!options) {
            options = {};
        }

        if (typeof toNode === 'string') {
            if (fromNode.nodeName === '#document' || fromNode.nodeName === 'HTML') {
                var toNodeHtml = toNode;
                toNode = doc.createElement('html');
                toNode.innerHTML = toNodeHtml;
            } else {
                toNode = toElement(toNode);
            }
        }

        var getNodeKey = options.getNodeKey || defaultGetNodeKey;
        var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
        var onNodeAdded = options.onNodeAdded || noop;
        var onBeforeElUpdated = options.onBeforeElUpdated || noop;
        var onElUpdated = options.onElUpdated || noop;
        var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
        var onNodeDiscarded = options.onNodeDiscarded || noop;
        var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
        var childrenOnly = options.childrenOnly === true;

        // This object is used as a lookup to quickly find all keyed elements in the original DOM tree.
        var fromNodesLookup = {};
        var keyedRemovalList;

        function addKeyedRemoval(key) {
            if (keyedRemovalList) {
                keyedRemovalList.push(key);
            } else {
                keyedRemovalList = [key];
            }
        }

        function walkDiscardedChildNodes(node, skipKeyedNodes) {
            if (node.nodeType === ELEMENT_NODE) {
                var curChild = node.firstChild;
                while (curChild) {

                    var key = undefined;

                    if (skipKeyedNodes && (key = getNodeKey(curChild))) {
                        // If we are skipping keyed nodes then we add the key
                        // to a list so that it can be handled at the very end.
                        addKeyedRemoval(key);
                    } else {
                        // Only report the node as discarded if it is not keyed. We do this because
                        // at the end we loop through all keyed elements that were unmatched
                        // and then discard them in one final pass.
                        onNodeDiscarded(curChild);
                        if (curChild.firstChild) {
                            walkDiscardedChildNodes(curChild, skipKeyedNodes);
                        }
                    }

                    curChild = curChild.nextSibling;
                }
            }
        }

        /**
         * Removes a DOM node out of the original DOM
         *
         * @param  {Node} node The node to remove
         * @param  {Node} parentNode The nodes parent
         * @param  {Boolean} skipKeyedNodes If true then elements with keys will be skipped and not discarded.
         * @return {undefined}
         */
        function removeNode(node, parentNode, skipKeyedNodes) {
            if (onBeforeNodeDiscarded(node) === false) {
                return;
            }

            if (parentNode) {
                parentNode.removeChild(node);
            }

            onNodeDiscarded(node);
            walkDiscardedChildNodes(node, skipKeyedNodes);
        }

        // // TreeWalker implementation is no faster, but keeping this around in case this changes in the future
        // function indexTree(root) {
        //     var treeWalker = document.createTreeWalker(
        //         root,
        //         NodeFilter.SHOW_ELEMENT);
        //
        //     var el;
        //     while((el = treeWalker.nextNode())) {
        //         var key = getNodeKey(el);
        //         if (key) {
        //             fromNodesLookup[key] = el;
        //         }
        //     }
        // }

        // // NodeIterator implementation is no faster, but keeping this around in case this changes in the future
        //
        // function indexTree(node) {
        //     var nodeIterator = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT);
        //     var el;
        //     while((el = nodeIterator.nextNode())) {
        //         var key = getNodeKey(el);
        //         if (key) {
        //             fromNodesLookup[key] = el;
        //         }
        //     }
        // }

        function indexTree(node) {
            if (node.nodeType === ELEMENT_NODE) {
                var curChild = node.firstChild;
                while (curChild) {
                    var key = getNodeKey(curChild);
                    if (key) {
                        fromNodesLookup[key] = curChild;
                    }

                    // Walk recursively
                    indexTree(curChild);

                    curChild = curChild.nextSibling;
                }
            }
        }

        indexTree(fromNode);

        function handleNodeAdded(el) {
            onNodeAdded(el);

            var curChild = el.firstChild;
            while (curChild) {
                var nextSibling = curChild.nextSibling;

                var key = getNodeKey(curChild);
                if (key) {
                    var unmatchedFromEl = fromNodesLookup[key];
                    if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
                        curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
                        morphEl(unmatchedFromEl, curChild);
                    }
                }

                handleNodeAdded(curChild);
                curChild = nextSibling;
            }
        }

        function morphEl(fromEl, toEl, childrenOnly) {
            var toElKey = getNodeKey(toEl);
            var curFromNodeKey;

            if (toElKey) {
                // If an element with an ID is being morphed then it is will be in the final
                // DOM so clear it out of the saved elements collection
                delete fromNodesLookup[toElKey];
            }

            if (toNode.isSameNode && toNode.isSameNode(fromNode)) {
                return;
            }

            if (!childrenOnly) {
                if (onBeforeElUpdated(fromEl, toEl) === false) {
                    return;
                }

                morphAttrs(fromEl, toEl);
                onElUpdated(fromEl);

                if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
                    return;
                }
            }

            if (fromEl.nodeName !== 'TEXTAREA') {
                var curToNodeChild = toEl.firstChild;
                var curFromNodeChild = fromEl.firstChild;
                var curToNodeKey;

                var fromNextSibling;
                var toNextSibling;
                var matchingFromEl;

                outer: while (curToNodeChild) {
                    toNextSibling = curToNodeChild.nextSibling;
                    curToNodeKey = getNodeKey(curToNodeChild);

                    while (curFromNodeChild) {
                        fromNextSibling = curFromNodeChild.nextSibling;

                        if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
                            curToNodeChild = toNextSibling;
                            curFromNodeChild = fromNextSibling;
                            continue outer;
                        }

                        curFromNodeKey = getNodeKey(curFromNodeChild);

                        var curFromNodeType = curFromNodeChild.nodeType;

                        var isCompatible = undefined;

                        if (curFromNodeType === curToNodeChild.nodeType) {
                            if (curFromNodeType === ELEMENT_NODE) {
                                // Both nodes being compared are Element nodes

                                if (curToNodeKey) {
                                    // The target node has a key so we want to match it up with the correct element
                                    // in the original DOM tree
                                    if (curToNodeKey !== curFromNodeKey) {
                                        // The current element in the original DOM tree does not have a matching key so
                                        // let's check our lookup to see if there is a matching element in the original
                                        // DOM tree
                                        if ((matchingFromEl = fromNodesLookup[curToNodeKey])) {
                                            if (curFromNodeChild.nextSibling === matchingFromEl) {
                                                // Special case for single element removals. To avoid removing the original
                                                // DOM node out of the tree (since that can break CSS transitions, etc.),
                                                // we will instead discard the current node and wait until the next
                                                // iteration to properly match up the keyed target element with its matching
                                                // element in the original tree
                                                isCompatible = false;
                                            } else {
                                                // We found a matching keyed element somewhere in the original DOM tree.
                                                // Let's moving the original DOM node into the current position and morph
                                                // it.

                                                // NOTE: We use insertBefore instead of replaceChild because we want to go through
                                                // the `removeNode()` function for the node that is being discarded so that
                                                // all lifecycle hooks are correctly invoked
                                                fromEl.insertBefore(matchingFromEl, curFromNodeChild);

                                                fromNextSibling = curFromNodeChild.nextSibling;

                                                if (curFromNodeKey) {
                                                    // Since the node is keyed it might be matched up later so we defer
                                                    // the actual removal to later
                                                    addKeyedRemoval(curFromNodeKey);
                                                } else {
                                                    // NOTE: we skip nested keyed nodes from being removed since there is
                                                    //       still a chance they will be matched up later
                                                    removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
                                                }

                                                curFromNodeChild = matchingFromEl;
                                            }
                                        } else {
                                            // The nodes are not compatible since the "to" node has a key and there
                                            // is no matching keyed node in the source tree
                                            isCompatible = false;
                                        }
                                    }
                                } else if (curFromNodeKey) {
                                    // The original has a key
                                    isCompatible = false;
                                }

                                isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
                                if (isCompatible) {
                                    // We found compatible DOM elements so transform
                                    // the current "from" node to match the current
                                    // target DOM node.
                                    morphEl(curFromNodeChild, curToNodeChild);
                                }

                            } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                                // Both nodes being compared are Text or Comment nodes
                                isCompatible = true;
                                // Simply update nodeValue on the original node to
                                // change the text value
                                if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                                    curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                                }

                            }
                        }

                        if (isCompatible) {
                            // Advance both the "to" child and the "from" child since we found a match
                            curToNodeChild = toNextSibling;
                            curFromNodeChild = fromNextSibling;
                            continue outer;
                        }

                        // No compatible match so remove the old node from the DOM and continue trying to find a
                        // match in the original DOM. However, we only do this if the from node is not keyed
                        // since it is possible that a keyed node might match up with a node somewhere else in the
                        // target tree and we don't want to discard it just yet since it still might find a
                        // home in the final DOM tree. After everything is done we will remove any keyed nodes
                        // that didn't find a home
                        if (curFromNodeKey) {
                            // Since the node is keyed it might be matched up later so we defer
                            // the actual removal to later
                            addKeyedRemoval(curFromNodeKey);
                        } else {
                            // NOTE: we skip nested keyed nodes from being removed since there is
                            //       still a chance they will be matched up later
                            removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
                        }

                        curFromNodeChild = fromNextSibling;
                    }

                    // If we got this far then we did not find a candidate match for
                    // our "to node" and we exhausted all of the children "from"
                    // nodes. Therefore, we will just append the current "to" node
                    // to the end
                    if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
                        fromEl.appendChild(matchingFromEl);
                        morphEl(matchingFromEl, curToNodeChild);
                    } else {
                        var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
                        if (onBeforeNodeAddedResult !== false) {
                            if (onBeforeNodeAddedResult) {
                                curToNodeChild = onBeforeNodeAddedResult;
                            }

                            if (curToNodeChild.actualize) {
                                curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
                            }
                            fromEl.appendChild(curToNodeChild);
                            handleNodeAdded(curToNodeChild);
                        }
                    }

                    curToNodeChild = toNextSibling;
                    curFromNodeChild = fromNextSibling;
                }

                // We have processed all of the "to nodes". If curFromNodeChild is
                // non-null then we still have some from nodes left over that need
                // to be removed
                while (curFromNodeChild) {
                    fromNextSibling = curFromNodeChild.nextSibling;
                    if ((curFromNodeKey = getNodeKey(curFromNodeChild))) {
                        // Since the node is keyed it might be matched up later so we defer
                        // the actual removal to later
                        addKeyedRemoval(curFromNodeKey);
                    } else {
                        // NOTE: we skip nested keyed nodes from being removed since there is
                        //       still a chance they will be matched up later
                        removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
                    }
                    curFromNodeChild = fromNextSibling;
                }
            }

            var specialElHandler = specialElHandlers[fromEl.nodeName];
            if (specialElHandler) {
                specialElHandler(fromEl, toEl);
            }
        } // END: morphEl(...)

        var morphedNode = fromNode;
        var morphedNodeType = morphedNode.nodeType;
        var toNodeType = toNode.nodeType;

        if (!childrenOnly) {
            // Handle the case where we are given two DOM nodes that are not
            // compatible (e.g. <div> --> <span> or <div> --> TEXT)
            if (morphedNodeType === ELEMENT_NODE) {
                if (toNodeType === ELEMENT_NODE) {
                    if (!compareNodeNames(fromNode, toNode)) {
                        onNodeDiscarded(fromNode);
                        morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
                    }
                } else {
                    // Going from an element node to a text node
                    morphedNode = toNode;
                }
            } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) { // Text or comment node
                if (toNodeType === morphedNodeType) {
                    if (morphedNode.nodeValue !== toNode.nodeValue) {
                        morphedNode.nodeValue = toNode.nodeValue;
                    }

                    return morphedNode;
                } else {
                    // Text node to something else
                    morphedNode = toNode;
                }
            }
        }

        if (morphedNode === toNode) {
            // The "to node" was not compatible with the "from node" so we had to
            // toss out the "from node" and use the "to node"
            onNodeDiscarded(fromNode);
        } else {
            morphEl(morphedNode, toNode, childrenOnly);

            // We now need to loop over any keyed nodes that might need to be
            // removed. We only do the removal if we know that the keyed node
            // never found a match. When a keyed node is matched up we remove
            // it out of fromNodesLookup and we use fromNodesLookup to determine
            // if a keyed node has been matched up or not
            if (keyedRemovalList) {
                for (var i=0, len=keyedRemovalList.length; i<len; i++) {
                    var elToRemove = fromNodesLookup[keyedRemovalList[i]];
                    if (elToRemove) {
                        removeNode(elToRemove, elToRemove.parentNode, false);
                    }
                }
            }
        }

        if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
            if (morphedNode.actualize) {
                morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
            }
            // If we had to swap out the from node with a new node because the old
            // node was not compatible with the target node then we need to
            // replace the old DOM node in the original DOM tree. This is only
            // possible if the original DOM node was part of a DOM tree which
            // we know is the case if it has a parent node.
            fromNode.parentNode.replaceChild(morphedNode, fromNode);
        }

        return morphedNode;
    };
}

var morphdom = morphdomFactory(morphAttrs);

module.exports = morphdom;

},{}],337:[function(require,module,exports){
assert.notEqual = notEqual
assert.notOk = notOk
assert.equal = equal
assert.ok = assert

module.exports = assert

function equal (a, b, m) {
  assert(a == b, m) // eslint-disable-line eqeqeq
}

function notEqual (a, b, m) {
  assert(a != b, m) // eslint-disable-line eqeqeq
}

function notOk (t, m) {
  assert(!t, m)
}

function assert (t, m) {
  if (!t) throw new Error(m || 'AssertionError')
}

},{}],338:[function(require,module,exports){
/* global MutationObserver */
var document = require('global/document')
var window = require('global/window')
var assert = require('assert')
var watch = Object.create(null)
var KEY_ID = 'onloadid' + (new Date() % 9e6).toString(36)
var KEY_ATTR = 'data-' + KEY_ID
var INDEX = 0

if (window && window.MutationObserver) {
  var observer = new MutationObserver(function (mutations) {
    if (Object.keys(watch).length < 1) return
    for (var i = 0; i < mutations.length; i++) {
      if (mutations[i].attributeName === KEY_ATTR) {
        eachAttr(mutations[i], turnon, turnoff)
        continue
      }
      eachMutation(mutations[i].removedNodes, turnoff)
      eachMutation(mutations[i].addedNodes, turnon)
    }
  })
  if (document.body) {
    beginObserve(observer)
  } else {
    document.addEventListener('DOMContentLoaded', function (event) {
      beginObserve(observer)
    })
  }
}

function beginObserve (observer) {
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: [KEY_ATTR]
  })
}

module.exports = function onload (el, on, off, caller) {
  assert(document.body, 'on-load: will not work prior to DOMContentLoaded')
  on = on || function () {}
  off = off || function () {}
  el.setAttribute(KEY_ATTR, 'o' + INDEX)
  watch['o' + INDEX] = [on, off, 0, caller || onload.caller]
  INDEX += 1
  return el
}

module.exports.KEY_ATTR = KEY_ATTR
module.exports.KEY_ID = KEY_ID

function turnon (index, el) {
  if (watch[index][0] && watch[index][2] === 0) {
    watch[index][0](el)
    watch[index][2] = 1
  }
}

function turnoff (index, el) {
  if (watch[index][1] && watch[index][2] === 1) {
    watch[index][1](el)
    watch[index][2] = 0
  }
}

function eachAttr (mutation, on, off) {
  var newValue = mutation.target.getAttribute(KEY_ATTR)
  if (sameOrigin(mutation.oldValue, newValue)) {
    watch[newValue] = watch[mutation.oldValue]
    return
  }
  if (watch[mutation.oldValue]) {
    off(mutation.oldValue, mutation.target)
  }
  if (watch[newValue]) {
    on(newValue, mutation.target)
  }
}

function sameOrigin (oldValue, newValue) {
  if (!oldValue || !newValue) return false
  return watch[oldValue][3] === watch[newValue][3]
}

function eachMutation (nodes, fn) {
  var keys = Object.keys(watch)
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] && nodes[i].getAttribute && nodes[i].getAttribute(KEY_ATTR)) {
      var onloadid = nodes[i].getAttribute(KEY_ATTR)
      keys.forEach(function (k) {
        if (onloadid === k) {
          fn(k, nodes[i])
        }
      })
    }
    if (nodes[i].childNodes.length > 0) {
      eachMutation(nodes[i].childNodes, fn)
    }
  }
}

},{"assert":337,"global/document":332,"global/window":333}],339:[function(require,module,exports){
(function (process){
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.page = factory());
}(this, (function () { 'use strict';

var isarray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var pathToRegexp_1 = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {String} str
 * @return {Array}
 */
function parse (str) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var suffix = res[6];
    var asterisk = res[7];

    var repeat = suffix === '+' || suffix === '*';
    var optional = suffix === '?' || suffix === '*';
    var delimiter = prefix || '/';
    var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?');

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      pattern: escapeGroup(pattern)
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {String}   str
 * @return {Function}
 */
function compile (str) {
  return tokensToFunction(parse(str))
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^' + tokens[i].pattern + '$');
    }
  }

  return function (obj) {
    var path = '';
    var data = obj || {};

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encodeURIComponent(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = encodeURIComponent(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {String} str
 * @return {String}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {String} group
 * @return {String}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {RegExp} re
 * @param  {Array}  keys
 * @return {RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {String}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {RegExp} path
 * @param  {Array}  keys
 * @return {RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {Array}  path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {String} path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function stringToRegexp (path, keys, options) {
  var tokens = parse(path);
  var re = tokensToRegExp(tokens, options);

  // Attach keys back to the regexp.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] !== 'string') {
      keys.push(tokens[i]);
    }
  }

  return attachKeys(re, keys)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {Array}  tokens
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function tokensToRegExp (tokens, options) {
  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';
  var lastToken = tokens[tokens.length - 1];
  var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken);

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = token.pattern;

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (prefix) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithSlash ? '' : '(?=\\/|$)';
  }

  return new RegExp('^' + route, flags(options))
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(String|RegExp|Array)} path
 * @param  {Array}                 [keys]
 * @param  {Object}                [options]
 * @return {RegExp}
 */
function pathToRegexp (path, keys, options) {
  keys = keys || [];

  if (!isarray(keys)) {
    options = keys;
    keys = [];
  } else if (!options) {
    options = {};
  }

  if (path instanceof RegExp) {
    return regexpToRegexp(path, keys, options)
  }

  if (isarray(path)) {
    return arrayToRegexp(path, keys, options)
  }

  return stringToRegexp(path, keys, options)
}

pathToRegexp_1.parse = parse_1;
pathToRegexp_1.compile = compile_1;
pathToRegexp_1.tokensToFunction = tokensToFunction_1;
pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

/**
   * Module dependencies.
   */

  

  /**
   * Module exports.
   */

  var page_js = page;
  page.default = page;
  page.Context = Context;
  page.Route = Route;
  page.sameOrigin = sameOrigin;

  /**
   * Short-cuts for global-object checks
   */

  var hasDocument = ('undefined' !== typeof document);
  var hasWindow = ('undefined' !== typeof window);
  var hasHistory = ('undefined' !== typeof history);
  var hasProcess = typeof process !== 'undefined';

  /**
   * Detect click event
   */
  var clickEvent = hasDocument && document.ontouchstart ? 'touchstart' : 'click';

  /**
   * To work properly with the URL
   * history.location generated polyfill in https://github.com/devote/HTML5-History-API
   */

  var isLocation = hasWindow && !!(window.history.location || window.location);

  /**
   * Perform initial dispatch.
   */

  var dispatch = true;


  /**
   * Decode URL components (query string, pathname, hash).
   * Accommodates both regular percent encoding and x-www-form-urlencoded format.
   */
  var decodeURLComponents = true;

  /**
   * Base path.
   */

  var base = '';

  /**
   * Strict path matching.
   */

  var strict = false;

  /**
   * Running flag.
   */

  var running;

  /**
   * HashBang option
   */

  var hashbang = false;

  /**
   * Previous context, for capturing
   * page exit events.
   */

  var prevContext;

  /**
   * The window for which this `page` is running
   */
  var pageWindow;

  /**
   * Register `path` with callback `fn()`,
   * or route `path`, or redirection,
   * or `page.start()`.
   *
   *   page(fn);
   *   page('*', fn);
   *   page('/user/:id', load, user);
   *   page('/user/' + user.id, { some: 'thing' });
   *   page('/user/' + user.id);
   *   page('/from', '/to')
   *   page();
   *
   * @param {string|!Function|!Object} path
   * @param {Function=} fn
   * @api public
   */

  function page(path, fn) {
    // <callback>
    if ('function' === typeof path) {
      return page('*', path);
    }

    // route <path> to <callback ...>
    if ('function' === typeof fn) {
      var route = new Route(/** @type {string} */ (path));
      for (var i = 1; i < arguments.length; ++i) {
        page.callbacks.push(route.middleware(arguments[i]));
      }
      // show <path> with [state]
    } else if ('string' === typeof path) {
      page['string' === typeof fn ? 'redirect' : 'show'](path, fn);
      // start [options]
    } else {
      page.start(path);
    }
  }

  /**
   * Callback functions.
   */

  page.callbacks = [];
  page.exits = [];

  /**
   * Current path being processed
   * @type {string}
   */
  page.current = '';

  /**
   * Number of pages navigated to.
   * @type {number}
   *
   *     page.len == 0;
   *     page('/login');
   *     page.len == 1;
   */

  page.len = 0;

  /**
   * Get or set basepath to `path`.
   *
   * @param {string} path
   * @api public
   */

  page.base = function(path) {
    if (0 === arguments.length) return base;
    base = path;
  };

  /**
   * Get or set strict path matching to `enable`
   *
   * @param {boolean} enable
   * @api public
   */

  page.strict = function(enable) {
    if (0 === arguments.length) return strict;
    strict = enable;
  };

  /**
   * Bind with the given `options`.
   *
   * Options:
   *
   *    - `click` bind to click events [true]
   *    - `popstate` bind to popstate [true]
   *    - `dispatch` perform initial dispatch [true]
   *
   * @param {Object} options
   * @api public
   */

  page.start = function(options) {
    options = options || {};
    if (running) return;
    running = true;
    pageWindow = options.window || (hasWindow && window);
    if (false === options.dispatch) dispatch = false;
    if (false === options.decodeURLComponents) decodeURLComponents = false;
    if (false !== options.popstate && hasWindow) pageWindow.addEventListener('popstate', onpopstate, false);
    if (false !== options.click && hasDocument) {
      pageWindow.document.addEventListener(clickEvent, onclick, false);
    }
    hashbang = !!options.hashbang;
    if(hashbang && hasWindow && !hasHistory) {
      pageWindow.addEventListener('hashchange', onpopstate, false);
    }
    if (!dispatch) return;

    var url;
    if(isLocation) {
      var loc = pageWindow.location;

      if(hashbang && ~loc.hash.indexOf('#!')) {
        url = loc.hash.substr(2) + loc.search;
      } else if (hashbang) {
        url = loc.search + loc.hash;
      } else {
        url = loc.pathname + loc.search + loc.hash;
      }
    }

    page.replace(url, null, true, dispatch);
  };

  /**
   * Unbind click and popstate event handlers.
   *
   * @api public
   */

  page.stop = function() {
    if (!running) return;
    page.current = '';
    page.len = 0;
    running = false;
    hasDocument && pageWindow.document.removeEventListener(clickEvent, onclick, false);
    hasWindow && pageWindow.removeEventListener('popstate', onpopstate, false);
    hasWindow && pageWindow.removeEventListener('hashchange', onpopstate, false);
  };

  /**
   * Show `path` with optional `state` object.
   *
   * @param {string} path
   * @param {Object=} state
   * @param {boolean=} dispatch
   * @param {boolean=} push
   * @return {!Context}
   * @api public
   */

  page.show = function(path, state, dispatch, push) {
    var ctx = new Context(path, state),
      prev = prevContext;
    prevContext = ctx;
    page.current = ctx.path;
    if (false !== dispatch) page.dispatch(ctx, prev);
    if (false !== ctx.handled && false !== push) ctx.pushState();
    return ctx;
  };

  /**
   * Goes back in the history
   * Back should always let the current route push state and then go back.
   *
   * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
   * @param {Object=} state
   * @api public
   */

  page.back = function(path, state) {
    if (page.len > 0) {
      // this may need more testing to see if all browsers
      // wait for the next tick to go back in history
      hasHistory && pageWindow.history.back();
      page.len--;
    } else if (path) {
      setTimeout(function() {
        page.show(path, state);
      });
    }else{
      setTimeout(function() {
        page.show(getBase(), state);
      });
    }
  };


  /**
   * Register route to redirect from one path to other
   * or just redirect to another route
   *
   * @param {string} from - if param 'to' is undefined redirects to 'from'
   * @param {string=} to
   * @api public
   */
  page.redirect = function(from, to) {
    // Define route from a path to another
    if ('string' === typeof from && 'string' === typeof to) {
      page(from, function(e) {
        setTimeout(function() {
          page.replace(/** @type {!string} */ (to));
        }, 0);
      });
    }

    // Wait for the push state and replace it with another
    if ('string' === typeof from && 'undefined' === typeof to) {
      setTimeout(function() {
        page.replace(from);
      }, 0);
    }
  };

  /**
   * Replace `path` with optional `state` object.
   *
   * @param {string} path
   * @param {Object=} state
   * @param {boolean=} init
   * @param {boolean=} dispatch
   * @return {!Context}
   * @api public
   */


  page.replace = function(path, state, init, dispatch) {
    var ctx = new Context(path, state),
      prev = prevContext;
    prevContext = ctx;
    page.current = ctx.path;
    ctx.init = init;
    ctx.save(); // save before dispatching, which may redirect
    if (false !== dispatch) page.dispatch(ctx, prev);
    return ctx;
  };

  /**
   * Dispatch the given `ctx`.
   *
   * @param {Context} ctx
   * @api private
   */

  page.dispatch = function(ctx, prev) {
    var i = 0,
      j = 0;

    function nextExit() {
      var fn = page.exits[j++];
      if (!fn) return nextEnter();
      fn(prev, nextExit);
    }

    function nextEnter() {
      var fn = page.callbacks[i++];

      if (ctx.path !== page.current) {
        ctx.handled = false;
        return;
      }
      if (!fn) return unhandled(ctx);
      fn(ctx, nextEnter);
    }

    if (prev) {
      nextExit();
    } else {
      nextEnter();
    }
  };

  /**
   * Unhandled `ctx`. When it's not the initial
   * popstate then redirect. If you wish to handle
   * 404s on your own use `page('*', callback)`.
   *
   * @param {Context} ctx
   * @api private
   */
  function unhandled(ctx) {
    if (ctx.handled) return;
    var current;

    if (hashbang) {
      current = isLocation && getBase() + pageWindow.location.hash.replace('#!', '');
    } else {
      current = isLocation && pageWindow.location.pathname + pageWindow.location.search;
    }

    if (current === ctx.canonicalPath) return;
    page.stop();
    ctx.handled = false;
    isLocation && (pageWindow.location.href = ctx.canonicalPath);
  }

  /**
   * Register an exit route on `path` with
   * callback `fn()`, which will be called
   * on the previous context when a new
   * page is visited.
   */
  page.exit = function(path, fn) {
    if (typeof path === 'function') {
      return page.exit('*', path);
    }

    var route = new Route(path);
    for (var i = 1; i < arguments.length; ++i) {
      page.exits.push(route.middleware(arguments[i]));
    }
  };

  /**
   * Remove URL encoding from the given `str`.
   * Accommodates whitespace in both x-www-form-urlencoded
   * and regular percent-encoded form.
   *
   * @param {string} val - URL component to decode
   */
  function decodeURLEncodedURIComponent(val) {
    if (typeof val !== 'string') { return val; }
    return decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
  }

  /**
   * Initialize a new "request" `Context`
   * with the given `path` and optional initial `state`.
   *
   * @constructor
   * @param {string} path
   * @param {Object=} state
   * @api public
   */

  function Context(path, state) {
    var pageBase = getBase();
    if ('/' === path[0] && 0 !== path.indexOf(pageBase)) path = pageBase + (hashbang ? '#!' : '') + path;
    var i = path.indexOf('?');

    this.canonicalPath = path;
    this.path = path.replace(pageBase, '') || '/';
    if (hashbang) this.path = this.path.replace('#!', '') || '/';

    this.title = (hasDocument && pageWindow.document.title);
    this.state = state || {};
    this.state.path = path;
    this.querystring = ~i ? decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
    this.pathname = decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
    this.params = {};

    // fragment
    this.hash = '';
    if (!hashbang) {
      if (!~this.path.indexOf('#')) return;
      var parts = this.path.split('#');
      this.path = this.pathname = parts[0];
      this.hash = decodeURLEncodedURIComponent(parts[1]) || '';
      this.querystring = this.querystring.split('#')[0];
    }
  }

  /**
   * Expose `Context`.
   */

  page.Context = Context;

  /**
   * Push state.
   *
   * @api private
   */

  Context.prototype.pushState = function() {
    page.len++;
    if (hasHistory) {
        pageWindow.history.pushState(this.state, this.title,
          hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
    }
  };

  /**
   * Save the context state.
   *
   * @api public
   */

  Context.prototype.save = function() {
    if (hasHistory && pageWindow.location.protocol !== 'file:') {
        pageWindow.history.replaceState(this.state, this.title,
          hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
    }
  };

  /**
   * Initialize `Route` with the given HTTP `path`,
   * and an array of `callbacks` and `options`.
   *
   * Options:
   *
   *   - `sensitive`    enable case-sensitive routes
   *   - `strict`       enable strict matching for trailing slashes
   *
   * @constructor
   * @param {string} path
   * @param {Object=} options
   * @api private
   */

  function Route(path, options) {
    options = options || {};
    options.strict = options.strict || strict;
    this.path = (path === '*') ? '(.*)' : path;
    this.method = 'GET';
    this.regexp = pathToRegexp_1(this.path,
      this.keys = [],
      options);
  }

  /**
   * Expose `Route`.
   */

  page.Route = Route;

  /**
   * Return route middleware with
   * the given callback `fn()`.
   *
   * @param {Function} fn
   * @return {Function}
   * @api public
   */

  Route.prototype.middleware = function(fn) {
    var self = this;
    return function(ctx, next) {
      if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
      next();
    };
  };

  /**
   * Check if this route matches `path`, if so
   * populate `params`.
   *
   * @param {string} path
   * @param {Object} params
   * @return {boolean}
   * @api private
   */

  Route.prototype.match = function(path, params) {
    var keys = this.keys,
      qsIndex = path.indexOf('?'),
      pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
      m = this.regexp.exec(decodeURIComponent(pathname));

    if (!m) return false;

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = keys[i - 1];
      var val = decodeURLEncodedURIComponent(m[i]);
      if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
        params[key.name] = val;
      }
    }

    return true;
  };


  /**
   * Handle "populate" events.
   */

  var onpopstate = (function () {
    var loaded = false;
    if ( ! hasWindow ) {
      return;
    }
    if (hasDocument && document.readyState === 'complete') {
      loaded = true;
    } else {
      window.addEventListener('load', function() {
        setTimeout(function() {
          loaded = true;
        }, 0);
      });
    }
    return function onpopstate(e) {
      if (!loaded) return;
      if (e.state) {
        var path = e.state.path;
        page.replace(path, e.state);
      } else if (isLocation) {
        var loc = pageWindow.location;
        page.show(loc.pathname + loc.hash, undefined, undefined, false);
      }
    };
  })();
  /**
   * Handle "click" events.
   */

  /* jshint +W054 */
  function onclick(e) {
    if (1 !== which(e)) return;

    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (e.defaultPrevented) return;

    // ensure link
    // use shadow dom when available if not, fall back to composedPath() for browsers that only have shady
    var el = e.target;
    var eventPath = e.path || (e.composedPath ? e.composedPath() : null);

    if(eventPath) {
      for (var i = 0; i < eventPath.length; i++) {
        if (!eventPath[i].nodeName) continue;
        if (eventPath[i].nodeName.toUpperCase() !== 'A') continue;
        if (!eventPath[i].href) continue;

        el = eventPath[i];
        break;
      }
    }
    // continue ensure link
    // el.nodeName for svg links are 'a' instead of 'A'
    while (el && 'A' !== el.nodeName.toUpperCase()) el = el.parentNode;
    if (!el || 'A' !== el.nodeName.toUpperCase()) return;

    // check if link is inside an svg
    // in this case, both href and target are always inside an object
    var svg = (typeof el.href === 'object') && el.href.constructor.name === 'SVGAnimatedString';

    // Ignore if tag has
    // 1. "download" attribute
    // 2. rel="external" attribute
    if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

    // ensure non-hash for the same path
    var link = el.getAttribute('href');
    if(!hashbang && samePath(el) && (el.hash || '#' === link)) return;

    // Check for mailto: in the href
    if (link && link.indexOf('mailto:') > -1) return;

    // check target
    // svg target is an object and its desired value is in .baseVal property
    if (svg ? el.target.baseVal : el.target) return;

    // x-origin
    // note: svg links that are not relative don't call click events (and skip page.js)
    // consequently, all svg links tested inside page.js are relative and in the same origin
    if (!svg && !sameOrigin(el.href)) return;

    // rebuild path
    // There aren't .pathname and .search properties in svg links, so we use href
    // Also, svg href is an object and its desired value is in .baseVal property
    var path = svg ? el.href.baseVal : (el.pathname + el.search + (el.hash || ''));

    path = path[0] !== '/' ? '/' + path : path;

    // strip leading "/[drive letter]:" on NW.js on Windows
    if (hasProcess && path.match(/^\/[a-zA-Z]:\//)) {
      path = path.replace(/^\/[a-zA-Z]:\//, '/');
    }

    // same page
    var orig = path;
    var pageBase = getBase();

    if (path.indexOf(pageBase) === 0) {
      path = path.substr(base.length);
    }

    if (hashbang) path = path.replace('#!', '');

    if (pageBase && orig === path) return;

    e.preventDefault();
    page.show(orig);
  }

  /**
   * Event button.
   */

  function which(e) {
    e = e || (hasWindow && window.event);
    return null == e.which ? e.button : e.which;
  }

  /**
   * Convert to a URL object
   */
  function toURL(href) {
    if(typeof URL === 'function' && isLocation) {
      return new URL(href, location.toString());
    } else if (hasDocument) {
      var anc = document.createElement('a');
      anc.href = href;
      return anc;
    }
  }

  /**
   * Check if `href` is the same origin.
   */

  function sameOrigin(href) {
    if(!href || !isLocation) return false;
    var url = toURL(href);

    var loc = pageWindow.location;
    return loc.protocol === url.protocol &&
      loc.hostname === url.hostname &&
      loc.port === url.port;
  }

  function samePath(url) {
    if(!isLocation) return false;
    var loc = pageWindow.location;
    return url.pathname === loc.pathname &&
      url.search === loc.search;
  }

  /**
   * Gets the `base`, which depends on whether we are using History or
   * hashbang routing.
   */
  function getBase() {
    if(!!base) return base;
    var loc = hasWindow && pageWindow && pageWindow.location;
    return (hasWindow && hashbang && loc && loc.protocol === 'file:') ? loc.pathname : base;
  }

  page.sameOrigin = sameOrigin;

return page_js;

})));

}).call(this,require('_process'))

},{"_process":6}],340:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))

},{"_process":6}],341:[function(require,module,exports){

var orig = document.title;

exports = module.exports = set;

function set(str) {
  var i = 1;
  var args = arguments;
  document.title = str.replace(/%[os]/g, function(_){
    switch (_) {
      case '%o':
        return orig;
      case '%s':
        return args[i++];
    }
  });
}

exports.reset = function(){
  set(orig);
};

},{}],342:[function(require,module,exports){
var bel = require('bel') // turns template tag into DOM elements
var morphdom = require('morphdom') // efficiently diffs + morphs two DOM elements
var defaultEvents = require('./update-events.js') // default events to be copied when dom elements update

module.exports = bel

// TODO move this + defaultEvents to a new module once we receive more feedback
module.exports.update = function (fromNode, toNode, opts) {
  if (!opts) opts = {}
  if (opts.events !== false) {
    if (!opts.onBeforeElUpdated) opts.onBeforeElUpdated = copier
  }

  return morphdom(fromNode, toNode, opts)

  // morphdom only copies attributes. we decided we also wanted to copy events
  // that can be set via attributes
  function copier (f, t) {
    // copy events:
    var events = opts.events || defaultEvents
    for (var i = 0; i < events.length; i++) {
      var ev = events[i]
      if (t[ev]) { // if new element has a whitelisted attribute
        f[ev] = t[ev] // update existing element
      } else if (f[ev]) { // if existing element has it and new one doesnt
        f[ev] = undefined // remove it from existing element
      }
    }
    var oldValue = f.value
    var newValue = t.value
    // copy values for form elements
    if ((f.nodeName === 'INPUT' && f.type !== 'file') || f.nodeName === 'SELECT') {
      if (!newValue && !t.hasAttribute('value')) {
        t.value = f.value
      } else if (newValue !== oldValue) {
        f.value = newValue
      }
    } else if (f.nodeName === 'TEXTAREA') {
      if (t.getAttribute('value') === null) f.value = t.value
    }
  }
}

},{"./update-events.js":343,"bel":3,"morphdom":336}],343:[function(require,module,exports){
module.exports = [
  // attribute events (can be set with attributes)
  'onclick',
  'ondblclick',
  'onmousedown',
  'onmouseup',
  'onmouseover',
  'onmousemove',
  'onmouseout',
  'ondragstart',
  'ondrag',
  'ondragenter',
  'ondragleave',
  'ondragover',
  'ondrop',
  'ondragend',
  'onkeydown',
  'onkeypress',
  'onkeyup',
  'onunload',
  'onabort',
  'onerror',
  'onresize',
  'onscroll',
  'onselect',
  'onchange',
  'onsubmit',
  'onreset',
  'onfocus',
  'onblur',
  'oninput',
  // other common events
  'oncontextmenu',
  'onfocusin',
  'onfocusout'
]

},{}],344:[function(require,module,exports){
'use strict';

var fs = require('fs');
var ENV_WEB = true;
var URL = ENV_WEB ? '' : 'http://localhost:3000';
var URL_REPORT = 'http://127.0.0.1:3000';

var GETCONFIG = function GET(ruc) {
    try {
        return {
            'TKF': {
                content: fs.readFileSync(require('path').join('formatos/' + ruc + '/templates/TicketFactura', 'content.handlebars'), 'utf8'),
                recipe: "chrome-pdf",
                engine: 'handlebars',
                chrome: {
                    width: "2.2in",
                    height: "5.5in"
                }
            },
            'TKB': {
                content: fs.readFileSync(require('path').join('formatos/' + ruc + '/templates/TicketFactura', 'content.handlebars'), 'utf8'),
                recipe: "chrome-pdf",
                engine: 'handlebars',
                chrome: {
                    width: "2.2in",
                    height: "5.5in"
                }
            },
            'FE': {
                content: fs.readFileSync(require('path').join('formatos/' + ruc + '/templates/FacturaComprobante', 'content.handlebars'), 'utf8'),
                recipe: "chrome-pdf",
                engine: 'handlebars',
                chrome: {
                    width: "8.27in",
                    height: "11.7in"
                }
            },
            'BE': {
                content: fs.readFileSync(require('path').join('formatos/' + ruc + '/templates/FacturaComprobante', 'content.handlebars'), 'utf8'),
                recipe: "chrome-pdf",
                engine: 'handlebars',
                chrome: {
                    width: "8.27in",
                    height: "11.7in"
                }
            },
            'NE': {
                content: fs.readFileSync(require('path').join('formatos/' + ruc + '/templates/TicketNES', 'content.handlebars'), 'utf8'),
                recipe: "chrome-pdf",
                engine: 'handlebars',
                chrome: {
                    width: "80mm",
                    height: "297mm"
                }
            },
            'NS': {
                content: fs.readFileSync(require('path').join('formatos/' + ruc + '/templates/TicketNES', 'content.handlebars'), 'utf8'),
                recipe: "chrome-pdf",
                engine: 'handlebars',
                chrome: {
                    width: "80mm",
                    height: "297mm"
                }
            },
            'RI': {
                content: fs.readFileSync(require('path').join('formatos/' + ruc + '/templates/TicketEI', 'content.handlebars'), 'utf8'),
                recipe: "chrome-pdf",
                engine: 'handlebars',
                chrome: {
                    width: "80mm",
                    height: "297mm"
                }
            },
            'RE': {
                content: fs.readFileSync(require('path').join('formatos/' + ruc + '/templates/TicketEI', 'content.handlebars'), 'utf8'),
                recipe: "chrome-pdf",
                engine: 'handlebars',
                chrome: {
                    width: "80mm",
                    height: "297mm"
                }
            }
        };
    } catch (e) {
        return {};
    }
};
module.exports = GETCONFIG;
module.exports.ENV_WEB = ENV_WEB;
module.exports.URL = URL;
module.exports.URL_REPORT = URL_REPORT;

/*const fs = require('fs');  
const ENV_WEB = true;
var URL=ENV_WEB?'':'http://localhost:3000';
var URL_REPORT = 'http://127.0.0.1:3000';*/
/*var NOMBRES_DOC=[
    {'TKF':fs.readFileSync(require('path').join(__dirname, 'formatos/'+DIRECCIONPATH+'/templates/TicketFactura', 'content.handlebars'), 'utf8'),'ancho':'2.00in','alto':'5.5in'},
    {'TKB':'TicketBoleta'},
    {'FE':'Factura'},
    {'BE':'Boleta'}
]*/

//export { GETCONFIG,ENV_WEB,URL,URL_REPORT}

},{"fs":5,"path":340}],345:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral([''], ['']);

function _taggedTemplateLiteral(strings, raw) {
  return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));
}

var page = require('page');
var empty = require('empty-element');
var title = require('title');
var navegador = require('../navegador');
var yo = require('yo-yo');

var el = yo(_templateObject);
page('/administracion', navegador, function (ctx, next) {
  title('iFacturacion');
  // var main = document.getElementById('contenido');
  // empty(main).appendChild(el);
});

},{"../navegador":347,"empty-element":331,"page":339,"title":341,"yo-yo":342}],346:[function(require,module,exports){
'use strict';

var _constantes = require('./constantes_entorno/constantes');

require('babel-polyfill');
var page = require('page');
var navegador = require('./navegador');

if (!_constantes.ENV_WEB) navegador();else {
    require('./homepage');
    page();
}

},{"./constantes_entorno/constantes":344,"./homepage":345,"./navegador":347,"babel-polyfill":1,"page":339}],347:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n\n        <ul id="main-menu" class="gui-controls"> \n\n            <li class="gui-folder expanded">\n                <a>\n                    <div class="gui-icon"><i class="fa fa-circle-o"></i></div>\n                    <span class="title">Mantenimientos</span>\n                </a> \n                <ul>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Productos y servicios</span></a>\n                    </li>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Cliente/Proveedor</span></a>\n                    </li>\n                </ul>\n            </li>\n\n            <li class="gui-folder">\n                <a>\n                    <div class="gui-icon"><i class="fa fa-circle-o"></i></div>\n                    <span class="title">Contabilidad</span>\n                </a> \n                <ul>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Cuentas Bancarias</span></a>\n                    </li>\n                </ul>\n            </li>\n\n            <li class="gui-folder">\n                <a>\n                    <div class="gui-icon"><i class="fa fa-circle-o"></i></div>\n                    <span class="title">Logistica</span>\n                </a> \n                <ul>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Categoria</span></a>\n                    </li>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Turnos de Atencion</span></a>\n                    </li>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Almacenes</span></a>\n                    </li>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Conceptos</span></a>\n                    </li>\n                    \n                </ul>\n            </li>\n\n            <li class="gui-folder">\n                <a>\n                    <div class="gui-icon"><i class="fa fa-circle-o"></i></div>\n                    <span class="title">Configuracion</span>\n                </a> \n                <ul>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Empresa</span></a>\n                    </li>\n                    \n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Sucursales</span></a>\n                    </li>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Usuarios</span></a>\n                    </li>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Perfiles</span></a>\n                    </li>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Cajas</span></a>\n                    </li>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Parametros</span></a>\n                    </li>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Modulos</span></a>\n                    </li>\n                    \n                </ul>\n            </li>\n    \n        </ul>'], ['\n\n        <ul id="main-menu" class="gui-controls"> \n\n            <li class="gui-folder expanded">\n                <a>\n                    <div class="gui-icon"><i class="fa fa-circle-o"></i></div>\n                    <span class="title">Mantenimientos</span>\n                </a> \n                <ul>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Productos y servicios</span></a>\n                    </li>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Cliente/Proveedor</span></a>\n                    </li>\n                </ul>\n            </li>\n\n            <li class="gui-folder">\n                <a>\n                    <div class="gui-icon"><i class="fa fa-circle-o"></i></div>\n                    <span class="title">Contabilidad</span>\n                </a> \n                <ul>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Cuentas Bancarias</span></a>\n                    </li>\n                </ul>\n            </li>\n\n            <li class="gui-folder">\n                <a>\n                    <div class="gui-icon"><i class="fa fa-circle-o"></i></div>\n                    <span class="title">Logistica</span>\n                </a> \n                <ul>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Categoria</span></a>\n                    </li>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Turnos de Atencion</span></a>\n                    </li>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Almacenes</span></a>\n                    </li>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Conceptos</span></a>\n                    </li>\n                    \n                </ul>\n            </li>\n\n            <li class="gui-folder">\n                <a>\n                    <div class="gui-icon"><i class="fa fa-circle-o"></i></div>\n                    <span class="title">Configuracion</span>\n                </a> \n                <ul>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Empresa</span></a>\n                    </li>\n                    \n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Sucursales</span></a>\n                    </li>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Usuarios</span></a>\n                    </li>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Perfiles</span></a>\n                    </li>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Cajas</span></a>\n                    </li>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Parametros</span></a>\n                    </li>\n                    <li>\n                        <a href="javascript:void(0)" onclick=', '><span class="title"> Modulos</span></a>\n                    </li>\n                    \n                </ul>\n            </li>\n    \n        </ul>']);

var _constantes = require('../constantes_entorno/constantes');

var _listar = require('../sis_admin/mod_configuracion/usuarios/listar');

var _listar2 = require('../sis_admin/mod_configuracion/cajas/listar');

var _listar3 = require('../sis_admin/mod_configuracion/modulos/listar');

var _listar4 = require('../sis_admin/mod_configuracion/sucursales/listar');

var _listar5 = require('../sis_admin/mod_configuracion/perfiles/listar');

var _listar6 = require('../sis_admin/mod_configuracion/parametros/listar');

var _listar7 = require('../sis_admin/mod_configuracion/empresa/listar');

var _listar8 = require('../sis_admin/mod_logistica/categorias/listar');

var _listar9 = require('../sis_admin/mod_logistica/turnos/listar');

var _listar10 = require('../sis_admin/mod_logistica/almacenes/listar');

var _listar11 = require('../sis_admin/mod_logistica/conceptos/listar');

var _listar12 = require('../sis_admin/mod_inicio/productos_serv/listar');

var _listar13 = require('../sis_admin/mod_inicio/clientes_prov/listar');

var _listar14 = require('../sis_admin/mod_contabilidad/cuentas_bancarias/listar');

function _taggedTemplateLiteral(strings, raw) {
    return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));
}

var yo = require('yo-yo');
var empty = require('empty-element');

//views de logistica


//views de inicio

//Views Inicio

//View Contabilidad


function Ver(Flag_Cerrado) {
    var el = yo(_templateObject, function () {
        return (0, _listar12.ListarProductosServ)(true);
    }, function () {
        return (0, _listar13.ListarClientes)(true);
    }, function () {
        return (0, _listar14.ListarCuentasBancarias)(true);
    }, function () {
        return (0, _listar8.ListarCategorias)(true);
    }, function () {
        return (0, _listar9.ListarTurnos)(true);
    }, function () {
        return (0, _listar10.ListarAlmacenes)(true);
    }, function () {
        return (0, _listar11.ListarConceptos)(true);
    }, function () {
        return (0, _listar7.ListarEmpresa)(true);
    }, function () {
        return (0, _listar4.ListarSucursales)(true);
    }, function () {
        return (0, _listar.ListarUsuarios)(true);
    }, function () {
        return (0, _listar5.ListarPerfiles)(true);
    }, function () {
        return (0, _listar2.ListarCajas)(true);
    }, function () {
        return (0, _listar6.ListarParametros)(true);
    }, function () {
        return (0, _listar3.ListarModulos)(true);
    });

    var container = document.getElementById('nav-container');
    empty(container).appendChild(el);

    $.getScript("/assets/js/core/cache/63d0445130d69b2868a8d28c93309746.js", function (data, textStatus, jqxhr) {});
}

module.exports = function navegador(ctx, next) {
    /*var container = document.getElementById('nav-container')
    empty(container).appendChild(el);
    $.getScript("/assets/js/core/cache/63d0445130d69b2868a8d28c93309746.js", function( data, textStatus, jqxhr ) {
    });*/

    var parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    };
    fetch(_constantes.URL + '/cajas_api/get_arqueo', parametros).then(function (req) {
        return req.json();
    }).then(function (res) {
        console.log("get arqueo de caja");
        Ver(res.arqueo[0].Flag_Cerrado);
    }).catch(function (e) {
        console.log(e);
        //toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : '+e,'Error',{timeOut: 5000})
    });

    // next();
};

},{"../constantes_entorno/constantes":344,"../sis_admin/mod_configuracion/cajas/listar":349,"../sis_admin/mod_configuracion/empresa/listar":350,"../sis_admin/mod_configuracion/modulos/listar":352,"../sis_admin/mod_configuracion/parametros/listar":354,"../sis_admin/mod_configuracion/perfiles/listar":356,"../sis_admin/mod_configuracion/sucursales/listar":358,"../sis_admin/mod_configuracion/usuarios/listar":360,"../sis_admin/mod_contabilidad/cuentas_bancarias/listar":362,"../sis_admin/mod_inicio/clientes_prov/listar":369,"../sis_admin/mod_inicio/productos_serv/listar":375,"../sis_admin/mod_logistica/almacenes/listar":379,"../sis_admin/mod_logistica/categorias/listar":381,"../sis_admin/mod_logistica/conceptos/listar":383,"../sis_admin/mod_logistica/turnos/listar":385,"empty-element":331,"yo-yo":342}],348:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NuevaCaja = undefined;

var _templateObject = _taggedTemplateLiteral(['\n    <div>\n        <div class="modal modal-danger fade" id="modal-danger-documento" style="display: none;">\n            <div class="modal-dialog">\n                <div class="modal-content">\n                    <div class="modal-header">\n                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                            <span aria-hidden="true">\xD7</span>\n                        </button>\n                        <h4 class="modal-title">\xBFEsta seguro que desea eliminar este documento?</h4>\n                    </div>\n                    <div class="modal-body">\n                        <p>Al eliminar el documento se perderan todos los datos.</p>\n                    </div>\n                    <div class="modal-footer">\n                        <button type="button" class="btn btn-danger ink-reaction pull-left" data-dismiss="modal">Cancelar</button>\n                        <button type="button" class="btn btn-success ink-reaction" id="btnEliminar-documento" data-dismiss="modal">Si, eliminar</button>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class="modal modal-danger fade" id="modal-danger-favorito" style="display: none;">\n            <div class="modal-dialog">\n                <div class="modal-content">\n                    <div class="modal-header">\n                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                            <span aria-hidden="true">\xD7</span>\n                        </button>\n                        <h4 class="modal-title">\xBFEsta seguro que desea eliminar este producto?</h4>\n                    </div>\n                    <div class="modal-body">\n                        <p>Al eliminar el producto dejara de estar en la lista de favoritos.</p>\n                    </div>\n                    <div class="modal-footer">\n                        <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>\n                        <button type="button" class="btn btn-success" id="btnEliminar-favorito" data-dismiss="modal">Si, eliminar</button>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class="modal fade" id="modal-buscar-responsable" style="display: none;">\n            <div class="modal-dialog">\n                <div class="modal-content">\n                    <div class="modal-header">\n                       \n                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                        <span aria-hidden="true">\xD7</span></button>\n                        <h4 class="modal-title">Usuario o vendedor responsable</h4>\n                    </div>\n                    <div class="modal-body">\n                        <div class="panel">\n                            <div class="panel-heading">\n                            <header>Busqueda de usuario</header>\n                            </div>\n                            <form role="form">\n                                <div class="panel-body">\n                                \n                                    <label for="Cod_UsuarioCajero">Ingrese codigo o nombre de usuario</label>\n                                    <div class="input-group">\n                                        <div class="input-group-btn">\n                                            <button type="button" class="btn btn-primary ink-reaction" onclick="', '">Buscar</button>\n                                        </div>\n                                        <input type="text" class="form-control" id="txtBuscarUsuario" onkeydown="', '">\n                                        \n                                    </div>\n                                    <br>\n                                    <div class="table-responsive" id="contenedorTablaUsuarios">\n\n                                    </div>\n                                </div>\n                            </form>\n                            \n                        </div>\n                    </div>\n                    \n                    <div class="modal-footer">\n                        <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class="modal fade" id="modal-nuevo-editar-documento" style="display: none;">\n            \n        </div>\n        <div class="modal fade" id="modal-nuevo-favorito" style="display: none;">\n            \n        </div>\n        <section class="content-header">\n            <h1>\n                Cajas\n                <small>Control cajas</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li><a  onclick=', ' href="#">\n                Cajas</a></li>\n                <li class="active">', '</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                    <header><a onclick=', ' class="btn btn-xs btn-icon-toggle"><i class="fa fa-arrow-left"></i> </a>', ' Caja</header> \n                </div> \n                <div class="card-body">\n                    <div class="panel">\n                        \n                        <!-- form start -->\n                        <div role="form">\n                            <div class="panel-body">\n                                <div class="row">\n                                    <div class="alert alert-callout alert-danger hidden" id="divErrors">\n                                        <p>Es necesario llenar todos los campos requeridos marcados con rojo</p>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    ', '\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Flag_Activo"></label>\n                                            \n                                            <div class="checkbox-inline checkbox-styled checkbox-primary">\n                                                <label>\n                                                    <input type="checkbox" id="Flag_Activo" class="required" checked="', '"><span> Es Activo?</span>\n                                                </label>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Des_Caja">Nombre de la Caja</label>\n                                            <input type="text"  style="text-transform:uppercase" class="form-control required" id="Des_Caja" placeholder="Ingrese Nombre de caja" value="', '">\n                                            <div class="form-control-line"></div>    \n                                        </div>\n                                    </div>\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Cod_Sucursal">Sucursal a la que pertence</label>\n                                            <select id="Cod_Sucursal" class="form-control required">\n                                                ', '\n                                            </select>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <label for="Cod_UsuarioCajero">Usuario o vendedor responsable</label>\n                                        <div class="input-group">\n                                            <div class="input-group-btn">\n                                                <button type="button" class="btn btn-info ink-reaction" onclick=', '>Buscar responsable</button>\n                                            </div>\n                                            <input type="text" class="form-control required" id="Cod_Usuario" value="', '" disabled>\n                                        </div>\n                                    </div>\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Cod_CuentaContable">Cuenta Contable</label>\n                                            <select id="Cod_CuentaContable" class="form-control select2 required">\n                                                <option style="text-transform:uppercase" value="10102" selected>10102</option>\n                                                ', '\n                                            </select>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <button onclick="', '" class="btn btn-primary ink-reaction">Guardar</button>\n                                    </div>\n                                </div>\n                                <p></p>\n                                ', '\n                                \n                            </div>\n                            \n                        </div>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>'], ['\n    <div>\n        <div class="modal modal-danger fade" id="modal-danger-documento" style="display: none;">\n            <div class="modal-dialog">\n                <div class="modal-content">\n                    <div class="modal-header">\n                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                            <span aria-hidden="true">\xD7</span>\n                        </button>\n                        <h4 class="modal-title">\xBFEsta seguro que desea eliminar este documento?</h4>\n                    </div>\n                    <div class="modal-body">\n                        <p>Al eliminar el documento se perderan todos los datos.</p>\n                    </div>\n                    <div class="modal-footer">\n                        <button type="button" class="btn btn-danger ink-reaction pull-left" data-dismiss="modal">Cancelar</button>\n                        <button type="button" class="btn btn-success ink-reaction" id="btnEliminar-documento" data-dismiss="modal">Si, eliminar</button>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class="modal modal-danger fade" id="modal-danger-favorito" style="display: none;">\n            <div class="modal-dialog">\n                <div class="modal-content">\n                    <div class="modal-header">\n                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                            <span aria-hidden="true">\xD7</span>\n                        </button>\n                        <h4 class="modal-title">\xBFEsta seguro que desea eliminar este producto?</h4>\n                    </div>\n                    <div class="modal-body">\n                        <p>Al eliminar el producto dejara de estar en la lista de favoritos.</p>\n                    </div>\n                    <div class="modal-footer">\n                        <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>\n                        <button type="button" class="btn btn-success" id="btnEliminar-favorito" data-dismiss="modal">Si, eliminar</button>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class="modal fade" id="modal-buscar-responsable" style="display: none;">\n            <div class="modal-dialog">\n                <div class="modal-content">\n                    <div class="modal-header">\n                       \n                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                        <span aria-hidden="true">\xD7</span></button>\n                        <h4 class="modal-title">Usuario o vendedor responsable</h4>\n                    </div>\n                    <div class="modal-body">\n                        <div class="panel">\n                            <div class="panel-heading">\n                            <header>Busqueda de usuario</header>\n                            </div>\n                            <form role="form">\n                                <div class="panel-body">\n                                \n                                    <label for="Cod_UsuarioCajero">Ingrese codigo o nombre de usuario</label>\n                                    <div class="input-group">\n                                        <div class="input-group-btn">\n                                            <button type="button" class="btn btn-primary ink-reaction" onclick="', '">Buscar</button>\n                                        </div>\n                                        <input type="text" class="form-control" id="txtBuscarUsuario" onkeydown="', '">\n                                        \n                                    </div>\n                                    <br>\n                                    <div class="table-responsive" id="contenedorTablaUsuarios">\n\n                                    </div>\n                                </div>\n                            </form>\n                            \n                        </div>\n                    </div>\n                    \n                    <div class="modal-footer">\n                        <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class="modal fade" id="modal-nuevo-editar-documento" style="display: none;">\n            \n        </div>\n        <div class="modal fade" id="modal-nuevo-favorito" style="display: none;">\n            \n        </div>\n        <section class="content-header">\n            <h1>\n                Cajas\n                <small>Control cajas</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li><a  onclick=', ' href="#">\n                Cajas</a></li>\n                <li class="active">', '</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                    <header><a onclick=', ' class="btn btn-xs btn-icon-toggle"><i class="fa fa-arrow-left"></i> </a>', ' Caja</header> \n                </div> \n                <div class="card-body">\n                    <div class="panel">\n                        \n                        <!-- form start -->\n                        <div role="form">\n                            <div class="panel-body">\n                                <div class="row">\n                                    <div class="alert alert-callout alert-danger hidden" id="divErrors">\n                                        <p>Es necesario llenar todos los campos requeridos marcados con rojo</p>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    ', '\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Flag_Activo"></label>\n                                            \n                                            <div class="checkbox-inline checkbox-styled checkbox-primary">\n                                                <label>\n                                                    <input type="checkbox" id="Flag_Activo" class="required" checked="', '"><span> Es Activo?</span>\n                                                </label>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Des_Caja">Nombre de la Caja</label>\n                                            <input type="text"  style="text-transform:uppercase" class="form-control required" id="Des_Caja" placeholder="Ingrese Nombre de caja" value="', '">\n                                            <div class="form-control-line"></div>    \n                                        </div>\n                                    </div>\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Cod_Sucursal">Sucursal a la que pertence</label>\n                                            <select id="Cod_Sucursal" class="form-control required">\n                                                ', '\n                                            </select>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <label for="Cod_UsuarioCajero">Usuario o vendedor responsable</label>\n                                        <div class="input-group">\n                                            <div class="input-group-btn">\n                                                <button type="button" class="btn btn-info ink-reaction" onclick=', '>Buscar responsable</button>\n                                            </div>\n                                            <input type="text" class="form-control required" id="Cod_Usuario" value="', '" disabled>\n                                        </div>\n                                    </div>\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Cod_CuentaContable">Cuenta Contable</label>\n                                            <select id="Cod_CuentaContable" class="form-control select2 required">\n                                                <option style="text-transform:uppercase" value="10102" selected>10102</option>\n                                                ', '\n                                            </select>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <button onclick="', '" class="btn btn-primary ink-reaction">Guardar</button>\n                                    </div>\n                                </div>\n                                <p></p>\n                                ', '\n                                \n                            </div>\n                            \n                        </div>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>']),
    _templateObject2 = _taggedTemplateLiteral([''], ['']),
    _templateObject3 = _taggedTemplateLiteral(['<div class="col-sm-6">\n                                    <div class="form-group">\n                                        <label for="Cod_Caja">Codigo Caja</label>\n                                        <input type="text" style="text-transform:uppercase" class="form-control required" id="Cod_Caja" placeholder="Ingrese codigo caja">\n                                        <div class="form-control-line"></div>\n                                    </div>\n                                </div>'], ['<div class="col-sm-6">\n                                    <div class="form-group">\n                                        <label for="Cod_Caja">Codigo Caja</label>\n                                        <input type="text" style="text-transform:uppercase" class="form-control required" id="Cod_Caja" placeholder="Ingrese codigo caja">\n                                        <div class="form-control-line"></div>\n                                    </div>\n                                </div>']),
    _templateObject4 = _taggedTemplateLiteral(['<option style="text-transform:uppercase" value="', '" ', '>', '</option>'], ['<option style="text-transform:uppercase" value="', '" ', '>', '</option>']),
    _templateObject5 = _taggedTemplateLiteral(['\n                                    <div class="row">\n                                            <div class="col-sm-12">\n                                                <div class="nav-tabs-custom">\n                                                    <ul class="nav nav-tabs">\n                                                        <li class="active">\n                                                            <a href="#tab_1" data-toggle="tab" aria-expanded="true">\n                                                                <i class="fa fa-file"></i> Documentos Relacionados</a>\n                                                        </li>\n                                                        <li class="">\n                                                            <a href="#tab_2" data-toggle="tab" aria-expanded="false">\n                                                                <i class="fa fa-star"></i> Productos Favoritos</a>\n                                                        </li>\n                                                    </ul>\n                                                    <div class="tab-content">\n                                                        <div class="tab-pane active" id="tab_1">\n                                                            <div class="card-head">\n                                                                <div class="tools">\n                                                                    <div class="btn-group">\n                                                                        <a class="btn btn-info pull-right" data-toggle="modal" data-target="#modal-nuevo-editar-documento" onclick="', '">\n                                                                        <i class="fa fa-plus"></i> Agregar</a>\n                                                                    </div>\n                                                                </div>\n                                                            </div>\n                                                            <div class="table-responsive">\n                                                                <table class="table table-bordered table-striped">\n                                                                    <thead>\n                                                                        <tr>\n                                                                            <th>Item</th>\n                                                                            <th>Documento</th>\n                                                                            <th>Serie</th>\n                                                                            <th>Impresora</th>\n                                                                            <th>Imprimir</th>\n                                                                            <th>Nombre Archivo</th>\n                                                                            <th>Rapida</th>\n                                                                            <th>Ticketera</th>\n                                                                            <th>Acciones</th>\n                                                                        </tr>\n                                                                    </thead>\n                                                                    <tbody>\n                                                                        ', '\n                                                                    </tbody>\n                                                                </table>\n                                                            </div>\n                                                        </div>\n                                                        <!-- /.tab-pane -->\n                                                        <div class="tab-pane" id="tab_2">\n                                                            <div class="card-head">\n                                                                <div class="tools">\n                                                                    <div class="btn-group">\n                                                                        <a class="btn btn-info pull-right" data-toggle="modal" data-target="#modal-nuevo-favorito" onclick="', '">\n                                                                        <i class="fa fa-plus"></i> Agregar</a>\n                                                                    </div>\n                                                                </div>\n                                                            </div>\n                                                            <div class="table-responsive" id="contenedorTablaFavoritos">\n                                                                <table class="table table-bordered table-striped">\n                                                                    <thead>\n                                                                        <tr>\n                                                                            <th>Producto</th>\n                                                                            <th>Almacen</th>\n                                                                            <th>Unidad Medida</th>\n                                                                            <th>Precio</th>\n                                                                            <th>Stock</th>\n                                                                            <th>Acciones</th>\n                                                                        </tr>\n                                                                    </thead>\n                                                                    <tbody>\n                                                                        ', '\n                                                                    </tbody>\n                                                                </table>\n                                                            </div>\n                                                        </div>\n                                                    </div>\n                                                    <!-- /.tab-content -->\n                                                </div>\n                                            </div>\n                                        \n                                        </div>    \n                                    '], ['\n                                    <div class="row">\n                                            <div class="col-sm-12">\n                                                <div class="nav-tabs-custom">\n                                                    <ul class="nav nav-tabs">\n                                                        <li class="active">\n                                                            <a href="#tab_1" data-toggle="tab" aria-expanded="true">\n                                                                <i class="fa fa-file"></i> Documentos Relacionados</a>\n                                                        </li>\n                                                        <li class="">\n                                                            <a href="#tab_2" data-toggle="tab" aria-expanded="false">\n                                                                <i class="fa fa-star"></i> Productos Favoritos</a>\n                                                        </li>\n                                                    </ul>\n                                                    <div class="tab-content">\n                                                        <div class="tab-pane active" id="tab_1">\n                                                            <div class="card-head">\n                                                                <div class="tools">\n                                                                    <div class="btn-group">\n                                                                        <a class="btn btn-info pull-right" data-toggle="modal" data-target="#modal-nuevo-editar-documento" onclick="', '">\n                                                                        <i class="fa fa-plus"></i> Agregar</a>\n                                                                    </div>\n                                                                </div>\n                                                            </div>\n                                                            <div class="table-responsive">\n                                                                <table class="table table-bordered table-striped">\n                                                                    <thead>\n                                                                        <tr>\n                                                                            <th>Item</th>\n                                                                            <th>Documento</th>\n                                                                            <th>Serie</th>\n                                                                            <th>Impresora</th>\n                                                                            <th>Imprimir</th>\n                                                                            <th>Nombre Archivo</th>\n                                                                            <th>Rapida</th>\n                                                                            <th>Ticketera</th>\n                                                                            <th>Acciones</th>\n                                                                        </tr>\n                                                                    </thead>\n                                                                    <tbody>\n                                                                        ', '\n                                                                    </tbody>\n                                                                </table>\n                                                            </div>\n                                                        </div>\n                                                        <!-- /.tab-pane -->\n                                                        <div class="tab-pane" id="tab_2">\n                                                            <div class="card-head">\n                                                                <div class="tools">\n                                                                    <div class="btn-group">\n                                                                        <a class="btn btn-info pull-right" data-toggle="modal" data-target="#modal-nuevo-favorito" onclick="', '">\n                                                                        <i class="fa fa-plus"></i> Agregar</a>\n                                                                    </div>\n                                                                </div>\n                                                            </div>\n                                                            <div class="table-responsive" id="contenedorTablaFavoritos">\n                                                                <table class="table table-bordered table-striped">\n                                                                    <thead>\n                                                                        <tr>\n                                                                            <th>Producto</th>\n                                                                            <th>Almacen</th>\n                                                                            <th>Unidad Medida</th>\n                                                                            <th>Precio</th>\n                                                                            <th>Stock</th>\n                                                                            <th>Acciones</th>\n                                                                        </tr>\n                                                                    </thead>\n                                                                    <tbody>\n                                                                        ', '\n                                                                    </tbody>\n                                                                </table>\n                                                            </div>\n                                                        </div>\n                                                    </div>\n                                                    <!-- /.tab-content -->\n                                                </div>\n                                            </div>\n                                        \n                                        </div>    \n                                    ']),
    _templateObject6 = _taggedTemplateLiteral(['\n                                                                        <tr>\n                                                                            <td>', '</td>\n                                                                            <td>', '</td>\n                                                                            <td>', '</td>\n                                                                            <td>', '</td>\n                                                                            <td>', '</td>\n                                                                            <td>', '</td>\n                                                                            <td>', '</td>\n                                                                            <td>', '</td>\n                                                                            <td>\n                                                                                ', '\n                                                                                ', '\n                                                                                \n                                                                            </td>\n                                                                        </tr>'], ['\n                                                                        <tr>\n                                                                            <td>', '</td>\n                                                                            <td>', '</td>\n                                                                            <td>', '</td>\n                                                                            <td>', '</td>\n                                                                            <td>', '</td>\n                                                                            <td>', '</td>\n                                                                            <td>', '</td>\n                                                                            <td>', '</td>\n                                                                            <td>\n                                                                                ', '\n                                                                                ', '\n                                                                                \n                                                                            </td>\n                                                                        </tr>']),
    _templateObject7 = _taggedTemplateLiteral(['<button class="btn btn-xs btn-success" data-toggle="modal" data-target="#modal-nuevo-editar-documento" onclick="', '"><i class="fa fa-edit"></i></button>'], ['<button class="btn btn-xs btn-success" data-toggle="modal" data-target="#modal-nuevo-editar-documento" onclick="', '"><i class="fa fa-edit"></i></button>']),
    _templateObject8 = _taggedTemplateLiteral(['<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger-documento" onclick="', '"><i class="fa fa-trash"></i></button>'], ['<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger-documento" onclick="', '"><i class="fa fa-trash"></i></button>']),
    _templateObject9 = _taggedTemplateLiteral(['\n                                                                        <tr>\n                                                                            <td>', '</td>\n                                                                            <td>', '</td>\n                                                                            <td>', '</td>\n                                                                            <td>', '</td>\n                                                                            <td>', '</td>\n                                                                            <td>\n                                                                                ', '\n                                                                                \n                                                                            </td>\n                                                                        </tr>'], ['\n                                                                        <tr>\n                                                                            <td>', '</td>\n                                                                            <td>', '</td>\n                                                                            <td>', '</td>\n                                                                            <td>', '</td>\n                                                                            <td>', '</td>\n                                                                            <td>\n                                                                                ', '\n                                                                                \n                                                                            </td>\n                                                                        </tr>']),
    _templateObject10 = _taggedTemplateLiteral(['<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger-favorito" onclick="', '"><i class="fa fa-trash"></i></button>'], ['<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger-favorito" onclick="', '"><i class="fa fa-trash"></i></button>']),
    _templateObject11 = _taggedTemplateLiteral(['<div class="modal-dialog">\n                <div class="modal-content">\n                    <div class="modal-header">\n                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                        <span aria-hidden="true">\xD7</span></button>\n                        <h4 class="modal-title">Documentos de una caja</h4>\n                    </div>\n                    <div class="modal-body">\n                        <div class="panel">\n                            <div class="panel-heading">\n                                <header>ADMINISTRACION</header>\n                            </div>\n                            <!-- form start -->\n                            <form role="form">\n                                <div class="panel-body">\n                                    <div class="row">\n                                        <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label>Comprobante</label>\n                                            <select class="form-control" id="Cod_TipoComprobante">\n                                                ', '\n                                            </select>\n                                        </div>                \n                                        </div>\n                                        <div class="col-sm-6">\n                                            <div class="form-group">\n                                                <label for="Serie">Serie</label>\n                                                <input type="text" class="form-control" id="Serie" placeholder="Serie" value="', '">\n                                                <div class="form-control-line"></div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                    <div class="row">\n                                        <div class="col-sm-6"> \n                                            <div class="form-group">\n                                                <div class="checkbox-inline checkbox-styled checkbox-primary">\n                                                    <label>\n                                                    <input type="checkbox" id="Flag_Imprimir" ', '><span> Se imprime?</span>\n                                                    </label>\n                                                </div>\n                                                <select class="form-control" id="Impresora">\n                                                    ', '\n                                                </select>\n                                            </div>       \n                                        </div>\n                                       \n                                    </div>\n                                    <div class="row">\n                                        <div class="col-sm-12">\n                                            <div class="form-group">\n                                                <label for="Nom_Archivo">Documento *.rpt</label>\n                                                <input type="file" id="Nom_Archivo">\n                                            </div>\n                                        </div>\n                                    </div>\n                                    <div class="row">\n                                        <div class="col-sm-12">\n                                            <div class="form-group">\n                                                <label for="Nom_ArchivoPublicar">Publicar Web *.rpt</label>\n                                                <input type="file" id="Nom_ArchivoPublicar">\n                                            </div>\n                                        </div>\n                                    </div>\n                                    <div class="row">\n                                        <div class="col-sm-6">  \n                                            <div class="form-group">\n                                                <label for="Nro_SerieTicketera">Nro. de Serie</label>\n                                                <input type="email" class="form-control" id="Nro_SerieTicketera" placeholder="Nro. de Serie" value="', '">\n                                                <div class="form-control-line"></div>\n                                                <p class="help-block">Solo en caso de tener un Tiketera</p>\n                                            </div>\n                                        </div>\n                                        <div class="col-sm-6">\n                                        <label for="Flag_Activo"></label>\n                                            <div class="checkbox-inline checkbox-styled checkbox-primary">\n                                                <label>\n                                                <input type="checkbox" id="Flag_FacRapida" ', '><span> Documento de facturacion rapida</span>\n                                                </label>\n                                            </div>  \n                                        </div>\n                                    </div>\n                                </div>\n                            </form>\n                            <div class="card-actionbar">\n                                <button onclick="', '" data-dismiss="modal" class="btn btn-primary ink-reaction">Guardar</button>\n                            </div>\n                        </div>\n                    </div>\n                    \n                    <div class="modal-footer">\n                        <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>\n                    </div>\n                </div>\n            </div>'], ['<div class="modal-dialog">\n                <div class="modal-content">\n                    <div class="modal-header">\n                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                        <span aria-hidden="true">\xD7</span></button>\n                        <h4 class="modal-title">Documentos de una caja</h4>\n                    </div>\n                    <div class="modal-body">\n                        <div class="panel">\n                            <div class="panel-heading">\n                                <header>ADMINISTRACION</header>\n                            </div>\n                            <!-- form start -->\n                            <form role="form">\n                                <div class="panel-body">\n                                    <div class="row">\n                                        <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label>Comprobante</label>\n                                            <select class="form-control" id="Cod_TipoComprobante">\n                                                ', '\n                                            </select>\n                                        </div>                \n                                        </div>\n                                        <div class="col-sm-6">\n                                            <div class="form-group">\n                                                <label for="Serie">Serie</label>\n                                                <input type="text" class="form-control" id="Serie" placeholder="Serie" value="', '">\n                                                <div class="form-control-line"></div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                    <div class="row">\n                                        <div class="col-sm-6"> \n                                            <div class="form-group">\n                                                <div class="checkbox-inline checkbox-styled checkbox-primary">\n                                                    <label>\n                                                    <input type="checkbox" id="Flag_Imprimir" ', '><span> Se imprime?</span>\n                                                    </label>\n                                                </div>\n                                                <select class="form-control" id="Impresora">\n                                                    ', '\n                                                </select>\n                                            </div>       \n                                        </div>\n                                       \n                                    </div>\n                                    <div class="row">\n                                        <div class="col-sm-12">\n                                            <div class="form-group">\n                                                <label for="Nom_Archivo">Documento *.rpt</label>\n                                                <input type="file" id="Nom_Archivo">\n                                            </div>\n                                        </div>\n                                    </div>\n                                    <div class="row">\n                                        <div class="col-sm-12">\n                                            <div class="form-group">\n                                                <label for="Nom_ArchivoPublicar">Publicar Web *.rpt</label>\n                                                <input type="file" id="Nom_ArchivoPublicar">\n                                            </div>\n                                        </div>\n                                    </div>\n                                    <div class="row">\n                                        <div class="col-sm-6">  \n                                            <div class="form-group">\n                                                <label for="Nro_SerieTicketera">Nro. de Serie</label>\n                                                <input type="email" class="form-control" id="Nro_SerieTicketera" placeholder="Nro. de Serie" value="', '">\n                                                <div class="form-control-line"></div>\n                                                <p class="help-block">Solo en caso de tener un Tiketera</p>\n                                            </div>\n                                        </div>\n                                        <div class="col-sm-6">\n                                        <label for="Flag_Activo"></label>\n                                            <div class="checkbox-inline checkbox-styled checkbox-primary">\n                                                <label>\n                                                <input type="checkbox" id="Flag_FacRapida" ', '><span> Documento de facturacion rapida</span>\n                                                </label>\n                                            </div>  \n                                        </div>\n                                    </div>\n                                </div>\n                            </form>\n                            <div class="card-actionbar">\n                                <button onclick="', '" data-dismiss="modal" class="btn btn-primary ink-reaction">Guardar</button>\n                            </div>\n                        </div>\n                    </div>\n                    \n                    <div class="modal-footer">\n                        <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>\n                    </div>\n                </div>\n            </div>']),
    _templateObject12 = _taggedTemplateLiteral(['<option value="', '" ', '>', '</option>'], ['<option value="', '" ', '>', '</option>']),
    _templateObject13 = _taggedTemplateLiteral(['<table id="example1" class="table table-bordered table-striped">\n    <thead>\n        <tr>\n            <th>Codigo</th>\n            <th>Nombre</th>\n            <th>Accion</th>\n        </tr>\n    </thead>\n    <tbody>\n        ', '\n    </tbody>\n\n</table>'], ['<table id="example1" class="table table-bordered table-striped">\n    <thead>\n        <tr>\n            <th>Codigo</th>\n            <th>Nombre</th>\n            <th>Accion</th>\n        </tr>\n    </thead>\n    <tbody>\n        ', '\n    </tbody>\n\n</table>']),
    _templateObject14 = _taggedTemplateLiteral(['\n        <tr>\n            <td>', '</td>\n            <td>', '</td>\n            <td><button class="btn btn-xs btn-primary" data-dismiss="modal" onclick="', '"><i class="fa fa-check"></i> Elegir</button></td>\n        </tr>'], ['\n        <tr>\n            <td>', '</td>\n            <td>', '</td>\n            <td><button class="btn btn-xs btn-primary" data-dismiss="modal" onclick="', '"><i class="fa fa-check"></i> Elegir</button></td>\n        </tr>']),
    _templateObject15 = _taggedTemplateLiteral(['<div class="modal-dialog">\n                <div class="modal-content">\n                    <div class="modal-header">\n                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                        <span aria-hidden="true">\xD7</span></button>\n                        <h4 class="modal-title">Buscar producto</h4>\n                    </div>\n                    <div class="modal-body">\n                        <div class="panel">\n                            <div class="panel-heading">\n                                <h3>Productos</h3>\n                            </div>\n                            <!-- form start -->\n                            <div role="form">\n                                <div class="panel-body">\n                                    <div class="row">\n                                        <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label>Categoria</label>\n                                            <select class="form-control" id="Cod_Categoria">\n                                                ', '\n                                            </select>\n                                        </div>                \n                                        </div>\n                                        <div class="col-sm-6">\n                                            <div class="form-group">\n                                                <label for="Serie">Tipo de Precio</label>\n                                                <select class="form-control" id="Cod_Precio">\n                                                ', '\n                                                </select>\n                                            </div>\n                                        </div>\n                                    </div>\n                                    <div class="row">\n                                        <div class="col-sm-6">\n                                            <div class="form-group">\n                                                <label for="textobuscar">Texto a buscar</label>\n                                                <input type="text" class="form-control" id="Buscar" placeholder="Helado">\n                                                <div class="form-control-line"></div>\n                                            </div>\n                                        </div>\n                                        <div class="col-sm-6"> \n                                            <label for="Flag_Activo"></label>\n                                            <div class="checkbox-inline checkbox-styled checkbox-primary"> \n                                                <label>\n                                                <input type="checkbox" id="Flag_RequiereStock" ><span> Solo productos con stock?</span>\n                                                </label>\n                                            </div>       \n                                        </div>\n                                       \n                                    </div>\n                                    <div class="row">\n                                        <div class="col-sm-6">\n                                            <button onclick="', '"class="btn btn-primary">Buscar</button>\n                                        </div>\n                                    </div>\n                                    <br>\n                                    <div class="table-responsive" id="contenedorTablaProductos">\n                                        \n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    \n                    <div class="modal-footer">\n                        <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>\n                    </div>\n                </div>\n            </div>'], ['<div class="modal-dialog">\n                <div class="modal-content">\n                    <div class="modal-header">\n                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                        <span aria-hidden="true">\xD7</span></button>\n                        <h4 class="modal-title">Buscar producto</h4>\n                    </div>\n                    <div class="modal-body">\n                        <div class="panel">\n                            <div class="panel-heading">\n                                <h3>Productos</h3>\n                            </div>\n                            <!-- form start -->\n                            <div role="form">\n                                <div class="panel-body">\n                                    <div class="row">\n                                        <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label>Categoria</label>\n                                            <select class="form-control" id="Cod_Categoria">\n                                                ', '\n                                            </select>\n                                        </div>                \n                                        </div>\n                                        <div class="col-sm-6">\n                                            <div class="form-group">\n                                                <label for="Serie">Tipo de Precio</label>\n                                                <select class="form-control" id="Cod_Precio">\n                                                ', '\n                                                </select>\n                                            </div>\n                                        </div>\n                                    </div>\n                                    <div class="row">\n                                        <div class="col-sm-6">\n                                            <div class="form-group">\n                                                <label for="textobuscar">Texto a buscar</label>\n                                                <input type="text" class="form-control" id="Buscar" placeholder="Helado">\n                                                <div class="form-control-line"></div>\n                                            </div>\n                                        </div>\n                                        <div class="col-sm-6"> \n                                            <label for="Flag_Activo"></label>\n                                            <div class="checkbox-inline checkbox-styled checkbox-primary"> \n                                                <label>\n                                                <input type="checkbox" id="Flag_RequiereStock" ><span> Solo productos con stock?</span>\n                                                </label>\n                                            </div>       \n                                        </div>\n                                       \n                                    </div>\n                                    <div class="row">\n                                        <div class="col-sm-6">\n                                            <button onclick="', '"class="btn btn-primary">Buscar</button>\n                                        </div>\n                                    </div>\n                                    <br>\n                                    <div class="table-responsive" id="contenedorTablaProductos">\n                                        \n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    \n                    <div class="modal-footer">\n                        <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>\n                    </div>\n                </div>\n            </div>']),
    _templateObject16 = _taggedTemplateLiteral(['<option value="', '">', '</option>'], ['<option value="', '">', '</option>']),
    _templateObject17 = _taggedTemplateLiteral(['<table id="example1" class="table table-bordered table-striped">\n                    <thead>\n                        <tr>\n                            <th>Accion</th>\n                            <th>Codigo</th>\n                            <th>Almacen</th>\n                            <th>Producto</th>\n                            <th>Stock</th>\n                            <th>Moneda</th>\n                            <th>PU</th>\n                            <th>UM</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        ', '\n                    </tbody>\n\n                </table>'], ['<table id="example1" class="table table-bordered table-striped">\n                    <thead>\n                        <tr>\n                            <th>Accion</th>\n                            <th>Codigo</th>\n                            <th>Almacen</th>\n                            <th>Producto</th>\n                            <th>Stock</th>\n                            <th>Moneda</th>\n                            <th>PU</th>\n                            <th>UM</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        ', '\n                    </tbody>\n\n                </table>']),
    _templateObject18 = _taggedTemplateLiteral(['<tr>\n                                                    <td><button class="btn btn-xs btn-primary" data-dismiss="modal" onclick="', '"><i class="fa fa-check"></i> Agregar</button></td>\n                                                    <td>', '</td>\n                                                    <td>', '</td>\n                                                    <td>', '</td>\n                                                    <td>', '</td>\n                                                    <td>', '</td>\n                                                    <td>', '</td>\n                                                    <td>', '</td>\n                                                    \n                                                </tr>'], ['<tr>\n                                                    <td><button class="btn btn-xs btn-primary" data-dismiss="modal" onclick="', '"><i class="fa fa-check"></i> Agregar</button></td>\n                                                    <td>', '</td>\n                                                    <td>', '</td>\n                                                    <td>', '</td>\n                                                    <td>', '</td>\n                                                    <td>', '</td>\n                                                    <td>', '</td>\n                                                    <td>', '</td>\n                                                    \n                                                </tr>']),
    _templateObject19 = _taggedTemplateLiteral(['<table class="table table-bordered table-striped">\n                                <thead>\n                                    <tr>\n                                        <th>Producto</th>\n                                        <th>Almacen</th>\n                                        <th>Unidad Medida</th>\n                                        <th>Precio</th>\n                                        <th>Stock</th>\n                                        <th>Acciones</th>\n                                    </tr>\n                                </thead>\n                                <tbody>\n                                    ', '\n                                </tbody>\n                            </table>'], ['<table class="table table-bordered table-striped">\n                                <thead>\n                                    <tr>\n                                        <th>Producto</th>\n                                        <th>Almacen</th>\n                                        <th>Unidad Medida</th>\n                                        <th>Precio</th>\n                                        <th>Stock</th>\n                                        <th>Acciones</th>\n                                    </tr>\n                                </thead>\n                                <tbody>\n                                    ', '\n                                </tbody>\n                            </table>']),
    _templateObject20 = _taggedTemplateLiteral(['\n                                    <tr>\n                                        <td>', '</td>\n                                        <td>', '</td>\n                                        <td>', '</td>\n                                        <td>', '</td>\n                                        <td>', '</td>\n                                        <td>\n                                            ', '\n                                            \n                                        </td>\n                                    </tr>'], ['\n                                    <tr>\n                                        <td>', '</td>\n                                        <td>', '</td>\n                                        <td>', '</td>\n                                        <td>', '</td>\n                                        <td>', '</td>\n                                        <td>\n                                            ', '\n                                            \n                                        </td>\n                                    </tr>']);

var _listar = require('./listar');

var _constantes = require('../../../constantes_entorno/constantes');

function _taggedTemplateLiteral(strings, raw) {
    return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));
}

var empty = require('empty-element');
var yo = require('yo-yo');

function Ver(_escritura, sucursales, usuarios, cuentas_contables, caja, documentos, productos) {

    var el = yo(_templateObject, function () {
        return BusquedaDeUsuario();
    }, function () {
        return BusquedaDeUsuario();
    }, function () {
        return (0, _listar.ListarCajas)(_escritura);
    }, caja ? 'Editar' : 'Nuevo', function () {
        return (0, _listar.ListarCajas)(_escritura);
    }, caja ? 'Editar' : 'Nueva', caja ? yo(_templateObject2) : yo(_templateObject3), caja ? caja.Flag_Activo : 0, caja ? caja.Des_Caja : '', sucursales.map(function (e) {
        return yo(_templateObject4, e.Cod_Sucursal, caja ? caja.Cod_Sucursal == e.Cod_Sucursal ? 'selected' : '' : '', e.Nom_Sucursal);
    }), function () {
        $("#modal-buscar-responsable").modal();
    }, caja ? caja.Cod_UsuarioCajero : '', sucursales.map(function (e) {
        return yo(_templateObject4, e.Cod_CuentaContable, caja ? caja.Cod_Sucursal == e ? 'selected' : '' : '', e);
    }), function () {
        return GuardarCaja(_escritura, caja);
    }, caja != undefined ? yo(_templateObject5, function () {
        return AgregarDocumento(_escritura, sucursales, usuarios, cuentas_contables, caja);
    }, documentos.map(function (u) {
        return yo(_templateObject6, u.Item, u.Nom_TipoComprobante, u.Serie, u.Impresora, u.Flag_Imprimir, u.Nom_Archivo, u.Flag_FacRapida, u.Nro_SerieTicketera, _escritura ? yo(_templateObject7, function () {
            return AgregarDocumento(_escritura, sucursales, usuarios, cuentas_contables, caja, u);
        }) : yo(_templateObject2), _escritura ? yo(_templateObject8, function () {
            return EliminarDocumento(_escritura, sucursales, usuarios, cuentas_contables, caja, u);
        }) : yo(_templateObject2));
    }), function () {
        return AgregarFavorito(_escritura, sucursales, usuarios, cuentas_contables, caja);
    }, productos.map(function (u) {
        return yo(_templateObject9, u.Nom_Producto, u.Des_Almacen, u.Nom_UnidadMedida, u.Valor, u.Stock_Act, _escritura ? yo(_templateObject10, function () {
            return EliminarFavorito(_escritura, caja, u);
        }) : yo(_templateObject2));
    })) : yo(_templateObject2));
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
    // $('.select2').select2();
}

var impresoras = ['Microsoft XSP Document Writer', 'Microsoft Print to PDF', 'Fax', 'Enviar a OneNote 2013', 'BIXOLON SPP R310', 'EPSON TM-T20II'];

function VerAgregarDocumento(_escritura, sucursales, usuarios, cuentas_contables, caja, comprobantes, documento) {

    var el = yo(_templateObject11, comprobantes.map(function (u) {
        return yo(_templateObject12, u.Cod_TipoComprobante, documento ? documento.Cod_TipoComprobante == u.Cod_TipoComprobante ? 'selected' : '' : '', u.Nom_TipoComprobante);
    }), documento ? documento.Serie : '', documento ? documento.Flag_Imprimir ? 'checked' : '' : '', impresoras.map(function (u) {
        return yo(_templateObject12, u, documento ? u == documento.Impresora ? 'selected' : '' : '', u);
    }), documento ? documento.Nro_SerieTicketera : '', documento ? documento.Flag_FacRapida ? 'checked' : '' : '', function () {
        return GuardarDocumento(_escritura, sucursales, usuarios, cuentas_contables, caja, documento);
    });

    var modal_nuevo_editar_documento = document.getElementById('modal-nuevo-editar-documento');
    empty(modal_nuevo_editar_documento).appendChild(el);
}

function GuardarCaja(_escritura, caja) {
    //console.log(document.getElementById('Cod_Usuarios').value.toUpperCase())
    if (ValidacionCampos()) {
        run_waitMe($('#main-contenido'), 1, "ios", "Guardando caja...");
        var Cod_Caja = null;
        if (caja != undefined) Cod_Caja = caja.Cod_Caja;else Cod_Caja = document.getElementById('Cod_Caja').value.toUpperCase();

        var Des_Caja = document.getElementById('Des_Caja').value.toUpperCase();
        var Cod_Sucursal = document.getElementById('Cod_Sucursal').value.toUpperCase();
        var Cod_UsuarioCajero = document.getElementById('Cod_Usuario').value.toUpperCase();
        var Cod_CuentaContable = document.getElementById('Cod_CuentaContable').value.toUpperCase();
        var Flag_Activo = document.getElementById('Flag_Activo').checked ? '1' : '0';
        var Cod_Usuario = 'ADMINISTRADOR';

        var parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Cod_Caja: Cod_Caja,
                Des_Caja: Des_Caja,
                Cod_Sucursal: Cod_Sucursal,
                Cod_UsuarioCajero: Cod_UsuarioCajero,
                Cod_CuentaContable: Cod_CuentaContable,
                Flag_Activo: Flag_Activo,
                Cod_Usuario: Cod_Usuario
            })
        };
        fetch(_constantes.URL + '/cajas_api/guardar_caja', parametros).then(function (req) {
            return req.json();
        }).then(function (res) {
            if (res.respuesta == 'ok') {
                (0, _listar.ListarCajas)(_escritura);
            } else {
                console.log('Error');
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
            $('#main-contenido').waitMe('hide');
        });
    }
}

function EliminarDocumento(_escritura, sucursales, usuarios, cuentas_contables, caja, u) {
    var btnEliminar = document.getElementById('btnEliminar-documento');
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        var _this = this;

        run_waitMe($('#main-contenido'), 1, "ios", "Eliminando documento...");
        var Cod_Caja = caja.Cod_Caja;
        var Item = u.Item;
        var parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Cod_Caja: Cod_Caja,
                Item: Item
            })
        };
        fetch(_constantes.URL + '/cajas_api/eliminar_documento', parametros).then(function (req) {
            return req.json();
        }).then(function (res) {

            if (res.respuesta == 'ok') {
                NuevaCaja(_escritura, sucursales, usuarios, cuentas_contables, caja);
                _this.removeEventListener('click', Eliminar);
            } else {
                _this.removeEventListener('click', Eliminar);
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
            $('#main-contenido').waitMe('hide');
        });
    });
}

function GuardarDocumento(_escritura, sucursales, usuarios, cuentas_contables, caja, documento) {
    var Cod_Caja = caja.Cod_Caja;
    var Item = documento ? documento.Item : 0;
    var Cod_TipoComprobante = document.getElementById('Cod_TipoComprobante').value;
    var Serie = document.getElementById('Serie').value;
    var Impresora = document.getElementById('Impresora').value;
    var Flag_Imprimir = document.getElementById('Flag_Imprimir').checked ? '1' : '0';
    var Flag_FacRapida = document.getElementById('Flag_FacRapida').checked ? '1' : '0';
    var Nom_Archivo = document.getElementById('Nom_Archivo').files[0] != undefined ? document.getElementById('Nom_Archivo').files[0].name : '';
    var Nro_SerieTicketera = document.getElementById('Nro_SerieTicketera').value;
    var Nom_ArchivoPublicar = document.getElementById('Nom_ArchivoPublicar').files[0] != undefined ? document.getElementById('Nom_ArchivoPublicar').files[0].name : '';
    var Limite = 0;
    var Cod_Usuario = "ADMINISTRADOR";

    var parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Cod_Caja: Cod_Caja,
            Item: Item,
            Cod_TipoComprobante: Cod_TipoComprobante,
            Serie: Serie,
            Impresora: Impresora,
            Flag_Imprimir: Flag_Imprimir,
            Flag_FacRapida: Flag_FacRapida,
            Nom_Archivo: Nom_Archivo,
            Nro_SerieTicketera: Nro_SerieTicketera,
            Nom_ArchivoPublicar: Nom_ArchivoPublicar,
            Limite: Limite,
            Cod_Usuario: Cod_Usuario
        })
    };
    fetch(_constantes.URL + '/cajas_api/guardar_documento', parametros).then(function (req) {
        return req.json();
    }).then(function (res) {
        if (res.respuesta == 'ok') {
            NuevaCaja(_escritura, sucursales, usuarios, cuentas_contables, caja);
        } else {
            console.log('Error');
        }
    }).catch(function (e) {
        console.log(e);
        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
    });
}

function AgregarDocumento(_escritura, sucursales, usuarios, cuentas_contables, caja, documento) {
    run_waitMe($('#main-contenido'), 1, "ios");
    var parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    };
    fetch(_constantes.URL + '/cajas_api/get_comprobantes', parametros).then(function (req) {
        return req.json();
    }).then(function (res) {
        if (res.respuesta == 'ok') {
            var comprobantes = res.data.comprobantes;

            if (documento == undefined) VerAgregarDocumento(_escritura, sucursales, usuarios, cuentas_contables, caja, comprobantes);else VerAgregarDocumento(_escritura, sucursales, usuarios, cuentas_contables, caja, comprobantes, documento);
        } else {
            console.log("ERR");
        }
        $('#main-contenido').waitMe('hide');
    }).catch(function (e) {
        console.log(e);
        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
        $('#main-contenido').waitMe('hide');
    });
}

function BusquedaDeUsuario() {
    var txtBuscarUsuario = document.getElementById("txtBuscarUsuario").value;
    if (txtBuscarUsuario.length >= 3) {
        var parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                TamanoPagina: '20',
                NumeroPagina: '0',
                ScripOrden: ' ORDER BY Cod_Usuarios asc',
                ScripWhere: txtBuscarUsuario
            })
        };
        fetch(_constantes.URL + '/cajas_api/buscar_usuarios', parametros).then(function (req) {
            return req.json();
        }).then(function (res) {
            if (res.respuesta == 'ok') {
                var usuarios = res.data.usuarios;
                if (usuarios.length > 0) AgregarTabla(usuarios);else empty(document.getElementById('contenedorTablaUsuarios'));
            } else empty(document.getElementById('contenedorTablaUsuarios'));
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
        });
    } else {
        empty(document.getElementById('contenedorTablaUsuarios'));
    }
}

function AgregarTabla(usuarios) {
    var el = yo(_templateObject13, usuarios.map(function (u) {
        return yo(_templateObject14, u.Cod_Usuarios, u.Nick, function () {
            return SeleccionarUsuario(u);
        });
    }));
    empty(document.getElementById('contenedorTablaUsuarios')).appendChild(el);
}

function SeleccionarUsuario(usuario) {
    var Cod_Usuario = document.getElementById('Cod_Usuario');
    Cod_Usuario.value = usuario.Cod_Usuarios + " - " + usuario.Nick;
}

function AgregarFavorito(_escritura, sucursales, usuarios, cuentas_contables, caja) {
    run_waitMe($('#main-contenido'), 1, "ios");
    var parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    };
    fetch(_constantes.URL + '/cajas_api/opciones_buscar_producto', parametros).then(function (req) {
        return req.json();
    }).then(function (res) {
        if (res.respuesta == 'ok') {
            var categorias = res.data.categorias;
            var tipoprecio = res.data.tipoprecio;
            VerAgregarFavorito(_escritura, sucursales, usuarios, cuentas_contables, caja, categorias, tipoprecio);
        } else {
            console.log("ERR");
        }
        $('#main-contenido').waitMe('hide');
    }).catch(function (e) {
        console.log(e);
        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
        $('#main-contenido').waitMe('hide');
    });
}

function VerAgregarFavorito(_escritura, sucursales, usuarios, cuentas_contables, caja, categorias, tipoprecio) {
    var el = yo(_templateObject15, categorias.map(function (u) {
        return yo(_templateObject16, u.Cod_Categoria, u.Des_Categoria);
    }), tipoprecio.map(function (u) {
        return yo(_templateObject16, u.Cod_Precio, u.Nom_Precio);
    }), function () {
        return BuscarProductos(_escritura, caja);
    });

    var modal_nuevo_editar_documento = document.getElementById('modal-nuevo-favorito');
    empty(modal_nuevo_editar_documento).appendChild(el);
}

function BuscarProductos(_escritura, caja) {
    var Cod_Caja = caja.Cod_Caja;
    var Buscar = document.getElementById('Buscar').value;
    var Cod_Categoria = document.getElementById('Cod_Categoria').value;
    var Cod_Precio = document.getElementById('Cod_Precio').value;
    var Flag_RequiereStock = document.getElementById('Flag_RequiereStock').checked ? '1' : '0';
    run_waitMe($('#main-contenido'), 1, "ios");
    var parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Cod_Caja: Cod_Caja,
            Buscar: Buscar,
            Cod_Categoria: Cod_Categoria,
            Cod_Precio: Cod_Precio,
            Flag_RequiereStock: Flag_RequiereStock
        })
    };
    fetch(_constantes.URL + '/cajas_api/buscar_producto', parametros).then(function (req) {
        return req.json();
    }).then(function (res) {
        var productos = res.data.productos;
        console.log(productos);
        if (res.respuesta == 'ok') {
            AgregarTablaProductos(_escritura, caja, productos);
        } else {
            console.log('Error');
        }
        $('#main-contenido').waitMe('hide');
    }).catch(function (e) {
        console.log(e);
        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
        $('#main-contenido').waitMe('hide');
    });
}

function AgregarTablaProductos(_escritura, caja, productos) {
    var el = yo(_templateObject17, productos.map(function (u) {
        return yo(_templateObject18, function () {
            return GuardarFavorito(_escritura, caja, u);
        }, u.Cod_Producto, u.Des_Almacen, u.Nom_Producto, u.Stock_Act, u.Nom_Moneda, u.Precio, u.Nom_UnidadMedida);
    }));

    empty(document.getElementById('contenedorTablaProductos')).appendChild(el);
}

function GuardarFavorito(_escritura, caja, producto) {
    var Cod_Caja = caja.Cod_Caja;
    var Id_Producto = producto.Id_Producto;
    var Cod_Almacen = producto.Cod_Almacen;
    var Cod_UnidadMedida = producto.Cod_UnidadMedida;
    var Cod_Precio = document.getElementById('Cod_Precio').value;
    run_waitMe($('#main-contenido'), 1, "ios", "Guardando favorito...");
    var parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Cod_Caja: Cod_Caja,
            Id_Producto: Id_Producto,
            Cod_Almacen: Cod_Almacen,
            Cod_UnidadMedida: Cod_UnidadMedida,
            Cod_Precio: Cod_Precio
        })
    };
    fetch(_constantes.URL + '/cajas_api/guardar_favorito', parametros).then(function (req) {
        return req.json();
    }).then(function (res) {
        if (res.respuesta == 'ok') {
            var productos = res.data.productos;
            var el = yo(_templateObject19, productos.map(function (u) {
                return yo(_templateObject20, u.Nom_Producto, u.Des_Almacen, u.Nom_UnidadMedida, u.Valor, u.Stock_Act, _escritura ? yo(_templateObject10, function () {
                    return EliminarFavorito(_escritura, caja, u);
                }) : yo(_templateObject2));
            }));
            empty(document.getElementById('contenedorTablaFavoritos')).appendChild(el);
        } else {
            console.log('Error');
        }
        $('#main-contenido').waitMe('hide');
    }).catch(function (e) {
        console.log(e);
        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
        $('#main-contenido').waitMe('hide');
    });
}

function EliminarFavorito(_escritura, caja, producto) {
    var btnEliminar = document.getElementById('btnEliminar-favorito');
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        var Cod_Caja = caja.Cod_Caja;
        var Id_Producto = producto.Id_Producto;
        run_waitMe($('#main-contenido'), 1, "ios", "Eliminando favorito...");
        var parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Cod_Caja: Cod_Caja,
                Id_Producto: Id_Producto
            })
        };
        fetch(_constantes.URL + '/cajas_api/eliminar_favorito', parametros).then(function (req) {
            return req.json();
        }).then(function (res) {
            if (res.respuesta == 'ok') {
                var productos = res.data.productos;
                var el = yo(_templateObject19, productos.map(function (u) {
                    return yo(_templateObject20, u.Nom_Producto, u.Des_Almacen, u.Nom_UnidadMedida, u.Valor, u.Stock_Act, _escritura ? yo(_templateObject10, function () {
                        return EliminarFavorito(_escritura, caja, u);
                    }) : yo(_templateObject2));
                }));
                empty(document.getElementById('contenedorTablaFavoritos')).appendChild(el);
            } else {
                console.log('Error');
            }
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
            $('#main-contenido').waitMe('hide');
        });
    });
}

function NuevaCaja(_escritura, sucursales, usuarios, cuentas_contables, caja) {
    if (caja != undefined) {
        run_waitMe($('#main-contenido'), 1, "ios");
        var parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Cod_Caja: caja.Cod_Caja })
        };
        fetch(_constantes.URL + '/cajas_api/get_documents_by_caja', parametros).then(function (req) {
            return req.json();
        }).then(function (res) {
            if (res.respuesta == 'ok') {
                Ver(_escritura, sucursales, usuarios, cuentas_contables, caja, res.data.documentos, res.data.productos);
            } else {
                console.log('Error');
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
            $('#main-contenido').waitMe('hide');
        });
    } else Ver(_escritura, sucursales, usuarios, cuentas_contables, caja, [], []);
}
exports.NuevaCaja = NuevaCaja;

},{"../../../constantes_entorno/constantes":344,"./listar":349,"empty-element":331,"yo-yo":342}],349:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ListarCajas = undefined;

var _templateObject = _taggedTemplateLiteral(['<div><button class="btn btn-xs btn-success">Editar</button>\n    <button class="btn btn-xs btn-danger">Borrar</button></div>'], ['<div><button class="btn btn-xs btn-success">Editar</button>\n    <button class="btn btn-xs btn-danger">Borrar</button></div>']),
    _templateObject2 = _taggedTemplateLiteral(['<div></div>'], ['<div></div>']),
    _templateObject3 = _taggedTemplateLiteral(['\n    <div>\n        <section class="content-header">\n        <div class="modal modal-danger fade" id="modal-danger" style="display: none;">\n        <div class="modal-dialog">\n          <div class="modal-content">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                <span aria-hidden="true">\xD7</span></button>\n              <h4 class="modal-title">\xBFEsta seguro que desea eliminar este usuario?</h4>\n            </div>\n            <div class="modal-body">\n              <p>Al eliminar el usuario se perderan todos los datos.</p>\n            </div>\n            <div class="modal-footer">\n              <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>\n              <button type="button" class="btn btn-success" id="btnEliminar" data-dismiss="modal">Eliminar</button>\n            </div>\n          </div>\n          <!-- /.modal-content -->\n        </div>\n        <!-- /.modal-dialog -->\n      </div>\n            <h1>\n                Cajas\n                <small>Control cajas</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li class="active">Cajas</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                    <header>Lista de Cajas</header>\n                    <div class="tools">\n                        <div class="btn-group">\n                            ', '\n                        </div>\n                    </div>\n                </div>\n                <div class="card-body">\n                    <div class="table-responsive">\n                    <table id="example1" class="table table-bordered table-striped">\n                        <thead>\n                            <tr>\n                                <th>Codigo</th>\n                                <th>Caja</th>\n                                <th>Sucursal</th>\n                                <th>Responsable</th>\n                                <th>Cuenta Contable</th>\n                                <th>Acciones</th>\n                            </tr>\n                        </thead>\n                        <tbody>\n                            ', '\n                        </tbody>\n                    </table>\n                    </div>\n                    <div class="card-actionbar">\n                        <div class="card-actionbar-row">\n                            <ul class="pagination pagination-sm no-margin pull-right">\n                                <li>\n                                    <a href="#" onclick=', '>\xAB</a>\n                                </li>\n                                ', '\n                            \n                                <li>\n                                    <a href="#" onclick=', '>\xBB</a>\n                                </li>\n                            </ul>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>'], ['\n    <div>\n        <section class="content-header">\n        <div class="modal modal-danger fade" id="modal-danger" style="display: none;">\n        <div class="modal-dialog">\n          <div class="modal-content">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                <span aria-hidden="true">\xD7</span></button>\n              <h4 class="modal-title">\xBFEsta seguro que desea eliminar este usuario?</h4>\n            </div>\n            <div class="modal-body">\n              <p>Al eliminar el usuario se perderan todos los datos.</p>\n            </div>\n            <div class="modal-footer">\n              <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>\n              <button type="button" class="btn btn-success" id="btnEliminar" data-dismiss="modal">Eliminar</button>\n            </div>\n          </div>\n          <!-- /.modal-content -->\n        </div>\n        <!-- /.modal-dialog -->\n      </div>\n            <h1>\n                Cajas\n                <small>Control cajas</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li class="active">Cajas</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                    <header>Lista de Cajas</header>\n                    <div class="tools">\n                        <div class="btn-group">\n                            ', '\n                        </div>\n                    </div>\n                </div>\n                <div class="card-body">\n                    <div class="table-responsive">\n                    <table id="example1" class="table table-bordered table-striped">\n                        <thead>\n                            <tr>\n                                <th>Codigo</th>\n                                <th>Caja</th>\n                                <th>Sucursal</th>\n                                <th>Responsable</th>\n                                <th>Cuenta Contable</th>\n                                <th>Acciones</th>\n                            </tr>\n                        </thead>\n                        <tbody>\n                            ', '\n                        </tbody>\n                    </table>\n                    </div>\n                    <div class="card-actionbar">\n                        <div class="card-actionbar-row">\n                            <ul class="pagination pagination-sm no-margin pull-right">\n                                <li>\n                                    <a href="#" onclick=', '>\xAB</a>\n                                </li>\n                                ', '\n                            \n                                <li>\n                                    <a href="#" onclick=', '>\xBB</a>\n                                </li>\n                            </ul>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>']),
    _templateObject4 = _taggedTemplateLiteral(['<a onclick=', ' class="btn btn-info pull-right">\n                            <i class="fa fa-plus"></i> Nueva Caja</a>'], ['<a onclick=', ' class="btn btn-info pull-right">\n                            <i class="fa fa-plus"></i> Nueva Caja</a>']),
    _templateObject5 = _taggedTemplateLiteral([''], ['']),
    _templateObject6 = _taggedTemplateLiteral(['\n                            <tr>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>\n                                    ', '\n                                    ', '\n                                    \n                                </td>\n                            </tr>'], ['\n                            <tr>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>\n                                    ', '\n                                    ', '\n                                    \n                                </td>\n                            </tr>']),
    _templateObject7 = _taggedTemplateLiteral(['<button class="btn btn-xs btn-success" onclick="', '"><i class="fa fa-edit"></i></button>'], ['<button class="btn btn-xs btn-success" onclick="', '"><i class="fa fa-edit"></i></button>']),
    _templateObject8 = _taggedTemplateLiteral(['<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger" onclick="', '"><i class="fa fa-trash"></i></button>'], ['<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger" onclick="', '"><i class="fa fa-trash"></i></button>']),
    _templateObject9 = _taggedTemplateLiteral(['<li class=', '>\n                                <a href="#" onclick=', '>', '</a>\n                                </li>'], ['<li class=', '>\n                                <a href="#" onclick=', '>', '</a>\n                                </li>']);

var _agregar = require('./agregar');

var _constantes = require('../../../constantes_entorno/constantes');

function _taggedTemplateLiteral(strings, raw) {
    return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));
}

var empty = require('empty-element');
var yo = require('yo-yo');

function Controles(escritura) {
    var controles = yo(_templateObject);
    if (escritura) return controles;else return yo(_templateObject2);
}

function Ver(cajas, paginas, pagina_actual, _escritura, _sucursales) {
    var el = yo(_templateObject3, _escritura ? yo(_templateObject4, function () {
        return (0, _agregar.NuevaCaja)(_escritura, _sucursales, [], []);
    }) : yo(_templateObject5), cajas.map(function (u) {
        return yo(_templateObject6, u.Cod_Caja, u.Des_Caja, u.Cod_Sucursal, u.Cod_UsuarioCajero, u.Cod_CuentaContable, _escritura ? yo(_templateObject7, function () {
            return (0, _agregar.NuevaCaja)(_escritura, _sucursales, [], [], u);
        }) : yo(_templateObject5), _escritura ? yo(_templateObject8, function () {
            return EliminarCaja(_escritura, u);
        }) : yo(_templateObject5));
    }), function () {
        return pagina_actual > 0 ? ListarCajas(_escritura, pagina_actual - 1) : null;
    }, new Array(paginas).fill(0).map(function (p, i) {
        return yo(_templateObject9, pagina_actual == i ? 'active' : '', function () {
            return ListarCajas(_escritura, i);
        }, i + 1);
    }), function () {
        return pagina_actual + 1 < paginas ? ListarCajas(_escritura, pagina_actual + 1) : null;
    });
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
}

function EliminarCaja(_escritura, caja) {

    var btnEliminar = document.getElementById('btnEliminar');
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        var _this = this;

        run_waitMe($('#main-contenido'), 3, "ios");
        var Cod_Caja = caja.Cod_Caja;
        var parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Cod_Caja: Cod_Caja
            })
        };
        fetch(_constantes.URL + '/cajas_api/eliminar_caja', parametros).then(function (req) {
            return req.json();
        }).then(function (res) {

            if (res.respuesta == 'ok') {
                ListarCajas(_escritura);
                _this.removeEventListener('click', EliminarCaja);
            } else {

                _this.removeEventListener('click', EliminarCaja);
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
            $('#main-contenido').waitMe('hide');
        });
    });
}

function ListarCajas(escritura, NumeroPagina) {
    run_waitMe($('#main-contenido'), 3, "ios");
    var _escritura = escritura;
    var parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            TamanoPagina: '20',
            NumeroPagina: NumeroPagina || '0',
            ScripOrden: ' ORDER BY Cod_Caja desc',
            ScripWhere: ''
        })
    };
    fetch(_constantes.URL + '/cajas_api/get_cajas', parametros).then(function (req) {
        return req.json();
    }).then(function (res) {
        if (res.respuesta == 'ok') {

            var paginas = parseInt(res.data.num_filas[0].NroFilas);

            paginas = parseInt(paginas / 20) + (paginas % 20 != 0 ? 1 : 0);

            var _sucursales = res.data.sucursales;

            Ver(res.data.cajas, paginas, NumeroPagina || 0, _escritura, _sucursales);
        } else Ver([]);

        $('#main-contenido').waitMe('hide');
    }).catch(function (e) {
        console.log(e);
        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
        $('#main-contenido').waitMe('hide');
    });
}

exports.ListarCajas = ListarCajas;

},{"../../../constantes_entorno/constantes":344,"./agregar":348,"empty-element":331,"yo-yo":342}],350:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ListarEmpresa = undefined;

var _templateObject = _taggedTemplateLiteral(['\n    <div>\n        <section class="content-header">\n        <div class="modal modal-danger fade" id="modal-danger" style="display: none;">\n        <div class="modal-dialog">\n          <div class="modal-content">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                <span aria-hidden="true">\xD7</span></button>\n              <h4 class="modal-title">\xBFEsta seguro que desea guardar esta informacion?</h4>\n            </div>\n            <div class="modal-body">\n              <p>Continuar de todas maneras?</p>\n            </div>\n            <div class="modal-footer">\n              <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>\n              <button type="button" class="btn btn-success" id="btnEliminar" data-dismiss="modal">Si, Guardar</button>\n            </div>\n          </div>\n          <!-- /.modal-content -->\n        </div>\n        <!-- /.modal-dialog -->\n      </div>\n            <h1>\n                Empresa\n                <small>Control de empresa</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li class="active">Empresa</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                    <header>Datos de Empresa</header>\n                </div>\n                <div class="card-body">\n                    <div class="row">\n                        <div class="col-sm-6">\n                            <div class="form-group">\n                                <label for="Cod_Empresa">RUC Empresa</label>\n                                <input type="number" class="form-control" id="Cod_Empresa" placeholder="Ingrese RUC" value="', '" >\n                                <div class="form-control-line"></div>\n                            </div>\n                        </div>\n                        <div class="col-sm-6">\n                            <div class="form-group">\n                                <label for="RazonSocial">Razon Social</label>\n                                <input type="text" style="text-transform:uppercase" class="form-control" id="RazonSocial" placeholder="Ingrese Razon Social" value="', '">\n                                <div class="form-control-line"></div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="row">\n                        <div class="col-sm-6">\n                            <div class="form-group">\n                                <label for="Nom_Comercial">Nombre Comercial</label>\n                                <input type="text" class="form-control" id="Nom_Comercial" placeholder="Ingrese Nombre Comercial" value="', '" >\n                                <div class="form-control-line"></div>\n                            </div>\n                        </div>\n                        <div class="col-sm-6">\n                            <div class="form-group">\n                                <label for="Direccion">Direccion Fiscal</label>\n                                <textarea type="text" style="text-transform:uppercase" class="form-control" id="Direccion" placeholder="Ingrese Direccion Fiscal">', '</textarea>\n                                <div class="form-control-line"></div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="row">\n                        <div class="col-sm-6">\n                            <div class="form-group">\n                                <label for="Telefonos">Telefono(s)</label>\n                                <input type="text" class="form-control" id="Telefonos" value="', '">\n                                <div class="form-control-line"></div>\n                            </div>\n                        </div>\n                        <div class="col-sm-6">\n                            <div class="form-group">\n                                <label for="Web">Pagina Web</label>\n                                <input type="text" class="form-control" id="Web" value="', '">\n                                <div class="form-control-line"></div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="row">\n                        <div class="col-sm-6">\n                            <div class="form-group">\n                                <label for="Version">Version</label>\n                                <input type="text" class="form-control" id="Version" value="', '">\n                                <div class="form-control-line"></div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="row">\n                        <div class="col-sm-12">\n                            <div class="nav-tabs-custom">\n                                <ul class="nav nav-tabs">\n                                    <li class="active">\n                                        <a href="#tab_1" data-toggle="tab" aria-expanded="true">\n                                            <i class="fa fa-file"></i> Impuestos</a>\n                                    </li>\n                                </ul>\n                                <div class="tab-content">\n                                    <div class="tab-pane active" id="tab_1">\n                                        <div class="row">\n                                            <div class="col-sm-6">\n                                                <div class="form-group">\n                                                    <label for="Des_Impuesto">Descripcion del Impuesto</label>\n                                                    <input type="text" class="form-control" id="Des_Impuesto" value="', '">\n                                                    <div class="form-control-line"></div>\n                                                </div>\n                                            </div>\n                                            <div class="col-sm-6">\n                                                <div class="form-group">\n                                                    <label for="Por_Impuesto">Porcentaje del Impuesto</label>\n                                                    <input type="number" class="form-control" id="Por_Impuesto" value="', '">\n                                                    <div class="form-control-line"></div>\n                                                </div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n                                <!-- /.tab-content -->\n                            </div>\n                        </div>\n                    \n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>'], ['\n    <div>\n        <section class="content-header">\n        <div class="modal modal-danger fade" id="modal-danger" style="display: none;">\n        <div class="modal-dialog">\n          <div class="modal-content">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                <span aria-hidden="true">\xD7</span></button>\n              <h4 class="modal-title">\xBFEsta seguro que desea guardar esta informacion?</h4>\n            </div>\n            <div class="modal-body">\n              <p>Continuar de todas maneras?</p>\n            </div>\n            <div class="modal-footer">\n              <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>\n              <button type="button" class="btn btn-success" id="btnEliminar" data-dismiss="modal">Si, Guardar</button>\n            </div>\n          </div>\n          <!-- /.modal-content -->\n        </div>\n        <!-- /.modal-dialog -->\n      </div>\n            <h1>\n                Empresa\n                <small>Control de empresa</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li class="active">Empresa</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                    <header>Datos de Empresa</header>\n                </div>\n                <div class="card-body">\n                    <div class="row">\n                        <div class="col-sm-6">\n                            <div class="form-group">\n                                <label for="Cod_Empresa">RUC Empresa</label>\n                                <input type="number" class="form-control" id="Cod_Empresa" placeholder="Ingrese RUC" value="', '" >\n                                <div class="form-control-line"></div>\n                            </div>\n                        </div>\n                        <div class="col-sm-6">\n                            <div class="form-group">\n                                <label for="RazonSocial">Razon Social</label>\n                                <input type="text" style="text-transform:uppercase" class="form-control" id="RazonSocial" placeholder="Ingrese Razon Social" value="', '">\n                                <div class="form-control-line"></div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="row">\n                        <div class="col-sm-6">\n                            <div class="form-group">\n                                <label for="Nom_Comercial">Nombre Comercial</label>\n                                <input type="text" class="form-control" id="Nom_Comercial" placeholder="Ingrese Nombre Comercial" value="', '" >\n                                <div class="form-control-line"></div>\n                            </div>\n                        </div>\n                        <div class="col-sm-6">\n                            <div class="form-group">\n                                <label for="Direccion">Direccion Fiscal</label>\n                                <textarea type="text" style="text-transform:uppercase" class="form-control" id="Direccion" placeholder="Ingrese Direccion Fiscal">', '</textarea>\n                                <div class="form-control-line"></div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="row">\n                        <div class="col-sm-6">\n                            <div class="form-group">\n                                <label for="Telefonos">Telefono(s)</label>\n                                <input type="text" class="form-control" id="Telefonos" value="', '">\n                                <div class="form-control-line"></div>\n                            </div>\n                        </div>\n                        <div class="col-sm-6">\n                            <div class="form-group">\n                                <label for="Web">Pagina Web</label>\n                                <input type="text" class="form-control" id="Web" value="', '">\n                                <div class="form-control-line"></div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="row">\n                        <div class="col-sm-6">\n                            <div class="form-group">\n                                <label for="Version">Version</label>\n                                <input type="text" class="form-control" id="Version" value="', '">\n                                <div class="form-control-line"></div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="row">\n                        <div class="col-sm-12">\n                            <div class="nav-tabs-custom">\n                                <ul class="nav nav-tabs">\n                                    <li class="active">\n                                        <a href="#tab_1" data-toggle="tab" aria-expanded="true">\n                                            <i class="fa fa-file"></i> Impuestos</a>\n                                    </li>\n                                </ul>\n                                <div class="tab-content">\n                                    <div class="tab-pane active" id="tab_1">\n                                        <div class="row">\n                                            <div class="col-sm-6">\n                                                <div class="form-group">\n                                                    <label for="Des_Impuesto">Descripcion del Impuesto</label>\n                                                    <input type="text" class="form-control" id="Des_Impuesto" value="', '">\n                                                    <div class="form-control-line"></div>\n                                                </div>\n                                            </div>\n                                            <div class="col-sm-6">\n                                                <div class="form-group">\n                                                    <label for="Por_Impuesto">Porcentaje del Impuesto</label>\n                                                    <input type="number" class="form-control" id="Por_Impuesto" value="', '">\n                                                    <div class="form-control-line"></div>\n                                                </div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n                                <!-- /.tab-content -->\n                            </div>\n                        </div>\n                    \n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>']);

var _constantes = require('../../../constantes_entorno/constantes');

function _taggedTemplateLiteral(strings, raw) {
    return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));
}

var empty = require('empty-element');
var yo = require('yo-yo');

function Ver(empresa, _escritura) {
    var el = yo(_templateObject, empresa ? empresa.Cod_Empresa : '', empresa ? empresa.RazonSocial : '', empresa ? empresa.Nom_Comercial : '', empresa ? empresa.Direccion : '', empresa ? empresa.Telefonos : '', empresa ? empresa.Web : '', empresa ? empresa.Version : '', empresa ? empresa.Des_Impuesto : '', empresa ? empresa.Por_Impuesto.toFixed(2) : '');
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
}

function GuardarEmpresa(_escritura, usuario) {

    var btnEliminar = document.getElementById('btnEliminar');
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        var _this = this;

        run_waitMe($('#main-contenido'), 1, "ios", "Eliminando empresa...");
        var Cod_Usuarios = usuario.Cod_Usuarios;
        var parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Cod_Usuarios: Cod_Usuarios
            })
        };
        fetch(_constantes.URL + '/usuarios_api/eliminar_usuario', parametros).then(function (req) {
            return req.json();
        }).then(function (res) {

            if (res.respuesta == 'ok') {
                Listar(_escritura);
                _this.removeEventListener('click', Eliminar);
            } else {

                console.log('Error');
                _this.removeEventListener('click', Eliminar);
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
            $('#main-contenido').waitMe('hide');
        });
    });
}

function ListarEmpresa(escritura) {
    run_waitMe($('#main-contenido'), 1, "ios");
    var _escritura = escritura;
    var parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    };
    fetch(_constantes.URL + '/empresa_api/get_unica_empresa', parametros).then(function (req) {
        return req.json();
    }).then(function (res) {

        if (res.respuesta == 'ok') {
            var parametros2 = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Cod_Empresa: res.data.empresa[0].Cod_Empresa
                })
            };
            fetch(_constantes.URL + '/empresa_api/get_empresa', parametros2).then(function (req) {
                return req.json();
            }).then(function (res) {
                if (res.respuesta == 'ok') {
                    Ver(res.data.empresa_actual[0], _escritura);
                } else Ver(undefined);
                $('#main-contenido').waitMe('hide');
            }).catch(function (e) {
                console.log(e);
                toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
                $('#main-contenido').waitMe('hide');
            });
        } else Ver(undefined);
        $('#main-contenido').waitMe('hide');
    }).catch(function (e) {
        console.log(e);
        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
        $('#main-contenido').waitMe('hide');
    });
}

exports.ListarEmpresa = ListarEmpresa;

},{"../../../constantes_entorno/constantes":344,"empty-element":331,"yo-yo":342}],351:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n    <div>\n        <section class="content-header">\n            <h1>\n                Modulos\n                <small>Control usuarios</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li><a  onclick=', ' href="#">\n                Modulos</a></li>\n                <li class="active">', '</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                    <header>\n\n                        <a onclick=', '\n                        class="btn btn-xs btn-icon-toggle">\n                            <i class="fa fa-arrow-left"></i></a>\n                        ', ' Modulo\n                    </header>\n                \n                </div> \n                <div class="card-body">\n                    <div class="panel">\n                        \n                        <form role="form">\n                            <div class="panel-body">\n                                <div class="row">\n                                    <div class="alert alert-callout alert-danger hidden" id="divErrors">\n                                        <p>Es necesario llenar todos los campos requeridos marcados con rojo</p>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    ', '\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Des_Modulo">Descripcion del modulo *</label>\n                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Des_Modulo" placeholder="Ejem: Modulo de Personal" value="', '">\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Padre_Modulo">Modulo Padre</label>\n                                            <select id="Padre_Modulo" class="form-control"><option value=null ></option>\n\n                                                ', '\n                                            </select>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                            <!-- /.box-body -->\n                \n                            \n                        </form>\n                        <div class="card-actionbar">\n                                <button onclick="', '" class="btn btn-primary">Guardar</button>\n                            </div>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>'], ['\n    <div>\n        <section class="content-header">\n            <h1>\n                Modulos\n                <small>Control usuarios</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li><a  onclick=', ' href="#">\n                Modulos</a></li>\n                <li class="active">', '</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                    <header>\n\n                        <a onclick=', '\n                        class="btn btn-xs btn-icon-toggle">\n                            <i class="fa fa-arrow-left"></i></a>\n                        ', ' Modulo\n                    </header>\n                \n                </div> \n                <div class="card-body">\n                    <div class="panel">\n                        \n                        <form role="form">\n                            <div class="panel-body">\n                                <div class="row">\n                                    <div class="alert alert-callout alert-danger hidden" id="divErrors">\n                                        <p>Es necesario llenar todos los campos requeridos marcados con rojo</p>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    ', '\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Des_Modulo">Descripcion del modulo *</label>\n                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Des_Modulo" placeholder="Ejem: Modulo de Personal" value="', '">\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Padre_Modulo">Modulo Padre</label>\n                                            <select id="Padre_Modulo" class="form-control"><option value=null ></option>\n\n                                                ', '\n                                            </select>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                            <!-- /.box-body -->\n                \n                            \n                        </form>\n                        <div class="card-actionbar">\n                                <button onclick="', '" class="btn btn-primary">Guardar</button>\n                            </div>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>']),
    _templateObject2 = _taggedTemplateLiteral([''], ['']),
    _templateObject3 = _taggedTemplateLiteral(['<div class="col-sm-6">\n                                    <div class="form-group">\n                                        <label for="Cod_Modulo">Codigo de Modulo *</label>\n                                        <input type="text" style="text-transform:uppercase" class="form-control required" id="Cod_Modulo" placeholder="Ejem: 01.01.001" >\n                                    </div>\n                                </div>'], ['<div class="col-sm-6">\n                                    <div class="form-group">\n                                        <label for="Cod_Modulo">Codigo de Modulo *</label>\n                                        <input type="text" style="text-transform:uppercase" class="form-control required" id="Cod_Modulo" placeholder="Ejem: 01.01.001" >\n                                    </div>\n                                </div>']),
    _templateObject4 = _taggedTemplateLiteral(['<option style="text-transform:uppercase" value="', '" ', '>', '</option>'], ['<option style="text-transform:uppercase" value="', '" ', '>', '</option>']);

var _listar = require('./listar');

var _constantes = require('../../../constantes_entorno/constantes');

function _taggedTemplateLiteral(strings, raw) {
    return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));
}

var empty = require('empty-element');
var yo = require('yo-yo');

module.exports = function NuevoModulo(_escritura, raices, modulo) {

    var el = yo(_templateObject, function () {
        return (0, _listar.ListarModulos)(_escritura);
    }, modulo ? 'Editar' : 'Nuevo', function () {
        return (0, _listar.ListarModulos)(_escritura);
    }, modulo ? 'Editar' : 'Nuevo', modulo ? yo(_templateObject2) : yo(_templateObject3), modulo ? modulo.Des_Modulo : '', raices.map(function (e) {
        return yo(_templateObject4, e.Cod_Modulo, modulo ? modulo.Padre_Modulo == e.Cod_Modulo ? 'selected' : '' : '', e.Cod_Modulo + ' ' + e.Des_Modulo);
    }), function () {
        return Guardar(_escritura, modulo);
    });
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
};

function Guardar(_escritura, modulo) {
    if (ValidacionCampos()) {
        run_waitMe($('#main-contenido'), 1, "ios", "Guardando modulos...");
        var Cod_Modulo = modulo ? modulo.Cod_Modulo : document.getElementById('Cod_Modulo').value.toUpperCase();
        var Des_Modulo = document.getElementById('Des_Modulo').value.toUpperCase();
        var Padre_Modulo = document.getElementById('Padre_Modulo').value;
        var Cod_Usuario = 'ADMINISTRADOR';

        var parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Cod_Modulo: Cod_Modulo,
                Des_Modulo: Des_Modulo,
                Padre_Modulo: Padre_Modulo,
                Cod_Usuario: Cod_Usuario
            })
        };
        fetch(_constantes.URL + '/modulos_api/guardar_modulo', parametros).then(function (req) {
            return req.json();
        }).then(function (res) {
            if (res.respuesta == 'ok') {
                (0, _listar.ListarModulos)(_escritura);
            } else {
                console.log('Error');
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
            $('#main-contenido').waitMe('hide');
        });
    }
}

},{"../../../constantes_entorno/constantes":344,"./listar":352,"empty-element":331,"yo-yo":342}],352:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ListarModulos = undefined;

var _templateObject = _taggedTemplateLiteral(['\n    <div>\n        <section class="content-header">\n        <div class="modal modal-danger fade" id="modal-danger" style="display: none;">\n        <div class="modal-dialog">\n          <div class="modal-content">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                <span aria-hidden="true">\xD7</span></button>\n              <h4 class="modal-title">\xBFEsta seguro que desea eliminar este modulo?</h4>\n            </div>\n            <div class="modal-body">\n              <p>Al eliminar el modulo no podra recuperarlo. Desea continuar de todas maneras?</p>\n            </div>\n            <div class="modal-footer">\n              <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>\n              <button type="button" class="btn btn-success" id="btnEliminar" data-dismiss="modal">Si,Eliminar</button>\n            </div>\n          </div>\n          <!-- /.modal-content -->\n        </div>\n        <!-- /.modal-dialog -->\n      </div>\n            <h1>\n                Modulos\n                <small>Control modulos</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li class="active">Modulos</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                <header>Lista de Modulos</header>\n                    <div class="tools">\n                        <div class="btn-group">\n                        ', '\n                        </div>\n                    </div>\n                </div> \n                <div class="card-body">\n                    <div class="table-responsive">\n                    <table id="example1" class="table table-bordered table-striped">\n                        <thead>\n                            <tr>\n                                <th>Codigo</th>\n                                <th>Descripcion</th>\n                                <th>Padre</th>\n                                <th>Acciones</th>\n                            </tr>\n                        </thead>\n                        <tbody>\n                            ', '\n                        </tbody>\n    \n                    </table>\n                    </div>\n                    <div class="card-actionbar">\n                        <ul class="pagination pagination-sm no-margin pull-right">\n                            <li>\n                                <a href="#" onclick=', '>\xAB</a>\n                            </li>\n                            ', '\n                        \n                            <li>\n                                <a href="#" onclick=', '>\xBB</a>\n                            </li>\n                        </ul>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>'], ['\n    <div>\n        <section class="content-header">\n        <div class="modal modal-danger fade" id="modal-danger" style="display: none;">\n        <div class="modal-dialog">\n          <div class="modal-content">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                <span aria-hidden="true">\xD7</span></button>\n              <h4 class="modal-title">\xBFEsta seguro que desea eliminar este modulo?</h4>\n            </div>\n            <div class="modal-body">\n              <p>Al eliminar el modulo no podra recuperarlo. Desea continuar de todas maneras?</p>\n            </div>\n            <div class="modal-footer">\n              <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>\n              <button type="button" class="btn btn-success" id="btnEliminar" data-dismiss="modal">Si,Eliminar</button>\n            </div>\n          </div>\n          <!-- /.modal-content -->\n        </div>\n        <!-- /.modal-dialog -->\n      </div>\n            <h1>\n                Modulos\n                <small>Control modulos</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li class="active">Modulos</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                <header>Lista de Modulos</header>\n                    <div class="tools">\n                        <div class="btn-group">\n                        ', '\n                        </div>\n                    </div>\n                </div> \n                <div class="card-body">\n                    <div class="table-responsive">\n                    <table id="example1" class="table table-bordered table-striped">\n                        <thead>\n                            <tr>\n                                <th>Codigo</th>\n                                <th>Descripcion</th>\n                                <th>Padre</th>\n                                <th>Acciones</th>\n                            </tr>\n                        </thead>\n                        <tbody>\n                            ', '\n                        </tbody>\n    \n                    </table>\n                    </div>\n                    <div class="card-actionbar">\n                        <ul class="pagination pagination-sm no-margin pull-right">\n                            <li>\n                                <a href="#" onclick=', '>\xAB</a>\n                            </li>\n                            ', '\n                        \n                            <li>\n                                <a href="#" onclick=', '>\xBB</a>\n                            </li>\n                        </ul>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>']),
    _templateObject2 = _taggedTemplateLiteral(['<a onclick=', ' class="btn btn-info pull-right">\n                            <i class="fa fa-plus"></i> Nuevo Modulo</a>'], ['<a onclick=', ' class="btn btn-info pull-right">\n                            <i class="fa fa-plus"></i> Nuevo Modulo</a>']),
    _templateObject3 = _taggedTemplateLiteral([''], ['']),
    _templateObject4 = _taggedTemplateLiteral(['\n                            <tr>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>\n                                    ', '\n                                    ', '\n                                    \n                                </td>\n                            </tr>'], ['\n                            <tr>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>\n                                    ', '\n                                    ', '\n                                    \n                                </td>\n                            </tr>']),
    _templateObject5 = _taggedTemplateLiteral(['<button class="btn btn-xs btn-success" onclick="', '"><i class="fa fa-edit"></i></button>'], ['<button class="btn btn-xs btn-success" onclick="', '"><i class="fa fa-edit"></i></button>']),
    _templateObject6 = _taggedTemplateLiteral(['<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger" onclick="', '"><i class="fa fa-trash"></i></button>'], ['<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger" onclick="', '"><i class="fa fa-trash"></i></button>']),
    _templateObject7 = _taggedTemplateLiteral(['<li class=', '>\n                            <a href="#" onclick=', ' >', '</a>\n                            </li>'], ['<li class=', '>\n                            <a href="#" onclick=', ' >', '</a>\n                            </li>']);

var _constantes = require('../../../constantes_entorno/constantes');

function _taggedTemplateLiteral(strings, raw) {
    return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));
}

var empty = require('empty-element');
var yo = require('yo-yo');
var NuevoModulo = require('./agregar.js');

function Ver(modulos, paginas, pagina_actual, _escritura, raices) {
    var el = yo(_templateObject, _escritura ? yo(_templateObject2, function () {
        return NuevoModulo(_escritura, raices);
    }) : yo(_templateObject3), modulos.map(function (u) {
        return yo(_templateObject4, u.Cod_Modulo, u.Des_Modulo, u.Padre_Modulo, _escritura ? yo(_templateObject5, function () {
            return NuevoModulo(_escritura, raices, u);
        }) : yo(_templateObject3), _escritura ? yo(_templateObject6, function () {
            return Eliminar(_escritura, u);
        }) : yo(_templateObject3));
    }), function () {
        return pagina_actual > 0 ? ListarModulos(_escritura, pagina_actual - 1) : null;
    }, new Array(paginas).fill(0).map(function (p, i) {
        return yo(_templateObject7, pagina_actual == i ? 'active' : '', function () {
            return ListarModulos(_escritura, i);
        }, i + 1);
    }), function () {
        return pagina_actual + 1 < paginas ? ListarModulos(_escritura, pagina_actual + 1) : null;
    });
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
}

function Eliminar(_escritura, modulo) {

    var btnEliminar = document.getElementById('btnEliminar');
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        var _this = this;

        run_waitMe($('#main-contenido'), 1, "ios", "Eliminando modulo...");
        var Cod_Modulo = modulo.Cod_Modulo;
        var parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Cod_Modulo: Cod_Modulo
            })
        };
        fetch(_constantes.URL + '/modulos_api/eliminar_modulo', parametros).then(function (req) {
            return req.json();
        }).then(function (res) {

            if (res.respuesta == 'ok') {
                ListarModulos(_escritura);
                _this.removeEventListener('click', Eliminar);
            } else {
                console.log('Error');
                _this.removeEventListener('click', Eliminar);
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
            $('#main-contenido').waitMe('hide');
        });
    });
}

function ListarModulos(escritura, NumeroPagina) {
    run_waitMe($('#main-contenido'), 1, "ios");
    var _escritura = escritura;
    var parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            TamanoPagina: '20',
            NumeroPagina: NumeroPagina || '0',
            ScripOrden: ' ORDER BY Padre_Modulo asc',
            ScripWhere: ''
        })
    };
    fetch(_constantes.URL + '/modulos_api/get_modulos', parametros).then(function (req) {
        return req.json();
    }).then(function (res) {
        if (res.respuesta == 'ok') {
            var paginas = parseInt(res.data.num_filas[0].NroFilas);

            paginas = parseInt(paginas / 20) + (paginas % 20 != 0 ? 1 : 0);

            var raices = res.data.raices;

            Ver(res.data.modulos, paginas, NumeroPagina || 0, _escritura, raices);
        } else Ver([]);
        $('#main-contenido').waitMe('hide');
    }).catch(function (e) {
        console.log(e);
        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
        $('#main-contenido').waitMe('hide');
    });
}

exports.ListarModulos = ListarModulos;

},{"../../../constantes_entorno/constantes":344,"./agregar.js":351,"empty-element":331,"yo-yo":342}],353:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n    <div>\n        <section class="content-header">\n            <h1>\n                Perfiles\n                <small>Control perfiles</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li><a  onclick=', ' href="#">\n                Perfiles</a></li>\n                <li class="active">', '</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                    <header>\n                        <a onclick=', '\n                        class="btn btn-xs btn-icon-toggle"><i class="fa fa-arrow-left"></i></a>\n                        ', ' Perfil\n                    </header>\n                </div>\n                \n                <div class="card-body">\n                    <div class="panel">\n                        \n                        <!-- form start -->\n                        <form role="form">\n                            <div class="panel-body">\n                                \n                            </div>\n                            <!-- /.box-body -->\n                \n                            \n                        </form>\n                        <div class="card-actionbar">\n                                <button onclick="', '" class="btn btn-primary">Guardar</button>\n                            </div>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>'], ['\n    <div>\n        <section class="content-header">\n            <h1>\n                Perfiles\n                <small>Control perfiles</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li><a  onclick=', ' href="#">\n                Perfiles</a></li>\n                <li class="active">', '</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                    <header>\n                        <a onclick=', '\n                        class="btn btn-xs btn-icon-toggle"><i class="fa fa-arrow-left"></i></a>\n                        ', ' Perfil\n                    </header>\n                </div>\n                \n                <div class="card-body">\n                    <div class="panel">\n                        \n                        <!-- form start -->\n                        <form role="form">\n                            <div class="panel-body">\n                                \n                            </div>\n                            <!-- /.box-body -->\n                \n                            \n                        </form>\n                        <div class="card-actionbar">\n                                <button onclick="', '" class="btn btn-primary">Guardar</button>\n                            </div>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>']),
    _templateObject2 = _taggedTemplateLiteral(['<table id="example1" class="table table-bordered table-striped">\n    <thead>\n        <tr>\n            <th>Codigo</th>\n            <th>Nombre</th>\n            <th>Accion</th>\n        </tr>\n    </thead>\n    <tbody>\n        ', '\n    </tbody>\n\n</table>'], ['<table id="example1" class="table table-bordered table-striped">\n    <thead>\n        <tr>\n            <th>Codigo</th>\n            <th>Nombre</th>\n            <th>Accion</th>\n        </tr>\n    </thead>\n    <tbody>\n        ', '\n    </tbody>\n\n</table>']),
    _templateObject3 = _taggedTemplateLiteral(['\n        <tr>\n            <td>', '</td>\n            <td>', '</td>\n            <td><button class="btn btn-xs btn-primary" data-dismiss="modal" onclick="', '"><i class="fa fa-check"></i> Elegir</button></td>\n        </tr>'], ['\n        <tr>\n            <td>', '</td>\n            <td>', '</td>\n            <td><button class="btn btn-xs btn-primary" data-dismiss="modal" onclick="', '"><i class="fa fa-check"></i> Elegir</button></td>\n        </tr>']);

var _listar = require('./listar');

var _constantes = require('../../../constantes_entorno/constantes');

function _taggedTemplateLiteral(strings, raw) {
    return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));
}

var empty = require('empty-element');
var yo = require('yo-yo');

module.exports = function NuevoPerfil(_escritura, modulos, perfil) {

    var el = yo(_templateObject, function () {
        return (0, _listar.ListarParametros)(_escritura);
    }, perfil ? 'Editar' : 'Nuevo', function () {
        return (0, _listar.ListarParametros)(_escritura);
    }, perfil ? 'Editar' : 'Nuevo', function () {
        return Guardar(_escritura, sucursal);
    });
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
};
function BusquedaDeUsuario() {
    var txtBuscarUsuario = document.getElementById("txtBuscarUsuario").value;
    if (txtBuscarUsuario.length >= 4) {
        var parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                TamanoPagina: '20',
                NumeroPagina: '0',
                ScripOrden: ' ORDER BY Cod_Usuarios asc',
                ScripWhere: txtBuscarUsuario
            })
        };
        fetch(_constantes.URL + '/cajas_api/buscar_usuarios', parametros).then(function (req) {
            return req.json();
        }).then(function (res) {
            if (res.respuesta == 'ok') {
                var usuarios = res.data.usuarios;
                if (usuarios.length > 0) AgregarTabla(usuarios);else empty(document.getElementById('contenedorTablaUsuarios'));
            } else empty(document.getElementById('contenedorTablaUsuarios'));
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            $('#main-contenido').waitMe('hide');
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
        });
    } else {
        empty(document.getElementById('contenedorTablaUsuarios'));
    }
}
function AgregarTabla(usuarios) {
    var el = yo(_templateObject2, usuarios.map(function (u) {
        return yo(_templateObject3, u.Cod_Usuarios, u.Nick, function () {
            return SeleccionarUsuario(u);
        });
    }));
    empty(document.getElementById('contenedorTablaUsuarios')).appendChild(el);
}
function SeleccionarUsuario(usuario) {
    var Cod_Usuario = document.getElementById('Cod_UsuarioAdm');
    Cod_Usuario.value = usuario.Cod_Usuarios + " - " + usuario.Nick;
}

function Guardar(_escritura, sucursal) {
    //console.log(document.getElementById('Cod_Usuarios').value.toUpperCase())
    run_waitMe($('#main-contenido'), 1, "ios", "Guardando parametro");
    var Cod_Sucursal = sucursal ? sucursal.Cod_Sucursal : document.getElementById('Cod_Sucursal').value.toUpperCase();
    var Nom_Sucursal = document.getElementById('Nom_Sucursal').value.toUpperCase();
    var Dir_Sucursal = document.getElementById('Dir_Sucursal').value.toUpperCase();
    var Por_UtilidadMax = document.getElementById('Por_UtilidadMax').value;
    var Por_UtilidadMin = document.getElementById('Por_UtilidadMin').value;
    var Cod_UsuarioAdm = document.getElementById('Cod_UsuarioAdm').value.split(' - ')[0];
    var Cabecera_Pagina = document.getElementById('Cabecera_Pagina').value;
    var Pie_Pagina = document.getElementById('Pie_Pagina').value;
    var Flag_Activo = document.getElementById('Flag_Activo').checked;
    var Cod_Ubigeo = null;
    var Cod_Usuario = 'ADMINISTRADOR';

    var parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Cod_Sucursal: Cod_Sucursal,
            Nom_Sucursal: Nom_Sucursal,
            Dir_Sucursal: Dir_Sucursal,
            Por_UtilidadMax: Por_UtilidadMax,
            Por_UtilidadMin: Por_UtilidadMin,
            Cod_UsuarioAdm: Cod_UsuarioAdm,
            Cabecera_Pagina: Cabecera_Pagina,
            Pie_Pagina: Pie_Pagina,
            Flag_Activo: Flag_Activo,
            Cod_Ubigeo: Cod_Ubigeo,
            Cod_Usuario: Cod_Usuario
        })
    };
    fetch(_constantes.URL + '/sucursales_api/guardar_sucursal', parametros).then(function (req) {
        return req.json();
    }).then(function (res) {
        if (res.respuesta == 'ok') {
            ListarPerfiles(_escritura);
        } else {
            console.log('Error');
        }
        $('#main-contenido').waitMe('hide');
    }).catch(function (e) {
        console.log(e);
        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
        $('#main-contenido').waitMe('hide');
    });
}

},{"../../../constantes_entorno/constantes":344,"./listar":354,"empty-element":331,"yo-yo":342}],354:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ListarParametros = undefined;

var _templateObject = _taggedTemplateLiteral(['\n    <div>\n        <section class="content-header">\n        <div class="modal modal-danger fade" id="modal-danger" style="display: none;">\n        <div class="modal-dialog">\n          <div class="modal-content">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                <span aria-hidden="true">\xD7</span></button>\n              <h4 class="modal-title">\xBFEsta seguro que desea eliminar este parametro?</h4>\n            </div>\n            <div class="modal-body">\n              <p>Al eliminar este parametro no podra recuperarlo. Desea continuar de todas maneras?</p>\n            </div>\n            <div class="modal-footer">\n              <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>\n              <button type="button" class="btn btn-success" id="btnEliminar" data-dismiss="modal">Si, Eliminar</button>\n            </div>\n          </div>\n          <!-- /.modal-content -->\n        </div>\n        <!-- /.modal-dialog -->\n      </div>\n            <h1>\n                Parametros\n                <small>Control parametros</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li class="active">Parametros</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                    <header>Lista de Parametros</header>\n                    \n                </div>\n                \n                <div class="card-body">\n                    <div class="table-responsive">\n                    <table id="example1" class="table table-bordered table-striped">\n                        <thead>\n                            <tr>\n                                <th>Codigo</th>\n                                <th>Tabla</th>\n                                <th>Descripcion</th>\n                                <th>Sistema</th>\n                                <th>Acceso</th>\n                                <th>Acciones</th>\n                            </tr>\n                        </thead>\n                        <tbody>\n                            ', '\n                        </tbody>\n    \n                    </table>\n                    </div>\n                    <div class="card-actionbar clearfix">\n                        <ul class="pagination pagination-sm no-margin pull-right">\n                            <li>\n                                <a href="#" onclick=', '>\xAB</a>\n                            </li>\n                            ', '\n                        \n                            <li>\n                                <a href="#" onclick=', '>\xBB</a>\n                            </li>\n                        </ul>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>'], ['\n    <div>\n        <section class="content-header">\n        <div class="modal modal-danger fade" id="modal-danger" style="display: none;">\n        <div class="modal-dialog">\n          <div class="modal-content">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                <span aria-hidden="true">\xD7</span></button>\n              <h4 class="modal-title">\xBFEsta seguro que desea eliminar este parametro?</h4>\n            </div>\n            <div class="modal-body">\n              <p>Al eliminar este parametro no podra recuperarlo. Desea continuar de todas maneras?</p>\n            </div>\n            <div class="modal-footer">\n              <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>\n              <button type="button" class="btn btn-success" id="btnEliminar" data-dismiss="modal">Si, Eliminar</button>\n            </div>\n          </div>\n          <!-- /.modal-content -->\n        </div>\n        <!-- /.modal-dialog -->\n      </div>\n            <h1>\n                Parametros\n                <small>Control parametros</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li class="active">Parametros</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                    <header>Lista de Parametros</header>\n                    \n                </div>\n                \n                <div class="card-body">\n                    <div class="table-responsive">\n                    <table id="example1" class="table table-bordered table-striped">\n                        <thead>\n                            <tr>\n                                <th>Codigo</th>\n                                <th>Tabla</th>\n                                <th>Descripcion</th>\n                                <th>Sistema</th>\n                                <th>Acceso</th>\n                                <th>Acciones</th>\n                            </tr>\n                        </thead>\n                        <tbody>\n                            ', '\n                        </tbody>\n    \n                    </table>\n                    </div>\n                    <div class="card-actionbar clearfix">\n                        <ul class="pagination pagination-sm no-margin pull-right">\n                            <li>\n                                <a href="#" onclick=', '>\xAB</a>\n                            </li>\n                            ', '\n                        \n                            <li>\n                                <a href="#" onclick=', '>\xBB</a>\n                            </li>\n                        </ul>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>']),
    _templateObject2 = _taggedTemplateLiteral(['\n                            <tr>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>\n                                    ', '\n                                    ', '\n                                    \n                                </td>\n                            </tr>'], ['\n                            <tr>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>\n                                    ', '\n                                    ', '\n                                    \n                                </td>\n                            </tr>']),
    _templateObject3 = _taggedTemplateLiteral(['<button class="btn btn-xs btn-success" onclick="', '"><i class="fa fa-edit"></i></button>'], ['<button class="btn btn-xs btn-success" onclick="', '"><i class="fa fa-edit"></i></button>']),
    _templateObject4 = _taggedTemplateLiteral([''], ['']),
    _templateObject5 = _taggedTemplateLiteral(['<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger" onclick="', '"><i class="fa fa-trash"></i></button>'], ['<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger" onclick="', '"><i class="fa fa-trash"></i></button>']),
    _templateObject6 = _taggedTemplateLiteral(['<li class=', '>\n                            <a href="#" onclick=', ' >', '</a>\n                            </li>'], ['<li class=', '>\n                            <a href="#" onclick=', ' >', '</a>\n                            </li>']);

var _constantes = require('../../../constantes_entorno/constantes');

function _taggedTemplateLiteral(strings, raw) {
    return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));
}

var empty = require('empty-element');
var yo = require('yo-yo');
var NuevoParametro = require('./agregar.js');

function Ver(parametros, paginas, pagina_actual, _escritura) {
    var el = yo(_templateObject, parametros.map(function (u) {
        return yo(_templateObject2, u.Cod_Tabla, u.Tabla, u.Des_Tabla, u.Cod_Sistema, u.Flag_Acceso, _escritura ? yo(_templateObject3, function () {
            return NuevoParametro(_escritura, u);
        }) : yo(_templateObject4), _escritura ? yo(_templateObject5, function () {
            return Eliminar(_escritura, u);
        }) : yo(_templateObject4));
    }), function () {
        return pagina_actual > 0 ? ListarParametros(_escritura, pagina_actual - 1) : null;
    }, new Array(paginas).fill(0).map(function (p, i) {
        return yo(_templateObject6, pagina_actual == i ? 'active' : '', function () {
            return ListarParametros(_escritura, i);
        }, i + 1);
    }), function () {
        return pagina_actual + 1 < paginas ? ListarParametros(_escritura, pagina_actual + 1) : null;
    });
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
}

function Eliminar(_escritura, sucursal) {

    var btnEliminar = document.getElementById('btnEliminar');
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        var _this = this;

        run_waitMe($('#main-contenido'), 1, "ios", "Eliminando parametro...");
        var Cod_Sucursal = sucursal.Cod_Sucursal;
        var parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Cod_Sucursal: Cod_Sucursal
            })
        };
        fetch(_constantes.URL + '/sucursales_api/eliminar_sucursal', parametros).then(function (req) {
            return req.json();
        }).then(function (res) {

            if (res.respuesta == 'ok') {
                ListarSucursales(_escritura);
                _this.removeEventListener('click', Eliminar);
            } else {
                console.log('Error');
                _this.removeEventListener('click', Eliminar);
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
            $('#main-contenido').waitMe('hide');
        });
    });
}

function ListarParametros(escritura, NumeroPagina) {
    run_waitMe($('#main-contenido'), 1, "ios");
    var _escritura = escritura;
    var parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            TamanoPagina: '20',
            NumeroPagina: NumeroPagina || '0',
            ScripOrden: ' ORDER BY Cod_Tabla desc',
            ScripWhere: ''
        })
    };
    fetch(_constantes.URL + '/parametros_api/get_parametros', parametros).then(function (req) {
        return req.json();
    }).then(function (res) {
        if (res.respuesta == 'ok') {
            var paginas = parseInt(res.data.num_filas[0].NroFilas);

            paginas = parseInt(paginas / 20) + (paginas % 20 != 0 ? 1 : 0);
            Ver(res.data.parametros, paginas, NumeroPagina || 0, _escritura);
        } else Ver([]);
        $('#main-contenido').waitMe('hide');
    }).catch(function (e) {
        console.log(e);
        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
        $('#main-contenido').waitMe('hide');
    });
}

exports.ListarParametros = ListarParametros;

},{"../../../constantes_entorno/constantes":344,"./agregar.js":353,"empty-element":331,"yo-yo":342}],355:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n    <div>\n        <section class="content-header">\n            <h1>\n                Perfiles\n                <small>Control perfiles</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li><a  onclick=', ' href="#">\n                Perfiles</a></li>\n                <li class="active">', '</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                    <header>\n                        <a onclick=', '\n                        class="btn btn-xs btn-icon-toggle">\n                            <i class="fa fa-arrow-left"></i></a>\n                        ', ' Perfil\n                    </header>\n                    \n                </div>\n                <div class="card-body">\n                    <div class="panel">\n                         \n                        <form role="form">\n                            <div class="panel-body">\n                                <div class="row">\n                            \n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            ', '\n                                        </div>\n                                    </div>\n                                </div>\n                            \n                            </div>\n                            <!-- /.box-body -->\n                \n                            \n                        </form>\n                        <div class="card-actionbar">\n                                <button onclick="', '" class="btn btn-primary">Guardar</button>\n                            </div>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>'], ['\n    <div>\n        <section class="content-header">\n            <h1>\n                Perfiles\n                <small>Control perfiles</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li><a  onclick=', ' href="#">\n                Perfiles</a></li>\n                <li class="active">', '</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                    <header>\n                        <a onclick=', '\n                        class="btn btn-xs btn-icon-toggle">\n                            <i class="fa fa-arrow-left"></i></a>\n                        ', ' Perfil\n                    </header>\n                    \n                </div>\n                <div class="card-body">\n                    <div class="panel">\n                         \n                        <form role="form">\n                            <div class="panel-body">\n                                <div class="row">\n                            \n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            ', '\n                                        </div>\n                                    </div>\n                                </div>\n                            \n                            </div>\n                            <!-- /.box-body -->\n                \n                            \n                        </form>\n                        <div class="card-actionbar">\n                                <button onclick="', '" class="btn btn-primary">Guardar</button>\n                            </div>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>']),
    _templateObject2 = _taggedTemplateLiteral(['\n                                            <div class="row">\n                                            <div class="checkbox-inline checkbox-styled checkbox-primary">\n                                                <label>\n                                                    <input type="checkbox" id="', '" checked="1"><span> ', '</span> </label>\n                                            </div>\n                                            </div>\n                                            '], ['\n                                            <div class="row">\n                                            <div class="checkbox-inline checkbox-styled checkbox-primary">\n                                                <label>\n                                                    <input type="checkbox" id="', '" checked="1"><span> ', '</span> </label>\n                                            </div>\n                                            </div>\n                                            ']),
    _templateObject3 = _taggedTemplateLiteral(['<table id="example1" class="table table-bordered table-striped">\n    <thead>\n        <tr>\n            <th>Codigo</th>\n            <th>Nombre</th>\n            <th>Accion</th>\n        </tr>\n    </thead>\n    <tbody>\n        ', '\n    </tbody>\n\n</table>'], ['<table id="example1" class="table table-bordered table-striped">\n    <thead>\n        <tr>\n            <th>Codigo</th>\n            <th>Nombre</th>\n            <th>Accion</th>\n        </tr>\n    </thead>\n    <tbody>\n        ', '\n    </tbody>\n\n</table>']),
    _templateObject4 = _taggedTemplateLiteral(['\n        <tr>\n            <td>', '</td>\n            <td>', '</td>\n            <td><button class="btn btn-xs btn-primary" data-dismiss="modal" onclick="', '"><i class="fa fa-check"></i> Elegir</button></td>\n        </tr>'], ['\n        <tr>\n            <td>', '</td>\n            <td>', '</td>\n            <td><button class="btn btn-xs btn-primary" data-dismiss="modal" onclick="', '"><i class="fa fa-check"></i> Elegir</button></td>\n        </tr>']);

var _listar = require('./listar');

var _constantes = require('../../../constantes_entorno/constantes');

function _taggedTemplateLiteral(strings, raw) {
    return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));
}

var empty = require('empty-element');
var yo = require('yo-yo');

module.exports = function NuevoPerfil(_escritura, modulos, perfil) {

    var el = yo(_templateObject, function () {
        return (0, _listar.ListarPerfiles)(_escritura);
    }, perfil ? 'Editar' : 'Nuevo', function () {
        return (0, _listar.ListarPerfiles)(_escritura);
    }, perfil ? 'Editar' : 'Nuevo', modulos.map(function (e) {
        return yo(_templateObject2, e.Cod_Modulo, e.Cod_Modulo + ' ' + e.Des_Modulo);
    }), function () {
        return Guardar(_escritura, sucursal);
    });
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
};
function BusquedaDeUsuario() {
    var txtBuscarUsuario = document.getElementById("txtBuscarUsuario").value;
    if (txtBuscarUsuario.length >= 4) {
        var parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                TamanoPagina: '20',
                NumeroPagina: '0',
                ScripOrden: ' ORDER BY Cod_Usuarios asc',
                ScripWhere: txtBuscarUsuario
            })
        };
        fetch(_constantes.URL + '/cajas_api/buscar_usuarios', parametros).then(function (req) {
            return req.json();
        }).then(function (res) {
            if (res.respuesta == 'ok') {
                var usuarios = res.data.usuarios;
                if (usuarios.length > 0) AgregarTabla(usuarios);else empty(document.getElementById('contenedorTablaUsuarios'));
            } else empty(document.getElementById('contenedorTablaUsuarios'));
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            $('#main-contenido').waitMe('hide');
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
        });
    } else {
        empty(document.getElementById('contenedorTablaUsuarios'));
    }
}
function AgregarTabla(usuarios) {
    var el = yo(_templateObject3, usuarios.map(function (u) {
        return yo(_templateObject4, u.Cod_Usuarios, u.Nick, function () {
            return SeleccionarUsuario(u);
        });
    }));
    empty(document.getElementById('contenedorTablaUsuarios')).appendChild(el);
}
function SeleccionarUsuario(usuario) {
    var Cod_Usuario = document.getElementById('Cod_UsuarioAdm');
    Cod_Usuario.value = usuario.Cod_Usuarios + " - " + usuario.Nick;
}

function Guardar(_escritura, sucursal) {
    //console.log(document.getElementById('Cod_Usuarios').value.toUpperCase())
    run_waitMe($('#main-contenido'), 1, "ios", "Guardando perfil...");
    var Cod_Sucursal = sucursal ? sucursal.Cod_Sucursal : document.getElementById('Cod_Sucursal').value.toUpperCase();
    var Nom_Sucursal = document.getElementById('Nom_Sucursal').value.toUpperCase();
    var Dir_Sucursal = document.getElementById('Dir_Sucursal').value.toUpperCase();
    var Por_UtilidadMax = document.getElementById('Por_UtilidadMax').value;
    var Por_UtilidadMin = document.getElementById('Por_UtilidadMin').value;
    var Cod_UsuarioAdm = document.getElementById('Cod_UsuarioAdm').value.split(' - ')[0];
    var Cabecera_Pagina = document.getElementById('Cabecera_Pagina').value;
    var Pie_Pagina = document.getElementById('Pie_Pagina').value;
    var Flag_Activo = document.getElementById('Flag_Activo').checked;
    var Cod_Ubigeo = null;
    var Cod_Usuario = 'ADMINISTRADOR';

    var parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Cod_Sucursal: Cod_Sucursal,
            Nom_Sucursal: Nom_Sucursal,
            Dir_Sucursal: Dir_Sucursal,
            Por_UtilidadMax: Por_UtilidadMax,
            Por_UtilidadMin: Por_UtilidadMin,
            Cod_UsuarioAdm: Cod_UsuarioAdm,
            Cabecera_Pagina: Cabecera_Pagina,
            Pie_Pagina: Pie_Pagina,
            Flag_Activo: Flag_Activo,
            Cod_Ubigeo: Cod_Ubigeo,
            Cod_Usuario: Cod_Usuario
        })
    };
    fetch(_constantes.URL + '/sucursales_api/guardar_sucursal', parametros).then(function (req) {
        return req.json();
    }).then(function (res) {
        if (res.respuesta == 'ok') {
            (0, _listar.ListarPerfiles)(_escritura);
        } else {
            console.log('Error');
        }
        $('#main-contenido').waitMe('hide');
    }).catch(function (e) {
        console.log(e);
        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
        $('#main-contenido').waitMe('hide');
    });
}

},{"../../../constantes_entorno/constantes":344,"./listar":356,"empty-element":331,"yo-yo":342}],356:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ListarPerfiles = undefined;

var _templateObject = _taggedTemplateLiteral(['\n    <div>\n        <section class="content-header">\n        <div class="modal modal-danger fade" id="modal-danger" style="display: none;">\n        <div class="modal-dialog">\n          <div class="modal-content">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                <span aria-hidden="true">\xD7</span></button>\n              <h4 class="modal-title">\xBFEsta seguro que desea eliminar este perfil?</h4>\n            </div>\n            <div class="modal-body">\n              <p>Al eliminar el perfil no podra recuperarlo. Desea continuar de todas maneras?</p>\n            </div>\n            <div class="modal-footer">\n              <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>\n              <button type="button" class="btn btn-success" id="btnEliminar" data-dismiss="modal">Si, Eliminar</button>\n            </div>\n          </div>\n          <!-- /.modal-content -->\n        </div>\n        <!-- /.modal-dialog -->\n      </div>\n            <h1>\n                Perfiles\n                <small>Control perfiles</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li class="active">Perfiles</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                    <header>Lista de Perfiles</header>\n                    <div class="tools">\n                        <div class="btn-group">\n                        ', '\n                        </div>\n                    </div>\n                </div> \n                <div class="card-body">\n                    <div class="table-responsive">\n                    <table id="example1" class="table table-bordered table-striped">\n                        <thead>\n                            <tr>\n                                <th>Codigo</th>\n                                <th>Descripcion</th>\n                                <th>Creado</th>\n                                <th>Fecha</th>\n                                <th>Acciones</th>\n                            </tr>\n                        </thead>\n                        <tbody>\n                            ', '\n                        </tbody>\n    \n                    </table>\n                    </div>\n                    <div class="card-actionbar">\n                        <ul class="pagination pagination-sm no-margin pull-right">\n                            <li>\n                                <a href="#" onclick=', '>\xAB</a>\n                            </li>\n                            ', '\n                        \n                            <li>\n                                <a href="#" onclick=', '>\xBB</a>\n                            </li>\n                        </ul>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>'], ['\n    <div>\n        <section class="content-header">\n        <div class="modal modal-danger fade" id="modal-danger" style="display: none;">\n        <div class="modal-dialog">\n          <div class="modal-content">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                <span aria-hidden="true">\xD7</span></button>\n              <h4 class="modal-title">\xBFEsta seguro que desea eliminar este perfil?</h4>\n            </div>\n            <div class="modal-body">\n              <p>Al eliminar el perfil no podra recuperarlo. Desea continuar de todas maneras?</p>\n            </div>\n            <div class="modal-footer">\n              <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>\n              <button type="button" class="btn btn-success" id="btnEliminar" data-dismiss="modal">Si, Eliminar</button>\n            </div>\n          </div>\n          <!-- /.modal-content -->\n        </div>\n        <!-- /.modal-dialog -->\n      </div>\n            <h1>\n                Perfiles\n                <small>Control perfiles</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li class="active">Perfiles</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                    <header>Lista de Perfiles</header>\n                    <div class="tools">\n                        <div class="btn-group">\n                        ', '\n                        </div>\n                    </div>\n                </div> \n                <div class="card-body">\n                    <div class="table-responsive">\n                    <table id="example1" class="table table-bordered table-striped">\n                        <thead>\n                            <tr>\n                                <th>Codigo</th>\n                                <th>Descripcion</th>\n                                <th>Creado</th>\n                                <th>Fecha</th>\n                                <th>Acciones</th>\n                            </tr>\n                        </thead>\n                        <tbody>\n                            ', '\n                        </tbody>\n    \n                    </table>\n                    </div>\n                    <div class="card-actionbar">\n                        <ul class="pagination pagination-sm no-margin pull-right">\n                            <li>\n                                <a href="#" onclick=', '>\xAB</a>\n                            </li>\n                            ', '\n                        \n                            <li>\n                                <a href="#" onclick=', '>\xBB</a>\n                            </li>\n                        </ul>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>']),
    _templateObject2 = _taggedTemplateLiteral(['<a onclick=', ' class="btn btn-info pull-right">\n                            <i class="fa fa-plus"></i> Nuevo Perfil</a>'], ['<a onclick=', ' class="btn btn-info pull-right">\n                            <i class="fa fa-plus"></i> Nuevo Perfil</a>']),
    _templateObject3 = _taggedTemplateLiteral([''], ['']),
    _templateObject4 = _taggedTemplateLiteral(['\n                            <tr>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>\n                                    ', '\n                                    ', '\n                                    \n                                </td>\n                            </tr>'], ['\n                            <tr>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>\n                                    ', '\n                                    ', '\n                                    \n                                </td>\n                            </tr>']),
    _templateObject5 = _taggedTemplateLiteral(['<button class="btn btn-xs btn-success" onclick="', '"><i class="fa fa-edit"></i></button>'], ['<button class="btn btn-xs btn-success" onclick="', '"><i class="fa fa-edit"></i></button>']),
    _templateObject6 = _taggedTemplateLiteral(['<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger" onclick="', '"><i class="fa fa-trash"></i></button>'], ['<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger" onclick="', '"><i class="fa fa-trash"></i></button>']),
    _templateObject7 = _taggedTemplateLiteral(['<li class=', '>\n                            <a href="#" onclick=', ' >', '</a>\n                            </li>'], ['<li class=', '>\n                            <a href="#" onclick=', ' >', '</a>\n                            </li>']);

var _constantes = require('../../../constantes_entorno/constantes');

function _taggedTemplateLiteral(strings, raw) {
    return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));
}

var empty = require('empty-element');
var yo = require('yo-yo');
var NuevoPerfil = require('./agregar.js');

function Ver(perfiles, paginas, pagina_actual, _escritura, modulos) {
    var el = yo(_templateObject, _escritura ? yo(_templateObject2, function () {
        return NuevoPerfil(_escritura, modulos);
    }) : yo(_templateObject3), perfiles.map(function (u) {
        return yo(_templateObject4, u.Cod_Perfil, u.Des_Perfil, u.Cod_UsuarioReg, u.Fecha_Reg, _escritura ? yo(_templateObject5, function () {
            return NuevoPerfil(_escritura, modulos, u);
        }) : yo(_templateObject3), _escritura ? yo(_templateObject6, function () {
            return Eliminar(_escritura, u);
        }) : yo(_templateObject3));
    }), function () {
        return pagina_actual > 0 ? ListarPerfiles(_escritura, pagina_actual - 1) : null;
    }, new Array(paginas).fill(0).map(function (p, i) {
        return yo(_templateObject7, pagina_actual == i ? 'active' : '', function () {
            return ListarPerfiles(_escritura, i);
        }, i + 1);
    }), function () {
        return pagina_actual + 1 < paginas ? ListarPerfiles(_escritura, pagina_actual + 1) : null;
    });
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
}

function Eliminar(_escritura, sucursal) {

    var btnEliminar = document.getElementById('btnEliminar');
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        var _this = this;

        run_waitMe($('#main-contenido'), 1, "ios", "Eliminando perfil...");
        var Cod_Sucursal = sucursal.Cod_Sucursal;
        var parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Cod_Sucursal: Cod_Sucursal
            })
        };
        fetch(_constantes.URL + '/sucursales_api/eliminar_sucursal', parametros).then(function (req) {
            return req.json();
        }).then(function (res) {

            if (res.respuesta == 'ok') {
                ListarSucursales(_escritura);
                _this.removeEventListener('click', Eliminar);
            } else {
                console.log('Error');
                _this.removeEventListener('click', Eliminar);
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
            $('#main-contenido').waitMe('hide');
        });
    });
}

function ListarPerfiles(escritura, NumeroPagina) {
    run_waitMe($('#main-contenido'), 1, "ios");
    var _escritura = escritura;
    var parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            TamanoPagina: '20',
            NumeroPagina: NumeroPagina || '0',
            ScripOrden: ' ORDER BY Cod_Perfil desc',
            ScripWhere: ''
        })
    };
    fetch(_constantes.URL + '/perfiles_api/get_perfiles', parametros).then(function (req) {
        return req.json();
    }).then(function (res) {
        if (res.respuesta == 'ok') {
            var paginas = parseInt(res.data.num_filas[0].NroFilas);

            paginas = parseInt(paginas / 20) + (paginas % 20 != 0 ? 1 : 0);
            var modulos = res.data.modulos;
            Ver(res.data.perfiles, paginas, NumeroPagina || 0, _escritura, modulos);
        } else Ver([]);
        $('#main-contenido').waitMe('hide');
    }).catch(function (e) {
        console.log(e);
        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
        $('#main-contenido').waitMe('hide');
    });
}

exports.ListarPerfiles = ListarPerfiles;

},{"../../../constantes_entorno/constantes":344,"./agregar.js":355,"empty-element":331,"yo-yo":342}],357:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n    <div>\n        <div class="modal fade" id="modal-buscar-responsable" style="display: none;">\n            <div class="modal-dialog">\n                <div class="modal-content">\n                    <div class="modal-header">\n                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                            <span aria-hidden="true">\xD7</span>\n                        </button>\n                        <h4 class="modal-title"> B\xFAsqueda de usuario</h4>\n                    </div>\n                    <div class="modal-body">\n                        <div class="panel">\n                            \n                            <form role="form">\n                                <div class="panel-body">\n        \n                                    <label for="Cod_UsuarioCajero">Ingrese codigo o nombre de usuario</label>\n                                    <div class="input-group">\n                                        <div class="input-group-btn">\n                                            <button type="button" class="btn btn-primary" onclick="', '">Buscar</button>\n                                        </div>\n                                        <input type="text" class="form-control" id="txtBuscarUsuario" onkeypress="', '">\n                                    </div>\n                                    <br>\n                                    <div class="table-responsive" id="contenedorTablaUsuarios">\n        \n                                    </div>\n                                </div>\n                            </form>\n        \n                        </div>\n                    </div>\n        \n                    <div class="modal-footer">\n                        <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <section class="content-header">\n            <h1>\n                Sucursales\n                <small>Control sucursales</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li><a  onclick=', ' href="#">\n                Sucursales</a></li>\n                <li class="active">', '</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                    <header>\n                        <a onclick=', '\n                        class="btn btn-xs btn-icon-toggle">\n                            <i class="fa fa-arrow-left"></i></a>\n                             ', ' Sucursal\n                    </header>\n                   \n                </div> \n                <div class="card-body">\n                    <div class="panel">\n                        \n                        <!-- form start -->\n                        <form role="form">\n                            <div class="panel-body">\n                                <div class="row">\n                                    <div class="alert alert-callout alert-danger hidden" id="divErrors">\n                                        <p>Es necesario llenar todos los campos requeridos marcados con rojo</p>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    ', '\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Flag_Activo"></label>\n                                            <div class="checkbox-inline checkbox-styled checkbox-primary">\n                                                <label>\n                                                    <input type="checkbox" id="Flag_Activo" class="required" checked="', '"><span> Es Activo?</span>\n                                                </label>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Nom_Sucursal">Nombre de la Sucursal *</label>\n                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Nom_Sucursal" placeholder="Nombre de la sucursal" value="', '">\n                                        </div>\n                                    </div>\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Dir_Sucursal">Direccion fiscal de sucursal *</label>\n                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Dir_Sucursal" placeholder="Ejem: Calle..." value="', '">\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Por_UtilidadMax">% Utilidad Maxima</label>\n                                            <input type="number" class="form-control required" id="Por_UtilidadMax" placeholder="0,5,10,20" value="', '">\n                                        </div>\n                                    </div>\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Por_UtilidadMin">% Utilidad Minima </label>\n                                            <input type="number" class="form-control required" id="Por_UtilidadMin" placeholder="Ejem: 0,5,10,20" value="', '">\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Cabecera_Pagina">Cabecera de Documento</label>\n                                            <textarea type="number" class="form-control" id="Cabecera_Pagina" placeholder="Ejem: www.miempresa.com">', '</textarea>\n                                        </div>\n                                    </div>\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Pie_Pagina">Pie de Documento </label>\n                                            <textarea type="number" class="form-control" id="Pie_Pagina" placeholder="Ejem: Gracias por su compra">', '</textarea>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <label for="Cod_UsuarioAdm">Administrador de la empresa</label>\n                                        <div class="input-group">\n                                            <div class="input-group-btn">\n                                                <button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-buscar-responsable">Buscar Administrador</button>\n                                            </div>\n                                            <input type="text" class="form-control required" id="Cod_UsuarioAdm" disabled>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                            <!-- /.box-body -->\n                \n                            \n                        </form>\n                        <div class="card-actionbar">\n                                <button onclick="', '" class="btn btn-primary">Guardar</button>\n                            </div>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>'], ['\n    <div>\n        <div class="modal fade" id="modal-buscar-responsable" style="display: none;">\n            <div class="modal-dialog">\n                <div class="modal-content">\n                    <div class="modal-header">\n                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                            <span aria-hidden="true">\xD7</span>\n                        </button>\n                        <h4 class="modal-title"> B\xFAsqueda de usuario</h4>\n                    </div>\n                    <div class="modal-body">\n                        <div class="panel">\n                            \n                            <form role="form">\n                                <div class="panel-body">\n        \n                                    <label for="Cod_UsuarioCajero">Ingrese codigo o nombre de usuario</label>\n                                    <div class="input-group">\n                                        <div class="input-group-btn">\n                                            <button type="button" class="btn btn-primary" onclick="', '">Buscar</button>\n                                        </div>\n                                        <input type="text" class="form-control" id="txtBuscarUsuario" onkeypress="', '">\n                                    </div>\n                                    <br>\n                                    <div class="table-responsive" id="contenedorTablaUsuarios">\n        \n                                    </div>\n                                </div>\n                            </form>\n        \n                        </div>\n                    </div>\n        \n                    <div class="modal-footer">\n                        <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Cancelar</button>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <section class="content-header">\n            <h1>\n                Sucursales\n                <small>Control sucursales</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li><a  onclick=', ' href="#">\n                Sucursales</a></li>\n                <li class="active">', '</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                    <header>\n                        <a onclick=', '\n                        class="btn btn-xs btn-icon-toggle">\n                            <i class="fa fa-arrow-left"></i></a>\n                             ', ' Sucursal\n                    </header>\n                   \n                </div> \n                <div class="card-body">\n                    <div class="panel">\n                        \n                        <!-- form start -->\n                        <form role="form">\n                            <div class="panel-body">\n                                <div class="row">\n                                    <div class="alert alert-callout alert-danger hidden" id="divErrors">\n                                        <p>Es necesario llenar todos los campos requeridos marcados con rojo</p>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    ', '\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Flag_Activo"></label>\n                                            <div class="checkbox-inline checkbox-styled checkbox-primary">\n                                                <label>\n                                                    <input type="checkbox" id="Flag_Activo" class="required" checked="', '"><span> Es Activo?</span>\n                                                </label>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Nom_Sucursal">Nombre de la Sucursal *</label>\n                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Nom_Sucursal" placeholder="Nombre de la sucursal" value="', '">\n                                        </div>\n                                    </div>\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Dir_Sucursal">Direccion fiscal de sucursal *</label>\n                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Dir_Sucursal" placeholder="Ejem: Calle..." value="', '">\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Por_UtilidadMax">% Utilidad Maxima</label>\n                                            <input type="number" class="form-control required" id="Por_UtilidadMax" placeholder="0,5,10,20" value="', '">\n                                        </div>\n                                    </div>\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Por_UtilidadMin">% Utilidad Minima </label>\n                                            <input type="number" class="form-control required" id="Por_UtilidadMin" placeholder="Ejem: 0,5,10,20" value="', '">\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Cabecera_Pagina">Cabecera de Documento</label>\n                                            <textarea type="number" class="form-control" id="Cabecera_Pagina" placeholder="Ejem: www.miempresa.com">', '</textarea>\n                                        </div>\n                                    </div>\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="Pie_Pagina">Pie de Documento </label>\n                                            <textarea type="number" class="form-control" id="Pie_Pagina" placeholder="Ejem: Gracias por su compra">', '</textarea>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <label for="Cod_UsuarioAdm">Administrador de la empresa</label>\n                                        <div class="input-group">\n                                            <div class="input-group-btn">\n                                                <button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-buscar-responsable">Buscar Administrador</button>\n                                            </div>\n                                            <input type="text" class="form-control required" id="Cod_UsuarioAdm" disabled>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                            <!-- /.box-body -->\n                \n                            \n                        </form>\n                        <div class="card-actionbar">\n                                <button onclick="', '" class="btn btn-primary">Guardar</button>\n                            </div>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>']),
    _templateObject2 = _taggedTemplateLiteral([''], ['']),
    _templateObject3 = _taggedTemplateLiteral(['<div class="col-sm-6">\n                                    <div class="form-group">\n                                        <label for="Cod_Sucursal">Codigo de Sucursal *</label>\n                                        <input type="text" style="text-transform:uppercase" class="form-control required" id="Cod_Sucursal" placeholder="Codigo sucursal">\n                                    </div>\n                                </div>'], ['<div class="col-sm-6">\n                                    <div class="form-group">\n                                        <label for="Cod_Sucursal">Codigo de Sucursal *</label>\n                                        <input type="text" style="text-transform:uppercase" class="form-control required" id="Cod_Sucursal" placeholder="Codigo sucursal">\n                                    </div>\n                                </div>']),
    _templateObject4 = _taggedTemplateLiteral(['<table id="example1" class="table table-bordered table-striped">\n    <thead>\n        <tr>\n            <th>Codigo</th>\n            <th>Nombre</th>\n            <th>Accion</th>\n        </tr>\n    </thead>\n    <tbody>\n        ', '\n    </tbody>\n\n</table>'], ['<table id="example1" class="table table-bordered table-striped">\n    <thead>\n        <tr>\n            <th>Codigo</th>\n            <th>Nombre</th>\n            <th>Accion</th>\n        </tr>\n    </thead>\n    <tbody>\n        ', '\n    </tbody>\n\n</table>']),
    _templateObject5 = _taggedTemplateLiteral(['\n        <tr>\n            <td>', '</td>\n            <td>', '</td>\n            <td><button class="btn btn-xs btn-primary" data-dismiss="modal" onclick="', '"><i class="fa fa-check"></i> Elegir</button></td>\n        </tr>'], ['\n        <tr>\n            <td>', '</td>\n            <td>', '</td>\n            <td><button class="btn btn-xs btn-primary" data-dismiss="modal" onclick="', '"><i class="fa fa-check"></i> Elegir</button></td>\n        </tr>']);

var _listar = require('./listar');

var _constantes = require('../../../constantes_entorno/constantes');

function _taggedTemplateLiteral(strings, raw) {
    return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));
}

var empty = require('empty-element');
var yo = require('yo-yo');

module.exports = function NuevaSucursal(_escritura, sucursal) {

    var el = yo(_templateObject, function () {
        return BusquedaDeUsuario();
    }, function () {
        return BusquedaDeUsuario();
    }, function () {
        return (0, _listar.ListarSucursales)(_escritura);
    }, sucursal ? 'Editar' : 'Nuevo', function () {
        return (0, _listar.ListarSucursales)(_escritura);
    }, sucursal ? 'Editar' : 'Nueva', sucursal ? yo(_templateObject2) : yo(_templateObject3), sucursal ? sucursal.Flag_Activo : 0, sucursal ? sucursal.Nom_Sucursal : '', sucursal ? sucursal.Dir_Sucursal : '', sucursal ? sucursal.Por_UtilidadMax : '', sucursal ? sucursal.Por_UtilidadMin : '', sucursal ? sucursal.Cabecera_Pagina : '', sucursal ? sucursal.Pie_Pagina : '', function () {
        return Guardar(_escritura, sucursal);
    });
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
};

function BusquedaDeUsuario() {
    var txtBuscarUsuario = document.getElementById("txtBuscarUsuario").value;
    if (txtBuscarUsuario.length >= 4) {
        var parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                TamanoPagina: '20',
                NumeroPagina: '0',
                ScripOrden: ' ORDER BY Cod_Usuarios asc',
                ScripWhere: txtBuscarUsuario
            })
        };
        fetch(_constantes.URL + '/cajas_api/buscar_usuarios', parametros).then(function (req) {
            return req.json();
        }).then(function (res) {
            if (res.respuesta == 'ok') {
                var usuarios = res.data.usuarios;
                if (usuarios.length > 0) AgregarTabla(usuarios);else empty(document.getElementById('contenedorTablaUsuarios'));
            } else empty(document.getElementById('contenedorTablaUsuarios'));
            $('#main-contenido').waitMe('hide');
        });
    } else {
        empty(document.getElementById('contenedorTablaUsuarios'));
    }
}
function AgregarTabla(usuarios) {
    var el = yo(_templateObject4, usuarios.map(function (u) {
        return yo(_templateObject5, u.Cod_Usuarios, u.Nick, function () {
            return SeleccionarUsuario(u);
        });
    }));
    empty(document.getElementById('contenedorTablaUsuarios')).appendChild(el);
}
function SeleccionarUsuario(usuario) {
    var Cod_Usuario = document.getElementById('Cod_UsuarioAdm');
    Cod_Usuario.value = usuario.Cod_Usuarios + " - " + usuario.Nick;
}

function Guardar(_escritura, sucursal) {
    //console.log(document.getElementById('Cod_Usuarios').value.toUpperCase())
    if (ValidacionCampos()) {
        run_waitMe($('#main-contenido'), 1, "ios", "Guardando sucursal...");
        var Cod_Sucursal = sucursal ? sucursal.Cod_Sucursal : document.getElementById('Cod_Sucursal').value.toUpperCase();
        var Nom_Sucursal = document.getElementById('Nom_Sucursal').value.toUpperCase();
        var Dir_Sucursal = document.getElementById('Dir_Sucursal').value.toUpperCase();
        var Por_UtilidadMax = document.getElementById('Por_UtilidadMax').value;
        var Por_UtilidadMin = document.getElementById('Por_UtilidadMin').value;
        var Cod_UsuarioAdm = document.getElementById('Cod_UsuarioAdm').value.split(' - ')[0];
        var Cabecera_Pagina = document.getElementById('Cabecera_Pagina').value;
        var Pie_Pagina = document.getElementById('Pie_Pagina').value;
        var Flag_Activo = document.getElementById('Flag_Activo').checked;
        var Cod_Ubigeo = null;
        var Cod_Usuario = 'ADMINISTRADOR';

        var parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Cod_Sucursal: Cod_Sucursal,
                Nom_Sucursal: Nom_Sucursal,
                Dir_Sucursal: Dir_Sucursal,
                Por_UtilidadMax: Por_UtilidadMax,
                Por_UtilidadMin: Por_UtilidadMin,
                Cod_UsuarioAdm: Cod_UsuarioAdm,
                Cabecera_Pagina: Cabecera_Pagina,
                Pie_Pagina: Pie_Pagina,
                Flag_Activo: Flag_Activo,
                Cod_Ubigeo: Cod_Ubigeo,
                Cod_Usuario: Cod_Usuario
            })
        };
        fetch(_constantes.URL + '/sucursales_api/guardar_sucursal', parametros).then(function (req) {
            return req.json();
        }).then(function (res) {
            if (res.respuesta == 'ok') {
                (0, _listar.ListarSucursales)(_escritura);
            } else {
                console.log('Error');
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
            $('#main-contenido').waitMe('hide');
        });
    }
}

},{"../../../constantes_entorno/constantes":344,"./listar":358,"empty-element":331,"yo-yo":342}],358:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ListarSucursales = undefined;

var _templateObject = _taggedTemplateLiteral(['\n    <div>\n        <section class="content-header">\n        <div class="modal modal-danger fade" id="modal-danger" style="display: none;">\n        <div class="modal-dialog">\n          <div class="modal-content">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                <span aria-hidden="true">\xD7</span></button>\n              <h4 class="modal-title">\xBFEsta seguro que desea eliminar esta sucursal?</h4>\n            </div>\n            <div class="modal-body">\n              <p>Al eliminar la sucursal no podra recuperarlo. Desea continuar de todas maneras?</p>\n            </div>\n            <div class="modal-footer">\n              <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>\n              <button type="button" class="btn btn-success" id="btnEliminar" data-dismiss="modal">Si,Eliminar</button>\n            </div>\n          </div>\n          <!-- /.modal-content -->\n        </div>\n        <!-- /.modal-dialog -->\n      </div>\n            <h1>\n                Sucursales\n                <small>Control sucursales</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li class="active">Sucursales</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                    <header>\n                    Lista de Sucursales\n                    </header>\n                    <div class="tools">\n                        <div class="btn-group">\n                        ', '\n                        </div>\n                    </div>  \n                </div>\n                <!-- /.box-header -->\n                <div class="card-body">\n                    <div class="table-responsive">\n                    <table id="example1" class="table table-bordered table-striped">\n                        <thead>\n                            <tr>\n                                <th>Codigo</th>\n                                <th>Sucursal</th>\n                                <th>Direccion</th>\n                                <th>Administrador</th>\n                                <th>Util. Max</th>\n                                <th>Util. Min</th>\n                                <th>Acciones</th>\n                            </tr>\n                        </thead>\n                        <tbody>\n                            ', '\n                        </tbody>\n    \n                    </table>\n                    </div>\n                    <div class="card-actionbar">\n                        <ul class="pagination pagination-sm no-margin pull-right">\n                            <li>\n                                <a href="#" onclick=', '>\xAB</a>\n                            </li>\n                            ', '\n                        \n                            <li>\n                                <a href="#" onclick=', '>\xBB</a>\n                            </li>\n                        </ul>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>'], ['\n    <div>\n        <section class="content-header">\n        <div class="modal modal-danger fade" id="modal-danger" style="display: none;">\n        <div class="modal-dialog">\n          <div class="modal-content">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                <span aria-hidden="true">\xD7</span></button>\n              <h4 class="modal-title">\xBFEsta seguro que desea eliminar esta sucursal?</h4>\n            </div>\n            <div class="modal-body">\n              <p>Al eliminar la sucursal no podra recuperarlo. Desea continuar de todas maneras?</p>\n            </div>\n            <div class="modal-footer">\n              <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>\n              <button type="button" class="btn btn-success" id="btnEliminar" data-dismiss="modal">Si,Eliminar</button>\n            </div>\n          </div>\n          <!-- /.modal-content -->\n        </div>\n        <!-- /.modal-dialog -->\n      </div>\n            <h1>\n                Sucursales\n                <small>Control sucursales</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li class="active">Sucursales</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                    <header>\n                    Lista de Sucursales\n                    </header>\n                    <div class="tools">\n                        <div class="btn-group">\n                        ', '\n                        </div>\n                    </div>  \n                </div>\n                <!-- /.box-header -->\n                <div class="card-body">\n                    <div class="table-responsive">\n                    <table id="example1" class="table table-bordered table-striped">\n                        <thead>\n                            <tr>\n                                <th>Codigo</th>\n                                <th>Sucursal</th>\n                                <th>Direccion</th>\n                                <th>Administrador</th>\n                                <th>Util. Max</th>\n                                <th>Util. Min</th>\n                                <th>Acciones</th>\n                            </tr>\n                        </thead>\n                        <tbody>\n                            ', '\n                        </tbody>\n    \n                    </table>\n                    </div>\n                    <div class="card-actionbar">\n                        <ul class="pagination pagination-sm no-margin pull-right">\n                            <li>\n                                <a href="#" onclick=', '>\xAB</a>\n                            </li>\n                            ', '\n                        \n                            <li>\n                                <a href="#" onclick=', '>\xBB</a>\n                            </li>\n                        </ul>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>']),
    _templateObject2 = _taggedTemplateLiteral(['<a onclick=', ' class="btn btn-info pull-right">\n                        <i class="fa fa-plus"></i> Nueva Sucursal</a>'], ['<a onclick=', ' class="btn btn-info pull-right">\n                        <i class="fa fa-plus"></i> Nueva Sucursal</a>']),
    _templateObject3 = _taggedTemplateLiteral([''], ['']),
    _templateObject4 = _taggedTemplateLiteral(['\n                            <tr>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>\n                                    ', '\n                                    ', '\n                                    \n                                </td>\n                            </tr>'], ['\n                            <tr>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>\n                                    ', '\n                                    ', '\n                                    \n                                </td>\n                            </tr>']),
    _templateObject5 = _taggedTemplateLiteral(['<button class="btn btn-xs btn-success" onclick="', '"><i class="fa fa-edit"></i></button>'], ['<button class="btn btn-xs btn-success" onclick="', '"><i class="fa fa-edit"></i></button>']),
    _templateObject6 = _taggedTemplateLiteral(['<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger" onclick="', '"><i class="fa fa-trash"></i></button>'], ['<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger" onclick="', '"><i class="fa fa-trash"></i></button>']),
    _templateObject7 = _taggedTemplateLiteral(['<li class=', '>\n                            <a href="#" onclick=', ' >', '</a>\n                            </li>'], ['<li class=', '>\n                            <a href="#" onclick=', ' >', '</a>\n                            </li>']);

var _constantes = require('../../../constantes_entorno/constantes');

function _taggedTemplateLiteral(strings, raw) {
    return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));
}

var empty = require('empty-element');
var yo = require('yo-yo');
var NuevaSucursal = require('./agregar.js');

function Ver(sucursales, paginas, pagina_actual, _escritura) {
    var el = yo(_templateObject, _escritura ? yo(_templateObject2, function () {
        return NuevaSucursal(_escritura);
    }) : yo(_templateObject3), sucursales.map(function (u) {
        return yo(_templateObject4, u.Cod_Sucursal, u.Nom_Sucursal, u.Dir_Sucursal, u.Cod_UsuarioAdmin, u.Por_UtilidadMax.toFixed(2), u.Por_UtilidadMin.toFixed(2), _escritura ? yo(_templateObject5, function () {
            return NuevaSucursal(_escritura, u);
        }) : yo(_templateObject3), _escritura ? yo(_templateObject6, function () {
            return Eliminar(_escritura, u);
        }) : yo(_templateObject3));
    }), function () {
        return pagina_actual > 0 ? ListarSucursales(_escritura, pagina_actual - 1) : null;
    }, new Array(paginas).fill(0).map(function (p, i) {
        return yo(_templateObject7, pagina_actual == i ? 'active' : '', function () {
            return ListarSucursales(_escritura, i);
        }, i + 1);
    }), function () {
        return pagina_actual + 1 < paginas ? ListarSucursales(_escritura, pagina_actual + 1) : null;
    });
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
}

function Eliminar(_escritura, sucursal) {

    var btnEliminar = document.getElementById('btnEliminar');
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        var _this = this;

        run_waitMe($('#main-contenido'), 1, "ios", "Eliminando sucursal...");
        var Cod_Sucursal = sucursal.Cod_Sucursal;
        var parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Cod_Sucursal: Cod_Sucursal
            })
        };
        fetch(_constantes.URL + '/sucursales_api/eliminar_sucursal', parametros).then(function (req) {
            return req.json();
        }).then(function (res) {

            if (res.respuesta == 'ok') {
                ListarSucursales(_escritura);
                _this.removeEventListener('click', Eliminar);
            } else {
                console.log('Error');
                _this.removeEventListener('click', Eliminar);
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
            $('#main-contenido').waitMe('hide');
        });
    });
}

function ListarSucursales(escritura, NumeroPagina) {
    run_waitMe($('#main-contenido'), 1, "ios");
    var _escritura = escritura;
    var parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            TamanoPagina: '20',
            NumeroPagina: NumeroPagina || '0',
            ScripOrden: ' ORDER BY Cod_Sucursal desc',
            ScripWhere: ''
        })
    };
    fetch(_constantes.URL + '/sucursales_api/get_sucursales', parametros).then(function (req) {
        return req.json();
    }).then(function (res) {
        if (res.respuesta == 'ok') {
            var paginas = parseInt(res.data.num_filas[0].NroFilas);

            paginas = parseInt(paginas / 20) + (paginas % 20 != 0 ? 1 : 0);

            Ver(res.data.sucursales, paginas, NumeroPagina || 0, _escritura);
        } else Ver([]);
        $('#main-contenido').waitMe('hide');
    }).catch(function (e) {
        console.log(e);
        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
        $('#main-contenido').waitMe('hide');
    });
}

exports.ListarSucursales = ListarSucursales;

},{"../../../constantes_entorno/constantes":344,"./agregar.js":357,"empty-element":331,"yo-yo":342}],359:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NuevoUsuario = undefined;

var _templateObject = _taggedTemplateLiteral(['\n    <div>\n        <section class="content-header">\n            <h1>\n                Usuarios\n                <small>Control usuarios</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li><a  onclick=', ' href="#">\n                Usuarios</a></li>\n                <li class="active">', '</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                    <header><a onclick=', ' class="btn btn-xs btn-icon-toggle"><i class="fa fa-arrow-left"></i></a> Nuevo Usuario\n                   </header> \n                    \n                </div>\n                <!-- /.box-header -->\n                <div class="card-body">\n                    <div class="panel">\n                       \n                        <form role="form">\n                            <div class="panel-body">\n                                <div class="row">\n                                    <div class="alert alert-callout alert-danger hidden" id="divErrors">\n                                        <p>Es necesario llenar todos los campos requeridos marcados con rojo</p>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    ', '\n                                    <div class="col-sm-6">\n                                        <div class="form-group" id="frm_Nick">\n                                            <label for="exampleInputEmail1">Nombres y Apellidos *</label>\n                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Nick" placeholder="Ingrese Nombres" value="', '">\n                                            <div class="form-control-line"></div>\n                                        </div>\n                                    </div>\n                                </div>\n                                ', '\n                                \n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group" id="frm_Pregunta">\n                                            <label for="exampleInputEmail1">Pregunta de Seguridad *</label>\n                                            <select id="Pregunta" class="form-control required">\n                                                <option value=""></option>\n                                                ', '\n                                            </select>\n                                        </div>\n                                    </div>\n                                    <div class="col-sm-6">\n                                        <div class="form-group" id="frm_Respuesta">\n                                            <label for="exampleInputEmail1">Respuesta *</label>\n                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Respuesta" placeholder="Respuesta" value="', '">\n                                            <div class="form-control-line"></div>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="exampleInputEmail1">Estado</label>\n                                            <select id="Cod_Estado" class="form-control">\n                                                ', '\n                                            </select>\n                                        </div>\n                                    </div>\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="exampleInputEmail1">Perfil</label>\n                                            <select id="Cod_Perfil" class="form-control required">\n                                                ', '\n                                            </select>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for=""> Cajas </label>\n                                            ', '\n                                        </div>\n                                    </div>\n                                </div>        \n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="exampleInputFile">Fotografia</label>\n                                            <input type="file" id="Imagen" value="Elige Imagen">\n                                        </div>\n                                    </div>\n                                \n                                </div>\n                                \n                            </div>\n                            <!-- /.box-body -->\n                \n                            \n                        </form>\n                        <div class="card-actionbar">\n                                <button onclick="', '" class="btn btn-primary">Guardar</button>\n                            </div>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>'], ['\n    <div>\n        <section class="content-header">\n            <h1>\n                Usuarios\n                <small>Control usuarios</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li><a  onclick=', ' href="#">\n                Usuarios</a></li>\n                <li class="active">', '</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                    <header><a onclick=', ' class="btn btn-xs btn-icon-toggle"><i class="fa fa-arrow-left"></i></a> Nuevo Usuario\n                   </header> \n                    \n                </div>\n                <!-- /.box-header -->\n                <div class="card-body">\n                    <div class="panel">\n                       \n                        <form role="form">\n                            <div class="panel-body">\n                                <div class="row">\n                                    <div class="alert alert-callout alert-danger hidden" id="divErrors">\n                                        <p>Es necesario llenar todos los campos requeridos marcados con rojo</p>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    ', '\n                                    <div class="col-sm-6">\n                                        <div class="form-group" id="frm_Nick">\n                                            <label for="exampleInputEmail1">Nombres y Apellidos *</label>\n                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Nick" placeholder="Ingrese Nombres" value="', '">\n                                            <div class="form-control-line"></div>\n                                        </div>\n                                    </div>\n                                </div>\n                                ', '\n                                \n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group" id="frm_Pregunta">\n                                            <label for="exampleInputEmail1">Pregunta de Seguridad *</label>\n                                            <select id="Pregunta" class="form-control required">\n                                                <option value=""></option>\n                                                ', '\n                                            </select>\n                                        </div>\n                                    </div>\n                                    <div class="col-sm-6">\n                                        <div class="form-group" id="frm_Respuesta">\n                                            <label for="exampleInputEmail1">Respuesta *</label>\n                                            <input type="text" style="text-transform:uppercase" class="form-control required" id="Respuesta" placeholder="Respuesta" value="', '">\n                                            <div class="form-control-line"></div>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="exampleInputEmail1">Estado</label>\n                                            <select id="Cod_Estado" class="form-control">\n                                                ', '\n                                            </select>\n                                        </div>\n                                    </div>\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="exampleInputEmail1">Perfil</label>\n                                            <select id="Cod_Perfil" class="form-control required">\n                                                ', '\n                                            </select>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for=""> Cajas </label>\n                                            ', '\n                                        </div>\n                                    </div>\n                                </div>        \n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="exampleInputFile">Fotografia</label>\n                                            <input type="file" id="Imagen" value="Elige Imagen">\n                                        </div>\n                                    </div>\n                                \n                                </div>\n                                \n                            </div>\n                            <!-- /.box-body -->\n                \n                            \n                        </form>\n                        <div class="card-actionbar">\n                                <button onclick="', '" class="btn btn-primary">Guardar</button>\n                            </div>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>']),
    _templateObject2 = _taggedTemplateLiteral([''], ['']),
    _templateObject3 = _taggedTemplateLiteral(['<div class="col-sm-6">\n                                    <div class="form-group" id="frm_Cod_Usuarios">\n                                        <label for="exampleInputEmail1">Codigo Usuario *</label>\n                                        <input type="text" style="text-transform:uppercase" class="form-control required" id="Cod_Usuarios" placeholder="Ingrese codigo usuario" >\n                                        <div class="form-control-line"></div>\n                                    </div>\n                                </div>'], ['<div class="col-sm-6">\n                                    <div class="form-group" id="frm_Cod_Usuarios">\n                                        <label for="exampleInputEmail1">Codigo Usuario *</label>\n                                        <input type="text" style="text-transform:uppercase" class="form-control required" id="Cod_Usuarios" placeholder="Ingrese codigo usuario" >\n                                        <div class="form-control-line"></div>\n                                    </div>\n                                </div>']),
    _templateObject4 = _taggedTemplateLiteral(['\n                                    <div class="row">\n                                        <div class="col-sm-6">\n                                            <div class="form-group" id="frm_Contrasena">\n                                                <label for="exampleInputEmail1">Elegir Contrasena *</label>\n                                                <input type="password" class="form-control required" id="Contrasena" placeholder="Ingrese Contrasena">\n                                                <div class="form-control-line"></div>\n                                            </div>\n                                        </div>\n                                        <div class="col-sm-6">\n                                            <div class="form-group" id="frm_Contrasena2">\n                                                <label for="exampleInputEmail1">Repetir Contrasena *</label>\n                                                <input type="password" class="form-control required" id="Contrasena2" placeholder="Repita Contrasena">\n                                                <div class="form-control-line"></div>\n                                            </div>\n                                        </div>\n                                    </div>'], ['\n                                    <div class="row">\n                                        <div class="col-sm-6">\n                                            <div class="form-group" id="frm_Contrasena">\n                                                <label for="exampleInputEmail1">Elegir Contrasena *</label>\n                                                <input type="password" class="form-control required" id="Contrasena" placeholder="Ingrese Contrasena">\n                                                <div class="form-control-line"></div>\n                                            </div>\n                                        </div>\n                                        <div class="col-sm-6">\n                                            <div class="form-group" id="frm_Contrasena2">\n                                                <label for="exampleInputEmail1">Repetir Contrasena *</label>\n                                                <input type="password" class="form-control required" id="Contrasena2" placeholder="Repita Contrasena">\n                                                <div class="form-control-line"></div>\n                                            </div>\n                                        </div>\n                                    </div>']),
    _templateObject5 = _taggedTemplateLiteral(['<option style="text-transform:uppercase" value="', '" ', '>', '</option>'], ['<option style="text-transform:uppercase" value="', '" ', '>', '</option>']),
    _templateObject6 = _taggedTemplateLiteral(['\n                                                <option style="text-transform:uppercase" value="', '" ', '>', '</option>'], ['\n                                                <option style="text-transform:uppercase" value="', '" ', '>', '</option>']),
    _templateObject7 = _taggedTemplateLiteral(['\n                                            <div class="row">\n                                                <div class="checkbox-inline checkbox-styled checkbox-primary">\n                                                    <label>\n                                                        <input type="checkbox" id="', '" checked="', '" ><span> ', '</span>\n                                                    </label>\n                                                </div>\n                                            </div>\n                                            '], ['\n                                            <div class="row">\n                                                <div class="checkbox-inline checkbox-styled checkbox-primary">\n                                                    <label>\n                                                        <input type="checkbox" id="', '" checked="', '" ><span> ', '</span>\n                                                    </label>\n                                                </div>\n                                            </div>\n                                            ']);

var _listar = require('./listar');

var _constantes = require('../../../constantes_entorno/constantes');

function _taggedTemplateLiteral(strings, raw) {
    return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));
}

var empty = require('empty-element');
var yo = require('yo-yo');

var preguntas_seguridad = ['¿Cómo se llamaba tu mejor amigo de la infancia?', '¿Cómo se llamaba tu primer profesor o tu primera profesora?', '¿Cómo se llamaba tu primer jefe?', '¿Cuál fue tu primer número de teléfono?', '¿Cuál es el número de matrícula de tu vehículo?', '¿Cuál es el número de tu carné de la biblioteca?'];

function Ver(_escritura, _estados, _perfiles, cajas, usuario) {

    var el = yo(_templateObject, function () {
        return (0, _listar.ListarUsuarios)(_escritura);
    }, usuario ? 'Editar' : 'Nuevo', function () {
        return (0, _listar.ListarUsuarios)(_escritura);
    }, usuario ? yo(_templateObject2) : yo(_templateObject3), usuario ? usuario.Nick : '', !usuario ? yo(_templateObject4) : yo(_templateObject2), preguntas_seguridad.map(function (e) {
        return yo(_templateObject5, e, usuario ? usuario.Pregunta.toUpperCase() == e.toUpperCase() ? 'selected' : '' : '', e);
    }), usuario ? usuario.Respuesta : '', _estados.map(function (e) {
        return yo(_templateObject5, e.Cod_Estado, usuario ? usuario.Cod_Estado == e.Cod_Estado ? 'selected' : '' : '', e.Nom_Estado);
    }), _perfiles.map(function (e) {
        return yo(_templateObject6, e.Cod_Perfil, usuario ? usuario.Cod_Perfil == e.Cod_Perfil ? 'selected' : '' : '', e.Des_Perfil);
    }), cajas.map(function (c) {
        return yo(_templateObject7, c.Cod_Caja, c.Relacion, c.Des_Caja);
    }), function () {
        return Guardar(_escritura, cajas, usuario);
    });
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
}
function ValidacionesExtras(usuario) {
    if (!usuario) {
        if (document.getElementById('Contrasena').value != document.getElementById('Contrasena2').value) {
            $("#divErrors").removeClass("hidden");
            $('#divErrors').html('<p>Las contrasenas deben ser iguales</p>');
            $('#Contrasena').css('border-color', 'red');
            $('#Contrasena2').css('border-color', 'red');
            return false;
        } else {
            $("#divErrors").addClass("hidden");
            $('#divErrors').html('<p>Es necesario llenar todos los campos requeridos marcados con rojo</p>');
            $('#Contrasena').css('border-color', '');
            $('#Contrasena2').css('border-color', '');
            return true;
        }
    } else return true;
}
function Guardar(_escritura, Cajas, usuario) {
    //console.log(document.getElementById('Cod_Usuarios').value.toUpperCase())
    if (ValidacionCampos() && ValidacionesExtras(usuario)) {
        run_waitMe($('#main-contenido'), 1, "ios", "Guardando usuario...");
        for (var j = 0; j < Cajas.length; j++) {
            Cajas[j].Relacion = document.getElementById(Cajas[j].Cod_Caja).checked;
        }
        var Cod_Usuarios = usuario ? usuario.Cod_Usuarios : document.getElementById('Cod_Usuarios').value.toUpperCase();
        var Nick = document.getElementById('Nick').value.toUpperCase();
        var Contrasena = usuario ? usuario.Contrasena : document.getElementById('Contrasena').value;
        var Pregunta = document.getElementById('Pregunta').value.toUpperCase();
        var Respuesta = document.getElementById('Respuesta').value.toUpperCase();
        var Cod_Estado = document.getElementById('Cod_Estado').value.toUpperCase();
        var Cod_Perfil = document.getElementById('Cod_Perfil').value.toUpperCase();
        var Imagen = document.getElementById('Imagen').value;
        var EsNuevo = usuario ? false : true;
        var Cod_Usuario = 'ADMINISTRADOR';

        var parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Cod_Usuarios: Cod_Usuarios,
                Nick: Nick,
                Contrasena: Contrasena,
                Pregunta: Pregunta,
                Respuesta: Respuesta,
                Cod_Estado: Cod_Estado,
                Cod_Perfil: Cod_Perfil,
                Cod_Usuario: Cod_Usuario,
                EsNuevo: EsNuevo,
                Cajas: Cajas
            })
        };
        fetch(_constantes.URL + '/usuarios_api/guardar_usuario', parametros).then(function (req) {
            return req.json();
        }).then(function (res) {
            if (res.respuesta == 'ok') {
                (0, _listar.ListarUsuarios)(_escritura);
            } else {
                console.log('Error');
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
            $('#main-contenido').waitMe('hide');
        });
    }
}

function NuevoUsuario(_escritura, _estados, _perfiles, usuario) {

    var parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            Cod_Usuarios: usuario ? usuario.Cod_Usuarios : ''
        })
    };
    fetch(_constantes.URL + '/usuarios_api/get_cajas_usuario', parametros).then(function (req) {
        return req.json();
    }).then(function (res) {
        var cajas = [];
        if (res.respuesta == 'ok') {
            cajas = res.data.cajas;
        }
        Ver(_escritura, _estados, _perfiles, cajas, usuario);
        $('#main-contenido').waitMe('hide');
    }).catch(function (e) {
        console.log(e);
        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
        $('#main-contenido').waitMe('hide');
    });
}

exports.NuevoUsuario = NuevoUsuario;

},{"../../../constantes_entorno/constantes":344,"./listar":360,"empty-element":331,"yo-yo":342}],360:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ListarUsuarios = undefined;

var _templateObject = _taggedTemplateLiteral(['<div><button class="btn btn-xs btn-success">Editar</button>\n    <button class="btn btn-xs btn-danger">Borrar</button></div>'], ['<div><button class="btn btn-xs btn-success">Editar</button>\n    <button class="btn btn-xs btn-danger">Borrar</button></div>']),
    _templateObject2 = _taggedTemplateLiteral(['<div></div>'], ['<div></div>']),
    _templateObject3 = _taggedTemplateLiteral(['\n    <div>\n        <section class="content-header">\n        <div class="modal modal-danger fade" id="modal-danger" style="display: none;">\n        <div class="modal-dialog">\n          <div class="modal-content">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                <span aria-hidden="true">\xD7</span></button>\n              <h4 class="modal-title">\xBFEsta seguro que desea eliminar este usuario?</h4>\n            </div>\n            <div class="modal-body">\n              <p>Al eliminar el usuario se perderan todos los datos.</p>\n            </div>\n            <div class="modal-footer">\n              <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>\n              <button type="button" class="btn btn-success" id="btnEliminar" data-dismiss="modal">Eliminar</button>\n            </div>\n          </div>\n          <!-- /.modal-content -->\n        </div>\n        <!-- /.modal-dialog -->\n      </div>\n            <h1>\n                Usuarios\n                <small>Control usuarios</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li class="active">Usuarios</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                    <header>Lista de Usuarios</header>\n                    <div class="tools">\n                        <div class="btn-group">\n                        ', '\n                        </div>\n                    </div>\n                </div>\n                <div class="card-body">\n                    <div class="table-responsive">\n                    <table id="example1" class="table table-bordered table-striped">\n                        <thead>\n                            <tr>\n                                <th>Codigo</th>\n                                <th>Pregunta</th>\n                                <th>Perfil</th>\n                                <th>Conectada</th>\n                                <th>Acciones</th>\n                            </tr>\n                        </thead>\n                        <tbody>\n                            ', '\n                        </tbody>\n    \n                    </table>\n                    </div>\n                    <div class="card-actionbar">\n                        <ul class="pagination pagination-sm no-margin pull-right">\n                            <li>\n                                <a href="#" onclick=', '>\xAB</a>\n                            </li>\n                            ', '\n                        \n                            <li>\n                                <a href="#" onclick=', '>\xBB</a>\n                            </li>\n                        </ul>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>'], ['\n    <div>\n        <section class="content-header">\n        <div class="modal modal-danger fade" id="modal-danger" style="display: none;">\n        <div class="modal-dialog">\n          <div class="modal-content">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                <span aria-hidden="true">\xD7</span></button>\n              <h4 class="modal-title">\xBFEsta seguro que desea eliminar este usuario?</h4>\n            </div>\n            <div class="modal-body">\n              <p>Al eliminar el usuario se perderan todos los datos.</p>\n            </div>\n            <div class="modal-footer">\n              <button type="button" class="btn btn-danger pull-left" data-dismiss="modal">Cancelar</button>\n              <button type="button" class="btn btn-success" id="btnEliminar" data-dismiss="modal">Eliminar</button>\n            </div>\n          </div>\n          <!-- /.modal-content -->\n        </div>\n        <!-- /.modal-dialog -->\n      </div>\n            <h1>\n                Usuarios\n                <small>Control usuarios</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Configuracion</a>\n                </li>\n                <li class="active">Usuarios</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="card">\n                <div class="card-head">\n                    <header>Lista de Usuarios</header>\n                    <div class="tools">\n                        <div class="btn-group">\n                        ', '\n                        </div>\n                    </div>\n                </div>\n                <div class="card-body">\n                    <div class="table-responsive">\n                    <table id="example1" class="table table-bordered table-striped">\n                        <thead>\n                            <tr>\n                                <th>Codigo</th>\n                                <th>Pregunta</th>\n                                <th>Perfil</th>\n                                <th>Conectada</th>\n                                <th>Acciones</th>\n                            </tr>\n                        </thead>\n                        <tbody>\n                            ', '\n                        </tbody>\n    \n                    </table>\n                    </div>\n                    <div class="card-actionbar">\n                        <ul class="pagination pagination-sm no-margin pull-right">\n                            <li>\n                                <a href="#" onclick=', '>\xAB</a>\n                            </li>\n                            ', '\n                        \n                            <li>\n                                <a href="#" onclick=', '>\xBB</a>\n                            </li>\n                        </ul>\n                    </div>\n                </div>\n            </div>\n        </section>\n    </div>']),
    _templateObject4 = _taggedTemplateLiteral(['<a onclick=', ' class="btn btn-info pull-right">\n                            <i class="fa fa-plus"></i> Nuevo Usuario</a>'], ['<a onclick=', ' class="btn btn-info pull-right">\n                            <i class="fa fa-plus"></i> Nuevo Usuario</a>']),
    _templateObject5 = _taggedTemplateLiteral([''], ['']),
    _templateObject6 = _taggedTemplateLiteral(['\n                            <tr>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>\n                                    ', '\n                                    ', '\n                                    \n                                </td>\n                            </tr>'], ['\n                            <tr>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>', '</td>\n                                <td>\n                                    ', '\n                                    ', '\n                                    \n                                </td>\n                            </tr>']),
    _templateObject7 = _taggedTemplateLiteral(['<button class="btn btn-xs btn-success" onclick="', '"><i class="fa fa-edit"></i></button>'], ['<button class="btn btn-xs btn-success" onclick="', '"><i class="fa fa-edit"></i></button>']),
    _templateObject8 = _taggedTemplateLiteral(['<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger" onclick="', '"><i class="fa fa-trash"></i></button>'], ['<button class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal-danger" onclick="', '"><i class="fa fa-trash"></i></button>']),
    _templateObject9 = _taggedTemplateLiteral(['<li class=', '>\n                            <a href="#" onclick=', ' >', '</a>\n                            </li>'], ['<li class=', '>\n                            <a href="#" onclick=', ' >', '</a>\n                            </li>']);

var _agregar = require('./agregar.js');

var _constantes = require('../../../constantes_entorno/constantes');

function _taggedTemplateLiteral(strings, raw) {
    return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));
}

var empty = require('empty-element');
var yo = require('yo-yo');

function Controles(escritura) {
    var controles = yo(_templateObject);
    if (escritura) return controles;else return yo(_templateObject2);
}

function Ver(usuarios, paginas, pagina_actual, _escritura, _estados, _perfiles) {
    var el = yo(_templateObject3, _escritura ? yo(_templateObject4, function () {
        return (0, _agregar.NuevoUsuario)(_escritura, _estados, _perfiles);
    }) : yo(_templateObject5), usuarios.map(function (u) {
        return yo(_templateObject6, u.Cod_Usuarios, u.Pregunta, u.Cod_Perfil, u.Cod_Estado, _escritura ? yo(_templateObject7, function () {
            return (0, _agregar.NuevoUsuario)(_escritura, _estados, _perfiles, u);
        }) : yo(_templateObject5), _escritura ? yo(_templateObject8, function () {
            return EliminarUsuario(_escritura, u);
        }) : yo(_templateObject5));
    }), function () {
        return pagina_actual > 0 ? ListarUsuarios(_escritura, pagina_actual - 1) : null;
    }, new Array(paginas).fill(0).map(function (p, i) {
        return yo(_templateObject9, pagina_actual == i ? 'active' : '', function () {
            return ListarUsuarios(_escritura, i);
        }, i + 1);
    }), function () {
        return pagina_actual + 1 < paginas ? ListarUsuarios(_escritura, pagina_actual + 1) : null;
    });
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
}

function EliminarUsuario(_escritura, usuario) {

    var btnEliminar = document.getElementById('btnEliminar');
    btnEliminar.addEventListener('click', function Eliminar(ev) {
        var _this = this;

        run_waitMe($('#main-contenido'), 1, "ios", "Eliminando usuario...");
        var Cod_Usuarios = usuario.Cod_Usuarios;
        var parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Cod_Usuarios: Cod_Usuarios
            })
        };
        fetch(_constantes.URL + '/usuarios_api/eliminar_usuario', parametros).then(function (req) {
            return req.json();
        }).then(function (res) {

            if (res.respuesta == 'ok') {
                ListarUsuarios(_escritura);
                _this.removeEventListener('click', Eliminar);
            } else {

                _this.removeEventListener('click', Eliminar);
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
            $('#main-contenido').waitMe('hide');
        });
    });
}

function ListarUsuarios(escritura, NumeroPagina) {
    run_waitMe($('#main-contenido'), 1, "ios");
    var _escritura = escritura;
    var parametros = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            TamanoPagina: '20',
            NumeroPagina: NumeroPagina || '0',
            ScripOrden: ' ORDER BY Cod_Usuarios asc',
            ScripWhere: ''
        })
    };
    fetch(_constantes.URL + '/usuarios_api/get_usuarios', parametros).then(function (req) {
        return req.json();
    }).then(function (res) {
        if (res.respuesta == 'ok') {
            var paginas = parseInt(res.data.num_filas[0].NroFilas);

            paginas = parseInt(paginas / 20) + (paginas % 20 != 0 ? 1 : 0);

            var _perfiles = res.data.perfiles;
            var _estados = res.data.estados;

            Ver(res.data.usuarios, paginas, NumeroPagina || 0, _escritura, _estados, _perfiles);
        } else Ver([]);
        $('#main-contenido').waitMe('hide');
    }).catch(function (e) {
        console.log(e);
        toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
        $('#main-contenido').waitMe('hide');
    });
}

exports.ListarUsuarios = ListarUsuarios;

},{"../../../constantes_entorno/constantes":344,"./agregar.js":359,"empty-element":331,"yo-yo":342}],361:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NuevaCuentaBancaria = undefined;

var _templateObject = _taggedTemplateLiteral(['\n    <div>\n        <section class="content-header">\n            <h1>\n                Cuentas Bancarias\n                <small>Control cuentas bancarias</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Contabilidad</a>\n                </li>\n                <li><a  onclick=', ' href="#">\n                Cuentas Bancarias</a></li>\n                <li class="active">', '</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="box">\n                <div class="box-header">\n                    <a onclick=', '\n                    class="btn btn-xs btn-warning">\n                        <i class="fa fa-arrow-left"></i> Atras</a>\n                    \n                    \n                </div>\n                <!-- /.box-header -->\n                <div class="box-body">\n                    <div class="box box-primary">\n                        <div class="box-header with-border">\n                            <h3 class="box-title">', ' Cuenta Bancaria</h3>\n                        </div>\n                        <!-- form start -->\n                        <div role="form">\n                            <div class="box-body">\n                                <div class="row">\n                                    <div class="alert alert-callout alert-danger hidden" id="divErrors">\n                                        <p>Es necesario llenar todos los campos requeridos marcados con rojo</p>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="">Sucursal Responsable *</label>\n                                            <select id="Cod_Sucursal" class="form-control required">\n                                                <option value=""></option>\n                                                ', '\n                                            </select>\n                                        </div>\n                                    </div>\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="">Entidad Financiera *</label>\n                                            <select id="Cod_EntidadFinanciera" class="form-control required">\n                                                <option value=""></option>\n                                                ', '\n                                            </select>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    ', '\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="">Moneda *</label>\n                                            <select id="Cod_Moneda" class="form-control required">\n                                                <option value=""></option>\n                                                ', '\n                                            </select>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="">Tipo de Cuenta *</label>\n                                            <select id="Cod_TipoCuentaBancaria" class="form-control required">\n                                                <option value=""></option>\n                                                ', '\n                                            </select>\n                                        </div>\n                                    </div>\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="">Descripcion de la cuenta *</label>\n                                            <input type="text"  style="text-transform:uppercase" class="form-control required" id="Des_CuentaBancaria" value="', '">\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="">Cuenta Contable</label>\n                                            <input type="text"  style="text-transform:uppercase" class="form-control" id="Cod_CuentaContable" value="', '">\n                                        </div>\n                                    </div>\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="">Saldo Disponible</label>\n                                            <input type="number" class="form-control" id="Saldo_Disponible" value="', '">\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for=""></label>\n                                            \n                                            <div class="checkbox">\n                                                <label>\n                                                    <input type="checkbox" id="Flag_Activo" checked="', '"> Es Activo?\n                                                </label>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n                                \n                            </div>\n                            \n                        </div>\n                    </div>\n                </div>\n                <div class="box-footer">\n                        <button onclick="', '" class="btn btn-primary">Guardar</button>\n                    </div>\n            </div>\n        </section>\n    </div>'], ['\n    <div>\n        <section class="content-header">\n            <h1>\n                Cuentas Bancarias\n                <small>Control cuentas bancarias</small>\n            </h1>\n            <ol class="breadcrumb">\n                <li>\n                    <a href="#">\n                        <i class="fa fa-cog"></i> Contabilidad</a>\n                </li>\n                <li><a  onclick=', ' href="#">\n                Cuentas Bancarias</a></li>\n                <li class="active">', '</li>\n            </ol>\n        </section>\n        <section class="content">\n            <div class="box">\n                <div class="box-header">\n                    <a onclick=', '\n                    class="btn btn-xs btn-warning">\n                        <i class="fa fa-arrow-left"></i> Atras</a>\n                    \n                    \n                </div>\n                <!-- /.box-header -->\n                <div class="box-body">\n                    <div class="box box-primary">\n                        <div class="box-header with-border">\n                            <h3 class="box-title">', ' Cuenta Bancaria</h3>\n                        </div>\n                        <!-- form start -->\n                        <div role="form">\n                            <div class="box-body">\n                                <div class="row">\n                                    <div class="alert alert-callout alert-danger hidden" id="divErrors">\n                                        <p>Es necesario llenar todos los campos requeridos marcados con rojo</p>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="">Sucursal Responsable *</label>\n                                            <select id="Cod_Sucursal" class="form-control required">\n                                                <option value=""></option>\n                                                ', '\n                                            </select>\n                                        </div>\n                                    </div>\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="">Entidad Financiera *</label>\n                                            <select id="Cod_EntidadFinanciera" class="form-control required">\n                                                <option value=""></option>\n                                                ', '\n                                            </select>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    ', '\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="">Moneda *</label>\n                                            <select id="Cod_Moneda" class="form-control required">\n                                                <option value=""></option>\n                                                ', '\n                                            </select>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="">Tipo de Cuenta *</label>\n                                            <select id="Cod_TipoCuentaBancaria" class="form-control required">\n                                                <option value=""></option>\n                                                ', '\n                                            </select>\n                                        </div>\n                                    </div>\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="">Descripcion de la cuenta *</label>\n                                            <input type="text"  style="text-transform:uppercase" class="form-control required" id="Des_CuentaBancaria" value="', '">\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="">Cuenta Contable</label>\n                                            <input type="text"  style="text-transform:uppercase" class="form-control" id="Cod_CuentaContable" value="', '">\n                                        </div>\n                                    </div>\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for="">Saldo Disponible</label>\n                                            <input type="number" class="form-control" id="Saldo_Disponible" value="', '">\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="row">\n                                    <div class="col-sm-6">\n                                        <div class="form-group">\n                                            <label for=""></label>\n                                            \n                                            <div class="checkbox">\n                                                <label>\n                                                    <input type="checkbox" id="Flag_Activo" checked="', '"> Es Activo?\n                                                </label>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n                                \n                            </div>\n                            \n                        </div>\n                    </div>\n                </div>\n                <div class="box-footer">\n                        <button onclick="', '" class="btn btn-primary">Guardar</button>\n                    </div>\n            </div>\n        </section>\n    </div>']),
    _templateObject2 = _taggedTemplateLiteral(['<option value="', '" ', '>', '</option>'], ['<option value="', '" ', '>', '</option>']),
    _templateObject3 = _taggedTemplateLiteral([''], ['']),
    _templateObject4 = _taggedTemplateLiteral(['<div class="col-sm-6">\n                                    <div class="form-group">\n                                        <label >Cuenta Bancaria *</label>\n                                        <input type="text" style="text-transform:uppercase" class="form-control required" id="Cod_CuentaBancaria">\n                                    </div>\n                                    </div>'], ['<div class="col-sm-6">\n                                    <div class="form-group">\n                                        <label >Cuenta Bancaria *</label>\n                                        <input type="text" style="text-transform:uppercase" class="form-control required" id="Cod_CuentaBancaria">\n                                    </div>\n                                    </div>']);

var _listar = require('./listar');

var _constantes = require('../../../constantes_entorno/constantes');

function _taggedTemplateLiteral(strings, raw) {
    return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));
}

var empty = require('empty-element');
var yo = require('yo-yo');

function Ver(_escritura, variables, cuenta) {

    var el = yo(_templateObject, function () {
        return (0, _listar.ListarCuentasBancarias)(_escritura);
    }, cuenta ? 'Editar' : 'Nuevo', function () {
        return (0, _listar.ListarCuentasBancarias)(_escritura);
    }, cuenta ? 'Editar' : 'Nuevo', variables.sucursales.map(function (e) {
        return yo(_templateObject2, e.Cod_Sucursal, cuenta ? cuenta.Cod_Sucursal == e.Cod_Sucursal ? 'selected' : '' : '', e.Nom_Sucursal);
    }), variables.entidades.map(function (e) {
        return yo(_templateObject2, e.Cod_EntidadFinanciera, cuenta ? cuenta.Cod_EntidadFinanciera == e.Cod_EntidadFinanciera ? 'selected' : '' : '', e.Nom_EntidadFinanciera);
    }), cuenta ? yo(_templateObject3) : yo(_templateObject4), variables.monedas.map(function (e) {
        return yo(_templateObject2, e.Cod_Moneda, cuenta ? cuenta.Cod_Moneda == e.Cod_Moneda ? 'selected' : '' : '', e.Nom_Moneda);
    }), variables.tipos_cuentas.map(function (e) {
        return yo(_templateObject2, e.Cod_TipoCuentaBancaria, cuenta ? cuenta.Cod_TipoCuentaBancaria == e.Cod_TipoCuentaBancaria ? 'selected' : '' : '', e.Nom_TipoCuentaBancaria);
    }), cuenta ? cuenta.Des_CuentaBancaria : '', cuenta ? cuenta.Cod_CuentaContable : '', cuenta ? cuenta.Saldo_Disponible : '', cuenta ? cuenta.Flag_Activo : 0, function () {
        return GuardarCuentaBancaria(_escritura, cuenta);
    });
    var main = document.getElementById('main-contenido');
    empty(main).appendChild(el);
    // $('.select2').select2();
}

function GuardarCuentaBancaria(_escritura, cuenta) {
    if (ValidacionCampos()) {
        run_waitMe($('#main-contenido'), 1, "ios", "Guardar cuenta bancaria...");
        var Cod_CuentaBancaria = cuenta ? cuenta.Cod_CuentaBancaria : document.getElementById('Cod_CuentaBancaria').value.toUpperCase();
        var Cod_Sucursal = document.getElementById('Cod_Sucursal').value;
        var Cod_EntidadFinanciera = document.getElementById('Cod_EntidadFinanciera').value;
        var Des_CuentaBancaria = document.getElementById('Des_CuentaBancaria').value.toUpperCase();
        var Cod_Moneda = document.getElementById('Cod_Moneda').value;
        var Saldo_Disponible = document.getElementById('Saldo_Disponible').value;
        var Cod_CuentaContable = document.getElementById('Cod_CuentaContable').value;
        var Cod_TipoCuentaBancaria = document.getElementById('Cod_TipoCuentaBancaria').value;
        var Flag_Activo = document.getElementById('Flag_Activo').checked;

        var parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                Cod_CuentaBancaria: Cod_CuentaBancaria, Cod_Sucursal: Cod_Sucursal, Cod_EntidadFinanciera: Cod_EntidadFinanciera,
                Des_CuentaBancaria: Des_CuentaBancaria, Cod_Moneda: Cod_Moneda, Saldo_Disponible: Saldo_Disponible, Cod_CuentaContable: Cod_CuentaContable,
                Cod_TipoCuentaBancaria: Cod_TipoCuentaBancaria, Flag_Activo: Flag_Activo
            })
        };
        fetch(_constantes.URL + '/cuentas_bancarias_api/guardar_cuenta', parametros).then(function (req) {
            return req.json();
        }).then(function (res) {
            if (res.respuesta == 'ok') {
                (0, _listar.ListarCuentasBancarias)(_escritura);
            } else {
                console.log('Error');
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
            $('#main-contenido').waitMe('hide');
        });
    }
}

function NuevaCuentaBancaria(_escritura, variables, cuenta) {
    if (cuenta != undefined) {
        run_waitMe($('#main-contenido'), 1, "ios");
        var parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Cod_CuentaBancaria: cuenta.Cod_CuentaBancaria })
        };
        fetch(_constantes.URL + '/cuentas_bancarias_api/get_cuenta', parametros).then(function (req) {
            return req.json();
        }).then(function (res) {
            if (res.respuesta == 'ok') {
                Ver(_escritura, variables, res.data.cuenta[0]);
            } else {
                console.log('Error');
            }
            $('#main-contenido').waitMe('hide');
        }).catch(function (e) {
            console.log(e);
            toastr.error('Ocurrio un error en la conexion o al momento de cargar los datos.  Tipo error : ' + e, 'Error', { timeOut: 5000 });
            $('#main-contenido').waitMe('hide');
        });
    } else Ver(_escritura, variables);
}
exports.NuevaCuentaBancaria = NuevaCuentaBancaria;

},{"../../../constantes_entorno/constantes":344,"./listar":362,"empty-element":331,"yo-yo":342}]