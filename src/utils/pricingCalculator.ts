import { registrationWorkflowConfig } from '../config/registrationWorkflowConfig';
import { hardwareConfig } from '../config/hardwareConfig';

// Pricing Calculator - Handles all pricing scenarios for registration
export interface ICameraSelection {
  type: 'essential' | 'pro' | 'enterprise';
  powerType: 'battery' | 'plugin' | 'solar';
  quantity: number;
  mountingLocation?: string;
  price?: number;
}

export interface IPlanSelection {
  // Software subscription
  selectedPlan: 'starter' | 'professional' | 'estate';
  billingCycle: 'monthly' | 'annual';
  addOns: string[];
  
  // Hardware selection
  cameras: ICameraSelection[];
  installationType: 'diy' | 'assisted' | 'professional';
  installationPreferences?: any;
  
  // Pricing options
  purchaseVsLease: 'purchase' | 'lease';
  financingOption?: string;
  
  // Bundle and discounts
  selectedBundle?: string;
  appliedDiscounts: string[];
  referralCode?: string;
}

export interface IPricingBreakdown {
  software: {
    monthly: number;
    annual: number;
    savings: number;
    addOnsMonthly: number;
  };
  hardware: {
    oneTime: number;
    monthly: number;
    financing: number;
    installationCost: number;
  };
  discounts: {
    bundle: number;
    referral: number;
    annual: number;
    partner: number;
  };
  totals: {
    monthlyRecurring: number;
    oneTimePayment: number;
    annualSavings: number;
    totalFirstYear: number;
  };
}

export class PricingCalculator {
  
  /**
   * Calculate software subscription pricing
   */
  calculateSoftwarePrice(
    planId: 'starter' | 'professional' | 'estate',
    horseCount: number,
    billingCycle: 'monthly' | 'annual',
    addOns: string[] = []
  ): { monthly: number; annual: number; savings: number; addOnsMonthly: number } {
    
    const plan = registrationWorkflowConfig.plans[planId];
    if (!plan) throw new Error(`Plan ${planId} not found`);

    let basePrice = billingCycle === 'annual' ? plan.price.annual : plan.price.monthly;
    
    // Add cost for additional horses beyond included count
    if (horseCount > plan.horses.included) {
      const additionalHorses = horseCount - plan.horses.included;
      basePrice += additionalHorses * plan.horses.additional;
    }

    // Calculate add-ons cost
    const addOnsMonthly = this.calculateAddOnsPrice(addOns);
    
    // Apply annual discount if applicable
    const monthly = basePrice + addOnsMonthly;
    const annual = billingCycle === 'annual' ? basePrice + addOnsMonthly : monthly;
    const savings = billingCycle === 'annual' ? (monthly * 12 - annual * 12) : 0;

    return {
      monthly: billingCycle === 'annual' ? basePrice + addOnsMonthly : monthly,
      annual: annual * 12,
      savings,
      addOnsMonthly
    };
  }

  /**
   * Calculate add-ons pricing
   */
  private calculateAddOnsPrice(addOns: string[]): number {
    const addOnPricing: Record<string, number> = {
      'extra_cameras': 99,
      'vet_integration': 49,
      'training_analytics': 79,
      'extended_storage': 29
    };

    return addOns.reduce((total, addOn) => {
      return total + (addOnPricing[addOn] || 0);
    }, 0);
  }

  /**
   * Calculate hardware equipment pricing
   */
  calculateHardwarePrice(
    cameras: ICameraSelection[],
    purchaseType: 'purchase' | 'lease',
    installationType: 'diy' | 'assisted' | 'professional'
  ): { oneTime: number; monthly: number; financing: number; installationCost: number } {
    
    let oneTime = 0;
    let monthly = 0;
    let installationCost = 0;

    // Calculate camera costs
    cameras.forEach(selection => {
      const camera = hardwareConfig.cameras[selection.type];
      if (!camera) return;

      const powerTypeCost = hardwareConfig.powerTypes[selection.powerType]?.pricing?.additionalCost || 0;
      
      if (purchaseType === 'purchase') {
        oneTime += (camera.pricing.purchase.discountPrice + powerTypeCost) * selection.quantity;
      } else {
        monthly += (camera.pricing.lease.monthly + (powerTypeCost / 24)) * selection.quantity;
      }
    });

    // Calculate installation cost
    const installationService = hardwareConfig.installationServices[installationType];
    if (installationService) {
      installationCost = installationService.price * cameras.reduce((total, cam) => total + cam.quantity, 0);
    }

    return {
      oneTime: oneTime + installationCost,
      monthly,
      financing: monthly * 24, // Total financing cost
      installationCost
    };
  }

