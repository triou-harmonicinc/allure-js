import AllureJasmineReporter from "./index.js";

// Jasmine 5+ parallel mode support
// This module is loaded in each worker process to inject the Allure reporter
// It follows the same pattern as allure-mocha's parallel support

// When Jasmine runs in parallel mode, each worker process needs its own
// instance of the Allure reporter. The reporter will write test results
// independently, which naturally combine in the results folder.

const jasmineEnv = (globalThis as any).jasmine?.getEnv();

if (jasmineEnv) {
  // Retrieve the Allure configuration that was passed from the main process
  // This is typically set via environment variables or global configuration
  const allureConfig = (globalThis as any).__allureJasmineConfig || {};
  
  // Create an Allure reporter instance for this worker
  const allureReporter = new AllureJasmineReporter({
    ...allureConfig,
    isInWorker: true,
  });

  // Add the Allure reporter to the worker's Jasmine environment
  jasmineEnv.addReporter(allureReporter);
}
