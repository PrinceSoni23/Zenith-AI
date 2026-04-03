/**
 * 🚀 CACHE OPTIMIZATION & MONITORING SYSTEM
 *
 * Purpose: Maximize cache hits to reduce AI API calls by 70-90%
 *
 * Flow:
 * 1. User input → Normalization (inputNormalization.ts)
 * 2. Normalized input → Cache key generation
 * 3. Cache key → Redis lookup (backend) / localStorage (frontend)
 * 4. Cache HIT = No API call (Cost: $0)
 * 5. Cache MISS = API call needed (Cost: $0.001-0.01 per call)
 *
 * Goal: Achieve 60-80% cache hit rate across all agents
 */

interface NormalizationTrace {
  original: string;
  step1_lowercase: string;
  step2_trim: string;
  step3_singularize: string;
  step4_removeStopWords: string;
  step5_final: string;
  cacheKey: string;
}

interface CacheMetrics {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  hitRate: number;
  estimatedCostSaved: number; // in USD
  apiCallsAvoided: number;
  totalCacheSizeBytes: number;
  topCachedTopics: Array<{ topic: string; hitCount: number }>;
  topMissedTopics: Array<{ topic: string; missCount: number }>;
}

interface CacheEfficiency {
  agent: string;
  hitRate: number;
  avgProcessingTime: number;
  estimatedMonthlySavings: number; // in USD
  recommendations: string[];
}

/**
 * 🎯 CRITICAL: Trace each normalization step to verify cache key consistency
 * This ensures "Photosynthesis", "photosynthesis", "photosynthesis " all generate SAME cache key
 */
export class NormalizationTracer {
  /**
   * Trace full normalization pipeline for debugging
   * Shows exactly how input is transformed into cache key
   */
  static traceNormalization(input: string): NormalizationTrace {
    // Step 1: Lowercase
    const step1 = input.toLowerCase();

    // Step 2: Trim whitespace
    const step2 = step1.trim();

    // Step 3: Singularize (photons → photon)
    const step3 = this.applySingularization(step2);

    // Step 4: Remove stop words (definition of photosynthesis → photosynthesis)
    const step4 = this.removeStopWords(step3);

    // Step 5: Final normalization
    const step5 = step4.trim().replace(/\s+/g, " ");

    // Generate cache key
    const cacheKey = this.generateCacheKey(step5);

    return {
      original: input,
      step1_lowercase: step1,
      step2_trim: step2,
      step3_singularize: step3,
      step4_removeStopWords: step4,
      step5_final: step5,
      cacheKey,
    };
  }

  /**
   * Verify two different inputs generate SAME cache key
   * This validates singularization and stop word removal work correctly
   */
  static verifyNormalizationConsistency(inputs: string[]): {
    allConsistent: boolean;
    cacheKey: string;
    traces: NormalizationTrace[];
  } {
    const traces = inputs.map(input => this.traceNormalization(input));
    const cacheKeys = traces.map(t => t.cacheKey);
    const allConsistent = new Set(cacheKeys).size === 1;

    return {
      allConsistent,
      cacheKey: cacheKeys[0] || "",
      traces,
    };
  }

  /**
   * Show how similar inputs map to same cache entry
   * Helps verify cache efficiency
   */
  static demonstrateCacheConsistency() {
    const testCases = [
      // Same topic, different presentations
      {
        inputs: [
          "photosynthesis",
          "Photosynthesis",
          "PHOTOSYNTHESIS",
          "photosynthesis ",
          " photosynthesis",
          "the photosynthesis",
          "definition of photosynthesis",
        ],
        description: "Single topic - should all map to same cache key",
      },
      // Plurals → Singulars
      {
        inputs: [
          "photons",
          "photon",
          "Photons",
          "the photons",
          "definition of photons",
        ],
        description: "Singular/Plural variations - should all map to 'photon'",
      },
      // Compound topics
      {
        inputs: [
          "cell biology",
          "Cell Biology",
          "the cell biology",
          "definition of cell biology",
        ],
        description: "Compound topic - should normalize consistently",
      },
    ];

    return testCases.map(tc => ({
      ...tc,
      result: this.verifyNormalizationConsistency(tc.inputs),
    }));
  }

  private static applySingularization(input: string): string {
    const singularMap: Record<string, string> = {
      photons: "photon",
      electrons: "electron",
      molecules: "molecule",
      atoms: "atom",
      enzymes: "enzyme",
      proteins: "protein",
      cells: "cell",
      tissues: "tissue",
      organs: "organ",
      ions: "ion",
      wavelengths: "wavelength",
      frequencies: "frequency",
      forces: "force",
      energies: "energy",
      reactions: "reaction",
      elements: "element",
      compounds: "compound",
      // ... add more as needed
    };

    const words = input.toLowerCase().split(/\s+/);
    return words.map(word => singularMap[word] || word).join(" ");
  }

