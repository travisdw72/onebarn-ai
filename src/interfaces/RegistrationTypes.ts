export interface IRegistrationFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Owner Information
  ownerName: string;
  ownerType: string;
  horseCount: number;
  location: string;

  // Plan Selection
  selectedPlan: string;
  selectedAddons: string[];
  billingCycle: 'monthly' | 'yearly';

  // Preferences
  primaryConcerns: string[];
  alertFrequency: string;
  cameraSetup: string;

  // Security
  password: string;
  confirmPassword: string;

  // Terms
  termsAccepted: boolean;
  marketingConsent: boolean;
  trialConsent: boolean;
}

export interface IPricingPlan {
  id: string;
  name: string;
  description: string;
  maxHorses: number | string;
  monthlyPricePerHorse: number | string;
  yearlyPricePerHorse: number | string;
  features: string[];
  limitations: string[];
  popular: boolean;
  trialDays: number;
  setupFee: number | string;
  discountText?: string;
  contactSales?: boolean;
}

export interface IAddonService {
  id: string;
  name: string;
  description: string;
  price: number | string;
  unit: string;
  popular: boolean;
}

export interface IFormField {
  label: string;
  placeholder?: string;
  required: boolean;
  type?: string;
  min?: number;
  max?: number;
  minLength?: number;
  requirements?: string;
  options?: ISelectOption[];
  default?: any;
}

export interface ISelectOption {
  value: string;
  label: string;
}

export interface IFormSection {
  title: string;
  description?: string;
  fields: Record<string, IFormField>;
}

export interface ITrustIndicator {
  statistics: Array<{
    label: string;
    value: string;
  }>;
  testimonials: Array<{
    name: string;
    title: string;
    quote: string;
    rating: number;
  }>;
  certifications: string[];
}

export interface IRegistrationStep {
  id: string;
  title: string;
  subtitle?: string;
  component: React.ComponentType<any>;
  isValid?: (data: Partial<IRegistrationFormData>) => boolean;
  required: boolean;
}

export interface IPricingCalculation {
  basePrice: number;
  totalHorses: number;
  monthlyTotal: number;
  yearlyTotal: number;
  yearlyDiscount: number;
  setupFee: number;
  addonsTotal: number;
  finalTotal: number;
  savings?: number;
}

export interface IRegistrationProps {
  onRegistrationComplete: (data: IRegistrationFormData) => void;
  onNavigateToLogin: () => void;
}

export interface IPricingCardProps {
  plan: IPricingPlan;
  horseCount: number;
  billingCycle: 'monthly' | 'yearly';
  isSelected: boolean;
  onSelect: (planId: string) => void;
  isPopular?: boolean;
}

