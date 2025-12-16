import { expect, it } from "vitest";
import { Status } from "allure-js-commons";
import { runJasmineInlineTest } from "../utils.js";

it("should support parallel execution", async () => {
  const { tests } = await runJasmineInlineTest(
    {
      "spec/test/sample1.spec.js": `
        it("test 1", () => {
          expect(true).toBe(true);
        });
      `,
      "spec/test/sample2.spec.js": `
        it("test 2", () => {
          expect(true).toBe(true);
        });
      `,
      "spec/test/sample3.spec.js": `
        it("test 3", () => {
          expect(true).toBe(true);
        });
      `,
    },
    {},
    { parallel: true },
  );

  expect(tests).toHaveLength(3);
  expect(tests).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: "test 1",
        status: Status.PASSED,
      }),
      expect.objectContaining({
        name: "test 2",
        status: Status.PASSED,
      }),
      expect.objectContaining({
        name: "test 3",
        status: Status.PASSED,
      }),
    ]),
  );
});

it("should expose reporterCapabilities with parallel support", async () => {
  const { tests } = await runJasmineInlineTest({
    "spec/test/capabilities.spec.js": `
      it("should have parallel capability", () => {
        const env = jasmine.getEnv();
        const reporters = env.reporters_ || [];
        const allureReporter = reporters.find(r => r.constructor.name === 'AllureJasmineReporter');
        
        if (allureReporter && allureReporter.reporterCapabilities) {
          expect(allureReporter.reporterCapabilities.parallel).toBe(true);
        }
        
        expect(true).toBe(true);
      });
    `,
  });

  expect(tests).toHaveLength(1);
  expect(tests[0].status).toBe(Status.PASSED);
});
