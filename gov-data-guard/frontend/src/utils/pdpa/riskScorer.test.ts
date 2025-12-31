import { calculateRiskScore } from './riskScorer';

describe('Risk Scorer', () => {
  it('should calculate score correctly for mixed data', () => {
    const data = [
      { id: '1234567890121', email: 'test@example.com', name: 'John Doe' }, // Valid ID, Valid Email
      { id: '1111111111111', email: 'invalid-email', phone: '0812345678' }  // Invalid ID (checksum fail), Valid Phone
    ];

    // Row 1:
    // - ID: Valid (10 points)
    // - Email: Valid (5 points)
    // Row 2:
    // - ID: Invalid (0 points)
    // - Phone: Valid (5 points)

    // Total: 20 points

    const result = calculateRiskScore(data);
    expect(result.score).toBe(20);
    expect(result.findings).toHaveLength(3);

    const idFinding = result.findings.find(f => f.type === 'Thai National ID');
    expect(idFinding?.count).toBe(1);

    const emailFinding = result.findings.find(f => f.type === 'Email');
    expect(emailFinding?.count).toBe(1);

    const phoneFinding = result.findings.find(f => f.type === 'Phone Number');
    expect(phoneFinding?.count).toBe(1);
  });

  it('should cap score at 100', () => {
    // 11 valid IDs = 110 points -> Cap at 100
    const data = Array(11).fill({ id: '1234567890121' });
    const result = calculateRiskScore(data);
    expect(result.score).toBe(100);
  });
});
