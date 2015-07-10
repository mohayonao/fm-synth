(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.FMSynth = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require("./lib/FMSynth");

},{"./lib/FMSynth":2}],2:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.isValidAlgorithm = isValidAlgorithm;
exports.build = build;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _algorithms = require("./algorithms");

var _algorithms2 = _interopRequireDefault(_algorithms);

var OUTLET = typeof Symbol !== "undefined" ? Symbol("OUTLET") : "_@mohayonao/operator:OUTLET";
exports.OUTLET = OUTLET;
var OPERATORS = typeof Symbol !== "undefined" ? Symbol("OPERATORS") : "_@mohayonao/operator:OPERATORS";
exports.OPERATORS = OPERATORS;
var ALGORITHM = typeof Symbol !== "undefined" ? Symbol("ALGORITHM") : "_@mohayonao/operator:ALGORITHM";
exports.ALGORITHM = ALGORITHM;
var ONENDED = typeof Symbol !== "undefined" ? Symbol("ONENDED") : "_@mohayonao/operator:ONENDED";

exports.ONENDED = ONENDED;

var FMSynth = (function () {
  function FMSynth(algorithm, operators) {
    _classCallCheck(this, FMSynth);

    var outlets = build(algorithm, operators);

    this[OUTLET] = createOutletNode(outlets);
    this[OPERATORS] = operators;
    this[ALGORITHM] = algorithm;
    this[ONENDED] = findOnEndedNode(operators);
  }

  _createClass(FMSynth, [{
    key: "connect",
    value: function connect(destination) {
      this[OUTLET].connect(destination);
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      var _OUTLET;

      (_OUTLET = this[OUTLET]).disconnect.apply(_OUTLET, arguments);
    }
  }, {
    key: "start",
    value: function start(when) {
      this[OPERATORS].forEach(function (op) {
        if (typeof op.start === "function") {
          op.start(when);
        }
      });
    }
  }, {
    key: "stop",
    value: function stop(when) {
      this[OPERATORS].forEach(function (op) {
        if (typeof op.stop === "function") {
          op.stop(when);
        }
      });
    }
  }, {
    key: "context",
    get: function get() {
      return this[OPERATORS][0].context;
    }
  }, {
    key: "operators",
    get: function get() {
      return this[OPERATORS].slice();
    }
  }, {
    key: "algorithm",
    get: function get() {
      return this[ALGORITHM];
    }
  }, {
    key: "onended",
    get: function get() {
      return this[ONENDED].onended;
    },
    set: function set(value) {
      this[ONENDED].onended = value;
    }
  }]);

  return FMSynth;
})();

exports["default"] = FMSynth;

function createOutletNode(outlets) {
  var outlet = outlets[0].context.createGain();

  outlets.forEach(function (_outlet) {
    _outlet.connect(outlet);
  });

  return outlet;
}

function findOnEndedNode(operators) {
  for (var i = 0, imax = operators.length; i < imax; i++) {
    if (typeof operators[i].onended !== "undefined") {
      return operators[i];
    }
  }

  return { onended: null };
}

function isValidAlgorithm(algorithm, numOfOperators) {
  var X = String.fromCharCode(64 + numOfOperators);
  var re = new RegExp("^[A-" + X + "]-(?:[A-" + X + "]-)*[>A-" + X + "]$", "i");

  return algorithm.indexOf(">") !== -1 && algorithm.replace(/\s+/g, "").split(";").every(function (algorithm) {
    return re.test(algorithm);
  });
}

function build(pattern, operators) {
  var algorithm = null;

  if (typeof pattern === "number") {
    algorithm = _algorithms2["default"][operators.length] && _algorithms2["default"][operators.length][pattern] || null;
  } else {
    algorithm = "" + pattern;
  }

  if (26 < operators.length) {
    throw new TypeError("too many operator");
  }
  if (algorithm === null) {
    throw new TypeError("not found algorithm " + pattern + " for " + operators.length + " operators");
  }
  if (!isValidAlgorithm(algorithm, operators.length)) {
    throw new TypeError("invalid algorithm: " + algorithm);
  }

  function findOperatorByName(name) {
    return operators[name.toUpperCase().charCodeAt(0) - 65];
  }

  var outlets = [];
  var graph = {};

  algorithm.replace(/\s+|-/g, "").split(";").forEach(function (algorithm) {
    var tokens = algorithm.split("");
    var token = tokens.shift();
    var node = findOperatorByName(token);

    tokens.forEach(function (nextToken) {
      if (graph[token]) {
        if (graph[token].indexOf(nextToken) !== -1) {
          return;
        }
        graph[token].push(nextToken);
      } else {
        graph[token] = [nextToken];
      }

      var nextNode = findOperatorByName(nextToken);

      if (nextToken === ">") {
        outlets.push(node);
      } else if (nextNode.frequency instanceof global.AudioParam) {
        node.connect(nextNode.frequency);
      } else {
        node.connect(nextNode);
      }

      token = nextToken;
      node = nextNode;
    });
  });

  return outlets;
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./algorithms":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = {
  1: ["A->"],
  2: ["B-A->", "B->; A->"],
  3: ["C-B-A->", "C-A; B-A; A->", "C-B->; C-A->", "C-B->; A->", "C->; B->; A->"],
  4: ["D-C-B-A->", "D-B; C-B; B-A->", "D-A->; C-B-A; A->", "D-C; D-B; C-A->; B-A->", "D-C; C-A->; C-B->", "D-C-B->; A->", "D-A; C-A; B-A; A->", "D-C->; B-A->", "D-C->; D-B->; D-A->", "D-C->; B->; A->", "D->; C->; B->; A->"]
};
module.exports = exports["default"];
},{}]},{},[1])(1)
});