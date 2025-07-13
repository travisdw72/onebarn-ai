import { registrationWorkflowConfig } from './registrationWorkflowConfig';

export interface IPricingBreakdown {
  software: {
    monthly: number;
    annual: number;
    savings: number;
    currentPrice: number; // Current price based on billing cycle
  };
  hardware: {
    cameras: number;
    cameraLease: number; // Monthly lease cost for cameras
    cameraApiCost: number; // Monthly API cost for purchased cameras
    installation: number;
    installationCost: number;
  };
  discounts: {
    bundle: number;
    referral: number;
    annual: number;
  };
  totals: {
    monthlyRecurring: number;
    oneTimePayment: number;
    totalFirstYear: number;
  };
}

export interface ISoftwarePricing {
  monthly: number;
  annual: number;
  savings: number;
  currentPrice: number; // Price for current billing cycle
}

export const pricingCalculator = {
  /**
   * Calculate software pricing for a plan
   */
  calculateSoftwarePrice(
    planId: 'starter' | 'professional' | 'estate',
    horseCount: number,
    billingCycle: 'monthly' | 'annual'
  ): ISoftwarePricing {
    const plan = registrationWorkflowConfig.plans[planId];
    
    if (!plan) {
      throw new Error(`Plan ${planId} not found`);
    }

    const baseMonthly = plan.price.monthly;
    const baseAnnual = plan.price.annual; // This is already the discounted monthly price
    
    // Calculate additional horse costs if needed
    const additionalHorses = Math.max(0, horseCount - plan.horses.included);
    const additionalHorseCost = additionalHorses * plan.horses.additional;
    
    const monthlyPrice = baseMonthly + additionalHorseCost;
    const annualMonthlyPrice = baseAnnual + additionalHorseCost; // Annual billing monthly equivalent
    const annualSavings = (monthlyPrice * 12) - (annualMonthlyPrice * 12);

    return {
      monthly: monthlyPrice,
      annual: annualMonthlyPrice,
      savings: annualSavings,
      currentPrice: billingCycle === 'annual' ? annualMonthlyPrice : monthlyPrice
    };
  },

  /**
   * Calculate total pricing breakdown including all components
   */
  calculateTotal(
    planId: 'starter' | 'professional' | 'estate',
    horseCount: number,
    additionalCameras: number,
    billingCycle: 'monthly' | 'annual',
    bundleId?: string,
    referralCode?: string,
    purchaseVsLease?: 'purchase' | 'lease'
  ): IPricingBreakdown {
    const plan = registrationWorkflowConfig.plans[planId];
    
    if (!plan) {
      throw new Error(`Plan ${planId} not found`);
    }

    // Software pricing
    const softwarePricing = this.calculateSoftwarePrice(planId, horseCount, billingCycle);
    
    // Hardware pricing - Includes API costs
    const cameraPricing = this.getCameraPricing(planId);
    const cameraCost = additionalCameras * cameraPricing.purchase;
    const cameraLeaseCost = additionalCameras * cameraPricing.lease;
    const cameraApiCost = additionalCameras * cameraPricing.apiCost; // Monthly API cost for purchased cameras
    const installationCost = 0; // Setup costs will be calculated on next screen with shipping/handling
    
    // Discounts
    let bundleDiscount = 0;
    let referralDiscount = 0;
    let annualDiscount = billingCycle === 'annual' ? softwarePricing.savings : 0;

    // Bundle discounts
    if (bundleId === 'premium') {
      bundleDiscount = Math.round(softwarePricing.monthly * 0.1); // 10% off monthly price
    }

    // Referral discounts - validate first
    if (referralCode && referralCode.length > 0) {
      const validation = this.validateReferralCode(referralCode);
      if (validation.valid) {
        referralDiscount = validation.discount;
      }
    }

    // Calculate totals based on purchase vs lease preference
    let monthlyRecurring = billingCycle === 'annual' ? softwarePricing.annual : softwarePricing.monthly;
    let oneTimePayment = installationCost;
    
    // Add camera costs based on purchase vs lease
    if (purchaseVsLease === 'purchase') {
      // Purchase cameras: pay upfront + monthly API costs
      oneTimePayment += cameraCost;
      monthlyRecurring += cameraApiCost;
    } else {
      // Lease cameras: monthly lease costs (includes API)
      monthlyRecurring += cameraLeaseCost;
    }
    
    const totalFirstYear = (monthlyRecurring * 12) + oneTimePayment - bundleDiscount - referralDiscount - annualDiscount;

    return {
      software: {
        monthly: softwarePricing.monthly,
        annual: softwarePricing.annual,
        savings: softwarePricing.savings,
        currentPrice: softwarePricing.currentPrice
      },
      hardware: {
        cameras: cameraCost,
        cameraLease: cameraLeaseCost,
        cameraApiCost: cameraApiCost,
        installation: installationCost,
        installationCost: installationCost
      },
      discounts: {
        bundle: bundleDiscount,
        referral: referralDiscount,
        annual: annualDiscount
      },
      totals: {
        monthlyRecurring,
        oneTimePayment,
        totalFirstYear
      }
    };
  },

  /**
   * Get camera pricing for additional cameras - Includes API costs
   */
  getCameraPricing(planId: 'starter' | 'professional' | 'estate'): {
    purchase: number;
    lease: number;
    apiCost: number; // Monthly API cost even for purchased cameras
  } {
    const prices = {
      starter: { purchase: 289, lease: 35, apiCost: 10 }, // $35/month lease OR $10/month API cost if purchased
      professional: { purchase: 279, lease: 35, apiCost: 8 }, // Professional tier gets slight discount
      estate: { purchase: 259, lease: 35, apiCost: 5 } // Estate tier gets better rates
    };

    return prices[planId];
  },

  /**
   * Calculate bundle savings
   */
  calculateBundleSavings(planId: 'starter' | 'professional' | 'estate', bundleId: string): number {
    const plan = registrationWorkflowConfig.plans[planId];
    
    switch (bundleId) {
      case 'premium':
        return Math.round(plan.price.monthly * 0.15); // 15% off
      case 'standard':
        return Math.round(plan.price.monthly * 0.1); // 10% off
      default:
        return 0;
    }
  },

  /**
   * Validate referral code and return discount
   */
  validateReferralCode(code: string): { valid: boolean; discount: number } {
    // Simple validation logic - in real app this would call an API
    const validCodes = ['SAVE59', 'TRAINER20', 'VET15'];
    
    if (validCodes.includes(code.toUpperCase())) {
      return { valid: true, discount: 59 };
    }
    
    return { valid: false, discount: 0 };
  },

  /**
   * Get recommended plan based on horse count and facility data
   */
  getRecommendedPlan(horseCount: number, facilityData?: any): 'starter' | 'professional' | 'estate' {
    if (horseCount <= 2) {
      return 'starter';
    } else if (horseCount <= 6) {
      return 'professional';
    } else {
      return 'estate';
    }
  },

  /**
   * Format currency consistently
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}; 