export interface IPaymentConfig {
  content: {
    pageTitle: string;
    pageSubtitle: string;
    sections: {
      orderSummary: {
        title: string;
        subtitle: string;
        expandText: string;
        collapseText: string;
      };
      shippingAddress: {
        title: string;
        subtitle: string;
      };
      billingAddress: {
        title: string;
        subtitle: string;
        sameAsShippingLabel: string;
      };
      shippingMethod: {
        title: string;
        subtitle: string;
        calculatingText: string;
        enterZipPrompt: string;
      };
      paymentMethod: {
        title: string;
        subtitle: string;
        creditCardLabel: string;
        achLabel: string;
        securityNotice: string;
      };
      orderTotal: {
        title: string;
        subtotalLabel: string;
        shippingLabel: string;
        taxLabel: string;
        totalLabel: string;
        disclaimerText: string;
      };
      packageContents: {
        title: string;
        subtitle: string;
        viewDetailsText: string;
        hideDetailsText: string;
        sections: {
          hardware: {
            title: string;
            icon: string;
          };
          software: {
            title: string;
            icon: string;
          };
          support: {
            title: string;
            icon: string;
          };
          warranty: {
            title: string;
            icon: string;
          };
        };
      };
    };
    buttons: {
      backToPlan: string;
      completeOrder: string;
      processingOrder: string;
    };
    messages: {
      calculatingShipping: string;
      shippingCalculated: string;
      invalidZipCode: string;
      processingPayment: string;
      orderComplete: string;
    };
    placeholders: {
      firstName: string;
      lastName: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      cardNumber: string;
      expiryDate: string;
      cvv: string;
      nameOnCard: string;
      routingNumber: string;
      accountNumber: string;
    };
    validation: {
      required: string;
      invalidEmail: string;
      invalidZipCode: string;
      invalidCardNumber: string;
      invalidExpiryDate: string;
      invalidCvv: string;
      invalidRoutingNumber: string;
      invalidAccountNumber: string;
    };
  };
  forms: {
    addressFields: IAddressFieldConfig[];
    paymentFields: {
      creditCard: IPaymentFieldConfig[];
      ach: IPaymentFieldConfig[];
    };
  };
  security: {
    badges: ISecurityBadge[];
    guarantees: IGuarantee[];
  };
  testimonial: {
    quote: string;
    author: string;
    title: string;
    location: string;
  };
}

export interface IAddressFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'select';
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string; }[];
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}

export interface IPaymentFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'password' | 'tel';
  required: boolean;
  placeholder?: string;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}

