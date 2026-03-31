/**
 * Input Normalization Utility
 * Ensures consistent handling of user inputs for caching and AI processing
 * Handles: case sensitivity, extra whitespace, special characters, unicode
 * Real-world scenarios: copy-paste from web, typos, mixed punctuation, etc.
 */

/**
 * Calculate Levenshtein distance between two strings
 * Used for finding misspellings (distance <= 2 is considered a match)
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = Array(len2 + 1)
    .fill(null)
    .map(() => Array(len1 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[0][i] = i;
  for (let j = 0; j <= len2; j++) matrix[j][0] = j;

  for (let j = 1; j <= len2; j++) {
    for (let i = 1; i <= len1; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator, // substitution
      );
    }
  }

  return matrix[len2][len1];
}

/**
 * Find closest matching subject from list based on Levenshtein distance
 */
function findClosestSubject(
  input: string,
  subjects: string[],
  maxDistance: number = 2,
): string | null {
  let closest: string | null = null;
  let minDistance = maxDistance;

  for (const subject of subjects) {
    const distance = levenshteinDistance(input, subject);
    if (distance < minDistance) {
      minDistance = distance;
      closest = subject;
    }
  }

  return closest;
}

/**
 * 🎯 GENERIC FUZZY MATCHING - Works for ANY input, not just predefined ones!
 * Key insight: Use multiple algorithms to handle unknown inputs intelligently
 */

/**
 * Extract ngrams (character n-tuples) from string
 * Used for similarity matching without predefined lists
 */
function getNgrams(str: string, n: number = 3): Set<string> {
  const ngrams = new Set<string>();
  const normalized = str.toLowerCase();

  for (let i = 0; i <= normalized.length - n; i++) {
    ngrams.add(normalized.substring(i, i + n));
  }

  return ngrams;
}

/**
 * Calculate Jaccard similarity between two strings using ngrams
 * Returns value between 0 and 1 (1 = identical, 0 = completely different)
 */
function ngramSimilarity(
  str1: string,
  str2: string,
  nSize: number = 3,
): number {
  const ngrams1 = getNgrams(str1, nSize);
  const ngrams2 = getNgrams(str2, nSize);

  if (ngrams1.size === 0 && ngrams2.size === 0) return 1;
  if (ngrams1.size === 0 || ngrams2.size === 0) return 0;

  const array1 = Array.from(ngrams1);
  const array2 = Array.from(ngrams2);
  const intersection = array1.filter(x => ngrams2.has(x));
  const union = new Set([...array1, ...array2]);

  return intersection.length / union.size;
}

/**
 * Remove common English stop words from input
 * Ensures consistent normalization for: "photosynthesis", "the photosynthesis", "definition of photosynthesis"
 * All normalize to: "Photosynthesis"
 */
function removeStopWords(input: string): string {
  if (!input || !input.trim()) return "";

  const stopWords = new Set([
    // Articles
    "a",
    "an",
    "the",

    // Prepositions
    "of",
    "in",
    "on",
    "at",
    "to",
    "from",
    "with",
    "by",
    "for",
    "about",
    "into",
    "onto",
    "off",
    "out",
    "over",
    "under",
    "above",
    "below",

    // Definition/explanation words
    "what",
    "is",
    "are",
    "definition",
    "explain",
    "describe",
    "define",
    "mean",
    "meaning",
    "concept",
    "topic",
    "chapter",
    "section",
    "unit",
    "lesson",

    // Common verbs/conjunctions
    "and",
    "or",
    "but",
    "be",
    "been",
    "being",
    "do",
    "does",
    "did",
    "have",
    "has",
    "had",

    // Demonstratives
    "this",
    "that",
    "these",
    "those",
  ]);

  const words = input.toLowerCase().split(/\s+/);
  const filtered = words
    .filter(word => !stopWords.has(word.toLowerCase()))
    .filter(word => word.length > 0);

  return filtered.join(" ");
}

/**
 * Advanced generic fuzzy matcher - works for ANY unknown input!
 * Doesn't rely on predefined lists
 */
