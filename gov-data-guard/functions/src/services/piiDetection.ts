// Placeholder for Gemini API integration
// In a real implementation, this would call the Google Gemini API

export interface PIIFinding {
  fieldName: string;
  rowNumber: number;
  piiType: string;
  confidence: number;
  sample: string;
  category: 'general' | 'sensitive';
}

export interface PIIDetectionResult {
  riskScore: number;
  findings: PIIFinding[];
}

// Regex patterns for Thai PII (shared with frontend logic ideally, but duplicated here for backend execution)
const PII_PATTERNS = {
  THAI_ID: {
    pattern: /\b\d{13}\b/,
    type: 'national_id',
    category: 'general',
  },
  EMAIL: {
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
    type: 'email',
    category: 'general',
  },
  PHONE: {
    pattern: /\b(0\d{8,9})\b/, // Basic Thai phone number
    type: 'phone',
    category: 'general',
  },
};

function validateThaiID(id: string): boolean {
  if (!/^\d{13}$/.test(id)) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(id.charAt(i)) * (13 - i);
  }
  const checksum = (11 - (sum % 11)) % 10;
  return checksum === parseInt(id.charAt(12));
}

export async function scanForPII(data: any[]): Promise<PIIDetectionResult> {
  const findings: PIIFinding[] = [];
  let totalPIICount = 0;

  // 1. Regex Scanning
  data.forEach((row, rowIndex) => {
    Object.entries(row).forEach(([fieldName, value]) => {
      const strValue = String(value);

      // Check Thai ID
      if (PII_PATTERNS.THAI_ID.pattern.test(strValue)) {
        if (validateThaiID(strValue)) {
           findings.push({
            fieldName,
            rowNumber: rowIndex,
            piiType: PII_PATTERNS.THAI_ID.type,
            confidence: 1.0,
            sample: strValue.replace(/(\d{5})\d{4}(\d{4})/, '$1****$2'),
            category: 'general',
          });
          totalPIICount++;
        }
      }

      // Check Email
      if (PII_PATTERNS.EMAIL.pattern.test(strValue)) {
         findings.push({
            fieldName,
            rowNumber: rowIndex,
            piiType: PII_PATTERNS.EMAIL.type,
            confidence: 0.9,
            sample: strValue.replace(/(.{2})[^@]+(@.+)/, '$1***$2'),
            category: 'general',
          });
          totalPIICount++;
      }

      // Check Phone
      if (PII_PATTERNS.PHONE.pattern.test(strValue)) {
         findings.push({
            fieldName,
            rowNumber: rowIndex,
            piiType: PII_PATTERNS.PHONE.type,
            confidence: 0.8,
            sample: strValue.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2'),
            category: 'general',
          });
          totalPIICount++;
      }
    });
  });

  // 2. Gemini Scanning (Stubbed)
  // In a real scenario, we would sample the data and send to Gemini here.
  // const geminiResults = await callGeminiAPI(data.slice(0, 10));
  // findings.push(...geminiResults);

  // 3. Risk Scoring
  const riskScore = Math.min(100, totalPIICount * 5); // Simple scoring logic

  return {
    riskScore,
    findings,
  };
}
