/**
 * EAV Kivumu Smart School - Bioscience & Bioinformatics Types & Helpers
 * Supports Veterinary (VET) and Agriculture (AGR) scientific curricula
 */

export interface ProteinData {
  uniprotId: string;
  name: string;
  organism: string;
  category: 'Veterinary Livestock' | 'Crop Science' | 'Pathology' | 'Metabolic';
  sequence: string;
  length: number;
  alphafoldAvailable: boolean;
  plddtConfidence: number;
  confidenceBand: 'Very High (>90)' | 'Confident (70-90)' | 'Low (50-70)' | 'Very Low (<50)';
  functionSummary: string;
  pdbId?: string;
}

export interface ChemicalCompound {
  cid: number;
  name: string;
  formula: string;
  molecularWeight: number;
  iupacName: string;
  smiles: string;
  application: 'Veterinary Medicine' | 'Crop Fertilizer' | 'Phytosanitary' | 'Animal Nutrition';
  description: string;
  safetyClass: 'Caution' | 'Safe' | 'Hazardous' | 'Regulated';
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  abstractText: string;
  doi?: string;
  source: 'Europe PMC' | 'PubMed' | 'FAO Agriis';
}

/**
 * Calculates DNA / RNA sequence GC content and statistics
 */
export function analyzeSequence(sequence: string): {
  length: number;
  gcContent: number;
  baseCounts: Record<string, number>;
  isValidDna: boolean;
  isValidProtein: boolean;
  estimatedWeightDa: number;
} {
  const clean = sequence.toUpperCase().replace(/\s/g, '');
  const counts: Record<string, number> = {};
  for (const char of clean) {
    counts[char] = (counts[char] || 0) + 1;
  }

  const g = counts['G'] || 0;
  const c = counts['C'] || 0;
  const a = counts['A'] || 0;
  const t = counts['T'] || 0;
  const totalBases = clean.length;

  const isValidDna = totalBases > 0 && /^[ACGTN]+$/.test(clean);
  const isValidProtein = totalBases > 0 && /^[ACDEFGHIKLMNPQRSTVWY]+$/.test(clean);

  const gcContent = totalBases > 0 ? Number((((g + c) / totalBases) * 100).toFixed(2)) : 0;
  const estimatedWeightDa = isValidDna ? totalBases * 330 : totalBases * 110;

  return {
    length: totalBases,
    gcContent,
    baseCounts: counts,
    isValidDna,
    isValidProtein,
    estimatedWeightDa,
  };
}

/**
 * Curated Bioscience Datasets relevant to Rwandan agriculture & veterinary sciences
 */
