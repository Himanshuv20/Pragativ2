export interface Location {
  latitude: number;
  longitude: number;
}

export interface SatelliteData {
  vegetationIndex: {
    ndvi: number;
    evi: number;
    lastCalculated: string;
  };
  soilMoisture: {
    percentage: number;
    status: string;
    depth: string;
  };
  temperature: {
    current: number;
    min: number;
    max: number;
    unit: string;
  };
  precipitation: {
    last7Days: number;
    last30Days: number;
    unit: string;
  };
  humidity: number;
  windSpeed: number;
  cloudCover: number;
  sunlightHours: number;
  lastUpdated: string;
  location: Location;
  dataSource: string;
  confidence: number;
}

export interface CropInfo {
  name: string;
  scientificName: string;
  category: string;
  description: string;
  growingPeriod: number;
}

export interface PlantingWindow {
  season: string;
  earliestStart: string;
  latestEnd: string;
  optimalStart: string;
  optimalEnd: string;
  adjustments: number;
  riskFactors: string[];
  recommendations: string[];
  daysFromNow: number;
}

export interface GrowthStage {
  stage: string;
  description: string;
  startDate: string;
  endDate: string;
  duration: number;
  keyActivities: string[];
  careInstructions: string[];
  expectedSigns: string[];
}

export interface FertilizationSchedule {
  date: string;
  type: string;
  nutrient: string;
  amountPerUnit: number;
  totalAmount: number;
  unit: string;
  method: string;
  instructions: string;
  stage: string;
}

export interface IrrigationSchedule {
  date: string;
  amount: number;
  unit: string;
  method: string;
  duration: number;
  timing: string;
  stage: string;
}

export interface MaintenanceSchedule {
  fertilization: FertilizationSchedule[];
  irrigation: IrrigationSchedule[];
  totalFertilizerCost: number;
  totalWaterNeeded: number;
}

export interface ExpectedYield {
  amount: number;
  unit: string;
  confidence: number;
}

export interface HarvestingWindow {
  earliestDate: string;
  latestDate: string;
  optimalDate: string;
  estimatedYield: ExpectedYield;
  harvestingMethod: string;
  postHarvestCare: string;
  storageInstructions: string;
  marketReadiness: string;
}

export interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  actions: string[];
}

export interface AssessmentResult {
  status: string;
  score: number;
  description: string;
  issues?: string[];
}

export interface SatelliteDataSummary {
  vegetationHealth: AssessmentResult;
  soilCondition: AssessmentResult;
  weatherSuitability: AssessmentResult;
  overallReadiness: AssessmentResult;
}

export interface CropCalendar {
  cropType: string;
  cropInfo: CropInfo;
  plantingWindow: PlantingWindow;
  growthStages: GrowthStage[];
  maintenanceSchedule: MaintenanceSchedule;
  harvestingWindow: HarvestingWindow;
  recommendations: Recommendation[];
  satelliteDataSummary: SatelliteDataSummary;
  generatedAt: string;
  location: Location;
  area: number;
}

export interface CropCalendarRequest {
  location: Location;
  area: number;
  cropType: string;
}

export interface CropCalendarResponse {
  success: boolean;
  data?: {
    cropCalendar: CropCalendar;
    satelliteData: SatelliteData;
    metadata: {
      generatedAt: string;
      location: Location;
      area: number;
      cropType: string;
    };
  };
  error?: string;
  message?: string;
}

export interface SupportedCrop {
  name: string;
  scientificName: string;
  category: string;
  description: string;
  growingPeriod: number;
  difficulty: string;
  emoji?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  details?: any[];
}

// SOS Emergency Types
export interface SOSEmergencyRequest {
  location: Location;
  emergencyType: 'pest_disease' | 'weather_damage' | 'equipment_failure' | 'soil_issues' | 'irrigation_problems' | 'livestock_emergency' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  contactInfo: {
    phone?: string;
    email?: string;
    name?: string;
  };
  cropType?: string;
  farmSize?: number;
  images?: string[];
}

export interface SOSResponse {
  emergencyId: string;
  ticketNumber: string;
  status: 'submitted' | 'acknowledged' | 'in_progress' | 'resolved';
  estimatedResponseTime: string;
  immediateActions: string[];
  emergencyContacts: EmergencyContact[];
  submittedAt: string;
}

export interface EmergencyContact {
  type: string;
  phone: string;
  available: string;
}