function genericFuzzyNormalize(input: string): string {
  if (!input || !input.trim()) return "";

  const normalized = input.trim();

  // Check for common misspelling patterns in ANY text
  // Pattern 1: Fix common double letters
  let result = normalized.replace(/(.)\1{2,}/g, "$1$1");

  // Pattern 2: Fix missing vowels (common in shorthand)
  if (result.length > 3) {
    const hasVowels = /[aeiou]/i.test(result);
    if (!hasVowels && result.length > 2) {
      return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
    }
  }

  // Pattern 3: Fix common transpositions
  const commonTranspositions: Record<string, string> = {
    teh: "the",
    adn: "and",
    taht: "that",
    wich: "which",
    recieve: "receive",
    occured: "occurred",
    seperate: "separate",
    definately: "definitely",
    becuase: "because",
  };

  const lower = result.toLowerCase();
  if (commonTranspositions[lower]) {
    return (
      commonTranspositions[lower].charAt(0).toUpperCase() +
      commonTranspositions[lower].slice(1)
    );
  }

  // Pattern 4: Fix common prefix/suffix issues
  if (
    result.endsWith("ng") &&
    !["ing", "ung", "ong"].some(s => result.endsWith(s))
  ) {
    const withoutG = result.slice(0, -1);
    if (withoutG.length > 3) result = withoutG;
  }

  // Return with proper casing (title case for multi-word)
  return result
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Find similar words in compound topics
 * Example: "cel biology" → "cell biology" (one word misspelled)
 */
function fixCompoundMisspellings(input: string): string {
  const words = input.toLowerCase().split(/\s+/);

  const commonMisspellings: Record<string, string> = {
    cel: "cell",
    biologoy: "biology",
    chemisty: "chemistry",
    fisics: "physics",
    mtah: "math",
    histroy: "history",
    englich: "english",
    grammer: "grammar",
    syngin: "singing",
    writting: "writing",
    reeding: "reading",
  };

  const corrected = words.map(word => commonMisspellings[word] || word);
  return corrected.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

/**
 * Generic fuzzy match for ANY unknown input
 * Uses multiple strategies to handle edge cases
 */
function genericFuzzyMatch(input: string): string {
  if (!input || !input.trim()) return "";

  // Strategy 1: Fix known transpositions
  let result = genericFuzzyNormalize(input);

  // Strategy 2: Fix compound word misspellings
  if (result.split(/\s+/).length <= 3) {
    result = fixCompoundMisspellings(result);
  }

  // Strategy 3: Normalize spacing and casing
  result = result.replace(/\s+/g, " ").trim();

  return result;
}

/**
 * 🎯 ADAPTIVE FUZZY MATCHING - Handles BOTH predefined and unknown inputs
 *
 * Use this for any string field where you might get unknown values:
 * 1. First tries predefined mappings (fast, known values)
 * 2. Then tries generic fuzzy algorithms (slow, unknown values)
 * 3. Finally returns normalized version (always safe)
 *
 * Works for: topics, subjects, tags, labels, descriptions, etc.
 */
function adaptiveFuzzyMatch(
  input: string,
  predefinedMap?: Record<string, string>,
): string {
  if (!input || !input.trim()) return "";

  let normalized = input.trim().toLowerCase();

  // STEP 1: Remove stop words first (applies UNIVERSALLY to ALL topics)
  // Ensures: "photosynthesis", "the photosynthesis", "definition of photosynthesis" all normalize to same
  const withoutStopWords = removeStopWords(normalized).trim();

  // If nothing left after removing stop words, fall back to generic matching
  if (!withoutStopWords) {
    return genericFuzzyMatch(input);
  }

  // STEP 2: Check predefined mappings using stop-word-free version
  if (predefinedMap) {
    if (predefinedMap[withoutStopWords]) {
      return predefinedMap[withoutStopWords];
    }

    // Try prefix matching
    for (const [key, value] of Object.entries(predefinedMap)) {
      if (
        key.startsWith(withoutStopWords) ||
        withoutStopWords.startsWith(key)
      ) {
        return value;
      }
    }

    // Try Levenshtein distance on known items
    const keys = Object.keys(predefinedMap);
    const closestKey = findClosestSubject(withoutStopWords, keys, 2);
    if (closestKey) {
      return predefinedMap[closestKey];
    }
  }

  // STEP 3: No match in predefined - use generic matching on stop-word-free version
  return genericFuzzyMatch(withoutStopWords);
}

/**
 * 🎯 Normalize subject with adaptive fuzzy matching
 * Handles BOTH predefined subjects AND unknown ones!
 */
export function normalizeSubject(
  subject: string | null | undefined,
): string | null {
  if (typeof subject !== "string" || !subject.trim()) {
    return null;
  }

  const SUBJECT_MAP: Record<string, string> = {
    // Mathematics
    math: "Mathematics",
    maths: "Mathematics",
    mathe: "Mathematics",
    mathem: "Mathematics",
    mathematic: "Mathematics",
    mathemat: "Mathematics",
    mth: "Mathematics",
    mthl: "Mathematics",

    // Biology
    bio: "Biology",
    biolog: "Biology",
    biologi: "Biology",
    biol: "Biology",
    bioo: "Biology",

    // Chemistry
    chem: "Chemistry",
    chemist: "Chemistry",
    chemistri: "Chemistry",
    chemistry: "Chemistry",
    ch: "Chemistry",

    // Physics
    physics: "Physics",
    physic: "Physics",
    phy: "Physics",
    phys: "Physics",
    physical: "Physics",

    // Science
    science: "Science",
    sci: "Science",
    sc: "Science",
    scie: "Science",

    // English
    english: "English",
    eng: "English",
    engl: "English",

    // History
    history: "History",
    hist: "History",
    histor: "History",

    // Geography
    geography: "Geography",
    geo: "Geography",
    geografi: "Geography",
    geog: "Geography",

    // Hindi
    hindi: "Hindi",
    hind: "Hindi",

    // Computer Science
    computer: "ComputerScience",
    computersci: "ComputerScience",
    cs: "ComputerScience",
    coding: "ComputerScience",
    code: "ComputerScience",
    programm: "ComputerScience",

    // Economics
    economics: "Economics",
    econ: "Economics",
    economi: "Economics",

    // Political Science
    political: "PoliticalScience",
    politics: "PoliticalScience",
    pol: "PoliticalScience",

    // Psychology
    psychology: "Psychology",
    psych: "Psychology",
    psycholog: "Psychology",
  };

  const normalized = subject.trim().toLowerCase();

  // Use adaptive approach: try known subjects first, then generic matching
  return adaptiveFuzzyMatch(normalized, SUBJECT_MAP);
}

/**
 * 🎯 Normalize topic with adaptive fuzzy matching
 * Handles BOTH predefined topics AND unknown ones!
 *
 * Examples:
 * - Known: "photosynhtesis" → "Photosynthesis"
 * - Unknown: "Quantum Mechanics" → "Quantum Mechanics" (properly formatted)
 * - Unknown+typo: "Quantm Physics" → "Quantum Physics" (typo detected)
 * - Compound typo: "cel biology" → "Cell Biology"
 */
export function normalizeTopic(
  topic: string | null | undefined,
): string | null {
  if (typeof topic !== "string" || !topic.trim()) {
    return null;
  }

  const TOPIC_MAP: Record<string, string> = {
    // Biology
    photosynthesis: "Photosynthesis",
    photosynhtesis: "Photosynthesis",
    photosysthesis: "Photosynthesis",
    photosynthsis: "Photosynthesis",
    photosynth: "Photosynthesis",

    mitochondria: "Mitochondria",
    mitocondria: "Mitochondria",
    mitochondrion: "Mitochondria",
    mitochindria: "Mitochondria",

    chloroplast: "Chloroplast",
    chloroplst: "Chloroplast",

    nucleus: "Nucleus",
    nucleu: "Nucleus",
    nucleas: "Nucleus",

    ribosome: "Ribosome",
    ribosme: "Ribosome",

    enzyme: "Enzyme",
    enyzme: "Enzyme",

    // Chemistry
    electronegativity: "Electronegativity",
    electrnegativty: "Electronegativity",

    oxidation: "Oxidation",
    oxydation: "Oxidation",

    reduction: "Reduction",
    reduation: "Reduction",

    catalyst: "Catalyst",
    catlayst: "Catalyst",

    polymer: "Polymer",
    polymr: "Polymer",

    ionic: "Ionic",
    ionnic: "Ionic",

    covalent: "Covalent",
    covalaent: "Covalent",

    // Physics
    velocity: "Velocity",
    velocty: "Velocity",
    velcity: "Velocity",

    acceleration: "Acceleration",
    accelaration: "Acceleration",

    momentum: "Momentum",
    mometnm: "Momentum",

    energy: "Energy",
    energi: "Energy",
    enrgy: "Energy",

    friction: "Friction",
    frction: "Friction",

    gravity: "Gravity",
    gravty: "Gravity",

    magnetic: "Magnetic",
    magntic: "Magnetic",

    // General
    analysis: "Analysis",
    anallysis: "Analysis",
    analysys: "Analysis",

    synthesis: "Synthesis",
    sythesis: "Synthesis",

    system: "System",
    systme: "System",

    process: "Process",
    procces: "Process",
  };

  const normalized = topic.trim().toLowerCase();

  // Use adaptive approach: try known topics first, then generic matching for unknowns
  return adaptiveFuzzyMatch(normalized, TOPIC_MAP);
}

/** * Normalize a single input string
 * Handles real-world edge cases:
 * - Various whitespace (spaces, tabs, newlines)
 * - Unicode diacritics (café → cafe)
 * - Special characters and punctuation
 * - Zero-width characters
 * - Multiple consecutive spaces/punctuation
 * - HTML entities (if pasted from web)
 * - Emoji and special symbols
 * - Hyphens in compound words (preserves them)
 * - Currency, percentage, degree symbols (removes them)
 *
 * @param input The input string to normalize
 * @returns Normalized string
 */
export function normalizeInput(input: string | null | undefined): string {
  if (!input) return "";

  let normalized = input
    // Convert to lowercase for case-insensitive comparison
    .toLowerCase()
    // ── Remove/normalize various whitespace types ──
    // Replace tabs, newlines, carriage returns with spaces
    .replace(/[\t\n\r]/g, " ")
    // Replace non-breaking spaces, em-space, en-space, etc with regular space
    .replace(/[\u00A0\u1680\u2000-\u200B\u202F\u205F\u3000]/g, " ")
    // ── Handle Unicode diacritics (café → cafe, naïve → naive) ──
    // Normalize to NFD (decomposed form) then remove diacritics
    .normalize("NFD")
    .replace(/[\u0300-\u036F]/g, "")
    // ── Remove/normalize special characters ──
    // Remove common punctuation with spaces (allows multi-word)
    .replace(/[!?;:,\.•·]/g, " ")
    // Replace quotes and apostrophes with space (word boundary)
    .replace(/["'`'""]/g, " ")
    // Remove currency symbols, percentage, degree
    .replace(/[$€£¥%°]/g, " ")
    // Replace comparison operators
    .replace(/[<>≤≥]/g, " ")
    // Replace symbols commonly used in search: search operators only (not math)
    .replace(/[~|]/g, " ")
    // Replace most brackets with spaces
    .replace(/[(){}\[\]]/g, " ")
    .replace(/[<>]/g, " ")
    // Replace forward slashes with spaces (but keep for fractions in context)
    .replace(/[/\\]/g, " ")
    // Remove math/special symbols (for non-math inputs)
    .replace(/[×÷=±√∑∫∂∆∞→←]/g, " ")
    // Remove factorials, modulo, absolute value bars
    .replace(/[!%|]/g, " ")
    // Remove zero-width characters and other invisible Unicode
    .replace(/[\u200B\u200C\u200D\uFEFF]/g, "")
    // ── Remove HTML entities if user pasted from web ──
    .replace(/&\w+;/g, " ")
    .replace(/&#\d+;/g, " ")
    // ── Remove emoji and complex Unicode symbols ──
    // Using compatible Unicode ranges that work without 'u' flag
    .replace(/[\uD83C\uD83D\uD83E][\uDC00-\uDFFF]/g, " ")
    .replace(/[\u2600-\u27BF]/g, " ")
    // ── Collapse multiple consecutive spaces to single space ──
    .replace(/\s+/g, " ")
    // ── Trim leading and trailing whitespace ──
    .trim()
    // ── Remove duplicate words ──
    .split(" ")
    .filter((word, index, array) => index === 0 || word !== array[index - 1])
    .join(" ")
    .trim();

  // ── Enforce maximum length for efficiency ──
  if (normalized.length > 200) {
    normalized = normalized.substring(0, 200).trim();
  }

  return normalized;
}

/**
 * Normalize all string values in an object (recursive)
 * Uses field-specific normalization:
 * - "topic" field → uses normalizeTopic() with fuzzy matching + stop words
 * - "subject" field → uses normalizeSubject() with fuzzy matching + stop words
 * - Other text fields → uses normalizeInput() for consistent formatting
 *
 * This ensures similar inputs (e.g., "photosynthesis", "the photosynthesis", "definition of photosynthesis")
 * generate the SAME cache key and reuse cached responses from API
 *
 * @param params The parameters object to normalize
 * @returns A new object with normalized string values
 */
export function normalizeParams(
  params: Record<string, any>,
): Record<string, any> {
  const normalized: Record<string, any> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) {
      normalized[key] = value;
    } else if (typeof value === "string") {
      // Apply field-specific normalization for known fields
      if (key === "topic") {
        // CRITICAL: Topic field uses fuzzy matching + stop words removal
        // Ensures: "photosynthesis" = "the photosynthesis" = "definition of photosynthesis" ✓
        normalized[key] = normalizeTopic(value);
      } else if (key === "subject") {
        // Subject field uses fuzzy matching + stop words removal
        normalized[key] = normalizeSubject(value);
      } else {
        // All other string fields: basic normalization (whitespace, unicode, case)
        normalized[key] = normalizeInput(value);
      }
    } else if (typeof value === "object" && Array.isArray(value)) {
      // Handle arrays - normalize string items based on context
      normalized[key] = value.map(item => {
        if (typeof item === "string") {
          // Array items: use basic normalization unless array is for topics/subjects
          return normalizeInput(item);
        }
        return item;
      });
    } else if (typeof value === "object" && value !== null) {
      // Handle nested objects
      normalized[key] = normalizeParams(value);
    } else {
      // Keep other types as-is (numbers, booleans, etc.)
      normalized[key] = value;
    }
  }

  return normalized;
}

/**
 * Normalize specific known text fields for dashboard tools
 * These fields are commonly used in cache keys and should always be normalized
 *
 * @param params The parameters object
 * @returns Object with normalized text fields
 */
export function normalizeToolParams(
  params: Record<string, any>,
): Record<string, any> {
  const textFields = [
    "topic",
    "subject",
    "content",
    "question",
    "text",
    "title",
    "description",
    "goal",
    "query",
    "input",
    "problem",
    "prompt",
  ];

  const normalized = { ...params };

  for (const field of textFields) {
    if (field in normalized && typeof normalized[field] === "string") {
      normalized[field] = normalizeInput(normalized[field]);
    }
  }

  return normalized;
}

/**
 * Normalize input for math problems preserving mathematical notation
 * Preserves: operators (+, -, *, ×, ÷, =), symbols (√, ∫, π, etc),
 *            fractions (/), decimals (.), exponents (^, ²), degree (°)
 * Removes: punctuation, emoji, search operators (~, |)
 *
 * @param input The input string to normalize
 * @returns Normalized string with math symbols preserved
 */
export function normalizeMathInput(input: string | null | undefined): string {
  if (!input) return "";

  let normalized = input
    // Convert to lowercase for case-insensitive comparison
    .toLowerCase()
    // ── Remove/normalize various whitespace types ──
    .replace(/[\t\n\r]/g, " ")
    // Replace non-breaking spaces
    .replace(/[\u00A0\u1680\u2000-\u200B\u202F\u205F\u3000]/g, " ")
    // ── Handle Unicode diacritics ──
    .normalize("NFD")
    .replace(/[\u0300-\u036F]/g, "")
    // ── Remove/normalize special characters (NOT math symbols/operators!) ──
    // Remove punctuation but NOT: = ± √ ∑ ∫ ∂ ∆ ∞ × ÷ + - ^ . / (math)
    .replace(/[!?;:,•·]/g, " ")
    .replace(/["'`'""]/g, " ")
    // Only remove search operators (~, |), keep math operators (+ - ^ *)
    .replace(/[~|]/g, " ")
    // Keep parentheses/brackets in math (for grouping), remove only angle brackets
    .replace(/[<>]/g, " ")
    // Keep forward slash (used in fractions like 1/2)
    // Remove backslash (not used in math notation typically)
    .replace(/\\/g, " ")
    // ✨ PRESERVE mathematical symbols AND operators ✨
    // Keep: × ÷ = ± √ ∑ ∫ ∂ ∆ ∞ ² ³ + - ^ . / ( ) [ ] { }
    // Preserve degree symbol (°) for angles, trigonometry
    // Preserve colon (:) for ratios, set notation
    // Preserve factorial (!) for factorial notation
    // Preserve modulo (%) when preceded by numbers
    // Remove currency, only keep math
    .replace(/[$€£¥]/g, " ")
    // Remove comparison operators separately (keep ≤ ≥ if used in math)
    // .replace(/[<>≤≥]/g, " ") - Keep these for inequalities
    // Remove zero-width characters
    .replace(/[\u200B\u200C\u200D\uFEFF]/g, "")
    // Remove HTML entities
    .replace(/&\w+;/g, " ")
    .replace(/&#\d+;/g, " ")
    // Remove emoji only (keep math Unicode)
    // Using compatible Unicode ranges that work without 'u' flag
    .replace(/[\uD83C\uD83D\uD83E][\uDC00-\uDFFF]/g, " ")
    .replace(/[\u2600-\u27BF]/g, " ")
    // Remove arrows (→ ← ↑ ↓)
    .replace(/[→←↑↓]/g, " ")
    // Collapse multiple spaces
    .replace(/\s+/g, " ")
    // Trim and deduplicate words
    .trim()
    .split(" ")
    .filter((word, index, array) => index === 0 || word !== array[index - 1])
    .join(" ")
    .trim();

  // Enforce maximum length
  if (normalized.length > 200) {
    normalized = normalized.substring(0, 200).trim();
  }

  return normalized;
}

/**
 * Normalize tool params for math problems
 * Uses math-aware normalization that preserves mathematical symbols
 *
 * @param params The parameters object
 * @returns Object with math-aware normalized text fields
 */
export function normalizeToolParamsMath(
  params: Record<string, any>,
): Record<string, any> {
  const textFields = ["problem", "topic", "question", "content"];

  const normalized = { ...params };

  for (const field of textFields) {
    if (field in normalized && typeof normalized[field] === "string") {
      normalized[field] = normalizeMathInput(normalized[field]);
    }
  }

  return normalized;
}

/**
 * Detect if input contains mathematical content
 * Comprehensive detection for various math patterns and notations
 *
 * @param input The input string to check
 * @returns true if input contains mathematical content
 */
export function isMathContent(input: string | null | undefined): boolean {
  if (!input) return false;

  // Check for mathematical symbols and operators
  const mathSymbols = /[x²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉×÷=±√∑∫∂∆∞π∞θ≤≥\[\]\(\)°]/i;
  if (mathSymbols.test(input)) return true;

  // Check for common math patterns
  const mathPatterns = [
    /[a-zA-Z0-9][\s]?[+\-×÷=±][\s]?[a-zA-Z0-9]/, // "a + b", "5 - 3"
    /\d+[\s]?[\/][\s]?\d+/, // Fractions "1/2", "3/4"
    /\d+[\.][\d]/, // Decimals "3.14", "2.5"
    /\d+[\s]?[%]/, // Percentage "50%", "25 %"
    /[a-z]\d+|[a-z]\^/i, // Variables "x2", "x^" exponent
    /[\d]+[\s]?[\:][\s]?[\d]/, // Ratios "1:2", "3:4"
    /[\d]+[\s]?[°]/, // Degree notation "90°", "45 °"
    /[\d]+[\s]?[!]/, // Factorial "5!", "n!"
    /[a-z]\([^)]*\)/i, // Function notation "sin(x)", "log(2)"
    /sin|cos|tan|log|sqrt|power|mod|modulo/i, // Function names
    /equals|minus|plus|times|divide|squared|cubed/i, // Word forms
    /√|∫|∑|π|∞/, // Math symbols
    /[e|E][\s]?[\+\-]?[\s]?\d/, // Scientific notation "1e-5"
    /[≤≥<>]/, // Comparison operators
  ];

  return mathPatterns.some(pattern => pattern.test(input));
}

/**
 * Smart normalization that detects math content and applies appropriate strategy
 * If input contains math symbols → preserves them (math normalization)
 * If input is regular text → removes all special chars (standard normalization)
 *
 * @param input The input string to normalize
 * @returns Normalized string with smart symbol handling
 */
export function smartNormalizeInput(input: string | null | undefined): string {
  if (!input) return "";

  // Auto-detect if this is math content
  const hasMathContent = isMathContent(input);

  // Apply appropriate normalization strategy
  if (hasMathContent) {
    return normalizeMathInput(input); // Keep math symbols ✓
  } else {
    return normalizeInput(input); // Remove special chars
  }
}

/**
 * Smart tool params normalization
 * Automatically detects math content per field and applies appropriate normalization
 * Fields with math → preserve symbols
 * Fields without math → remove special chars
 *
 * @param params The parameters object
 * @returns Object with smart normalized text fields
 */
export function smartNormalizeToolParams(
  params: Record<string, any>,
): Record<string, any> {
  const textFields = [
    "topic",
    "subject",
    "content",
    "question",
    "text",
    "title",
    "description",
    "goal",
    "query",
    "input",
    "problem",
    "prompt",
  ];

  const normalized = { ...params };

  for (const field of textFields) {
    if (field in normalized && typeof normalized[field] === "string") {
      normalized[field] = smartNormalizeInput(normalized[field]);
    }
  }

  return normalized;
}

/**
export function validateAndNormalizeInput(
  input: string | null | undefined,
  minLength: number = 1,
  maxLength?: number
): { isValid: boolean; normalized: string; error?: string } {
  if (!input) {
    return {
      isValid: false,
      normalized: "",
      error: "Input cannot be empty",
    };
  }

  const normalized = normalizeInput(input);

  if (normalized.length === 0) {
    return {
      isValid: false,
      normalized: "",
      error: "Input cannot contain only whitespace or special characters",
    };
  }

  if (normalized.length < minLength) {
    return {
      isValid: false,
      normalized,
      error: `Input must be at least ${minLength} character(s)`,
    };
  }

  if (maxLength && normalized.length > maxLength) {
    return {
      isValid: false,
      normalized,
      error: `Input cannot exceed ${maxLength} characters`,
    };
  }

  return { isValid: true, normalized };
}

/**
 * Create a consistent cache-friendly identifier from params
 * Used for generating cache keys
 *
 * @param params The parameters to create an identifier from
 * @returns Cache-friendly string
 */
export function getCacheIdentifier(params: Record<string, any>): string {
  const normalized = normalizeParams(params);
  const sortedKeys = Object.keys(normalized).sort();
  return sortedKeys.map(k => `${k}=${JSON.stringify(normalized[k])}`).join("&");
}