export const PRELOADED_PROTEINS: ProteinData[] = [
  {
    uniprotId: 'P00875',
    name: 'RuBisCO Large Subunit (Ribulose-1,5-bisphosphate carboxylase/oxygenase)',
    organism: 'Zea mays (Maize / African Corn)',
    category: 'Crop Science',
    length: 475,
    sequence: 'MSPQTETKASVGFKAGVKEYKLTYYTPEYETKDTDILAAFRVTPQPGVPPEEAGAAVAAESSTGTWTTVWTDGLTSLDRYKGRCYHIEPVAGEENQYICYVAYPLDLFEEGSVTNMFTSIFGNVFGFKALRALRLEDLRIPPAYTKTFQGPPHGIQVERDKLNKYGRPLLGCTIKPKLGLSAKNYGRAVYECLRGGLDFTKDDENVNSQPFMRWRDRFLFCAEAIYKSQAETGEIKGHYLNATAGTCEEMIKRAVFARELGVPIVMHDYLTGGFTANTSLAHYCRDNGLLLHIHRAMHAVIDRQKNHGMHFRVLAKALRMSGGDHIHSGTVVGKLEGERDITLGFVDLLRDDFIEKDRSRGIYFTQDWVSLPGVLPVASGGIHVWHMPALTEIFGDDSVLQFGGGTLGHPWGNAPGAVANRVALEACVQARNEGRDLAREGNEIIREAAKWSPELAAACEVWKEIKFEFPAMDTL',
    alphafoldAvailable: true,
    plddtConfidence: 94.2,
    confidenceBand: 'Very High (>90)',
    functionSummary: 'Key photosynthetic enzyme in crops catalyzing carbon dioxide fixation in plant chloroplasts, critical for crop yield optimization in Western Province agriculture.',
    pdbId: '1RBO',
  },
  {
    uniprotId: 'P01247',
    name: 'Bovine Somatotropin (Growth Hormone)',
    organism: 'Bos taurus (Bovine / Dairy Cattle)',
    category: 'Veterinary Livestock',
    length: 191,
    sequence: 'AFPAMSLSGLFANAVLRAQHLHQLAADTFKEFERTYIPEGQRYSIQNTQVAFCFSETIPAPTGKNEAQQKSDLELLRISLLLIQSWLGPLQFLSRVFTNSLVFGTSDRVYEKLKDLEEGILALMRELEDGTPRAGQILKQTYDKFDTNMRSDDALLKNYGLLSCFRKDLHKTETYLRVMKCRRFGEASCAF',
    alphafoldAvailable: true,
    plddtConfidence: 91.8,
    confidenceBand: 'Very High (>90)',
    functionSummary: 'Pituitary peptide hormone regulating lactation and tissue growth in dairy cattle herds across Kivumu and Gishwati grazing regions.',
    pdbId: '1HGU',
  },
  {
    uniprotId: 'P01030',
    name: 'Bovine Myostatin (Growth Differentiation Factor 8)',
    organism: 'Bos taurus (Bovine)',
    category: 'Veterinary Livestock',
    length: 375,
    sequence: 'MQKLQLCVYIYLFMLIVAGPVDLNENSEQKENVEKEGLCNACTWRQNTKSSRIEAIKIQILSKLRLETAPNISKDVIRQLLPKAPPLRELIDQYDVQRDDSSDGSLEDDDYHATTETIITMPTESDFLMQVDGKPKCCFFKFSSKIQYNKVVKAQLWIYLRPVETPTTVFVQILRLIKPMKDGTRYTGIRSLKLDMNPGTGIWQSIDVKTVLQNWLKQPESNLGIEIKALDENGHDLAVTFPGPGEDGLNPFLEVKVTDTPKRSRRDFGLDCDEHSTESRCCRYPLTVDFEAFGWDWIIAPKRYKANYCSGECEFVFLQKYPHTHLVHQANPRGSAGPCCTPTKMSPINMLYFNGKEQIIYGKIPAMVVDRCGCS',
    alphafoldAvailable: true,
    plddtConfidence: 86.4,
    confidenceBand: 'Confident (70-90)',
    functionSummary: 'Negative regulator of skeletal muscle mass. Key genetic marker in Rwandan livestock breeding for muscular hypertrophy and meat yield.',
    pdbId: '3HZM',
  },
];

export const PRELOADED_COMPOUNDS: ChemicalCompound[] = [
  {
    cid: 54675779,
    name: 'Oxytetracycline',
    formula: 'C22H24N2O9',
    molecularWeight: 460.43,
    iupacName: '(4S,4aR,5S,5aR,6S,12aR)-4-(dimethylamino)-1,5,6,10,11,12a-hexahydroxy-6-methyl-3,12-dioxo-4,4a,5,5a-tetrahydrotetracene-2-carboxamide',
    smiles: 'CC1(C2=C(C(=O)C3=C(C2=O)C(=C(C(=O)C3(C(=O)N)O)N(C)C)O)C(=C1O)O)C',
    application: 'Veterinary Medicine',
    description: 'Broad-spectrum antibiotic used in EAV Kivumu veterinary clinic to treat anaplasmosis, respiratory pneumonia, and foot rot in cattle and small ruminants.',
    safetyClass: 'Regulated',
  },
  {
    cid: 6321424,
    name: 'Ivermectin',
    formula: 'C48H74O14',
    molecularWeight: 875.1,
    iupacName: '5-O-demethyl-22,23-dihydroavermectin A1a',
    smiles: 'CCC(C)C1CC(CC2(O1)CC3CC(O2)CC=C(C(C(C=CC=C4COC5C4(C(CC(O5)C(=O)O3)O)O)C)OC6CC(C(C(O6)C)OC7CC(C(C(O7)C)O)OC)OC)C)C',
    application: 'Veterinary Medicine',
    description: 'Gold-standard anti-parasitic agent for gastrointestinal roundworms, lungworms, cattle grubs, sucking lice, and mange mites in livestock.',
    safetyClass: 'Regulated',
  },
  {
    cid: 23665764,
    name: 'Potassium Nitrate (KNO3)',
    formula: 'KNO3',
    molecularWeight: 101.103,
    iupacName: 'potassium nitrate',
    smiles: '[K+].[O-][N+](=O)[O-]',
    application: 'Crop Fertilizer',
    description: 'Water-soluble nitrogen and potassium fertilizer used in EAV Kivumu greenhouse fertigation and drip irrigation systems for horticulture.',
    safetyClass: 'Safe',
  },
];
