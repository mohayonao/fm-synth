# FM SYNTH
[![Build Status](http://img.shields.io/travis/mohayonao/fm-synth.svg?style=flat-square)](https://travis-ci.org/mohayonao/fm-synth)
[![NPM Version](http://img.shields.io/npm/v/@mohayonao/fm-synth.svg?style=flat-square)](https://www.npmjs.org/package/@mohayonao/fm-synth)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

> simple frequency modulation synthesizer

## Installation

Node.js

```sh
npm install @mohayonao/fm-synth
```

Browser

- [fm-synth.js](https://raw.githubusercontent.com/mohayonao/fm-synth/master/build/fm-synth.js)

## API
### Operator
- `constructor(algorithm: number|string, operators: any[])`

#### Instance attribute
- `context: AudioContext`
- `operators: any[]`
- `algorithm: string`
- `onended: function`

#### Instance methods
- `connect(destination: AudioNode): void`
- `disconnect(): void`
- `start(when: number): void`
- `stop(when: number): void`

## Algorithm Notation
```js
let A = audioContext.createDelay();
let B = new Operator(audioContext);
let C = new Operator(audioContext);
let D = new Operator(audioContext);
let fm = new FMSynth("D-C->; B-A->", [ A, B, C, D ]);
```

- `A`, `B`, `C` ... `Z`: index of the operator array
- `-`: connection (connects to a node's frequency or node self if not has frequency)
- `>`: connection to output
- `;`: separator

Now, the instance of FMSynth builds the below graph by the given algorithm `"D-C->; B-A->"`.

![fm-synth](https://raw.githubusercontent.com/wiki/mohayonao/fm-synth/images/fm-synth.png)

## Algorithm Presets
### 1 Operator
![1 operator algorithm](https://raw.githubusercontent.com/wiki/mohayonao/fm-synth/images/1-op-alg.png)

### 2 Operators
![2 operators algorithm](https://raw.githubusercontent.com/wiki/mohayonao/fm-synth/images/2-op-alg.png)

### 3 Operators
![3 operators algorithm](https://raw.githubusercontent.com/wiki/mohayonao/fm-synth/images/3-op-alg.png)

### 4 Operators
![4 operators algorithm](https://raw.githubusercontent.com/wiki/mohayonao/fm-synth/images/4-op-alg.png)

## See Also
- [@mohayonao/operator](https://github.com/mohayonao/operator) - simple operator

## License
MIT
