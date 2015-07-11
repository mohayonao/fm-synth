import "web-audio-test-api";
import assert from "power-assert";
import sinon from "sinon";
import FMSynth from "../src/FMSynth";

describe("FMSynth", () => {
  let audioContext, A, B, C, D;

  beforeEach(() => {
    audioContext = new global.AudioContext();
    A = audioContext.createGain();
    B = audioContext.createOscillator();
    C = audioContext.createGain();
    D = audioContext.createOscillator();
  });

  describe("constructor(algorithm: string, operators: Operator[])", () => {
    it("works", () => {
      let fm = new FMSynth("D-C-B-A->", [ A, B, C, D ]);

      assert(fm instanceof FMSynth);
    });
  });
  describe("#context: AudioContext", () => {
    it("works", () => {
      let fm = new FMSynth("D-C-B-A->", [ A, B, C, D ]);

      assert(fm.context === audioContext);
    });
  });
  describe("#operators: Operator[]", () => {
    it("works", () => {
      let fm = new FMSynth("D-C-B-A->", [ A, B, C, D ]);

      assert.deepEqual(fm.operators, [ A, B, C, D ]);
    });
  });
  describe("#algorithm: string", () => {
    it("works", () => {
      let fm = new FMSynth("D-C-B-A->", [ A, B, C, D ]);

      assert(fm.algorithm === "D-C-B-A->");
    });
  });
  describe("#onended: function", () => {
    it("works", () => {
      let fm = new FMSynth("D-C-B-A->", [ A, B, C, D ]);

      fm.onended = sinon.spy();

      assert(fm.onended === B.onended);
    });
    it("works when operators have no onended", () => {
      let fm = new FMSynth("A->", [ A ]);
      let spy = sinon.spy();

      fm.onended = spy;

      assert(fm.onended === spy);
      assert(typeof A.onended === "undefined");
    });
  });
  describe("#connect(destination: AudioNode): void", () => {
    it("works", () => {
      let fm = new FMSynth("D-C-B-A->", [ A, B, C, D ]);

      fm.connect(audioContext.destination);

      assert(audioContext.destination.$isConnectedFrom(A));
    });
  });
  describe("#disconnect(destination: AudioNode): void", () => {
    it("works", () => {
      let fm = new FMSynth("D-C-B-A->", [ A, B, C, D ]);

      fm.connect(audioContext.destination);
      fm.disconnect(0);

      assert(!audioContext.destination.$isConnectedFrom(A));
    });
  });
  describe("#start(when: number): void", () => {
    it("works", () => {
      let fm = new FMSynth("D-C-B-A->", [ A, B, C, D ]);

      fm.start(1);

      assert(B.$startTime === 1);
      assert(D.$startTime === 1);
    });
  });
  describe("#start(when: number): void", () => {
    it("works", () => {
      let fm = new FMSynth("D-C-B-A->", [ A, B, C, D ]);

      fm.start(1);
      fm.stop(2);

      assert(B.$stopTime === 2);
      assert(D.$stopTime === 2);
    });
  });
});