  /**
   * Calculate bundle discounts
   */
  calculateBundleDiscounts(selections: IPlanSelection): number {
    if (!selections.selectedBundle) return 0;

    const bundle = hardwareConfig.bundles[selections.selectedBundle];
    if (!bundle) return 0;

    // Calculate original price vs bundle price
    const originalPrice = bundle.pricing.originalPrice;
    const bundlePrice = bundle.pricing.bundlePrice;
    
    return originalPrice - bundlePrice;
  }

  /**
   * Calculate referral and partner discounts
   */
  calculateReferralDiscounts(referralCode: string, totalCost: number): number {
    if (!referralCode) return 0;

    // Partner codes give 20% discount
    if (this.isPartnerCode(referralCode)) {
      return totalCost * 0.20;
    }

    // Regular referral codes give 10% discount
    return totalCost * 0.10;
  }

  /**
   * Check if referral code is from a partner
   */
  private isPartnerCode(code: string): boolean {
    const partnerPrefixes = ['BARN_', 'VET_', 'TRAINER_', 'PARTNER_'];
    return partnerPrefixes.some(prefix => code.toUpperCase().startsWith(prefix));
  }

  /**
   * Get bundle recommendations based on selections
   */
  getBundleRecommendations(
    horseCount: number,
    facilityType: string,
    selectedCameras: ICameraSelection[]
  ): string {
    
    const recommendations = hardwareConfig.recommendations;
    
    // First check horse count recommendations
    const horseRec = recommendations.horseCount[horseCount as keyof typeof recommendations.horseCount];
    if (horseRec) {
      return horseRec.recommendedBundle;
    }

    // Then check facility type
    const facilityRec = recommendations.facilityType[facilityType as keyof typeof recommendations.facilityType];
    if (facilityRec) {
      return facilityRec.recommendedBundle;
    }

    // Default recommendations
    if (horseCount <= 2) return 'starter';
    if (horseCount <= 6) return 'complete';
    return 'commercial';
  }

  /**
   * Calculate complete pricing breakdown
   */
  calculateTotalPricing(selections: IPlanSelection, horseCount: number): IPricingBreakdown {
    
    // Software pricing
    const software = this.calculateSoftwarePrice(
      selections.selectedPlan,
      horseCount,
      selections.billingCycle,
      selections.addOns
    );

    // Hardware pricing
    const hardware = this.calculateHardwarePrice(
      selections.cameras,
      selections.purchaseVsLease,
      selections.installationType
    );

    // Discounts
    const bundleDiscount = this.calculateBundleDiscounts(selections);
    const referralDiscount = selections.referralCode 
      ? this.calculateReferralDiscounts(selections.referralCode, hardware.oneTime + software.monthly)
      : 0;
    const annualDiscount = selections.billingCycle === 'annual' ? software.savings : 0;
    const partnerDiscount = selections.referralCode && this.isPartnerCode(selections.referralCode) 
      ? (hardware.oneTime + software.monthly) * 0.20 
      : 0;

    // Totals
    const monthlyRecurring = software.monthly + hardware.monthly;
    const oneTimePayment = Math.max(0, hardware.oneTime - bundleDiscount - referralDiscount);
    const annualSavings = annualDiscount + bundleDiscount + referralDiscount;
    const totalFirstYear = (monthlyRecurring * 12) + oneTimePayment;

    return {
      software: {
        monthly: software.monthly,
        annual: software.annual,
        savings: software.savings,
        addOnsMonthly: software.addOnsMonthly
      },
      hardware: {
        oneTime: hardware.oneTime,
        monthly: hardware.monthly,
        financing: hardware.financing,
        installationCost: hardware.installationCost
      },
      discounts: {
        bundle: bundleDiscount,
        referral: referralDiscount,
        annual: annualDiscount,
        partner: partnerDiscount
      },
      totals: {
        monthlyRecurring,
        oneTimePayment,
        annualSavings,
        totalFirstYear
      }
    };
  }

