/**
 * Environment Configuration Validator
 * Helps users verify their API keys and environment setup
 */

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

interface ProviderStatus {
  name: string;
  configured: boolean;
  keyFormat: boolean;
  enabled: boolean;
}

export class EnvironmentValidator {
  
  /**
   * Validate all AI provider configurations
   */
  static validateAIProviders(): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      recommendations: []
    };

    const providers = this.checkProviders();
    
    // Check if at least one provider is properly configured
    const configuredProviders = providers.filter(p => p.configured && p.enabled);
    
    if (configuredProviders.length === 0) {
      result.isValid = false;
      result.errors.push('No AI providers are properly configured. At least one provider (OpenAI or Anthropic) is required.');
      result.recommendations.push('Copy example.env to .env and add your API keys');
      result.recommendations.push('Get OpenAI API key from: https://platform.openai.com/api-keys');
      result.recommendations.push('Get Anthropic API key from: https://console.anthropic.com/');
    } else if (configuredProviders.length === 1) {
      result.warnings.push('Only one AI provider configured. Consider adding a second provider for redundancy.');
    }

    // Check each provider individually
    providers.forEach(provider => {
      if (provider.enabled && !provider.configured) {
        result.errors.push(`${provider.name} is enabled but not configured properly`);
      }
      
      if (provider.configured && !provider.keyFormat) {
        result.warnings.push(`${provider.name} API key format may be incorrect`);
      }
    });

    return result;
  }

  /**
   * Check the status of all providers
   */
  static checkProviders(): ProviderStatus[] {
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
    const grokKey = import.meta.env.VITE_GROK_API_KEY || '';

    return [
      {
        name: 'OpenAI',
        configured: openaiKey.length > 0 && openaiKey !== 'your_openai_api_key_here',
        keyFormat: openaiKey.startsWith('sk-') || openaiKey === '',
        enabled: true
      },
      {
        name: 'Anthropic',
        configured: anthropicKey.length > 0 && anthropicKey !== 'your_anthropic_api_key_here',
        keyFormat: anthropicKey.startsWith('sk-ant-') || anthropicKey === '',
        enabled: true
      },
      {
        name: 'Grok',
        configured: grokKey.length > 0 && grokKey !== 'your_grok_api_key_here',
        keyFormat: true, // Grok key format not yet standardized
        enabled: false // Currently disabled
      }
    ];
  }

  /**
   * Get environment setup instructions
   */
  static getSetupInstructions(): string[] {
    return [
      '1. Copy example.env to .env: cp example.env .env',
      '2. Edit .env file with your actual API keys',
      '3. Get OpenAI API key from: https://platform.openai.com/api-keys',
      '4. Get Anthropic API key from: https://console.anthropic.com/',
      '5. Restart your development server: npm run dev',
      '6. Check the AI Dashboard to verify providers are working'
    ];
  }

  /**
   * Generate a formatted validation report
   */
  static generateReport(): string {
    const result = this.validateAIProviders();
    const providers = this.checkProviders();
    
    let report = '🔧 AI Provider Configuration Report\n';
    report += '=' .repeat(50) + '\n\n';
    
    // Provider Status
    report += '📊 Provider Status:\n';
    providers.forEach(provider => {
      const status = provider.configured ? 
        (provider.keyFormat ? '✅ Configured' : '⚠️  Key Format Issue') : 
        (provider.enabled ? '❌ Missing Key' : '⏸️  Disabled');
      report += `  ${provider.name}: ${status}\n`;
    });
    
    report += '\n';
    
    // Errors
    if (result.errors.length > 0) {
      report += '❌ Errors:\n';
      result.errors.forEach(error => report += `  • ${error}\n`);
      report += '\n';
    }
    
    // Warnings
    if (result.warnings.length > 0) {
      report += '⚠️  Warnings:\n';
      result.warnings.forEach(warning => report += `  • ${warning}\n`);
      report += '\n';
    }
    
    // Recommendations
    if (result.recommendations.length > 0) {
      report += '💡 Recommendations:\n';
      result.recommendations.forEach(rec => report += `  • ${rec}\n`);
      report += '\n';
    }
    
    // Setup Instructions
    if (!result.isValid) {
      report += '🚀 Setup Instructions:\n';
      this.getSetupInstructions().forEach(instruction => {
        report += `  ${instruction}\n`;
      });
    }
    
    return report;
  }

  /**
   * Console log the validation report
   */
  static logReport(): void {
    console.log(this.generateReport());
  }

  /**
   * Check if demo mode should be enabled
   */
  static shouldEnableDemoMode(): boolean {
    const result = this.validateAIProviders();
    const demoMode = import.meta.env.VITE_AI_DEMO_MODE === 'true';
    
    return !result.isValid || demoMode;
  }
} 