import { validateThaiNationalID, emailRegex, phoneRegex } from './validators';

describe('PDPA Validators', () => {
  describe('validateThaiNationalID', () => {
    it('should return true for a valid Thai National ID', () => {
      // Example valid ID (generated for testing purposes, checksum correct)
      // 1-2345-67890-12-1
      // Sum: 1*13 + 2*12 + 3*11 + 4*10 + 5*9 + 6*8 + 7*7 + 8*6 + 9*5 + 0*4 + 1*3 + 2*2 =
      // 13 + 24 + 33 + 40 + 45 + 48 + 49 + 48 + 45 + 0 + 3 + 4 = 352
      // 352 % 11 = 0
      // 11 - 0 = 11
      // 11 % 10 = 1. Last digit is 1. Correct.
      expect(validateThaiNationalID('1234567890121')).toBe(true);
    });

    it('should return false for an ID with invalid checksum', () => {
      expect(validateThaiNationalID('1234567890123')).toBe(false);
    });

    it('should return false for non-numeric strings', () => {
      expect(validateThaiNationalID('abcdefghijklm')).toBe(false);
    });

    it('should return false for invalid length', () => {
      expect(validateThaiNationalID('123')).toBe(false);
    });
  });

  describe('emailRegex', () => {
    it('should match valid emails', () => {
      expect(emailRegex.test('test@example.com')).toBe(true);
      expect(emailRegex.test('user.name@domain.co.th')).toBe(true);
    });

    it('should not match invalid emails', () => {
      expect(emailRegex.test('testexample.com')).toBe(false);
      expect(emailRegex.test('test@')).toBe(false);
    });
  });

  describe('phoneRegex', () => {
    it('should match valid Thai phone numbers', () => {
      expect(phoneRegex.test('0812345678')).toBe(true);
      expect(phoneRegex.test('02-123-4567')).toBe(true);
    });
  });
});