  private static removeStopWords(input: string): string {
    const stopWords = [
      "the",
      "a",
      "an",
      "of",
      "is",
      "are",
      "definition",
      "explain",
      "describe",
      "define",
      "and",
      "or",
      "but",
    ];
    const words = input.toLowerCase().split(/\s+/);
    return words.filter(word => !stopWords.includes(word)).join(" ");
  }

  private static generateCacheKey(normalized: string): string {
    // Simple hash-based key (in production, use crypto)
    return normalized.replace(/\s+/g, "-").toLowerCase();
  }
}

/**
 * 🎯 CACHE EFFICIENCY ANALYZER
 * Provides insights into how well caching is working
 */
export class CacheEfficiencyAnalyzer {
  private static readonly COST_PER_API_CALL = 0.001; // $0.001 per call (approximate)

  /**
   * Calculate overall cache metrics
   * Shows how many API calls were avoided through caching
   */
  static calculateMetrics(
    hits: number,
    misses: number,
    cacheSizeBytes: number,
  ): CacheMetrics {
    const totalRequests = hits + misses;
    const hitRate =
      totalRequests === 0 ? 0 : Math.round((hits / totalRequests) * 100);
    const apiCallsAvoided = hits;
    const estimatedCostSaved = hits * this.COST_PER_API_CALL;

    return {
      totalRequests,
      cacheHits: hits,
      cacheMisses: misses,
      hitRate,
      estimatedCostSaved,
      apiCallsAvoided,
      totalCacheSizeBytes: cacheSizeBytes,
      topCachedTopics: [],
      topMissedTopics: [],
    };
  }

  /**
   * Estimate monthly savings based on current cache performance
   * Extrapolates current hit rate to monthly usage
   */
  static estimateMonthlySavings(
    dailyRequests: number,
    currentHitRate: number,
  ): number {
    const monthlyCalls = dailyRequests * 30;
    const callsAvoided = monthlyCalls * (currentHitRate / 100);
    return callsAvoided * this.COST_PER_API_CALL;
  }

  /**
   * Get per-agent efficiency metrics
   * Shows which agents benefit most from caching
   */
  static getAgentEfficiency(
    agentType: string,
    hits: number,
    misses: number,
    avgProcessingTimeMs: number,
  ): CacheEfficiency {
    const hitRate =
      hits + misses === 0 ? 0 : Math.round((hits / (hits + misses)) * 100);
    const agentDailyCalls = (hits + misses) / 30; // Assume data collected over 30 days
    const monthlySavings = this.estimateMonthlySavings(
      agentDailyCalls,
      hitRate,
    );

    const recommendations: string[] = [];

    if (hitRate < 40) {
      recommendations.push(
        `⚠️ ${agentType} has LOW cache hit rate (${hitRate}%). Expand UNKNOWN_TOPIC_PATTERNS dictionary or improve fuzzy matching.`,
      );
    } else if (hitRate < 60) {
      recommendations.push(
        `📊 ${agentType} has MEDIUM cache hit rate (${hitRate}%). Good progress, but room for improvement.`,
      );
    } else {
      recommendations.push(
        `✅ ${agentType} has EXCELLENT cache hit rate (${hitRate}%)! Continue monitoring.`,
      );
    }

    if (avgProcessingTimeMs > 1000 && hitRate > 60) {
      recommendations.push(
        `💡 Consider implementing edge caching for ${agentType} since cached responses should be <100ms.`,
      );
    }

    return {
      agent: agentType,
      hitRate,
      avgProcessingTime: avgProcessingTimeMs,
      estimatedMonthlySavings: monthlySavings,
      recommendations,
    };
  }
}

/**
 * 🎯 CACHE KEY VALIDATOR
 * Ensures cache keys are generated consistently across frontend and backend
 */
export class CacheKeyValidator {
  /**
   * Verify that frontend and backend generate identical cache keys
   * This is CRITICAL for cache hits to work
   */
  static validateCacheKeyConsistency(
    frontendCacheKey: string,
    backendCacheKey: string,
  ): {
    consistent: boolean;
    mismatchReason?: string;
  } {
    if (frontendCacheKey === backendCacheKey) {
      return { consistent: true };
    }

    // Debugging to find why keys don't match
    const mismatchReasons: string[] = [];

    if (frontendCacheKey.length !== backendCacheKey.length) {
      mismatchReasons.push(
        `Length mismatch: FE=${frontendCacheKey.length}, BE=${backendCacheKey.length}`,
      );
    }

    if (frontendCacheKey.toLowerCase() !== backendCacheKey.toLowerCase()) {
      mismatchReasons.push("Case sensitivity difference detected");
    }

    if (
      frontendCacheKey.replace(/\s+/g, "") !==
      backendCacheKey.replace(/\s+/g, "")
    ) {
      mismatchReasons.push("Whitespace handling difference detected");
    }

    return {
      consistent: false,
      mismatchReason: mismatchReasons.join("; "),
    };
  }

