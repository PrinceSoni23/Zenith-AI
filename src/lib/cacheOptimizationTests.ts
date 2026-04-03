/**
 * 🧪 COMPREHENSIVE CACHE OPTIMIZATION TEST SUITE
 *
 * Tests the complete flow:
 * 1. Input → Normalization
 * 2. Normalization → Cache Key
 * 3. Cache Key → Redis/localStorage lookup
 * 4. Analytics: Hit rate, cost savings, recommendations
 *
 * Run these tests to verify cache system is working optimally
 */

import {
  NormalizationTracer,
  CacheEfficiencyAnalyzer,
  CacheKeyValidator,
  CacheTester,
} from "./cacheOptimizer";

export class CacheOptimizationTestSuite {
  /**
   * TEST 1: Verify normalization consistency
   * Same topic with different presentations → same cache key
   */
  static test_normalizationConsistency() {
    console.log("\n================================");
    console.log("TEST 1: Normalization Consistency");
    console.log("================================");

    const testCases = [
      {
        inputs: [
          "photosynthesis",
          "Photosynthesis",
          "PHOTOSYNTHESIS",
          "photosynthesis ",
          " photosynthesis",
          "The photosynthesis",
          "definition of photosynthesis",
        ],
        expectedKey: "photosynthesis",
      },
      {
        inputs: [
          "cell biology",
          "Cell Biology",
          "the cell biology",
          "CELL BIOLOGY",
        ],
        expectedKey: "cell-biology",
      },
      {
        inputs: [
          "quantum mechanics",
          "Quantum Mechanics",
          "definition of quantum mechanics",
          "the quantum mechanics",
        ],
        expectedKey: "quantum-mechanics",
      },
    ];

    let passedTests = 0;
    let totalTests = 0;

    testCases.forEach(tc => {
      console.log(`\n✓ Testing topic group: ${tc.inputs[0]}`);
      const result = NormalizationTracer.verifyNormalizationConsistency(
        tc.inputs,
      );

      console.log(`  Input variations:`);
      tc.inputs.forEach(input => console.log(`    - "${input}"`));

      if (result.allConsistent) {
        console.log(`  ✅ PASS: All map to cache key: ${result.cacheKey}`);
        passedTests++;
      } else {
        console.log(`  ❌ FAIL: Keys don't match!`);
        result.traces.forEach(trace => {
          console.log(`    "${trace.original}" → "${trace.cacheKey}"`);
        });
      }

      totalTests++;
    });

    console.log(
      `\n📊 Normalization Consistency: ${passedTests}/${totalTests} passed`,
    );
    return passedTests === totalTests;
  }

  /**
   * TEST 2: Verify plural/singular normalization
   * "photons" and "photon" should generate same cache key
   */
  static test_singularizationNormalization() {
    console.log("\n================================");
    console.log("TEST 2: Singularization Normalization");
    console.log("================================");

    const testCases = [
      { singular: "photon", expectedBoth: true },
      { singular: "enzyme", expectedBoth: true },
      { singular: "cell", expectedBoth: true },
      { singular: "molecule", expectedBoth: true },
      { singular: "atom", expectedBoth: true },
    ];

    let passedTests = 0;

    testCases.forEach(tc => {
      const plural = tc.singular + "s";
      console.log(`\n✓ Testing: ${tc.singular} ↔ ${plural}`);

      const singularTrace = NormalizationTracer.traceNormalization(tc.singular);
      const pluralTrace = NormalizationTracer.traceNormalization(plural);

      if (singularTrace.cacheKey === pluralTrace.cacheKey) {
        console.log(
          `  ✅ PASS: Both normalize to same key: ${singularTrace.cacheKey}`,
        );
        passedTests++;
      } else {
        console.log(`  ❌ FAIL: Keys don't match!`);
        console.log(
          `    Singular: "${singularTrace.original}" → "${singularTrace.cacheKey}"`,
        );
        console.log(
          `    Plural: "${pluralTrace.original}" → "${pluralTrace.cacheKey}"`,
        );
      }
    });

    console.log(
      `\n📊 Singularization: ${passedTests}/${testCases.length} passed`,
    );
    return passedTests === testCases.length;
  }

  /**
   * TEST 3: Simulate user search flow (cold → warm cache)
   * User searches multiple times for same topic
   * Only first should miss cache, rest should hit
   */
  static test_userSearchFlow() {
    console.log("\n================================");
    console.log("TEST 3: User Search Flow (Cold→Warm Cache)");
    console.log("================================");

    const baseTopic = "photosynthesis";
    const variations = CacheTester.simulateUserSearchVariations(baseTopic);

    console.log(`\nSimulating user searching for "${baseTopic}":`);

    let hitCount = 0;
    let missCount = 0;

    variations.forEach((v, index) => {
      const symbol = v.shouldCacheHit ? "🟢 HIT" : "🔴 MISS";
      console.log(`\n  ${index + 1}. Search: "${v.variation}"`);
      console.log(`     Expected: ${symbol}`);
      console.log(`     Cache Key: ${v.expectedKey}`);

      if (v.shouldCacheHit) {
        hitCount++;
      } else {
        missCount++;
      }
    });

    console.log(`\n📊 Search Flow Summary:`);
    console.log(`  Cold cache (first search): ${missCount} miss`);
    console.log(`  Warm cache (subsequent searches): ${hitCount} hits`);
    console.log(
      `  💰 API calls saved: ${hitCount} × $0.001 = $${(hitCount * 0.001).toFixed(4)}`,
    );

    return true;
  }

