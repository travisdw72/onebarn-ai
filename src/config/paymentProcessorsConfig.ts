// Payment Processors Configuration
// Plug-and-play integration for multiple payment processors

export interface IPaymentProcessor {
  id: string;
  name: string;
  displayName: string;
  supportedMethods: ('card' | 'ach' | 'apple_pay' | 'google_pay')[];
  fees: {
    card: string;
    ach: string;
    description: string;
  };
  features: string[];
  integrationComplexity: 'easy' | 'medium' | 'complex';
  setupTime: string;
  documentation: string;
  testMode: boolean;
  configuration: {
    apiEndpoint: string;
    publicKey?: string;
    secretKey?: string;
    webhookEndpoint?: string;
    environment: 'sandbox' | 'production';
  };
}

export const paymentProcessors: Record<string, IPaymentProcessor> = {
  square: {
    id: 'square',
    name: 'Square',
    displayName: 'Square Payments',
    supportedMethods: ['card', 'ach', 'apple_pay', 'google_pay'],
    fees: {
      card: '2.9% + 30¢',
      ach: '1% + 30¢',
      description: 'Competitive rates with no monthly fees'
    },
    features: [
      'PCI Compliant',
      'Fraud Protection',
      'Real-time Processing',
      'Mobile Payments',
      'Recurring Billing',
      'Detailed Analytics',
      'Same-day Deposits Available',
      'Chargeback Protection'
    ],
    integrationComplexity: 'easy',
    setupTime: '30 minutes',
    documentation: 'https://developer.squareup.com/docs/payments-api/overview',
    testMode: true,
    configuration: {
      apiEndpoint: 'https://connect.squareupsandbox.com',
      publicKey: process.env.REACT_APP_SQUARE_PUBLIC_KEY || 'sandbox-sq0idp-XXXXXX',
      secretKey: process.env.REACT_APP_SQUARE_SECRET_KEY || 'sandbox-sq0isb-XXXXXX',
      webhookEndpoint: 'https://api.onebarn.ai/webhooks/square',
      environment: 'sandbox'
    }
  },
  stripe: {
    id: 'stripe',
    name: 'Stripe',
    displayName: 'Stripe Payments',
    supportedMethods: ['card', 'ach', 'apple_pay', 'google_pay'],
    fees: {
      card: '2.9% + 30¢',
      ach: '0.8% + $5',
      description: 'Global payment processing with advanced features'
    },
    features: [
      'PCI Compliant',
      'Advanced Fraud Detection',
      'Global Payment Methods',
      'Subscription Management',
      'Connect Marketplace',
      'Machine Learning Risk Scoring',
      'Instant Payouts',
      'Comprehensive APIs'
    ],
    integrationComplexity: 'easy',
    setupTime: '45 minutes',
    documentation: 'https://stripe.com/docs/payments',
    testMode: true,
    configuration: {
      apiEndpoint: 'https://api.stripe.com',
      publicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_XXXXXX',
      secretKey: process.env.REACT_APP_STRIPE_SECRET_KEY || 'sk_test_XXXXXX',
      webhookEndpoint: 'https://api.onebarn.ai/webhooks/stripe',
      environment: 'sandbox'
    }
  },
  paypal: {
    id: 'paypal',
    name: 'PayPal',
    displayName: 'PayPal Payments',
    supportedMethods: ['card', 'ach'],
    fees: {
      card: '2.9% + 30¢',
      ach: '1% + $5',
      description: 'Trusted payment solution with buyer protection'
    },
    features: [
      'Buyer Protection',
      'PayPal Wallet Integration',
      'Express Checkout',
      'Mobile Optimized',
      'International Payments',
      'Seller Protection',
      'One-click Payments',
      'PayPal Credit'
    ],
    integrationComplexity: 'medium',
    setupTime: '1-2 hours',
    documentation: 'https://developer.paypal.com/docs/checkout/',
    testMode: true,
    configuration: {
      apiEndpoint: 'https://api.sandbox.paypal.com',
      publicKey: process.env.REACT_APP_PAYPAL_CLIENT_ID || 'sandbox_client_id',
      secretKey: process.env.REACT_APP_PAYPAL_CLIENT_SECRET || 'sandbox_client_secret',
      webhookEndpoint: 'https://api.onebarn.ai/webhooks/paypal',
      environment: 'sandbox'
    }
  },
  authorize_net: {
    id: 'authorize_net',
    name: 'Authorize.Net',
    displayName: 'Authorize.Net',
    supportedMethods: ['card', 'ach'],
    fees: {
      card: '2.9% + 30¢',
      ach: '$0.25 per transaction',
      description: 'Established payment gateway with enterprise features'
    },
    features: [
      'PCI Compliant',
      'Fraud Detection Suite',
      'Account Updater',
      'Customer Information Manager',
      'Recurring Billing',
      'Mobile Payments',
      'Advanced Reporting',
      'Virtual Terminal'
    ],
    integrationComplexity: 'medium',
    setupTime: '2-3 hours',
    documentation: 'https://developer.authorize.net/api/reference/',
    testMode: true,
    configuration: {
      apiEndpoint: 'https://apitest.authorize.net/xml/v1/request.api',
      publicKey: process.env.REACT_APP_AUTHNET_LOGIN_ID || 'test_login_id',
      secretKey: process.env.REACT_APP_AUTHNET_TRANSACTION_KEY || 'test_transaction_key',
      webhookEndpoint: 'https://api.onebarn.ai/webhooks/authorize-net',
      environment: 'sandbox'
    }
  }
};

