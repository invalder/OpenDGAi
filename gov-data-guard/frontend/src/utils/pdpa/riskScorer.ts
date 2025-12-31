import { validateThaiNationalID, emailRegex, phoneRegex, addressRegex } from './validators';

interface RiskScoreResult {
  score: number;
  findings: {
    type: string;
    count: number;
  }[];
}

export const calculateRiskScore = (data: any[]): RiskScoreResult => {
  let totalPII = 0;
  const findingsMap = new Map<string, number>();

  // Helper to increment finding count
  const addFinding = (type: string) => {
    findingsMap.set(type, (findingsMap.get(type) || 0) + 1);
    totalPII++;
  };

  // Convert objects to strings for simple scanning or scan specific fields if structure is known.
  // For MVP, we'll iterate over values of each row.
  data.forEach(row => {
    Object.values(row).forEach(value => {
      const strVal = String(value);

      if (validateThaiNationalID(strVal)) {
        addFinding('Thai National ID');
      } else if (emailRegex.test(strVal)) {
        addFinding('Email');
      } else if (phoneRegex.test(strVal)) {
        addFinding('Phone Number');
      }
      // Address detection might be too broad with regex on short strings,
      // but for MVP we can check if it looks like a long string with address keywords
      else if (strVal.length > 20 && addressRegex.test(strVal)) {
        addFinding('Address');
      }
    });
  });

  // Simple scoring algorithm:
  // 0-100 scale.
  // IDs are high risk (10 points each).
  // Others are medium risk (5 points each).
  // Cap at 100.

  let rawScore = 0;
  findingsMap.forEach((count, type) => {
    if (type === 'Thai National ID') {
      rawScore += count * 10;
    } else {
      rawScore += count * 5;
    }
  });

  const score = Math.min(100, rawScore);

  const findings = Array.from(findingsMap.entries()).map(([type, count]) => ({ type, count }));

  return { score, findings };
};
