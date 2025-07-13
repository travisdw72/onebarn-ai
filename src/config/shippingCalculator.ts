export interface IShippingCalculation {
  standardCost: number;
  expeditedCost: number;
  overnightCost: number;
  estimatedDays: {
    standard: string;
    expedited: string;
    overnight: string;
  };
  selectedMethod?: 'standard' | 'expedited' | 'overnight';
  selectedCost?: number;
}

export interface IShippingBreakdown {
  baseCost: number;
  equipmentFee: number;
  zoneMultiplier: number;
  handlingFee: number;
  totalCost: number;
  profitMargin: number;
}

export interface IShippingMethod {
  id: 'standard' | 'expedited' | 'overnight';
  name: string;
  description: string;
  estimatedDays: string;
  icon: string;
  popularChoice?: boolean;
}

export const shippingCalculator = {
  /**
   * Camera equipment specifications for shipping calculations
   */
  getEquipmentSpecs(cameraCount: number) {
    const singleCameraSpecs = {
      weight: 5, // 5 lbs per camera with accessories
      dimensions: { length: 12, width: 8, height: 6 } // inches
    };

    // Calculate packaging requirements
    let packageSpecs;
    if (cameraCount <= 2) {
      packageSpecs = { weight: 12, dimensions: { length: 16, width: 12, height: 8 } };
    } else if (cameraCount <= 4) {
      packageSpecs = { weight: 22, dimensions: { length: 20, width: 16, height: 10 } };
    } else if (cameraCount <= 8) {
      packageSpecs = { weight: 42, dimensions: { length: 24, width: 20, height: 12 } };
    } else {
      // Multiple boxes for 9+ cameras
      const boxCount = Math.ceil(cameraCount / 8);
      packageSpecs = { 
        weight: 42 * boxCount, 
        dimensions: { length: 24, width: 20, height: 12 },
        multipleBoxes: boxCount
      };
    }

    return {
      singleCamera: singleCameraSpecs,
      package: packageSpecs,
      totalWeight: cameraCount * singleCameraSpecs.weight
    };
  },

  /**
   * Get shipping zone multiplier based on zip code
   */
  getZoneMultiplier(zipCode: string): number {
    if (!zipCode || zipCode.length < 5) return 1.0;

    const zip = parseInt(zipCode.substr(0, 5));
    
    // Zone pricing based on US zip code ranges
    // Zone 1: Local/Regional (1.0x)
    if (zip >= 10000 && zip <= 20000) return 1.0; // Northeast corridor
    
    // Zone 2: Adjacent states (1.1x)  
    if ((zip >= 20001 && zip <= 30000) || (zip >= 40000 && zip <= 50000)) return 1.1;
    
    // Zone 3: Mid-distance (1.2x)
    if ((zip >= 30001 && zip <= 40000) || (zip >= 50001 && zip <= 70000)) return 1.2;
    
    // Zone 4: Far distance (1.3x)
    if ((zip >= 70001 && zip <= 90000) || (zip >= 96700 && zip <= 99999)) return 1.3;
    
    // Zone 5: Farthest/Remote (1.4x)
    if (zip >= 90001 && zip <= 96699) return 1.4;
    
    return 1.0; // Default
  },

  /**
   * Calculate shipping costs with profit margins
   */
  calculateShipping(
    cameraCount: number,
    zipCode: string,
    method: 'standard' | 'expedited' | 'overnight' = 'standard'
  ): IShippingBreakdown {
    const equipmentSpecs = this.getEquipmentSpecs(cameraCount);
    const zoneMultiplier = this.getZoneMultiplier(zipCode);
    
    // Base shipping rates with profit margins built in (15-25% markup)
    const baseRates = {
      standard: { 
        base: 15.99, 
        perCamera: 3.99,
        handlingBase: 4.99,
        profitMarginPercent: 20
      },
      expedited: { 
        base: 24.99, 
        perCamera: 5.99,
        handlingBase: 7.99,
        profitMarginPercent: 22
      },
      overnight: { 
        base: 39.99, 
        perCamera: 8.99,
        handlingBase: 12.99,
        profitMarginPercent: 25
      }
    };

    const rates = baseRates[method];
    
    // Calculate components
    const baseCost = rates.base;
    const equipmentFee = cameraCount * rates.perCamera;
    const handlingFee = rates.handlingBase + (cameraCount > 4 ? 5.00 : 0); // Extra handling for large orders
    
    // Apply zone multiplier
    const subtotal = (baseCost + equipmentFee + handlingFee) * zoneMultiplier;
    
    // Calculate profit margin (already built into rates, this is for transparency)
    const profitMargin = subtotal * (rates.profitMarginPercent / 100);
    
    // Final cost (rounded to nearest cent)
    const totalCost = Math.round(subtotal * 100) / 100;

    return {
      baseCost,
      equipmentFee,
      zoneMultiplier,
      handlingFee,
      totalCost,
      profitMargin
    };
  },

  /**
   * Get all shipping options for comparison
   */
  getAllShippingOptions(cameraCount: number, zipCode: string): IShippingCalculation {
    const standard = this.calculateShipping(cameraCount, zipCode, 'standard');
    const expedited = this.calculateShipping(cameraCount, zipCode, 'expedited');
    const overnight = this.calculateShipping(cameraCount, zipCode, 'overnight');

    return {
      standardCost: standard.totalCost,
      expeditedCost: expedited.totalCost,
      overnightCost: overnight.totalCost,
      estimatedDays: {
        standard: '5-7 business days',
        expedited: '2-3 business days',
        overnight: 'Next business day'
      }
    };
  },

  /**
   * Get shipping method definitions
   */
  getShippingMethods(): IShippingMethod[] {
    return [
      {
        id: 'standard',
        name: 'Standard Shipping',
        description: 'Most popular choice',
        estimatedDays: '5-7 business days',
        icon: '📦',
        popularChoice: true
      },
      {
        id: 'expedited',
        name: 'Expedited Shipping',
        description: 'Faster delivery',
        estimatedDays: '2-3 business days',
        icon: '⚡'
      },
      {
        id: 'overnight',
        name: 'Overnight Shipping',
        description: 'Next business day',
        estimatedDays: 'Next business day',
        icon: '🚀'
      }
    ];
  },

  /**
   * Calculate sales tax (simplified - would integrate with tax service in production)
   */
  calculateTax(subtotal: number, zipCode: string): number {
    if (!zipCode || zipCode.length < 5) return 0;

    const zip = parseInt(zipCode.substr(0, 5));
    
    // Simplified tax rates by state (would use real tax service in production)
    let taxRate = 0;
    
    if (zip >= 10000 && zip <= 19999) taxRate = 0.08; // NY
    else if (zip >= 20000 && zip <= 29999) taxRate = 0.06; // PA, MD, etc.
    else if (zip >= 30000 && zip <= 39999) taxRate = 0.07; // NC, SC, etc.
    else if (zip >= 40000 && zip <= 49999) taxRate = 0.065; // OH, IN, etc.
    else if (zip >= 50000 && zip <= 59999) taxRate = 0.05; // IA, etc.
    else if (zip >= 60000 && zip <= 69999) taxRate = 0.0875; // IL
    else if (zip >= 70000 && zip <= 79999) taxRate = 0.065; // TX (varies by city)
    else if (zip >= 80000 && zip <= 89999) taxRate = 0.04; // CO, WY, etc.
    else if (zip >= 90000 && zip <= 96999) taxRate = 0.0775; // CA (base rate)
    else if (zip >= 97000 && zip <= 97999) taxRate = 0.0; // OR - no sales tax
    else if (zip >= 98000 && zip <= 99999) taxRate = 0.065; // WA
    
    return Math.round(subtotal * taxRate * 100) / 100;
  },

  /**
   * Format currency for display
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  },

  /**
   * Validate zip code format
   */
  validateZipCode(zipCode: string): boolean {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
  }
}; 