import ALGORITHMS from "./algorithms";

export const OUTLET = typeof Symbol !== "undefined" ? Symbol("OUTLET") : "_@mohayonao/operator:OUTLET";
export const OPERATORS = typeof Symbol !== "undefined" ? Symbol("OPERATORS") : "_@mohayonao/operator:OPERATORS";
export const ALGORITHM = typeof Symbol !== "undefined" ? Symbol("ALGORITHM") : "_@mohayonao/operator:ALGORITHM";
export const ONENDED = typeof Symbol !== "undefined" ? Symbol("ONENDED") : "_@mohayonao/operator:ONENDED";

export default class FMSynth {
  constructor(algorithm, operators) {
    let outlets = build(algorithm, operators);

    this[OUTLET] = createOutletNode(outlets);
    this[OPERATORS] = operators;
    this[ALGORITHM] = algorithm;
    this[ONENDED] = findOnEndedNode(operators);
  }

  get context() {
    return this[OPERATORS][0].context;
  }

  get operators() {
    return this[OPERATORS].slice();
  }

  get algorithm() {
    return this[ALGORITHM];
  }

  get onended() {
    return this[ONENDED].onended;
  }

  set onended(value) {
    this[ONENDED].onended = value;
  }

  connect(destination) {
    this[OUTLET].connect(destination);
  }

  disconnect(...args) {
    this[OUTLET].disconnect(...args);
  }

  start(when) {
    this[OPERATORS].forEach((op) => {
      if (typeof op.start === "function") {
        op.start(when);
      }
    });
  }

  stop(when) {
    this[OPERATORS].forEach((op) => {
      if (typeof op.stop === "function") {
        op.stop(when);
      }
    });
  }
}

function createOutletNode(outlets) {
  let outlet = outlets[0].context.createGain();

  outlets.forEach((_outlet) => {
    _outlet.connect(outlet);
  });

  return outlet;
}

function findOnEndedNode(operators) {
  for (let i = 0, imax = operators.length; i < imax; i++) {
    if (typeof operators[i].onended !== "undefined") {
      return operators[i];
    }
  }

  return { onended: null };
}

export function isValidAlgorithm(algorithm, numOfOperators) {
  let X = String.fromCharCode(64 + numOfOperators);
  let re = new RegExp(`^[A-${X}]-(?:[A-${X}]-)*[>A-${X}]$`, "i");

  return algorithm.indexOf(">") !== -1
    && algorithm.replace(/\s+/g, "").split(";").every(algorithm => re.test(algorithm));
}

export function build(pattern, operators) {
  let algorithm = null;

  if (typeof pattern === "number") {
    algorithm = (ALGORITHMS[operators.length] && ALGORITHMS[operators.length][pattern]) || null;
  } else {
    algorithm = "" + pattern;
  }

  if (26 < operators.length) {
    throw new TypeError("too many operator");
  }
  if (algorithm === null) {
    throw new TypeError(`not found algorithm ${pattern} for ${operators.length} operators`);
  }
  if (!isValidAlgorithm(algorithm, operators.length)) {
    throw new TypeError(`invalid algorithm: ${algorithm}`);
  }

  function findOperatorByName(name) {
    return operators[name.toUpperCase().charCodeAt(0) - 65];
  }

  let outlets = [];
  let graph = {};

  algorithm.replace(/\s+|-/g, "").split(";").forEach((algorithm) => {
    let tokens = algorithm.split("");
    let token = tokens.shift();
    let node = findOperatorByName(token);

    tokens.forEach((nextToken) => {
      if (graph[token]) {
        if (graph[token].indexOf(nextToken) !== -1) {
          return;
        }
        graph[token].push(nextToken);
      } else {
        graph[token] = [ nextToken ];
      }

      let nextNode = findOperatorByName(nextToken);

      if (nextToken === ">") {
        outlets.push(node);
      } else if (nextNode.frequency instanceof global.AudioParam) {
        node.connect(nextNode.frequency);
      } else {
        node.connect(nextNode);
      }

      [ token, node ] = [ nextToken, nextNode ];
    });
  });

  return outlets;
}
