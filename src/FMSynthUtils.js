import ALGORITHMS from "./algorithms";

function build(pattern, operators) {
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
    let token, node;

    while (!node && tokens.length) {
      token = tokens.shift();
      node = findOperatorByName(token);
    }

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
      } else if (typeof nextNode.frequency === "object") {
        node.connect(nextNode.frequency);
      } else {
        node.connect(nextNode);
      }

      [ token, node ] = [ nextToken, nextNode ];
    });
  });

  if (outlets.length === 0) {
    throw new TypeError(`no output`);
  }

  return outlets;
}

function isValidAlgorithm(algorithm, numOfOperators) {
  let X = String.fromCharCode(64 + numOfOperators);
  let re = new RegExp(`^[A-${X}]-(?:[A-${X}]-)*[>A-${X}]$`, "i");

  return algorithm.indexOf(">") !== -1
    && algorithm.replace(/\s+/g, "").split(";").every(algorithm => re.test(algorithm));
}

export default {
  build,
  isValidAlgorithm,
};