  /**
   * Generate canonical cache key from parameters
   * Both frontend and backend should use this same logic
   */
  static generateCanonicalKey(
    agentType: string,
    topic?: string,
    subject?: string,
    language?: string,
  ): string {
    const parts = [agentType];

    if (topic) parts.push(topic.toLowerCase().replace(/\s+/g, "-"));
    if (subject) parts.push(subject.toLowerCase().replace(/\s+/g, "-"));
    if (language) parts.push(language.toLowerCase());

    return parts.join(":");
  }
}

/**
 * 🎯 CACHE TESTING UTILITIES
 * Provides methods to test cache functionality end-to-end
 */
export class CacheTester {
  /**
   * Simulate user searching for same topic with different variations
   * Should result in cache hits for variations 2-N
   */
  static simulateUserSearchVariations(baseTopic: string): {
    variation: string;
    shouldCacheHit: boolean;
    expectedKey: string;
  }[] {
    return [
      {
        variation: baseTopic,
        shouldCacheHit: false, // First search - cold cache
        expectedKey: baseTopic.toLowerCase(),
      },
      {
        variation: baseTopic.toUpperCase(),
        shouldCacheHit: true, // Same topic, different case
        expectedKey: baseTopic.toLowerCase(),
      },
      {
        variation: `  ${baseTopic}  `,
        shouldCacheHit: true, // Extra whitespace
        expectedKey: baseTopic.toLowerCase(),
      },
      {
        variation: `the ${baseTopic}`,
        shouldCacheHit: true, // Stop word added
        expectedKey: baseTopic.toLowerCase(),
      },
      {
        variation: `definition of ${baseTopic}`,
        shouldCacheHit: true, // Multiple stop words
        expectedKey: baseTopic.toLowerCase(),
      },
    ];
  }

  /**
   * Simulate plural/singular variations
   * All should check cache if singularization works
   */
  static simulatePluralVariations(singularTopic: string): {
    variation: string;
    shouldCacheHit: boolean;
    normalizedForm: string;
  }[] {
    const pluralTopic = singularTopic + "s";

    return [
      {
        variation: singularTopic,
        shouldCacheHit: false, // First search
        normalizedForm: singularTopic,
      },
      {
        variation: pluralTopic,
        shouldCacheHit: true, // Plural → singularized to match first
        normalizedForm: singularTopic,
      },
      {
        variation: singularTopic.toUpperCase(),
        shouldCacheHit: true,
        normalizedForm: singularTopic,
      },
      {
        variation: pluralTopic.toUpperCase(),
        shouldCacheHit: true,
        normalizedForm: singularTopic,
      },
    ];
  }
}

/**
 * 🎯 REAL-TIME CACHE MONITORING
 * Track cache performance in production
 */
export class CacheMonitor {
  private static metrics = {
    byAgent: new Map<string, { hits: number; misses: number }>(),
    byTopic: new Map<string, { hits: number; misses: number }>(),
  };

  static recordHit(agentType: string, topic: string): void {
    // Record by agent
    const agentMetrics = this.metrics.byAgent.get(agentType) || {
      hits: 0,
      misses: 0,
    };
    agentMetrics.hits++;
    this.metrics.byAgent.set(agentType, agentMetrics);

    // Record by topic
    const topicMetrics = this.metrics.byTopic.get(topic) || {
      hits: 0,
      misses: 0,
    };
    topicMetrics.hits++;
    this.metrics.byTopic.set(topic, topicMetrics);
  }

  static recordMiss(agentType: string, topic: string): void {
    // Record by agent
    const agentMetrics = this.metrics.byAgent.get(agentType) || {
      hits: 0,
      misses: 0,
    };
    agentMetrics.misses++;
    this.metrics.byAgent.set(agentType, agentMetrics);

    // Record by topic
    const topicMetrics = this.metrics.byTopic.get(topic) || {
      hits: 0,
      misses: 0,
    };
    topicMetrics.misses++;
    this.metrics.byTopic.set(topic, topicMetrics);
  }

  static getMetrics() {
    return {
      byAgent: Object.fromEntries(this.metrics.byAgent),
      byTopic: Object.fromEntries(this.metrics.byTopic),
    };
  }
}

export default {
  NormalizationTracer,
  CacheEfficiencyAnalyzer,
  CacheKeyValidator,
  CacheTester,
  CacheMonitor,
};
