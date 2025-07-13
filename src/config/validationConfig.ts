// Validation Configuration for Registration Forms
// Prevents garbage data by implementing comprehensive validation rules

export interface IValidationRule {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  customValidator?: (value: any) => boolean;
  message: string;
}

export interface IValidationConfig {
  [key: string]: IValidationRule;
}

// Common regex patterns
export const VALIDATION_PATTERNS = {
  // Names - only letters, spaces, hyphens, apostrophes (no numbers or special chars)
  name: /^[A-Za-z\s\-'\.]{2,30}$/,
  
  // Email - comprehensive email validation
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  
  // Phone - flexible phone number formats
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  
  // Horse information
  horseName: /^[A-Za-z\s\-'\.]{2,30}$/,
  breed: /^[A-Za-z\s\-'\.]{2,50}$/,
  color: /^[A-Za-z\s\-'\.]{2,30}$/,
  
  // Age validation
  age: /^(?:[1-9]|[1-3][0-9]|40)$/, // 1-40 years for horses
};

// Validation rules for different form fields
export const VALIDATION_RULES: IValidationConfig = {
  firstName: {
    required: true,
    pattern: VALIDATION_PATTERNS.name,
    minLength: 2,
    maxLength: 30,
    message: "First name must be 2-30 characters, letters only (no numbers or special characters)"
  },
  
  lastName: {
    required: true,
    pattern: VALIDATION_PATTERNS.name,
    minLength: 2,
    maxLength: 30,
    message: "Last name must be 2-30 characters, letters only (no numbers or special characters)"
  },
  
  email: {
    required: true,
    pattern: VALIDATION_PATTERNS.email,
    message: "Please enter a valid email address (e.g., user@example.com)"
  },
  
  phone: {
    required: true,
    pattern: VALIDATION_PATTERNS.phone,
    message: "Please enter a valid phone number (10-16 digits)"
  },
  
  horseName: {
    required: true,
    pattern: VALIDATION_PATTERNS.horseName,
    minLength: 2,
    maxLength: 30,
    message: "Horse name must be 2-30 characters, letters only"
  },
  
  horseAge: {
    required: true,
    pattern: VALIDATION_PATTERNS.age,
    min: 1,
    max: 40,
    message: "Horse age must be between 1 and 40 years"
  },
  
  breed: {
    required: true,
    pattern: VALIDATION_PATTERNS.breed,
    minLength: 2,
    maxLength: 50,
    message: "Breed must be 2-50 characters, letters only"
  },
  
  color: {
    required: true,
    pattern: VALIDATION_PATTERNS.color,
    minLength: 2,
    maxLength: 30,
    message: "Color must be 2-30 characters, letters only"
  },
  
  vetName: {
    required: true,
    pattern: VALIDATION_PATTERNS.name,
    minLength: 2,
    maxLength: 50,
    message: "Veterinarian name must be 2-50 characters, letters only"
  },
  
  emergencyName: {
    required: true,
    pattern: VALIDATION_PATTERNS.name,
    minLength: 2,
    maxLength: 50,
    message: "Emergency contact name must be 2-50 characters, letters only"
  },
  
  emergencyPhone: {
    required: true,
    pattern: VALIDATION_PATTERNS.phone,
    message: "Emergency contact phone must be a valid phone number"
  },
  
  emergencyRelationship: {
    required: true,
    pattern: VALIDATION_PATTERNS.name,
    minLength: 2,
    maxLength: 30,
    message: "Relationship must be 2-30 characters, letters only (e.g., Spouse, Parent, Friend)"
  },
  
  clinicName: {
    required: false,
    pattern: /^[A-Za-z0-9\s\-'\.&]{2,100}$/,
    minLength: 2,
    maxLength: 100,
    message: "Clinic name must be 2-100 characters with valid format"
  },
  
  // Additional horse fields
  markings: {
    required: false,
    pattern: /^[A-Za-z\s\-'\.]{0,100}$/,
    maxLength: 100,
    message: "Markings must be letters only, up to 100 characters"
  },
  
  showName: {
    required: false,
    pattern: VALIDATION_PATTERNS.horseName,
    minLength: 2,
    maxLength: 50,
    message: "Show name must be 2-50 characters, letters only"
  }
};

// Custom validation functions
export const CUSTOM_VALIDATORS = {
  // Check if string is not just garbage characters
  notGarbageText: (text: string): boolean => {
    const trimmedText = text.trim().toLowerCase();
    
    // Only prevent obvious garbage patterns - be less restrictive
    const garbagePatterns = [
      /^(.)\1+$/,          // Repeated characters (aaaa, bbbb, ccc)
      /^[0-9]+$/,          // Only numbers (123, 456)
      /^[a-z]+[0-9]+$/i,   // Letters followed by numbers (test123)
      /^[0-9]+[a-z]+$/i,   // Numbers followed by letters (123test)
      /^demo$/i,           // demo
      /^sample$/i,         // sample
      /^example$/i,        // example
      /^placeholder$/i,    // placeholder
      /^temp$/i,           // temp
      /^fake$/i,           // fake
      /^dummy$/i           // dummy
    ];
    
    // Specific keyboard sequences that are obviously garbage
    const keyboardSequences = [
      'qwerty', 'asdf', 'zxcv', 'qwe', 'asd', 'zxc',
      'qwer', 'asdfg', 'zxcvb', 'wert', 'sdfg', 'xcvb',
      'erty', 'dfgh', 'cvbn', 'rty', 'fgh', 'vbn',
      'tyu', 'ghj', 'bnm', 'yui', 'hjk', 'nmk',
      'uio', 'jkl', 'mkl', 'iop', 'klm'
    ];
    
    // Check if it's an exact keyboard sequence match
    const isKeyboardSequence = keyboardSequences.some(seq => 
      trimmedText === seq
    );
    
    if (isKeyboardSequence) return false;
    
    // Check for obvious test patterns
    const testPatterns = [
      /^test$/i,           // test
      /^abc$/i,            // abc (only if exact match)
      /^xyz$/i,            // xyz (only if exact match)
      /^123$/i             // 123 (only if exact match)
    ];
    
    const isTestPattern = testPatterns.some(pattern => pattern.test(trimmedText));
    if (isTestPattern) return false;
    
    return !garbagePatterns.some(pattern => pattern.test(trimmedText));
  }
};

// Main validation function
export const validateField = (
  fieldName: string, 
  value: any, 
  customRule?: IValidationRule
): { isValid: boolean; message: string } => {
  const rule = customRule || VALIDATION_RULES[fieldName];
  
  if (!rule) {
    return { isValid: true, message: '' };
  }
  
  // Check if field is required
  if (rule.required && (!value || value.toString().trim() === '')) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  // If value is empty and not required, it's valid
  if (!value || value.toString().trim() === '') {
    return { isValid: true, message: '' };
  }
  
  const stringValue = value.toString().trim();
  
  // Check against regex pattern
  if (rule.pattern && !rule.pattern.test(stringValue)) {
    return { isValid: false, message: rule.message };
  }
  
  // Additional garbage text check for name, color, breed, clinic, relationship, and markings fields
  if (fieldName.includes('Name') || fieldName.includes('name') || 
      fieldName === 'color' || fieldName === 'breed' || 
      fieldName === 'emergencyRelationship' || fieldName === 'clinicName' || 
      fieldName === 'markings') {
    if (!CUSTOM_VALIDATORS.notGarbageText(stringValue)) {
      return { isValid: false, message: 'Please enter a valid value (not test data like "asdf")' };
    }
  }
  
  return { isValid: true, message: '' };
};
