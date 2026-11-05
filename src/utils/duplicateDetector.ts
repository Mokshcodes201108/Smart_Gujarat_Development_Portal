import { Project, DuplicateMatch } from '../types';

/**
 * Calculates Haversine distance between two coordinates in kilometers
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'under', 'near', 'from', 'phase', 'work', 'project', 'construction', 'scheme',
  'development', 'department', 'panchayat', 'taluka', 'district', 'village', 'gujarat',
  'installation', 'provision', 'upgradation', 'yojana', 'shri', 'gram'
]);

const INFRA_KEYWORDS: { [key: string]: string[] } = {
  road: ['road', 'rasta', 'asphalt', 'cc road', 'concrete', 'paver', 'paving', 'tar', 'lane', 'street', 'highway', 'bypass'],
  water: ['water', 'drinking', 'ro plant', 'pipeline', 'storage tank', 'overhead tank', 'borewell', 'sump', 'tap'],
  drainage: ['drainage', 'gutter', 'sewer', 'sewerage', 'storm water', 'effluent', 'nullah', 'manhole'],
  light: ['street light', 'light', 'lamp', 'solar', 'led', 'illumination', 'high mast', 'pole'],
  building: ['building', 'hall', 'samaj', 'kalyan', 'anganwadi', 'school', 'classroom', 'panchayat ghar', 'centre', 'center', 'room'],
  health: ['phc', 'chc', 'health', 'sub centre', 'dispensary', 'clinic', 'hospital']
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOP_WORDS.has(token));
}

function calculateJaccardSimilarity(tokens1: string[], tokens2: string[]): number {
  if (tokens1.length === 0 || tokens2.length === 0) return 0;
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);
  
  let intersectionCount = 0;
  set1.forEach(item => {
    if (set2.has(item)) intersectionCount++;
  });
  
  const unionCount = new Set([...tokens1, ...tokens2]).size;
  return unionCount === 0 ? 0 : (intersectionCount / unionCount) * 100;
}

function extractInfraCategories(text: string): string[] {
  const lower = text.toLowerCase();
  const matched: string[] = [];
  for (const [category, keywords] of Object.entries(INFRA_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      matched.push(category);
    }
  }
  return matched;
}

/**
 * Compare a candidate project against a single existing project
 */
