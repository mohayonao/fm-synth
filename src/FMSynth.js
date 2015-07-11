import FMSynthUtils from "./FMSynthUtils";

const OUTLETS = typeof Symbol !== "undefined" ? Symbol("OUTLETS") : "_@mohayonao/operator:OUTLETS";
const OPERATORS = typeof Symbol !== "undefined" ? Symbol("OPERATORS") : "_@mohayonao/operator:OPERATORS";
const ALGORITHM = typeof Symbol !== "undefined" ? Symbol("ALGORITHM") : "_@mohayonao/operator:ALGORITHM";
const ONENDED = typeof Symbol !== "undefined" ? Symbol("ONENDED") : "_@mohayonao/operator:ONENDED";

export default class FMSynth {
  constructor(algorithm, operators) {
    let outlets = FMSynthUtils.build(algorithm, operators);

    this[OUTLETS] = outlets;
    this[OPERATORS] = operators;
    this[ALGORITHM] = algorithm;
    this[ONENDED] = findOnEndedNode(operators);
  }

  get context() {
    return this[OUTLETS][0].context;
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
    this[OUTLETS].forEach((outlet) => {
      outlet.connect(destination);
    });
  }

  disconnect(...args) {
    this[OUTLETS].forEach((outlet) => {
      outlet.disconnect(...args);
    });
  }

  start(when) {
    this[OPERATORS].forEach((op) => {
      if (op && typeof op.start === "function") {
        op.start(when);
      }
    });
  }

  stop(when) {
    this[OPERATORS].forEach((op) => {
      if (op && typeof op.stop === "function") {
        op.stop(when);
      }
    });
  }
}

function findOnEndedNode(operators) {
  for (let i = 0, imax = operators.length; i < imax; i++) {
    if (typeof operators[i].onended !== "undefined") {
      return operators[i];
    }
  }

  return { onended: null };
}