export interface ISecurityBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface IGuarantee {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const paymentConfig: IPaymentConfig = {
  content: {
    pageTitle: 'Complete Your Order',
    pageSubtitle: 'Secure checkout with 256-bit SSL encryption',
    sections: {
      orderSummary: {
        title: 'Order Summary',
        subtitle: 'Review your selections',
        expandText: 'Show Details',
        collapseText: 'Hide Details'
      },
      shippingAddress: {
        title: 'Shipping Address',
        subtitle: 'Where should we ship your camera equipment?'
      },
      billingAddress: {
        title: 'Billing Address',
        subtitle: 'Address for payment processing',
        sameAsShippingLabel: 'Same as shipping address'
      },
      shippingMethod: {
        title: 'Shipping Method',
        subtitle: 'Choose your delivery speed',
        calculatingText: 'Calculating shipping costs...',
        enterZipPrompt: 'Enter your zip code to see shipping options'
      },
      paymentMethod: {
        title: 'Payment Method',
        subtitle: 'Secure payment processing',
        creditCardLabel: 'Credit Card',
        achLabel: 'Bank Account (ACH)',
        securityNotice: 'Your payment information is encrypted and secure'
      },
      orderTotal: {
        title: 'Order Total',
        subtotalLabel: 'Subtotal',
        shippingLabel: 'Shipping',
        taxLabel: 'Tax',
        totalLabel: 'Total',
        disclaimerText: 'Installation and setup fees will be calculated during scheduling'
      },
      packageContents: {
        title: 'What\'s Included',
        subtitle: 'Your complete One Barn AI monitoring system',
        viewDetailsText: 'View Package Details',
        hideDetailsText: 'Hide Details',
        sections: {
          hardware: {
            title: 'Hardware Package',
            icon: '📦'
          },
          software: {
            title: 'Software & AI Features',
            icon: '🧠'
          },
          support: {
            title: 'Support & Training',
            icon: '🎓'
          },
          warranty: {
            title: 'Warranty & Guarantees',
            icon: '🛡️'
          }
        }
      }
    },
    buttons: {
      backToPlan: 'Back to Plan Selection',
      completeOrder: 'Complete Order',
      processingOrder: 'Processing Order...'
    },
    messages: {
      calculatingShipping: 'Calculating shipping costs...',
      shippingCalculated: 'Shipping costs updated',
      invalidZipCode: 'Please enter a valid zip code',
      processingPayment: 'Processing your payment...',
      orderComplete: 'Order completed successfully!'
    },
    placeholders: {
      firstName: 'First Name',
      lastName: 'Last Name',
      address: 'Street Address',
      city: 'City',
      state: 'State',
      zipCode: 'Zip Code',
      cardNumber: '1234 5678 9012 3456',
      expiryDate: 'MM/YY',
      cvv: 'CVV',
      nameOnCard: 'Name on Card',
      routingNumber: 'Routing Number',
      accountNumber: 'Account Number'
    },
    validation: {
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      invalidZipCode: 'Please enter a valid 5-digit zip code',
      invalidCardNumber: 'Please enter a valid card number',
      invalidExpiryDate: 'Please enter a valid expiry date (MM/YY)',
      invalidCvv: 'Please enter a valid CVV',
      invalidRoutingNumber: 'Please enter a valid 9-digit routing number',
      invalidAccountNumber: 'Please enter a valid account number'
    }
  },
  forms: {
    addressFields: [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        required: true,
        placeholder: 'First Name',
        validation: {
          minLength: 2,
          maxLength: 50
        }
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        required: true,
        placeholder: 'Last Name',
        validation: {
          minLength: 2,
          maxLength: 50
        }
      },
      {
        name: 'address',
        label: 'Street Address',
        type: 'text',
        required: true,
        placeholder: '123 Main Street',
        validation: {
          minLength: 5,
          maxLength: 100
        }
      },
      {
        name: 'city',
        label: 'City',
        type: 'text',
        required: true,
        placeholder: 'City',
        validation: {
          minLength: 2,
          maxLength: 50
        }
      },
      {
        name: 'state',
        label: 'State',
        type: 'select',
        required: true,
        options: [
          { value: '', label: 'Select State' },
          { value: 'AL', label: 'Alabama' },
          { value: 'AK', label: 'Alaska' },
          { value: 'AZ', label: 'Arizona' },
          { value: 'AR', label: 'Arkansas' },
          { value: 'CA', label: 'California' },
          { value: 'CO', label: 'Colorado' },
          { value: 'CT', label: 'Connecticut' },
          { value: 'DE', label: 'Delaware' },
          { value: 'FL', label: 'Florida' },
          { value: 'GA', label: 'Georgia' },
          { value: 'HI', label: 'Hawaii' },
          { value: 'ID', label: 'Idaho' },
          { value: 'IL', label: 'Illinois' },
          { value: 'IN', label: 'Indiana' },
          { value: 'IA', label: 'Iowa' },
          { value: 'KS', label: 'Kansas' },
          { value: 'KY', label: 'Kentucky' },
          { value: 'LA', label: 'Louisiana' },
          { value: 'ME', label: 'Maine' },
          { value: 'MD', label: 'Maryland' },
          { value: 'MA', label: 'Massachusetts' },
          { value: 'MI', label: 'Michigan' },
          { value: 'MN', label: 'Minnesota' },
          { value: 'MS', label: 'Mississippi' },
          { value: 'MO', label: 'Missouri' },
          { value: 'MT', label: 'Montana' },
          { value: 'NE', label: 'Nebraska' },
          { value: 'NV', label: 'Nevada' },
          { value: 'NH', label: 'New Hampshire' },
          { value: 'NJ', label: 'New Jersey' },
          { value: 'NM', label: 'New Mexico' },
          { value: 'NY', label: 'New York' },
          { value: 'NC', label: 'North Carolina' },
          { value: 'ND', label: 'North Dakota' },
          { value: 'OH', label: 'Ohio' },
          { value: 'OK', label: 'Oklahoma' },
          { value: 'OR', label: 'Oregon' },
          { value: 'PA', label: 'Pennsylvania' },
          { value: 'RI', label: 'Rhode Island' },
          { value: 'SC', label: 'South Carolina' },
          { value: 'SD', label: 'South Dakota' },
          { value: 'TN', label: 'Tennessee' },
          { value: 'TX', label: 'Texas' },
          { value: 'UT', label: 'Utah' },
          { value: 'VT', label: 'Vermont' },
          { value: 'VA', label: 'Virginia' },
          { value: 'WA', label: 'Washington' },
          { value: 'WV', label: 'West Virginia' },
          { value: 'WI', label: 'Wisconsin' },
          { value: 'WY', label: 'Wyoming' }
        ]
      },
      {
        name: 'zipCode',
        label: 'Zip Code',
        type: 'text',
        required: true,
        placeholder: '12345',
        validation: {
          pattern: '^\\d{5}(-\\d{4})?$',
          minLength: 5,
          maxLength: 10
        }
      }
    ],
    paymentFields: {
      creditCard: [
        {
          name: 'cardNumber',
          label: 'Card Number',
          type: 'text',
          required: true,
          placeholder: '1234 5678 9012 3456',
          validation: {
            pattern: '^[0-9\\s]{13,19}$',
            minLength: 13,
            maxLength: 19
          }
        },
        {
          name: 'expiryDate',
          label: 'Expiry Date',
          type: 'text',
          required: true,
          placeholder: 'MM/YY',
          validation: {
            pattern: '^(0[1-9]|1[0-2])\\/\\d{2}$',
            minLength: 5,
            maxLength: 5
          }
        },
        {
          name: 'cvv',
          label: 'CVV',
          type: 'text',
          required: true,
          placeholder: '123',
          validation: {
            pattern: '^\\d{3,4}$',
            minLength: 3,
            maxLength: 4
          }
        },
        {
          name: 'nameOnCard',
          label: 'Name on Card',
          type: 'text',
          required: true,
          placeholder: 'John Doe',
          validation: {
            minLength: 2,
            maxLength: 50
          }
        }
      ],
      ach: [
        {
          name: 'routingNumber',
          label: 'Routing Number',
          type: 'text',
          required: true,
          placeholder: '123456789',
          validation: {
            pattern: '^\\d{9}$',
            minLength: 9,
            maxLength: 9
          }
        },
        {
          name: 'accountNumber',
          label: 'Account Number',
          type: 'text',
          required: true,
          placeholder: 'Account Number',
          validation: {
            pattern: '^\\d{4,20}$',
            minLength: 4,
            maxLength: 20
          }
        },
        {
          name: 'nameOnAccount',
          label: 'Name on Account',
          type: 'text',
          required: true,
          placeholder: 'John Doe',
          validation: {
            minLength: 2,
            maxLength: 50
          }
        }
      ]
    }
  },
  security: {
    badges: [
      {
        id: 'ssl',
        name: 'SSL Encrypted',
        icon: '🔒',
        description: '256-bit SSL encryption protects your data'
      },
      {
        id: 'pci',
        name: 'PCI Compliant',
        icon: '🛡️',
        description: 'PCI DSS compliant payment processing'
      },
      {
        id: 'secure',
        name: 'Secure Checkout',
        icon: '✅',
        description: 'Your payment information is never stored'
      }
    ],
    guarantees: [
      {
        id: 'moneyBack',
        title: '30-Day Money Back Guarantee',
        description: 'Not satisfied? Get a full refund within 30 days',
        icon: '💰'
      },
      {
        id: 'support',
        title: '24/7 Customer Support',
        description: 'Our team is here to help you every step of the way',
        icon: '📞'
      },
      {
        id: 'warranty',
        title: '1-Year Equipment Warranty',
        description: 'All hardware is covered by our comprehensive warranty',
        icon: '🔧'
      }
    ]
  },
  testimonial: {
    quote: 'The checkout process was seamless and secure. I had my cameras installed within a week and they work perfectly!',
    author: 'Sarah Johnson',
    title: 'Horse Owner',
    location: 'Kentucky'
  }
}; 