export interface IFormStepProps {
  formData: Partial<IRegistrationFormData>;
  onDataChange: (data: Partial<IRegistrationFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isValid: boolean;
  isLastStep?: boolean;
  isLoading?: boolean;
}

export interface IRegistrationValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface IPromotionalOffer {
  title: string;
  description: string;
  code: string;
  discountPercent: number;
  validUntil?: string;
  minHorses?: number;
}

export interface IRegistrationSuccess {
  title: string;
  subtitle: string;
  message: string;
  nextSteps: string[];
}

export interface IOwnerProfile {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  interests: string[];
  veterinarian: IVeterinarianInfo;
  trainer?: ITrainerInfo;
  emergencyContacts: IEmergencyContact[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IVeterinarianInfo {
  name: string;
  clinic: string;
  phone: string;
  email?: string;
}

export interface ITrainerInfo {
  name: string;
  discipline: string;
  phone: string;
  email?: string;
}

export interface IEmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export interface IHorseDetails {
  id?: string;
  name: string;
  showName?: string;
  age: number;
  breed: string;
  gender: 'mare' | 'gelding' | 'stallion' | 'filly' | 'colt';
  color: string;
  markings?: string;
  
  // Photo information
  photos?: IHorsePhoto[];
  
  // Health information
  medicalConditions?: string;
  currentMedications?: string;
  recentVetCare?: string;
  
  // Behavior
  temperament: 'calm' | 'spirited' | 'sensitive' | 'bold' | 'gentle';
  habits?: string;
  stressTriggers?: string;
  
  // Location
  facilityType: 'home' | 'boarding' | 'training';
  stallIdentifier?: string;
  turnoutSchedule?: string;
  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IHorsePhoto {
  id: string;
  file: File;
  url: string;
  caption?: string;
  isPrimary: boolean;
  uploadedAt: Date;
}

export interface IFacilityInfo {
  id?: string;
  propertyType: 'home' | 'boarding' | 'training' | 'multiple';
  
  // Infrastructure
  wifiStrength: 'excellent' | 'good' | 'fair' | 'poor' | 'none';
  wifiUpgradeWilling: boolean;
  powerAvailability: 'readily' | 'some' | 'limited' | 'none';
  powerInstallPossible: boolean;
  
  // Partnership
  hasReferral: boolean;
  referralCode?: string;
  referrerName?: string;
  
  // Installation
  installationPermission: boolean;
  facilityContact?: {
    name: string;
    phone: string;
  };
  
  // Installation Type (new)
  installationType: 'self' | 'professional';
  
  // Professional Installation Scheduling (only for professional installs)
  preferredTimeframe?: 'asap' | 'week' | 'twoWeeks' | 'month' | 'flexible';
  preferredDays?: 'weekdays' | 'weekends' | 'either';
  preferredTime?: 'morning' | 'afternoon' | 'either';
  installationNotes?: string;
  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISelectedPlan {
  id?: string;
  planId: 'starter' | 'professional' | 'estate';
  billingCycle: 'monthly' | 'annual';
  horseCount: number;
  addons: ISelectedAddon[];
  
  // Calculated pricing
  basePlanPrice: number;
  addonsPrice: number;
  discount: number;
  tax: number;
  totalPrice: number;
  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISelectedAddon {
  addonId: string;
  quantity: number;
  price: number;
}

export interface IPaymentInfo {
  id?: string;
  
  // Billing address
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    sameAsProfile: boolean;
  };
  
  // Payment method
  paymentMethod: 'card' | 'bank';
  
  // Payment details (encrypted/tokenized)
  paymentToken?: string;
  last4?: string;
  cardBrand?: string;
  
  // Order summary
  orderTotal: number;
  nextBillingDate: Date;
  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRegistrationData {
  id?: string;
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
  currentStep: 'owner' | 'horses' | 'facility' | 'plans' | 'payment' | 'confirmation';
  
  // Step data
  ownerProfile?: IOwnerProfile;
  horses: IHorseDetails[];
  facilityInfo?: IFacilityInfo;
  selectedPlan?: ISelectedPlan;
  paymentInfo?: IPaymentInfo;
  
  // Metadata
  referralSource?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  
  // Timestamps
  startedAt: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRegistrationFormProps {
  currentStep: number;
  totalSteps: number;
  registrationData: IRegistrationData;
  onStepComplete: (stepId: string, data: any) => void;
  onStepBack: () => void;
  isLoading?: boolean;
  errors?: Record<string, string>;
}

export interface IOwnerProfileFormProps {
  initialData?: Partial<IOwnerProfile>;
  onSubmit: (data: IOwnerProfile) => void;
  onBack: () => void;
  isLoading?: boolean;
  errors?: Record<string, string>;
}

export interface IHorseDetailsFormProps {
  initialData?: IHorseDetails[];
  onSubmit: (data: IHorseDetails[]) => void;
  onBack: () => void;
  isLoading?: boolean;
  errors?: Record<string, string>;
}

export interface IFacilityFormProps {
  initialData?: Partial<IFacilityInfo>;
  onSubmit: (data: IFacilityInfo) => void;
  onBack: () => void;
  isLoading?: boolean;
  errors?: Record<string, string>;
}

export interface IPlanSelectionProps {
  horseCount: number;
  initialData?: Partial<ISelectedPlan>;
  onSubmit: (data: ISelectedPlan) => void;
  onBack: () => void;
  isLoading?: boolean;
  errors?: Record<string, string>;
}

export interface IPaymentFormProps {
  orderSummary: ISelectedPlan;
  onSubmit: (data: IPaymentInfo) => void;
  onBack: () => void;
  isLoading?: boolean;
  errors?: Record<string, string>;
}

export interface IProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{
    id: string;
    title: string;
    completed: boolean;
    active: boolean;
  }>;
}

export interface IHorseCardProps {
  horse: IHorseDetails;
  onEdit: (horse: IHorseDetails) => void;
  onRemove: (horseId: string) => void;
  isEditing?: boolean;
}

export interface IPlanCardProps {
  plan: {
    id: string;
    name: string;
    displayName: string;
    subtitle: string;
    price: {
      monthly: number;
      annual: number;
    };
    features: string[];
    popular?: boolean;
    color: string;
  };
  selected: boolean;
  onSelect: (planId: string) => void;
  horseCount: number;
  billingCycle: 'monthly' | 'annual';
}

export interface IRegistrationSummaryProps {
  registrationData: IRegistrationData;
  onEdit: (step: string) => void;
}

export interface IConfirmationProps {
  orderNumber: string;
  email: string;
  registrationData: IRegistrationData;
  onDashboard: () => void;
  onSupport: () => void;
  onDownload: () => void;
}

export interface IValidationResult {
  valid: boolean;
  errors: string[];
}

export interface IFormField {
  value: any;
  error?: string;
  touched: boolean;
  required: boolean;
}

export interface IFormState {
  fields: Record<string, IFormField>;
  isValid: boolean;
  isSubmitting: boolean;
  submitCount: number;
}

export interface IRegistrationResponse {
  success: boolean;
  data?: {
    registrationId: string;
    orderNumber: string;
    redirectUrl?: string;
  };
  error?: {
    message: string;
    code: string;
    details?: Record<string, string>;
  };
}

export interface IValidationResponse {
  valid: boolean;
  errors: Record<string, string>;
}

export interface IRegistrationContext {
  registrationData: IRegistrationData;
  currentStep: number;
  totalSteps: number;
  
  updateRegistrationData: (data: Partial<IRegistrationData>) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  completeStep: (stepId: string, data: any) => void;
  
  isLoading: boolean;
  error: string | null;
  
  validateStep: (stepId: string, data: any) => IValidationResult;
  
  saveProgress: () => Promise<void>;
  loadProgress: () => Promise<void>;
}

export interface IUseRegistrationProps {
  initialData?: Partial<IRegistrationData>;
  onComplete?: (data: IRegistrationData) => void;
  onError?: (error: string) => void;
}

export interface IUseRegistrationReturn {
  registrationData: IRegistrationData;
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
  error: string | null;
  
  updateOwnerProfile: (data: IOwnerProfile) => void;
  updateHorses: (data: IHorseDetails[]) => void;
  updateFacility: (data: IFacilityInfo) => void;
  updatePlan: (data: ISelectedPlan) => void;
  updatePayment: (data: IPaymentInfo) => void;
  
  goToStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  
  validateCurrentStep: () => IValidationResult;
  
  completeRegistration: () => Promise<IRegistrationResponse>;
}

// Additional interfaces for RegisterPlanSelection component
export interface IPlanSelection {
  selectedPlan: 'starter' | 'professional' | 'estate';
  billingCycle: 'monthly' | 'annual';
  cameras: ICameraSelection[];
  selectedBundle?: string;
  installationPreference?: 'self' | 'professional';
  purchaseVsLease?: 'lease' | 'purchase';
  additionalCameraCount?: number;
  referralCode?: string;
}

export interface ICameraSelection {
  id: string;
  type: 'indoor' | 'outdoor';
  placement: string;
  quantity: number;
  price: number;
}

export interface ISmartRecommendations {
  recommendedPlan: 'starter' | 'professional' | 'estate';
  reasoning: string[];
  savings: number;
}

// Payment-related interfaces for Step 5
export interface IAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ICardInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
}

export interface IACHInfo {
  routingNumber: string;
  accountNumber: string;
  nameOnAccount: string;
}

export interface IPaymentFormData {
  billingAddress: IAddress;
  shippingAddress: IAddress;
  sameAsShipping: boolean;
  paymentMethod: 'card' | 'ach';
  cardInfo?: ICardInfo;
  achInfo?: IACHInfo;
  shippingMethod: 'standard' | 'expedited' | 'overnight';
  shippingCost: number;
  taxes: number;
  finalTotal: number;
  orderSummary: {
    planName: string;
    planCost: number;
    cameraCount: number;
    cameraCost: number;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
}

export interface IRegisterPaymentProps {
  onNext: (data: IPaymentFormData) => void;
  onBack: () => void;
  planSelectionData: IPlanSelection;
  horseCount: number;
  facilityData: any;
  initialData?: Partial<IPaymentFormData>;
}

export interface IOrderSummaryData {
  planName: string;
  planCost: number;
  billingCycle: 'monthly' | 'annual';
  cameraCount: number;
  cameraCost: number;
  installationCost: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  savings?: number;
  referralDiscount?: number;
} 