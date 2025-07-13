export interface IDemoBarn {
  name: string;
  location: string;
  type: string;
  established: number;
  website: string;
  specialties: string[];
  ownerName: string;
  ownerTitle: string;
}

export interface IPartnership {
  startDate: string;
  trialPeriod: string;
  fullImplementation: string;
  currentStatus: string;
  renewalDate: string;
}

export interface IFacility {
  totalHorses: number;
  boardingClients: number;
  trainingClients: number;
  activeUsers: number;
  monthlyBoardingRate: number;
  premiumServiceUpcharge: number;
}

export interface IOneBarnAICosts {
  apiProcessing: number;
  platformOperations: number;
  salesAndMarketing: number;
  total: number;
}

export interface IMonthlyFinancials {
  totalRevenueGenerated: number;
  oneBarnAIShare: number;
  barnPartnerShare: number;
  oneBarnAICosts: IOneBarnAICosts;
  oneBarnAINetProfit: number;
  barnNetProfit: number;
  barnROIPercentage: number;
  clientSavingsVsIndividual: number;
}

export interface IAnnualFinancials {
  totalRevenueGenerated: number;
  oneBarnAIShare: number;
  barnPartnerShare: number;
  oneBarnAINetProfit: number;
  barnNetProfit: number;
  clientTotalSavings: number;
}

export interface IFinancials {
  monthly: IMonthlyFinancials;
  annual: IAnnualFinancials;
}

export interface IHealthIncidents {
  before: number;
  after: number;
  reductionPercentage: number;
  avgVetCostPrevented: number;
  monthlyCostSavings: number;
}

export interface ICustomerSatisfaction {
  npsScore: number;
  retentionRate: number;
  referralIncrease: number;
  waitingList: number;
}

export interface IOperationalEfficiency {
  staffTimeReduction: number;
  emergencyResponseTime: number;
  falseAlarms: number;
  insuranceDiscount: number;
}

export interface IMetrics {
  healthIncidents: IHealthIncidents;
  customerSatisfaction: ICustomerSatisfaction;
  operationalEfficiency: IOperationalEfficiency;
}

export interface ITestimonial {
  clientName: string;
  horseName: string;
  discipline: string;
  quote: string;
  incidentDate: string;
  vetCostSaved?: number;
  performanceImprovement?: string;
  credibility?: string;
}

export interface IRevenueGrowthPeriod {
  monthlyRevenue: number;
  profitMargin: number;
  netProfit: number;
  additionalProfit?: number;
}

export interface IYearOneProjection {
  additionalAnnualRevenue: number;
  clientRetentionValue: number;
  newClientPremium: number;
  totalAdditionalValue: number;
}

export interface IRevenueGrowth {
  prePartnership: IRevenueGrowthPeriod;
  postPartnership: IRevenueGrowthPeriod;
  yearOneProjection: IYearOneProjection;
}

export interface IImplementationPhase {
  title: string;
  duration: string;
  activities: string[];
  results: string[];
}

export interface IImplementation {
  phase1: IImplementationPhase;
  phase2: IImplementationPhase;
  phase3: IImplementationPhase;
}

export interface ICompetitiveAdvantage {
  title: string;
  description: string;
  impact: string;
}

export interface IPartnershipBenefits {
  forBarn: string[];
  forOneBarnAI: string[];
}

export interface IROICalculatorInputs {
  numberOfHorses: number;
  averageBoardingRate: number;
  aiServiceCharge: number;
  revenueSharePercentage: number;
}

export interface IROICalculatorOutputs {
  monthlyAIRevenue: number;
  annualAIRevenue: number;
  fiveYearAIRevenue: number;
  clientRetentionValue: number;
  totalFiveYearValue: number;
}

export interface IROICalculator {
  title: string;
  inputs: IROICalculatorInputs;
  outputs: IROICalculatorOutputs;
}

export interface INextStep {
  step: number;
  title: string;
  description: string;
  duration: string;
}

export interface INextSteps {
  title: string;
  subtitle: string;
  steps: INextStep[];
}

export interface IContact {
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  calendlyLink: string;
}

export interface IBarnPartnerDemoConfig {
  demoBarn: IDemoBarn;
  partnership: IPartnership;
  facility: IFacility;
  financials: IFinancials;
  metrics: IMetrics;
  testimonials: ITestimonial[];
  revenueGrowth: IRevenueGrowth;
  implementation: IImplementation;
  competitiveAdvantages: ICompetitiveAdvantage[];
  partnershipBenefits: IPartnershipBenefits;
  roiCalculator: IROICalculator;
  nextSteps: INextSteps;
  contact: IContact;
}

export interface IBarnPartnerDemoPageProps {
  config?: IBarnPartnerDemoConfig;
} 