// Square Integration Example (EASIEST TO IMPLEMENT)
export const squareIntegrationExample = {
  installation: `
    # Install Square SDK
    npm install squareup
    npm install @types/squareup
  `,
  
  basicSetup: `
    // 1. Initialize Square Client
    import { Client, Environment } from 'squareup';
    
    const squareClient = new Client({
      accessToken: process.env.SQUARE_ACCESS_TOKEN,
      environment: Environment.Sandbox // or Environment.Production
    });
  `,
  
  paymentProcessing: `
    // 2. Process Payment (Frontend Integration)
    const processSquarePayment = async (paymentData) => {
      try {
        const response = await fetch('/api/payments/square', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sourceId: paymentData.nonce, // From Square Payment Form
            amountMoney: {
              amount: orderTotal * 100, // Amount in cents
              currency: 'USD'
            },
            idempotencyKey: crypto.randomUUID(),
            billingAddress: formData.billingAddress,
            shippingAddress: formData.shippingAddress
          })
        });
        
        const result = await response.json();
        return result;
      } catch (error) {
        console.error('Payment processing error:', error);
        throw error;
      }
    };
  `,
  
  backendIntegration: `
    // 3. Backend Payment Processing (Node.js/Express)
    app.post('/api/payments/square', async (req, res) => {
      try {
        const { paymentsApi } = squareClient;
        
        const requestBody = {
          sourceId: req.body.sourceId,
          amountMoney: req.body.amountMoney,
          idempotencyKey: req.body.idempotencyKey,
          locationId: process.env.SQUARE_LOCATION_ID,
          billingAddress: req.body.billingAddress,
          shippingAddress: req.body.shippingAddress,
          note: 'One Barn AI - Horse Monitoring System'
        };
        
        const response = await paymentsApi.createPayment(requestBody);
        
        if (response.result) {
          // Payment successful
          res.json({
            success: true,
            paymentId: response.result.payment.id,
            receiptUrl: response.result.payment.receiptUrl
          });
        }
      } catch (error) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      }
    });
  `,
  
  frontendFormIntegration: `
    // 4. Square Payment Form Integration
    import { PaymentForm } from 'react-square-web-payments-sdk';
    
    const SquarePaymentForm = ({ onPaymentSuccess }) => {
      return (
        <PaymentForm
          applicationId={process.env.REACT_APP_SQUARE_APPLICATION_ID}
          locationId={process.env.REACT_APP_SQUARE_LOCATION_ID}
          cardTokenizeResponseReceived={async (token, verifiedBuyer) => {
            try {
              const result = await processSquarePayment({
                nonce: token.token,
                verifiedBuyer
              });
              
              if (result.success) {
                onPaymentSuccess(result);
              }
            } catch (error) {
              // Handle payment error
            }
          }}
        >
          <CreditCard />
        </PaymentForm>
      );
    };
  `
};

// Integration Complexity Assessment
export const integrationAssessment = {
  timeToImplement: {
    square: '2-4 hours',
    stripe: '3-5 hours',
    paypal: '4-6 hours',
    authorize_net: '6-8 hours'
  },
  
  codeChangesRequired: {
    square: 'Minimal - mostly configuration',
    stripe: 'Minimal - mostly configuration',
    paypal: 'Moderate - some custom logic',
    authorize_net: 'Moderate - more integration work'
  },
  
  testingComplexity: {
    square: 'Easy - excellent sandbox environment',
    stripe: 'Easy - comprehensive test tools',
    paypal: 'Medium - good testing tools',
    authorize_net: 'Medium - adequate testing environment'
  },
  
  ongoingMaintenance: {
    square: 'Low - stable APIs',
    stripe: 'Low - excellent documentation',
    paypal: 'Medium - occasional API changes',
    authorize_net: 'Medium - traditional approach'
  }
};

// Helper function to get processor configuration
export const getPaymentProcessor = (processorId: string): IPaymentProcessor | null => {
  return paymentProcessors[processorId] || null;
};

// Helper function to check if processor supports method
export const supportsPaymentMethod = (processorId: string, method: string): boolean => {
  const processor = getPaymentProcessor(processorId);
  return processor ? processor.supportedMethods.includes(method as any) : false;
};

// Current processor configuration (easily switchable)
export const currentProcessor = paymentProcessors.square; // Change this to switch processors 