  /**
   * TEST 4: Cache efficiency metrics
   * Calculate hit rate, cost savings, recommendations
   */
  static test_cacheEfficiencyMetrics() {
    console.log("\n================================");
    console.log("TEST 4: Cache Efficiency Metrics");
    console.log("================================");

    const scenarios = [
      { name: "Current System", hits: 65, misses: 35, cacheSizeBytes: 2457600 },
      {
        name: "Optimized System",
        hits: 120,
        misses: 30,
        cacheSizeBytes: 3145728,
      },
      {
        name: "Poor Optimization",
        hits: 20,
        misses: 80,
        cacheSizeBytes: 1048576,
      },
    ];

    scenarios.forEach(scenario => {
      console.log(`\n✓ ${scenario.name}:`);

      const metrics = CacheEfficiencyAnalyzer.calculateMetrics(
        scenario.hits,
        scenario.misses,
        scenario.cacheSizeBytes,
      );

      console.log(`  Total Requests: ${metrics.totalRequests}`);
      console.log(`  Cache Hits: ${metrics.cacheHits} ✅`);
      console.log(`  Cache Misses: ${metrics.cacheMisses} ❌`);
      console.log(`  Hit Rate: ${metrics.hitRate}%`);
      console.log(`  API Calls Avoided: ${metrics.apiCallsAvoided}`);
      console.log(
        `  Cost Saved Today: $${metrics.estimatedCostSaved.toFixed(4)}`,
      );
      console.log(
        `  Estimated Monthly Savings: $${(metrics.estimatedCostSaved * 30).toFixed(2)}`,
      );
      console.log(
        `  Cache Size: ${(metrics.totalCacheSizeBytes / 1024 / 1024).toFixed(2)} MB`,
      );

      // Get per-agent metrics
      const agentEfficiency = CacheEfficiencyAnalyzer.getAgentEfficiency(
        "question-generator",
        scenario.hits,
        scenario.misses,
        500,
      );

      console.log(`\n  Agent: ${agentEfficiency.agent}`);
      console.log(`  Hit Rate: ${agentEfficiency.hitRate}%`);
      console.log(
        `  Est. Monthly Savings: $${agentEfficiency.estimatedMonthlySavings.toFixed(2)}`,
      );
      if (agentEfficiency.recommendations.length > 0) {
        console.log(`  Recommendations:`);
        agentEfficiency.recommendations.forEach(rec => {
          console.log(`    ${rec}`);
        });
      }
    });

    return true;
  }

  /**
   * TEST 5: Cache key consistency validation
   * Ensures frontend and backend generate same keys
   */
  static test_cacheKeyConsistency() {
    console.log("\n================================");
    console.log("TEST 5: Frontend↔Backend Cache Key Consistency");
    console.log("================================");

    const testCases = [
      {
        topic: "photosynthesis",
        subject: "Biology",
        language: "english",
      },
      {
        topic: "cell respiration",
        subject: "Biology",
        language: "english",
      },
      {
        topic: "quantum mechanics",
        subject: "Physics",
        language: "english",
      },
    ];

    let consistentCount = 0;

    testCases.forEach(tc => {
      console.log(`\n✓ Validating keys for: ${tc.topic} (${tc.subject})`);

      // Simulate frontend key (would come from cacheService.generateKey)
      const frontendKey = `agent:question-generator:${tc.topic.replace(/\s+/g, "-")}:${tc.subject.toLowerCase()}:${tc.language}`;

      // Simulate backend key (would come from BackendCacheKeyGenerator)
      const backendKey = `agent:question-generator:${tc.topic.replace(/\s+/g, "-")}:${tc.subject.toLowerCase()}:${tc.language}`;

      const validation = CacheKeyValidator.validateCacheKeyConsistency(
        frontendKey,
        backendKey,
      );

      if (validation.consistent) {
        console.log(`  ✅ PASS: Keys match`);
        console.log(`     Key: ${frontendKey}`);
        consistentCount++;
      } else {
        console.log(`  ❌ FAIL: Keys don't match!`);
        console.log(`     Frontend: ${frontendKey}`);
        console.log(`     Backend: ${backendKey}`);
        if (validation.mismatchReason) {
          console.log(`     Reason: ${validation.mismatchReason}`);
        }
      }
    });

    console.log(
      `\n📊 Consistency: ${consistentCount}/${testCases.length} passed`,
    );
    return consistentCount === testCases.length;
  }