export interface EmergencyRecommendations {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
  prevention: string[];
  estimatedCosts: {
    estimated: number;
    range: string;
    currency: string;
  };
  timeframe: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface EmergencyResource {
  name: string;
  phone: string;
  distance: number;
  address: string;
  rating: number;
  available: boolean;
  estimatedArrival: string;
  coordinates: Location;
}

export interface EmergencyResourcesResponse {
  resources: EmergencyResource[];
  totalFound: number;
  searchRadius: number;
  searchLocation: Location;
}

export interface EmergencyStatus {
  id: string;
  status: string;
  submittedAt: string;
  updatedAt: string;
  statusHistory: EmergencyStatusUpdate[];
  currentStatus: EmergencyStatusUpdate;
}

export interface EmergencyStatusUpdate {
  status: string;
  timestamp: string;
  message: string;
}

// Sustainable Practices Types
export interface SustainablePractice {
  id: string;
  name: string;
  category: string;
  description: string;
  benefits: string[];
  implementation: {
    steps: string[];
    estimatedCost: {
      min: number;
      max: number;
      unit: string;
    };
    timeframe: string;
    difficulty: 'easy' | 'medium' | 'high';
  };
  suitability: {
    landSize: {
      min: number;
      max: number;
      unit: string;
    };
    climateZones: string[];
    soilTypes: string[];
    crops: string[];
  };
  environmentalImpact: {
    waterSavings: string;
    energySavings: string;
    carbonReduction: string;
    biodiversityImpact: string;
  };
  score?: number;
  estimatedImplementationCost?: {
    min: number;
    max: number;
    unit: string;
    currency?: {
      code: string;
      symbol: string;
      name: string;
      conversionRate: number;
      locale?: string;
    };
  };
  // AI-specific fields
  aiGenerated?: boolean;
  aiInsights?: string[];
  mentionCount?: number;
  aiRecommended?: boolean;
  confidence?: number;
  source?: string;
}

export interface SustainablePracticesRequest {
  location: Location;
  landSize: number;
  cropTypes?: string[];
  practiceTypes?: string[];
  budget?: number;
  currentPractices?: string[];
}

export interface SustainablePracticesResponse {
  recommendations?: SustainablePractice[];
  totalCount?: number;
  aiGenerated?: boolean;
  rawResponse?: string;
  generatedAt?: string;
  currency?: {
    code: string;
    symbol: string;
    name: string;
    conversionRate: number;
    locale?: string;
  };
  farmContext?: {
    location: Location;
    landSize: number;
    currentPractices: string[];
    cropTypes: string[];
  };
  // Legacy format support
  location?: {
    climateZone: string;
    soilType: string;
    coordinates: Location;
  };
  farmCharacteristics?: {
    landSize: number;
    cropTypes: string[];
    estimatedBudget?: number;
  };
  recommendedPractices?: SustainablePractice[];
  totalPracticesAvailable?: number;
  filteredPracticesCount?: number;
  summary?: {
    potentialWaterSavings: string;
    potentialEnergySavings: string;
    carbonReductionPotential: string;
    biodiversityImpact: string;
  };
}

export interface PracticeCategory {
  name: string;
  practiceCount: number;
  practices: {
    id: string;
    name: string;
    category: string;
    difficulty: string;
  }[];
}

export interface PracticeImpactAssessment {
  combinedCost: {
    min: number;
    max: number;
    unit: string;
  };
  combinedWaterSavings: string;
  combinedEnergySavings: string;
  implementationTimeframe: string;
  overallDifficulty: string;
  synergies: string[];
  potentialConflicts: string[];
}

export interface SustainabilityAssessment {
  sustainabilityScore: number;
  topPriorities: SustainablePractice[];
  quickWins: SustainablePractice[];
  potentialImpact: {
    potentialWaterSavings: string;
    potentialEnergySavings: string;
    carbonReductionPotential: string;
    biodiversityImpact: string;
  };
  currentPracticesCount: number;
  recommendedPracticesCount: number;
  improvementAreas: {
    area: string;
    opportunityCount: number;
    priority: 'low' | 'medium' | 'high';
  }[];
}

// ==========================================
// DEBT COUNSELING MODULE TYPES
// ==========================================

export interface DebtData {
  totalDebt: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  farmSize: number;
  cropIncome: number;
  state: string;
  category: string;
  loans: Loan[];
}

export interface Loan {
  id?: string;
  type: string;
  bank: string;
  lender?: string;
  amount?: number;
  sanctionedAmount: number;
  outstandingAmount: number;
  emi: number;
  interestRate: number;
  tenure: number;
  startDate?: string;
  maturityDate?: string;
}

export interface DebtMetrics {
  totalDebt: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyDebtService: number;
  savingsCapacity: number;
  debtToIncomeRatio: number;
  debtServiceRatio: number;
  debtPerAcre: number;
  cropIncomeRatio: number;
  financialHealth: number;
  creditUtilization: number;
  liquidityRatio: number;
}

export interface RiskLevel {
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  color: string;
  backgroundColor?: string;
  description: string;
  urgency: string;
  actions: string[];
}

export interface DebtRecommendation {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  title: string;
  description: string;
  action: string;
  icon: string;
  timeframe: string;
  savings?: string;
}

export interface SchemeCategory {
  id: string;
  name: string;
  description?: string;
  count?: number;
}

export interface GovernmentScheme {
  name: string;
  description: string;
  eligibility: string;
  benefit: string;
  applicationUrl: string;
  status: 'eligible' | 'conditional' | 'not_eligible' | 'check_eligibility';
  documents?: string[];
  applicationSteps?: string[];
  features?: string[];
  conditions?: string[];
  coverage?: string[];
}

export interface FinancialPlan {
  shortTerm: PlanAction[];
  mediumTerm: PlanAction[];
  longTerm: PlanAction[];
  emergencyActions?: PlanAction[];
}

export interface PlanAction {
  action: string;
  description: string;
  target: string;
  timeframe: string;
  steps?: string[];
  strategy?: string;
  options?: string[];
  components?: string[];
  strategies?: string[];
  milestones?: string[];
  priority?: string;
}

export interface InterestRates {
  rbi?: {
    repoRate: number;
    reverseRepoRate: number;
    msfRate?: number;
    bankRate?: number;
    cRR?: number;
    sLR?: number;
    source: string;
    date: string;
  };
  worldBank?: {
    realInterestRate: number;
    country: string;
    year: string;
    source: string;
  };
  agricultural: {
    kccLoans: {
      upTo3Lakh: number;
      above3Lakh: number;
    };
    cropLoans: {
      shortTerm: number;
      mediumTerm: number;
      longTerm: number;
    };
    bankWise: {
      [bankName: string]: {
        cropLoan: number;
        kcc: number;
      };
    };
    nbfc: {
      average: number;
      range: {
        min: number;
        max: number;
      };
    };
    source: string;
    lastUpdated: string;
  };
  lastUpdated: string;
}

export interface MarketIndicators {
  inflation: {
    current: number;
    previous?: number;
    trend: string;
    source: string;
  };
  agriculturalIndices: {
    farmGatePrice: { value: number; change: string; period: string };
    agriculturalGDP: { value: number; change: string; period: string };
    ruralWageIndex: { value: number; change: string; period: string };
    fertiliserIndex: { value: number; change: string; period: string };
    source: string;
  };
  commodityPrices: {
    [commodity: string]: { price: number; change: string; trend: string };
  } & {
    overall: { change: string; trend: string };
    source: string;
  };
  weatherIndex: {
    monsoonIndex: { value: number; status: string; prediction: string };
    droughtRisk: { level: string; probability: number };
    floodRisk: { level: string; probability: number };
    overallRisk: string;
    source: string;
  };
}

export interface CounselingResource {
  type: string;
  name: string;
  address: string;
  contact: string;
  services: string[];
  timings: string;
  distance?: string;
  rating?: number;
  facilities?: string[];
  specialties?: string[];
  programs?: string[];
  benefits?: string[];
  language?: string;
}

export interface BudgetTemplate {
  monthlyIncome: {
    farming: { amount: number; percentage: number; sources: string[] };
    nonFarming: { amount: number; percentage: number; sources: string[] };
    government: { amount: number; percentage: number; sources: string[] };
    total: number;
  };
  mandatoryExpenses: {
    debtService: { amount: number; percentage: number; recommendation: string };
    household: { amount: number; percentage: number; includes: string[] };
    farming: { amount: number; percentage: number; includes: string[] };
  };
  recommendedSavings: {
    emergency: { target: number; monthlyContribution: number; timeToTarget: number };
    investment: { amount: number; percentage: number; options: string[] };
  };
  debtStrategy: {
    currentUtilization: number;
    healthyRange: string;
    recommendation: string;
    priorityOrder: DebtPriority[];
  };
  farmSpecificBudget: {
    costPerAcre: number;
    seasonalReserve: number;
    equipmentFund: number;
    marketingExpenses: number;
  };
  cashFlowProjection: CashFlowProjection[];
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

export interface DebtPriority {
  rank: number;
  lender: string;
  amount: number;
  interestRate: number;
  emi: number;
  strategy: string;
}

export interface CashFlowProjection {
  month: number;
  monthName: string;
  income: number;
  expenses: number;
  debtService: number;
  netCashFlow: number;
  cumulativeSavings: number;
  seasonalNote: string;
}

export interface NextStep {
  step: number;
  action: string;
  description: string;
  timeframe: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface HealthMonitoring {
  farmerId: string;
  currentScore: number;
  trend: string;
  monthlyHistory: { month: string; score: number }[];
  alerts: { type: string; message: string; date: string }[];
  nextReviewDate: string;
}

// Location data interface for debt counseling
export interface LocationData {
  latitude?: number;
  longitude?: number;
  district?: string;
  state?: string;
}

// Quick check data interface
export interface QuickCheckData {
  totalDebt: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

// API Response interfaces
export interface DebtAnalysisResponse {
  success: boolean;
  data: {
    analysis: DebtMetrics;
    recommendations: DebtRecommendation[];
    eligibleSchemes: GovernmentScheme[];
    financialPlan: FinancialPlan;
    riskLevel: RiskLevel;
    nextSteps: NextStep[];
    currentRates: InterestRates;
    marketIndicators: MarketIndicators;
    lastUpdated: string;
  };
  message: string;
  timestamp: string;
}

export interface CounselingResourcesResponse {
  success: boolean;
  data: {
    resources: CounselingResource[];
    emergencyHelplines: { name: string; number: string; available: string }[];
    onlineResources: { name: string; url: string }[];
    workshops: {
      title: string;
      schedule: string;
      venue: string;
      registration: string;
    }[];
  };
  message: string;
}

export interface BudgetTemplateResponse {
  success: boolean;
  data: BudgetTemplate;
  message: string;
}

export interface SchemeEligibilityResponse {
  success: boolean;
  data: GovernmentScheme[];
  message: string;
  eligibleCount: number;
  totalSchemes: number;
}

export interface InterestRatesResponse {
  success: boolean;
  data: InterestRates;
  message: string;
}

export interface MarketIndicatorsResponse {
  success: boolean;
  data: MarketIndicators;
  message: string;
}

export interface QuickCheckResponse {
  success: boolean;
  data: {
    financialHealth: number;
    debtToIncomeRatio: number;
    savingsCapacity: number;
    riskLevel: RiskLevel;
    recommendations: string[];
  };
  message: string;
}

export interface HealthMonitoringResponse {
  success: boolean;
  data: HealthMonitoring;
  message: string;
}

// Soil Analysis Types (following crop calendar tech stack patterns)
export interface VegetationIndices {
  ndvi: number;
  ndwi: number;
  savi: number;
  evi: number;
  gci: number;
  ndre: number;
}

export interface SoilParameters {
  organicMatter: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  moisture: number;
  temperature: number;
  salinity: number;
  erosionRisk: number;
  compactionLevel: number;
}

export interface SoilHealthScore {
  overall: number;
  fertility: number;
  structure: number;
  biology: number;
  chemistry: number;
}

export interface SoilRecommendation {
  category: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
  description: string;
  timeline: string;
  expectedImpact: string;
}

export interface SoilAnalysisResult {
  location: {
    latitude: number;
    longitude: number;
    name: string;
    country: string;
    region: string;
  };
  acquisitionDate: string;
  cloudCover: number;
  vegetationIndices: VegetationIndices;
  soilParameters: SoilParameters;
  soilHealthScore: SoilHealthScore;
  recommendations: SoilRecommendation[];
  confidence: number;
  dataSource: string;
  analysisTimestamp: string;
}

export interface SoilAnalysisRequest {
  latitude: number;
  longitude: number;
  date?: string;
}

export interface SoilAnalysisResponse {
  success: boolean;
  data: SoilAnalysisResult;
  message: string;
}