  /**
   * Get smart recommendations based on facility assessment
   */
  getSmartRecommendations(
    facilityType: string,
    horseCount: number,
    wifiStrength: string,
    powerAccess: string
  ): {
    recommendedPlan: string;
    recommendedCamera: string;
    recommendedPower: string;
    recommendedInstallation: string;
    recommendedBundle: string;
    reasoning: string[];
  } {
    
    const recommendations = hardwareConfig.recommendations;
    
    // Get base recommendations
    const facilityRec = recommendations.facilityType[facilityType as keyof typeof recommendations.facilityType];
    const wifiRec = recommendations.wifiStrength[wifiStrength as keyof typeof recommendations.wifiStrength];
    const horseRec = recommendations.horseCount[horseCount as keyof typeof recommendations.horseCount];
    
    // Determine best options
    let recommendedCamera = facilityRec?.recommendedCamera || 'pro';
    let recommendedPower = facilityRec?.recommendedPower || 'battery';
    let recommendedInstallation = facilityRec?.recommendedInstallation || 'diy';
    let recommendedBundle = facilityRec?.recommendedBundle || 'complete';
    
    // Adjust based on WiFi strength
    if (wifiRec && wifiStrength in ['poor', 'none']) {
      recommendedCamera = 'essential';
    }
    
    // Adjust power based on access
    if (powerAccess === 'readily') {
      recommendedPower = 'plugin';
    } else if (powerAccess === 'none') {
      recommendedPower = 'battery';
    }
    
    // Determine software plan based on horse count
    let recommendedPlan = 'professional'; // default
    if (horseCount <= 2) recommendedPlan = 'starter';
    if (horseCount >= 7) recommendedPlan = 'estate';
    
    // Generate reasoning
    const reasoning: string[] = [];
    
    if (facilityType === 'home') {
      reasoning.push('For home properties, we recommend starting with essential equipment and DIY installation');
    } else if (facilityType === 'training') {
      reasoning.push('Training facilities benefit from enterprise-grade cameras and professional installation');
    }
    
    if (wifiStrength in ['poor', 'none']) {
      reasoning.push('Limited WiFi suggests using essential cameras with battery power for flexibility');
    }
    
    if (horseCount > 3) {
      reasoning.push(`With ${horseCount} horses, bundle packages provide significant cost savings`);
    }
    
    return {
      recommendedPlan,
      recommendedCamera,
      recommendedPower,
      recommendedInstallation,
      recommendedBundle,
      reasoning
    };
  }

  /**
   * Calculate monthly payment for financing
   */
  calculateMonthlyPayment(
    totalCost: number,
    termMonths: number,
    interestRate: number = 0,
    downPayment: number = 0
  ): number {
    
    const principal = totalCost - downPayment;
    
    if (interestRate === 0) {
      return principal / termMonths;
    }
    
    const monthlyRate = interestRate / 12;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                   (Math.pow(1 + monthlyRate, termMonths) - 1);
    
    return Math.round(payment * 100) / 100;
  }

  /**
   * Get upgrade suggestions
   */
  getUpgradeSuggestions(
    currentSelections: IPlanSelection,
    horseCount: number
  ): Array<{
    type: 'plan' | 'camera' | 'bundle';
    suggestion: string;
    benefit: string;
    additionalCost: number;
    savings?: number;
  }> {
    
    const suggestions = [];
    
    // Plan upgrade suggestions
    if (currentSelections.selectedPlan === 'starter' && horseCount >= 3) {
      suggestions.push({
        type: 'plan' as const,
        suggestion: 'Upgrade to Professional Plan',
        benefit: 'Advanced AI analytics and veterinary integration',
        additionalCost: 150,
        savings: 0
      });
    }
    
    // Camera upgrade suggestions
    const hasEssentialCameras = currentSelections.cameras.some(cam => cam.type === 'essential');
    if (hasEssentialCameras) {
      suggestions.push({
        type: 'camera' as const,
        suggestion: 'Upgrade to Pro Cameras',
        benefit: '4K video quality and advanced AI features',
        additionalCost: 100,
        savings: 0
      });
    }
    
    // Bundle suggestions
    if (!currentSelections.selectedBundle && currentSelections.cameras.length >= 2) {
      suggestions.push({
        type: 'bundle' as const,
        suggestion: 'Choose Complete Bundle',
        benefit: 'Save money with bundle pricing',
        additionalCost: 0,
        savings: 247
      });
    }
    
    return suggestions;
  }
}

export const pricingCalculator = new PricingCalculator(); 