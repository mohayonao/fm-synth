import "web-audio-test-api";
import assert from "power-assert";
import FMSynthUtils from "../src/FMSynthUtils";

describe("FMSynthUtils", () => {
  let audioContext, A, B, C, D;

  beforeEach(() => {
    audioContext = new global.AudioContext();
    A = audioContext.createOscillator();
    B = audioContext.createOscillator();
    C = audioContext.createOscillator();
    D = audioContext.createOscillator();
  });

  describe("build(pattern: number|string, operators: Operator[]): any[]", () => {
    describe("algorithm notation", () => {
      it("works", () => {
        let outlet = FMSynthUtils.build("B-A; A-B; A->", [ A, B ]);

        assert.deepEqual(outlet, [ A ]);
        assert(B.$isConnectedTo(A.frequency));
        assert(A.$isConnectedTo(B.frequency));
      });
    });
    describe("off operator", () => {
      it("works", () => {
        let outlet = FMSynthUtils.build("D-C-B-A->", [ A, B, 0, 0 ]);

        assert.deepEqual(outlet, [ A ]);
        assert(B.$isConnectedTo(A.frequency));
      });
    });
    describe("operators.length === 1", () => {
      describe("algorithim === 0", () => {
        it("works", () => {
          let outlet = FMSynthUtils.build(0, [ A ]);

          assert.deepEqual(outlet, [ A ]);
        });
      });
    });
    describe("operators.length === 2", () => {
      describe("algorithim === 0", () => {
        it("works", () => {
          let outlet = FMSynthUtils.build(0, [ A, B ]);

          assert(B.$isConnectedTo(A.frequency));
          assert.deepEqual(outlet, [ A ]);
        });
      });
      describe("algorithim === 1", () => {
        it("works", () => {
          let outlet = FMSynthUtils.build(1, [ A, B ]);

          assert.deepEqual(outlet, [ A, B ]);
        });
      });
    });
    describe("operators.length === 3", () => {
      describe("algorithim === 0", () => {
        it("works", () => {
          let outlet = FMSynthUtils.build(0, [ A, B, C ]);

          assert(C.$isConnectedTo(B.frequency));
          assert(B.$isConnectedTo(A.frequency));
          assert.deepEqual(outlet, [ A ]);
        });
      });
      describe("algorithim === 1", () => {
        it("works", () => {
          let outlet = FMSynthUtils.build(1, [ A, B, C ]);

          assert(C.$isConnectedTo(A.frequency));
          assert(B.$isConnectedTo(A.frequency));
          assert.deepEqual(outlet, [ A ]);
        });
      });
      describe("algorithim === 2", () => {
        it("works", () => {
          let outlet = FMSynthUtils.build(2, [ A, B, C ]);

          assert(C.$isConnectedTo(B.frequency));
          assert(C.$isConnectedTo(A.frequency));
          assert.deepEqual(outlet, [ A, B ]);
        });
      });
      describe("algorithim === 3", () => {
        it("works", () => {
          let outlet = FMSynthUtils.build(3, [ A, B, C ]);

          assert(C.$isConnectedTo(B.frequency));
          assert.deepEqual(outlet, [ A, B ]);
        });
      });
      describe("algorithim === 4", () => {
        it("works", () => {
          let outlet = FMSynthUtils.build(4, [ A, B, C ]);

          assert.deepEqual(outlet, [ A, B, C ]);
        });
      });
    });
    describe("operators.length === 4", () => {
      describe("algorithim === 0", () => {
        it("works", () => {
          let outlet = FMSynthUtils.build(0, [ A, B, C, D ]);

          assert(D.$isConnectedTo(C.frequency));
          assert(C.$isConnectedTo(B.frequency));
          assert(B.$isConnectedTo(A.frequency));
          assert.deepEqual(outlet, [ A ]);
        });
      });
      describe("algorithim === 1", () => {
        it("works", () => {
          let outlet = FMSynthUtils.build(1, [ A, B, C, D ]);

          assert(D.$isConnectedTo(B.frequency));
          assert(C.$isConnectedTo(B.frequency));
          assert(B.$isConnectedTo(A.frequency));
          assert.deepEqual(outlet, [ A ]);
        });
      });
      describe("algorithim === 2", () => {
        it("works", () => {
          let outlet = FMSynthUtils.build(2, [ A, B, C, D ]);

          assert(D.$isConnectedTo(A.frequency));
          assert(C.$isConnectedTo(B.frequency));
          assert(B.$isConnectedTo(A.frequency));
          assert.deepEqual(outlet, [ A ]);
        });
      });
      describe("algorithim === 3", () => {
        it("works", () => {
          let outlet = FMSynthUtils.build(3, [ A, B, C, D ]);

          assert(D.$isConnectedTo(C.frequency));
          assert(D.$isConnectedTo(B.frequency));
          assert(C.$isConnectedTo(A.frequency));
          assert(B.$isConnectedTo(A.frequency));
          assert.deepEqual(outlet, [ A ]);
        });
      });
      describe("algorithim === 4", () => {
        it("works", () => {
          let outlet = FMSynthUtils.build(4, [ A, B, C, D ]);

          assert(D.$isConnectedTo(C.frequency));
          assert(C.$isConnectedTo(B.frequency));
          assert(C.$isConnectedTo(A.frequency));
          assert.deepEqual(outlet, [ A, B ]);
        });
      });
      describe("algorithim === 5", () => {
        it("works", () => {
          let outlet = FMSynthUtils.build(5, [ A, B, C, D ]);

          assert(D.$isConnectedTo(C.frequency));
          assert(C.$isConnectedTo(B.frequency));
          assert.deepEqual(outlet, [ A, B ]);
        });
      });
      describe("algorithim === 6", () => {
        it("works", () => {
          let outlet = FMSynthUtils.build(6, [ A, B, C, D ]);

          assert(D.$isConnectedTo(A.frequency));
          assert(C.$isConnectedTo(A.frequency));
          assert(B.$isConnectedTo(A.frequency));
          assert.deepEqual(outlet, [ A ]);
        });
      });
      describe("algorithim === 7", () => {
        it("works", () => {
          let outlet = FMSynthUtils.build(7, [ A, B, C, D ]);

          assert(D.$isConnectedTo(C.frequency));
          assert(B.$isConnectedTo(A.frequency));
          assert.deepEqual(outlet, [ A, B ]);
        });
      });
      describe("algorithim === 8", () => {
        it("works", () => {
          let outlet = FMSynthUtils.build(8, [ A, B, C, D ]);

          assert(D.$isConnectedTo(C.frequency));
          assert(D.$isConnectedTo(B.frequency));
          assert(D.$isConnectedTo(A.frequency));
          assert.deepEqual(outlet, [ A, B, C ]);
        });
      });
      describe("algorithim === 9", () => {
        it("works", () => {
          let outlet = FMSynthUtils.build(9, [ A, B, C, D ]);

          assert(D.$isConnectedTo(C.frequency));
          assert.deepEqual(outlet, [ A, B, C ]);
        });
      });
      describe("algorithim === 10", () => {
        it("works", () => {
          let outlet = FMSynthUtils.build(10, [ A, B, C, D ]);

          assert.deepEqual(outlet, [ A, B, C, D ]);
        });
      });
    });
    describe("given invalid parameter", () => {
      it("throws TypeError", () => {
        assert.throws(() => {
          FMSynthUtils.build(0, [
            A, B, C, D, A, B, C, D, A, B,
            A, B, C, D, A, B, C, D, A, B,
            A, B, C, D, A, B, C, D, A, B,
          ]);
        }, (e) => {
          return e instanceof TypeError && /too many operator/i.test(e.message);
        });
        assert.throws(() => {
          FMSynthUtils.build(99, [ A, B, C, D ]);
        }, (e) => {
          return e instanceof TypeError && /not found algorithm/i.test(e.message);
        });
        assert.throws(() => {
          FMSynthUtils.build("@_@;", [ A, B, C, D ]);
        }, (e) => {
          return e instanceof TypeError && /invalid algorithm/i.test(e.message);
        });
        assert.throws(() => {
          FMSynthUtils.build("D-C-B-A->", [ 0, 0, 0, 0 ]);
        }, (e) => {
          return e instanceof TypeError && /no output/i.test(e.message);
        });
      });
    });
  });
  describe("isValidAlgorithm(pattern: string, length: number): boolean", () => {
    it("works", () => {
      assert(FMSynthUtils.isValidAlgorithm("D-C-B-A->", 4));
      assert(FMSynthUtils.isValidAlgorithm("D-B; C-B; B-A->", 4));
      assert(FMSynthUtils.isValidAlgorithm("D-A->; C-B-A; A->", 4));
      assert(!FMSynthUtils.isValidAlgorithm("D->", 3));
      assert(!FMSynthUtils.isValidAlgorithm("B-A", 4));
      assert(!FMSynthUtils.isValidAlgorithm("B->A", 4));
      assert(!FMSynthUtils.isValidAlgorithm("-A->", 4));
      assert(!FMSynthUtils.isValidAlgorithm("A-->", 4));
    });
  });
});