export function compareProjects(candidate: Partial<Project>, existing: Project): DuplicateMatch {
  const matchingFactors: string[] = [];
  
  // 1. Location match
  let locationScore = 0;
  const sameTaluka = candidate.taluka && existing.taluka && candidate.taluka.toLowerCase().trim() === existing.taluka.toLowerCase().trim();
  const sameVillage = candidate.village && existing.village && candidate.village.toLowerCase().trim() === existing.village.toLowerCase().trim();
  
  let distanceKm = 999;
  if (candidate.latitude && candidate.longitude && existing.latitude && existing.longitude) {
    distanceKm = calculateDistanceKm(candidate.latitude, candidate.longitude, existing.latitude, existing.longitude);
  }

  if (sameVillage) {
    locationScore += 50;
    matchingFactors.push(`Identical Village: ${existing.village}`);
  } else if (sameTaluka) {
    locationScore += 20;
    matchingFactors.push(`Same Taluka: ${existing.taluka}`);
  }

  if (distanceKm < 0.4) {
    locationScore += 50;
    matchingFactors.push(`Immediate Vicinity: ~${Math.round(distanceKm * 1000)} meters apart`);
  } else if (distanceKm < 1.5) {
    locationScore += 35;
    matchingFactors.push(`Very Close Proximity: ${distanceKm} km`);
  } else if (distanceKm < 4.0) {
    locationScore += 20;
    matchingFactors.push(`Nearby Zone: ${distanceKm} km`);
  }
  locationScore = Math.min(100, locationScore);

  // 2. Category match
  let categoryScore = 0;
  if (candidate.category && candidate.category === existing.category) {
    categoryScore = 100;
    matchingFactors.push(`Identical Project Category: ${existing.category}`);
  } else {
    // Check related categories
    const candInfra = extractInfraCategories(`${candidate.projectName || ''} ${candidate.description || ''}`);
    const existInfra = extractInfraCategories(`${existing.projectName} ${existing.description}`);
    const overlap = candInfra.filter(i => existInfra.includes(i));
    if (overlap.length > 0) {
      categoryScore = 75;
      matchingFactors.push(`Overlapping Infrastructure Domain: ${overlap.join(', ')}`);
    }
  }

  // 3. Textual Title Similarity
  const candTitleTokens = tokenize(candidate.projectName || '');
  const existTitleTokens = tokenize(existing.projectName);
  const titleScore = calculateJaccardSimilarity(candTitleTokens, existTitleTokens);
  if (titleScore > 35) {
    matchingFactors.push(`Strong Name Pattern Overlap (${Math.round(titleScore)}% similarity)`);
  }

  // 4. Description Scope Similarity
  const candDescTokens = tokenize(candidate.description || '');
  const existDescTokens = tokenize(existing.description);
  const scopeScore = calculateJaccardSimilarity(candDescTokens, existDescTokens);
  if (scopeScore > 30) {
    matchingFactors.push(`Scope Specification Match (${Math.round(scopeScore)}%)`);
  }

  // 5. Keyword Infrastructure Overlap
  const candInfraTypes = extractInfraCategories(`${candidate.projectName} ${candidate.description}`);
  const existInfraTypes = extractInfraCategories(`${existing.projectName} ${existing.description}`);
  const commonInfra = candInfraTypes.filter(t => existInfraTypes.includes(t));
  let infraBonus = 0;
  if (commonInfra.length > 0) {
    infraBonus = 15;
    matchingFactors.push(`Identical Asset Type: [${commonInfra.join(', ').toUpperCase()}]`);
  }

  // Weighted composite score calculation
  // Location is crucial for civil works (40%), Category/Scope (25%), Title Text (25%), Keyword (10%)
  let weightedScore = (locationScore * 0.40) + (categoryScore * 0.25) + (titleScore * 0.25) + (scopeScore * 0.10);

  // If same village and same infra type, boost significantly
  if (sameVillage && commonInfra.length > 0) {
    weightedScore = Math.max(weightedScore, (locationScore * 0.45) + (categoryScore * 0.35) + (titleScore * 0.20) + 10);
  }

  // Cap at 100
  const overallScore = Math.min(99, Math.max(0, Math.round(weightedScore)));

  // Risk Classification
  let riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  let recommendedAction = 'Proceed with proposal submission. No critical duplication detected.';

  if (overallScore >= 70) {
    riskLevel = 'HIGH';
    recommendedAction = `CRITICAL DUPLICATION RISK: ${existing.department} has an existing project ("${existing.projectName}", Status: ${existing.status}). Mandatory interdepartmental coordination required before budget sanction to prevent financial waste.`;
  } else if (overallScore >= 40) {
    riskLevel = 'MEDIUM';
    recommendedAction = `POTENTIAL OVERLAP: Nearby work detected in ${existing.village} under ${existing.department}. Require joint inspection with District Planning Officer before issuing technical sanction.`;
  }

  const potentialSavings = Math.min(
    candidate.estimatedBudget || candidate.sanctionedBudget || 0,
    existing.sanctionedBudget || existing.estimatedBudget || 0
  );

  return {
    existingProject: existing,
    candidateProject: candidate,
    overallScore,
    titleScore: Math.round(titleScore),
    locationScore: Math.round(locationScore),
    categoryScore: Math.round(categoryScore),
    scopeScore: Math.round(scopeScore),
    distanceKm,
    riskLevel,
    matchingFactors,
    recommendedAction,
    potentialSavings
  };
}

/**
 * Scan a candidate project against a list of existing projects and return sorted matches
 */
export function findDuplicates(candidate: Partial<Project>, existingProjects: Project[]): DuplicateMatch[] {
  return existingProjects
    .filter(p => p.id !== candidate.id)
    .map(existing => compareProjects(candidate, existing))
    .filter(match => match.overallScore >= 35) // Only keep meaningful matches
    .sort((a, b) => b.overallScore - a.overallScore);
}

/**
 * Global scanner: Find all duplicate clusters across all projects in the database
 */
export function scanAllDuplicates(projects: Project[]): {
  highRiskCount: number;
  mediumRiskCount: number;
  totalPotentialSavings: number;
  duplicatePairs: {
    projectA: Project;
    projectB: Project;
    match: DuplicateMatch;
  }[];
} {
  const pairs: { projectA: Project; projectB: Project; match: DuplicateMatch }[] = [];
  const processedPairs = new Set<string>();
  let totalSavings = 0;

  for (let i = 0; i < projects.length; i++) {
    for (let j = i + 1; j < projects.length; j++) {
      const p1 = projects[i];
      const p2 = projects[j];
      const pairKey = [p1.id, p2.id].sort().join('___');

      if (processedPairs.has(pairKey)) continue;
      processedPairs.add(pairKey);

      const match = compareProjects(p1, p2);
      if (match.overallScore >= 50) {
        pairs.push({
          projectA: p1,
          projectB: p2,
          match
        });
        totalSavings += match.potentialSavings;
      }
    }
  }

  // Sort by highest similarity
  pairs.sort((a, b) => b.match.overallScore - a.match.overallScore);

  return {
    highRiskCount: pairs.filter(p => p.match.riskLevel === 'HIGH').length,
    mediumRiskCount: pairs.filter(p => p.match.riskLevel === 'MEDIUM').length,
    totalPotentialSavings: totalSavings,
    duplicatePairs: pairs
  };
}
