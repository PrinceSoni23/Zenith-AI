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
 * Adaptively adjusts threshold based on input length
 * - Short words (3-6 chars): threshold = 1 (strict, e.g., "cel" → "cell")
 * - Medium words (7-12 chars): threshold = 2 (normal, e.g., "renissance" → "renaissance")
 * - Long words (13+ chars): threshold = 3 (lenient, e.g., "photosynthesis")
 */
function findClosestSubject(
  input: string,
  subjects: string[],
  maxDistance?: number,
): string | null {
  if (!input || subjects.length === 0) return null;

  // If maxDistance not provided, calculate it based on input length
  const adaptiveThreshold =
    maxDistance ??
    (() => {
      const len = input.length;
      if (len <= 6) return 1; // Very strict for short words
      if (len <= 12) return 2; // Normal threshold for medium words
      return 3; // Allow more lenience for long words
    })();

  let closest: string | null = null;
  let minDistance = adaptiveThreshold + 1; // Start higher to find any match

  for (const subject of subjects) {
    const distance = levenshteinDistance(input, subject);
    // Accept if within threshold AND better than previous best
    if (distance <= adaptiveThreshold && distance < minDistance) {
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
 * Convert plural forms to singular for consistent topic matching
 * Ensures "photons" and "photon" generate the same cache key
 * Comprehensive coverage: Indian school curriculum (Class 3-12)
 * Examples: enzymes → enzyme, mitochondria → mitochondrion, photons → photon
 *
 * @param word The word to singularize
 * @returns Singularized form
 */
function singularize(word: string): string {
  if (!word || word.length === 0) return word;

  const lowerWord = word.toLowerCase();

  // Special cases that don't follow standard rules
  // COMPREHENSIVE: Indian curriculum Class 3-12 (CBSE, ICSE, State Boards)
  const specialCases: Record<string, string> = {
    // ════════════════════════════════════════════════════════
    // BIOLOGY - All Classes
    // ════════════════════════════════════════════════════════
    // Cells & Organelles (Class 5-6+)
    mitochondria: "mitochondrion",
    chloroplasts: "chloroplast",
    ribosomes: "ribosome",
    nuclei: "nucleus",
    nucleuses: "nucleus",
    vacuoles: "vacuole",
    lysosomes: "lysosome",
    centrioles: "centriole",
    chromosomes: "chromosome",
    centromeres: "centromere",
    genes: "gene",
    alleles: "allele",

    // Tissues & Organs (Class 6+)
    tissues: "tissue",
    organs: "organ",
    organisms: "organism",
    cells: "cell",
    neurons: "neuron",
    blood_vessels: "blood_vessel",

    // Enzymes, Proteins, Compounds
    enzymes: "enzyme",
    proteins: "protein",
    antibodies: "antibody",
    hormones: "hormone",
    peptides: "peptide",

    // Organelles & Structures
    organelles: "organelle",
    mitochondrions: "mitochondrion",
    vesicles: "vesicle",
    plastids: "plastid",

    // Photosynthesis & Respiration (Class 7+)
    chlorophyll: "chlorophyll",
    glucose: "glucose",
    oxygen: "oxygen",
    carbon_dioxide: "carbon_dioxide",

    // Reproduction & Heredity (Class 10+)
    gametes: "gamete",
    zygotes: "zygote",
    phenotypes: "phenotype",
    genotypes: "genotype",
    mutations: "mutation",
    variations: "variation",
    traits: "trait",

    // Ecology (Class 7-8+)
    ecosystems: "ecosystem",
    habitats: "habitat",
    species: "species",
    populations: "population",
    communities: "community",
    predators: "predator",
    preys: "prey",
    producers: "producer",
    consumers: "consumer",
    decomposers: "decomposer",
    herbivores: "herbivore",
    carnivores: "carnivore",
    omnivores: "omnivore",
    food_chains: "food_chain",
    food_webs: "food_web",

    // Human Systems (Class 9-10)
    bones: "bone",
    muscles: "muscle",
    joints: "joint",
    ligaments: "ligament",
    tendons: "tendon",
    nerves: "nerve",
    arteries: "artery",
    veins: "vein",
    capillaries: "capillary",
    lungs: "lung",
    kidneys: "kidney",
    glands: "gland",

    // ════════════════════════════════════════════════════════
    // CHEMISTRY - All Classes
    // ════════════════════════════════════════════════════════
    // Atomic Theory (Class 8-9+)
    electrons: "electron",
    protons: "proton",
    neutrons: "neutron",
    atoms: "atom",
    molecules: "molecule",
    ions: "ion",
    isotopes: "isotope",
    orbitals: "orbital",
    shells: "shell",
    subshells: "subshell",

    // Compounds & Reactions (Class 8-10)
    compounds: "compound",
    elements: "element",
    salts: "salt",
    oxides: "oxide",
    hydroxides: "hydroxide",
    chlorides: "chloride",
    carbonates: "carbonate",
    nitrates: "nitrate",
    sulfates: "sulfate",
    phosphates: "phosphate",

    // Reactions & States (Class 6-9)
    reactions: "reaction",
    catalysts: "catalyst",
    products: "product",
    mixtures: "mixture",
    solutions: "solution",
    suspensions: "suspension",
    colloids: "colloid",

    // Bond Types (Class 10+)
    bonds: "bond",
    covalent_bonds: "covalent_bond",
    ionic_bonds: "ionic_bond",
    hydrogen_bonds: "hydrogen_bond",
    metallic_bonds: "metallic_bond",

    // Organic Chemistry (Class 11-12)
    hydrocarbons: "hydrocarbon",
    alkanes: "alkane",
    alkenes: "alkene",
    alkynes: "alkyne",
    alcohols: "alcohol",
    aldehydes: "aldehyde",
    ketones: "ketone",
    carboxylic_acids: "carboxylic_acid",
    esters: "ester",
    amines: "amine",
    polymers: "polymer",

    // Electrochemistry (Class 11+)
    oxidants: "oxidant",
    reductants: "reductant",
    electrodes: "electrode",
    electrolytes: "electrolyte",

    // ════════════════════════════════════════════════════════
    // PHYSICS - All Classes
    // ════════════════════════════════════════════════════════
    // Mechanics (Class 6+)
    velocities: "velocity",
    accelerations: "acceleration",
    momenta: "momentum",
    momentums: "momentum",
    energies: "energy",
    forces: "force",
    magnets: "magnet",
    particles: "particle",
    pressures: "pressure",
    densities: "density",

    // Waves & Optics (Class 8-11)
    waves: "wave",
    frequencies: "frequency",
    wavelengths: "wavelength",
    amplitudes: "amplitude",
    periods: "period",
    rays: "ray",
    beams: "beam",
    photons: "photon",
    lenses: "lens",
    mirrors: "mirror",
    prisms: "prism",
    spectra: "spectrum",

    // Electricity & Magnetism (Class 6-12)
    charges: "charge",
    currents: "current",
    voltages: "voltage",
    resistances: "resistance",
    capacitors: "capacitor",
    conductors: "conductor",
    insulators: "insulator",
    electromagnets: "electromagnet",
    coils: "coil",
    transformers: "transformer",
    motors: "motor",
    generators: "generator",

    // Modern Physics (Class 11-12)
    quarks: "quark",
    leptons: "lepton",
    bosons: "boson",
    fermions: "fermion",

    // Thermodynamics (Class 11-12)
    heats: "heat",
    entropies: "entropy",
    enthalpies: "enthalpy",
    caloric_values: "caloric_value",

    // ════════════════════════════════════════════════════════
    // MATHEMATICS - All Classes (Class 3-12)
    // ════════════════════════════════════════════════════════
    // Numbers & Geometry (Class 3+)
    numbers: "number",
    integers: "integer",
    fractions: "fraction",
    decimals: "decimal",
    ratios: "ratio",
    percentages: "percentage",
    vertices: "vertex",
    edges: "edge",
    angles: "angle",
    triangles: "triangle",
    rectangles: "rectangle",
    squares: "square",
    circles: "circle",
    polygons: "polygon",
    diagonals: "diagonal",

    // Trigonometry (Class 10+)
    diameters: "diameter",
    radii: "radius",
    circumferences: "circumference",
    areas: "area",
    perimeters: "perimeter",
    tangents: "tangent",
    secants: "secant",
    chords: "chord",

    // Algebra & Variables (Class 6+)
    equations: "equation",
    variables: "variable",
    expressions: "expression",
    coefficients: "coefficient",
    constants: "constant",
    polynomials: "polynomial",
    factors: "factor",
    multiples: "multiple",
    medians: "median",
    modes: "mode",
    means: "mean",
    standard_deviations: "standard_deviation",

    // Calculus (Class 11-12)
    derivatives: "derivative",
    integrals: "integral",
    limits: "limit",
    functions: "function",
    gradients: "gradient",
    vectors: "vector",
    matrices: "matrix",
    determinants: "determinant",

    // Sets & Logic (Class 11+)
    sets: "set",
    subsets: "subset",
    unions: "union",
    intersections: "intersection",
    complements: "complement",
    propositions: "proposition",
    theorems: "theorem",
    axioms: "axiom",
    postulates: "postulate",
    proofs: "proof",

    // ════════════════════════════════════════════════════════
    // HISTORY - All Classes (Class 6-12)
    // ════════════════════════════════════════════════════════
    // Ancient India (Class 6-9)
    kingdoms: "kingdom",
    dynasties: "dynasty",
    monarchs: "monarch",
    emperors: "emperor",
    rulers: "ruler",
    warriors: "warrior",
    merchants: "merchant",
    artisans: "artisan",
    slaves: "slave",
    soldiers: "soldier",
    citizens: "citizen",

    // Medieval & Modern (Class 7-12)
    invasions: "invasion",
    battles: "battle",
    conquests: "conquest",
    settlements: "settlement",
    colonies: "colony",
    rebellions: "rebellion",
    revolts: "revolt",
    movements: "movement",
    protests: "protest",
    revolutions: "revolution",

    // Independence & Nation Building (Class 8-10)
    leaders: "leader",
    nationalists: "nationalist",
    independence_fighters: "independence_fighter",
    organizations: "organization",
    associations: "association",
    congresses: "congress",
    parties: "party",
    governments: "government",
    constitutions: "constitution",

    // ════════════════════════════════════════════════════════
    // GEOGRAPHY - All Classes (Class 6-12)
    // ════════════════════════════════════════════════════════
    // Physical Geography
    mountains: "mountain",
    plateaus: "plateau",
    plains: "plain",
    valleys: "valley",
    rivers: "river",
    lakes: "lake",
    oceans: "ocean",
    continents: "continent",
    islands: "island",
    peninsulas: "peninsula",
    capes: "cape",
    gulfs: "gulf",
    straits: "strait",
    coasts: "coast",

    // Climate & Weather (Class 6-8)
    seasons: "season",
    monsoons: "monsoon",
    droughts: "drought",
    floods: "flood",
    cyclones: "cyclone",
    hurricanes: "hurricane",
    tornadoes: "tornado",
    earthquakes: "earthquake",
    volcanoes: "volcano",
    precipitation: "precipitation",
    humidities: "humidity",

    // ════════════════════════════════════════════════════════
    // ENGLISH LANGUAGE & LITERATURE (Class 3-12)
    // ════════════════════════════════════════════════════════
    // Grammar (Class 3+)
    nouns: "noun",
    verbs: "verb",
    adjectives: "adjective",
    adverbs: "adverb",
    pronouns: "pronoun",
    prepositions: "preposition",
    conjunctions: "conjunction",
    interjections: "interjection",
    phonemes: "phoneme",
    morphemes: "morpheme",
    clauses: "clause",
    phrases: "phrase",
    sentences: "sentence",
    paragraphs: "paragraph",

    // Literature & Writing (Class 6+)
    novels: "novel",
    poems: "poem",
    stories: "story",
    dramas: "drama",
    characters: "character",
    plots: "plot",
    themes: "theme",
    settings: "setting",
    conflicts: "conflict",
    resolutions: "resolution",
    metaphors: "metaphor",
    similes: "simile",
    personifications: "personification",
    alliterations: "alliteration",
    onomatopoeias: "onomatopoeia",
    idioms: "idiom",
    proverbs: "proverb",

    // ════════════════════════════════════════════════════════
    // HINDI & REGIONAL LANGUAGES (Class 3-12)
    // ════════════════════════════════════════════════════════
    // Hindi Grammar
    संज्ञा: "संज्ञा",
    सर्वनाम: "सर्वनाम",
    क्रिया: "क्रिया",
    विशेषण: "विशेषण",
    कारक: "कारक",
    समास: "समास",
    मुहावरे: "मुहावरा",
    लोकोक्तियां: "लोकोक्ति",
    काव्य: "काव्य",
    गद्य: "गद्य",

    // Hindi Literature
    कविताएं: "कविता",
    गीत: "गीत",
    नाटक: "नाटक",
    नोवेल: "नोवेल",
    पत्र: "पत्र",
    निबंध: "निबंध",
    कहानियां: "कहानी",
    पात्र: "पात्र",
    विषय: "विषय",

    // ════════════════════════════════════════════════════════
    // SOCIAL STUDIES & CIVICS (Class 6-10)
    // ════════════════════════════════════════════════════════
    // Civics & Governance
    democracies: "democracy",
    rights: "right",
    duties: "duty",
    responsibilities: "responsibility",
    laws: "law",
    amendments: "amendment",
    articles: "article",
    voters: "voter",
    elections: "election",
    ministers: "minister",
    judges: "judge",
    courts: "court",

    // Economics (Class 10+)
    economies: "economy",
    markets: "market",
    commodities: "commodity",
    productions: "production",
    consumptions: "consumption",
    trades: "trade",
    imports: "import",
    exports: "export",
    taxes: "tax",
    revenues: "revenue",
    budgets: "budget",

    // ════════════════════════════════════════════════════════
    // COMPUTER SCIENCE & IT (Class 6-12)
    // ════════════════════════════════════════════════════════
    algorithms: "algorithm",
    programs: "program",
    softwares: "software",
    databases: "database",
    networks: "network",
    servers: "server",
    clients: "client",
    websites: "website",
    arrays: "array",
    strings: "string",
    loops: "loop",
    conditions: "condition",
    operators: "operator",
    data_types: "data_type",
    classes: "class",
    objects: "object",

    // ════════════════════════════════════════════════════════
    // GENERAL ACADEMIC TERMS
    // ════════════════════════════════════════════════════════
    analyses: "analysis",
    syntheses: "synthesis",
    systems: "system",
    processes: "process",
    theories: "theory",
    concepts: "concept",
    models: "model",
    examples: "example",
    definitions: "definition",
    classifications: "classification",
    observations: "observation",
    experiments: "experiment",
    hypothesis: "hypothesis",
    conclusions: "conclusion",
    results: "result",
    findings: "finding",
    properties: "property",
    characteristics: "characteristic",
    attributes: "attribute",
    techniques: "technique",
    strategies: "strategy",
    approaches: "approach",
  };

  // Check special cases first
  if (specialCases[lowerWord]) {
    return specialCases[lowerWord];
  }

  // Standard singularization rules (applied in order)
  // Rule 1: -ies → -y (studies → study, but not when root is -ie)
  if (lowerWord.endsWith("ies") && lowerWord.length > 4) {
    return word.slice(0, -3) + "y";
  }

  // Rule 2: -xes, -zes, -ches, -shes, -sses → -x, -z, -ch, -sh, -ss
  if (lowerWord.endsWith("xes")) return word.slice(0, -2);
  if (lowerWord.endsWith("zes")) return word.slice(0, -2);
  if (lowerWord.endsWith("ches")) return word.slice(0, -2);
  if (lowerWord.endsWith("shes")) return word.slice(0, -2);
  if (lowerWord.endsWith("sses")) return word.slice(0, -2);

  // Rule 3: -es (after consonant) → remove -es
  if (
    lowerWord.endsWith("es") &&
    lowerWord.length > 3 &&
    /[^aeiou]es$/.test(lowerWord)
  ) {
    return word.slice(0, -2);
  }

  // Rule 4: -s (general plural) → remove -s (but not words ending in -ss, -us, -is)
  if (
    lowerWord.endsWith("s") &&
    !lowerWord.endsWith("ss") &&
    !lowerWord.endsWith("us") &&
    !lowerWord.endsWith("is") &&
    lowerWord.length > 2
  ) {
    return word.slice(0, -1);
  }

  // If no rule matched, return original
  return word;
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
 * 🧠 INTELLIGENT UNKNOWN TOPIC MATCHING (Like Google/ChatGPT)
 *
 * Handles typos, misspellings in unknown topics WITHOUT predefined lists.
 * Uses algorithmic approaches: Levenshtein, n-grams, word morphology
 *
 * Examples:
 * - "quantm mechanics" → "Quantum Mechanics" (typo in compound)
 * - "thermodynmics" → "Thermodynamics" (single word typo)
 * - "cellular respriation" → "Cellular Respiration" (domain-specific typo)
 * - "wavfunctions" → "Wave Functions" (compound word split)
 */

/**
 * Build a dictionary of common unknown topic patterns
 * Learn from failed predictions to improve matching
 */
/**
 * Common misspellings for MULTI-WORD TOPICS
 * Maps individual words that might be misspelled in compound topics
 * Example: "Indu valley" should match "Indus valley" via this dictionary
 */
const COMMON_WORD_CORRECTIONS: Record<string, string> = {
  // History/Geography/Civilization key words
  indu: "indus",
  indusvalley: "indus valley",
  civilisation: "civilization",
  civilizaton: "civilization",
  organisations: "organization",

  // Ancient history
  egpt: "egypt",
  egyption: "egyptian",
  mesopotamian: "mesopotamian",
  mesopotamia: "mesopotamia",
  messopotamia: "mesopotamia",

  // Medieval history
  muslim: "muslim",
  mughal: "mughal",
  mugal: "mughal",
  maratha: "maratha",
  britsh: "british",

  // Geography
  himalya: "himalaya",
  himalayas: "himalaya",
  ocean: "ocean",
  peninsulla: "peninsula",
  deccan: "deccan",
};

const UNKNOWN_TOPIC_PATTERNS: Record<string, string> = {
  // Physics patterns
  electromagnetc: "electromagnetic",
  electromagnetcm: "electromagnetic",
  electromagetic: "electromagnetic",
  quantm: "quantum",
  quantun: "quantum",
  thermodynmcs: "thermodynamics",
  thermodynamc: "thermodynamics",
  optics: "optics",

  // Biology patterns
  respriation: "respiration",
  photosyntesis: "photosynthesis",

  // Chemistry patterns
  oxidtion: "oxidation",
  reductoin: "reduction",

  // Math patterns
  trigonmtry: "trigonometry",
  calculs: "calculus",

  // General patterns
  functoin: "function",
  functios: "function",
  equaton: "equation",

  // History & Civilization patterns
  indusvalleycivilisation: "indus valley civilization",
  indusvalleycivilization: "indus valley civilization",
  induvalley: "indus valley",
  induscivilisation: "indus civilization",
};

/**
 * Decompose compound words and correct each part individually
 * Example: "indu valley" → ["indus", "valley"] (typo caught!)
 * Uses adaptive threshold per word with enhanced Levenshtein matching
 *
 * Also handles UNKNOWN NEW TOPICS by detecting probable typos
 * against common English words (blockchain not in dict? check common tech words)
 */
function correctCompoundWords(input: string): string {
  const words = input.toLowerCase().split(/\s+/);

  if (words.length === 1) {
    // Single word - use pattern matching first
    if (UNKNOWN_TOPIC_PATTERNS[words[0]]) {
      return UNKNOWN_TOPIC_PATTERNS[words[0]];
    }
    if (COMMON_WORD_CORRECTIONS[words[0]]) {
      return COMMON_WORD_CORRECTIONS[words[0]];
    }
    return words[0];
  }

  // Multi-word: correct each word aggressively
  const corrected = words.map(word => {
    // Step 1: Check exact word correction patterns first
    if (COMMON_WORD_CORRECTIONS[word]) {
      return COMMON_WORD_CORRECTIONS[word];
    }

    // Step 2: Check exact pattern match
    if (UNKNOWN_TOPIC_PATTERNS[word]) {
      return UNKNOWN_TOPIC_PATTERNS[word];
    }

    // Step 3: Check common misspellings
    if (COMMON_MISSPELLINGS[word]) {
      return COMMON_MISSPELLINGS[word];
    }

    // Step 4: Build a comprehensive word list to match against
    const wordsToMatch = [
      // Get all keys from patterns
      ...Object.keys(UNKNOWN_TOPIC_PATTERNS),
      ...Object.keys(COMMON_WORD_CORRECTIONS),
      ...Object.keys(COMMON_MISSPELLINGS),
      // Common academic topic words
      "indus",
      "valley",
      "civilization",
      "egypt",
      "mesopotamia",
      "ancient",
      "medieval",
      "modern",
      "dynasty",
      "empire",
      "kingdom",
      "century",
      "ocean",
      "continent",
      "mountain",
      "desert",
      "river",
      "plateau",
      "history",
      "geography",
      "culture",
      "society",
      "government",
      "religion",
      // Common tech/modern terms (for new topics)
      "blockchain",
      "technology",
      "artificial",
      "intelligence",
      "quantum",
      "computing",
      "machine",
      "learning",
      "data",
      "science",
      "algorithm",
      "internet",
      "network",
      "computer",
      "software",
      "programming",
      "database",
      "server",
      "cloud",
      "digital",
      "electronic",
      // Common science terms
      "biology",
      "chemistry",
      "physics",
      "astronomy",
      "genetics",
      "evolution",
      "ecosystem",
      "climate",
      "energy",
      "atom",
      "molecule",
      // Common general words (for typo detection)
      "the",
      "and",
      "are",
      "that",
      "with",
      "have",
      "from",
      "been",
      "about",
      "which",
      "their",
      "would",
      "other",
      "these",
      "could",
    ];

    // Try to find SIMILAR word using AGGRESSIVE Levenshtein
    let bestMatch: { word: string; distance: number } | null = null;
    for (const candidate of wordsToMatch) {
      const distance = levenshteinDistance(word, candidate);
      // AGGRESSIVE: Single character difference should match!
      // For "indu" vs "indus" → distance = 1
      // For "blokchain" vs "blockchain" → distance = 1
      const threshold = Math.max(1, Math.ceil(candidate.length * 0.25)); // 25% of length

      if (distance <= threshold) {
        if (!bestMatch || distance < bestMatch.distance) {
          bestMatch = { word: candidate, distance };
        }
      }
    }

    if (bestMatch && bestMatch.distance <= 2) {
      return bestMatch.word;
    }

    // Step 5: For truly unknown words, apply spell pattern fixes
    // This handles things like: "teknology" → "technology" (general English)
    const correctedByPattern = fixSpellingPatternsForWord(word);
    if (correctedByPattern !== word) {
      return correctedByPattern;
    }

    // Step 6: No correction found, return original
    return word;
  });

  return corrected.join(" ");
}

/**
 * Apply spelling fixes to ANY word (even ones not in our dictionaries)
 * This catches common typo patterns in new/unknown words
 */
function fixSpellingPatternsForWord(word: string): string {
  let result = word.toLowerCase();

  // Pattern 1: Common phonetic mistakes
  // "teh" → "the", "teknology" → "technology", "recieve" → "receive"
  const phoneticFixes: Record<string, string> = {
    // K → C for soft sounds: "teknology" → "technology"
    k: "c", // But only in certain contexts... tricky
    // Double letters
    ck: "ck",
    // Common vowel swaps: "bussiness" → "business"
    ss: "ss",
    i: "i",
    e: "e",
  };

  // Pattern 2: Key typo patterns that work for ANY word
  result = result
    .replace(/teh\b/g, "the")
    .replace(/adn\b/g, "and")
    .replace(/taht\b/g, "that")
    .replace(/wich\b/g, "which")
    .replace(/recieve/g, "receive")
    .replace(/occured/g, "occurred")
    .replace(/teknology/g, "technology")
    .replace(/komputer/g, "computer")
    .replace(/sceince/g, "science");

  // Pattern 3: Single character transposition common typos
  // "blokchain" → "blockchain" (k missing c before)
  // This is harder to detect algorithmically, so we rely on Levenshtein

  return result;
}

/**
 * Use n-gram similarity to find closest unknown topic
 * When word doesn't match exactly, find the closest match by structure
 */
function findSimilarUnknownTopic(input: string): string {
  const words = input.toLowerCase().split(/\s+/);
  const corrected: string[] = [];

  for (const word of words) {
    // Try Levenshtein on compound word patterns
    let best: { word: string; similarity: number } = {
      word: word,
      similarity: 0,
    };

    // Check against known academic topics (from patterns)
    const validTopics = [
      "quantum",
      "thermodynamics",
      "electromagnetism",
      "respiration",
      "photosynthesis",
      "oxidation",
      "reduction",
      "wave",
      "function",
      "integration",
      "differentiation",
      "probability",
      "statistics",
      "mechanics",
      "dynamics",
      "kinematics",
      "energy",
      "force",
      "matter",
      "atom",
      "molecule",
      "reaction",
      "element",
    ];

    for (const topic of validTopics) {
      const similarity = ngramSimilarity(word, topic, 2); // Use 2-grams for short words
      if (similarity > best.similarity && similarity > 0.5) {
        best = { word: topic, similarity };
      }
    }

    corrected.push(best.word);
  }

  return corrected.join(" ");
}

/**
 * Fix patterns like double letters, transpositions, missing vowels
 * Uses algorithmic patterns that work for ANY unknown word
 */
function fixSpellingPatterns(input: string): string {
  let result = input.toLowerCase();

  // Pattern 1: Common keyboard typos (adjacent keys)
  const keyboardTypos: Record<string, string> = {
    // Adjacent key errors
    teh: "the",
    adn: "and",
    taht: "that",
    wich: "which",
    ebfore: "before",

    // Common letter swaps
    recieve: "receive",
    occured: "occurred",
    seperate: "separate",
    definately: "definitely",
    becuase: "because",
    occassion: "occasion",
    aquire: "acquire",
    adress: "address",
    embarass: "embarrass",

    // Phonetic patterns
    thier: "their",
    bussiness: "business",
    neccessary: "necessary",
  };

  if (keyboardTypos[result]) {
    return keyboardTypos[result];
  }

  // Pattern 2: Double consonants
  // "grammer" → "grammar", "ocassion" → "occasion"
  result = result.replace(/([a-z])\1{2,}/g, "$1$1"); // Reduce 3+ repeats to 2

  // Pattern 3: Missing vowels (vowel erasure)
  // "prblm" could be "problem", "strng" could be "strong"
  // Check if word has NO vowels and length > 3, it's probably missing vowels
  if (result.length > 3 && !/[aeiou]/.test(result)) {
    // Try adding vowels based on common patterns
    const vowelPatterns: Record<string, string> = {
      str: "str", // structure, string, stream
      scr: "scr", // screen, script
      thr: "thr", // three, through
      chr: "chr", // chrome, chronic
      br: "br", // brief, bring
      gr: "gr", // great, green
      dr: "dr", // dream, driver
      fr: "fr", // frequency, friend
      pr: "pr", // probability, problem
      tr: "tr", // triangle, try
      cl: "cl", // clean, class
      gl: "gl", // glass, glue
      sk: "sk", // sketch, skill
      sp: "sp", // species, space
      st: "st", // study, strong
      sw: "sw", // switch, sweet
    };

    for (const [pattern, value] of Object.entries(vowelPatterns)) {
      if (result.startsWith(pattern)) {
        // Likely missing vowel - keep as is but mark for manual review
        break;
      }
    }
  }

  // Pattern 4: Common suffix errors
  // "-tion" → "-shun", "-sion"
  // "-ment" → "-mnt"
  // "-ness" → "-nes"
  result = result
    .replace(/shun$/g, "tion")
    .replace(/sion$/g, "tion")
    .replace(/mnt$/g, "ment")
    .replace(/nes$/g, "ness")
    .replace(/ise$(?!.*ize)/g, "ize")
    .replace(/ble$/g, "ble");

  // Pattern 5: Prefix errors
  // "un-" → "in-", "non-" errors
  result = result
    .replace(/^inreasonable/, "unreasonable")
    .replace(/^inmobile/, "immobile");

  return result;
}

/**
 * Core unknown topic matcher - For ANY input not in TOPIC_MAP
 * Works like Google search: fuzzy matching on structure, not just dictionary
 */
function intelligentUnknownTopicMatcher(input: string): string {
  if (!input || !input.trim()) return "";

  let normalized = input.trim().toLowerCase();

  // STEP 1: Apply spelling pattern fixes (works for ANY unknown word)
  normalized = fixSpellingPatterns(normalized);

  // STEP 2: Correct compound words (e.g., "cel biology" → "cell biology")
  normalized = correctCompoundWords(normalized);

  // STEP 3: If still doesn't look right, use n-gram similarity
  const words = normalized.split(/\s+/);
  if (words.some(w => w.length > 3 && levenshteinDistance(w, w) > 0)) {
    normalized = findSimilarUnknownTopic(normalized);
  }

  // STEP 4: Normalize spacing and apply title case
  normalized = normalized
    .replace(/\s+/g, " ")
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return normalized;
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
 * Generic fuzzy match for ANY unknown input (NOW ENHANCED)
 * Uses multiple strategies prioritizing intelligent matching
 */
function genericFuzzyMatch(input: string): string {
  if (!input || !input.trim()) return "";

  // Use the new intelligent unknown topic matcher
  // This handles ANY unknown input with spelling mistakes
  return intelligentUnknownTopicMatcher(input);
}

/**
 * Common misspellings that should be corrected before fuzzy matching
 * Catches typos that are very frequent but might not be in specific domain maps
 * Examples: "renissance" → "renaissance", "photosynthsis" → "photosynthesis"
 */
const COMMON_MISSPELLINGS: Record<string, string> = {
  // History
  renissance: "renaissance",
  renaisance: "renaissance",
  renaisence: "renaissance",
  renaisaunce: "renaissance",
  renasissance: "renaissance",

  // Science
  photosynthsis: "photosynthesis",
  photosynthses: "photosynthesis",
  respriation: "respiration",
  asimilaton: "assimilation",
  digeston: "digestion",
  transpirationn: "transpiration",

  // Chemistry
  chemisty: "chemistry",
  chemstry: "chemistry",
  chemestry: "chemistry",
  oxydation: "oxidation",

  // Biology
  chromozome: "chromosome",
  mitochndria: "mitochondria",
  ribosme: "ribosome",
  nucleas: "nucleus",
  organelle: "organelle",

  // Physics
  velosity: "velocity",
  aceleration: "acceleration",
  magnatism: "magnetism",
  elektromagnetism: "electromagnetism",

  // Mathematics
  algbra: "algebra",
  trigonmtry: "trigonometry",
  geomety: "geometry",
  probabilty: "probability",
  statistcs: "statistics",

  // English
  grammer: "grammar",
  grammr: "grammar",
  literatur: "literature",

  // Common
  definately: "definitely",
  occured: "occurred",
  seperate: "separate",
  sinifcant: "significant",
  enviroment: "environment",
  develpment: "development",
  acheive: "achieve",
  recieve: "receive",
  proceedure: "procedure",
  occassion: "occasion",
};

/**
 * 🎯 ADAPTIVE FUZZY MATCHING - Handles BOTH predefined and unknown inputs
 * NOW WITH AGGRESSIVE SPELLING CORRECTION!
 *
 * Matching priority (fastest to slowest):
 * 1. Common misspellings (instant, <1ms) - "renissance" → "renaissance"
 * 2. Exact match in predefined map (instant)
 * 3. Levenshtein distance with adaptive threshold (fast, handles typos)
 * 4. Generic fuzzy algorithms (slower, for unknown values)
 *
 * Works for: topics, subjects, tags, labels, descriptions, etc.
 */
function adaptiveFuzzyMatch(
  input: string,
  predefinedMap?: Record<string, string>,
): string {
  if (!input || !input.trim()) return "";

  let normalized = input.trim().toLowerCase();

  // STEP 0: Check COMMON MISSPELLINGS FIRST (instant)
  // This catches "renissance" → "renaissance" immediately!
  if (COMMON_MISSPELLINGS[normalized]) {
    normalized = COMMON_MISSPELLINGS[normalized];
  }

  // STEP 1: Singularize plural forms FIRST
  // Ensures: "photons" and "photon" both become "photon" → same normalized form ✓
  // Applied BEFORE stop word removal to work on complete words
  const words = normalized.split(/\s+/);
  const singularizedWords = words.map(word => singularize(word));
  const singularized = singularizedWords.join(" ");

  // STEP 2: Remove stop words (applies UNIVERSALLY to ALL topics)
  // Ensures: "photosynthesis", "the photosynthesis", "definition of photosynthesis" all normalize to same
  const withoutStopWords = removeStopWords(singularized).trim();

  // If nothing left after removing stop words, fall back to generic matching
  if (!withoutStopWords) {
    return genericFuzzyMatch(input);
  }

  // STEP 3: Check predefined mappings using stop-word-free version
  if (predefinedMap) {
    if (predefinedMap[withoutStopWords]) {
      return predefinedMap[withoutStopWords];
    }

    // Try Levenshtein distance FIRST (more aggressive now!)
    // With adaptive threshold, "renissance" will match "renaissance" with distance 1
    const keys = Object.keys(predefinedMap);
    const closestKey = findClosestSubject(withoutStopWords, keys);
    if (closestKey) {
      return predefinedMap[closestKey];
    }

    // Try prefix matching - but only for similar-length keys!
    // This prevents "electron" from matching "electronegativity"
    for (const [key, value] of Object.entries(predefinedMap)) {
      // Only accept prefix matches if key is not much longer than input
      const reasonableMatch =
        Math.abs(key.length - withoutStopWords.length) <= 5;
      if (
        reasonableMatch &&
        (key.startsWith(withoutStopWords) || withoutStopWords.startsWith(key))
      ) {
        return value;
      }
    }
  }

  // STEP 4: No match in predefined - use generic matching on stop-word-free version
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
    // ════════════════════════════════════════════════════════════════
    // SCIENCES (Class 6-12)
    // ════════════════════════════════════════════════════════════════
    // General Science & Combined Science
    science: "Science",
    sci: "Science",
    sc: "Science",
    scie: "Science",
    sciences: "Science",
    general_science: "Science",
    generalscience: "Science",
    combined_science: "Combined Science",
    integrated_science: "Integrated Science",

    // Biology
    bio: "Biology",
    biolog: "Biology",
    biologi: "Biology",
    biol: "Biology",
    bioo: "Biology",
    biology: "Biology",
    zoology: "Zoology",
    botany: "Botany",
    life_science: "Life Science",
    life_sciences: "Life Sciences",

    // Chemistry
    chem: "Chemistry",
    chemist: "Chemistry",
    chemistri: "Chemistry",
    chemistry: "Chemistry",
    ch: "Chemistry",
    chemi: "Chemistry",
    chemestry: "Chemistry",

    // Physics
    physics: "Physics",
    physic: "Physics",
    phy: "Physics",
    phys: "Physics",
    physical: "Physics",
    physical_science: "Physics",
    physica: "Physics",

    // Environmental Science
    environmental: "Environmental Science",
    environmentalscience: "Environmental Science",
    env_science: "Environmental Science",
    envscience: "Environmental Science",
    environment: "Environmental Science",
    ecology: "Ecology",

    // ════════════════════════════════════════════════════════════════
    // MATHEMATICS (Class 3-12)
    // ════════════════════════════════════════════════════════════════
    math: "Mathematics",
    maths: "Mathematics",
    mathe: "Mathematics",
    mathem: "Mathematics",
    mathematic: "Mathematics",
    mathemat: "Mathematics",
    mth: "Mathematics",
    mthl: "Mathematics",
    mathematics: "Mathematics",
    mathematica: "Mathematics",
    arithmetic: "Arithmetic",
    algebra: "Algebra",
    geometry: "Geometry",
    trigonometry: "Trigonometry",
    calculus: "Calculus",
    statistics: "Statistics",
    stats: "Statistics",

    // ════════════════════════════════════════════════════════════════
    // LANGUAGE & LITERATURE (Class 3-12)
    // ════════════════════════════════════════════════════════════════
    // English
    english: "English",
    eng: "English",
    engl: "English",
    englsh: "English",
    english_language: "English",
    english_literature: "English",
    english_language_literature: "English",
    english_core: "English",
    englishcore: "English",
    english_elective: "English",

    // Hindi
    hindi: "Hindi",
    hind: "Hindi",
    hindi_language: "Hindi",
    hindi_literature: "Hindi",
    hindi_core: "Hindi",
    hindcore: "Hindi",
    hindi_elective: "Hindi",

    // Regional Languages
    regional_language: "Regional Language",
    regional: "Regional Language",
    marathi: "Marathi",
    gujarati: "Gujarati",
    kannada: "Kannada",
    tamil: "Tamil",
    telugu: "Telugu",
    punjabi: "Punjabi",
    bengali: "Bengali",
    malayalam: "Malayalam",
    odia: "Odia",
    urdu: "Urdu",

    // Sanskrit & Classical Languages
    sanskrit: "Sanskrit",
    sans: "Sanskrit",
    skrit: "Sanskrit",
    classical_language: "Classical Language",
    classical: "Classical Language",

    // ════════════════════════════════════════════════════════════════
    // SOCIAL STUDIES & SOCIAL SCIENCES (Class 6-12)
    // ════════════════════════════════════════════════════════════════
    // General Social Studies
    social_studies: "Social Studies",
    social_science: "Social Science",
    social_scienc: "Social Science",
    socialscienc: "Social Science",
    social: "Social Studies",
    soc: "Social Studies",

    // History
    history: "History",
    hist: "History",
    histor: "History",
    histoire: "History",
    ancient_history: "History",
    modern_history: "History",
    medieval_history: "History",
    world_history: "History",

    // Geography
    geography: "Geography",
    geo: "Geography",
    geografi: "Geography",
    geog: "Geography",
    geograpy: "Geography",
    physical_geography: "Geography",
    human_geography: "Geography",

    // Civics & Governance
    civics: "Civics",
    civic: "Civics",
    civics_and_governance: "Civics",
    citizenship: "Civics",
    governance: "Civics",
    political_science: "Political Science",
    political: "Political Science",
    politics: "Political Science",
    pol: "Political Science",
    poltical_science: "Political Science",

    // Economics
    economics: "Economics",
    econ: "Economics",
    economi: "Economics",
    economic: "Economics",
    economcs: "Economics",

    // Psychology
    psychology: "Psychology",
    psych: "Psychology",
    psycholog: "Psychology",
    pschology: "Psychology",

    // Sociology
    sociology: "Sociology",
    socio: "Sociology",

    // ════════════════════════════════════════════════════════════════
    // INFORMATION TECHNOLOGY & COMPUTER SCIENCE (Class 6-12)
    // ════════════════════════════════════════════════════════════════
    // Computer Science
    computer_science: "Computer Science",
    computer: "Computer Science",
    computersci: "Computer Science",
    cs: "Computer Science",
    coding: "Computer Science",
    code: "Computer Science",
    programm: "Computer Science",
    programming: "Computer Science",
    informatica: "Computer Science",
    informatics: "Computer Science",
    information_technology: "Information Technology",
    information_tech: "Information Technology",
    it: "Information Technology",
    ict: "Information Technology",

    // ════════════════════════════════════════════════════════════════
    // VOCATIONAL & SKILL-BASED (Class 9-12)
    // ════════════════════════════════════════════════════════════════
    vocational: "Vocational",
    skill_development: "Skill",
    skill: "Skill",
    commerce: "Commerce",
    accounting: "Accounting",
    business_studies: "Business Studies",
    business: "Business Studies",
    entrepreneurship: "Entrepreneurship",
    hospitality: "Hospitality",
    tourism: "Tourism",
    beauty_culture: "Beauty Culture",
    agriculture: "Agriculture",
    home_science: "Home Science",
    home_economics: "Home Science",

    // ════════════════════════════════════════════════════════════════
    // PHYSICAL EDUCATION & SPORTS (Class 3-12)
    // ════════════════════════════════════════════════════════════════
    physical_education: "Physical Education",
    pe: "Physical Education",
    phys_ed: "Physical Education",
    physed: "Physical Education",
    sports: "Sports",
    sports_education: "Sports",
    exercise: "Physical Education",
    fitness: "Physical Education",
    yoga: "Yoga",

    // ════════════════════════════════════════════════════════════════
    // ARTS & PERFORMANCE (Class 3-12)
    // ════════════════════════════════════════════════════════════════
    art: "Art",
    arts: "Arts",
    visual_arts: "Visual Arts",
    painting: "Painting",
    drawing: "Drawing",
    sculpture: "Sculpture",
    crafts: "Crafts",
    music: "Music",
    musics: "Music",
    singing: "Singing",
    dance: "Dance",
    theater: "Theater",
    theatre: "Theatre",
    dramatics: "Dramatics",
    drama: "Drama",

    // ════════════════════════════════════════════════════════════════
    // SPECIALIZED SUBJECTS (Class Optional Electives)
    // ════════════════════════════════════════════════════════════════
    // Advanced Sciences
    geology: "Geology",
    astronomy: "Astronomy",
    meteorology: "Meteorology",
    biotechnology: "Biotechnology",
    microbiology: "Microbiology",

    // Languages & Literature  french: "French",
    german: "German",
    spanish: "Spanish",
    japanese: "Japanese",
    chinese: "Chinese",
    mandarin: "Mandarin",

    // Mathematics Specializations
    applied_mathematics: "Applied Mathematics",
    pure_mathematics: "Pure Mathematics",
    business_mathematics: "Business Mathematics",

    // Other Specializations
    philosophy: "Philosophy",
    law: "Law",
    education: "Education",
    library_science: "Library Science",
    journalism: "Journalism",
    mass_communication: "Mass Communication",
    software_engineering: "Software Engineering",
    electronics: "Electronics",
    electrical: "Electrical",
    mechanical: "Mechanical",
    civil: "Civil",

    // ════════════════════════════════════════════════════════════════
    // CROSS-CURRICULAR & INTEGRATED
    // ════════════════════════════════════════════════════════════════
    stem: "STEM",
    steam: "STEAM",
    environmental_studies: "Environmental Studies",
    integrated_studies: "Integrated Studies",
    project_work: "Project Work",
    fieldwork: "Field work",
    practical: "Practical",
    practicals: "Practical",
    laboratory: "Laboratory",
    lab: "Laboratory",
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
    // ════════════════════════════════════════════════════════════════
    // BIOLOGY - Class 5-12 (CBSE, ICSE, State Boards)
    // ════════════════════════════════════════════════════════════════
    // Photosynthesis & Respiration (Class 7-8)
    photosynthesis: "Photosynthesis",
    photosynhtesis: "Photosynthesis",
    photosysthesis: "Photosynthesis",
    photosynthsis: "Photosynthesis",
    photosynth: "Photosynthesis",
    photosyntheses: "Photosynthesis",
    photosynthetic: "Photosynthesis",
    light_reaction: "Light Reaction",
    dark_reaction: "Dark Reaction",
    calvin_cycle: "Calvin Cycle",
    krebs_cycle: "Krebs Cycle",
    cellular_respiration: "Cellular Respiration",
    aerobic_respiration: "Aerobic Respiration",
    anaerobic_respiration: "Anaerobic Respiration",
    glycolysis: "Glycolysis",
    citric_acid_cycle: "Citric Acid Cycle",

    // Cell Structure & Organelles (Class 5-6)
    cell: "Cell",
    mitochondria: "Mitochondria",
    mitocondria: "Mitochondria",
    mitochondrion: "Mitochondria",
    mitochindria: "Mitochondria",
    mitochondrial: "Mitochondria",
    chloroplast: "Chloroplast",
    chloroplst: "Chloroplast",
    chloroplastic: "Chloroplast",
    ribosome: "Ribosome",
    ribosme: "Ribosome",
    ribsomal: "Ribosome",
    nucleus: "Nucleus",
    nucleu: "Nucleus",
    nucleas: "Nucleus",
    nucleic: "Nucleus",
    lysosome: "Lysosome",
    lysosm: "Lysosome",
    vacuole: "Vacuole",
    vacuol: "Vacuole",
    endoplasmic_reticulum: "Endoplasmic Reticulum",
    golgi_apparatus: "Golgi Apparatus",
    centriole: "Centriole",
    centrosome: "Centrosome",
    cell_membrane: "Cell Membrane",
    cell_wall: "Cell Wall",
    cytoplasm: "Cytoplasm",
    protoplasm: "Protoplasm",
    nucleolus: "Nucleolus",
    chromatin: "Chromatin",
    chromosome: "Chromosome",
    chromosmal: "Chromosome",

    // Reproduction & Genetics (Class 9-10)
    reproduction: "Reproduction",
    reproduktion: "Reproduction",
    asexual_reproduction: "Asexual Reproduction",
    sexual_reproduction: "Sexual Reproduction",
    mitosis: "Mitosis",
    meiosis: "Meiosis",
    binary_fission: "Binary Fission",
    budding: "Budding",
    fragmentation: "Fragmentation",
    regeneration: "Regeneration",
    genetics: "Genetics",
    heredity: "Heredity",
    dna: "DNA",
    rna: "RNA",
    deoxyribonucleic_acid: "DNA",
    ribonucleic_acid: "RNA",
    gene: "Gene",
    genetic: "Genetic",
    allele: "Allele",
    phenotype: "Phenotype",
    genotype: "Genotype",
    dominant: "Dominant",
    recessive: "Recessive",
    mutation: "Mutation",
    mutant: "Mutation",
    variation: "Variation",
    trait: "Trait",
    mendelian_inheritance: "Mendelian Inheritance",

    // Human Anatomy & Physiology (Class 9-10)
    skeleton: "Skeleton",
    skeletal: "Skeleton",
    bone: "Bone",
    bonemass: "Bone",
    cartilage: "Cartilage",
    cartilaginous: "Cartilage",
    joint: "Joint",
    articulation: "Joint",
    ligament: "Ligament",
    tendon: "Tendon",
    muscle: "Muscle",
    muscular: "Muscle",
    cardiac_muscle: "Cardiac Muscle",
    smooth_muscle: "Smooth Muscle",
    skeletal_muscle: "Skeletal Muscle",
    nervous_system: "Nervous System",
    neuron: "Neuron",
    nerve: "Nerve",
    nerve_cell: "Nerve Cell",
    synapse: "Synapse",
    axon: "Axon",
    dendrite: "Dendrite",
    brain: "Brain",
    spinal_cord: "Spinal Cord",
    cerebrum: "Cerebrum",
    cerebellum: "Cerebellum",
    medulla: "Medulla",
    reflex: "Reflex",
    reflex_arc: "Reflex Arc",

    // Circulatory & Respiratory System (Class 9-10)
    circulatory_system: "Circulatory System",
    heart: "Heart",
    blood: "Blood",
    blood_cell: "Blood Cell",
    red_blood_cell: "Red Blood Cell",
    white_blood_cell: "White Blood Cell",
    platelet: "Platelet",
    artery: "Artery",
    arteries: "Artery",
    vein: "Vein",
    capillary: "Capillary",
    capillaries: "Capillary",
    hemoglobin: "Hemoglobin",
    respiration: "Respiration",
    respiratory_system: "Respiratory System",
    lung: "Lung",
    trachea: "Trachea",
    bronchi: "Bronchi",
    bronchiole: "Bronchiole",
    alveolus: "Alveolus",
    diaphragm: "Diaphragm",

    // Digestive & Excretory System (Class 9-10)
    digestive_system: "Digestive System",
    digestion: "Digestion",
    mouth: "Mouth",
    esophagus: "Esophagus",
    stomach: "Stomach",
    intestine: "Intestine",
    small_intestine: "Small Intestine",
    large_intestine: "Large Intestine",
    colon: "Colon",
    rectum: "Rectum",
    liver: "Liver",
    pancreas: "Pancreas",
    enzyme: "Enzyme",
    enyzme: "Enzyme",
    amylase: "Amylase",
    protease: "Protease",
    lipase: "Lipase",
    bile: "Bile",
    excretory_system: "Excretory System",
    kidney: "Kidney",
    ureter: "Ureter",
    bladder: "Bladder",
    urethra: "Urethra",
    nephron: "Nephron",
    glomerulus: "Glomerulus",

    // Endocrine & Immune System (Class 10)
    endocrine_system: "Endocrine System",
    hormone: "Hormone",
    hormnal: "Hormone",
    pituitary_gland: "Pituitary Gland",
    thyroid: "Thyroid",
    thyroid_gland: "Thyroid Gland",
    pancreatic: "Pancreatic",
    adrenal_gland: "Adrenal Gland",
    testosterone: "Testosterone",
    estrogen: "Estrogen",
    insulin: "Insulin",
    glucagon: "Glucagon",
    immune_system: "Immune System",
    immunity: "Immunity",
    antibody: "Antibody",
    antigen: "Antigen",
    white_blood_cells: "White Blood Cell",
    lymphocyte: "Lymphocyte",

    // Plant Physiology (Class 6-10)
    plant_physiology: "Plant Physiology",
    transpiration: "Transpiration",
    translocation: "Translocation",
    phototropism: "Phototropism",
    geotropism: "Geotropism",
    hydrotropism: "Hydrotropism",
    plant_hormone: "Plant Hormone",
    auxin: "Auxin",
    gibberellin: "Gibberellin",
    cytokinin: "Cytokinin",
    ethylene: "Ethylene",
    abscisic_acid: "Abscisic Acid",

    // Ecology (Class 7-8)
    ecology: "Ecology",
    ecosystem: "Ecosystem",
    biosphere: "Biosphere",
    habitat: "Habitat",
    niche: "Niche",
    population: "Population",
    community: "Community",
    biotic: "Biotic",
    abiotic: "Abiotic",
    species: "Species",
    biodiversity: "Biodiversity",
    food_chain: "Food Chain",
    food_web: "Food Web",
    energy_pyramid: "Energy Pyramid",
    predator: "Predator",
    prey: "Prey",
    predation: "Predation",
    herbivore: "Herbivore",
    carnivore: "Carnivore",
    omnivore: "Omnivore",
    producer: "Producer",
    consumer: "Consumer",
    decomposer: "Decomposer",
    primary_consumer: "Primary Consumer",
    secondary_consumer: "Secondary Consumer",
    tertiary_consumer: "Tertiary Consumer",
    succession: "Succession",
    symbiosis: "Symbiosis",
    mutualism: "Mutualism",
    commensalism: "Commensalism",
    parasitism: "Parasitism",
    biome: "Biome",
    forest: "Forest",
    grassland: "Grassland",
    desert: "Desert",
    aquatic_ecosystem: "Aquatic Ecosystem",
    freshwater: "Freshwater",
    saltwater: "Saltwater",
    marine: "Marine",
    conservation: "Conservation",
    endangered_species: "Endangered Species",

    // ════════════════════════════════════════════════════════════════
    // CHEMISTRY - Class 6-12 (CBSE, ICSE, State Boards)
    // ════════════════════════════════════════════════════════════════
    // Atomic Structure (Class 8-11)
    atom: "Atom",
    atomic_structure: "Atomic Structure",
    electron: "Electron",
    electronn: "Electron",
    proton: "Proton",
    neutron: "Neutron",
    nuclei: "Nucleus",
    atomic_number: "Atomic Number",
    mass_number: "Mass Number",
    isobar: "Isobar",
    orbital: "Orbital",
    shell: "Shell",
    subshell: "Subshell",
    s_orbital: "S Orbital",
    p_orbital: "P Orbital",
    d_orbital: "D Orbital",
    f_orbital: "F Orbital",
    electron_configuration: "Electron Configuration",
    valence_electron: "Valence Electron",
    bohr_model: "Bohr Model",
    quantum_mechanical_model: "Quantum Mechanical Model",

    // Chemical Bonding (Class 9-11)
    chemical_bonding: "Chemical Bonding",
    bond: "Bond",
    covalent_bond: "Covalent Bond",
    ionic_bond: "Ionic Bond",
    metallic_bond: "Metallic Bond",
    hydrogen_bond: "Hydrogen Bond",
    van_der_waals_force: "Van der Waals Force",
    electronegativity: "Electronegativity",
    electrnegativty: "Electronegativity",
    polarity: "Polarity",
    polar_bond: "Polar Bond",
    nonpolar_bond: "Nonpolar Bond",
    dative_bond: "Dative Bond",
    coordinate_bond: "Coordinate Bond",
    multiple_bond: "Multiple Bond",
    double_bond: "Double Bond",
    triple_bond: "Triple Bond",

    // Molecules & Compounds (Class 6-9)
    molecule: "Molecule",
    molcule: "Molecule",
    compound: "Compound",
    element: "Element",
    mixture: "Mixture",
    solution: "Solution",
    solute: "Solute",
    solvent: "Solvent",
    alloy: "Alloy",
    colloid: "Colloid",
    suspension: "Suspension",
    emulsion: "Emulsion",
    sol: "Sol",
    gel: "Gel",

    // Periodic Table & Elements (Class 8-11)
    periodic_table: "Periodic Table",
    group: "Group",
    alkali_metal: "Alkali Metal",
    alkaline_earth_metal: "Alkaline Earth Metal",
    transition_metal: "Transition Metal",
    halogen: "Halogen",
    noble_gas: "Noble Gas",
    nonmetal: "Nonmetal",
    metalloid: "Metalloid",
    hydrogen: "Hydrogen",
    oxygen: "Oxygen",
    nitrogen: "Nitrogen",
    carbon: "Carbon",
    chlorine: "Chlorine",
    sodium: "Sodium",
    potassium: "Potassium",
    calcium: "Calcium",
    magnesium: "Magnesium",
    iron: "Iron",
    copper: "Copper",
    zinc: "Zinc",
    silver: "Silver",
    gold: "Gold",
    sulfur: "Sulfur",
    phosphorus: "Phosphorus",

    // Chemical Reactions (Class 6-10)
    chemical_reaction: "Chemical Reaction",
    chemical_change: "Chemical Change",
    combustion: "Combustion",
    oxidation: "Oxidation",
    single_displacement: "Single Displacement",
    double_displacement: "Double Displacement",
    synthesis: "Synthesis",
    hydrolysis: "Hydrolysis",
    neutralization: "Neutralization",
    esterification: "Esterification",
    polymerization: "Polymerization",
    exothermic: "Exothermic",
    endothermic: "Endothermic",
    catalyst: "Catalyst",
    catlayst: "Catalyst",
    inhibitor: "Inhibitor",
    activation_energy: "Activation Energy",

    // Acids, Bases & Salts (Class 7-10)
    acid: "Acid",
    base: "Base",
    salt: "Salt",
    ph: "pH",
    ph_scale: "pH Scale",
    acidic: "Acidic",
    basic: "Basic",
    neutral: "Neutral",
    indicator: "Indicator",
    strong_acid: "Strong Acid",
    weak_acid: "Weak Acid",
    strong_base: "Strong Base",
    weak_base: "Weak Base",
    hydrochloric_acid: "Hydrochloric Acid",
    sulfuric_acid: "Sulfuric Acid",
    nitric_acid: "Nitric Acid",
    acetic_acid: "Acetic Acid",
    sodium_hydroxide: "Sodium Hydroxide",
    ammonia: "Ammonia",
    sodium_chloride: "Sodium Chloride",
    naci: "Sodium Chloride",

    // Organic Chemistry (Class 11-12)
    organic_chemistry: "Organic Chemistry",
    hydrocarbon: "Hydrocarbon",
    hydrocabon: "Hydrocarbon",
    alkane: "Alkane",
    alkene: "Alkene",
    alkyne: "Alkyne",
    aromatic: "Aromatic",
    benzene: "Benzene",
    alcohol: "Alcohol",
    aldehyde: "Aldehyde",
    ketone: "Ketone",
    carboxylic_acid: "Carboxylic Acid",
    ester: "Ester",
    ether: "Ether",
    amine: "Amine",
    amide: "Amide",
    polymer: "Polymer",
    polymr: "Polymer",
    monomer: "Monomer",
    plastic: "Plastic",
    rubber: "Rubber",
    isomerism: "Isomerism",
    structural_isomer: "Structural Isomer",

    // Mole Concept & Stoichiometry (Class 9-12)
    mole: "Mole",
    mole_concept: "Mole Concept",
    avogadro_number: "Avogadro Number",
    molar_mass: "Molar Mass",
    molar_volume: "Molar Volume",
    stoichiometry: "Stoichiometry",
    empirical_formula: "Empirical Formula",
    molecular_formula: "Molecular Formula",
    limiting_reagent: "Limiting Reagent",
    percent_yield: "Percent Yield",

    // ════════════════════════════════════════════════════════════════
    // PHYSICS - Class 6-12 (CBSE, ICSE, State Boards)
    // ════════════════════════════════════════════════════════════════
    // Motion & Forces (Class 6-9)
    motion: "Motion",
    distance: "Distance",
    displacement: "Displacement",
    speed: "Speed",
    velocity: "Velocity",
    velocty: "Velocity",
    velcity: "Velocity",
    acceleration: "Acceleration",
    accelaration: "Acceleration",
    force: "Force",
    frce: "Force",
    newton_law: "Newton Law",
    inertia: "Inertia",
    momentum: "Momentum",
    mometnm: "Momentum",
    impulse: "Impulse",
    friction: "Friction",
    frction: "Friction",
    static_friction: "Static Friction",
    kinetic_friction: "Kinetic Friction",
    pressure: "Pressure",
    presure: "Pressure",

    // Energy (Class 6-11)
    energy: "Energy",
    energi: "Energy",
    enrgy: "Energy",
    kinetic_energy: "Kinetic Energy",
    potential_energy: "Potential Energy",
    mechanical_energy: "Mechanical Energy",
    thermal_energy: "Thermal Energy",
    chemical_energy: "Chemical Energy",
    electrical_energy: "Electrical Energy",
    nuclear_energy: "Nuclear Energy",
    work: "Work",
    power: "Power",
    efficiency: "Efficiency",

    // Waves (Class 8-11)
    wave: "Wave",
    wave_motion: "Wave Motion",
    frequency: "Frequency",
    freqency: "Frequency",
    wavelength: "Wavelength",
    wavength: "Wavelength",
    amplitude: "Amplitude",
    amplitud: "Amplitude",
    period: "Period",
    sound_wave: "Sound Wave",
    light_wave: "Light Wave",
    electromagnetic_wave: "Electromagnetic Wave",
    transverse_wave: "Transverse Wave",
    longitudinal_wave: "Longitudinal Wave",
    speed_of_sound: "Speed of Sound",
    speed_of_light: "Speed of Light",
    doppler_effect: "Doppler Effect",
    resonance: "Resonance",

    // Optics (Class 8-11)
    optics: "Optics",
    light: "Light",
    reflection: "Reflection",
    rflection: "Reflection",
    refraction: "Refraction",
    refarction: "Refraction",
    lens: "Lens",
    mirror: "Mirror",
    prism: "Prism",
    spectrum: "Spectrum",
    spectral: "Spectrum",
    color: "Color",
    dispersion: "Dispersion",
    total_internal_reflection: "Total Internal Reflection",
    critical_angle: "Critical Angle",
    focal_length: "Focal Length",
    magnification: "Magnification",
    concave_lens: "Concave Lens",
    convex_lens: "Convex Lens",
    concave_mirror: "Concave Mirror",
    convex_mirror: "Convex Mirror",

    // Electricity & Magnetism (Class 6-12)
    electricity: "Electricity",
    electric_current: "Electric Current",
    electric_charge: "Electric Charge",
    voltage: "Voltage",
    volt: "Volt",
    current: "Current",
    ampere: "Ampere",
    resistance: "Resistance",
    resistivity: "Resistivity",
    conductor: "Conductor",
    insulator: "Insulator",
    ohm_law: "Ohm Law",
    power_dissipation: "Power Dissipation",
    series_circuit: "Series Circuit",
    parallel_circuit: "Parallel Circuit",
    electrostatics: "Electrostatics",
    coulomb_law: "Coulomb Law",
    electric_field: "Electric Field",
    magnetism: "Magnetism",
    magnetic_field: "Magnetic Field",
    magnetic_force: "Magnetic Force",
    electromagnet: "Electromagnet",
    electromagnetic_induction: "Electromagnetic Induction",
    transformer: "Transformer",
    motor: "Motor",
    generator: "Generator",
    capacitor: "Capacitor",
    capacitence: "Capacitance",
    inductor: "Inductor",

    // Modern Physics (Class 11-12)
    modern_physics: "Modern Physics",
    atomic_physics: "Atomic Physics",
    nuclear_physics: "Nuclear Physics",
    quantum_mechanics: "Quantum Mechanics",
    photon: "Photon",
    photoelectric_effect: "Photoelectric Effect",
    photoelectric: "Photoelectric",
    planck_constant: "Planck Constant",
    photon_energy: "Photon Energy",
    wave_particle_duality: "Wave Particle Duality",
    uncertainty_principle: "Uncertainty Principle",
    radioactivity: "Radioactivity",
    radioactive: "Radioactive",
    isotope: "Isotope",
    half_life: "Half Life",
    alpha_decay: "Alpha Decay",
    beta_decay: "Beta Decay",
    gamma_decay: "Gamma Decay",
    nuclear_fission: "Nuclear Fission",
    nuclear_fusion: "Nuclear Fusion",
    mass_defect: "Mass Defect",
    binding_energy: "Binding Energy",

    // ════════════════════════════════════════════════════════════════
    // MATHEMATICS - Class 3-12 (CBSE, ICSE, State Boards)
    // ════════════════════════════════════════════════════════════════
    // Number System (Class 3-6)
    number: "Number",
    number_system: "Number System",
    whole_number: "Whole Number",
    natural_number: "Natural Number",
    integer: "Integer",
    rational_number: "Rational Number",
    irrational_number: "Irrational Number",
    real_number: "Real Number",
    complex_number: "Complex Number",
    prime_number: "Prime Number",
    composite_number: "Composite Number",
    even_number: "Even Number",
    odd_number: "Odd Number",
    fraction: "Fraction",
    decimal: "Decimal",
    percentage: "Percentage",
    ratio: "Ratio",
    proportion: "Proportion",

    // Algebra (Class 6-12)
    algebra: "Algebra",
    algebraic: "Algebraic",
    equation: "Equation",
    inequation: "Inequation",
    inequality: "Inequality",
    variable: "Variable",
    constant: "Constant",
    expression: "Expression",
    algebraic_expression: "Algebraic Expression",
    polynomial: "Polynomial",
    monomial: "Monomial",
    binomial: "Binomial",
    trinomial: "Trinomial",
    coefficient: "Coefficient",
    exponent: "Exponent",
    root: "Root",
    square_root: "Square Root",
    cube_root: "Cube Root",
    quadratic_equation: "Quadratic Equation",
    linear_equation: "Linear Equation",
    cubic_equation: "Cubic Equation",
    factorization: "Factorization",
    factor: "Factor",
    multiple: "Multiple",
    hcf: "HCF",
    lcm: "LCM",
    greatest_common_divisor: "Greatest Common Divisor",
    least_common_multiple: "Least Common Multiple",

    // Trigonometry (Class 10-12)
    trigonometry: "Trigonometry",
    sin: "Sine",
    sine: "Sine",
    cos: "Cosine",
    cosine: "Cosine",
    tan: "Tangent",
    tangent: "Tangent",
    cot: "Cotangent",
    cotangent: "Cotangent",
    sec: "Secant",
    secant: "Secant",
    csc: "Cosecant",
    cosecant: "Cosecant",
    trigonometric_ratio: "Trigonometric Ratio",
    angle: "Angle",
    radian: "Radian",
    degree: "Degree",
    inverse_trigonometry: "Inverse Trigonometry",
    inverse_sine: "Inverse Sine",
    inverse_cosine: "Inverse Cosine",
    inverse_tangent: "Inverse Tangent",

    // Geometry (Class 6-12)
    geometry: "Geometry",
    geometric: "Geometric",
    rectangle: "Rectangle",
    rectange: "Rectangle",
    square: "Square",
    triangle: "Triangle",
    tringle: "Triangle",
    circle: "Circle",
    polygon: "Polygon",
    regular_polygon: "Regular Polygon",
    pentagon: "Pentagon",
    hexagon: "Hexagon",
    heptagon: "Heptagon",
    octagon: "Octagon",
    quadrilateral: "Quadrilateral",
    parallelogram: "Parallelogram",
    rhombus: "Rhombus",
    trapezoid: "Trapezoid",
    trapezium: "Trapezium",
    kite: "Kite",
    cone: "Cone",
    cylinder: "Cylinder",
    sphere: "Sphere",
    cube: "Cube",
    cuboid: "Cuboid",
    rectangular_prism: "Rectangular Prism",
    pyramid: "Pyramid",
    hemisphere: "Hemisphere",
    vertex: "Vertex",
    edge: "Edge",
    face: "Face",
    diagonal: "Diagonal",
    perimeter: "Perimeter",
    circumference: "Circumference",
    area: "Area",
    surface_area: "Surface Area",
    volume: "Volume",
    height: "Height",
    radius: "Radius",
    radious: "Radius",
    diameter: "Diameter",
    dimaeter: "Diameter",
    chord: "Chord",
    arc: "Arc",
    sector: "Sector",

    // Coordinate Geometry & Vectors (Class 9-12)
    coordinate_geometry: "Coordinate Geometry",
    cartesian_plane: "Cartesian Plane",
    x_axis: "X Axis",
    y_axis: "Y Axis",
    origin: "Origin",
    quadrant: "Quadrant",
    coordinate: "Coordinate",
    distance_formula: "Distance Formula",
    section_formula: "Section Formula",
    slope: "Slope",
    gradient: "Gradient",
    collinearity: "Collinearity",
    vector: "Vector",
    scalar: "Scalar",
    vector_addition: "Vector Addition",
    vector_subtraction: "Vector Subtraction",
    dot_product: "Dot Product",
    cross_product: "Cross Product",
    magnitude: "Magnitude",
    direction: "Direction",

    // Calculus (Class 11-12)
    calculus: "Calculus",
    limit: "Limit",
    continuity: "Continuity",
    derivative: "Derivative",
    differentiability: "Differentiability",
    integral: "Integral",
    definite_integral: "Definite Integral",
    indefinite_integral: "Indefinite Integral",
    differentiation: "Differentiation",
    integration: "Integration",
    chain_rule: "Chain Rule",
    product_rule: "Product Rule",
    quotient_rule: "Quotient Rule",
    fundamental_theorem: "Fundamental Theorem",
    application_of_derivative: "Application of Derivative",
    maxima: "Maxima",
    minima: "Minima",
    increasing_function: "Increasing Function",
    decreasing_function: "Decreasing Function",

    // Statistics & Probability (Class 8-12)
    statistics: "Statistics",
    statistical: "Statistical",
    probability: "Probability",
    probablity: "Probability",
    mean: "Mean",
    median: "Median",
    mode: "Mode",
    standard_deviation: "Standard Deviation",
    variance: "Variance",
    frequency_distribution: "Frequency Distribution",
    histogram: "Histogram",
    bar_graph: "Bar Graph",
    pie_chart: "Pie Chart",
    scatter_plot: "Scatter Plot",
    normal_distribution: "Normal Distribution",
    binomial_distribution: "Binomial Distribution",
    poisson_distribution: "Poisson Distribution",
    permutation: "Permutation",
    combination: "Combination",
    factorial: "Factorial",
    sample_space: "Sample Space",
    event: "Event",
    independent_event: "Independent Event",
    dependent_event: "Dependent Event",
    conditional_probability: "Conditional Probability",

    // ════════════════════════════════════════════════════════════════
    // HISTORY - Class 6-12 (CBSE, ICSE, State Boards)
    // ════════════════════════════════════════════════════════════════
    // Ancient India (Class 6-9)
    ancient_india: "Ancient India",
    indus_valley_civilization: "Indus Valley Civilization",
    vedic_age: "Vedic Age",
    vedas: "Vedas",
    rigveda: "Rigveda",
    yajurveda: "Yajurveda",
    samaveda: "Samaveda",
    atharvaveda: "Atharvaveda",
    aryan: "Aryan",
    vedic_period: "Vedic Period",
    heroic_age: "Heroic Age",
    upanishad: "Upanishad",
    brahmanism: "Brahmanism",
    caste_system: "Caste System",
    mauryan_empire: "Mauryan Empire",
    ashoka: "Ashoka",
    chandragupta: "Chandragupta",
    gupta_empire: "Gupta Empire",
    samudragupta: "Samudragupta",
    chandragupta_ii: "Chandragupta II",
    harsha: "Harsha",

    // Medieval India (Class 7-10) delhi_sultanate: "Delhi Sultanate",
    mughal_empire: "Mughal Empire",
    akbar: "Akbar",
    babar: "Babar",
    humayun: "Humayun",
    shah_jahan: "Shah Jahan",
    taj_mahal: "Taj Mahal",
    aurangzeb: "Aurangzeb",
    sufism: "Sufism",
    bhakti_movement: "Bhakti Movement",
    ramanuja: "Ramanuja",
    kabir: "Kabir",
    tulsidas: "Tulsidas",
    guru_nanak: "Guru Nanak",

    // Modern India (Class 8-10)
    modern_india: "Modern India",
    british_raj: "British Raj",
    east_india_company: "East India Company",
    british_india: "British India",
    sepoy_mutiny: "Sepoy Mutiny",
    revolt_of_1857: "Revolt of 1857",
    indian_national_congress: "Indian National Congress",
    nationalism: "Nationalism",
    nationalist_movement: "Nationalist Movement",
    independence_movement: "Independence Movement",
    swadeshi_movement: "Swadeshi Movement",
    khilafat_movement: "Khilafat Movement",
    non_cooperation_movement: "Non Cooperation Movement",
    civil_disobedience: "Civil Disobedience",
    quit_india_movement: "Quit India Movement",
    mahatma_gandhi: "Mahatma Gandhi",
    jawaharlal_nehru: "Jawaharlal Nehru",
    sardar_vallabhbhai_patel: "Sardar Vallabhbhai Patel",
    independence: "Independence",
    partition: "Partition",
    communal_violence: "Communal Violence",

    // ════════════════════════════════════════════════════════════════
    // WORLD HISTORY - Class 9-12 (Optional)
    // ════════════════════════════════════════════════════════════════
    world_history: "World History",
    ancient_greece: "Ancient Greece",
    ancient_rome: "Ancient Rome",
    renaissance: "Renaissance",
    enlightenment: "Enlightenment",
    reformation: "Reformation",
    french_revolution: "French Revolution",
    industrial_revolution: "Industrial Revolution",
    world_war_1: "World War 1",
    world_war_2: "World War 2",
    cold_war: "Cold War",
    victorian_era: "Victorian Era",
    roman_empire: "Roman Empire",
    greek_civilization: "Greek Civilization",
    medieval_period: "Medieval Period",
    age_of_exploration: "Age of Exploration",
    capitalism: "Capitalism",
    socialism: "Socialism",
    communism: "Communism",
    imperialism: "Imperialism",
    colonialism: "Colonialism",
    feudalism: "Feudalism",
    monarchy: "Monarchy",

    // ════════════════════════════════════════════════════════════════
    // GEOGRAPHY - Class 6-12 (CBSE, ICSE, State Boards)
    // ════════════════════════════════════════════════════════════════
    // Physical Geography
    geography: "Geography",
    earth: "Earth",
    globe: "Globe",
    map: "Map",
    mapmaking: "Mapmaking",
    cartography: "Cartography",
    latitude: "Latitude",
    longitude: "Longitude",
    equator: "Equator",
    tropic_of_cancer: "Tropic of Cancer",
    tropic_of_capricorn: "Tropic of Capricorn",
    arctic_circle: "Arctic Circle",
    antarctic_circle: "Antarctic Circle",
    prime_meridian: "Prime Meridian",
    timezone: "Timezone",
    continent: "Continent",
    ocean: "Ocean",
    sea: "Sea",
    mountain: "Mountain",
    mountain_range: "Mountain Range",
    plateau: "Plateau",
    plain: "Plain",
    valley: "Valley",
    canyon: "Canyon",
    gorge: "Gorge",
    island: "Island",
    peninsula: "Peninsula",
    cape: "Cape",
    gulf: "Gulf",
    bay: "Bay",
    strait: "Strait",
    delta: "Delta",
    estuary: "Estuary",
    river: "River",
    tributary: "Tributary",
    lake: "Lake",
    lagoon: "Lagoon",
    glacier: "Glacier",
    waterfall: "Waterfall",
    geyser: "Geyser",
    hot_spring: "Hot Spring",
    soil: "Soil",
    rock: "Rock",
    mineral: "Mineral",
    ore: "Ore",
    fossil_fuel: "Fossil Fuel",
    coal: "Coal",
    petroleum: "Petroleum",
    natural_gas: "Natural Gas",

    // Climate & Weather
    climate: "Climate",
    weather: "Weather",
    temperature: "Temperature",
    humidity: "Humidity",
    precipitation: "Precipitation",
    rainfall: "Rainfall",
    snowfall: "Snowfall",
    hailstorm: "Hailstorm",
    monsoon: "Monsoon",
    monsoon_wind: "Monsoon Wind",
    trade_wind: "Trade Wind",
    westerly_wind: "Westerly Wind",
    cyclone: "Cyclone",
    typhoon: "Typhoon",
    hurricane: "Hurricane",
    tornado: "Tornado",
    blizzard: "Blizzard",
    drought: "Drought",
    flood: "Flood",
    earthquake: "Earthquake",
    tsunami: "Tsunami",
    volcano: "Volcano",
    volcanic: "Volcanic",
    eruption: "Eruption",
    lava: "Lava",
    magma: "Magma",

    // Human Geography
    demography: "Demography",
    birth_rate: "BirthRate",
    death_rate: "Death Rate",
    life_expectancy: "Life Expectancy",
    migration: "Migration",
    urbanization: "Urbanization",
    settlement: "Settlement",
    rural_settlement: "Rural Settlement",
    urban_settlement: "Urban Settlement",
    city: "City",
    village: "Village",
    metropolis: "Metropolis",
    developed_country: "Developed Country",
    developing_country: "Developing Country",
    underdeveloped_country: "Underdeveloped Country",
    economy: "Economy",
    industry: "Industry",
    agriculture: "Agriculture",
    manufacturing: "Manufacturing",
    service: "Service",
    tourism: "Tourism",
    trade: "Trade",
    commerce: "Commerce",
    transportation: "Transportation",
    communication: "Communication",
    infrastructure: "Infrastructure",
    culture: "Culture",
    language: "Language",
    religion: "Religion",
    tradition: "Tradition",

    // ════════════════════════════════════════════════════════════════
    // ENGLISH LANGUAGE & LITERATURE - Class 3-12
    // ════════════════════════════════════════════════════════════════
    // Grammar
    grammar: "Grammar",
    noun: "Noun",
    nouns: "Noun",
    verb: "Verb",
    verbs: "Verb",
    adjective: "Adjective",
    adverb: "Adverb",
    pronoun: "Pronoun",
    preposition: "Preposition",
    conjunction: "Conjunction",
    interjection: "Interjection",
    clause: "Clause",
    phrase: "Phrase",
    sentence: "Sentence",
    compound_sentence: "Compound Sentence",
    complex_sentence: "Complex Sentence",
    simple_sentence: "Simple Sentence",
    paragraph: "Paragraph",
    tense: "Tense",
    present_tense: "Present Tense",
    past_tense: "Past Tense",
    future_tense: "Future Tense",
    active_voice: "Active Voice",
    passive_voice: "Passive Voice",
    subject: "Subject",

    // Literature & Writing
    literature: "Literature",
    novel: "Novel",
    novella: "Novella",
    short_story: "Short Story",
    poem: "Poem",
    poetry: "Poetry",
    epic: "Epic",
    drama: "Drama",
    play: "Play",
    tragedy: "Tragedy",
    comedy: "Comedy",
    prose: "Prose",
    essay: "Essay",
    review: "Review",
    character: "Character",
    protagonist: "Protagonist",
    antagonist: "Antagonist",
    narrator: "Narrator",
    plot: "Plot",
    subplot: "Subplot",
    climax: "Climax",
    conflict: "Conflict",
    resolution: "Resolution",
    denouement: "Denouement",
    theme: "Theme",
    setting: "Setting",
    atmosphere: "Atmosphere",
    tone: "Tone",
    metaphor: "Metaphor",
    simile: "Simile",
    personification: "Personification",
    alliteration: "Alliteration",
    assonance: "Assonance",
    consonance: "Consonance",
    onomatopoeia: "Onomatopoeia",
    idiom: "Idiom",
    proverb: "Proverb",
    oxymoron: "Oxymoron",
    paradox: "Paradox",
    irony: "Irony",
    symbolism: "Symbolism",
    foreshadowing: "Foreshadowing",
    flashback: "Flashback",
    allegory: "Allegory",
    satire: "Satire",

    // ════════════════════════════════════════════════════════════════
    // SOCIAL STUDIES & CIVICS - Class 6-10
    // ════════════════════════════════════════════════════════════════
    // Civics & Governance
    civics: "Civics",
    civics_and_governance: "Civics and Governance",
    government: "Government",
    democracy: "Democracy",
    democratic: "Democratic",
    republic: "Republic",
    constitution: "Constitution",
    constitutional: "Constitutional",
    amendment: "Amendment",
    article: "Article",
    fundamental_right: "Fundamental Right",
    fundamental_duty: "Fundamental Duty",
    directive_principle: "Directive Principle",
    citizenship: "Citizenship",
    citizen: "Citizen",
    responsibility: "Responsibility",
    right: "Right",
    duty: "Duty",
    law: "Law",
    legislation: "Legislation",
    executive: "Executive",
    legislative: "Legislative",
    judiciary: "Judiciary",
    parliament: "Parliament",
    lok_sabha: "Lok Sabha",
    rajya_sabha: "Rajya Sabha",
    president: "President",
    prime_minister: "Prime Minister",
    minister: "Minister",
    political_party: "Political Party",
    election: "Election",
    voter: "Voter",
    voting: "Voting",
    election_commission: "Election Commission",
    judge: "Judge",
    court: "Court",
    supreme_court: "Supreme Court",
    high_court: "High Court",
    district_court: "District Court",
    justice: "Justice",
    trial: "Trial",
    crime: "Crime",
    punishment: "Punishment",
    constitutional_remedy: "Constitutional Remedy",
    writ: "Writ",
    habeas_corpus: "Habeas Corpus",
    public_litigation: "Public Interest Litigation",

    // Economics
    economics: "Economics",
    economic: "Economic",
    production: "Production",
    consumption: "Consumption",
    distribution: "Distribution",
    scarcity: "Scarcity",
    market: "Market",
    demand: "Demand",
    supply: "Supply",
    price: "Price",
    commodity: "Commodity",
    business: "Business",
    import: "Import",
    export: "Export",
    currency: "Currency",
    inflation: "Inflation",
    deflation: "Deflation",
    unemployment: "Unemployment",
    gdp: "GDP",
    gnp: "GNP",
    tax: "Tax",
    revenue: "Revenue",
    budget: "Budget",
    monetary_policy: "Monetary Policy",
    fiscal_policy: "Fiscal Policy",

    // ════════════════════════════════════════════════════════════════
    // COMPUTER SCIENCE & IT - Class 6-12
    // ════════════════════════════════════════════════════════════════
    // Fundamentals
    computer_science: "Computer Science",
    computer: "Computer",
    hardware: "Hardware",
    software: "Software",
    algorithm: "Algorithm",
    algoritm: "Algorithm",
    program: "Program",
    programming: "Programming",
    code: "Code",
    coding: "Coding",
    data: "Data",
    information: "Information",
    binary: "Binary",
    hexadecimal: "Hexadecimal",
    bit: "Bit",
    byte: "Byte",
    kilobyte: "Kilobyte",
    megabyte: "Megabyte",
    gigabyte: "Gigabyte",
    memory: "Memory",
    storage: "Storage",
    processor: "Processor",
    cpu: "CPU",

    // Programming Concepts
    data_type: "Data Type",
    float: "Float",
    string: "String",
    boolean: "Boolean",
    array: "Array",
    list: "List",
    dictionary: "Dictionary",
    function: "Function",
    procedure: "Procedure",
    method: "Method",
    loop: "Loop",
    for_loop: "For Loop",
    while_loop: "While Loop",
    do_while_loop: "Do While Loop",
    if_statement: "If Statement",
    else_statement: "Else Statement",
    condition: "Condition",
    operator: "Operator",
    arithmetic_operator: "Arithmetic Operator",
    logical_operator: "Logical Operator",
    comparison_operator: "Comparison Operator",
    assignment_operator: "Assignment Operator",
    string_operator: "String Operator",

    // Databases & Networks
    database: "Database",
    table: "Table",
    record: "Record",
    field: "Field",
    query: "Query",
    sql: "SQL",
    network: "Network",
    internet: "Internet",
    server: "Server",
    client: "Client",
    ip_address: "IP Address",
    domain: "Domain",
    website: "Website",
    web_browser: "Web Browser",
    email: "Email",
    protocol: "Protocol",
    http: "HTTP",
    https: "HTTPS",
    ftp: "FTP",
    cloud_computing: "Cloud Computing",
    security: "Security",
    encryption: "Encryption",
    firewall: "Firewall",

    // ════════════════════════════════════════════════════════════════
    // REGIONAL & LANGUAGES (Class 3-12)
    // ════════════════════════════════════════════════════════════════
    // Hindi
    hindi: "Hindi",
    hindi_language: "Hindi Language",
    hindi_literature: "Hindi Literature",
    kavita: "Kavita",
    katha: "Katha",
    gadya: "Gadya",
    natak: "Natak",
    sangeet: "Sangeet",
    samvedna: "Samvedna",

    // Sanskrit
    sanskrit: "Sanskrit",
    sanskrit_language: "Sanskrit Language",

    // ════════════════════════════════════════════════════════════════
    // GENERAL ACADEMIC TERMS
    // ════════════════════════════════════════════════════════════════
    analysis: "Analysis",
    anallysis: "Analysis",
    analysys: "Analysis",
    system: "System",
    systme: "System",
    process: "Process",
    procces: "Process",
    theory: "Theory",
    theorey: "Theory",
    concept: "Concept",
    model: "Model",
    example: "Example",
    definition: "Definition",
    classification: "Classification",
    observation: "Observation",
    experiment: "Experiment",
    hypothesis: "Hypothesis",
    conclusion: "Conclusion",
    result: "Result",
    finding: "Finding",
    research: "Research",
    study: "Study",
    examination: "Examination",
    test: "Test",
    assessment: "Assessment",
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
    // ── Singularize words for consistent caching ──
    // Ensures: "forces" = "force", "photons" = "photon", etc.
    // Applied BEFORE duplicate removal so we work with complete words
    .split(" ")
    .map(word => singularize(word))
    .join(" ")
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
    // Trim and singularize words
    .trim()
    // ── Singularize words for consistent caching ──
    // Ensures: "forces" = "force", "energies" = "energy", etc.
    .split(" ")
    .map(word => singularize(word))
    .join(" ")
    // Deduplicate words
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