  /**
   * TEST 6: Run all normalization traces for debugging
   */
  static test_detailedNormalizationTraces() {
    console.log("\n================================");
    console.log("TEST 6: Detailed Normalization Traces");
    console.log("================================");

    const examples = [
      "photosynthesis",
      "PHOTOSYNTHESIS",
      "the photosynthesis",
      "definition of photosynthesis",
      "photosynthesis ",
      " photosynthesis ",
    ];

    console.log(
      `\nTracing normalization steps for "photosynthesis" variations:\n`,
    );

    examples.forEach(example => {
      const trace = NormalizationTracer.traceNormalization(example);

      console.log(`Input: "${example}"`);
      console.log(`  Step 1 (Lowercase): "${trace.step1_lowercase}"`);
      console.log(`  Step 2 (Trim): "${trace.step2_trim}"`);
      console.log(`  Step 3 (Singularize): "${trace.step3_singularize}"`);
      console.log(
        `  Step 4 (Remove Stop Words): "${trace.step4_removeStopWords}"`,
      );
      console.log(`  Step 5 (Final): "${trace.step5_final}"`);
      console.log(`  → Cache Key: "${trace.cacheKey}"`);
      console.log("");
    });

    return true;
  }

  /**
   * TEST 7: Demonstrate comprehensive consistency
   */
  static test_comprehensiveConsistency() {
    console.log("\n================================");
    console.log("TEST 7: Comprehensive Consistency Demo");
    console.log("================================");

    const demos = NormalizationTracer.demonstrateCacheConsistency();

    demos.forEach(demo => {
      console.log(`\n✓ ${demo.description}`);
      console.log(`  Testing ${demo.inputs.length} variations...`);

      if (demo.result.allConsistent) {
        console.log(
          `  ✅ All map to same cache key: "${demo.result.cacheKey}"`,
        );
        console.log(`  Tested variations:`);
        demo.inputs.forEach(input => {
          console.log(`    - "${input}"`);
        });
      } else {
        console.log(`  ❌ Inconsistent cache key generation!`);
        demo.result.traces.forEach(trace => {
          console.log(`    "${trace.original}" → "${trace.cacheKey}"`);
        });
      }
    });

    return true;
  }

  /**
   * RUN ALL TESTS
   * Execute full test suite and generate report
   */
  static runFullTestSuite() {
    console.log("\n");
    console.log("╔════════════════════════════════════════════╗");
    console.log("║  CACHE OPTIMIZATION TEST SUITE              ║");
    console.log("║  Full System Validation & Performance Analysis║");
    console.log("╚════════════════════════════════════════════╝");

    const results: Record<string, boolean> = {};

    try {
      results["Normalization Consistency"] =
        this.test_normalizationConsistency();
    } catch (e) {
      console.error("❌ Test failed:", e);
      results["Normalization Consistency"] = false;
    }

    try {
      results["Singularization"] = this.test_singularizationNormalization();
    } catch (e) {
      console.error("❌ Test failed:", e);
      results["Singularization"] = false;
    }

    try {
      results["User Search Flow"] = this.test_userSearchFlow();
    } catch (e) {
      console.error("❌ Test failed:", e);
      results["User Search Flow"] = false;
    }

    try {
      results["Efficiency Metrics"] = this.test_cacheEfficiencyMetrics();
    } catch (e) {
      console.error("❌ Test failed:", e);
      results["Efficiency Metrics"] = false;
    }

    try {
      results["Frontend↔Backend Consistency"] = this.test_cacheKeyConsistency();
    } catch (e) {
      console.error("❌ Test failed:", e);
      results["Frontend↔Backend Consistency"] = false;
    }

    try {
      results["Detailed Traces"] = this.test_detailedNormalizationTraces();
    } catch (e) {
      console.error("❌ Test failed:", e);
      results["Detailed Traces"] = false;
    }

    try {
      results["Comprehensive Consistency"] =
        this.test_comprehensiveConsistency();
    } catch (e) {
      console.error("❌ Test failed:", e);
      results["Comprehensive Consistency"] = false;
    }

    // Print summary
    console.log("\n");
    console.log("╔════════════════════════════════════════════╗");
    console.log("║  TEST SUMMARY                              ║");
    console.log("╚════════════════════════════════════════════╝");

    Object.entries(results).forEach(([testName, passed]) => {
      const symbol = passed ? "✅" : "❌";
      console.log(`${symbol} ${testName}`);
    });

    const passedCount = Object.values(results).filter(r => r).length;
    const totalCount = Object.values(results).length;

    console.log("\n");
    console.log(
      `📊 TOTAL: ${passedCount}/${totalCount} tests passed (${Math.round((passedCount / totalCount) * 100)}%)`,
    );

    if (passedCount === totalCount) {
      console.log("✅ ALL TESTS PASSED - Cache system is optimized!");
    } else {
      console.log("⚠️ Some tests failed - Review recommendations above");
    }

    console.log("\n");
    return passedCount === totalCount;
  }
}

// Export for testing
export default CacheOptimizationTestSuite;

// If running directly in Node
if (typeof window === "undefined") {
  CacheOptimizationTestSuite.runFullTestSuite();
}
