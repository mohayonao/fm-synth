# FM SYNTH

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
- `outlet: AudioNode`
- `operators: any[]`
- `algorithm: string`
- `onended: EventHandler`

#### Instance methods
- `connect(destination: AudioNode): void`
- `disconnect(): void`
- `start(when: number): void`
- `stop(when: number): void`

## See Also
- [@mohayonao/operator](https://github.com/mohayonao/operator) - simple operator

## License
MIT
